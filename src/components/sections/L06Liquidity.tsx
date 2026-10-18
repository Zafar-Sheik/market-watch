"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, VIOLET } from "@/components/chart/CandleChart";
import { Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { GlowCard } from "@/components/ui/card-spotlight";
import { chain } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";

const POOLS = [
  { t: "Equal highs / lows", d: "Double tops & bottoms look like 'strong' levels to retail. To smart money they're a pile of stops.", c: GOLD },
  { t: "PDH / PDL", d: "Previous day high & low. Gold and US30 sweep one of these most days before the real move.", c: BULL },
  { t: "Asian range", d: "The quiet Asia-session high/low. London loves to raid one side before going the other way.", c: SKY },
  { t: "Trendline liquidity", d: "Three touches of a neat trendline = stops lined up just beyond it. Expect a break that traps.", c: VIOLET },
  { t: "Session highs / lows", d: "London high/low becomes NY's target. NY open often sweeps London's extreme first.", c: BEAR },
  { t: "Round numbers", d: "…00 / …50 on gold, 000/500 on US30. Stops and limit orders cluster just beyond them.", c: "#e2e8f0" },
];

export function L06Liquidity() {
  const ch = CHAPTERS[5];
  return (
    <Level
      chapter={ch}
      accent={GOLD}
      tldr={[
        "Liquidity = resting orders (mostly stop losses) sitting above highs and below lows.",
        "Big players need that liquidity to fill big orders — so price hunts it.",
        "Don't trade INTO liquidity. Trade AFTER it's been taken (the sweep).",
      ]}
    >
      <StopHunt />
      <div data-reveal>
        <h3 className="mb-4 text-xl font-bold text-white sm:text-2xl">Where the stops live 🎯</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POOLS.map((p) => (
            <GlowCard key={p.t} color={`${p.c}20`} className="p-4 sm:p-5">
              <div className="mb-2 h-1 w-10 rounded-full" style={{ background: p.c }} />
              <div className="mb-1 font-bold text-white">{p.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{p.d}</p>
            </GlowCard>
          ))}
        </div>
      </div>
      <Callout kind="pro">
        <b>BSL</b> (buy-side liquidity) sits above highs — buy stops from shorts + breakout buy orders. <b>SSL</b> (sell-side
        liquidity) sits below lows. A common rule: price moves from one pool to the other. Took SSL? Next target is likely BSL.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="Gold forms a clean double bottom right above the Asian low. London opens. What's the smart-money expectation?"
        options={[
          "Buy the double bottom immediately",
          "Price likely sweeps below those lows first, then decides direction",
          "Double bottoms never break",
          "Short and hold forever",
        ]}
        answer={1}
        explain="That's a stacked pool of sell-side liquidity (equal lows + Asian low). Expect a raid. The trade comes AFTER the sweep, when price reclaims."
      />
    </Level>
  );
}

function StopHunt() {
  const candles = useMemo(
    () =>
      chain(60, [
        [64, 1, 1], [68, 0.6, 0.6], [71.6, 0.4, 0.8], [68, 0.3, 0.6], [65, 0.5, 0.6], [68, 0.5, 0.6], [71.4, 0.55, 0.5], [68.5, 0.4, 0.6],
        [66, 0.5, 0.6], [69, 0.4, 0.6], [71.5, 0.45, 0.4], [69.5, 0.4, 0.5], [70.5, 4.2, 0.4], [67, 0.6, 0.6], [63, 0.5, 0.5], [60, 0.5, 0.6], [58, 0.5, 0.4], [55, 0.6, 0.5],
      ]),
    [],
  );
  const eq = 72.0;
  const steps: Step[] = [
    { at: 11, title: "Equal highs", text: "Three tops at the same price. Retail sees 'triple top resistance'. Look closer at what's sitting above…", color: GOLD },
    { at: 12, title: "The stops pile up", text: "Every short has a stop above. Every breakout trader has a buy-stop above. That gold cloud = buy-side liquidity (BSL).", color: GOLD },
    { at: 13, title: "The sweep", text: "One violent wick takes it all. Stops trigger = market BUY orders. Smart money SELLS into that flood of buying.", color: BEAR },
    { at: candles.length, title: "The real move", text: "With the liquidity gone, price drops hard. Breakout buyers are trapped. This is why we wait for the sweep, not the level.", color: BEAR },
  ];
  const p = usePlayer(steps);
  const swept = p.visible >= 13;
  const stopsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = stopsRef.current;
    if (!g) return;
    const dots = g.querySelectorAll("circle");
    if (swept) {
      gsap.to(dots, { scale: 2.4, opacity: 0, duration: 0.5, stagger: { each: 0.025, from: "start" }, ease: "power2.out", transformOrigin: "50% 50%" });
    } else if (p.step >= 1) {
      gsap.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.03, ease: "back.out(3)", transformOrigin: "50% 50%" });
    } else {
      gsap.set(dots, { scale: 0, opacity: 0 });
    }
  }, [swept, p.step]);

  return (
    <Panel>
      <PanelTitle kicker="REPLAY" title="Anatomy of a stop hunt" hint="This happens on gold almost every single day." />
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart
          candles={candles}
          visible={p.visible}
          axis={false}
          height={320}
          lines={[{ price: eq, from: 2, to: 12, color: GOLD, dashed: true, label: "equal highs", labelSide: "left" }]}
          highlight={swept ? [12] : []}
          markers={swept ? [{ i: 12, price: candles[12].h, label: "BSL SWEPT", color: BEAR }] : []}
        >
          {({ x, y }) => (
            <g ref={stopsRef}>
              {Array.from({ length: 18 }, (_, k) => (
                <circle
                  key={k}
                  cx={x(2 + (k % 9) * 1.1)}
                  cy={y(eq + 0.7 + Math.floor(k / 9) * 0.9 + ((k * 7) % 3) * 0.15)}
                  r={3.4}
                  fill={GOLD}
                  opacity={0}
                />
              ))}
              {p.step >= 1 && !swept && (
                <text x={x(11.4)} y={y(eq + 1.5)} fontSize={11} fontWeight={800} fill={GOLD} className="font-mono">
                  ← stops (BSL)
                </text>
              )}
            </g>
          )}
        </CandleChart>
      </div>
      <PlayerControls p={p} steps={steps} />
    </Panel>
  );
}
