import { useId, type CSSProperties } from "react";

const FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";

function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

type SvgProps = { className?: string; style?: CSSProperties };

/* ───────────────────────── ONE wordmark ───────────────────────── */
function LogoPaths() {
  return (
    <>
      <ellipse cx="19" cy="22" rx="17.5" ry="19" />
      <path d="M46 41V3l27 38V3" />
      <path d="M83 9.5L89.5 3V41M89.5 3H104M89.5 22H101M89.5 41H104" />
    </>
  );
}

export function OneLogo({ className, style, color = "#fff", weight = 3.2 }: SvgProps & { color?: string; weight?: number }) {
  return (
    <svg
      viewBox="-3 -2 110 48"
      className={className}
      style={{ aspectRatio: "110 / 48", ...style }}
      fill="none"
      stroke={color}
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="ONE"
    >
      <LogoPaths />
    </svg>
  );
}

/* ───────────────────────── Shared bits ───────────────────────── */
function Badge({
  x,
  y,
  big,
  small,
  fill,
  text,
  ring,
  r = 13,
}: {
  x: number;
  y: number;
  big: string;
  small: string;
  fill: string;
  text: string;
  ring?: string;
  r?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} fontFamily={FONT}>
      <circle r={r} fill={fill} stroke={ring ?? "none"} strokeWidth={ring ? 1.6 : 0} />
      <text y={r * 0.05} textAnchor="middle" fontSize={r * 0.8} fontWeight={800} fill={text}>
        {big}
      </text>
      <text y={r * 0.52} textAnchor="middle" fontSize={r * 0.33} fontWeight={700} fill={text} letterSpacing="0.3">
        {small}
      </text>
    </g>
  );
}

function Cup({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-23 -6L23 -6L18 15L-18 15Z" fill="#5a2c12" />
      {[-18, -12, -6, 0, 6, 12, 18].map((i) => (
        <path key={i} d={`M${i} -6L${(i * 0.78).toFixed(2)} 15`} stroke="#3e1d0a" strokeWidth="1.3" />
      ))}
      <ellipse cy="-6" rx="23" ry="6.5" fill="#7b4321" />
      <ellipse cy="-6.6" rx="17" ry="4.4" fill="#dc9b4c" />
      <ellipse cx="-4" cy="-8" rx="6" ry="1.4" fill="#f4c983" opacity="0.75" />
    </g>
  );
}

/* ───────────────────────── Protein bar ───────────────────────── */
export type BarVariant = "hershey" | "reese" | "maple" | "almond" | "birthday";

const BODY = "M14 6Q150 -2 286 6L289 50L286 94Q150 102 14 94L11 50Z";

function crimpPath(side: "l" | "r") {
  const y0 = 11;
  const y1 = 89;
  const n = 13;
  const step = (y1 - y0) / n;
  const X = (x: number) => (side === "l" ? x : 300 - x);
  let d = `M${X(16)} ${y0 - 2}L${X(2)} ${y0}`;
  for (let i = 0; i < n; i++) {
    d += `L${X(0)} ${(y0 + step * (i + 0.5)).toFixed(2)}L${X(2.4)} ${(y0 + step * (i + 1)).toFixed(2)}`;
  }
  return `${d}L${X(16)} ${y1 + 2}Z`;
}
const CRIMP_L = crimpPath("l");
const CRIMP_R = crimpPath("r");

type Palette = { stops: [string, string, string, string]; logo: string; outline: string; outlineW: number; logoW: number; dark: boolean };

const PALETTES: Record<BarVariant, Palette> = {
  hershey: { stops: ["#8be0ff", "#33b9f2", "#159ae0", "#0a6db2"], logo: "#ffffff", outline: "#0c2f5c", outlineW: 10.5, logoW: 6.2, dark: true },
  reese: { stops: ["#ffc67e", "#ff9a34", "#f7790f", "#c25006"], logo: "#ffffff", outline: "#6e2604", outlineW: 10.5, logoW: 6.2, dark: true },
  maple: { stops: ["#ffffff", "#fbfbfb", "#efefef", "#d2d2d2"], logo: "#f58a1f", outline: "#d4680d", outlineW: 8.2, logoW: 6.4, dark: false },
  almond: { stops: ["#ffffff", "#fbfbfb", "#efefef", "#d2d2d2"], logo: "#4f9e22", outline: "#357512", outlineW: 8.2, logoW: 6.4, dark: false },
  birthday: { stops: ["#ffffff", "#fbfbfb", "#efefef", "#d2d2d2"], logo: "#2f9be8", outline: "#1b70b8", outlineW: 8.2, logoW: 6.4, dark: false },
};

