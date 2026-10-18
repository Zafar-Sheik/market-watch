"use client";

import { useMemo } from "react";
import { BEAR, BULL, CandleChart, GOLD, type HLine, type Marker } from "@/components/chart/CandleChart";
import { Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { chain, fromPath, pivots, type Candle, type Pivot } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

export function pivotNear(pv: Pivot[], idx: number, kind: Pivot["kind"]) {
  return pv.filter((p) => p.kind === kind).sort((a, b) => Math.abs(a.i - idx) - Math.abs(b.i - idx))[0];
}

/** first candle after `from` whose CLOSE crosses `price` in direction `dir` */
export function breakIndex(c: Candle[], from: number, price: number, dir: "up" | "down") {
  for (let i = from + 1; i < c.length; i++) {
    if (dir === "up" ? c[i].c > price : c[i].c < price) return i;
  }
  return c.length - 1;
}

export function L04Bos() {
  const ch = CHAPTERS[3];
  const { candles, lines, markers, steps } = useMemo(() => {
    const candles = fromPath(
      [[0, 40], [5, 58], [9, 50], [15, 68], [19, 60], [25, 80], [29, 70], [33, 77], [39, 60], [42, 66], [49, 48]],
      { seed: 21, noise: 0.15, wick: 0.5 },
    );
    const pv = pivots(candles, 2);
    const h1 = pivotNear(pv, 5, "high");
    const h2 = pivotNear(pv, 15, "high");
    const h3 = pivotNear(pv, 25, "high");
    const l3 = pivotNear(pv, 29, "low");
    const lh = pivotNear(pv, 33, "high");
    const lh2 = pivotNear(pv, 42, "high");
    const ll = pivotNear(pv, 39, "low");
    const b1 = breakIndex(candles, h1.i, h1.price, "up");
    const b2 = breakIndex(candles, h2.i, h2.price, "up");
    const choch = breakIndex(candles, lh.i, l3.price, "down");
    const b3 = breakIndex(candles, lh2.i, ll.price, "down");

    const lines: HLine[] = [
      { price: h1.price, from: h1.i, to: b1, color: BULL, label: "BOS", showAt: b1 },
      { price: h2.price, from: h2.i, to: b2, color: BULL, label: "BOS", showAt: b2 },
      { price: l3.price, from: l3.i, to: choch, color: GOLD, label: "CHoCH", showAt: choch },
      { price: ll.price, from: ll.i, to: b3, color: BEAR, label: "BOS", showAt: b3 },
    ];
    const markers: Marker[] = [
      { i: h1.i, price: h1.price, label: "H", color: "#94a3b8", showAt: h1.i + 1 },
      { i: h2.i, price: h2.price, label: "HH", color: BULL, showAt: h2.i + 1 },
      { i: h3.i, price: h3.price, label: "HH", color: BULL, showAt: h3.i + 1 },
      { i: l3.i, price: l3.price, label: "protected HL", color: GOLD, pos: "below", showAt: l3.i + 2 },
      { i: lh.i, price: lh.price, label: "LH?", color: BEAR, showAt: lh.i + 2 },
      { i: lh2.i, price: lh2.price, label: "LH · sell zone", color: BEAR, showAt: lh2.i + 1 },
    ];
    const steps: Step[] = [
      { at: h1.i + 4, title: "A swing high forms", text: "Price rallies, makes a high, pulls back. That high is now a line in the sand." },
      { at: b1 + 1, title: "Break of Structure", text: "A candle BODY closes above the old high = BOS. The trend is continuing. Buyers in control.", color: BULL },
      { at: b2 + 1, title: "Another BOS", text: "Higher high, higher low, BOS again. Healthy uptrend. Every BOS confirms the bias.", color: BULL },
      { at: l3.i + 3, title: "The protected low", text: "The low that launched the last BOS is the 'protected' low. As long as it holds, the uptrend holds.", color: GOLD },
      { at: lh.i + 3, title: "First warning", text: "Price fails to make a new high. Not a signal yet — just a yellow flag.", color: BEAR },
      { at: choch + 1, title: "CHoCH — Change of Character", text: "A body closes BELOW the protected low. The character of the market has changed. Bias flips from bullish to bearish.", color: GOLD },
      { at: lh2.i + 2, title: "Retrace = opportunity", text: "Price pulls back up into a lower high. THIS is where sellers look to enter — not at the CHoCH candle itself.", color: BEAR },
      { at: candles.length, title: "Bearish BOS confirms it", text: "New lower low with a body close = bearish BOS. The new downtrend is official.", color: BEAR },
    ];
    return { candles, lines, markers, steps };
  }, []);

  const p = usePlayer(steps);

  return (
    <Level
      chapter={ch}
      accent={GOLD}
      tldr={[
        "BOS = price breaks a swing point WITH the trend → continuation.",
        "CHoCH = price breaks the protected swing AGAINST the trend → possible reversal.",
        "Body close or it didn't happen. A wick through is just a liquidity grab.",
      ]}
    >
      <Panel>
        <PanelTitle kicker="REPLAY" title="Watch a trend live and die" hint="Hit Next (or Autoplay). Candles print one by one." />
        <div className="rounded-2xl bg-black/30 p-2">
          <CandleChart candles={candles} visible={p.visible} lines={lines} markers={markers} height={360} axis={false} />
        </div>
        <PlayerControls p={p} steps={steps} />
      </Panel>
      <WickVsClose />
      <QuickCheck
        chapter={ch.id}
        question="In a downtrend, a candle's body closes ABOVE the last lower high. What is that?"
        options={["Bearish BOS", "A CHoCH (bullish)", "A liquidity sweep", "Nothing"]}
        answer={1}
        explain="A bullish CHoCH. It broke structure AGAINST the trend. Now watch for a higher low to form before buying."
      />
    </Level>
  );
}

function WickVsClose() {
  const base: [number, number, number][] = [[52, 1, 1], [56, 1, 0.5], [60, 0.4, 1], [57, 0.6, 1], [54, 0.5, 1], [56, 0.6, 0.6]];
  const sweep = chain(50, [...base, [59, 3.2, 0.4], [55, 0.4, 0.6], [52, 0.5, 0.5], [50, 0.6, 0.4]]);
  const bos = chain(50, [...base, [62.5, 0.6, 0.4], [61.5, 0.6, 0.6], [64, 0.5, 0.5], [66, 0.6, 0.4]]);
  const high = 60.4;
  return (
    <Panel>
      <PanelTitle kicker="THE #1 MISTAKE" title="Wick through ≠ break" hint="Same high. Two totally different stories." />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { c: sweep, title: "Wick through, close back below", tag: "SWEEP → bearish", color: BEAR, text: "Breakout buyers got trapped and stops above the high got filled. Smart money sold into them." },
          { c: bos, title: "Body closes above", tag: "BOS → bullish", color: BULL, text: "Real acceptance above the high. Continuation is now the higher-probability play." },
        ].map((x) => (
          <div key={x.tag} className="rounded-2xl border p-3" style={{ borderColor: `${x.color}35` }}>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold text-white">{x.title}</span>
              <span className="rounded-full px-2 py-0.5 font-mono text-[11px] font-bold" style={{ color: x.color, background: `${x.color}1a` }}>
                {x.tag}
              </span>
            </div>
            <CandleChart
              candles={x.c}
              height={200}
              axis={false}
              highlight={[6]}
              lines={[{ price: high, from: 2, color: GOLD, dashed: true, label: "swing high", labelSide: "left" }]}
            />
            <p className="mt-2 text-sm text-slate-400">{x.text}</p>
          </div>
        ))}
      </div>
      <Callout kind="gold" className="mt-4">
        Gold loves to wick $3–$8 through an obvious high during London open, then reverse. Use a candle CLOSE on your
        structure timeframe (15m or 1H) — not a 1m wick — to decide if structure actually broke.
      </Callout>
    </Panel>
  );
}
