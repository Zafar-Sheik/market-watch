"use client";

import { useMemo } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, VIOLET, type HLine, type Marker, type Zone } from "@/components/chart/CandleChart";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { fromPath, type Candle } from "@/lib/candles";

export type StudyVariant =
  | "bull"
  | "bear"
  | "asia"
  | "oteLong"
  | "oteShort"
  | "sbLong"
  | "sbShort"
  | "smt"
  | "irl"
  | "playLong"
  | "playShort"
  | "noTrade";

export const STUDY_META: Record<StudyVariant, { n: number; title: string; sub: string }> = {
  bull: { n: 1, title: "Bullish SSL Sweep + MSS + FVG", sub: "Daily/4H bullish context; lower-timeframe execution sequence." },
  bear: { n: 2, title: "Bearish BSL Sweep + MSS + FVG", sub: "Daily/4H bearish context; lower-timeframe execution sequence." },
  asia: { n: 3, title: "Asian Range Raid into London / New York", sub: "Study which side of the Asian range is taken before expansion." },
  oteLong: { n: 4, title: "OTE / Discount Long Confluence", sub: "OTE is a location filter; the sweep and structure shift still matter." },
  oteShort: { n: 5, title: "OTE / Premium Short Confluence", sub: "Premium + retracement does not replace price confirmation." },
  sbLong: { n: 6, title: "Silver Bullet Long Study", sub: "Defined time window: counter-bias sweep → displacement/FVG → retracement." },
  sbShort: { n: 7, title: "Silver Bullet Short Study", sub: "Defined time window: counter-bias sweep → displacement/FVG → retracement." },
  smt: { n: 8, title: "Gold / Silver SMT Confirmation", sub: "SMT is context; demand a Gold price-action confirmation sequence." },
  irl: { n: 9, title: "IRL to ERL Price Delivery", sub: "Internal imbalance/reference as retracement location; external liquidity as objective." },
  playLong: { n: 10, title: "Complete XAUUSD Long Playbook", sub: "HTF bias → DOL → SSL raid → displacement → MSS/CISD → FVG → entry → target." },
  playShort: { n: 11, title: "Complete XAUUSD Short Playbook", sub: "HTF bias → DOL → BSL raid → displacement → MSS/CISD → FVG → entry → target." },
  noTrade: { n: 12, title: "No-Trade Example", sub: "A chart can look active and still fail the model." },
};

const MID = 4450;
const mirror = (cs: Candle[]): Candle[] => cs.map((c) => ({ o: 2 * MID - c.o, c: 2 * MID - c.c, h: 2 * MID - c.l, l: 2 * MID - c.h }));
const mp = (p: number) => 2 * MID - p;

/** Bullish template — consolidation, SSL sweep, displacement leaving an FVG, retrace, delivery to BSL. */
function bullTemplate(retraceTo: number, seed: number): Candle[] {
  const a = fromPath([[0, 4444], [5, 4450], [10, 4441], [15, 4449], [19, 4437], [22, 4414], [24, 4405]], { seed, noise: 0.35, wick: 0.7 });
  const special: Candle[] = [
    { o: a[24].c, h: a[24].c + 2, l: 4391, c: a[24].c - 1 }, // 25 sweep
    { o: a[24].c - 1, c: 4418, h: 4419, l: a[24].c - 3 }, // 26
    { o: 4418, c: 4447, h: 4448, l: 4417 }, // 27 displacement
    { o: 4447, c: 4464, h: 4467, l: 4442 }, // 28
  ];
  const r = fromPath([[0, 4464], [2, 4452], [5, retraceTo + 3]], { seed: seed + 1, noise: 0.25, wick: 0.4 }).slice(1);
  r[r.length - 1] = { ...r[r.length - 1], l: retraceTo };
  const last = r[r.length - 1].c;
  const up = fromPath([[0, last], [6, 4462], [12, 4476], [17, 4489], [23, 4497]], { seed: seed + 2, noise: 0.35, wick: 0.6 }).slice(1);
  return [...a, ...special, ...r, ...up];
}

type Built = {
  candles: Candle[];
  lines: HLine[];
  zones: Zone[];
  markers: Marker[];
  steps: Step[];
  trade?: { at: number; entry: number; sl: number; tp: number };
  bands?: { from: number; to: number; t: string; c: string }[];
  sbWindow?: { from: number; to: number };
  smt?: boolean;
  bearish: boolean;
};

