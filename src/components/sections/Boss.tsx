"use client";

import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, type HLine, type Zone } from "@/components/chart/CandleChart";
import { Btn, Level, Panel } from "@/components/learn/Level";
import { Burst } from "@/components/ui/confetti";
import { chain, type Candle } from "@/lib/candles";
import { CHAPTERS, XP_PER_CHECK } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Choice = "long" | "short" | "skip";
type Scenario = {
  inst: "XAUUSD" | "US30";
  tf: string;
  time: string;
  context: string;
  candles: Candle[];
  cut: number;
  zones: Zone[];
  lines: HLine[];
  answer: Choice;
  why: string;
};

const S: Scenario[] = [
  {
    inst: "XAUUSD",
    tf: "5m",
    time: "03:10 ET · London KZ",
    context: "4H bias bullish. The dotted line is the Asian low. What's your play?",
    candles: chain(80, [
      [79, 0.3, 0.4], [80, 0.4, 0.3], [78.6, 0.3, 0.3], [79.4, 0.3, 0.3], [78.3, 0.3, 0.2], [79.2, 0.4, 0.3], [78.4, 0.3, 2.2],
      [80.6, 0.2, 0.1], [82.2, 0.3, 0.1], [81.6, 0.3, 0.3], [81, 0.3, 0.5], [83, 0.3, 0.2], [85, 0.4, 0.3], [86.5, 0.4, 0.3],
    ]),
    cut: 11,
    zones: [{ from: 7, top: 80.5, bottom: 79.5, color: GOLD, label: "FVG", extend: true }],
    lines: [{ price: 78.1, from: 0, to: 7, color: SKY, dashed: true, label: "Asian low", labelSide: "left" }],
    answer: "long",
    why: "Asian low swept at London open, reclaimed, displacement up through structure, leaving an FVG, with bullish HTF bias. Textbook Model A long.",
  },
  {
    inst: "US30",
    tf: "5m",
    time: "09:50 ET · NY open",
    context: "The line is the previous day high. Price broke it at the open and is back on it.",
    candles: chain(70, [
      [71.5, 0.4, 0.4], [73, 0.4, 0.3], [72, 0.3, 0.4], [73.6, 0.3, 0.3], [72.8, 0.4, 0.3], [76, 0.3, 0.2], [77.2, 0.4, 0.3],
      [76, 0.3, 0.3], [74.6, 0.2, 0.4], [74.3, 0.2, 0.3], [76.4, 0.2, 0.1], [77.8, 0.4, 0.2], [79.2, 0.4, 0.3], [80.5, 0.4, 0.3],
    ]),
    cut: 11,
    zones: [],
    lines: [{ price: 74, from: 0, color: GOLD, dashed: true, label: "PDH", labelSide: "left" }],
    answer: "long",
    why: "Body close above PDH, clean retest from above and a bullish engulfing candle confirming the flip. Break & retest long (Model B).",
  },
  {
    inst: "XAUUSD",
    tf: "15m",
    time: "13:05 ET · NY lunch",
    context: "Nice-looking hammer. Mid-range, lunch hour, no key level anywhere near.",
    candles: chain(76, [
      [77, 0.5, 0.5], [75.5, 0.5, 0.5], [77.5, 0.4, 0.4], [76, 0.5, 0.5], [77.2, 0.5, 0.4], [75.8, 0.4, 0.5], [76.9, 0.4, 0.5],
      [76.6, 0.3, 0.4], [76.9, 0.2, 0.9], [77.5, 0.4, 0.4], [76.4, 0.4, 0.5], [77.1, 0.5, 0.5], [75.9, 0.5, 0.4],
    ]),
    cut: 9,
    zones: [],
    lines: [
      { price: 78.2, from: 0, color: "#64748b", dashed: true, label: "range high", labelSide: "left" },
      { price: 75, from: 0, color: "#64748b", dashed: true, label: "range low", labelSide: "left" },
    ],
    answer: "skip",
    why: "No level, no liquidity taken, middle of a range, during the lunch chop. A pretty candle is not a reason. Skip — and notice what happened.",
  },
  {
    inst: "US30",
    tf: "1m",
    time: "10:20 ET",
    context: "1H bias bearish. Equal highs just got taken. Price is now pulling back up.",
    candles: chain(76, [
      [77.5, 0.3, 0.4], [79, 0.4, 0.3], [77.8, 0.3, 0.3], [78.6, 0.4, 0.3], [79, 0.4, 0.3], [78.4, 0.3, 0.3], [79.2, 1.8, 0.2],
      [77, 0.1, 0.2], [74.8, 0.1, 0.3], [75.6, 0.3, 0.3], [76.8, 0.4, 0.3], [75, 0.3, 0.3], [73, 0.3, 0.3], [71.4, 0.3, 0.4],
    ]),
    cut: 11,
    zones: [{ from: 7, top: 78.2, bottom: 77.1, color: BEAR, label: "bearish FVG (premium)", extend: true }],
    lines: [{ price: 79.4, from: 1, to: 6, color: GOLD, dashed: true, label: "equal highs", labelSide: "left" }],
    answer: "short",
    why: "BSL swept above equal highs, bearish displacement leaving an FVG, bias bearish, and price is retracing into premium. Short from the FVG, stop above the sweep.",
  },
  {
    inst: "XAUUSD",
    tf: "1m",
    time: "08:29 ET · CPI in 60 seconds",
    context: "A gorgeous setup is forming right into the release.",
    candles: chain(78, [
      [78.5, 0.3, 0.3], [79, 0.3, 0.3], [78.6, 0.2, 0.3], [79.2, 0.3, 0.3], [79.6, 0.2, 0.3], [79.3, 0.3, 0.2], [79.8, 0.3, 0.2],
      [80.2, 0.3, 0.2], [74, 0.5, 1.2], [79.5, 2.2, 0.5], [76.8, 0.5, 0.6], [78.5, 0.6, 0.5],
    ]),
    cut: 8,
    zones: [],
    lines: [],
    answer: "skip",
    why: "Never enter seconds before tier-1 news. Spreads blow out, stops slip, and gold can swing $10+ both ways in a minute. Let it print, then trade the aftermath.",
  },
];

