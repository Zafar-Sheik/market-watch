"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, BookOpen, Check, Dumbbell, GraduationCap, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Section } from "@/lib/ict/sections";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Diagram } from "./Diagram";

const TABS = [
  { k: "course", label: "Course", icon: BookOpen },
  { k: "notes", label: "Deep notes", icon: GraduationCap },
  { k: "gold", label: "Gold", icon: Sparkles },
  { k: "mistakes", label: "Mistakes", icon: AlertTriangle },
  { k: "drill", label: "Drill", icon: Dumbbell },
] as const;
type TabKey = (typeof TABS)[number]["k"];

export const READ_XP = 10;

export function SectionCard({ s, accent, children }: { s: Section; accent: string; children?: React.ReactNode }) {
  const [tab, setTab] = useState<TabKey>("course");
  const { claimed, award } = useProgress();
  const read = !!claimed[`read:ict:${s.n}`];

  return (
    <article id={`ict-s${s.n}`} data-reveal className="overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/80">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] p-4 sm:p-6">
        <div>
          <div className="font-mono text-[11px] font-bold tracking-[0.2em]" style={{ color: accent }}>
            SECTION {s.n} · {s.visual.toUpperCase()}
          </div>
          <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{s.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{s.teaches}</p>
        </div>
        <button
          type="button"
          onClick={() => award(`read:ict:${s.n}`, READ_XP)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition",
            read ? "border-bull/50 bg-bull/15 text-bull" : "border-white/15 text-slate-300 hover:border-gold/60 hover:text-gold",
          )}
        >
          <Check size={14} /> {read ? "Read ✓" : `Mark read +${READ_XP} XP`}
        </button>
      </header>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0 space-y-3">
          <Diagram d={s.diagram} />
          <div className="rounded-2xl border p-4" style={{ borderColor: `${accent}40`, background: `${accent}0c` }}>
            <div className="mb-1 font-mono text-[11px] font-bold tracking-[0.18em]" style={{ color: accent }}>
              KEY TAKEAWAY
            </div>
            <p className="text-[15px] leading-relaxed text-slate-100">{s.takeaway}</p>
          </div>
        </div>

        <div className="min-w-0">
          <div className="-mx-1 mb-3 flex gap-1 overflow-x-auto px-1">
            {TABS.map(({ k, label, icon: Icon }) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition",
                  tab === k ? "text-ink" : "text-slate-400 hover:text-white",
                )}
              >
                {tab === k && <motion.span layoutId={`tab-${s.n}`} className="absolute inset-0 rounded-lg" style={{ background: accent }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <Icon size={13} className="relative" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="max-h-[440px] space-y-3 overflow-y-auto pr-1">
              {tab === "course" &&
                s.course.map((b) => (
                  <div key={b.h} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="mb-1.5 text-sm font-bold text-white">{b.h}</div>
                    <Bullets items={b.items} color={accent} />
                  </div>
                ))}
              {tab === "notes" && <Bullets items={s.notes} color={accent} />}
              {tab === "gold" && (
                <div className="rounded-xl border border-gold/30 bg-gold/[0.06] p-3">
                  <div className="mb-1 font-mono text-[11px] font-bold text-gold">◆ GOLD / XAUUSD APPLICATION</div>
                  <Bullets items={s.gold} color="#f5c451" />
                </div>
              )}
              {tab === "mistakes" && (
                <div className="space-y-1.5">
                  {s.mistakes.map((m) => (
                    <div key={m} className="flex gap-2 rounded-xl border border-bear/25 bg-bear/[0.06] p-3 text-sm text-slate-200">
                      <span className="font-black text-bear">✕</span> {m}
                    </div>
                  ))}
                </div>
              )}
              {tab === "drill" && (
                <div className="rounded-xl border border-violet/30 bg-violet/[0.07] p-4">
                  <div className="mb-1 font-mono text-[11px] font-bold text-violet">PRACTICAL STUDY DRILL</div>
                  <p className="text-[15px] leading-relaxed text-slate-100">{s.drill}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {children && <div className="border-t border-white/[0.06] p-4 sm:p-6">{children}</div>}
    </article>
  );
}

export function Bullets({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