export function buildStudy(v: StudyVariant): Built {
  if (v === "noTrade") {
    const candles = fromPath(
      [[0, 4440], [4, 4462], [8, 4425], [12, 4458], [16, 4428], [20, 4463], [24, 4430], [28, 4455], [32, 4432], [36, 4460], [40, 4436], [44, 4450]],
      { seed: 31, noise: 0.9, wick: 1.1 },
    );
    const hi = Math.max(...candles.map((c) => c.h));
    const lo = Math.min(...candles.map((c) => c.l));
    return {
      bearish: false,
      candles,
      lines: [
        { price: hi + 2, color: BEAR, dashed: true, label: "RANGE HIGH / BSL", labelSide: "left" },
        { price: (hi + lo) / 2, color: GOLD, dashed: true, label: "EQ 50%", labelSide: "left" },
        { price: lo - 2, color: BULL, dashed: true, label: "RANGE LOW / SSL", labelSide: "left" },
      ],
      zones: [],
      markers: [],
      steps: [
        { at: 24, title: "Looks active…", text: "Big candles, both directions, lots of 'FVGs'. It feels like something should be traded.", color: GOLD },
        { at: candles.length, title: "No trade", text: "NO TRADE: no clean sweep + displacement + structure shift. Price chops between range high and low around equilibrium. The best skill is knowing when the chart does not meet your model.", color: BEAR },
      ],
    };
  }

  const ote = v === "oteLong" || v === "oteShort";
  const bearish = ["bear", "oteShort", "sbShort", "playShort"].includes(v);
  const seed = { bull: 3, bear: 3, asia: 11, oteLong: 5, oteShort: 5, sbLong: 13, sbShort: 13, smt: 17, irl: 19, playLong: 23, playShort: 23 }[v];
  const retrace = ote ? 4407 : 4430;
  let candles = bullTemplate(retrace, seed);

  const sweepI = 25;
  const fvgTop = candles[28].l;
  const fvgBot = candles[26].h;
  const mss = Math.max(...candles.slice(18, 25).map((c) => c.h));
  const impulseHigh = candles[28].h;
  const sweepLow = candles[sweepI].l;
  const lvl705 = impulseHigh - 0.705 * (impulseHigh - sweepLow);
  const entry = ote ? lvl705 : (fvgTop + fvgBot) / 2;
  let entryAt = candles.findIndex((c, i) => i > 28 && c.l <= entry);
  if (entryAt < 0) entryAt = 33;
  const sl = sweepLow - 3;
  const tp = 4486;
  const ssl = v === "asia" || v === "sbLong" ? Math.min(...candles.slice(0, 20).map((c) => c.l)) : 4400;
  const asiaHigh = Math.max(...candles.slice(0, 20).map((c) => c.h));

  const P = (p: number) => (bearish ? mp(p) : p);
  if (bearish) candles = mirror(candles);
  const up = !bearish;

  const lines: HLine[] = [
    { price: P(tp), color: up ? BEAR : BULL, dashed: true, label: up ? (v === "irl" ? "ERL / BSL / PDH / DOL" : "BSL / PDH / DOL") : "SSL / PDL / DOL", labelSide: "left" },
    {
      price: P(ssl),
      color: up ? BULL : BEAR,
      dashed: true,
      label: v === "asia" || v === "sbLong" ? "ASIA LOW / SSL" : up ? (v === "irl" ? "ERL / SSL / PDL" : "SSL / PDL") : "BSL / PDH",
      labelSide: "left",
      to: 30,
    },
    { price: P(mss), from: 10, to: 28, color: SKY, dashed: true, label: "MSS / CISD", showAt: 27, labelSide: "left" },
  ];
  if (v === "asia") lines.push({ price: asiaHigh, from: 0, to: 20, color: BEAR, dashed: true, label: "ASIA HIGH / BSL", labelSide: "left" });

  const zones: Zone[] = [
    { from: 27, to: 40, top: P(bearish ? fvgBot : fvgTop), bottom: P(bearish ? fvgTop : fvgBot), color: up ? SKY : BEAR, label: v === "irl" ? "IRL / FVG" : up ? "3 BULLISH FVG" : "3 BEARISH FVG", showAt: 28 },
  ];
  if (ote) {
    const l62 = impulseHigh - 0.62 * (impulseHigh - sweepLow);
    const l79 = impulseHigh - 0.79 * (impulseHigh - sweepLow);
    zones.push({ from: 28, to: 44, top: P(bearish ? l79 : l62), bottom: P(bearish ? l62 : l79), color: GOLD, label: "OTE 62–79%", showAt: 29 });
    zones.push({ from: 24, to: 26, top: P(bearish ? sweepLow : candles[sweepI].o + 2), bottom: P(bearish ? candles[sweepI].o + 2 : sweepLow), color: VIOLET, label: "OB", showAt: 29 });
  }

  const markers: Marker[] = [
    { i: sweepI, price: bearish ? candles[sweepI].h : candles[sweepI].l, label: "1 LIQUIDITY SWEEP", color: GOLD, pos: up ? "below" : "above", showAt: sweepI },
    { i: 27, price: bearish ? candles[27].l : candles[27].h, label: "2 DISPLACEMENT", color: up ? BULL : BEAR, pos: up ? "above" : "below", showAt: 27 },
    { i: candles.length - 4, price: P(tp), label: "5 TARGET = DOL", color: BULL, pos: up ? "above" : "below", showAt: candles.length - 3 },
  ];

  const bands =
    v === "asia" || v === "sbLong" || v === "sbShort"
      ? [
          { from: 0, to: 19, t: "ASIA", c: SKY },
          { from: 20, to: 37, t: "LONDON", c: "#94a3b8" },
          { from: 38, to: candles.length - 1, t: "NEW YORK", c: VIOLET },
        ]
      : undefined;

  const dir = up ? "SSL" : "BSL";
  const opp = up ? "BSL" : "SSL";
  const steps: Step[] = [
    {
      at: 20,
      title: "Context first",
      text:
        v === "asia"
          ? "Asia builds a range. Mark the Asia high (BSL) and Asia low (SSL). Daily/4H context is bullish, so the DOL is buy-side liquidity above PDH."
          : v === "sbLong" || v === "sbShort"
            ? `Establish Daily bias first (${up ? "bullish" : "bearish"}). Then wait for the Silver Bullet window — the time filters opportunity, it doesn't create the setup.`
            : `HTF context is ${up ? "bullish" : "bearish"}. The draw on liquidity is ${opp} ${up ? "above PDH" : "below PDL"}. ${dir} sits ${up ? "below" : "above"} — a likely raid target first.`,
    },
    {
      at: sweepI + 1,
      title: "1 · Liquidity sweep",
      color: GOLD,
      text:
        v === "smt"
          ? "Gold trades below SSL and prints a lower low… but Silver (violet line) makes a HIGHER low. Potential bullish SMT. That's context — not an entry yet."
          : v === "asia"
            ? "London raids the Asian low (SSL). Stops below the range fill. Which side of Asia was taken first? Now we need displacement."
            : `Price raids ${dir}${v === "sbLong" || v === "sbShort" ? " inside the window — a counter-bias sweep" : ""}. Sweep ≠ entry — wait for evidence.`,
    },
    { at: 28, title: "2 · Displacement", color: up ? BULL : BEAR, text: "Aggressive repricing: big bodies, range expansion. On Gold, demand clearer-than-normal candles — volatility alone is not enough." },
    { at: 30, title: "3 · MSS/CISD + FVG", color: SKY, text: `A body closes through the short-term ${up ? "high" : "low"} (MSS/CISD), and the displacement leaves a ${up ? "bullish" : "bearish"} FVG${v === "irl" ? " — internal range liquidity (IRL) to retrace into" : ""}. Now the FVG has a narrative.` },
    {
      at: entryAt + 1,
      title: "4 · Entry",
      color: GOLD,
      text: ote
        ? `Price retraces into the OTE band (62–79%) where an order block sits. Entry near 70.5%, stop beyond the sweep. OTE is location; the sweep + MSS earned the trade.`
        : `Retrace into the FVG — entry at CE (50%). Stop beyond the sweep ${up ? "low" : "high"}: the level that invalidates the idea.`,
    },
    { at: candles.length, title: "5 · Target = DOL", color: BULL, text: `Price delivers to ${opp}${v === "irl" ? " — external range liquidity (ERL). IRL → ERL." : "."} TP1 internal liquidity, then the external draw.` },
  ];

  return {
    bearish,
    candles,
    lines,
    zones,
    markers,
    steps,
    trade: { at: entryAt, entry: P(entry), sl: P(sl), tp: P(tp) },
    bands,
    sbWindow: v === "sbLong" || v === "sbShort" ? { from: 22, to: 34 } : undefined,
    smt: v === "smt",
  };
}

