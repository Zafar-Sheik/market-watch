"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { Burst } from "@/components/ui/confetti";
import { chain, type Candle } from "@/lib/candles";
import { CHAPTERS } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const DOWN: [number, number, number][] = [
  [97, 1, 1], [98, 1, 0.5], [94, 0.8, 1], [95, 1, 0.6], [91, 0.5, 1], [92, 1, 0.8], [88, 0.6, 1], [89, 0.8, 0.6], [85, 0.5, 0.8],
];
const UP: [number, number, number][] = [
  [73, 1, 1], [72, 0.5, 1], [76, 1, 0.8], [75, 0.6, 1], [79, 1, 0.5], [78, 0.8, 1], [82, 1, 0.6], [81, 0.6, 0.8], [85, 0.8, 0.5],
];

type Pattern = {
  id: string;
  name: string;
  tag: "Bullish" | "Bearish" | "Both";
  candles: Candle[];
  focus: number[];
  level: number;
  says: string;
  valid: string[];
  trigger: string;
  stop: string;
};

const P: Pattern[] = [
  {
    id: "hammer",
    name: "Pin Bar (Hammer)",
    tag: "Bullish",
    candles: chain(100, [...DOWN, [86, 0.4, 7], [89, 0.6, 0.4], [92, 0.8, 0.5], [91, 0.5, 0.6]]),
    focus: [9],
    level: 79,
    says: "Price was pushed down, stops got hit, and buyers slammed it back. The wick is a rejected price.",
    valid: ["Prints AT a level (support, demand, swept low)", "Wick ≥ 2× the body", "Closes in the top third of its range"],
    trigger: "Enter on a break of the pin's high, or a 50% retrace into the wick.",
    stop: "Below the wick low (plus spread — gold's spread widens at news).",
  },
  {
    id: "engulf",
    name: "Bullish Engulfing",
    tag: "Bullish",
    candles: chain(100, [...DOWN, [83, 0.4, 0.6], [89, 0.5, 0.3], [91, 0.6, 0.5], [93, 0.5, 0.5]]),
    focus: [9, 10],
    level: 82.3,
    says: "Sellers had one candle. Buyers erased ALL of it in the next. Control has flipped.",
    valid: ["Second body fully covers the first body", "Happens at a level or after a sweep", "Bigger = better (displacement)"],
    trigger: "Enter on the close of the engulfing candle or a retrace to its 50%.",
    stop: "Below the low of the two-candle pattern.",
  },
  {
    id: "star",
    name: "Morning Star",
    tag: "Bullish",
    candles: chain(100, [...DOWN, [80, 0.4, 0.5], [80.4, 1.2, 1.4], [86, 0.5, 0.3], [88, 0.6, 0.4], [87.5, 0.5, 0.5]]),
    focus: [9, 10, 11],
    level: 78.5,
    says: "Big sell candle → tiny 'pause' candle → big buy candle. Momentum died, then reversed.",
    valid: ["Middle candle is small (doji / spinning top)", "Third candle closes past the middle of candle 1", "At a level"],
    trigger: "Enter on the close of candle 3.",
    stop: "Below the middle candle's low.",
  },
  {
    id: "inside",
    name: "Inside Bar Break",
    tag: "Both",
    candles: chain(70, [...UP, [89, 0.5, 0.5], [88, 0.3, 0.5], [88.5, 0.4, 0.4], [92, 0.6, 0.4], [94, 0.5, 0.5]]),
    focus: [9, 10, 11],
    level: 0,
    says: "A 'mother' candle, then candle(s) that stay inside its range = compression. The break shows who won.",
    valid: ["Inside candle(s) stay within the mother bar's high/low", "Trade it WITH the trend", "Tighter = more explosive"],
    trigger: "Buy-stop above the mother high (or sell-stop below the low).",
    stop: "Opposite side of the mother bar.",
  },
  {
    id: "star2",
    name: "Shooting Star",
    tag: "Bearish",
    candles: chain(70, [...UP, [84.5, 6, 0.4], [82, 0.4, 0.6], [79, 0.5, 0.6], [80, 0.6, 0.4]]),
    focus: [9],
    level: 91,
    says: "Buyers pushed price way up — then got rejected. The upper wick is supply sitting above.",
    valid: ["At resistance / supply / after taking a high", "Upper wick ≥ 2× body", "Closes in the bottom third"],
    trigger: "Enter on a break of the star's low.",
    stop: "Above the wick high.",
  },
  {
    id: "sfp",
    name: "Sweep & Reclaim",
    tag: "Both",
    candles: chain(90, [[86, 1, 0.5], [87, 1, 0.4], [84, 0.5, 0.2], [86, 0.8, 0.5], [88, 1, 0.5], [85, 0.4, 0.1], [87, 0.6, 0.5], [84.5, 0.6, 0.4], [85.5, 0.5, 4], [89, 0.5, 0.4], [91, 0.6, 0.5], [90.5, 0.5, 0.5]]),
    focus: [8],
    level: 83.8,
    says: "Price spikes below an obvious low (stops trigger), then CLOSES back above it. A trap — the move is the opposite way.",
    valid: ["Clear, obvious low/high that got taken", "Wick through — body closes back inside", "Ideally at a session/day high or low"],
    trigger: "Enter on the reclaim close or the next candle's retest.",
    stop: "Beyond the sweep wick.",
  },
];

