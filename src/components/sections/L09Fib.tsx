"use client";

import gsap from "gsap";
import { Play, RotateCcw, Wand2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, type HLine, type Zone } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { fromPath } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

const SHOWN = 16;

export function L09Fib() {
  const ch = CHAPTERS[8];
  return (
    <Level
      chapter={ch}
      accent={BULL}
      tldr={[
        "Draw a fib from swing low → swing high (for buys). The 50% line is 'equilibrium'.",
        "Below 50% = DISCOUNT (cheap, buy zone). Above 50% = PREMIUM (expensive, sell zone).",
        "OTE (optimal trade entry) = the 62%–79% retracement. Sweet spot ≈ 70.5%.",
      ]}
    >
      <FibTool />
      <Callout kind="pro">
        Stack it: an order block or FVG that sits <b>inside the OTE band, in discount, with HTF bias</b> is a high-quality point
        of interest. One tool alone = guess. Three overlapping = plan.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="US30 is in a strong uptrend. Price is currently at the 25% retracement of the last impulse (above equilibrium). Good place to buy?"
        options={["Yes, buy now", "No — that's premium. Wait for discount / OTE", "Sell it", "Fibs don't work on indices"]}
        answer={1}
        explain="Buying in premium means a worse price and a wider stop. Patience: let price come into discount, ideally the OTE band, and confirm there."
      />
    </Level>
  );
}

function FibTool() {
  const candles = useMemo(
    () => fromPath([[0, 62], [3, 50], [14, 90], [21, 62], [30, 104]], { seed: 9, noise: 0.25, wick: 0.5 }),
    [],
  );
  const lowIdx = useMemo(() => candles.slice(0, SHOWN).reduce((m, c, i, a) => (c.l < a[m].l ? i : m), 0), [candles]);
  const highIdx = useMemo(() => candles.slice(0, SHOWN).reduce((m, c, i, a) => (c.h > a[m].h ? i : m), 0), [candles]);

  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [visible, setVisible] = useState(SHOWN);
  const obj = useRef({ v: SHOWN });

  const click = (i: number) => {
    if (i >= SHOWN) return;
    if (a === null || b !== null) {
      setA(i);
      setB(null);
    } else setB(i);
  };

  const ready = a !== null && b !== null;
  const lo = ready ? Math.min(candles[a].l, candles[b].l) : 0;
  const hi = ready ? Math.max(candles[a].h, candles[b].h) : 0;
  const lvl = (r: number) => hi - (hi - lo) * r;
  const good = a === lowIdx && b === highIdx;

  const zones: Zone[] = ready
    ? [
        { from: Math.min(a, b), top: hi, bottom: lvl(0.5), color: BEAR, label: "PREMIUM", extend: true },
        { from: Math.min(a, b), top: lvl(0.5), bottom: lo, color: BULL, label: "DISCOUNT", extend: true },
        { from: Math.min(a, b), top: lvl(0.62), bottom: lvl(0.79), color: GOLD, label: "OTE 62–79%", extend: true },
      ]
    : [];
  const lines: HLine[] = ready
    ? [
        { price: lvl(0.5), from: Math.min(a, b), color: "#e2e8f0", label: "0.5 equilibrium", dashed: true, labelSide: "left" },
        { price: lvl(0.705), from: Math.min(a, b), color: GOLD, label: "0.705", dashed: true, labelSide: "left" },
      ]
    : [];

  const play = () => {
    obj.current.v = SHOWN;
    gsap.to(obj.current, { v: candles.length, duration: 2.6, ease: "none", onUpdate: () => setVisible(Math.round(obj.current.v)) });
  };

  const msg = a === null
    ? "Step 1: tap the SWING LOW candle where the impulse started."
    : b === null
      ? "Step 2: now tap the SWING HIGH where the impulse ended."
      : good
        ? "Perfect anchors. Green = discount (where buyers want in). Gold band = OTE. Now watch what price does…"
        : "Fib drawn — but you didn't anchor on the true extremes. Try the lowest wick and the highest wick of the move (or hit Auto-draw).";

  return (
    <Panel>
      <PanelTitle kicker="TOOL" title="Draw your first fib" hint="Two taps. Then press play." />
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart
          candles={candles}
          visible={visible}
          height={360}
          axis={false}
          onCandleClick={click}
          selected={b ?? a}
          highlight={[a, b].filter((x): x is number => x !== null)}
          zones={zones}
          lines={lines}
          markers={
            visible > 22 && ready && good
              ? [{ i: 21, price: candles[21].l, label: "tapped OTE → rally", color: GOLD, pos: "below" }]
              : []
          }
        />
      </div>
      <p className={`mt-3 min-h-[44px] text-[15px] ${good ? "text-bull" : "text-slate-300"}`}>{msg}</p>
      <div className="flex flex-wrap gap-2">
        <Btn
          onClick={() => {
            setA(lowIdx);
            setB(highIdx);
          }}
        >
          <Wand2 size={15} /> Auto-draw
        </Btn>
        <Btn active disabled={!ready} onClick={play}>
          <Play size={15} /> What happened next
        </Btn>
        <Btn
          onClick={() => {
            setA(null);
            setB(null);
            setVisible(SHOWN);
          }}
        >
          <RotateCcw size={15} /> Reset
        </Btn>
      </div>
    </Panel>
  );
}
