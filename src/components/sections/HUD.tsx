"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ChevronDown, ChevronUp, Eye, Leaf, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CHAPTERS, XP_TOTAL } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function HUD() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const { xp, done, focus, setFocus, calm, setCalm, lastGain } = useProgress();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: Event) => setActive((e as CustomEvent<string>).detail);
    window.addEventListener("level:active", h);
    return () => window.removeEventListener("level:active", h);
  }, []);

  useEffect(() => {
    document.body.dataset.focus = focus ? "1" : "0";
  }, [focus]);

  const idx = active ? CHAPTERS.findIndex((c) => c.id === active) : -1;
  const jump = (d: number) => {
    const n = CHAPTERS[Math.min(CHAPTERS.length - 1, Math.max(0, idx + d))];
    document.getElementById(idx === -1 && d > 0 ? CHAPTERS[0].id : n.id)?.scrollIntoView({ behavior: "smooth" });
  };

  // keyboard: J / K (or arrows with shift) to hop levels, F for focus mode
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "j") jump(1);
      if (e.key === "k") jump(-1);
      if (e.key === "f") setFocus(!focus);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const cleared = Object.values(done).filter(Boolean).length;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
        <motion.div className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-gold via-bull to-sky" style={{ scaleX }} />
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <a href="#top" className="flex items-center gap-2 font-bold text-white">
            <Logo />
            <span className="hidden sm:inline">
              PA<span className="text-gold">/</span>Academy
            </span>
          </a>

          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {CHAPTERS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                title={c.title}
                className={cn(
                  "relative rounded-lg px-2 py-1 font-mono text-[11px] font-semibold transition",
                  active === c.id ? "text-ink" : done[c.id] ? "text-bull" : "text-slate-500 hover:text-slate-200",
                )}
              >
                {active === c.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-gold" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{c.short}</span>
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Toggle on={focus} onClick={() => setFocus(!focus)} label="Focus" icon={<Eye size={14} />} title="Focus mode (F): fade everything except the current level" />
            <Toggle on={calm} onClick={() => setCalm(!calm)} label="Calm" icon={<Leaf size={14} />} title="Calm mode: turn off decorative animation" />
            <div className="relative flex items-center gap-1.5 rounded-xl border border-gold/30 bg-gold/10 px-3 py-1.5 font-mono text-xs font-bold text-gold">
              <Zap size={13} />
              {xp}
              <span className="hidden text-gold/50 sm:inline">/ {XP_TOTAL} XP</span>
              <AnimatePresence>
                {lastGain && (
                  <motion.span
                    key={lastGain.t}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: 28 }}
                    transition={{ duration: 1.3 }}
                    className="absolute -bottom-2 right-1 text-bull"
                  >
                    +{lastGain.amount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* mobile + desktop level hopper */}
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-ink/85 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <button type="button" onClick={() => jump(-1)} className="rounded-xl p-2 text-slate-300 hover:bg-white/10" aria-label="Previous level (K)">
          <ChevronUp size={18} />
        </button>
        <div className="min-w-[150px] px-2 text-center">
          <div className="font-mono text-[10px] text-slate-500">
            {cleared}/{CHAPTERS.length} CLEARED<span className="hidden sm:inline"> · J/K TO HOP</span>
          </div>
          <div className="truncate text-sm font-semibold text-white">
            {idx >= 0 ? `${CHAPTERS[idx].num} · ${CHAPTERS[idx].short}` : "Start →"}
          </div>
        </div>
        <button type="button" onClick={() => jump(1)} className="rounded-xl bg-gold p-2 text-ink hover:brightness-110" aria-label="Next level (J)">
          <ChevronDown size={18} />
        </button>
      </div>
    </>
  );
}

function Toggle({ on, onClick, label, icon, title }: { on: boolean; onClick: () => void; label: string; icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition",
        on ? "border-violet/60 bg-violet/20 text-violet" : "border-white/10 text-slate-400 hover:text-white",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
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
