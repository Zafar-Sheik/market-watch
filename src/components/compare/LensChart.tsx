"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { BEAR, BULL, type HLine, type Marker, type Zone } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { FlowChart } from "@/components/of/FlowChart";
import { fairValueGaps } from "@/lib/candles";
import { LENSES, type LensKey } from "@/lib/compare";
import { ABS_LEVEL, S_ABS } from "@/lib/of/scenarios";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Mode = LensKey | "all";

const STEPS: (Step & { pa: string; ict: string; of: string })[] = [
  {
    at: 9,
    title: "Context",
    text: "",
    pa: "Downtrend (lower highs, lower lows) into a prior swing low = support.",
    ict: "Sell-side liquidity (SSL) rests under that obvious low. It's a magnet.",
    of: "Delta is red: sellers are the aggressor. Normal trend behaviour.",
  },
  {
    at: 11,
    title: "The test",
    text: "",
    pa: "Two candles wick below support and close back above — pin-bar style rejection.",
    ict: "SSL swept: stops below the low got taken. Now we need displacement.",
    of: "ABSORPTION: huge volume and big negative delta, but price makes no progress lower.",
  },
  {
    at: 12,
    title: "The pause",
    text: "",
    pa: "A small indecision candle. Nobody's sure yet.",
    ict: "Still no MSS — don't jump in on the sweep alone.",
    of: "EXHAUSTION: delta and volume shrink. Sellers are out of ammo.",
  },
  {
    at: 14,
    title: "The shift",
    text: "",
    pa: "Bullish engulfing candles break the last lower high → structure flips bullish.",
    ict: "Displacement + MSS, leaving a bullish FVG behind.",
    of: "Delta flips strongly green, CVD hooks up: buyers are now the aggressor.",
  },
  {
    at: 16,
    title: "The entry",
    text: "",
    pa: "Pullback = retest of the breakout area. Enter on the confirmation.",
    ict: "Retrace into the FVG (discount) → entry. Stop below the sweep low.",
    of: "Pullback on light negative delta — no real selling. Stop below the absorption.",
  },
  {
    at: S_ABS.length,
    title: "The result",
    text: "",
    pa: "Targets the prior swing high / resistance.",
    ict: "Delivers toward buy-side liquidity — the draw on liquidity.",
    of: "Trapped shorts cover (buy back) → fuel. Next targets: VWAP / POC above.",
  },
];

export function LensChart() {
  const [mode, setMode] = useState<Mode>("all");
  const p = usePlayer(STEPS);
  const { award } = useProgress();
  const s = STEPS[p.step];
  useEffect(() => {
    if (p.step === STEPS.length - 1) award("cmp:chart", 20);
  }, [p.step, award]);

  const geo = useMemo(() => {
    const lh = S_ABS[8].h;
    const gaps = fairValueGaps(S_ABS).filter((g) => g.dir === "bull" && g.i >= 11 && g.i <= 14);
    const fvg = gaps.sort((a, b) => b.top - b.bottom - (a.top - a.bottom))[0];
    return { lh, fvg };
  }, []);

  const on = (k: LensKey) => mode === "all" || mode === k;
  const lines: HLine[] = [];
  const zones: Zone[] = [];
  const markers: Marker[] = [];
  if (on("pa")) {
    lines.push({ price: ABS_LEVEL, color: LENSES.pa.color, label: "PA · support", labelSide: "left" });
    lines.push({ price: geo.lh, from: 5, to: 14, color: LENSES.pa.color, dashed: true, label: "PA · last lower high", showAt: 13, labelSide: "left" });
    markers.push({ i: 12, price: S_ABS[12].h, label: "engulfing", color: LENSES.pa.color, showAt: 12 });
  }
  if (on("ict")) {
    lines.push({ price: ABS_LEVEL - 0.6, from: 3, to: 12, color: LENSES.ict.color, dashed: true, label: "ICT · SSL" });
    markers.push({ i: 9, price: S_ABS[9].l, label: "ICT · sweep", color: LENSES.ict.color, pos: "below", showAt: 9 });
    if (geo.fvg) zones.push({ from: geo.fvg.i - 1, top: geo.fvg.top, bottom: geo.fvg.bottom, color: LENSES.ict.color, label: "ICT · FVG", extend: true, showAt: geo.fvg.i + 1 });
    lines.push({ price: Math.max(...S_ABS.slice(0, 4).map((c) => c.h)), color: LENSES.ict.color, dashed: true, label: "ICT · BSL / DOL" });
  }
  if (on("of")) {
    markers.push({ i: 10, price: S_ABS[10].h, label: "OF · absorption", color: LENSES.of.color, pos: "above", showAt: 10 });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["pa", "ict", "of"] as LensKey[]).map((k) => (
          <Btn key={k} active={mode === k} onClick={() => setMode(k)}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LENSES[k].color }} /> {LENSES[k].name}
          </Btn>
        ))}
        <Btn active={mode === "all"} onClick={() => setMode("all")}>
          ✦ All three
        </Btn>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl bg-black/30 p-2">
          <FlowChart
            bars={S_ABS}
            visible={p.visible}
            height={330}
            lines={lines}
            zones={zones}
            markers={markers}
            showDelta={on("of")}
            showCVD={on("of")}
            showVWAP={on("of")}
            rightPad={3}
          />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-[11px] font-bold tracking-widest text-slate-400">
            STEP {p.step + 1}/{STEPS.length} · {s.title.toUpperCase()}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={p.step + mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              {(["pa", "ict", "of"] as LensKey[]).map((k) => (
                <div
                  key={k}
                  className={cn("rounded-2xl border p-3 transition", on(k) ? "opacity-100" : "opacity-30")}
                  style={{ borderColor: `${LENSES[k].color}55`, background: `${LENSES[k].color}0d` }}
                >
                  <div className="font-mono text-[11px] font-black" style={{ color: LENSES[k].color }}>
                    {LENSES[k].emoji} {LENSES[k].name.toUpperCase()}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-100">{s[k]}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          {p.step === STEPS.length - 1 && (
            <div className="rounded-2xl border border-bull/40 bg-bull/10 p-3 text-sm text-slate-100">
              <b className="text-bull">Same event, three descriptions.</b> PA named the pattern, ICT explained the liquidity, order flow showed who did it. When all three agree,
              that&apos;s confluence.
            </div>
          )}
        </div>
      </div>
      <PlayerControls p={p} steps={STEPS} hideText />
      <div className="mt-2 flex gap-4 font-mono text-[11px] text-slate-500">
        <span>
          <span style={{ color: BULL }}>■</span>/<span style={{ color: BEAR }}>■</span> delta bars shown in Order Flow & All modes
        </span>
      </div>
    </div>
  );
}
