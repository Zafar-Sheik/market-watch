"use client";

import { ArrowDown } from "lucide-react";
import { useMemo, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, VIOLET, type Marker, type Segment } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { fromPath, labelStructure, pivots } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

const SCENARIOS = {
  Uptrend: {
    path: [[0, 40], [5, 55], [9, 47], [15, 66], [19, 58], [25, 80], [29, 70], [35, 94], [39, 85], [43, 100]] as [number, number][],
    verdict: "Higher highs + higher lows. Buyers are in charge. Look for BUYS at higher lows.",
    color: BULL,
  },
  Downtrend: {
    path: [[0, 100], [5, 84], [9, 92], [15, 72], [19, 81], [25, 60], [29, 70], [35, 48], [39, 57], [43, 40]] as [number, number][],
    verdict: "Lower highs + lower lows. Sellers are in charge. Look for SELLS at lower highs.",
    color: BEAR,
  },
  Range: {
    path: [[0, 60], [5, 82], [10, 56], [16, 83], [21, 57], [27, 81], [32, 55], [38, 82], [43, 64]] as [number, number][],
    verdict: "Equal-ish highs and lows. Nobody's winning. Trade the edges or wait for a break — and notice all that liquidity piling up at both ends.",
    color: GOLD,
  },
};
type Key = keyof typeof SCENARIOS;

export function L03Structure() {
  const ch = CHAPTERS[2];
  return (
    <Level
      chapter={ch}
      accent={SKY}
      tldr={[
        "Uptrend = higher highs (HH) + higher lows (HL). Downtrend = lower highs (LH) + lower lows (LL).",
        "Trade WITH structure: buy higher lows, sell lower highs.",
        "Higher timeframe = direction. Lower timeframe = entry.",
      ]}
    >
      <StructureXray />
      <MTF />
      <Callout kind="us30">
        US30 trends hard during the NY cash session. If the 1H is printing HH/HL into the open, fading it because it &quot;looks
        too high&quot; is how accounts die. Let structure — not your opinion — tell you when it&apos;s over.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="Price makes a new high, pulls back, and the pullback low is ABOVE the previous low. What is that low?"
        options={["Lower low (LL)", "Higher low (HL)", "Lower high (LH)", "A breakout"]}
        answer={1}
        explain="Higher low. HH + HL = uptrend intact. That HL is exactly where trend traders look to buy."
      />
    </Level>
  );
}

function StructureXray() {
  const [key, setKey] = useState<Key>("Uptrend");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [zig, setZig] = useState(true);
  const sc = SCENARIOS[key];
  const candles = useMemo(() => fromPath(sc.path, { seed: key.length * 3, noise: 0.15, wick: 0.5 }), [sc]);
  const pv = useMemo(() => labelStructure(pivots(candles, 2)), [candles]);

  const markers: Marker[] = pv
    .filter((p) => p.label && revealed.has(p.i))
    .map((p) => ({
      i: p.i,
      price: p.price,
      label: p.label!,
      pos: p.kind === "high" ? "above" : "below",
      color: p.label === "HH" || p.label === "HL" ? BULL : BEAR,
    }));
  const segments: Segment[] = zig
    ? pv.slice(1).map((p, k) => ({ a: [pv[k].i, pv[k].price], b: [p.i, p.price], color: "#ffffff55", width: 1.4 }))
    : [];
  const labelled = pv.filter((p) => p.label);
  const all = labelled.every((p) => revealed.has(p.i));

  return (
    <Panel>
      <PanelTitle kicker="X-RAY" title="See the skeleton under the candles" hint="Tap each glowing dot to reveal its label. Say it in your head first." />
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as Key[]).map((k) => (
          <Btn
            key={k}
            active={k === key}
            onClick={() => {
              setKey(k);
              setRevealed(new Set());
            }}
          >
            {k}
          </Btn>
        ))}
        <span className="mx-1 hidden w-px bg-white/10 sm:block" />
        <Btn onClick={() => setZig(!zig)} active={zig}>
          Zig-zag
        </Btn>
        <Btn onClick={() => setRevealed(new Set(all ? [] : labelled.map((p) => p.i)))}>{all ? "Hide labels" : "Reveal all"}</Btn>
      </div>
      <div className="relative rounded-2xl bg-black/30 p-2">
        <CandleChart candles={candles} height={340} markers={markers} segments={segments} axis={false}>
          {({ x, y }) =>
            labelled
              .filter((p) => !revealed.has(p.i))
              .map((p) => (
                <g
                  key={p.i}
                  className="cursor-pointer"
                  onClick={() => setRevealed((s) => new Set(s).add(p.i))}
                >
                  <circle cx={x(p.i)} cy={y(p.price) + (p.kind === "high" ? -12 : 12)} r={14} fill="transparent" />
                  <circle cx={x(p.i)} cy={y(p.price) + (p.kind === "high" ? -12 : 12)} r={6} fill={GOLD}>
                    <animate attributeName="opacity" values="1;0.35;1" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))
          }
        </CandleChart>
      </div>
      <div
        className="mt-3 rounded-2xl border p-4 text-[15px] text-slate-200 transition-opacity"
        style={{ borderColor: `${sc.color}50`, background: `${sc.color}0d`, opacity: all ? 1 : 0.45 }}
      >
        <b style={{ color: sc.color }}>{all ? `${key}: ` : "Reveal all labels to unlock the verdict… "}</b>
        {all && sc.verdict}
      </div>
    </Panel>
  );
}

const TF = [
  { tf: "Daily / 4H", job: "BIAS", text: "Which way is the river flowing? Mark the big swing highs/lows and the trend.", color: VIOLET },
  { tf: "1H / 15m", job: "POINT OF INTEREST", text: "Where do I want to trade? Order blocks, FVGs, liquidity pools in the direction of bias.", color: GOLD },
  { tf: "5m / 1m", job: "ENTRY TRIGGER", text: "Is it happening NOW? Wait for a lower-timeframe CHoCH + confirmation candle at the POI.", color: BULL },
];

function MTF() {
  return (
    <Panel>
      <PanelTitle kicker="TOP-DOWN" title="The 3-timeframe stack" hint="Every pro trader does a version of this. It takes 5 minutes before the session." />
      <div className="grid gap-3 md:grid-cols-3">
        {TF.map((t, i) => (
          <div key={t.tf} className="relative rounded-2xl border p-4" style={{ borderColor: `${t.color}40`, background: `${t.color}0a` }}>
            <div className="font-mono text-[11px] font-bold tracking-widest" style={{ color: t.color }}>
              {i + 1} · {t.job}
            </div>
            <div className="mt-1 text-xl font-bold text-white">{t.tf}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{t.text}</p>
            {i < 2 && (
              <ArrowDown className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink p-1 text-slate-500 md:hidden" size={26} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Rule of thumb: the entry timeframe is roughly <b className="text-slate-200">1/4 to 1/16</b> of your bias timeframe. Gold
        day-traders often run 4H → 15m → 1m. US30 scalpers: 1H → 5m → 1m.
      </p>
    </Panel>
  );
}
