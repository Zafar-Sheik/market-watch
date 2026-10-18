"use client";

import { useMemo, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { chain } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

export function L05Levels() {
  const ch = CHAPTERS[4];
  return (
    <Level
      chapter={ch}
      accent={BULL}
      tldr={[
        "Levels are AREAS, not lines. Draw zones from wick to body.",
        "Broken resistance often becomes support (and vice-versa) — the 'flip'.",
        "The best demand/supply zones launched a big, fast move and haven't been revisited.",
      ]}
    >
      <Flip />
      <ZonesVsLines />
      <div className="grid gap-4 md:grid-cols-2">
        <Callout kind="gold">
          Gold respects <b>round numbers</b>: the $50 and $100 handles (e.g. …00, …50) act as magnets and turning points.
          Previous day high/low (PDH/PDL) and the weekly open are the other levels every gold desk is watching.
        </Callout>
        <Callout kind="us30">
          US30 reacts to <b>000 / 500 / 250</b> levels and the previous day&apos;s high, low and close. The NY cash open price
          (9:30 ET) is a key intraday pivot — above it, buyers have the day; below, sellers do.
        </Callout>
      </div>
      <QuickCheck
        chapter={ch.id}
        question="Price breaks above resistance with a strong close, then comes back down to it. What's the classic expectation?"
        options={["It breaks straight back down", "Old resistance acts as new support", "Price must go to zero", "Levels don't matter after a break"]}
        answer={1}
        explain="The S/R flip. Sellers who shorted there are now trapped; buyers who missed the breakout get a second chance. Wait for a confirmation candle on the retest."
      />
    </Level>
  );
}

function Flip() {
  const candles = useMemo(
    () =>
      chain(60, [
        [63, 1, 1], [67, 1, 0.5], [70.5, 0.6, 1], [67, 0.5, 1], [64, 0.6, 1], [67, 0.8, 0.5], [70, 0.9, 0.6], [66.5, 0.5, 1], [65, 0.8, 0.5],
        [68, 0.6, 0.6], [74, 0.6, 0.4], [76, 1, 0.5], [74, 0.6, 0.6], [72, 0.5, 0.6], [71.8, 0.6, 1.4], [74.5, 0.5, 0.5], [78, 0.6, 0.5], [80, 0.8, 0.6], [82, 0.6, 0.5],
      ]),
    [],
  );
  const level = 70.8;
  const steps: Step[] = [
    { at: 9, title: "Resistance", text: "Price hits the same area twice and gets rejected. Sellers live here.", color: BEAR },
    { at: 11, title: "Breakout", text: "A strong body closes above. The sellers who shorted resistance are now underwater.", color: BULL },
    { at: 15, title: "The retest", text: "Price comes back to the old ceiling… and it holds as a floor. Notice the hammer — that's your confirmation.", color: GOLD },
    { at: candles.length, title: "Continuation", text: "Trapped sellers buy back to exit, fuelling the move. This break-and-retest is entry model #2 later on.", color: BULL },
  ];
  const p = usePlayer(steps);
  const flipped = p.visible > 10;
  return (
    <Panel>
      <PanelTitle kicker="REPLAY" title="The S/R flip" hint="The same level does two jobs." />
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart
          candles={candles}
          visible={p.visible}
          axis={false}
          height={300}
          highlight={p.visible >= 15 ? [14] : []}
          zones={[
            {
              from: 2,
              top: level + 0.6,
              bottom: level - 1.2,
              color: flipped ? BULL : BEAR,
              label: flipped ? "SUPPORT (was resistance)" : "RESISTANCE",
              extend: true,
            },
          ]}
        />
      </div>
      <PlayerControls p={p} steps={steps} />
    </Panel>
  );
}

function ZonesVsLines() {
  const [mode, setMode] = useState<"line" | "zone">("line");
  const candles = useMemo(
    () =>
      chain(80, [
        [76, 0.6, 1], [72, 0.5, 1], [70.6, 0.5, 1.6], [71.2, 0.5, 0.6], [77, 0.4, 0.4], [82, 0.6, 0.5], [85, 1, 0.6], [83, 0.6, 1],
        [79, 0.6, 0.6], [75, 0.6, 0.8], [72.4, 0.6, 0.5], [71.5, 0.5, 1.1], [75, 0.5, 0.5], [79, 0.6, 0.4], [83, 0.5, 0.5], [87, 0.6, 0.5],
      ]),
    [],
  );
  // demand zone: base candles 2–3 (body top → lowest wick)
  const top = Math.max(candles[3].o, candles[3].c);
  const bottom = Math.min(candles[2].l, candles[3].l);
  return (
    <Panel>
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <div>
          <PanelTitle kicker="DRAWING" title="Lines are lies. Zones are truth." />
          <p className="text-[15px] leading-relaxed text-slate-300">
            Price rarely turns at an exact tick. A single line gets &quot;broken&quot; by a wick and you panic. A zone — drawn from the
            <b className="text-white"> base candles&apos; body to the lowest wick</b> — captures where orders actually sit.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
            <li>
              <b className="text-bull">Demand</b> = base before a strong move UP
            </li>
            <li>
              <b className="text-bear">Supply</b> = base before a strong move DOWN
            </li>
            <li>
              <b className="text-gold">Fresh</b> zones (untouched) &gt; tested zones
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Btn active={mode === "line"} onClick={() => setMode("line")}>
              Line
            </Btn>
            <Btn active={mode === "zone"} onClick={() => setMode("zone")}>
              Zone
            </Btn>
          </div>
        </div>
        <div className="rounded-2xl bg-black/30 p-2">
          <CandleChart
            candles={candles}
            axis={false}
            height={280}
            highlight={mode === "zone" ? [2, 3] : []}
            lines={mode === "line" ? [{ price: top, from: 2, color: SKY, label: "line… 'broken'?!", labelSide: "left" }] : []}
            zones={mode === "zone" ? [{ from: 2, top, bottom, color: BULL, label: "DEMAND ZONE", extend: true }] : []}
            markers={
              mode === "line"
                ? [{ i: 11, price: candles[11].l, label: "stopped out 😩", color: BEAR, pos: "below" }]
                : [{ i: 11, price: candles[11].l, label: "inside zone ✓", color: GOLD, pos: "below" }]
            }
          />
        </div>
      </div>
    </Panel>
  );
}
