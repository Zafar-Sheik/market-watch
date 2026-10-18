"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, VIOLET, type HLine, type Marker, type Zone } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { chain, type Candle } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";
import { cn } from "@/lib/utils";

type Trade = { at: number; entry: number; sl: number; tp: number };
type Model = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  candles: Candle[];
  steps: Step[];
  zones: Zone[];
  lines: HLine[];
  markers: Marker[];
  highlight: { at: number; idx: number[] }[];
  trade: Trade;
  rules: string[];
  bestFor: string;
};

/* ── Model A: Sweep → CHoCH → FVG ─────────────────────────────── */
const A = chain(85, [
  [83, 0.4, 0.4], [84, 0.3, 0.3], [81, 0.3, 0.4], [82, 0.4, 0.3], [79, 0.3, 0.4], [80, 0.4, 0.3], [77, 0.3, 0.3], [78.3, 0.3, 0.3],
  [75.5, 0.3, 0.4], [76.5, 0.3, 0.3], [75.3, 0.3, 0.25], [76, 0.2, 0.3], [75.4, 0.2, 2.0], [77.4, 0.2, 0.1], [79.6, 0.3, 0.1],
  [80.4, 0.3, 0.3], [79, 0.3, 0.3], [77.6, 0.2, 0.9], [79.5, 0.3, 0.2], [81.5, 0.4, 0.3], [83.5, 0.4, 0.3], [85.6, 0.4, 0.3], [86.4, 0.3, 0.4],
]);
const aFvgTop = A[14].l;
const aFvgBot = A[12].h;
const aCE = (aFvgTop + aFvgBot) / 2;

/* ── Model B: Break & Retest ───────────────────────────────────── */
const B = chain(70, [
  [72, 0.5, 0.5], [74.5, 0.3, 0.4], [73, 0.4, 0.4], [71.5, 0.3, 0.5], [73.5, 0.4, 0.3], [74.6, 0.2, 0.4], [73.2, 0.3, 0.4], [72.5, 0.3, 0.4],
  [74, 0.3, 0.3], [77, 0.3, 0.2], [78.2, 0.5, 0.3], [77, 0.3, 0.3], [75.6, 0.3, 0.4], [76.2, 0.2, 1.4], [77.8, 0.4, 0.2], [79, 0.5, 0.3],
  [80.5, 0.4, 0.4], [82, 0.5, 0.3], [83.5, 0.4, 0.4],
]);

/* ── Model C: HTF POI + LTF CHoCH ──────────────────────────────── */
const C = chain(84, [
  [82, 0.4, 0.4], [83, 0.4, 0.3], [80, 0.3, 0.4], [81, 0.4, 0.3], [78, 0.3, 0.4], [79, 0.4, 0.3], [76, 0.3, 0.4], [74, 0.3, 0.3],
  [72.5, 0.3, 0.4], [73.4, 0.3, 0.3], [71.6, 0.3, 0.5], [71.3, 0.2, 0.3], [74.5, 0.2, 0.1], [75.4, 0.3, 0.2], [74.3, 0.3, 0.3],
  [73.8, 0.2, 0.7], [75.5, 0.3, 0.2], [77.5, 0.3, 0.3], [79.5, 0.4, 0.3], [81.5, 0.4, 0.3], [83.6, 0.4, 0.3],
]);
const cFvgTop = C[13].l;
const cFvgBot = C[11].h;

