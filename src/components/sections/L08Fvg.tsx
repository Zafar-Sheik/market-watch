"use client";

import { useMemo, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, type HLine, type Zone } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { chain, fairValueGaps, fromPath } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";
import { fmt } from "@/lib/utils";

export function L08Fvg() {
  const ch = CHAPTERS[7];
  return (
    <Level
      chapter={ch}
      accent={GOLD}
      tldr={[
        "FVG = a 3-candle pattern where candle 1's wick and candle 3's wick don't overlap.",
        "It's a price gap left by one-sided, aggressive orders. Price often comes back to 'fill' it.",
        "Middle of the gap (50%, 'consequent encroachment') is a favourite entry.",
      ]}
    >
      <ThreeCandle />
      <Scanner />
      <Callout kind="gold">
        On XAUUSD, news candles (CPI, NFP, FOMC) leave giant FVGs. Don&apos;t catch them during the release — mark them, and wait for
        price to come back to them in the next session. Treat a 1m FVG with much less respect than a 15m or 1H one.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="Bullish FVG: candle 1 high = 4,012. Candle 3 low = 4,020. Where is the 50% (consequent encroachment)?"
        options={["4,012", "4,016", "4,020", "4,024"]}
        answer={1}
        explain="(4,012 + 4,020) / 2 = 4,016. Many traders set a limit there, with the stop below candle 1 or the swing low."
      />
    </Level>
  );
}

function ThreeCandle() {
  const [power, setPower] = useState(70);
  // candle 2 grows with "power"; candle 3 sits on top of it
  const size = 2 + (power / 100) * 12;
  const c1 = { o: 52, c: 50, h: 53, l: 49 };
  const c2 = { o: 50, c: 50 + size, h: 50 + size + 0.4, l: 49.6 };
  const c3 = { o: c2.c, c: c2.c + 1.4, h: c2.c + 2.2, l: c2.c - 4.5 + (power / 100) * 3 };
  const candles = [c1, c2, c3];
  const gap = c3.l - c1.h;
  const has = gap > 0;
  return (
    <Panel>
      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <PanelTitle kicker="PLAY" title="Make a gap" hint="Drag the slider — more aggression, bigger displacement." />
          <label className="block">
            <div className="mb-2 flex justify-between font-mono text-xs text-slate-400">
              <span>calm</span>
              <span className="text-gold">displacement: {power}%</span>
              <span>violent</span>
            </div>
            <input type="range" min={0} max={100} value={power} onChange={(e) => setPower(+e.target.value)} className="w-full" />
          </label>
          <div
            className="mt-5 rounded-2xl border p-4 transition-colors"
            style={{ borderColor: has ? `${GOLD}66` : "#ffffff1a", background: has ? `${GOLD}10` : "transparent" }}
          >
            <div className="text-lg font-bold" style={{ color: has ? GOLD : "#94a3b8" }}>
              {has ? `Fair value gap: ${fmt(gap, 1)} pts` : "No gap — wicks overlap"}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {has
                ? "Candle 3's low never touched candle 1's high. Price moved so fast only buyers got filled — that 'unfair' area tends to get revisited."
                : "Every price got traded both ways. Balanced, fair — nothing to come back for."}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-2">
          <CandleChart
            candles={candles}
            height={280}
            axis={false}
            rightPad={0.6}
            zones={has ? [{ from: 0, to: 2, top: c3.l, bottom: c1.h, color: GOLD, label: "FVG" }] : []}
            lines={
              has
                ? [{ price: (c3.l + c1.h) / 2, from: 0, to: 2, color: GOLD, dashed: true, label: "50% CE", labelSide: "left" }]
                : []
            }
            markers={[
              { i: 0, price: c1.h, label: "1", color: "#e2e8f0" },
              { i: 1, price: c2.h, label: "2", color: "#e2e8f0" },
              { i: 2, price: c3.h, label: "3", color: "#e2e8f0" },
            ]}
          />
        </div>
      </div>
    </Panel>
  );
}

function Scanner() {
  const [on, setOn] = useState(false);
  const [fillView, setFillView] = useState(false);
  const candles = useMemo(() => {
    const base = fromPath(
      [[0, 60], [6, 62], [7, 70], [9, 72], [13, 66], [17, 75], [18, 82], [21, 84], [26, 76], [29, 79], [30, 71], [34, 68], [38, 74]],
      { seed: 5, noise: 0.25, wick: 0.4 },
    );
    return base.concat(chain(base[base.length - 1].c, [[78, 0.3, 0.3], [79.5, 0.4, 0.3]]));
  }, []);
  const gaps = useMemo(() => fairValueGaps(candles, 0.6), [candles]);
  const zones: Zone[] = [];
  const lines: HLine[] = [];
  if (on) {
    for (const g of gaps) {
      // did a later candle trade back into the gap?
      let filledAt = -1;
      for (let k = g.i + 2; k < candles.length; k++) {
        if (g.dir === "bull" ? candles[k].l <= g.top : candles[k].h >= g.bottom) {
          filledAt = k;
          break;
        }
      }
      const color = g.dir === "bull" ? BULL : BEAR;
      zones.push({
        from: g.i - 1,
        to: fillView && filledAt > 0 ? filledAt : undefined,
        extend: !fillView || filledAt < 0,
        top: g.top,
        bottom: g.bottom,
        color: fillView && filledAt > 0 ? "#94a3b8" : color,
        label: g.dir === "bull" ? (fillView && filledAt > 0 ? "filled" : "BISI") : fillView && filledAt > 0 ? "filled" : "SIBI",
      });
      if (!fillView) lines.push({ price: (g.top + g.bottom) / 2, from: g.i - 1, color, dashed: true });
    }
  }
  return (
    <Panel>
      <PanelTitle kicker="SCANNER" title="FVG X-ray" hint="Toggle the scanner. BISI = bullish gap (buy-side imbalance). SIBI = bearish (sell-side imbalance)." />
      <div className="mb-3 flex flex-wrap gap-2">
        <Btn active={on} onClick={() => setOn(!on)}>
          {on ? `Scanner ON · ${gaps.length} gaps` : "Turn scanner on"}
        </Btn>
        <Btn active={fillView} onClick={() => (setOn(true), setFillView(!fillView))}>
          Show which got filled
        </Btn>
      </div>
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart candles={candles} height={320} axis={false} zones={zones} lines={lines} />
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Notice: most gaps get revisited. The ones that DON&apos;T fill (price runs away) are a sign of a very strong trend — don&apos;t
        fight it.
      </p>
    </Panel>
  );
}
