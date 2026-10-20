"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Check, ChevronDown, ChevronUp, Clock, Eye, Leaf, ListTree, Search, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Chapter, XP_TOTAL } from "@/lib/chapters";
import { CMP_XP_TOTAL } from "@/lib/compare";
import { ICT_XP_TOTAL } from "@/lib/ict/extras";
import { OF_XP_TOTAL } from "@/lib/of/content";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Tab = "pa" | "ict" | "of" | "all";
export type SubLink = { id: string; label: string };

const GRAND_TOTAL = XP_TOTAL + ICT_XP_TOTAL + OF_XP_TOTAL + CMP_XP_TOTAL;

const TABS = [
  { k: "pa", href: "/", label: "Price Action", short: "PA", blurb: "Candles, structure, levels, entries, risk" },
  { k: "ict", href: "/ict-gold", label: "ICT Gold", short: "ICT", blurb: "The XAUUSD master course — 30 sections" },
  { k: "of", href: "/order-flow", label: "Order Flow", short: "Flow", blurb: "DOM, tape, delta, footprint, profile" },
  { k: "all", href: "/compare", label: "Combined", short: "All", blurb: "All three lenses side by side" },
] as const;

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function HUD({ chapters: CHAPTERS, tab, subs }: { chapters: Chapter[]; tab: Tab; subs?: Record<string, SubLink[]> }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const { xp, done, focus, setFocus, calm, setCalm, lastGain } = useProgress();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener("level:active", h);
    return () => window.removeEventListener("level:active", h);
  }, []);

  useEffect(() => {
    document.body.dataset.focus = focus ? "1" : "0";
  }, [focus]);

  // keep the active chip centred in the rail
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (rail && chip) rail.scrollTo({ left: chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const idx = active ? CHAPTERS.findIndex((c) => c.id === active) : -1;
  const jump = (d: number) => {
    const n = CHAPTERS[Math.min(CHAPTERS.length - 1, Math.max(0, idx + d))];
    go(idx === -1 && d > 0 ? CHAPTERS[0].id : n.id);
  };

  // keyboard: J/K hop, S (or /) opens the section guide, F focus, Esc closes
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "Escape") setOpen(false);
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") return;
      if (e.key === "j") jump(1);
      if (e.key === "k") jump(-1);
      if (e.key === "f") setFocus(!focus);
      if (e.key === "s" || e.key === "/") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const cleared = CHAPTERS.filter((c) => done[c.id]).length;
  const current = idx >= 0 ? CHAPTERS[idx] : null;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl">
        {/* row 1: course switch + tools */}
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
          <a href="#top" className="flex shrink-0 items-center gap-2 font-bold text-white" aria-label="Back to top">
            <Logo />
            <span className="hidden xl:inline">
              PA<span className="text-gold">/</span>Academy
            </span>
          </a>
          <TabSwitch tab={tab} />
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Toggle on={focus} onClick={() => setFocus(!focus)} label="Focus" icon={<Eye size={14} />} title="Focus mode (F): fade everything except the current section" />
            <Toggle on={calm} onClick={() => setCalm(!calm)} label="Calm" icon={<Leaf size={14} />} title="Calm mode: turn off decorative animation" />
            <div className="relative flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-gold/30 bg-gold/10 px-2.5 py-1.5 font-mono text-xs font-bold text-gold">
              <Zap size={13} />
              {xp}
              <span className="hidden text-gold/50 xl:inline">/ {GRAND_TOTAL} XP</span>
              <AnimatePresence>
                {lastGain && (
                  <motion.span key={lastGain.t} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: 28 }} transition={{ duration: 1.3 }} className="absolute -bottom-2 right-1 text-bull">
                    +{lastGain.amount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* row 2: section guide */}
        <div className="border-t border-white/[0.05]">
          <div className="mx-auto flex h-11 max-w-7xl items-center gap-2 px-3 sm:px-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-xs font-bold text-gold transition hover:bg-gold/20"
              title="All sections (S)"
            >
              <ListTree size={14} />
              <span className="hidden sm:inline">Sections</span>
              <span className="font-mono text-[10px] text-gold/70">
                {cleared}/{CHAPTERS.length}
              </span>
            </button>
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-ink/90 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-ink/90 to-transparent" />
              <div ref={railRef} className="no-scrollbar flex items-center gap-1 overflow-x-auto scroll-smooth px-1">
                {CHAPTERS.map((c) => {
                  const isActive = active === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      data-chip={c.id}
                      onClick={() => go(c.id)}
                      title={`${c.title} · ${c.minutes} min`}
                      className={cn(
                        "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                        isActive ? "text-ink" : done[c.id] ? "text-bull hover:bg-white/5" : "text-slate-400 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {isActive && <motion.span layoutId={`rail-${tab}`} className="absolute inset-0 rounded-lg bg-gold" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                      <span className={cn("relative font-mono text-[10px]", isActive ? "text-ink/70" : "text-slate-600")}>{c.num}</span>
                      <span className="relative">{c.short}</span>
                      {done[c.id] && <Check size={12} strokeWidth={3} className="relative" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <motion.div className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-gold via-bull to-sky" style={{ scaleX }} />
      </div>

      <SectionDrawer open={open} onClose={() => setOpen(false)} chapters={CHAPTERS} tab={tab} active={active} subs={subs} />

      {/* bottom level hopper */}
      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-ink/85 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <button type="button" onClick={() => jump(-1)} className="rounded-xl p-2 text-slate-300 hover:bg-white/10" aria-label="Previous section (K)">
          <ChevronUp size={18} />
        </button>
        <button type="button" onClick={() => setOpen(true)} className="min-w-[150px] rounded-xl px-2 py-0.5 text-center hover:bg-white/5" title="Open the section guide (S)">
          <div className="font-mono text-[10px] text-slate-500">
            {current ? `${idx + 1} OF ${CHAPTERS.length}` : `${CHAPTERS.length} SECTIONS`}
            <span className="hidden sm:inline"> · S = GUIDE</span>
          </div>
          <div className="truncate text-sm font-semibold text-white">{current ? `${current.num} · ${current.short}` : "Start →"}</div>
        </button>
        <button type="button" onClick={() => jump(1)} className="rounded-xl bg-gold p-2 text-ink hover:brightness-110" aria-label="Next section (J)">
          <ChevronDown size={18} />
        </button>
      </div>
    </>
  );
}

function SectionDrawer({
  open,
  onClose,
  chapters,
  tab,
  active,
  subs,
}: {
  open: boolean;
  onClose: () => void;
  chapters: Chapter[];
  tab: Tab;
  active: string | null;
  subs?: Record<string, SubLink[]>;
}) {
  const { done } = useProgress();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
    else setQ("");
  }, [open]);

  const ql = q.trim().toLowerCase();
  const match = (s: string) => !ql || s.toLowerCase().includes(ql);
  const list = chapters
    .map((c) => ({ c, kids: (subs?.[c.id] ?? []).filter((s) => match(s.label)) }))
    .filter(({ c, kids }) => match(`${c.num} ${c.title} ${c.short}`) || kids.length > 0);
  const totalMin = chapters.reduce((s, c) => s + c.minutes, 0);
  const leftMin = chapters.filter((c) => !done[c.id]).reduce((s, c) => s + c.minutes, 0);
  const cleared = chapters.filter((c) => done[c.id]).length;
  const nextUp = chapters.find((c) => !done[c.id]);

  const pick = (id: string) => {
    onClose();
    setTimeout(() => go(id), 180);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-label="Section guide"
            className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-md flex-col border-r border-white/10 bg-panel shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ListTree size={18} className="text-gold" /> Section guide
                </div>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close (Esc)">
                  <X size={18} />
                </button>
              </div>
              {/* course switcher */}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {TABS.map((t) => (
                  <Link
                    key={t.k}
                    href={t.href}
                    onClick={onClose}
                    className={cn("rounded-xl border p-2.5 transition", tab === t.k ? "border-gold/60 bg-gold/10" : "border-white/10 hover:border-white/25")}
                  >
                    <div className={cn("text-sm font-bold", tab === t.k ? "text-gold" : "text-white")}>{t.label}</div>
                    <div className="text-[11px] leading-tight text-slate-500">{t.blurb}</div>
                  </Link>
                ))}
              </div>
              {/* progress */}
              <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>
                    <span className="text-bull">{cleared}</span>/{chapters.length} cleared
                  </span>
                  <span>
                    ~{leftMin} of {totalMin} min left
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold to-bull transition-all" style={{ width: `${(cleared / chapters.length) * 100}%` }} />
                </div>
                {nextUp && (
                  <button type="button" onClick={() => pick(nextUp.id)} className="mt-2.5 flex w-full items-center justify-between rounded-lg bg-gold px-3 py-2 text-left text-sm font-bold text-ink hover:brightness-110">
                    <span className="truncate">
                      Continue: {nextUp.num} · {nextUp.short}
                    </span>
                    <span className="font-mono text-xs">{nextUp.minutes} min →</span>
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 focus-within:border-gold/60">
                <Search size={15} className="text-slate-500" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && list[0]) pick(list[0].kids[0] && !match(list[0].c.title) ? list[0].kids[0].id : list[0].c.id);
                  }}
                  placeholder="Search sections & lessons…"
                  className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {list.map(({ c, kids }) => {
                const isActive = active === c.id;
                return (
                  <div key={c.id} className="mb-1">
                    <button
                      type="button"
                      onClick={() => pick(c.id)}
                      className={cn("flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition", isActive ? "bg-gold/15 ring-1 ring-gold/50" : "hover:bg-white/5")}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black",
                          done[c.id] ? "bg-bull text-ink" : isActive ? "bg-gold text-ink" : "bg-white/5 text-slate-400",
                        )}
                      >
                        {done[c.id] ? <Check size={16} strokeWidth={3} /> : c.num}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{c.title}</span>
                        <span className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {c.minutes} min
                          </span>
                          {isActive && <span className="text-gold">● you are here</span>}
                          {done[c.id] && <span className="text-bull">cleared</span>}
                        </span>
                      </span>
                    </button>
                    {kids.length > 0 && (
                      <div className="ml-7 border-l border-white/10 pl-3">
                        {kids.map((s) => (
                          <button key={s.id} type="button" onClick={() => pick(s.id)} className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-xs text-slate-400 hover:bg-white/5 hover:text-white">
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {!list.length && <div className="p-6 text-center text-sm text-slate-500">Nothing matches “{q}”.</div>}
            </div>
            <div className="border-t border-white/10 p-3 font-mono text-[10px] text-slate-500">
              <Kbd>S</Kbd> open guide · <Kbd>J</Kbd>/<Kbd>K</Kbd> next/prev · <Kbd>F</Kbd> focus · <Kbd>Esc</Kbd> close
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 text-slate-300">{children}</kbd>;
}

function TabSwitch({ tab }: { tab: Tab }) {
  return (
    <div className="flex shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-0.5 text-xs font-bold">
      {TABS.map((t) => (
        <Link key={t.k} href={t.href} className={cn("relative rounded-lg px-2 py-1.5 transition sm:px-2.5", tab === t.k ? "text-ink" : "text-slate-400 hover:text-white")}>
          {tab === t.k && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-gold" />}
          <span className="relative whitespace-nowrap">
            <span className="md:hidden">{t.short}</span>
            <span className="hidden md:inline">{t.label}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function Toggle({ on, onClick, label, icon, title }: { on: boolean; onClick: () => void; label: string; icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn("flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition", on ? "border-violet/60 bg-violet/20 text-violet" : "border-white/10 text-slate-400 hover:text-white")}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <rect width="26" height="26" rx="8" fill="#f5c451" />
      <path d="M8 6v14M8 9h0" stroke="#05070c" strokeWidth="1.5" />
      <rect x="6" y="10" width="4" height="6" rx="1" fill="#05070c" />
      <path d="M18 5v15" stroke="#05070c" strokeWidth="1.5" />
      <rect x="16" y="7" width="4" height="9" rx="1" fill="#05070c" />
    </svg>
  );
}
