import type { Metadata } from "next";
import { Flashcards } from "@/components/ict/Flashcards";
import { OFCheat, OFHero, OFLevels } from "@/components/of/OFLevels";
import { HUD } from "@/components/sections/HUD";
import { OF_FLASH, OF_LEVELS } from "@/lib/of/content";

export const metadata: Metadata = {
  title: "Order Flow — PA/Academy",
  description: "Order flow for beginners: the auction, DOM, tape, delta, footprint, absorption, volume profile, VWAP and setups — interactive and ADHD-friendly.",
};

export default function OrderFlowPage() {
  return (
    <main className="relative pb-28">
      <HUD chapters={OF_LEVELS} tab="of" subs={{ "of-boss": [{ id: "of-flash", label: "Flash deck & recap" }] }} />
      <OFHero />
      <OFLevels />
      <section id="of-flash" className="relative mx-auto max-w-6xl space-y-8 px-4 py-20 sm:px-6">
        <div>
          <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-sky">SPACED REPETITION</div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Order flow flash deck</h2>
          <p className="mt-2 max-w-2xl text-slate-400">Space flips, 1 = again, 2 = got it. Three boxes = mastered.</p>
        </div>
        <Flashcards cards={OF_FLASH} storageKey="of-flash" xpKey="of" id="of-flash-deck" />
        <OFCheat />
      </section>
      <footer className="mx-auto max-w-6xl border-t border-white/10 px-4 pt-8 text-xs leading-relaxed text-slate-500 sm:px-6">
        Educational only — not financial advice. Order-flow charts and the order book here are simulations for learning, not live market data.
      </footer>
    </main>
  );
}
