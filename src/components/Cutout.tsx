import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cutout, type CutoutOptions } from "../lib/cutout";
import { cn } from "../utils/cn";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type Props = {
  src: string;
  alt: string;
  options?: CutoutOptions;
  className?: string;
  style?: CSSProperties;
  /** Process immediately instead of when scrolled near the viewport. */
  eager?: boolean;
};

/**
 * Renders an image with its studio backdrop removed (processed client-side, cached).
 * Fades in once the transparent cut-out is ready; falls back to a soft-masked original.
 */
export function Cutout({ src, alt, options, className, style, eager = false }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<{ url: string; ok: boolean } | null>(null);
  const optionsKey = JSON.stringify(options ?? {});

  useEffect(() => {
    let alive = true;
    let io: IntersectionObserver | undefined;
    const opts = JSON.parse(optionsKey) as CutoutOptions;
    const run = () => {
      cutout(src, opts).then((r) => {
        if (alive) setState({ url: r.url, ok: r.ok });
      });
    };
    const el = ref.current;
    if (eager || !el || typeof IntersectionObserver === "undefined") {
      run();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            run();
          }
        },
        { rootMargin: "800px 0px" }
      );
      io.observe(el);
    }
    return () => {
      alive = false;
      io?.disconnect();
    };
  }, [src, optionsKey, eager]);

  return (
    <img
      ref={ref}
      src={state?.url ?? BLANK}
      alt={alt}
      draggable={false}
      decoding="async"
      className={cn(
        "select-none transition-opacity duration-700 ease-out",
        state ? "opacity-100" : "opacity-0",
        state && !state.ok && "mask-fade-sides",
        className
      )}
      style={style}
    />
  );
}
