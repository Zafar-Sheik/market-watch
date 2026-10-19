import type { Metadata } from "next";
import { Flashcards } from "@/components/ict/Flashcards";
import { IctHero, StudyMap } from "@/components/ict/IctHero";
import { ICTModules } from "@/components/ict/Modules";
import { HUD } from "@/components/sections/HUD";
import { INTRO, MODULES } from "@/lib/ict/extras";

export const metadata: Metadata = {
  title: "ICT Gold — XAUUSD Master Course | PA/Academy",
  description:
    "The ICT XAUUSD Master Course as interactive modules: liquidity, structure, PD arrays, Silver Bullet, SMT, Gold execution models, risk, flashcards and a backtest journal.",
};

export default function IctGoldPage() {
  return (
    <main className="relative pb-28">
      <HUD chapters={MODULES} tab="ict" />
      <IctHero />
      <StudyMap />
      <ICTModules />
      <section id="flashcards" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mb-6">
          <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-gold">SPACED REPETITION</div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Flash deck</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Every glossary term, core sequence, Gold fact and myth from the course. &quot;Again&quot; sends a card back; &quot;Got it&quot; moves
            it up a box. Three boxes = mastered. Space flips, 1/2 grade.
          </p>
        </div>
        <Flashcards />
      </section>
      <footer className="mx-auto max-w-6xl border-t border-white/10 px-4 pt-8 text-xs leading-relaxed text-slate-500 sm:px-6">
        <p className="max-w-3xl">{INTRO.disclaimer}</p>
        <p className="mt-2 max-w-3xl">
          Charts are synthetic teaching examples, not historical price data. Educational only — not financial advice. Hypothetical or
          simulated performance does not guarantee future results.
        </p>
      </footer>
    </main>
  );
}
