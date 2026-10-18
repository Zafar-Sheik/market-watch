"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Chapter } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Level({
  chapter,
  tldr,
  children,
  accent = "#f5c451",
}: {
  chapter: Chapter;
  tldr: string[];
  children: React.ReactNode;
  accent?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { done } = useProgress();

  // mark the level that's currently in the middle of the viewport (focus mode + nav use this)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        el.dataset.active = e.isIntersecting ? "1" : "0";
        if (e.isIntersecting) window.dispatchEvent(new CustomEvent("level:active", { detail: chapter.id }));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [chapter.id]);

  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      gsap.from("[data-head] > *", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current).forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.fromTo(
        "[data-numeral]",
        { yPercent: 20 },
        {
          yPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      id={chapter.id}
      ref={ref}
      data-level
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
    >
      <div
        data-numeral
        aria-hidden
        className="pointer-events-none absolute -top-6 right-2 select-none font-mono text-[120px] font-black leading-none text-white/[0.035] sm:text-[220px]"
      >
        {chapter.num}
      </div>
      <header data-head className="relative mb-10 max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span
            className="rounded-full border px-3 py-1 font-bold"
            style={{ borderColor: `${accent}55`, color: accent, background: `${accent}10` }}
          >
            LEVEL {chapter.num}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-slate-400">
            <Clock size={12} /> {chapter.minutes} min
          </span>
          {done[chapter.id] && (
            <span className="flex items-center gap-1 rounded-full border border-bull/40 bg-bull/10 px-3 py-1 text-bull">
              <Zap size={12} /> cleared
            </span>
          )}
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{chapter.title}</h2>
        <TLDR items={tldr} accent={accent} />
      </header>
      <div className="relative space-y-8">{children}</div>
    </section>
  );
}

export function TLDR({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em]" style={{ color: accent }}>
        TL;DR — IF YOU ONLY READ THIS
      </div>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 text-base text-slate-200 sm:text-lg">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Callout({
  kind,
  children,
  className,
}: {
  kind: "gold" | "us30" | "warn" | "pro";
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    gold: { label: "XAUUSD TIP", color: "#f5c451", icon: "◆" },
    us30: { label: "US30 TIP", color: "#60a5fa", icon: "▲" },
    warn: { label: "TRAP ALERT", color: "#ff4d6d", icon: "!" },
    pro: { label: "PRO MOVE", color: "#a78bfa", icon: "✦" },
  }[kind];
  return (
    <div
      data-reveal
      className={cn("flex gap-3 rounded-2xl border p-4", className)}
      style={{ borderColor: `${map.color}40`, background: `${map.color}0d` }}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-black text-ink"
        style={{ background: map.color }}
      >
        {map.icon}
      </div>
      <div>
        <div className="mb-0.5 font-mono text-[11px] font-bold tracking-[0.18em]" style={{ color: map.color }}>
          {map.label}
        </div>
        <div className="text-[15px] leading-relaxed text-slate-300">{children}</div>
      </div>
    </div>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-reveal className={cn("rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}

export function PanelTitle({ kicker, title, hint }: { kicker?: string; title: string; hint?: string }) {
  return (
    <div className="mb-4">
      {kicker && <div className="mb-1 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">{kicker}</div>}
      <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
      {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  active,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition active:scale-95 disabled:opacity-40",
        active
          ? "border-gold/60 bg-gold/15 text-gold"
          : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/25 hover:bg-white/[0.06]",
        className,
      )}
    >
      {children}
    </button>
  );
}
