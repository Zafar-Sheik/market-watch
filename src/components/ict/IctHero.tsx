"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, Layers } from "lucide-react";
import { useRef } from "react";
import { GlowCard } from "@/components/ui/card-spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerate } from "@/components/ui/text-generate";
import { FLASHCARDS, INTRO, MODULES } from "@/lib/ict/extras";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export function IctHero() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      const path = ref.current?.querySelector<SVGPolylineElement>("[data-mm]");
      const tl = gsap.timeline();
      if (path) {
        const len = path.getTotalLength();
        tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" }, 0.3);
      }
      tl.from("[data-phase]", { opacity: 0, y: 10, stagger: 0.45, duration: 0.5 }, 0.5)
        .from("[data-h] span", { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "expo.out" }, 0)
        .from("[data-fade]", { opacity: 0, y: 18, stagger: 0.1, duration: 0.6 }, 0.5);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} id="top" className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f5c451" />

      <svg className="pointer-events-none absolute inset-x-0 bottom-10 h-[300px] w-full opacity-60" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden>
        <line x1={160} x2={460} y1={210} y2={210} stroke="#ff4d6d" strokeDasharray="6 6" opacity={0.6} />
        <line x1={700} x2={1000} y1={40} y2={40} stroke="#2ee6a6" strokeDasharray="6 6" opacity={0.6} />
        <polyline data-mm fill="none" stroke="#f5c451" strokeWidth={3} points="0,160 80,140 140,170 200,150 260,165 330,262 380,180 460,150 560,110 680,70 820,48 1000,20" />
        {[
          [120, 125, "ACCUMULATION"],
          [330, 290, "MANIPULATION"],
          [520, 150, "DISPLACEMENT"],
          [840, 30, "DISTRIBUTION → BSL"],
        ].map(([x, y, t]) => (
          <text key={t as string} data-phase x={x as number} y={y as number} textAnchor="middle" fontSize={13} fontWeight={800} fill="#f5c451" opacity={0.8} className="font-mono">
            {t}
          </text>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-4 pb-40 pt-36 sm:px-6">
        <div data-fade className="mb-6 flex flex-wrap gap-2 font-mono text-xs font-bold">
          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold">◆ ICT XAUUSD MASTER COURSE — 2026</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-slate-400">30 sections · 12 modules · {FLASHCARDS.length} flashcards · 12 study charts</span>
        </div>
        <h1 data-h className="text-[12vw] font-black leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-[112px]">
          <span className="block overflow-hidden">
            <span className="inline-block">ICT ×</span>
          </span>
          <span className="block overflow-hidden">
            <span className="text-gradient-gold inline-block">Gold.</span>
          </span>
        </h1>
        <TextGenerate className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl" words="Liquidity, structure, PD arrays, time and risk — rebuilt as bite-sized modules, replayable charts, flashcards and drills for XAUUSD." />
        <div data-fade className="mt-6 max-w-2xl rounded-2xl border border-gold/25 bg-gold/[0.05] p-4 text-[15px] text-slate-200">
          <b className="text-gold">Core principle: </b>
          {INTRO.principle}
        </div>
        <div data-fade className="mt-8 flex flex-wrap items-center gap-4">
          <MovingBorderButton as="a" href={`#${MODULES[0].id}`}>
            Start Module 1 <ArrowDown size={18} />
          </MovingBorderButton>
          <a href="#flashcards" className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white">
            <Layers size={16} /> Jump to flashcards
          </a>
        </div>
      </div>
    </div>
  );
}

export function StudyMap() {
  const { claimed, done } = useProgress();
  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-gold">RECOMMENDED LEARNING ORDER</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            {INTRO.order.map((o, i) => (
              <span key={o} className="flex items-center gap-1.5">
                <span className="rounded-md border border-white/10 px-2 py-0.5">{o}</span>
                {i < INTRO.order.length - 1 && <span className="text-gold">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {MODULES.map((m) => {
          const read = m.sections.filter((n) => claimed[`read:ict:${n}`]).length;
          const pct = m.sections.length ? read / m.sections.length : done[m.id] ? 1 : 0;
          return (
            <a key={m.id} href={`#${m.id}`}>
              <GlowCard color={`${m.color}22`} className={cn("h-full p-4 sm:p-4", done[m.id] && "border-bull/40")}>
                <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                  <span style={{ color: m.color }}>{m.num}</span>
                  <span className="text-slate-500">{m.minutes} min</span>
                </div>
                <div className="mt-1 font-bold leading-tight text-white">{m.short}</div>
                <div className="text-xs text-slate-400">{m.blurb}</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct * 100}%`, background: m.color }} />
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-500">
                  {m.sections.length ? `${read}/${m.sections.length} read` : "lab"} {done[m.id] && <span className="text-bull">· cleared</span>}
                </div>
              </GlowCard>
            </a>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">{INTRO.note2026}</p>
    </div>
  );
}