const MODELS: Model[] = [
  {
    id: "sweep",
    name: "Sweep → CHoCH → FVG",
    tagline: "The smart-money reversal. Trap first, then ride.",
    color: GOLD,
    candles: A,
    zones: [{ from: 13, top: aFvgTop, bottom: aFvgBot, color: GOLD, label: "FVG", extend: true, showAt: 14 }],
    lines: [
      { price: 75.05, from: 8, to: 12, color: BEAR, dashed: true, label: "equal lows (SSL)", labelSide: "left", showAt: 10 },
      { price: A[7].h, from: 7, to: 14, color: GOLD, label: "CHoCH", showAt: 14 },
      { price: A[0].h, from: 0, color: SKY, dashed: true, label: "BSL target", labelSide: "left" },
    ],
    markers: [{ i: 12, price: A[12].l, label: "SWEEP", color: BEAR, pos: "below", showAt: 12 }],
    highlight: [{ at: 13, idx: [12] }, { at: 15, idx: [13, 14] }],
    trade: { at: 17, entry: aCE, sl: A[12].l - 0.3, tp: A[0].h },
    steps: [
      { at: 12, title: "Context", text: "Downtrend into a clean pair of equal lows. That's a pool of sell-side liquidity. We do NOT buy here — we wait.", color: BEAR },
      { at: 13, title: "The sweep", text: "A wick spikes below the equal lows and closes back above. Sellers' stops are fuel; the trap is set.", color: BEAR },
      { at: 15, title: "Displacement + CHoCH", text: "Two big green bodies close above the last lower high = CHoCH, leaving a fair value gap behind. Now we have a reason to buy.", color: GOLD },
      { at: 17, title: "Set the limit", text: "Place a buy limit at the FVG's 50% (CE). Stop below the sweep wick. Target the old high (buy-side liquidity).", color: GOLD },
      { at: 18, title: "Filled", text: "Price retraces into the gap and fills you. Hands off the mouse. The plan is the plan.", color: BULL },
      { at: A.length, title: "Target hit", text: "Price runs to the buy-side liquidity above the old high. Sell-side to buy-side — liquidity to liquidity.", color: BULL },
    ],
    rules: ["Liquidity swept (equal lows, Asia low, PDL)", "Displacement closes through structure (CHoCH)", "Enter on FVG retrace (CE)", "SL beyond sweep · TP opposite liquidity"],
    bestFor: "Gold at London & NY open — it sweeps the Asian range constantly.",
  },
  {
    id: "retest",
    name: "Break & Retest",
    tagline: "Pure price action. Simple, mechanical, ADHD-proof.",
    color: SKY,
    candles: B,
    zones: [{ from: 1, top: 74.85, bottom: 74.0, color: BEAR, label: "resistance → support", extend: true }],
    lines: [],
    markers: [
      { i: 9, price: B[9].h, label: "BREAK", color: BULL, showAt: 9 },
      { i: 13, price: B[13].l, label: "hammer ✓", color: GOLD, pos: "below", showAt: 13 },
    ],
    highlight: [{ at: 10, idx: [9] }, { at: 14, idx: [13] }],
    trade: { at: 13, entry: B[13].c, sl: B[13].l - 0.3, tp: B[13].c + 3 * (B[13].c - (B[13].l - 0.3)) },
    steps: [
      { at: 9, title: "A level that matters", text: "Two clear rejections from the same zone. Mark it.", color: BEAR },
      { at: 10, title: "The break", text: "A strong body CLOSES above the zone. Not a wick — a close. Don't chase it.", color: BULL },
      { at: 13, title: "The retest", text: "Price returns to the old resistance from above. This is the moment. Watch the candle that prints here.", color: GOLD },
      { at: 14, title: "Confirmation → entry", text: "A hammer rejects the zone. Enter at its close, stop under its wick, target 3R.", color: BULL },
      { at: B.length, title: "3R", text: "Continuation. Same setup works short at broken support. Works beautifully on US30 around round numbers.", color: BULL },
    ],
    rules: ["Clear level, 2+ touches", "Body close beyond the level", "Retest + confirmation candle (pin / engulf)", "SL beyond the confirmation wick · fixed 2–3R"],
    bestFor: "US30 in the first 90 min of NY cash, around 000/500 levels and the prior day high/low.",
  },
  {
    id: "htf",
    name: "HTF POI + LTF CHoCH",
    tagline: "Sniper entry. Big-timeframe zone, small-timeframe trigger.",
    color: VIOLET,
    candles: C,
    zones: [
      { from: 0, top: 72.6, bottom: 70.2, color: VIOLET, label: "4H DEMAND (POI)", extend: true },
      { from: 12, top: cFvgTop, bottom: cFvgBot, color: GOLD, label: "1m FVG", extend: true, showAt: 13 },
    ],
    lines: [{ price: C[9].h, from: 9, to: 12, color: GOLD, label: "LTF CHoCH", showAt: 12 }],
    markers: [],
    highlight: [{ at: 13, idx: [12] }],
    trade: { at: 14, entry: cFvgTop - 0.2, sl: 70.0, tp: C[1].h },
    steps: [
      { at: 6, title: "HTF bias + POI", text: "On the 4H, price is bullish and pulling back into a demand zone / order block you marked before the session.", color: VIOLET },
      { at: 11, title: "Drop to the 1–5m", text: "Inside the zone, the lower timeframe is still bearish. Don't buy a falling knife — wait for it to turn.", color: BEAR },
      { at: 13, title: "LTF CHoCH", text: "A displacement candle breaks the last 1m lower high. The small timeframe now agrees with the big one.", color: GOLD },
      { at: 15, title: "Entry on the retrace", text: "Buy the 1m FVG. Stop below the 4H zone. Because the stop is tiny relative to the target, R:R is huge.", color: BULL },
      { at: C.length, title: "Run", text: "Price returns to the HTF high. A 4H move with a 1m stop — that's the whole point of top-down analysis.", color: BULL },
    ],
    rules: ["Marked HTF POI in direction of bias", "Price taps POI, LTF still bearish", "LTF CHoCH + FVG/OB", "SL under POI · TP HTF high/liquidity"],
    bestFor: "Both. Gold 4H → 1m, US30 1H → 1m. Highest R:R, needs the most patience.",
  },
];