export function StudyChart({ variant, height = 400 }: { variant: StudyVariant; height?: number }) {
  const b = useMemo(() => buildStudy(variant), [variant]);
  const p = usePlayer(b.steps);
  const meta = STUDY_META[variant];

  const zones = [...b.zones];
  const lines = [...b.lines];
  const t = b.trade;
  if (t && p.visible > t.at) {
    const r = Math.abs(t.tp - t.entry) / Math.abs(t.entry - t.sl);
    zones.push(
      { from: t.at, to: b.candles.length - 1, top: Math.max(t.tp, t.entry), bottom: Math.min(t.tp, t.entry), color: BULL, label: `${r.toFixed(1)}R`, labelPos: b.bearish ? "bottom" : "top" },
      { from: t.at, to: b.candles.length - 1, top: Math.max(t.sl, t.entry), bottom: Math.min(t.sl, t.entry), color: BEAR, label: "SL", labelPos: b.bearish ? "top" : "bottom" },
    );
    lines.push({ price: t.entry, from: t.at, color: GOLD, label: "4 ENTRY", labelSide: "left" });
  }

  // silver path for SMT: mirrors gold but makes a higher low at the sweep
  const silver = useMemo(() => {
    if (!b.smt) return [];
    const mid = b.candles.map((c) => (c.h + c.l) / 2);
    // silver's prior low is candle 24; at gold's sweep (25) silver holds ABOVE it → higher low
    return mid.map((m, i) => (i === 25 ? mid[24] + 9 : i === 26 ? Math.max(m, mid[24] + 12) : m));
  }, [b]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-[11px] font-bold tracking-widest text-gold">CHART {meta.n} · XAUUSD STUDY EXAMPLE</div>
          <div className="text-lg font-bold text-white">{meta.title}</div>
          <div className="text-sm text-slate-400">{meta.sub}</div>
        </div>
      </div>
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart candles={b.candles} visible={p.visible} lines={lines} zones={zones} markers={b.markers} height={height} decimals={0} rightPad={6}>
          {({ x, y, height: H, slot }) => (
            <g>
              {b.bands?.map((bd) => (
                <g key={bd.t}>
                  <rect x={x(bd.from) - slot / 2} y={0} width={x(bd.to) - x(bd.from) + slot} height={H} fill={bd.c} opacity={0.06} />
                  <text x={(x(bd.from) + x(bd.to)) / 2} y={12} textAnchor="middle" fontSize={10} fontWeight={800} fill={bd.c} className="font-mono">
                    {bd.t}
                  </text>
                </g>
              ))}
              {b.sbWindow && (
                <g>
                  <rect x={x(b.sbWindow.from) - slot / 2} y={18} width={x(b.sbWindow.to) - x(b.sbWindow.from) + slot} height={H - 36} fill="none" stroke={GOLD} strokeDasharray="6 4" rx={8} />
                  <text x={x(b.sbWindow.from)} y={32} fontSize={10} fontWeight={800} fill={GOLD} className="font-mono">
                    SILVER BULLET WINDOW · 10:00–11:00 NY
                  </text>
                </g>
              )}
              {b.smt && p.visible > 20 && (
                <g>
                  <polyline
                    fill="none"
                    stroke={VIOLET}
                    strokeWidth={1.6}
                    strokeDasharray="4 3"
                    opacity={0.85}
                    points={silver
                      .slice(0, p.visible)
                      .map((v, i) => `${x(i)},${y(v) + H * 0.18}`)
                      .join(" ")}
                  />
                  {p.visible > 25 && (
                    <text x={x(25) + 8} y={y(silver[25]) + H * 0.18 + 4} fontSize={10} fontWeight={800} fill={VIOLET} className="font-mono">
                      SILVER (scaled): higher low — no confirm
                    </text>
                  )}
                </g>
              )}
              {p.visible > 25 && b.trade && (
                <circle cx={x(25)} cy={y(b.bearish ? b.candles[25].h : b.candles[25].l)} r={14} fill="none" stroke={GOLD} strokeWidth={1.5} />
              )}
            </g>
          )}
        </CandleChart>
      </div>
      <PlayerControls p={p} steps={b.steps} />
      <p className="mt-2 text-xs text-slate-500">
        Synthetic teaching example. First identify HTF context and DOL; then read liquidity → displacement → structure → PD array → execution. Educational only — not financial advice.
      </p>
    </div>
  );
}
