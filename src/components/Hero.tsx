import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BicepsFlexed, ChevronRight } from "lucide-react";
import { Cutout } from "./Cutout";
import { Climber, IcePlatform, Peanut, ProteinBar, ProteinBox, type BarVariant } from "./hero/art";
import { s, topA, EASE, COLORS, type CSSVars } from "../lib/scale";
import { cn } from "../utils/cn";

const COACH_OPTS = { tolerance: 16, softness: 22, lumaWeight: 0.5, holeFraction: 0.003 };

/* ───────────────────────── Ticket CTA ───────────────────────── */
type TicketProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  bg?: string;
  color?: string;
  h?: number;
  fs?: number;
  padL?: number;
  padR?: number;
  width?: number;
  gap?: number;
  shadow?: number;
  tooth?: number;
  shadowColor?: string;
  center?: boolean;
  className?: string;
};

export function TicketCTA({
  children,
  href,
  onClick,
  ariaLabel,
  bg = COLORS.yellow,
  color = COLORS.ink,
  h = 31,
  fs = 13,
  padL = 14,
  padR = 11,
  width,
  gap,
  shadow = 3.5,
  tooth = 3,
  shadowColor = "#0a1630",
  center = false,
  className,
}: TicketProps) {
  const wrap = { "--sx": s(shadow), "--sy": s(shadow), "--sc": shadowColor } as CSSVars;
  const inner = (
    <span
      className={cn("ticket flex items-center whitespace-nowrap font-condensed font-extrabold uppercase", center && "justify-center")}
      style={
        {
          "--t": s(tooth),
          background: bg,
          color,
          height: s(h),
          width: width ? s(width) : undefined,
          paddingLeft: s(padL),
          paddingRight: s(padR),
          fontSize: s(fs),
          gap: s(gap ?? fs * 0.45),
          letterSpacing: "0.02em",
        } as CSSVars
      }
    >
      {children}
    </span>
  );
  const cls = cn("shadow-wrap inline-block align-top", className);
  return href ? (
    <a href={href} aria-label={ariaLabel} className={cls} style={wrap}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls} style={wrap}>
      {inner}
    </button>
  );
}

/* ───────────────────────── Headline ───────────────────────── */
const lineVariants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

function Headline() {
  return (
    <div
      className="relative font-condensed uppercase text-white"
      style={{ fontSize: s(50), lineHeight: s(43), letterSpacing: "-0.02em" }}
    >
      <h1 className="sr-only">ONE Protein for everyone!</h1>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } } }}
      >
        <div aria-hidden className="overflow-hidden">
          <motion.div variants={lineVariants} className="whitespace-nowrap">
            <span className="font-extralight">One</span> <span className="font-extrabold">Protein</span>
          </motion.div>
        </div>
        <div className="flex items-center" style={{ height: s(43), gap: s(11) }}>
          <div aria-hidden className="overflow-hidden">
            <motion.div variants={lineVariants} className="font-extrabold">
              For
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.6 }}
            className="leading-none"
            style={{ letterSpacing: "normal" }}
          >
            <TicketCTA href="#flavors">
              Grab Your's
              <ChevronRight style={{ width: s(11), height: s(11) }} strokeWidth={3.2} />
            </TicketCTA>
          </motion.div>
        </div>
        <div aria-hidden className="overflow-hidden">
          <motion.div variants={lineVariants} className="whitespace-nowrap font-extrabold">
            Everyone!
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Copy block ───────────────────────── */
function HeroCopy() {
  return (
    <>
      <h2
        className="font-condensed font-extrabold uppercase italic"
        style={{ fontSize: s(22), lineHeight: 1, letterSpacing: "0.01em" }}
      >
        <span className="text-[#f6ea45]">20G</span> <span className="text-white">Protein</span>
      </h2>
      <p
        className="font-condensed font-medium text-white/85"
        style={{ marginTop: s(3.5), fontSize: s(10.5), lineHeight: s(14.5) }}
      >
        A premium protein bar to push <br />
        your limits, build strength, and <br />
        improve recovery.
      </p>
    </>
  );
}

/* ───────────────────────── Product card ───────────────────────── */
const CRUMBS: [number, number, number][] = [
  [5, 44, 4],
  [9, 52, 2.6],
  [4, 60, 3.2],
  [14, 47, 2],
  [12, 63, 2.4],
];

