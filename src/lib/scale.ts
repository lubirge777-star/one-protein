import type { CSSProperties } from "react";

/** CSS length in design units (see useDesignScale). */
export const s = (n: number) => `calc(var(--s) * ${n})`;

/** Top offset in a full-height stage; splits any extra viewport height evenly. */
export const topA = (n: number) => `calc(var(--s) * ${n} + (100% - var(--s) * 411) / 2)`;

export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export const EASE = [0.22, 1, 0.36, 1] as const;

export const COLORS = {
  headerBlue: "#3d8fd4",
  heroNavy: "#1d3563",
  ink: "#10264f",
  yellow: "#f9e84a",
  orange: "#ff6a1a",
};
