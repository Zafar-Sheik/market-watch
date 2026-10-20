"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Brain, Gamepad2, Timer, Trophy } from "lucide-react";
import { useMemo, useRef } from "react";
import { GlowCard } from "@/components/ui/card-spotlight";
import { Meteors } from "@/components/ui/meteors";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerate } from "@/components/ui/text-generate";
import { fromPath } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const candles = useMemo(
    () =>
      fromPath(
        [
          [0, 40],
          [8, 62],
          [13, 50],
          [20, 78],
          [24, 70],
          [27, 64],
          [33, 95],
          [37, 86],
          [44, 118],
        ],
        { seed: 11, noise: 0.5, wick: 0.9 },
      ),
    [],
  );
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const H = 420;
  const y = (p: number) => H - 20 - ((p - min) / (max - min)) * (H - 60);

  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      const tl = gsap.timeline();
      tl.from("[data-candle]", {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "50% 100%",
        stagger: 0.035,
        duration: 0.5,
        ease: "back.out(2)",
      })
        .from("[data-hero-title] span", { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "expo.out" }, 0.2)
        .from("[data-hero-fade]", { y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" }, 0.7);

      gsap.to("[data-candles]", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} id="top" className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f5c451" />
      <Meteors number={16} />

      {/* animated chart backdrop */}
      <svg
        data-candles
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] w-full opacity-40"
        viewBox={`0 0 ${candles.length * 24} ${H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {candles.map((c, i) => {
          const bull = c.c >= c.o;
          const col = bull ? "#2ee6a6" : "#ff4d6d";
          return (
            <g key={i} data-candle>
              <line x1={i * 24 + 12} x2={i * 24 + 12} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={1.5} />
              <rect
                x={i * 24 + 5}
                width={14}
                y={y(Math.max(c.o, c.c))}
                height={Math.max(2, Math.abs(y(c.o) - y(c.c)))}
                fill={col}
                rx={2}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-36 sm:px-6">
        <div data-hero-fade className="mb-6 flex flex-wrap gap-2 font-mono text-xs font-bold">
          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold">◆ XAUUSD</span>
          <span className="rounded-full border border-sky/40 bg-sky/10 px-3 py-1 text-sky">▲ US30</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-slate-400">
            {CHAPTERS.length} levels · ~{CHAPTERS.reduce((s, c) => s + c.minutes, 0)} min
          </span>
        </div>
        <h1 data-hero-title className="text-[13vw] font-black leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-[124px]">
          <span className="block overflow-hidden">
            <span className="inline-block">Read the</span>
          </span>
          <span className="block overflow-hidden">
            <span className="text-gradient-gold inline-block">candles.</span>
          </span>
          <span className="block overflow-hidden">
            <span className="inline-block text-slate-500">Not the noise.</span>
          </span>
        </h1>
        <TextGenerate
          className="mt-8 max-w-2xl text-lg text-slate-300 sm:text-xl"
          words="An interactive price action + smart money course built for gold and Dow traders. Short levels. Real charts you can poke. Zero walls of text."
        />
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <MovingBorderButton as="a" href={`#${CHAPTERS[0].id}`}>
            Start Level 01 <ArrowDown size={18} />
          </MovingBorderButton>
          <a href="#boss" className="text-sm font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline">
            Already know stuff? Skip to the Final Boss →
          </a>
          <a href="/ict-gold" className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-bold text-gold hover:bg-gold/20">
            ◆ New: ICT Gold course →
          </a>
        </div>
      </div>
    </div>
  );
}

const HOW = [
  { icon: Timer, title: "2–6 minute levels", text: "Every level has a time tag. Do one. Take a break. Come back. Progress saves itself.", color: "#f5c451" },
  { icon: Brain, title: "TL;DR first", text: "The 3 things that matter are at the top of every level. Everything else is the fun part.", color: "#2ee6a6" },
  { icon: Gamepad2, title: "Poke the charts", text: "Drag, click, replay. Your brain remembers what your hands did, not what your eyes skimmed.", color: "#60a5fa" },
  { icon: Trophy, title: "Earn XP", text: "Quick checks give XP and clear the level. Wrong answers cost nothing. Ever.", color: "#a78bfa" },
];

export function HowItWorks() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Built for brains that hate boring.</h2>
        <p className="hidden max-w-sm text-right text-sm text-slate-500 md:block">
          Tip: hit <Kbd>F</Kbd> for Focus mode, <Kbd>J</Kbd>/<Kbd>K</Kbd> to hop levels.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW.map(({ icon: Icon, title, text, color }) => (
          <GlowCard key={title} color={`${color}22`}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${color}1a`, color }}>
              <Icon size={22} />
            </div>
            <h3 className="mb-1.5 text-lg font-bold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{text}</p>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-slate-200">{children}</kbd>
  );
}
