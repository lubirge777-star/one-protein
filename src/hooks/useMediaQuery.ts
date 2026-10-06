import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Desktop "design unit": 1 unit == 1px of the 824×459 reference frame.
 * Fits the header + hero composition to the viewport exactly (contain-fit),
 * excluding scrollbar width. Mobile layouts set their own local `--s`.
 */
export function useDesignScale() {
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const compute = () => {
      if (mq.matches) {
        const v = Math.max(0.95, Math.min(root.clientWidth / 824, window.innerHeight / 459, 2.3));
        root.style.setProperty("--s", `${v.toFixed(4)}px`);
      } else {
        root.style.removeProperty("--s");
      }
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("resize", schedule);
    mq.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
    };
  }, []);
}