const COOKIE_BITS: [number, number, number][] = [
  [8, 14, 2.4], [18, 20, 1.8], [27, 12, 2.6], [36, 22, 2], [45, 15, 2.2], [55, 21, 2.6],
  [63, 13, 1.8], [70, 22, 2], [13, 24, 1.6], [50, 26, 1.5], [31, 26, 1.7],
];

function HersheyArt() {
  return (
    <g fontFamily={FONT}>
      <text x="25" y="80" fontSize="19" fontWeight={800} fill="#3a1206" letterSpacing="0.5">
        HERSHEY'S
      </text>
      <text x="110" y="71.5" fontSize="9.5" fontWeight={700} fontStyle="italic" fill="#fff">
        cookies
      </text>
      <text x="110" y="81" fontSize="9.5" fontWeight={700} fontStyle="italic" fill="#fff">
        ’n’ creme
      </text>
      <text x="25" y="90.5" fontSize="5.4" fontWeight={700} fill="#e6f6ff" letterSpacing="0.7">
        FLAVORED WITH OTHER NATURAL FLAVORS
      </text>
      <g transform="translate(158 42) rotate(-7)">
        <rect width="76" height="31" rx="6" fill="#d6c8b3" />
        <rect y="2" width="76" height="26" rx="6" fill="#f1e7d7" />
        <rect y="2" width="76" height="8" rx="4" fill="#fbf6ec" />
        {COOKIE_BITS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#2a170d" />
        ))}
      </g>
      <g transform="translate(240 70)">
        <circle r="15" fill="#22120a" />
        <circle r="11.5" fill="none" stroke="#3d2416" strokeWidth="1.4" strokeDasharray="2.2 2" />
        <circle r="5" fill="none" stroke="#3d2416" strokeWidth="1.2" />
      </g>
      <g transform="translate(266 80)">
        <circle r="12.5" fill="#2b170d" />
        <circle r="9.5" fill="none" stroke="#462a19" strokeWidth="1.2" strokeDasharray="2 2" />
      </g>
      <text x="158" y="91" fontSize="6" fontWeight={800} fill="#fff" letterSpacing="0.6">
        PROTEIN BAR
      </text>
      <Badge x={230} y={25} big="18G" small="PROTEIN" fill="#3b1a0e" text="#fff" ring="#fff" />
      <Badge x={260} y={30} big="3G" small="SUGAR" fill="#fff" text="#0b3a66" r={11.5} />
    </g>
  );
}

function ReeseArt() {
  return (
    <g fontFamily={FONT}>
      <text
        x="24"
        y="82"
        fontSize="25"
        fontWeight={800}
        fontStyle="italic"
        fill="#4a1505"
        stroke="#ffd447"
        strokeWidth="2.6"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke" }}
      >
        Reese's
      </text>
      <text x="25" y="91" fontSize="5.4" fontWeight={700} fill="#fff3e6" letterSpacing="0.7">
        PEANUT BUTTER • FLAVORED PROTEIN BAR
      </text>
      <g transform="translate(150 46) rotate(-5)">
        <rect width="62" height="28" rx="5" fill="#5c2f15" />
        <rect y="8" width="62" height="10" fill="#d9974a" />
        <rect width="62" height="8" rx="4" fill="#7a4221" />
        <path d="M4 3Q12 0 20 3T36 3T52 3" stroke="#9a5a2e" strokeWidth="1.2" fill="none" />
      </g>
      <Cup x={232} y={66} />
      <Cup x={266} y={79} k={0.72} />
      <Badge x={230} y={25} big="18G" small="PROTEIN" fill="#3b1a0e" text="#fff" ring="#fff" />
      <Badge x={260} y={30} big="3G" small="SUGAR" fill="#fff" text="#7a2c05" r={11.5} />
    </g>
  );
}

const WHITE_INFO: Record<"maple" | "almond" | "birthday", { name: string; accent: string }> = {
  maple: { name: "Maple Glazed Doughnut", accent: "#f58a1f" },
  almond: { name: "Chocolate Almond Bliss", accent: "#4f9e22" },
  birthday: { name: "Birthday Cake", accent: "#2f9be8" },
};

