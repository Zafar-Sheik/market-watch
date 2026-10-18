"use client";

import gsap from "gsap";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { BEAR, BULL, GOLD } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { CHAPTERS } from "@/lib/chapters";
import { clamp, cn } from "@/lib/utils";

type OHLC = { o: number; h: number; l: number; c: number };

const PRESETS: { name: string; v: OHLC }[] = [
  { name: "Bull momentum", v: { o: 25, h: 82, l: 22, c: 80 } },
  { name: "Hammer", v: { o: 62, h: 77, l: 12, c: 74 } },
  { name: "Shooting star", v: { o: 34, h: 90, l: 28, c: 30 } },
  { name: "Doji", v: { o: 50, h: 78, l: 22, c: 51 } },
  { name: "Bear momentum", v: { o: 80, h: 83, l: 18, c: 20 } },
];

function read(v: OHLC) {
  const range = Math.max(1, v.h - v.l);
  const body = Math.abs(v.c - v.o);
  const up = v.h - Math.max(v.o, v.c);
  const dn = Math.min(v.o, v.c) - v.l;
  const closePos = (v.c - v.l) / range; // 0 = closed at low, 1 = at high
  const bull = v.c >= v.o;
  const pct = (n: number) => Math.round((n / range) * 100);
  let verdict: { name: string; text: string; color: string };
  if (body / range < 0.1 && up / range > 0.2 && dn / range > 0.2)
    verdict = { name: "Doji · indecision", text: "Buyers and sellers fought to a draw. On its own it means nothing — at a key level it warns the current push is tiring.", color: GOLD };
  else if (body / range > 0.75)
    verdict = bull
      ? { name: "Bullish marubozu · displacement", text: "Buyers controlled the entire candle. Big body, tiny wicks = conviction. These candles create fair value gaps and break structure.", color: BULL }
      : { name: "Bearish marubozu · displacement", text: "Sellers controlled the entire candle. Big body, tiny wicks = conviction. These candles create fair value gaps and break structure.", color: BEAR };
  else if (dn > body * 2 && closePos > 0.6)
    verdict = { name: "Hammer / bullish pin bar", text: "Sellers pushed price way down… and got rejected. The long lower wick is where stops got hit and buyers stepped in.", color: BULL };
  else if (up > body * 2 && closePos < 0.4)
    verdict = { name: "Shooting star / bearish pin bar", text: "Buyers pushed price way up… and got rejected. The long upper wick shows supply sitting above.", color: BEAR };
  else
    verdict = bull
      ? { name: "Bullish candle", text: "Buyers won this round, but there was a real fight (see the wicks). Context decides what it means.", color: BULL }
      : { name: "Bearish candle", text: "Sellers won this round, but there was a real fight (see the wicks). Context decides what it means.", color: BEAR };
  return { body: pct(body), up: pct(up), dn: pct(dn), closePos: Math.round(closePos * 100), bull, verdict };
}

