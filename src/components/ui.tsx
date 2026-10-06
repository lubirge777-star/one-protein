import { cn } from "../utils/cn";

const TOOTH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 6' preserveAspectRatio='none'%3E%3Cpath d='M0 0h12L6 6z'/%3E%3C/svg%3E")`;

/* ---------- ZigZag divider: `top` colour teeth hang down onto `bottom` ---------- */
export function ZigZag({
  top,
  bottom,
  size = 12,
  height = 6,
  className,
}: {
  top: string;
  bottom: string;
  size?: number;
  height?: number;
  className?: string;
}) {
  const mask = `${TOOTH} 0 0 / ${size}px ${height}px repeat-x`;
  return (
    <div aria-hidden className={cn("relative w-full", className)} style={{ height, background: bottom }}>
      <div className="absolute inset-0" style={{ background: top, WebkitMask: mask, mask }} />
    </div>
  );
}

/* ---------- Tire track pattern ---------- */
export function TireTracks({ className, opacity = 0.14, color = "#ffffff" }: { className?: string; opacity?: number; color?: string }) {
  const blocks = Array.from({ length: 46 });
  return (
    <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className={cn("pointer-events-none w-full", className)} style={{ opacity }} aria-hidden>
      <g fill={color}>
        {blocks.map((_, i) => (
          <g key={i}>
            <rect x={i * 27} y={8} width={16} height={7} rx={1.5} transform={`rotate(-18 ${i * 27 + 8} 11)`} />
            <rect x={i * 27} y={26} width={16} height={7} rx={1.5} transform={`rotate(-18 ${i * 27 + 8} 29)`} />
            <rect x={i * 27 + 4} y={56} width={16} height={7} rx={1.5} transform={`rotate(14 ${i * 27 + 12} 59)`} />
            <rect x={i * 27 + 4} y={74} width={16} height={7} rx={1.5} transform={`rotate(14 ${i * 27 + 12} 77)`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- Quality stamp ---------- */
export function QualityStamp({ dark = false, className }: { dark?: boolean; className?: string }) {
  const ring = dark ? "border-[#12294e] text-[#12294e]" : "border-white text-white";
  return (
    <div className={cn("relative flex h-24 w-24 items-center justify-center rounded-full border-[2.5px] sm:h-28 sm:w-28", ring, className)}>
      <div className={cn("absolute inset-[5px] rounded-full border-[1.5px] border-dashed", dark ? "border-[#12294e]/70" : "border-white/70")} />
      <div className="text-center leading-none">
        <div className="font-condensed text-[9px] font-bold tracking-[0.2em]">★★★</div>
        <div className="font-display mt-1 text-[13px] tracking-wide sm:text-[15px]">
          HIGH
          <br />
          QUALITY
        </div>
        <div className="font-condensed mt-1 text-[9px] font-bold tracking-[0.2em]">★★★</div>
      </div>
    </div>
  );
}

/* ---------- Section heading burst ---------- */
export function Burst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={cn("h-5 w-7", className)} aria-hidden>
      <g stroke="#ff6b1a" strokeWidth={3.2} strokeLinecap="round">
        <line x1="6" y1="20" x2="2" y2="12" />
        <line x1="16" y1="20" x2="16" y2="6" />
        <line x1="26" y1="20" x2="30" y2="10" />
      </g>
    </svg>
  );
}