export function Boss() {
  const ch = CHAPTERS[12];
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<Choice | null>(null);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(S[0].cut);
  const [burst, setBurst] = useState(0);
  const obj = useRef({ v: 0 });
  const { award, complete } = useProgress();
  const done = n >= S.length;
  const s = S[Math.min(n, S.length - 1)];

  const choose = (c: Choice) => {
    if (pick) return;
    setPick(c);
    if (c === s.answer) {
      setScore((x) => x + 1);
      setBurst((b) => b + 1);
    }
    obj.current.v = s.cut;
    gsap.to(obj.current, { v: s.candles.length, duration: 1.4, ease: "none", onUpdate: () => setVisible(Math.round(obj.current.v)) });
  };
  const next = () => {
    const k = n + 1;
    setN(k);
    setPick(null);
    if (k < S.length) setVisible(S[k].cut);
    else {
      complete(ch.id);
      award(`check:${ch.id}`, XP_PER_CHECK);
      if (score >= 4) award("game:boss", 40);
    }
  };
  const reset = () => {
    setN(0);
    setScore(0);
    setPick(null);
    setVisible(S[0].cut);
  };

  return (
    <Level
      chapter={ch}
      accent={GOLD}
      tldr={["5 real-style scenarios. Long, short — or skip.", "Skipping is a position. Two of these are skips.", "Score 4+ for bonus XP."]}
    >
      <Panel className="relative overflow-hidden border-gold/30">
        {burst > 0 && <Burst key={burst} seed={burst} />}
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
              <Trophy className="mx-auto text-gold" size={56} />
              <div className="mt-4 text-6xl font-black text-gold">
                {score}/{S.length}
              </div>
              <p className="mx-auto mt-3 max-w-md text-lg text-slate-300">
                {score === 5
                  ? "Flawless. You read context, not candles. Go backtest your favourite model."
                  : score >= 4
                    ? "Boss defeated. One slip — replay the level that tripped you."
                    : "The boss wins this round. Re-run Levels 06 & 10, then come back. Every rep counts."}
              </p>
              <Btn className="mt-6" active onClick={reset}>
                <RotateCcw size={15} /> Fight again
              </Btn>
            </motion.div>
          ) : (
            <motion.div key={n} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                <span className="rounded-full bg-gold px-2.5 py-1 text-ink">
                  ROUND {n + 1}/{S.length}
                </span>
                <span className={cn("rounded-full border px-2.5 py-1", s.inst === "XAUUSD" ? "border-gold/40 text-gold" : "border-sky/40 text-sky")}>
                  {s.inst === "XAUUSD" ? "◆" : "▲"} {s.inst} · {s.tf}
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-400">{s.time}</span>
                <span className="ml-auto text-slate-400">
                  SCORE <span className="text-gold">{score}</span>
                </span>
              </div>
              <p className="mb-3 text-lg font-semibold text-white">{s.context}</p>
              <div className="rounded-2xl bg-black/30 p-2">
                <CandleChart
                  candles={s.candles}
                  visible={visible}
                  zones={s.zones}
                  lines={s.lines}
                  height={300}
                  axis={false}
                  rightPad={3}
                  highlight={pick ? [] : [s.cut - 1]}
                >
                  {({ x, height }) => (
                    <line x1={x(s.cut - 0.5)} x2={x(s.cut - 0.5)} y1={0} y2={height} stroke="#ffffff30" strokeDasharray="4 4" />
                  )}
                </CandleChart>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {(
                  [
                    ["long", "LONG ↑", BULL],
                    ["skip", "SKIP ⏸", "#94a3b8"],
                    ["short", "SHORT ↓", BEAR],
                  ] as const
                ).map(([c, label, color]) => {
                  const chosen = pick === c;
                  const right = pick && c === s.answer;
                  return (
                    <motion.button
                      key={c}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => choose(c)}
                      className={cn("rounded-2xl border-2 py-4 text-base font-black tracking-wide transition sm:text-xl", pick && !chosen && !right && "opacity-30")}
                      style={{
                        borderColor: right ? BULL : chosen ? BEAR : `${color}55`,
                        background: right ? `${BULL}22` : chosen ? `${BEAR}18` : `${color}0d`,
                        color: right ? BULL : chosen ? BEAR : color,
                      }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {pick && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center">
                    <p className="flex-1 text-[15px] text-slate-200">
                      <b className={pick === s.answer ? "text-bull" : "text-bear"}>{pick === s.answer ? "Correct. " : `Answer: ${s.answer.toUpperCase()}. `}</b>
                      {s.why}
                    </p>
                    <Btn active onClick={next}>
                      {n === S.length - 1 ? "Final score →" : "Next round →"}
                    </Btn>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>
    </Level>
  );
}
