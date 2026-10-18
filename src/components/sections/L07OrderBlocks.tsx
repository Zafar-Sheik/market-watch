"use client";

import gsap from "gsap";
import { Check, Eye, Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, VIOLET } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { Burst } from "@/components/ui/confetti";
import { chain } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const OB_CANDLES = chain(80, [
  [78, 0.6, 0.5], [79, 0.6, 0.4], [76, 0.4, 0.5], [77, 0.5, 0.4], [74, 0.4, 0.5], [73.2, 0.3, 0.6],
  [77.5, 0.2, 0.2], [81, 0.4, 0.1], [82.5, 0.6, 0.4], [81, 0.5, 0.5], [78.5, 0.4, 0.5], [76, 0.4, 0.4],
  [74.6, 0.4, 0.9], [77, 0.4, 0.3], [80, 0.5, 0.4], [83, 0.6, 0.4], [85, 0.6, 0.5], [86.5, 0.6, 0.5],
]);
const OB_IDX = 5;
const PAUSE = 10;

export function L07OrderBlocks() {
  const ch = CHAPTERS[6];
  return (
    <Level
      chapter={ch}
      accent={VIOLET}
      tldr={[
        "Bullish OB = the LAST down candle before a strong move up that breaks structure (flip it for bearish).",
        "It's where big orders were filled. Price often returns to it before continuing.",
        "An OB that fails (price closes through it) flips into a breaker — and trades the other way.",
      ]}
    >
      <FindTheOB />
      <div className="grid gap-4 md:grid-cols-2">
        <Checklist />
        <Breaker />
      </div>
      <QuickCheck
        chapter={ch.id}
        question="Which candle is the bearish order block?"
        options={[
          "The first green candle in an uptrend",
          "The last green (up) candle before a strong drop that breaks structure",
          "Any big red candle",
          "The candle with the longest wick",
        ]}
        answer={1}
        explain="Right — the last opposing candle before the displacement. Buyers got absorbed there; sellers left unfilled orders that often get revisited."
      />
    </Level>
  );
}

function FindTheOB() {
  const [pick, setPick] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const [visible, setVisible] = useState(PAUSE);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const found = pick === OB_IDX || tries >= 2;
  const obj = useRef({ v: PAUSE });
  const c = OB_CANDLES[OB_IDX];

  const click = (i: number) => {
    if (found || i >= PAUSE) return;
    setPick(i);
    if (i === OB_IDX) {
      setBurst((b) => b + 1);
      award("game:ob", 40);
    } else setTries((t) => t + 1);
  };
  const play = () => {
    obj.current.v = PAUSE;
    gsap.to(obj.current, {
      v: OB_CANDLES.length,
      duration: 2.4,
      ease: "none",
      onUpdate: () => setVisible(Math.round(obj.current.v)),
    });
  };

  const msg =
    pick === null
      ? "Tap the candle you think is the bullish order block."
      : pick === OB_IDX
        ? "Nailed it. Last down-candle before the displacement that broke the swing high. Now hit play 👇"
        : tries >= 2
          ? "Here it is — the last red candle right before the explosive green move. Hit play to see what price did."
          : pick > OB_IDX
            ? "Too late — that's part of the move. Look for the last RED candle BEFORE the explosion."
            : "Too early — there's a later red candle right before the move.";

  return (
    <Panel className="relative overflow-hidden">
      {burst > 0 && <Burst key={burst} />}
      <PanelTitle kicker="MINI-GAME · +40 XP" title="Find the order block" hint="Price just exploded up and broke the swing high. Where did it launch from?" />
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart
          candles={OB_CANDLES}
          visible={visible}
          height={320}
          axis={false}
          onCandleClick={click}
          selected={found ? OB_IDX : pick}
          lines={[{ price: OB_CANDLES[1].h, from: 1, to: 7, color: BULL, label: "BOS", dashed: false }]}
          zones={
            found
              ? [
                  { from: OB_IDX, top: c.h, bottom: c.l, color: VIOLET, label: "BULLISH OB", extend: true },
                  { from: 6, to: 7, top: OB_CANDLES[7].l, bottom: OB_CANDLES[5].h, color: GOLD, label: "FVG" },
                ]
              : []
          }
          markers={visible > 13 ? [{ i: 12, price: OB_CANDLES[12].l, label: "OB retest → entry", color: VIOLET, pos: "below" }] : []}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <p className={cn("flex-1 text-[15px]", pick === OB_IDX ? "text-bull" : "text-slate-300")}>{msg}</p>
        {found && (
          <Btn active onClick={play}>
            <Play size={15} /> What happened next
          </Btn>
        )}
      </div>
    </Panel>
  );
}

