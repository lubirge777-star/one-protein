/**
 * Client-side background removal for studio shots on (near) solid backdrops.
 *
 * Pipeline
 *  1. Convert to YCbCr (chroma-weighted distance is far more robust than RGB).
 *  2. Build a smooth background model from the four image borders (Coons patch),
 *     rejecting border pixels that belong to the subject — handles gradients/vignettes.
 *  3. Score every pixel by its distance to the local background estimate.
 *  4. Flood-fill from the borders through background-like pixels (subject interiors that
 *     happen to match the backdrop are preserved), optionally clearing large enclosed holes.
 *  5. Soft alpha on the boundary, light edge smoothing, colour un-mixing to kill halos.
 *  6. Auto-trim to the subject bounding box.
 */

export type CutoutOptions = {
  /** Longest side used for processing (px). */
  maxSize?: number;
  /** Distance below which a pixel is fully background. */
  tolerance?: number;
  /** Extra distance range producing partial transparency. */
  softness?: number;
  /** Weight of luminance vs. chroma in the distance metric. */
  lumaWeight?: number;
  /** Remove enclosed background-coloured regions larger than this fraction of the image (0 = off). */
  holeFraction?: number;
  /** Crop transparent margins. */
  trim?: boolean;
};

export type CutoutResult = { url: string; width: number; height: number; ok: boolean };

const cache = new Map<string, Promise<CutoutResult>>();

export function cutout(src: string, options: CutoutOptions = {}): Promise<CutoutResult> {
  const key = `${src}|${JSON.stringify(options)}`;
  let job = cache.get(key);
  if (!job) {
    job = processImage(src, options).catch(() => ({ url: src, width: 0, height: 0, ok: false }));
    cache.set(key, job);
  }
  return job;
}

const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Cooperative scheduler: yields to the main thread every ~10ms of work. */
function createSlicer(budget = 10) {
  let last = performance.now();
  return async () => {
    if (performance.now() - last > budget) {
      await yieldToMain();
      last = performance.now();
    }
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function blur1D(a: Float32Array, r: number) {
  const n = a.length;
  if (n < 3 || r < 1) return;
  const ps = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) ps[i + 1] = ps[i] + a[i];
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - r);
    const hi = Math.min(n - 1, i + r);
    out[i] = (ps[hi + 1] - ps[lo]) / (hi - lo + 1);
  }
  a.set(out);
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

type Line = { y: Float32Array; u: Float32Array; v: Float32Array };

function toUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== "function") {
      resolve(canvas.toDataURL("image/png"));
      return;
    }
    canvas.toBlob(
      (blob) => resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png")),
      "image/webp",
      0.94
    );
  });
}