const SPRINKLES: [number, number, string, number][] = [
  [150, 20, "#ff5ea8", 30], [176, 86, "#ffd23f", -20], [204, 15, "#3cc0ff", 60], [140, 62, "#ff8a3d", -45],
  [124, 16, "#a66bff", 25], [196, 60, "#7bd36b", 12], [168, 40, "#ff5ea8", -60], [112, 88, "#3cc0ff", 40],
];

function WhiteArt({ v }: { v: "maple" | "almond" | "birthday" }) {
  const info = WHITE_INFO[v];
  return (
    <g fontFamily={FONT}>
      {v === "birthday" &&
        SPRINKLES.map(([x, y, c, r], i) => (
          <rect key={i} x={x} y={y} width="7" height="2.4" rx="1.2" fill={c} transform={`rotate(${r} ${x + 3.5} ${y + 1.2})`} />
        ))}
      <text x="25" y="75" fontSize="11" fontWeight={700} fill="#4b3b33">
        {info.name}
      </text>
      <text x="25" y="86" fontSize="5.4" fontWeight={700} fill="#a0948c" letterSpacing="0.7">
        FLAVORED PROTEIN BAR • NET WT 2.12 OZ
      </text>
      {v === "maple" && (
        <g transform="translate(232 70)">
          <circle r="17" fill="#c9883f" />
          <circle r="14" fill="#f2c27b" />
          <path d="M-12 -4Q0 -14 12 -4" stroke="#fff3d6" strokeWidth="2" fill="none" opacity="0.85" />
          <circle r="5" fill="#fff" />
          <circle r="5" fill="none" stroke="#c9883f" strokeWidth="1.5" />
        </g>
      )}
      {v === "almond" && (
        <g transform="translate(232 70)">
          <rect x="-20" y="-6" width="24" height="18" rx="3" fill="#5a3220" />
          <rect x="-20" y="-6" width="24" height="5" rx="2" fill="#734530" />
          <ellipse cx="10" cy="-2" rx="10" ry="5.5" fill="#a8693a" transform="rotate(-30 10 -2)" />
          <ellipse cx="14" cy="10" rx="9" ry="5" fill="#b9773f" transform="rotate(20 14 10)" />
          <path d="M5 -5Q10 -3 15 0" stroke="#d29a63" strokeWidth="1" fill="none" />
        </g>
      )}
      {v === "birthday" && (
        <g transform="translate(222 84)">
          <path d="M0 0L36 -8L36 4L0 12Z" fill="#f6e3b5" />
          <path d="M0 0L36 -8L36 -3L0 5Z" fill="#ffffff" />
          <path d="M0 0L36 -8L30 -24Z" fill="#fff5e0" />
          <circle cx="12" cy="-6" r="1.2" fill="#ff5ea8" />
          <circle cx="20" cy="-11" r="1.2" fill="#3cc0ff" />
          <circle cx="26" cy="-6" r="1.2" fill="#ffd23f" />
        </g>
      )}
      <Badge x={232} y={27} big="20G" small="PROTEIN" fill={info.accent} text="#fff" />
      <Badge x={262} y={33} big="1G" small="SUGAR" fill="#fff" text="#7a6a62" ring="#d8d0ca" r={11} />
    </g>
  );
}