export function L01Candle() {
  const ch = CHAPTERS[0];
  return (
    <Level
      chapter={ch}
      tldr={[
        "Every candle = a fight between buyers and sellers over one slice of time.",
        "Body = who won. Wicks = where someone tried and got rejected.",
        "WHERE a candle prints matters more than WHAT it looks like.",
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <CandleBuilder />
        <TickReplay />
      </div>
      <TimeframeMerge />
      <Callout kind="gold">
        Gold wicks <b>hard</b> — $5–$15 spikes around London open, NY open and USD news are normal. A long wick on XAUUSD
        often marks a liquidity grab, not a breakout. Wait for the candle to <b>close</b> before you believe it.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="A candle has a tiny body near its high and a long lower wick. What happened inside it?"
        options={[
          "Buyers controlled it the whole time",
          "Sellers pushed down, then got rejected — buyers closed it near the high",
          "Nothing, it's indecision",
          "Sellers won the candle",
        ]}
        answer={1}
        explain="Exactly. The lower wick is the 'rejected' area. That's a hammer / bullish pin bar — meaningful when it prints at support or after a sweep of lows."
      />
    </Level>
  );
}

function CandleBuilder() {
  const [v, setV] = useState<OHLC>(PRESETS[1].v);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<keyof OHLC | null>(null);
  const r = read(v);
  const H = 300;
  const Y = (p: number) => H - 20 - (p / 100) * (H - 40);
  const P = (py: number) => clamp(((H - 20 - py) / (H - 40)) * 100, 0, 100);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const p = Math.round(P(((e.clientY - rect.top) / rect.height) * H));
    setV((prev) => {
      const n = { ...prev, [drag.current!]: p };
      // keep the candle valid
      if (drag.current === "h") n.h = Math.max(p, n.o, n.c);
      if (drag.current === "l") n.l = Math.min(p, n.o, n.c);
      n.h = Math.max(n.h, n.o, n.c);
      n.l = Math.min(n.l, n.o, n.c);
      return n;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = r.bull ? BULL : BEAR;
  const handles: { k: keyof OHLC; label: string; x: number }[] = [
    { k: "h", label: "HIGH", x: 150 },
    { k: "o", label: "OPEN", x: 60 },
    { k: "c", label: "CLOSE", x: 240 },
    { k: "l", label: "LOW", x: 150 },
  ];

  return (
    <Panel>
      <PanelTitle kicker="PLAY" title="Build a candle" hint="Drag the 4 handles. Watch the read-out change." />
      <div className="grid gap-4 sm:grid-cols-[300px_1fr]">
        <svg
          ref={svgRef}
          viewBox={`0 0 300 ${H}`}
          className="w-full touch-none rounded-2xl bg-black/30"
          onPointerMove={onMove}
          onPointerUp={() => (drag.current = null)}
          onPointerLeave={() => (drag.current = null)}
        >
          <line x1={150} x2={150} y1={Y(v.h)} y2={Y(v.l)} stroke={color} strokeWidth={3} />
          <motion.rect
            x={115}
            width={70}
            animate={{ y: Y(Math.max(v.o, v.c)), height: Math.max(3, Math.abs(Y(v.o) - Y(v.c))) }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            fill={color}
            rx={4}
          />
          {/* labels for wick + body zones */}
          <text x={190} y={(Y(v.h) + Y(Math.max(v.o, v.c))) / 2 + 4} fontSize={10} className="fill-slate-500 font-mono">
            {r.up > 6 ? `wick ${r.up}%` : ""}
          </text>
          <text x={190} y={(Y(v.l) + Y(Math.min(v.o, v.c))) / 2 + 4} fontSize={10} className="fill-slate-500 font-mono">
            {r.dn > 6 ? `wick ${r.dn}%` : ""}
          </text>
          {handles.map((hd) => {
            const py = Y(v[hd.k]);
            const offset = hd.k === "h" ? -14 : hd.k === "l" ? 14 : 0;
            return (
              <g
                key={hd.k}
                className="cursor-ns-resize"
                onPointerDown={(e) => {
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                  drag.current = hd.k;
                }}
              >
                <line x1={hd.x < 150 ? hd.x + 22 : 150} x2={hd.x > 150 ? hd.x - 22 : 150} y1={py} y2={py} stroke="#ffffff30" strokeDasharray="2 3" />
                <circle cx={hd.x} cy={py + offset} r={16} fill="#0b0f17" stroke={GOLD} strokeWidth={2} />
                <text x={hd.x} y={py + offset + 3.5} textAnchor="middle" fontSize={9} fontWeight={800} fill={GOLD} className="font-mono">
                  {hd.label[0]}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <Stat label="BODY" value={`${r.body}%`} />
            <Stat label="UP WICK" value={`${r.up}%`} />
            <Stat label="LOW WICK" value={`${r.dn}%`} />
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: `${r.verdict.color}55`, background: `${r.verdict.color}10` }}>
            <div className="mb-1 text-lg font-bold" style={{ color: r.verdict.color }}>
              {r.verdict.name}
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{r.verdict.text}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <Btn key={p.name} onClick={() => setV(p.v)} className="px-2.5 py-1.5 text-xs">
                {p.name}
              </Btn>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

/** Replays how a single candle is born tick by tick, so wicks finally make sense. */
function TickReplay() {
  const path = [50, 58, 54, 66, 72, 60, 40, 22, 30, 45, 62, 70, 74, 71];
  const [state, setState] = useState({ o: 50, h: 50, l: 50, c: 50, t: 0 });
  const [running, setRunning] = useState(false);
  const H = 300;
  const Y = (p: number) => H - 30 - (p / 100) * (H - 60);

  const run = () => {
    const obj = { t: 0 };
    setRunning(true);
    let h = 50;
    let l = 50;
    gsap.to(obj, {
      t: path.length - 1,
      duration: 4.2,
      ease: "none",
      onUpdate: () => {
        const i = Math.floor(obj.t);
        const f = obj.t - i;
        const p = path[i] + (path[Math.min(i + 1, path.length - 1)] - path[i]) * f;
        h = Math.max(h, p);
        l = Math.min(l, p);
        setState({ o: 50, h, l, c: p, t: obj.t });
      },
      onComplete: () => setRunning(false),
    });
  };

  const phase =
    state.t === 0
      ? "Press play. One candle, one minute, every tick."
      : state.t < 4
        ? "Buyers push up from the open…"
        : state.t < 8
          ? "Sellers smash it down — stops below get hit. That spike is becoming the lower wick."
          : running
            ? "Buyers absorb it and drive it back up."
            : "Closed near the high. The wick is the 'memory' of the failed sell-off.";

  const bull = state.c >= state.o;
  const col = bull ? BULL : BEAR;
  return (
    <Panel>
      <PanelTitle kicker="WATCH" title="How a wick is born" hint="Candles hide the story. This replays it." />
      <svg viewBox={`0 0 300 ${H}`} className="w-full rounded-2xl bg-black/30">
        {/* tick trail */}
        <polyline
          fill="none"
          stroke="#ffffff40"
          strokeWidth={1.5}
          points={path
            .slice(0, Math.floor(state.t) + 1)
            .map((p, i) => `${20 + i * 7},${Y(p)}`)
            .join(" ")}
        />
        <line x1={190} x2={190} y1={Y(state.h)} y2={Y(state.l)} stroke={col} strokeWidth={3} />
        <rect x={160} width={60} y={Y(Math.max(state.o, state.c))} height={Math.max(2, Math.abs(Y(state.o) - Y(state.c)))} fill={col} rx={4} />
        <circle cx={250} cy={Y(state.c)} r={5} fill={GOLD} />
        <line x1={220} x2={250} y1={Y(state.c)} y2={Y(state.c)} stroke={GOLD} strokeDasharray="2 2" />
        <text x={258} y={Y(state.c) + 4} fontSize={10} fill={GOLD} className="font-mono">
          price
        </text>
      </svg>
      <p className={cn("mt-3 min-h-[48px] text-[15px] text-slate-300")}>{phase}</p>
      <Btn onClick={run} disabled={running} active>
        <Play size={15} /> {state.t === 0 ? "Play the candle" : "Replay"}
      </Btn>
    </Panel>
  );
}

/** Four 15m candles become one 1H candle. Timeframes are just zoom. */
function TimeframeMerge() {
  const [merged, setMerged] = useState(false);
  const small = [
    { o: 40, h: 48, l: 30, c: 34 },
    { o: 34, h: 38, l: 14, c: 22 },
    { o: 22, h: 60, l: 20, c: 56 },
    { o: 56, h: 74, l: 50, c: 70 },
  ];
  const big = { o: 40, h: 74, l: 14, c: 70 };
  const H = 200;
  const Y = (p: number) => H - 14 - (p / 80) * (H - 28);
  return (
    <Panel>
      <div className="grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
        <div>
          <PanelTitle kicker="ZOOM" title="Timeframes are just zoom levels" />
          <p className="text-[15px] leading-relaxed text-slate-300">
            Four 15-minute candles = one 1-hour candle. That &quot;scary&quot; red sell-off on the 15m is just the lower wick of a
            bullish 1H hammer. <b className="text-white">Always know what the higher timeframe candle looks like.</b>
          </p>
          <Btn className="mt-4" onClick={() => setMerged(!merged)} active>
            {merged ? "Split into 4 × 15m" : "Merge into 1 × 1H"}
          </Btn>
        </div>
        <svg viewBox={`0 0 320 ${H}`} className="w-full rounded-2xl bg-black/30">
          {small.map((c, i) => {
            const x = merged ? 160 : 70 + i * 60;
            const col = c.c >= c.o ? BULL : BEAR;
            return (
              <motion.g key={i} animate={{ x: x - 70 - i * 60, opacity: merged ? 0 : 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                <line x1={70 + i * 60} x2={70 + i * 60} y1={Y(c.h)} y2={Y(c.l)} stroke={col} strokeWidth={2} />
                <rect x={70 + i * 60 - 12} width={24} y={Y(Math.max(c.o, c.c))} height={Math.abs(Y(c.o) - Y(c.c))} fill={col} rx={2} />
              </motion.g>
            );
          })}
          <motion.g initial={false} animate={{ opacity: merged ? 1 : 0, scale: merged ? 1 : 0.6 }} style={{ transformOrigin: "160px 100px" }}>
            <line x1={160} x2={160} y1={Y(big.h)} y2={Y(big.l)} stroke={BULL} strokeWidth={3} />
            <rect x={136} width={48} y={Y(big.c)} height={Y(big.o) - Y(big.c)} fill={BULL} rx={3} />
            <text x={200} y={Y(big.l) - 4} fontSize={11} fill={BULL} className="font-mono">
              ← that sell-off
            </text>
          </motion.g>
        </svg>
      </div>
    </Panel>
  );
}