function ProductCard({ onAdd }: { onAdd: () => void }) {
  return (
    <article
      className="group relative transition-transform duration-500 ease-out hover:-translate-y-[calc(var(--s)*4)]"
      style={{ width: s(144), height: s(154) }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: s(7),
          background: "linear-gradient(180deg,#a9969b 0%,#9c888d 52%,#8e7a7f 100%)",
          boxShadow: `0 ${s(14)} ${s(28)} rgba(3,10,30,0.42)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 55% at 60% 28%, rgba(255,255,255,0.18), transparent 70%)" }}
        />
        {CRUMBS.map(([x, y, r], i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full bg-[#4a2c1f]"
            style={{ left: s(x), top: s(y), width: s(r), height: s(r) }}
          />
        ))}
        <div className="absolute" style={{ left: s(10), top: s(26), width: s(152), transform: "rotate(-7deg)" }}>
          <div className="transition-transform duration-500 ease-out group-hover:-translate-y-[calc(var(--s)*3)] group-hover:rotate-[3deg]">
            <ProteinBar variant="maple" className="bar-shadow block h-auto w-full" />
          </div>
        </div>
        <h3
          className="absolute whitespace-nowrap font-condensed font-extrabold uppercase text-white"
          style={{ left: s(12), top: s(86.5), fontSize: s(12.5), lineHeight: 1, letterSpacing: "0.01em" }}
        >
          One Protein Bars
        </h3>
        <p
          className="absolute whitespace-nowrap font-condensed font-medium text-white/90"
          style={{ left: s(12), top: s(102), fontSize: s(8.7), lineHeight: 1 }}
        >
          Maple Glazed Doughnut (12 Bars)
        </p>
        <div className="absolute" style={{ left: s(10), top: s(123) }}>
          <TicketCTA
            onClick={onAdd}
            bg="#fff"
            h={20}
            fs={8.5}
            width={120}
            padL={0}
            padR={0}
            gap={9}
            shadow={3}
            tooth={2.4}
            shadowColor="#0d1f3f"
            center
            ariaLabel="Add Maple Glazed Doughnut, 12 bars, to cart for $40.50"
          >
            <span>
              Add to Cart - <span className="text-[#ff6a1a]">$40.50</span>
            </span>
            <ChevronRight style={{ width: s(8), height: s(8) }} strokeWidth={3.4} />
          </TicketCTA>
        </div>
      </div>
      <Peanut
        className="pointer-events-none absolute transition-transform duration-500 ease-out group-hover:-translate-y-[calc(var(--s)*5)] group-hover:rotate-[18deg]"
        style={{ left: s(78), top: s(-8), width: s(24), transform: "rotate(22deg)" }}
      />
    </article>
  );
}

/* ───────────────────────── Product stack ───────────────────────── */
type StackBar = { variant: BarVariant; left: number; top: number; w: number; rot: number; delay: number; label: string };

const BARS: StackBar[] = [
  { variant: "hershey", left: 64.5, top: 163.5, w: 214, rot: -3, delay: 0.55, label: "Hershey's Cookies 'n' Creme protein bar" },
  { variant: "reese", left: 74, top: 82.5, w: 214, rot: 3, delay: 0.7, label: "Reese's Peanut Butter protein bar" },
  { variant: "hershey", left: 53, top: 18, w: 206, rot: -8, delay: 0.85, label: "Hershey's Cookies 'n' Creme protein bar" },
];

const BOXES = [
  { side: "right" as const, left: 168, w: 150, delay: 0.28 },
  { side: "left" as const, left: 32, w: 147, delay: 0.38 },
];

/** Local coordinate box: 345 × 392 design units. */
function StackArt() {
  return (
    <div className="relative h-full w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
        className="ice-fade absolute"
        style={{ left: 0, top: s(332), width: s(345) }}
      >
        <IcePlatform className="block h-auto w-full" />
      </motion.div>
      <div
        aria-hidden
        className="absolute rounded-[50%] bg-[#06122b]/45 blur-[6px]"
        style={{ left: s(36), top: s(338), width: s(276), height: s(14) }}
      />
      {BOXES.map((b) => (
        <motion.a
          key={b.side}
          href="#flavors"
          aria-label="Shop the Reese's Peanut Butter 12-bar box"
          initial={{ opacity: 0, y: -90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            y: { type: "spring", stiffness: 230, damping: 20, delay: b.delay },
            opacity: { duration: 0.3, delay: b.delay },
          }}
          className="absolute block"
          style={{ left: s(b.left), top: s(235), width: s(b.w) }}
        >
          <span className="lift block">
            <ProteinBox side={b.side} className="bar-shadow block h-auto w-full" />
          </span>
        </motion.a>
      ))}
      {BARS.map((b, i) => (
        <motion.a
          key={i}
          href="#flavors"
          aria-label={`Shop ${b.label}`}
          initial={{ opacity: 0, y: -140 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            y: { type: "spring", stiffness: 230, damping: 19, mass: 0.9, delay: b.delay },
            opacity: { duration: 0.3, delay: b.delay },
          }}
          className="absolute block"
          style={{ left: s(b.left), top: s(b.top), width: s(b.w) }}
        >
          <span className="lift block">
            <span className="block" style={{ transform: `rotate(${b.rot}deg)` }}>
              <ProteinBar variant={b.variant} className="bar-shadow block h-auto w-full" />
            </span>
          </span>
        </motion.a>
      ))}
    </div>
  );
}

/* ───────────────────────── People & props ───────────────────────── */
function CoachFigure({ className, style }: { className?: string; style?: CSSVars }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: EASE }}
      className={className}
      style={style}
    >
      <Cutout
        src="/images/coach.png"
        alt="Smiling fitness coach holding a ONE protein bar"
        options={COACH_OPTS}
        eager
        className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_28px_rgba(4,12,32,0.45)]"
      />
    </motion.div>
  );
}

function CoachBadge({ className, style }: { className?: string; style?: CSSVars }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, x: -16 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1 }}
      className={className}
      style={style}
    >
      <div
        className="badge-float flex items-center rounded-full bg-white shadow-[0_12px_26px_rgba(4,14,38,0.4)]"
        style={{ height: s(31), paddingLeft: s(2.5), paddingRight: s(13), gap: s(6.5) }}
      >
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-[#ff6a1a]"
          style={{ width: s(26), height: s(26) }}
        >
          <BicepsFlexed className="text-white" style={{ width: s(14), height: s(14) }} strokeWidth={2.4} />
        </span>
        <span
          className="whitespace-nowrap font-condensed font-extrabold uppercase text-[#10264f]"
          style={{ fontSize: s(11.5), letterSpacing: "0.04em" }}
        >
          Fitness Coach
        </span>
      </div>
    </motion.div>
  );
}

function ClimberFigure({ className, style }: { className?: string; style?: CSSVars }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <Climber className="climber block h-auto w-full opacity-90" />
    </motion.div>
  );
}

function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(55% 60% at 52% 64%, rgba(80,140,222,0.16), transparent 70%), radial-gradient(45% 55% at 8% 100%, rgba(8,18,46,0.35), transparent 70%)",
      }}
    />
  );
}

/* ───────────────────────── Layouts ───────────────────────── */
function DesktopHero({ onAdd }: { onAdd: () => void }) {
  return (
    <section
      aria-label="ONE Protein for everyone"
      className="relative overflow-hidden"
      style={{ background: COLORS.heroNavy, height: "max(calc(100vh - var(--s) * 48), calc(var(--s) * 411))" }}
    >
      <Backdrop />
      <div aria-hidden className="tire-band absolute inset-x-0" style={{ top: topA(177), height: s(75) }} />

      {/* 824-unit stage, centred */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: s(824) }}>
        <ClimberFigure className="absolute" style={{ left: s(557), top: s(-3), width: s(71) }} />

        <div className="absolute z-10" style={{ left: s(42), top: topA(46.5) }}>
          <Headline />
        </div>

        <CoachFigure className="absolute" style={{ left: s(18), bottom: s(-16), width: s(200), height: s(222) }} />
        <CoachBadge className="absolute z-10" style={{ left: s(122), bottom: s(71) }} />

        <div className="absolute" style={{ left: s(266), bottom: s(-21), width: s(345), height: s(392) }}>
          <StackArt />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="absolute z-10"
          style={{ left: s(642), top: topA(85), width: s(144) }}
        >
          <HeroCopy />
          <div style={{ marginTop: s(24.5) }}>
            <ProductCard onAdd={onAdd} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MobileHero({ onAdd }: { onAdd: () => void }) {
  return (
    <section
      aria-label="ONE Protein for everyone"
      className="relative overflow-hidden pt-10 sm:pt-14"
      style={{ background: COLORS.heroNavy }}
    >
      <Backdrop />
      <div
        aria-hidden
        className="tire-band absolute inset-x-0"
        style={{ top: "34%", height: "75px", "--s": "1px" } as CSSVars}
      />

      <div className="relative mx-auto grid max-w-3xl items-end gap-7 px-5 sm:grid-cols-[1.2fr_1fr] sm:px-8">
        <div style={{ "--s": "clamp(0.84px, calc(0.1018vw + 0.518px), 1.32px)" } as CSSVars}>
          <Headline />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="sm:pb-1"
          style={{ "--s": "clamp(1.3px, calc(0.12vw + 0.86px), 1.6px)" } as CSSVars}
        >
          <HeroCopy />
        </motion.div>
      </div>

      <div
        className="relative mx-auto mt-6"
        style={{ "--s": "min(calc((100vw - 24px) / 345), 1.5px)", width: s(345), height: s(402) } as CSSVars}
      >
        <StackArt />
      </div>

      <div className="relative mx-auto -mt-2 flex max-w-3xl items-end justify-center gap-3 px-4 sm:gap-10 sm:px-8">
        <div className="relative w-[46%] max-w-[340px]" style={{ height: "clamp(250px, 64vw, 440px)" }}>
          <CoachFigure className="absolute inset-0" />
          <CoachBadge
            className="absolute bottom-[16%] left-[22%] z-10"
            style={{ "--s": "clamp(0.95px, 0.26vw, 1.35px)" } as CSSVars}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10 shrink-0"
          style={{ "--s": "clamp(0.92px, 0.3vw, 1.6px)" } as CSSVars}
        >
          <ProductCard onAdd={onAdd} />
        </motion.div>
      </div>
    </section>
  );
}

export function Hero({ isDesktop, onAdd }: { isDesktop: boolean; onAdd: () => void }) {
  return isDesktop ? <DesktopHero onAdd={onAdd} /> : <MobileHero onAdd={onAdd} />;
}
