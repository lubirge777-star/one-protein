import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, ChevronRight, Menu, Search, ShoppingCart, X } from "lucide-react";
import { OneLogo, PinIcon } from "./hero/art";
import { s, type CSSVars, COLORS } from "../lib/scale";
import { cn } from "../utils/cn";

type Item = { label: string; href: string; color: string; note: string };

const PRODUCTS: Item[] = [
  { label: "Protein Bars", href: "#flavors", color: "#2f9be8", note: "20g protein · 1g sugar" },
  { label: "Variety Packs", href: "#flavors", color: "#ff6a1a", note: "Try every flavor" },
  { label: "Minis", href: "#flavors", color: "#9cc32a", note: "Snack-size fuel" },
];
const PROTEINS: Item[] = [
  { label: "Grass-fed Whey", href: "#fuel", color: "#f9e84a", note: "Clean, complete protein" },
  { label: "Plant Blend", href: "#fuel", color: "#4f9e22", note: "Dairy-free power" },
  { label: "Recovery", href: "#fuel", color: "#9d898d", note: "Post-workout repair" },
];

const MOBILE_LINKS = [
  { label: "Our Products", href: "#flavors" },
  { label: "Our Proteins", href: "#fuel" },
  { label: "Store Location", href: "#footer" },
  { label: "FAQ", href: "#reviews" },
  { label: "Contact", href: "#footer" },
];

function NavDropdown({ label, items }: { label: string; items: Item[] }) {
  return (
    <div className="group relative">
      <button type="button" className="nav-link flex items-center" style={{ gap: s(3) }} aria-haspopup="true">
        {label}
        <ChevronDown
          style={{ width: s(10), height: s(10) }}
          strokeWidth={2.6}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
      </button>
      <div
        className="invisible absolute left-1/2 top-full z-20 -translate-x-1/2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        style={{ paddingTop: s(16) }}
      >
        <ul
          className="translate-y-1 rounded-xl bg-white shadow-[0_24px_48px_rgba(8,22,52,0.28)] ring-1 ring-black/5 transition-transform duration-200 group-hover:translate-y-0"
          style={{ width: s(178), padding: s(5) }}
        >
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                className="flex items-center rounded-lg transition-colors hover:bg-[#eef5fc]"
                style={{ gap: s(8), padding: `${s(6)} ${s(8)}` }}
              >
                <span className="shrink-0 rounded-full" style={{ width: s(8), height: s(8), background: it.color }} />
                <span className="flex flex-col">
                  <span
                    className="font-condensed font-bold uppercase tracking-wide text-[#10264f]"
                    style={{ fontSize: s(10.5), lineHeight: 1.1 }}
                  >
                    {it.label}
                  </span>
                  <span className="font-condensed font-medium text-slate-500" style={{ fontSize: s(8.5) }}>
                    {it.note}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header({ cart, onCart, isDesktop }: { cart: number; onCart: () => void; isDesktop: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById("flavors")?.scrollIntoView({ behavior: "smooth" });
  };

  const badge = cart > 0 && (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f9e84a] px-1 font-condensed text-[10px] font-extrabold leading-none text-[#10264f]">
      {cart}
    </span>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[filter] duration-300",
        scrolled && "drop-shadow-[0_6px_14px_rgba(6,18,44,0.28)]"
      )}
    >
      <div className="relative" style={{ background: COLORS.headerBlue }}>
        {isDesktop ? (
          <div
            className="mx-auto flex items-center"
            style={{ width: `min(100%, ${s(824)})`, height: s(48), paddingLeft: s(42), paddingRight: s(37) }}
          >
            <a href="#top" aria-label="ONE Protein — home" className="shrink-0 transition-opacity hover:opacity-80">
              <OneLogo style={{ height: s(21), width: s(48.1), display: "block" }} />
            </a>
            <a href="#footer" className="nav-link flex items-center" style={{ marginLeft: s(32), gap: s(5) }}>
              <PinIcon style={{ width: s(12.5), height: s(12.5) }} />
              Store Location
            </a>
            <span aria-hidden className="bg-white/60" style={{ marginLeft: s(23), width: 1, height: s(12) }} />
            <nav aria-label="Primary" className="flex items-center" style={{ marginLeft: s(23), gap: s(22) }}>
              <NavDropdown label="Our Products" items={PRODUCTS} />
              <NavDropdown label="Our Proteins" items={PROTEINS} />
              <a href="#reviews" className="nav-link">
                FAQ
              </a>
              <a href="#footer" className="nav-link">
                Contact
              </a>
            </nav>
            <div className="flex-1" style={{ minWidth: s(16) }} />
            <form
              role="search"
              onSubmit={submit}
              className="shadow-static"
              style={{ "--sx": s(3), "--sy": s(3), "--sc": "#0d2347" } as CSSVars}
            >
              <label
                className="ticket flex cursor-text items-center bg-white"
                style={{ "--t": s(2.6), width: s(155), height: s(29), paddingLeft: s(11), paddingRight: s(10), gap: s(6) } as CSSVars}
              >
                <Search className="shrink-0 text-[#10264f]" style={{ width: s(11), height: s(11) }} strokeWidth={2.6} />
                <span className="sr-only">Search products</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full min-w-0 bg-transparent font-condensed font-semibold text-[#10264f] outline-none placeholder:text-[#10264f]"
                  style={{ fontSize: s(10.5) }}
                />
              </label>
            </form>
            <button type="button" onClick={onCart} className="nav-link flex items-center" style={{ marginLeft: s(30), gap: s(6) }}>
              Cart
              <span className="relative">
                <ShoppingCart style={{ width: s(14), height: s(14) }} strokeWidth={2.2} />
                {badge}
              </span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-16 items-center justify-between px-5 sm:px-8">
              <a href="#top" aria-label="ONE Protein — home">
                <OneLogo className="block h-6 w-[55px]" />
              </a>
              <div className="flex items-center gap-5 text-white">
                <button type="button" onClick={onCart} className="relative" aria-label={`Cart, ${cart} items`}>
                  <ShoppingCart className="h-[22px] w-[22px]" />
                  {badge}
                </button>
                <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
                  {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
              </div>
            </div>
            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0">
                <div className="border-t border-white/15 px-5 pb-6 pt-4 sm:px-8">
                  <form
                    role="search"
                    onSubmit={submit}
                    className="shadow-static mb-4"
                    style={{ "--sx": "3px", "--sy": "3px", "--sc": "#0d2347" } as CSSVars}
                  >
                    <label className="ticket flex h-11 items-center gap-2 bg-white px-4" style={{ "--t": "3px" } as CSSVars}>
                      <Search className="h-4 w-4 text-[#10264f]" strokeWidth={2.6} />
                      <span className="sr-only">Search products</span>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search flavors"
                        className="w-full bg-transparent font-condensed text-base font-semibold text-[#10264f] outline-none placeholder:text-[#10264f]/70"
                      />
                    </label>
                  </form>
                  <nav aria-label="Mobile" className="grid gap-0.5 font-condensed text-lg font-bold uppercase tracking-wide text-white">
                    {MOBILE_LINKS.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-white/10"
                      >
                        {l.label}
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
        <div aria-hidden className="zz-teeth pointer-events-none absolute inset-x-0 top-full" />
      </div>
    </header>
  );
}
