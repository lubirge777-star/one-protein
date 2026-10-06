import { useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ChevronRight, ShoppingCart, Bike, Leaf, Waves } from "lucide-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Cutout } from "./components/Cutout";
import { OneLogo, ProteinBar, type BarVariant } from "./components/hero/art";
import { ZigZag, TireTracks, QualityStamp, Burst } from "./components/ui";
import { useDesignScale, useMediaQuery } from "./hooks/useMediaQuery";
import { COLORS } from "./lib/scale";
import { cn } from "./utils/cn";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** Studio shots on solid blue backdrops */
const PERSON_CUT = { tolerance: 16, softness: 22, lumaWeight: 0.5, holeFraction: 0.003 };
/** Product shot on white */
const WHITE_CUT = { tolerance: 10, softness: 26, lumaWeight: 1, holeFraction: 0 };

function BarArt({ variant, rot, className }: { variant: BarVariant; rot: number; className?: string }) {
  return (
    <div
      className={cn(
        "w-[260px] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04] min-[400px]:w-[290px] sm:w-[310px]",
        className
      )}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <ProteinBar variant={variant} className="block h-auto w-full drop-shadow-[0_16px_18px_rgba(0,0,0,0.28)]" />
    </div>
  );
}

/* ================= INGREDIENTS ================= */
function Ingredients() {
  const items = [
    { img: "/images/grass.png", title: "20g Grass-fed", sub: "Whey Protein" },
    { img: "/images/caramel.png", title: "Zero added", sub: "Sugar" },
    { img: "/images/powder.png", title: "Tasted Dessert", sub: "Protein" },
    { img: "/images/choco-chunks.png", title: "Organic", sub: "Chocolate" },
    { img: "/images/palm-fruit.png", title: "No Fillers &", sub: "Palm Oil" },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start justify-center gap-x-8 gap-y-10 px-6 py-12 lg:justify-between lg:px-12">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="group flex w-[140px] flex-col items-center text-center sm:w-[160px]"
          >
            <div className="h-[104px] w-[104px] overflow-hidden rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition duration-300 group-hover:scale-105 group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)]">
              <img src={it.img} alt={it.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="font-condensed mt-3 text-[20px] font-bold leading-[1.05] text-[#12294e]">
              {it.title}
              <br />
              {it.sub}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="h-px bg-gray-100" />
      </div>
    </section>
  );
}

/* ================= FLAVORS ================= */
function AddToCart({ onAdd, big = false }: { onAdd: () => void; big?: boolean }) {
  return (
    <div style={{ filter: big ? "drop-shadow(0 8px 14px rgba(0,0,0,0.3))" : "drop-shadow(0 6px 10px rgba(0,0,0,0.2))" }}>
      <button
        onClick={onAdd}
        className={cn(
          "ticket-clip-sm font-condensed flex w-full items-center justify-between bg-white px-5 font-extrabold uppercase tracking-wide text-[#12294e] transition-colors hover:bg-[#f9e84a] active:scale-[0.98]",
          big ? "py-3 text-[15px]" : "py-2.5 text-[14px]"
        )}
      >
        <span className="mx-auto">
          Add to Cart - <span className="text-[#ff6a1a]">$40.50</span>
        </span>
        <ChevronRight className="h-4 w-4" strokeWidth={3} />
      </button>
    </div>
  );
}

function Flavors({ onAdd }: { onAdd: () => void }) {
  return (
    <section id="flavors" className="bg-white pb-16 pt-10">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.h2 {...fadeUp} className="font-display relative text-[30px] uppercase tracking-wide text-[#12315f] sm:text-[44px]">
            Most Popular Flavours
            <Burst className="absolute -top-3 right-6 sm:right-10" />
          </motion.h2>
          <motion.div {...fadeUp}>
            <a
              href="#flavors"
              className="shadow-wrap inline-block"
              style={{ ["--sx" as string]: "4px", ["--sy" as string]: "4px", ["--sc" as string]: "#12294e" }}
            >
              <span className="ticket font-condensed flex items-center gap-2 bg-[#ff6a1a] px-7 py-2.5 text-[15px] font-extrabold uppercase tracking-[0.08em] text-white">
                View Flavors <ChevronRight className="h-4 w-4" strokeWidth={3} />
              </span>
            </a>
          </motion.div>
        </div>

        <div className="mt-10 grid items-center gap-6 lg:grid-cols-3 lg:gap-0">
          {/* LEFT CARD */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative overflow-hidden rounded-[14px] bg-[#9cc32a] p-5 pt-8 shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(0,0,0,0.2)] lg:mr-[-18px] lg:rounded-r-none"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <span className="absolute left-8 top-4 h-8 w-8 rounded-full bg-green-700/20 blur-[1px]" />
              <span className="absolute right-10 top-10 h-6 w-10 rotate-12 rounded-[50%] bg-green-800/25" />
              <span className="absolute bottom-24 left-4 h-10 w-10 -rotate-12 rounded-[50%] bg-green-800/25" />
            </div>
            <div className="relative flex justify-center py-4">
              <BarArt variant="almond" rot={-8} />
              <span className="absolute left-6 top-0 h-7 w-7 rounded-full bg-[#6b4a2a] shadow" aria-hidden />
              <span className="absolute bottom-2 right-8 h-6 w-6 rounded-full bg-[#6b4a2a] shadow" aria-hidden />
            </div>
            <h3 className="font-display mt-4 text-[26px] uppercase tracking-wide text-[#12300a]">Chocolate Almond</h3>
            <p className="font-condensed text-[15px] font-medium text-[#12300a]/80">Chocolate Almond Bliss (12 Bars)</p>
            <div className="mt-3">
              <AddToCart onAdd={onAdd} />
            </div>
          </motion.article>

          {/* MIDDLE CARD */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="group relative z-10 overflow-hidden rounded-[14px] bg-gradient-to-b from-[#3aa5ef] to-[#2a7fd0] p-5 pb-6 pt-10 shadow-[0_30px_70px_rgba(20,80,160,0.35)] transition duration-300 hover:-translate-y-2 lg:scale-[1.06]"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-30" aria-hidden>
              <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-full w-full">
                <path d="M0 100 L60 30 L120 70 L180 10 L260 60 L320 20 L400 70 L400 100 Z" fill="white" />
              </svg>
            </div>
            <div className="absolute left-6 top-4 h-8 w-5 rotate-[-24deg] rounded-[50%] bg-[#c8955a] shadow-md" aria-hidden />
            <div className="absolute right-14 top-3 h-9 w-6 rotate-[24deg] rounded-[50%] bg-[#b67a3a] shadow-md" aria-hidden />
            <div className="absolute right-6 top-10 h-7 w-5 rotate-[40deg] rounded-[50%] bg-[#d0a05e] shadow-md" aria-hidden />
            <div className="relative flex justify-center py-4">
              <BarArt variant="birthday" rot={-5} />
            </div>
            <div className="absolute left-4 top-[46%] h-9 w-6 -rotate-[24deg] rounded-[50%] bg-[#c8955a] shadow-md" aria-hidden />
            <div className="absolute bottom-40 right-4 h-9 w-6 rotate-[30deg] rounded-[50%] bg-[#b67a3a] shadow-md" aria-hidden />
            <h3 className="font-display relative mt-4 text-[28px] uppercase tracking-wide text-white drop-shadow">Birthday Cake</h3>
            <p className="font-condensed relative text-[15px] font-medium text-white/90">Almond Vanilla Cake (12 Bars)</p>
            <div className="relative mt-3">
              <AddToCart onAdd={onAdd} big />
            </div>
            <svg viewBox="0 0 24 32" className="absolute -bottom-1 right-8 h-10 w-8 drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1" aria-hidden>
              <path d="M4 2 L20 14 L12 15 L14 28 L9 29 L7 16 L2 18 Z" fill="#12294e" stroke="white" strokeWidth="1.6" />
            </svg>
          </motion.article>

          {/* RIGHT CARD */}
          <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative overflow-hidden rounded-[14px] bg-[#9a8a90] p-5 pt-8 shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_rgba(0,0,0,0.2)] lg:ml-[-18px] lg:rounded-l-none"
          >
            <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
              <span className="absolute right-8 top-6 h-5 w-8 rotate-12 rounded-full bg-[#e8c88a]" />
              <span className="absolute right-4 top-16 h-5 w-8 -rotate-12 rounded-full bg-[#d9b06a]" />
              <span className="absolute bottom-28 left-8 h-6 w-6 rounded-full bg-black/30 blur-[1px]" />
            </div>
            <div className="relative flex justify-center py-4">
              <BarArt variant="maple" rot={5} />
            </div>
            <h3 className="font-display mt-4 text-[26px] uppercase tracking-wide text-white">Glazed Doughnut</h3>
            <p className="font-condensed text-[15px] font-medium text-white/85">Maple Glazed Doughnut (12 Bars)</p>
            <div className="mt-3">
              <AddToCart onAdd={onAdd} />
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

/* ================= BANNER ================= */
function Banner() {
  return (
    <section className="relative overflow-hidden bg-[#2fb9ef]">
      <img src="/images/hands-banner.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2fb9ef] via-[#2fb9ef]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a9ad8]/40 via-transparent to-[#1a9ad8]/20" />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">
        <motion.div {...fadeUp}>
          <h2 className="font-condensed uppercase leading-[0.92]">
            <span className="block text-[48px] font-light text-white sm:text-[64px]">
              One <span className="font-display font-normal text-[#12294e]">Protein</span>
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-3">
              <span className="font-display text-[48px] text-white sm:text-[64px]">For</span>
              <a
                href="#flavors"
                className="shadow-wrap inline-block"
                style={{ ["--sx" as string]: "3px", ["--sy" as string]: "4px", ["--sc" as string]: "rgba(10,30,60,0.9)" }}
              >
                <span className="ticket font-condensed flex items-center gap-1 bg-[#f9e84a] px-5 py-2 text-[15px] font-extrabold uppercase tracking-wide text-[#12294e]">
                  Shop Now <ChevronRight className="h-4 w-4" strokeWidth={3.5} />
                </span>
              </a>
            </span>
            <span className="font-display block text-[48px] text-white sm:text-[64px]">Everyone!</span>
          </h2>
        </motion.div>

        <div className="relative hidden min-h-[280px] lg:block" aria-hidden>
          <div className="absolute right-16 top-6 rotate-[18deg]">
            <div className="font-display text-[92px] leading-[0.8] text-white/95 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]">ONE</div>
            <div className="font-condensed -mt-1 text-[18px] font-extrabold uppercase tracking-[0.1em] text-[#7a0f1f]">Hershey's</div>
            <div className="mt-2 flex gap-2">
              <span className="font-condensed rounded-full bg-[#3d1d12] px-2 py-1 text-[11px] font-extrabold text-white">18g PROTEIN</span>
              <span className="font-condensed rounded-full bg-white px-2 py-1 text-[11px] font-extrabold text-[#12294e]">3g SUGAR</span>
            </div>
          </div>
          <QualityStamp dark className="absolute bottom-10 right-4 rotate-[-8deg]" />
          <div className="absolute bottom-4 left-10 text-[#124a7a]">
            <Bike className="h-16 w-16" strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between px-6 pb-8 lg:hidden">
        <Bike className="h-12 w-12 text-[#124a7a]" />
        <QualityStamp dark className="h-20 w-20" />
      </div>
    </section>
  );
}

/* ================= FUEL ================= */
function Fuel() {
  return (
    <section id="fuel" className="bg-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.5fr_0.9fr] lg:gap-0 lg:px-8">
        <motion.div {...fadeUp} className="group flex flex-col items-center text-center lg:border-r lg:border-gray-100 lg:pr-8">
          <h3 className="font-display text-[26px] uppercase tracking-wide text-[#12315f]">Muscle Fuel</h3>
          <p className="font-condensed mt-1 max-w-[220px] text-[14px] font-medium leading-snug text-gray-600">Protein that built for gains, made for taste</p>
          <div className="relative mt-6">
            <div className="h-[150px] w-[150px] rounded-full bg-gradient-to-br from-[#dff5f3] to-[#bfe8e4]" />
            <div className="absolute left-1/2 top-1/2 w-[170px] -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] transition-transform duration-500 group-hover:rotate-[-20deg]">
              <ProteinBar variant="reese" className="block h-auto w-full drop-shadow-[0_12px_14px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="absolute -right-2 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#4a9a8b] shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="group flex flex-col items-center text-center lg:px-10"
        >
          <h3 className="font-display text-[28px] uppercase leading-[1.02] tracking-wide sm:text-[34px]">
            <span className="text-[#12315f]">Fuel your fire with</span>
            <br />
            <span className="text-[#ff6a1a]">20g</span> <span className="text-[#12315f]">Protein!</span>
          </h3>
          <svg viewBox="0 0 200 10" className="mt-2 h-2 w-40" aria-hidden>
            <path
              d="M0 5 L10 0 L20 5 L30 0 L40 5 L50 0 L60 5 L70 0 L80 5 L90 0 L100 5 L110 0 L120 5 L130 0 L140 5 L150 0 L160 5 L170 0 L180 5 L190 0 L200 5"
              fill="none"
              stroke="#ff6a1a"
              strokeWidth="1.6"
            />
          </svg>
          <div className="relative mt-8 w-full max-w-[480px]">
            <span className="absolute -top-7 left-1/2 h-7 w-5 -translate-x-4 rotate-[-20deg] rounded-[50%] bg-[#c8955a] shadow" aria-hidden />
            <span className="absolute -top-7 left-1/2 h-7 w-5 translate-x-2 rotate-[20deg] rounded-[50%] bg-[#b67a3a] shadow" aria-hidden />
            <span className="absolute -left-3 top-6 h-7 w-5 -rotate-[30deg] rounded-[50%] bg-[#d0a05e] shadow" aria-hidden />
            <span className="absolute -bottom-4 -right-2 h-7 w-5 rotate-[30deg] rounded-[50%] bg-[#b67a3a] shadow" aria-hidden />
            <div className="flex justify-center">
              <BarArt variant="birthday" rot={0} className="min-[400px]:w-[320px] sm:w-[380px]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center text-center lg:border-l lg:border-gray-100 lg:pl-8"
        >
          <div className="flex -space-x-3">
            {["https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/54.jpg"].map((src) => (
              <img key={src} src={src} alt="Happy customer" className="h-11 w-11 rounded-full border-[3px] border-[#f9e84a] object-cover" loading="lazy" />
            ))}
          </div>
          <h3 className="font-condensed mt-3 text-[22px] font-bold leading-tight text-[#12315f]">
            We Produce
            <br />
            Quality Protein
          </h3>
          <a href="#flavors" className="font-condensed mt-1 flex items-center gap-1 text-[13px] font-bold text-[#12315f] transition-colors hover:text-[#ff6a1a]">
            Explore Flavors <ChevronRight className="h-3.5 w-3.5" strokeWidth={3} />
          </a>
          <Cutout
            src="/images/choco-splash.png"
            alt="Chocolate protein bar with a splash of melted chocolate"
            options={WHITE_CUT}
            className="mt-4 h-[150px] w-full object-contain transition duration-500 hover:-rotate-2 hover:scale-105"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ================= REVIEWS ================= */
function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-[#3a8bca]">
      <TireTracks className="absolute left-0 top-[38%] opacity-[0.16]" color="#0e2a52" />
      <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 pb-0 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <motion.figure {...fadeUp} className="rounded-[14px] bg-[#fdf6ec] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1 sm:p-7">
            <blockquote className="font-condensed text-[21px] font-semibold leading-snug text-[#12315f]">
              ONE hit gold with this 18g of raw quality protein, peanut butter, smooth texture, and delicious flavour... Amazing !
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-between border-t border-[#12315f]/10 pt-5">
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Amelia Julien" className="h-11 w-11 rounded-full border-2 border-[#3a8bca] object-cover" />
                <div>
                  <div className="font-condensed text-[16px] font-bold text-[#12315f]">Amelia Julien</div>
                  <div className="font-condensed text-[13px] font-medium text-gray-500">Sportsman | Wellness Coach</div>
                </div>
              </div>
              <div className="font-condensed text-[30px] font-extrabold text-[#12315f]" aria-label="Rated 5.0 out of 5">
                5.0
              </div>
            </figcaption>
          </motion.figure>

          <div className="grid flex-1 grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[300px] sm:h-[360px]"
            >
              <Cutout
                src="/images/hiker.png"
                alt="Mountain trekker striding with poles"
                options={PERSON_CUT}
                className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_18px_30px_rgba(10,30,70,0.35)]"
              />
            </motion.div>
            <motion.figure {...fadeUp} className="pb-14">
              <div className="font-display text-[44px] leading-none text-[#12315f]" aria-hidden>
                “
              </div>
              <blockquote className="font-condensed -mt-3 text-[17px] font-bold uppercase leading-tight tracking-wide text-white">
                All-in-one protein fuel, made to match your non-stop schedule
              </blockquote>
              <figcaption className="mt-3">
                <div className="font-condensed text-[15px] font-bold text-white">Natasha Romanoff</div>
                <div className="font-condensed text-[13px] font-medium text-white/75">Mountain Trekker</div>
              </figcaption>
            </motion.figure>
          </div>
        </div>

        <div className="flex flex-col">
          <motion.div {...fadeUp} className="relative">
            <Burst className="absolute -top-4 right-10 rotate-[20deg]" />
            <h2 className="font-display text-right text-[36px] uppercase leading-[0.95] tracking-wide sm:text-[52px]">
              <span className="text-white">Our </span>
              <span className="text-[#12315f]">One</span>
              <span className="text-white">-derful</span>
              <br />
              <span className="text-white">Digital Path</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto mt-2 h-[400px] w-full max-w-[440px] flex-1 sm:h-[500px]"
          >
            <Cutout
              src="/images/surfer.png"
              alt="Smiling wave surfer carrying a surfboard"
              options={PERSON_CUT}
              className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_18px_30px_rgba(10,30,70,0.35)]"
            />
            <div className="absolute bottom-24 right-2 flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:right-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb9ef] to-[#bfe8f5]">
                <Waves className="h-5 w-5 text-[#12315f]" strokeWidth={2.4} />
              </span>
              <span className="font-condensed text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#12294e]">Wave Surfers</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#12294e]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-40" aria-hidden>
        <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice" className="h-[340px] w-full">
          <path d="M0 320 L140 140 L220 200 L340 60 L460 190 L560 100 L700 230 L820 120 L950 220 L1060 140 L1200 240 L1200 320 Z" fill="#0d2140" />
          <path d="M0 320 L180 180 L300 250 L470 130 L620 240 L780 170 L950 260 L1200 180 L1200 320 Z" fill="#1a3d75" opacity="0.9" />
          <path d="M340 60 L370 95 L350 110 L330 92 Z M560 100 L585 130 L565 142 L545 125 Z M820 120 L845 150 L825 162 L805 145 Z" fill="#6ea8dd" opacity="0.7" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.4fr_1fr]">
          <motion.div {...fadeUp} className="relative">
            <Burst className="absolute -top-4 left-[46%]" />
            <h2 className="font-display text-[24px] uppercase leading-tight tracking-wide text-white sm:text-[30px]">
              Be the first to get exclusive
              <br />
              access to new flavors & deals!
            </h2>
          </motion.div>
          <div className="hidden justify-center lg:flex" aria-hidden>
            <div className="relative rotate-[-8deg] transition-transform duration-500 hover:rotate-0">
              <div className="absolute -top-7 left-2 h-12 w-10 rotate-[8deg] rounded-[3px] bg-[#f9e84a] shadow-md" />
              <div className="absolute -top-6 left-6 h-12 w-10 rotate-[12deg] rounded-[3px] bg-[#fff3a0] shadow-md" />
              <div className="relative flex h-14 w-20 items-center justify-center rounded-[4px] bg-gradient-to-br from-[#ff8a1f] to-[#e85a0f] shadow-xl">
                <div className="h-0 w-0 border-x-[26px] border-t-[18px] border-x-transparent border-t-white/90" />
              </div>
              <span className="absolute -right-3 -top-2 text-[#f9e84a]">✦</span>
              <span className="absolute -left-4 top-6 text-white/70">✦</span>
            </div>
          </div>
          <motion.div {...fadeUp}>
            {done ? (
              <div className="font-condensed rounded-lg bg-white/10 px-6 py-4 text-center text-[16px] font-bold text-[#f9e84a] ring-1 ring-[#f9e84a]/40" role="status">
                You're in! Watch your inbox for fresh drops. 🎉
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setDone(true);
                }}
                className="flex"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))" }}
              >
                <div className="ticket-clip-sm flex flex-1 items-stretch overflow-hidden bg-white">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Your Email Address"
                    className="font-condensed w-full bg-transparent px-5 py-3 text-[14px] font-semibold text-gray-800 outline-none placeholder:text-gray-800"
                  />
                  <button type="submit" className="font-condensed shrink-0 bg-[#ff6a1a] px-6 text-[15px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#e85a0f] sm:px-8">
                    Subscribe
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        <div className="mt-10 h-px bg-white/10" />

        <div className="grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-wrap items-center gap-8">
            <OneLogo className="block h-9 w-[83px]" />
            <div className="font-display text-[17px] uppercase leading-tight tracking-wide text-white">
              Pure Protein,
              <br />
              Natural Taste
            </div>
            <QualityStamp className="h-24 w-24 transition-transform duration-700 hover:rotate-[20deg]" />
          </div>
          <nav className="font-condensed grid grid-cols-2 gap-6 text-[15px] font-semibold text-white/90 sm:grid-cols-3" aria-label="Footer">
            <div className="grid gap-3">
              <a href="#flavors" className="transition-colors hover:text-[#f9e84a]">Shop</a>
              <a href="#footer" className="transition-colors hover:text-[#f9e84a]">Contact</a>
            </div>
            <div className="grid gap-3">
              <a href="#reviews" className="transition-colors hover:text-[#f9e84a]">About Us</a>
              <a href="#footer" className="transition-colors hover:text-[#f9e84a]">Store Locator</a>
            </div>
            <div className="grid gap-3">
              <a href="#fuel" className="transition-colors hover:text-[#f9e84a]">Our Proteins</a>
              <a href="#reviews" className="transition-colors hover:text-[#f9e84a]">FAQ</a>
            </div>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-5">
          <div className="flex items-center gap-5 text-white">
            <a href="#" aria-label="Instagram" className="transition hover:scale-110 hover:text-[#f9e84a]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="transition hover:scale-110 hover:text-[#f9e84a]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5z" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="transition hover:scale-110 hover:text-[#f9e84a]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                <path d="M16.6 3c.4 2.1 1.8 3.6 4 3.9v3c-1.5 0-2.9-.5-4-1.3v6.6c0 3.5-2.6 6-6 6-3.3 0-6-2.6-6-6 0-3.3 2.7-6 6-6 .3 0 .7 0 1 .1v3.1c-.3-.1-.7-.2-1-.2-1.6 0-2.9 1.3-2.9 2.9 0 1.7 1.3 3 2.9 3 1.7 0 3-1.3 3-3V3h3.1z" />
              </svg>
            </a>
          </div>
          <p className="font-condensed text-[12.5px] font-medium text-white/60">All rights reserve to Rylic Studio 2025</p>
          <div className="font-condensed flex gap-6 text-[12.5px] font-medium text-white/70">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>

        <div className="relative overflow-hidden pb-2">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            className="font-display text-center text-[13.5vw] uppercase italic leading-[0.9] tracking-tight text-[#f9e84a] drop-shadow-[0_6px_0_rgba(0,0,0,0.25)] lg:text-[148px]"
          >
            One Protein
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

/* ================= APP ================= */
export default function App() {
  useDesignScale();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const add = () => {
    setCart((c) => c + 1);
    flash("Added to cart — $40.50");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-white">
        <Header
          cart={cart}
          isDesktop={isDesktop}
          onCart={() => flash(cart === 0 ? "Your cart is empty — grab a bar!" : `${cart} item${cart > 1 ? "s" : ""} in your cart`)}
        />
        <main>
          <Hero isDesktop={isDesktop} onAdd={add} />
          <ZigZag top={COLORS.heroNavy} bottom="#ffffff" />
          <Ingredients />
          <Flavors onAdd={add} />
          <ZigZag top="#ffffff" bottom="#2fb9ef" />
          <Banner />
          <ZigZag top="#2fb9ef" bottom="#ffffff" />
          <Fuel />
          <ZigZag top="#ffffff" bottom="#3a8bca" />
          <Reviews />
          <ZigZag top="#3a8bca" bottom="#12294e" />
        </main>
        <Footer />

        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300",
            toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          )}
        >
          <div className="font-condensed flex items-center gap-2 rounded-full bg-[#12294e] px-5 py-2.5 text-[14px] font-bold uppercase tracking-wide text-white shadow-2xl ring-1 ring-white/20">
            <ShoppingCart className="h-4 w-4 text-[#f9e84a]" /> {toast}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