export function L02Confirmations() {
  const ch = CHAPTERS[1];
  return (
    <Level
      chapter={ch}
      accent={BULL}
      tldr={[
        "A confirmation candle is the market showing its hand AT your level.",
        "Same candle, wrong place = noise. Level first, candle second.",
        "Always wait for the candle to CLOSE. Wicks lie until then.",
      ]}
    >
      <Gallery />
      <SpotIt />
      <Callout kind="warn">
        A perfect hammer in the middle of nowhere is <b>not</b> a signal. Patterns are the trigger, not the reason. The reason
        is the level, the liquidity and the structure you&apos;ll learn next.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="You see a beautiful bullish engulfing candle… in the middle of a range, far from any level. What do you do?"
        options={["Buy immediately", "Skip it — no level, no trade", "Sell it, it's a trap", "Double my risk"]}
        answer={1}
        explain="Yes. No level = no context. Confirmation candles only mean something at a level you planned in advance."
      />
    </Level>
  );
}

function Gallery() {
  const [i, setI] = useState(0);
  const p = P[i];
  const tagColor = p.tag === "Bullish" ? BULL : p.tag === "Bearish" ? BEAR : SKY;
  const f = p.focus;
  const inside = p.id === "inside";
  return (
    <Panel>
      <PanelTitle kicker="THE BIG SIX" title="Confirmation candles that actually matter" hint="Tap through. Highlighted = the pattern." />
      <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {P.map((x, k) => (
          <Btn key={x.id} onClick={() => setI(k)} active={k === i} className="shrink-0">
            {x.name}
          </Btn>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-black/30 p-2">
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CandleChart
                candles={p.candles}
                height={300}
                highlight={f}
                dimOthers
                axis={false}
                lines={
                  inside
                    ? [
                        { price: p.candles[9].h, from: 9, to: 13, color: GOLD, dashed: true, label: "mother high" },
                        { price: p.candles[9].l, from: 9, to: 13, color: GOLD, dashed: true, label: "mother low" },
                      ]
                    : [{ price: p.level, color: p.tag === "Bearish" ? BEAR : BULL, dashed: true, label: p.id === "sfp" ? "obvious low" : "your level", labelSide: "left" }]
                }
                markers={[
                  {
                    i: f[f.length - 1],
                    price: p.tag === "Bearish" ? p.candles[f[f.length - 1]].h : p.candles[f[0]].l,
                    label: p.name.split(" (")[0],
                    color: tagColor,
                    pos: p.tag === "Bearish" ? "above" : "below",
                  },
                ]}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-bold text-white">{p.name}</h4>
            <span className="rounded-full px-2 py-0.5 font-mono text-[11px] font-bold" style={{ color: tagColor, background: `${tagColor}1a` }}>
              {p.tag}
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-300">{p.says}</p>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 font-mono text-[11px] font-bold tracking-widest text-slate-500">ONLY VALID IF</div>
            {p.valid.map((v) => (
              <div key={v} className="flex gap-2 py-0.5 text-sm text-slate-200">
                <Check size={16} className="mt-0.5 shrink-0 text-bull" /> {v}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl border border-bull/25 bg-bull/5 p-3">
              <div className="mb-1 font-mono text-[10px] font-bold text-bull">TRIGGER</div>
              <div className="text-slate-300">{p.trigger}</div>
            </div>
            <div className="rounded-xl border border-bear/25 bg-bear/5 p-3">
              <div className="mb-1 font-mono text-[10px] font-bold text-bear">STOP</div>
              <div className="text-slate-300">{p.stop}</div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/** Mini-game: name the highlighted pattern. */
function SpotIt() {
  const [order, setOrder] = useState(() => P.map((_, i) => i));
  const [round, setRound] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const p = P[order[round % P.length]];
  const choices = useMemo(() => {
    const others = P.filter((x) => x.id !== p.id).slice(0, 3);
    const all = [p, ...others];
    // deterministic shuffle per round
    return all.sort((a, b) => ((a.id.charCodeAt(1) * (round + 3)) % 7) - ((b.id.charCodeAt(1) * (round + 3)) % 7));
  }, [p, round]);
  const finished = round >= P.length;

  const choose = (id: string) => {
    if (pick) return;
    setPick(id);
    if (id === p.id) {
      setScore((s) => s + 1);
      setBurst((b) => b + 1);
    }
  };
  const next = () => {
    setPick(null);
    const r = round + 1;
    setRound(r);
    if (r >= P.length) award("game:spotit", 40);
  };

  return (
    <Panel className="relative overflow-hidden">
      {burst > 0 && <Burst key={burst} seed={burst} />}
      <div className="flex items-start justify-between gap-4">
        <PanelTitle kicker="MINI-GAME · +40 XP" title="Spot the pattern" hint="Name the highlighted candle(s). 6 rounds. Fast." />
        <div className="rounded-xl border border-white/10 px-3 py-2 text-center font-mono">
          <div className="text-[10px] text-slate-500">SCORE</div>
          <div className="text-lg font-bold text-gold">
            {score}/{Math.min(round + (pick ? 1 : 0), P.length)}
          </div>
        </div>
      </div>
      {finished ? (
        <div className="py-10 text-center">
          <div className="text-5xl font-black text-gold">{score}/6</div>
          <p className="mt-2 text-slate-300">{score >= 5 ? "Pattern brain: unlocked. 🔓" : "Solid. Run it back — repetition is how this sticks."}</p>
          <Btn
            className="mt-4"
            active
            onClick={() => {
              setOrder((o) => [...o].sort(() => Math.random() - 0.5));
              setRound(0);
              setScore(0);
            }}
          >
            <Shuffle size={15} /> Play again
          </Btn>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-black/30 p-2">
            <CandleChart candles={p.candles} height={240} highlight={p.focus} axis={false} />
          </div>
          <div className="flex flex-col gap-2">
            {choices.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.id)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-[15px] font-medium transition",
                  !pick && "border-white/10 bg-white/[0.03] hover:border-white/30",
                  pick && c.id === p.id && "border-bull/70 bg-bull/15 text-white",
                  pick && pick === c.id && c.id !== p.id && "border-bear/60 bg-bear/10 text-slate-400",
                  pick && pick !== c.id && c.id !== p.id && "border-white/5 text-slate-500",
                )}
              >
                {c.name}
              </button>
            ))}
            {pick && (
              <Btn onClick={next} active className="mt-1 justify-center">
                {round === P.length - 1 ? "See score" : "Next round →"}
              </Btn>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}