async function processImage(src: string, o: CutoutOptions): Promise<CutoutResult> {
  const img = await loadImage(src);
  const maxSize = o.maxSize ?? 1100;
  const tol = o.tolerance ?? 16;
  const soft = o.softness ?? 22;
  const lw = o.lumaWeight ?? 0.5;
  const holeFraction = o.holeFraction ?? 0.003;
  const trim = o.trim ?? true;

  const k = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const W = Math.max(8, Math.round(img.naturalWidth * k));
  const H = Math.max(8, Math.round(img.naturalHeight * k));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D unsupported");
  ctx.drawImage(img, 0, 0, W, H);
  const image = ctx.getImageData(0, 0, W, H);
  const px = image.data;
  const N = W * H;

  /* 1 ── YCbCr */
  const Y = new Float32Array(N);
  const U = new Float32Array(N);
  const V = new Float32Array(N);
  for (let i = 0, j = 0; i < N; i++, j += 4) {
    const r = px[j], g = px[j + 1], b = px[j + 2];
    Y[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    U[i] = -0.168736 * r - 0.331264 * g + 0.5 * b;
    V[i] = 0.5 * r - 0.418688 * g - 0.081312 * b;
  }

  const dist = (y1: number, u1: number, v1: number, y2: number, u2: number, v2: number) => {
    const du = u1 - u2;
    const dv = v1 - v2;
    const dy = (y1 - y2) * lw;
    return Math.sqrt(du * du + dv * dv + dy * dy);
  };

  /* 2 ── Robust border model */
  const inset = Math.min(2, Math.floor(Math.min(W, H) / 60));
  const sample = (len: number, idx: (t: number) => number): Line => {
    const line: Line = { y: new Float32Array(len), u: new Float32Array(len), v: new Float32Array(len) };
    for (let t = 0; t < len; t++) {
      const i = idx(t);
      line.y[t] = Y[i];
      line.u[t] = U[i];
      line.v[t] = V[i];
    }
    return line;
  };
  const top = sample(W, (x) => inset * W + x);
  const bottom = sample(W, (x) => (H - 1 - inset) * W + x);
  const left = sample(H, (y) => y * W + inset);
  const right = sample(H, (y) => y * W + (W - 1 - inset));
  const lines = [top, bottom, left, right];

  const median = (pick: (l: Line) => Float32Array) => {
    const all: number[] = [];
    for (const l of lines) {
      const a = pick(l);
      for (let t = 0; t < a.length; t += 2) all.push(a[t]);
    }
    all.sort((p, q) => p - q);
    return all[all.length >> 1] ?? 0;
  };
  const mY = median((l) => l.y);
  const mU = median((l) => l.u);
  const mV = median((l) => l.v);

  const reject = Math.max(40, (tol + soft) * 1.25);
  for (const line of lines) {
    const len = line.y.length;
    const valid = new Uint8Array(len);
    let count = 0;
    for (let t = 0; t < len; t++) {
      if (dist(line.y[t], line.u[t], line.v[t], mY, mU, mV) < reject) {
        valid[t] = 1;
        count++;
      }
    }
    if (count < len * 0.05) {
      line.y.fill(mY);
      line.u.fill(mU);
      line.v.fill(mV);
      continue;
    }
    // Interpolate across subject-occupied runs
    let prev = -1;
    for (let t = 0; t <= len; t++) {
      if (t < len && !valid[t]) continue;
      if (t - prev > 1) {
        const a = prev >= 0 ? prev : t;
        const b = t < len ? t : prev;
        for (let q = prev + 1; q < t; q++) {
          const f = a === b ? 0 : (q - a) / (b - a);
          line.y[q] = line.y[a] + (line.y[b] - line.y[a]) * f;
          line.u[q] = line.u[a] + (line.u[b] - line.u[a]) * f;
          line.v[q] = line.v[a] + (line.v[b] - line.v[a]) * f;
        }
      }
      prev = t;
    }
    const r = Math.max(2, Math.round(len / 80));
    blur1D(line.y, r);
    blur1D(line.u, r);
    blur1D(line.v, r);
  }

  const avg = (a: number, b: number) => (a + b) / 2;
  const cY = [avg(top.y[0], left.y[0]), avg(top.y[W - 1], right.y[0]), avg(bottom.y[0], left.y[H - 1]), avg(bottom.y[W - 1], right.y[H - 1])];
  const cU = [avg(top.u[0], left.u[0]), avg(top.u[W - 1], right.u[0]), avg(bottom.u[0], left.u[H - 1]), avg(bottom.u[W - 1], right.u[H - 1])];
  const cV = [avg(top.v[0], left.v[0]), avg(top.v[W - 1], right.v[0]), avg(bottom.v[0], left.v[H - 1]), avg(bottom.v[W - 1], right.v[H - 1])];
  const iw = 1 / (W - 1);
  const ih = 1 / (H - 1);
  const bg = new Float32Array(3);
  const bgAt = (x: number, y: number) => {
    const u = x * iw;
    const v = y * ih;
    const a00 = (1 - u) * (1 - v), a10 = u * (1 - v), a01 = (1 - u) * v, a11 = u * v;
    bg[0] = (1 - v) * top.y[x] + v * bottom.y[x] + (1 - u) * left.y[y] + u * right.y[y] - (a00 * cY[0] + a10 * cY[1] + a01 * cY[2] + a11 * cY[3]);
    bg[1] = (1 - v) * top.u[x] + v * bottom.u[x] + (1 - u) * left.u[y] + u * right.u[y] - (a00 * cU[0] + a10 * cU[1] + a01 * cU[2] + a11 * cU[3]);
    bg[2] = (1 - v) * top.v[x] + v * bottom.v[x] + (1 - u) * left.v[y] + u * right.v[y] - (a00 * cV[0] + a10 * cV[1] + a01 * cV[2] + a11 * cV[3]);
  };

  const slice = createSlicer();
  await yieldToMain();

  /* 3 ── Background likeness */
  const score = new Float32Array(N);
  for (let y = 0; y < H; y++) {
    if ((y & 15) === 0) await slice();
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      bgAt(x, y);
      score[i] = 1 - smoothstep(tol, tol + soft, dist(Y[i], U[i], V[i], bg[0], bg[1], bg[2]));
    }
  }

  /* 4 ── Flood fill from the borders */
  const isBg = new Uint8Array(N);
  const queue = new Int32Array(N);
  let qh = 0;
  let qt = 0;
  const push = (i: number) => {
    if (!isBg[i] && score[i] >= 0.5) {
      isBg[i] = 1;
      queue[qt++] = i;
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  const grow = () => {
    while (qh < qt) {
      const i = queue[qh++];
      const x = i % W;
      if (x > 0) push(i - 1);
      if (x < W - 1) push(i + 1);
      if (i >= W) push(i - W);
      if (i < N - W) push(i + W);
    }
  };
  grow();

  if (holeFraction > 0) {
    const minSize = Math.max(48, Math.round(N * holeFraction));
    const seen = new Uint8Array(N);
    const comp = new Int32Array(N);
    const strict = 0.92;
    for (let s0 = 0; s0 < N; s0++) {
      if (isBg[s0] || seen[s0] || score[s0] < strict) continue;
      let head = 0;
      let tail = 0;
      comp[tail++] = s0;
      seen[s0] = 1;
      while (head < tail) {
        const i = comp[head++];
        const x = i % W;
        if (x > 0) { const n = i - 1; if (!seen[n] && !isBg[n] && score[n] >= strict) { seen[n] = 1; comp[tail++] = n; } }
        if (x < W - 1) { const n = i + 1; if (!seen[n] && !isBg[n] && score[n] >= strict) { seen[n] = 1; comp[tail++] = n; } }
        if (i >= W) { const n = i - W; if (!seen[n] && !isBg[n] && score[n] >= strict) { seen[n] = 1; comp[tail++] = n; } }
        if (i < N - W) { const n = i + W; if (!seen[n] && !isBg[n] && score[n] >= strict) { seen[n] = 1; comp[tail++] = n; } }
      }
      if (tail >= minSize) {
        for (let t = 0; t < tail; t++) {
          const i = comp[t];
          if (!isBg[i]) {
            isBg[i] = 1;
            queue[qt++] = i;
          }
        }
        grow();
      }
    }
  }

  await yieldToMain();

  /* 5 ── Alpha matte */
  const A = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (isBg[i]) {
      A[i] = 1 - score[i];
      continue;
    }
    const x = i % W;
    const near =
      (x > 0 && isBg[i - 1] === 1) ||
      (x < W - 1 && isBg[i + 1] === 1) ||
      (i >= W && isBg[i - W] === 1) ||
      (i < N - W && isBg[i + W] === 1);
    A[i] = near ? 1 - score[i] : 1;
  }

  // 3×3 box blur, then keep the minimum → smooth, very slightly eroded edge (no fringe)
  const tmp = new Float32Array(N);
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const i = row + x;
      const l = x > 0 ? A[i - 1] : A[i];
      const r = x < W - 1 ? A[i + 1] : A[i];
      tmp[i] = (l + A[i] + r) / 3;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const u = y > 0 ? tmp[i - W] : tmp[i];
      const d = y < H - 1 ? tmp[i + W] : tmp[i];
      const b = (u + tmp[i] + d) / 3;
      if (b < A[i]) A[i] = b;
    }
  }

  /* 6 ── Un-mix edge colours + write alpha */
  let transparent = 0;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) {
    if ((y & 15) === 0) await slice();
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const j = i * 4;
      const a = A[i];
      if (a < 0.5) transparent++;
      if (a > 0.02 && a < 0.995) {
        bgAt(x, y);
        const br = bg[0] + 1.402 * bg[2];
        const bgG = bg[0] - 0.344136 * bg[1] - 0.714136 * bg[2];
        const bb = bg[0] + 1.772 * bg[1];
        const ae = Math.max(a, 0.35);
        const m = 1 - ae;
        px[j] = clamp255((px[j] - m * br) / ae);
        px[j + 1] = clamp255((px[j + 1] - m * bgG) / ae);
        px[j + 2] = clamp255((px[j + 2] - m * bb) / ae);
      }
      const alpha = Math.round(a * 255);
      px[j + 3] = alpha;
      if (alpha > 14) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const fraction = transparent / N;
  if (maxX < 0 || fraction < 0.03 || fraction > 0.97) throw new Error("Implausible matte");

  ctx.putImageData(image, 0, 0);
  let out: HTMLCanvasElement = canvas;
  if (trim) {
    const pad = 2;
    const x0 = Math.max(0, minX - pad);
    const y0 = Math.max(0, minY - pad);
    const x1 = Math.min(W - 1, maxX + pad);
    const y1 = Math.min(H - 1, maxY + pad);
    const cw = x1 - x0 + 1;
    const ch = y1 - y0 + 1;
    const cropped = document.createElement("canvas");
    cropped.width = cw;
    cropped.height = ch;
    const cctx = cropped.getContext("2d");
    if (cctx) {
      cctx.drawImage(canvas, x0, y0, cw, ch, 0, 0, cw, ch);
      out = cropped;
    }
  }

  const url = await toUrl(out);
  return { url, width: out.width, height: out.height, ok: true };
}