const CHECKS = [
  ["Caused a break of structure", "No BOS = just a random candle."],
  ["Left an imbalance (FVG)", "Displacement proves real size stepped in."],
  ["Swept liquidity first", "Took a prior low/high before launching = 🔥"],
  ["Unmitigated (fresh)", "First return is the best; each touch weakens it."],
  ["With higher-timeframe bias", "A bullish OB in a bearish HTF trend is a coin flip."],
] as const;

function Checklist() {
  const [on, setOn] = useState<boolean[]>(CHECKS.map(() => false));
  const score = on.filter(Boolean).length;
  const grade = score >= 4 ? { t: "A+ setup", c: BULL } : score >= 3 ? { t: "Tradeable", c: GOLD } : { t: "Skip it", c: BEAR };
  return (
    <Panel>
      <PanelTitle kicker="GRADE IT" title="Is this OB worth trading?" hint="Tick what's true. The grade updates." />
      <div className="space-y-2">
        {CHECKS.map(([t, d], i) => (
          <button
            key={t}
            type="button"
            onClick={() => setOn((s) => s.map((v, k) => (k === i ? !v : v)))}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
              on[i] ? "border-violet/50 bg-violet/10" : "border-white/10 hover:border-white/25",
            )}
          >
            <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", on[i] ? "border-violet bg-violet text-ink" : "border-white/25")}>
              {on[i] && <Check size={13} strokeWidth={3} />}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{t}</span>
              <span className="block text-xs text-slate-400">{d}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl border p-3" style={{ borderColor: `${grade.c}55`, background: `${grade.c}10` }}>
        <span className="font-mono text-xs text-slate-400">{score}/5 confluences</span>
        <span className="font-bold" style={{ color: grade.c }}>
          {grade.t}
        </span>
      </div>
    </Panel>
  );
}

function Breaker() {
  const [show, setShow] = useState(false);
  const candles = useMemo(
    () =>
      chain(70, [
        [72, 0.5, 0.5], [74.5, 0.5, 0.4], [73, 0.4, 0.5], [76, 0.3, 0.4], [79, 0.6, 0.3], [77, 0.5, 0.5], [75, 0.4, 0.5],
        [72, 0.3, 0.4], [69.5, 0.3, 0.6], [71, 0.4, 0.5], [72.6, 0.3, 0.4], [70, 0.4, 0.5], [67, 0.4, 0.6], [65, 0.5, 0.5],
      ]),
    [],
  );
  const ob = candles[2];
  return (
    <Panel>
      <PanelTitle kicker="LEVEL UP" title="The breaker block" hint="When an OB fails, it doesn't disappear. It flips." />
      <div className="rounded-2xl bg-black/30 p-2">
        <CandleChart
          candles={candles}
          height={220}
          axis={false}
          zones={[
            { from: 2, top: ob.h, bottom: ob.l, color: show ? BEAR : VIOLET, label: show ? "BEARISH BREAKER" : "bullish OB", extend: true },
          ]}
          highlight={show ? [7, 10] : []}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Price closes <b>through</b> the bullish OB (candle 8). The buyers there are now trapped. When price rallies back into it,
        they exit at breakeven — that selling pressure turns the old OB into resistance.
      </p>
      <Btn className="mt-3" onClick={() => setShow(!show)} active={show}>
        <Eye size={15} /> {show ? "Show original OB" : "Flip to breaker"}
      </Btn>
    </Panel>
  );
}
