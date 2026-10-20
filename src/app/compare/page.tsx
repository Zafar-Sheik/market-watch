import type { Metadata } from "next";
import { CompareHero } from "@/components/compare/Compare";
import { CompareLevels } from "@/components/compare/CompareLevels";
import { HUD } from "@/components/sections/HUD";
import { CMP_SECTIONS } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Combined: PA × ICT × Order Flow — PA/Academy",
  description: "Price action, ICT/SMC and order flow side by side: the same chart through three lenses, a translation table, similarities, differences and a confluence builder.",
};

export default function ComparePage() {
  return (
    <main className="relative pb-28">
      <HUD chapters={CMP_SECTIONS} tab="all" />
      <CompareHero />
      <CompareLevels />
      <footer className="mx-auto max-w-6xl border-t border-white/10 px-4 pt-8 text-xs leading-relaxed text-slate-500 sm:px-6">
        Educational only — not financial advice. Charts are simulated teaching examples. Backtest any combined approach on your own instrument and session.
      </footer>
    </main>
  );
}
