"use client";

import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/card-spotlight";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Logo } from "./HUD";

const CHECK = [
  "HTF bias marked (4H / 1H): bullish, bearish or no-trade?",
  "Key levels drawn: PDH/PDL, Asian high/low, session highs/lows, round numbers",
  "Economic calendar checked — no tier-1 news in the next 15 min",
  "I'm inside a killzone (London / NY AM / US30 cash open)",
  "Liquidity has been swept — or I know which pool price is drawing to",
  "Structure shift (CHoCH / BOS) on my entry timeframe",
  "Entry at a POI: OB, FVG or retested level — in discount (longs) / premium (shorts)",
  "Stop beyond the sweep / structure. Size calculated from the stop",
  "Target = opposite liquidity, at least 2R",
  "I'm calm, not chasing, not revenge trading. Daily loss limit not hit",
];

const KEY = "pa-academy-checklist";

export function Outro() {
  const [ticks, setTicks] = useState<boolean[]>(CHECK.map(() => false));
  const { reset, xp } = useProgress();
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTicks(JSON.parse(raw));
    } catch {}
  }, []);
  const toggle = (i: number) => {
    const n = ticks.map((v, k) => (k === i ? !v : v));
    setTicks(n);
    try {
      localStorage.setItem(KEY, JSON.stringify(n));
    } catch {}
  };
  const count = ticks.filter(Boolean).length;
  const go = count === CHECK.length;

  return (
    <div id="checklist" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">TAKE THIS TO YOUR CHARTS</div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">The pre-trade checklist</h2>
          <p className="mt-2 text-slate-400">Tick it before every trade. If one box is empty, the answer is &quot;not yet&quot;. Saved on this device.</p>
          <div className="mt-6 space-y-2">
            {CHECK.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition",
                  ticks[i] ? "border-bull/40 bg-bull/10" : "border-white/10 bg-white/[0.02] hover:border-white/25",
                )}
              >
                <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border", ticks[i] ? "border-bull bg-bull text-ink" : "border-white/25")}>
                  {ticks[i] && <Check size={15} strokeWidth={3} />}
                </span>
                <span className={cn("text-[15px]", ticks[i] ? "text-white" : "text-slate-300")}>{c}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div
              className={cn(
                "flex-1 rounded-2xl border p-4 text-center text-lg font-black transition",
                go ? "border-bull bg-bull/20 text-bull" : "border-white/10 text-slate-500",
              )}
            >
              {go ? "✅ CLEARED TO TRADE" : `${count}/${CHECK.length} — NOT YET`}
            </div>
            <button
              type="button"
              onClick={() => {
                const n = CHECK.map(() => false);
                setTicks(n);
                try {
                  localStorage.setItem(KEY, JSON.stringify(n));
                } catch {}
              }}
              className="rounded-2xl border border-white/10 p-4 text-slate-400 hover:text-white"
              aria-label="Clear checklist"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">ONE-SCREEN RECAP</div>
          <h3 className="mb-4 text-2xl font-bold text-white">The whole course in 8 cards</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Candle", "Body = winner. Wick = rejection."],
              ["Confirm", "Pattern AT a level, after close."],
              ["Structure", "HH/HL buy. LH/LL sell."],
              ["BOS / CHoCH", "With trend = BOS. Against = CHoCH."],
              ["Liquidity", "Stops above highs, below lows."],
              ["OB / FVG", "Where size entered. Price returns."],
              ["P / D", "Buy discount. Sell premium. OTE 62–79."],
              ["Risk", "1% max. 2R min. 2 losses = done."],
            ].map(([t, d], i) => (
              <GlowCard key={t} className="p-4 sm:p-4">
                <div className="font-mono text-[10px] font-bold text-slate-500">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-bold text-white">{t}</div>
                <div className="text-xs leading-relaxed text-slate-400">{d}</div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-24 border-t border-white/10 pt-8 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <Logo /> PA<span className="text-gold">/</span>Academy
            <span className="ml-2 font-mono text-xs font-normal text-gold">{xp} XP</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all XP and level progress?")) reset();
            }}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs hover:text-white"
          >
            Reset progress
          </button>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed">
          Educational content only — not financial advice. Charts on this site are simplified, illustrative examples, not real
          market data. Trading leveraged products such as CFDs on gold and indices carries a high risk of losing money rapidly.
          Session times are approximate; always confirm with your broker and an economic calendar. Practise on a demo account
          and backtest before risking capital.
        </p>
      </footer>
    </div>
  );
}