export function L10Entries() {
  const ch = CHAPTERS[9];
  const [k, setK] = useState(0);
  return (
    <Level
      chapter={ch}
      accent={GOLD}
      tldr={[
        "An entry model = a repeatable checklist: context → trigger → entry → stop → target.",
        "Pick ONE model. Master it. Ignore everything that isn't it.",
        "No model setup = no trade. Boredom is part of the job.",
      ]}
    >
      <div data-reveal className="flex flex-wrap gap-2">
        {MODELS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setK(i)}
            className={cn(
              "flex-1 rounded-2xl border p-4 text-left transition sm:min-w-[220px]",
              i === k ? "bg-white/[0.04]" : "border-white/10 opacity-60 hover:opacity-100",
            )}
            style={i === k ? { borderColor: `${m.color}88`, boxShadow: `0 0 40px -12px ${m.color}` } : undefined}
          >
            <div className="font-mono text-[11px] font-bold" style={{ color: m.color }}>
              MODEL {"ABC"[i]}
            </div>
            <div className="font-bold text-white">{m.name}</div>
            <div className="text-xs text-slate-400">{m.tagline}</div>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={MODELS[k].id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <ModelView m={MODELS[k]} />
        </motion.div>
      </AnimatePresence>
      <Callout kind="warn">
        These are simplified, idealised examples so the logic is easy to see. Real charts are messier. Backtest any model on
        at least 50–100 historical setups on YOUR instrument and session before risking real money.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="In Model A, what has to happen BEFORE you're allowed to look for the FVG entry?"
        options={["Price touches a round number", "A sweep of liquidity AND a CHoCH with displacement", "RSI is oversold", "Three green candles in a row"]}
        answer={1}
        explain="Sweep + CHoCH is the 'proof'. Without it, an FVG in a downtrend is just a place sellers reload."
      />
    </Level>
  );
}

function ModelView({ m }: { m: Model }) {
  const p = usePlayer(m.steps);
  const t = m.trade;
  const showTrade = p.visible > t.at;
  const r = (Math.abs(t.tp - t.entry) / Math.abs(t.entry - t.sl)).toFixed(1);
  const zones: Zone[] = [...m.zones];
  const lines: HLine[] = [...m.lines];
  if (p.visible >= t.at) {
    zones.push(
      { from: t.at, top: t.tp, bottom: t.entry, color: BULL, label: `TP · ${r}R`, extend: true },
      { from: t.at, top: t.entry, bottom: t.sl, color: BEAR, label: "SL", extend: true, labelPos: "bottom" },
    );
    lines.push({ price: t.entry, from: t.at, color: "#e2e8f0", label: showTrade ? "ENTRY ✓" : "LIMIT", labelSide: "left" });
  }
  const hl = [...m.highlight].reverse().find((h) => p.visible >= h.at)?.idx ?? [];
  return (
    <Panel className="!mt-4">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="rounded-2xl bg-black/30 p-2">
            <CandleChart candles={m.candles} visible={p.visible} zones={zones} lines={lines} markers={m.markers} highlight={hl} height={380} axis={false} rightPad={4} />
          </div>
          <PlayerControls p={p} steps={m.steps} />
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 font-mono text-[11px] font-bold tracking-widest" style={{ color: m.color }}>
              THE CHECKLIST
            </div>
            <ol className="space-y-2">
              {m.rules.map((x, i) => (
                <li key={x} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-ink" style={{ background: m.color }}>
                    {i + 1}
                  </span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <MiniStat label="RISK" value="1R" color={BEAR} />
            <MiniStat label="REWARD" value={`${r}R`} color={BULL} />
            <MiniStat label="WIN % TO BREAK EVEN" value={`${Math.round(100 / (1 + +r))}%`} color={GOLD} />
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-sm text-slate-300">
            <span className="font-mono text-[11px] font-bold text-slate-500">BEST FOR · </span>
            {m.bestFor}
          </div>
          <Btn onClick={() => p.goto(m.steps.length - 1)} className="w-full justify-center">
            Skip to the result
          </Btn>
        </div>
      </div>
    </Panel>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2">
      <div className="text-[9px] leading-tight text-slate-500">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