export function ProteinBar({ variant, className, style }: SvgProps & { variant: BarVariant }) {
  const id = useSvgId("pb");
  const p = PALETTES[variant];
  return (
    <svg viewBox="0 0 300 100" className={className} style={{ aspectRatio: "3 / 1", ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.stops[0]} />
          <stop offset="0.2" stopColor={p.stops[1]} />
          <stop offset="0.62" stopColor={p.stops[2]} />
          <stop offset="1" stopColor={p.stops[3]} />
        </linearGradient>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={p.dark ? 0.3 : 0.14} />
          <stop offset="0.07" stopColor="#000" stopOpacity="0" />
          <stop offset="0.93" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={p.dark ? 0.32 : 0.16} />
        </linearGradient>
        <pattern id={`${id}c`} width="3.2" height="100" patternUnits="userSpaceOnUse">
          <rect width="1.6" height="100" fill="#fff" opacity={p.dark ? 0.26 : 0.7} />
          <rect x="1.6" width="1.6" height="100" fill="#000" opacity={p.dark ? 0.16 : 0.09} />
        </pattern>
        <clipPath id={`${id}k`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      <path d={CRIMP_L} fill={`url(#${id}g)`} />
      <path d={CRIMP_L} fill={`url(#${id}c)`} />
      <path d={CRIMP_R} fill={`url(#${id}g)`} />
      <path d={CRIMP_R} fill={`url(#${id}c)`} />
      <path d={BODY} fill={`url(#${id}g)`} />

      <g clipPath={`url(#${id}k)`}>
        {variant === "hershey" && <HersheyArt />}
        {variant === "reese" && <ReeseArt />}
        {(variant === "maple" || variant === "almond" || variant === "birthday") && <WhiteArt v={variant} />}

        <g transform="translate(22 9) scale(1.05)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke={p.outline} strokeWidth={p.outlineW}>
            <LogoPaths />
          </g>
          <g stroke={p.logo} strokeWidth={p.logoW}>
            <LogoPaths />
          </g>
        </g>

        <path d="M14 7Q150 -1 286 7L286 22Q150 15 14 22Z" fill="#fff" opacity={p.dark ? 0.32 : 0.75} />
        <path d="M14 82Q150 90 286 82L286 96Q150 104 14 96Z" fill="#000" opacity={p.dark ? 0.16 : 0.06} />
        <rect width="300" height="100" fill={`url(#${id}e)`} />
        <path d="M24 12L34 30M268 70L278 88M30 74L22 90M272 12L262 28" stroke="#fff" strokeWidth="1.4" opacity="0.3" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Retail carton ───────────────────────── */
export function ProteinBox({ side = "right", className, style }: SvgProps & { side?: "left" | "right" }) {
  const id = useSvgId("bx");
  const fx = side === "right" ? 4 : 14;
  const topFace = side === "right" ? "4,13 14,3 146,3 136,13" : "14,13 4,3 136,3 146,13";
  const sideFace = side === "right" ? "136,13 146,3 146,102 136,112" : "14,13 4,3 4,102 14,112";
  return (
    <svg viewBox="0 0 150 112" className={className} style={{ aspectRatio: "150 / 112", ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa641" />
          <stop offset="0.55" stopColor="#f7780f" />
          <stop offset="1" stopColor="#d85e06" />
        </linearGradient>
        <clipPath id={`${id}k`}>
          <rect x={fx} y="13" width="132" height="99" rx="1.5" />
        </clipPath>
      </defs>
      <polygon points={sideFace} fill="#b54c06" />
      <polygon points={topFace} fill="#ffbe6c" />
      <rect x={fx} y="13" width="132" height="99" rx="1.5" fill={`url(#${id}f)`} />
      <g clipPath={`url(#${id}k)`} fontFamily={FONT}>
        <g transform={`translate(${fx + 8} 20) scale(0.62)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="#6e2604" strokeWidth="11">
            <LogoPaths />
          </g>
          <g stroke="#fff" strokeWidth="6.6">
            <LogoPaths />
          </g>
        </g>
        <text
          x={fx + 9}
          y="70"
          fontSize="17"
          fontWeight={800}
          fontStyle="italic"
          fill="#4a1505"
          stroke="#ffd447"
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ paintOrder: "stroke" }}
        >
          Reese's
        </text>
        <text x={fx + 9} y="80" fontSize="5" fontWeight={700} fill="#fff3e6" letterSpacing="0.6">
          PEANUT BUTTER CUP
        </text>
        <Cup x={fx + 100} y={86} k={0.95} />
        <Badge x={fx + 112} y={28} big="18G" small="PROTEIN" fill="#3b1a0e" text="#fff" ring="#fff" r={10.5} />
        <Badge x={fx + 113} y={52} big="3G" small="SUGAR" fill="#fff" text="#7a2c05" r={8.5} />
        <text x={fx + 9} y="104" fontSize="5.4" fontWeight={800} fill="#fff" letterSpacing="0.8">
          12 BARS • PROTEIN BAR
        </text>
        <rect x={fx} y="13" width="132" height="14" fill="#fff" opacity="0.14" />
        <path d={`M${fx} 13.6H${fx + 132}`} stroke="#ffd59a" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Crushed-ice platform ───────────────────────── */
const ICE_TOP =
  "M0 18L11 10L23 15L37 7L50 13L64 5L79 12L94 6L109 13L125 6L141 11L157 4L174 11L189 5L206 12L222 4L238 10L254 5L270 13L286 6L302 12L317 7L331 14L345 9";

export function IcePlatform({ className, style }: SvgProps) {
  const id = useSvgId("ice");
  return (
    <svg viewBox="0 0 345 70" className={className} style={{ aspectRatio: "345 / 70", ...style }} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#72d5fb" />
          <stop offset="0.35" stopColor="#3cb0ee" />
          <stop offset="1" stopColor="#1c86d2" />
        </linearGradient>
      </defs>
      <path d={`${ICE_TOP}V70H0Z`} fill={`url(#${id}g)`} />
      <g opacity="0.55" fill="#c4f1ff">
        <path d="M11 10L23 15L18 26Z" />
        <path d="M64 5L79 12L66 22Z" />
        <path d="M125 6L141 11L131 24Z" />
        <path d="M189 5L206 12L194 23Z" />
        <path d="M254 5L270 13L259 25Z" />
        <path d="M317 7L331 14L321 26Z" />
      </g>
      <g opacity="0.35" fill="#0f6db8">
        <path d="M23 15L37 7L35 30Z" />
        <path d="M94 6L109 13L101 33Z" />
        <path d="M157 4L174 11L165 31Z" />
        <path d="M222 4L238 10L229 30Z" />
        <path d="M286 6L302 12L294 32Z" />
      </g>
      <path d={ICE_TOP} fill="none" stroke="#dcf7ff" strokeWidth="1.3" opacity="0.85" />
      <path d="M20 40L60 30L95 44L140 33L180 46L230 34L270 45L320 36" fill="none" stroke="#fff" strokeOpacity="0.18" />
    </svg>
  );
}

/* ───────────────────────── Climber silhouette ───────────────────────── */
export function Climber({ className, style }: SvgProps) {
  return (
    <svg
      viewBox="0 0 70 120"
      className={className}
      style={{ aspectRatio: "70 / 120", ...style }}
      fill="#0e2143"
      stroke="#0e2143"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="40" cy="3.5" r="3.6" stroke="none" />
      <path d="M40 3L37 18L33 33" fill="none" strokeWidth="6" />
      <circle cx="26" cy="33" r="7.6" stroke="none" />
      <path d="M31 39C35 50 34 62 29 72" fill="none" strokeWidth="13" />
      <path d="M27 43L15 54L8 47" fill="none" strokeWidth="5.5" />
      <path d="M31 71L47 82L41 101" fill="none" strokeWidth="7.5" />
      <path d="M41 101L48 104" fill="none" strokeWidth="5" />
      <path d="M26 72L22 94L16 112" fill="none" strokeWidth="7.5" />
      <path d="M16 112L23 115" fill="none" strokeWidth="5" />
      <path d="M34 60q6 2 6 8" fill="none" strokeWidth="3" />
    </svg>
  );
}

/* ───────────────────────── Small props ───────────────────────── */
export function Peanut({ className, style }: SvgProps) {
  return (
    <svg viewBox="0 0 26 16" className={className} style={{ aspectRatio: "26 / 16", ...style }} aria-hidden>
      <path
        d="M2.5 8C2.5 3.6 7 1.8 10.4 3.8C11.6 4.5 12.4 4.6 13.6 3.8C17 1.6 23.5 3.4 23.5 8C23.5 12.6 17 14.4 13.6 12.2C12.4 11.4 11.6 11.5 10.4 12.2C7 14.2 2.5 12.4 2.5 8Z"
        fill="#d7a764"
      />
      <path d="M2.5 8C2.5 3.6 7 1.8 10.4 3.8C11.6 4.5 12.4 4.6 13.6 3.8C17 1.6 23.5 3.4 23.5 8" fill="none" stroke="#f0cf93" strokeWidth="1.2" opacity="0.85" />
      <g fill="#b8823f">
        {[[6, 7], [8, 10], [17, 6], [19, 9], [21, 7], [5, 9.5], [15, 10]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.7" />
        ))}
      </g>
    </svg>
  );
}

export function PinIcon({ className, style }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 16s5-4.6 5-8.6A5 5 0 0 0 7 7.4C7 11.4 12 16 12 16z" />
      <circle cx="12" cy="7.6" r="1.7" />
      <path d="M7.5 15.5C4.8 16.1 3 17.1 3 18.3c0 1.9 4 3.2 9 3.2s9-1.3 9-3.2c0-1.2-1.8-2.2-4.5-2.8" />
    </svg>
  );
}
