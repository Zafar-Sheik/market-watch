"use client";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BEAR, BULL, GOLD, SKY, VIOLET, type HLine, type Marker, type Zone } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { PlayerControls, usePlayer, type Step } from "@/components/learn/Player";
import { ToolShell } from "@/components/ict/Tools";
import { Burst } from "@/components/ui/confetti";
import { rng } from "@/lib/candles";
import { ABS_LEVEL, DIV_HIGH, S_ABS, S_CHOP, S_DIV, S_PROF, S_STACK, S_VWAP, STACK_ZONE, mirrorFlow } from "@/lib/of/scenarios";
import { volumeProfile, type OFBar } from "@/lib/orderflow";
import { useProgress } from "@/lib/progress";
import { cn, fmt } from "@/lib/utils";
import { FlowChart } from "./FlowChart";

/* ── F3: aggressive vs passive battle ──────────────────────────────────── */
export function AggressionLab() {
  const [buy, setBuy] = useState(260);
  const [wall, setWall] = useState(320);
  const broke = buy > wall;
  const H = 220;
  const level = 110;
  return (
    <ToolShell kicker="PLAY" title="Aggressive buyers vs a passive seller" hint="Market buyers push up into a limit-sell wall at $4,460. Drag both sliders. Who wins?">
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <label className="block">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-bull">Market BUY orders (aggressive)</span>
              <span className="font-mono text-white">{buy} lots</span>
            </div>
            <input type="range" min={0} max={600} value={buy} onChange={(e) => setBuy(+e.target.value)} className="w-full" />
          </label>
          <label className="block">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-bear">Limit SELL wall at 4,460 (passive)</span>
              <span className="font-mono text-white">{wall} lots</span>
            </div>
            <input type="range" min={0} max={600} value={wall} onChange={(e) => setWall(+e.target.value)} className="w-full" />
          </label>
          <div className="h-5 overflow-hidden rounded-full bg-white/5">
            <motion.div className="h-full bg-gradient-to-r from-bull to-bull/60" animate={{ width: `${(buy / Math.max(1, buy + wall)) * 100}%` }} />
          </div>
          <div className={cn("rounded-2xl border p-4", broke ? "border-bull/50 bg-bull/10" : "border-bear/50 bg-bear/10")}>
            <div className={cn("text-xl font-black", broke ? "text-bull" : "text-bear")}>{broke ? "BREAKOUT — the wall got eaten" : "ABSORBED — buyers hit a brick wall"}</div>
            <p className="mt-1 text-sm text-slate-200">
              {broke
                ? "Aggressive buyers used up every sell order at 4,460, so the next trades happen higher. Price only moves when one side runs out."
                : `Delta is +${buy} (lots of buying!) yet price can't get through. The passive seller absorbed it. If buyers give up, price often drops — positive delta, bearish outcome.`}
            </p>
          </div>
        </div>
        <svg viewBox={`0 0 300 ${H}`} className="w-full rounded-2xl bg-black/30">
          <line x1={0} x2={300} y1={level} y2={level} stroke={BEAR} strokeDasharray="5 4" />
          <text x={8} y={level - 6} fontSize={11} fontWeight={800} fill={BEAR} className="font-mono">
            SELL WALL 4,460 · {wall}
          </text>
          <motion.g initial={false} animate={broke ? { y: 0 } : { y: 0 }}>
            {(() => {
              const top = broke ? level - 20 - Math.min(70, (buy - wall) / 4) : level - 6;
              const close = broke ? top + 8 : level + 40;
              const open = 180;
              const col = broke ? BULL : close < open ? BULL : BEAR;
              return (
                <g>
                  <motion.line x1={150} x2={150} animate={{ y1: top, y2: 196 }} stroke={col} strokeWidth={3} />
                  <motion.rect x={128} width={44} animate={{ y: Math.min(open, close), height: Math.abs(open - close) }} fill={col} rx={4} />
                </g>
              );
            })()}
          </motion.g>
          <text x={180} y={200} fontSize={11} fill="#94a3b8" className="font-mono">
            delta +{buy}
          </text>
        </svg>
      </div>
    </ToolShell>
  );
}

/* ── F4: tape-reading reaction game ────────────────────────────────────── */
type TPrint = { id: number; size: number; side: "buy" | "sell"; price: number; whale: boolean; at: number };
export function TapeGame() {
  const [running, setRunning] = useState(false);
  const [prints, setPrints] = useState<TPrint[]>([]);
  const [stats, setStats] = useState({ hits: 0, misses: 0, false: 0, rt: [] as number[] });
  const [left, setLeft] = useState(30);
  const [burst, setBurst] = useState(0);
  const lastWhale = useRef<TPrint | null>(null);
  const caught = useRef(false);
  const n = useRef(0);
  const price = useRef(4450);
  const { award } = useProgress();

  const start = () => {
    setPrints([]);
    setStats({ hits: 0, misses: 0, false: 0, rt: [] });
    setLeft(30);
    lastWhale.current = null;
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    const r = rng(Date.now() % 100000);
    const id = setInterval(() => {
      const whale = r() < 0.07;
      const side = r() > 0.5 ? "buy" : "sell";
      price.current += (side === "buy" ? 1 : -1) * (r() < 0.4 ? 0.1 : 0);
      const p: TPrint = { id: ++n.current, size: whale ? Math.round(90 + r() * 260) : Math.round(1 + r() * 9), side, price: price.current, whale, at: performance.now() };
      if (whale) {
        if (lastWhale.current && !caught.current) setStats((s) => ({ ...s, misses: s.misses + 1 }));
        lastWhale.current = p;
        caught.current = false;
      }
      setPrints((ps) => [p, ...ps].slice(0, 14));
    }, 260);
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(t);
    };
  }, [running]);

  useEffect(() => {
    if (running && left <= 0) {
      setRunning(false);
      if (stats.hits >= 4 && award("of:tape", 30)) setBurst((b) => b + 1);
    }
  }, [left, running, stats.hits, award]);

  const hit = useCallback(() => {
    if (!running) return;
    const w = lastWhale.current;
    if (w && !caught.current && performance.now() - w.at < 1600) {
      caught.current = true;
      setStats((s) => ({ ...s, hits: s.hits + 1, rt: [...s.rt, Math.round(performance.now() - w.at)] }));
    } else setStats((s) => ({ ...s, false: s.false + 1 }));
  }, [running]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (running && e.code === "Space") {
        e.preventDefault();
        hit();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [hit, running]);

  const avg = stats.rt.length ? Math.round(stats.rt.reduce((a, b) => a + b, 0) / stats.rt.length) : 0;
  return (
    <ToolShell kicker="REFLEX GAME · +30 XP" title="Spot the whale on the tape" hint="Prints stream in. When a BIG print appears (50+ lots), hit WHALE (or space). 30 seconds. Catch 4+ to win.">
      {burst > 0 && <Burst key={burst} />}
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div className="grid grid-cols-3 border-b border-white/10 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-500">
            <span>SIDE</span>
            <span className="text-center">PRICE</span>
            <span className="text-right">SIZE</span>
          </div>
          <AnimatePresence initial={false}>
            {prints.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("grid grid-cols-3 px-3 py-1 font-mono text-sm", p.side === "buy" ? "text-bull" : "text-bear", p.whale && "bg-gold/15 text-base font-black")}
              >
                <span>{p.side === "buy" ? "▲ BUY" : "▼ SELL"}</span>
                <span className="text-center">{fmt(p.price, 1)}</span>
                <span className="text-right">{p.size}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!running && !prints.length && <div className="p-6 text-center text-sm text-slate-500">Press start. Stay calm. Most prints are tiny noise.</div>}
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <Stat l="TIME LEFT" v={`${Math.max(0, left)}s`} c="#e2e8f0" />
            <Stat l="CAUGHT" v={`${stats.hits}`} c={BULL} />
            <Stat l="MISSED" v={`${stats.misses}`} c={BEAR} />
            <Stat l="AVG REACTION" v={avg ? `${avg}ms` : "—"} c={GOLD} />
          </div>
          <button
            type="button"
            onClick={running ? hit : start}
            className={cn("flex-1 rounded-3xl border-2 text-2xl font-black transition active:scale-95", running ? "border-gold bg-gold/20 text-gold" : "border-white/20 text-white hover:border-gold/60")}
          >
            {running ? "🐋 WHALE!" : left <= 0 ? "Play again" : "Start"}
          </button>
          {!running && left <= 0 && (
            <p className="text-sm text-slate-300">
              {stats.hits >= 4 ? "Sharp eyes. " : "Practice makes this automatic. "}On real tapes, a big print matters most AT a level — and what price does next tells you if it was aggressive initiative or got absorbed.
            </p>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function Stat({ l, v, c }: { l: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <div className="text-[10px] text-slate-500">{l}</div>
      <div className="text-lg font-bold" style={{ color: c }}>
        {v}
      </div>
    </div>
  );
}

/* ── F6: footprint explorer ────────────────────────────────────────────── */
type FPRow = { p: number; bid: number; ask: number };
type FPCandle = { o: number; c: number; h: number; l: number; rows: FPRow[]; story: string; title: string };

function makeFP(o: number, c: number, h: number, l: number, mode: "sell" | "absorb" | "stack" | "mild", seed: number, title: string, story: string): FPCandle {
  const r = rng(seed);
  const rows: FPRow[] = [];
  const n = Math.round((h - l) / 0.5);
  for (let k = n; k >= 0; k--) {
    const p = l + k * 0.5;
    const rel = k / n; // 0 bottom, 1 top
    let bid = 20 + r() * 40;
    let ask = 20 + r() * 40;
    if (mode === "sell") {
      bid = 90 + r() * 80;
      ask = 18 + r() * 22;
    }
    if (mode === "absorb") {
      if (rel < 0.3) {
        bid = 320 + r() * 160;
        ask = 90 + r() * 40;
      } else {
        bid = 40 + r() * 40;
        ask = 55 + r() * 45;
      }
    }
    if (mode === "stack") {
      if (rel > 0.25 && rel < 0.75) {
        ask = 210 + r() * 90;
        bid = 25 + r() * 25;
      } else {
        ask = 70 + r() * 40;
        bid = 35 + r() * 30;
      }
    }
    if (mode === "mild") {
      ask = 55 + r() * 25;
      bid = 45 + r() * 20;
    }
    if ((k === n || k === 0) && mode !== "mild") {
      bid *= 0.4;
      ask *= 0.4;
    }
    rows.push({ p, bid: Math.round(bid), ask: Math.round(ask) });
  }
  return { o, c, h, l, rows, title, story };
}

const FP: FPCandle[] = [
  makeFP(4452, 4448, 4452.5, 4447.5, "sell", 3, "1 · Sellers in control", "Bid column is heavy everywhere: sellers are hitting bids aggressively. Red sell imbalances run down the candle."),
  makeFP(4448, 4449, 4449.5, 4445.5, "absorb", 5, "2 · Absorption at the low", "Massive volume traded at the BID at the lows (sellers smashing) — but price won't go lower and the candle closes UP. Passive buyers absorbed it all."),
  makeFP(4449, 4454, 4454.5, 4448.5, "stack", 7, "3 · Stacked buy imbalances", "Ask volume ≥ 3× the bid diagonally on several levels in a row: aggressive buyers overwhelming sellers. That zone becomes support."),
  makeFP(4454, 4456, 4456.5, 4453, "mild", 9, "4 · Continuation", "Balanced-ish two-way trade but positive delta. The pullback held above the stacked imbalance zone."),
];

export function FootprintExplorer() {
  const [showImb, setShowImb] = useState(true);
  const [showPoc, setShowPoc] = useState(true);
  const [sel, setSel] = useState<{ c: number; p: number } | null>(null);
  const [focus, setFocus] = useState(1);
  const all = FP.flatMap((c) => c.rows.map((r) => r.p));
  const top = Math.max(...all);
  const bottom = Math.min(...all);
  const levels = Array.from({ length: Math.round((top - bottom) / 0.5) + 1 }, (_, k) => top - k * 0.5);

  const info = (ci: number, p: number) => {
    const c = FP[ci];
    const row = c.rows.find((r) => r.p === p);
    if (!row) return null;
    const below = c.rows.find((r) => r.p === p - 0.5);
    const above = c.rows.find((r) => r.p === p + 0.5);
    const buyImb = below && row.ask >= below.bid * 3;
    const sellImb = above && row.bid >= above.ask * 3;
    return { row, buyImb, sellImb };
  };

  const selInfo = sel ? info(sel.c, sel.p) : null;
  return (
    <ToolShell kicker="EXPLORE" title="Open up a candle: the footprint" hint="Each cell = BID × ASK. Left number: lots sold aggressively (hit the bid). Right: lots bought aggressively (lifted the ask). Tap any cell.">
      <div className="mb-3 flex flex-wrap gap-2">
        <Btn active={showImb} onClick={() => setShowImb(!showImb)}>
          Imbalances (3:1 diagonal)
        </Btn>
        <Btn active={showPoc} onClick={() => setShowPoc(!showPoc)}>
          Candle POC
        </Btn>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-[560px] gap-2 rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="flex flex-col pt-[2px]">
            {levels.map((p) => (
              <div key={p} className="flex h-6 items-center pr-2 font-mono text-[10px] text-slate-500">
                {p.toFixed(1)}
              </div>
            ))}
          </div>
          {FP.map((c, ci) => {
            const poc = c.rows.reduce((m, r) => (r.bid + r.ask > m.bid + m.ask ? r : m), c.rows[0]);
            const bull = c.c >= c.o;
            const vol = c.rows.reduce((s, r) => s + r.bid + r.ask, 0);
            const delta = c.rows.reduce((s, r) => s + r.ask - r.bid, 0);
            return (
              <button key={ci} type="button" onClick={() => setFocus(ci)} className={cn("flex-1 rounded-xl p-1 text-left transition", focus === ci ? "bg-white/[0.05] ring-1 ring-gold/50" : "opacity-80 hover:opacity-100")}>
                {levels.map((p) => {
                  const row = c.rows.find((r) => r.p === p);
                  const inBody = p <= Math.max(c.o, c.c) && p >= Math.min(c.o, c.c);
                  if (!row) return <div key={p} className="h-6" />;
                  const inf = info(ci, p)!;
                  const isSel = sel?.c === ci && sel.p === p;
                  return (
                    <div
                      key={p}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSel({ c: ci, p });
                        setFocus(ci);
                      }}
                      className={cn(
                        "grid h-6 grid-cols-[4px_1fr_10px_1fr] items-center gap-1 rounded px-1 font-mono text-[11px]",
                        showPoc && row === poc && "outline outline-1 outline-gold",
                        isSel && "bg-white/15",
                      )}
                    >
                      <span className="h-full rounded-sm" style={{ background: inBody ? (bull ? BULL : BEAR) : "#ffffff22" }} />
                      <span className={cn("rounded px-1 text-right", showImb && inf.sellImb ? "bg-bear/40 font-black text-white" : "text-bear/90")}>{row.bid}</span>
                      <span className="text-center text-slate-600">×</span>
                      <span className={cn("rounded px-1", showImb && inf.buyImb ? "bg-bull/40 font-black text-white" : "text-bull/90")}>{row.ask}</span>
                    </div>
                  );
                })}
                <div className="mt-2 border-t border-white/10 pt-1 font-mono text-[10px] text-slate-400">
                  vol {vol}
                  <br />Δ <span className={delta >= 0 ? "text-bull" : "text-bear"}>{delta >= 0 ? "+" : ""}{delta}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-4">
          <div className="font-mono text-[11px] font-bold text-gold">CANDLE {FP[focus].title.toUpperCase()}</div>
          <p className="mt-1 text-[15px] text-slate-100">{FP[focus].story}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          {selInfo ? (
            <>
              <div className="font-mono text-xs font-bold text-white">@ {sel!.p.toFixed(1)}</div>
              <p className="mt-1">
                <b className="text-bear">{selInfo.row.bid}</b> lots sold aggressively (into bids) vs <b className="text-bull">{selInfo.row.ask}</b> bought aggressively (into asks).
                {selInfo.buyImb && " BUY IMBALANCE: this ask is ≥ 3× the bid one row below — buyers overwhelming."}
                {selInfo.sellImb && " SELL IMBALANCE: this bid is ≥ 3× the ask one row above — sellers overwhelming."}
                {!selInfo.buyImb && !selInfo.sellImb && " No imbalance — two-way business."}
              </p>
            </>
          ) : (
            "Tap a cell to decode it. Imbalances are compared diagonally because buyers lift the ask one tick above where sellers hit the bid."
          )}
        </div>
      </div>
    </ToolShell>
  );
}

/* ── Generic order-flow replay ─────────────────────────────────────────── */
export function FlowReplay({
  bars,
  steps,
  lines = [],
  zones = [],
  markers = [],
  marks = [],
  vwapOn = false,
  height = 300,
}: {
  bars: OFBar[];
  steps: Step[];
  lines?: HLine[];
  zones?: Zone[];
  markers?: Marker[];
  marks?: { at: number; idx: number[] }[];
  vwapOn?: boolean;
  height?: number;
}) {
  const p = usePlayer(steps);
  const dm = [...marks].reverse().find((m) => p.visible > m.at)?.idx ?? [];
  return (
    <div>
      <div className="rounded-2xl bg-black/30 p-2">
        <FlowChart bars={bars} visible={p.visible} height={height} lines={lines} zones={zones} markers={markers} showVWAP={vwapOn} deltaMarks={dm} highlight={dm} />
      </div>
      <PlayerControls p={p} steps={steps} />
    </div>
  );
}

export function DeltaLesson() {
  return (
    <ToolShell kicker="REPLAY" title="Price says up. Delta says… tired." hint="Top: candles. Bottom: delta bars (green = more aggressive buying that bar) and the blue cumulative-delta line.">
      <FlowReplay
        bars={S_DIV}
        lines={[{ price: DIV_HIGH, from: 8, color: GOLD, dashed: true, label: "prior high", labelSide: "left", showAt: 9 }]}
        marks={[{ at: 9, idx: [7, 8] }, { at: 15, idx: [12, 13, 14] }, { at: 17, idx: [15, 16] }]}
        steps={[
          { at: 9, title: "Strong push", text: "A rally with BIG green delta bars. Aggressive buyers are lifting offers — the push is real. The blue CVD line climbs with price." },
          { at: 15, title: "New high, weaker delta", text: "Price makes a higher high… but delta bars are much smaller and CVD makes a LOWER high. Fewer buyers are doing the work. That's a bearish divergence.", color: GOLD },
          { at: S_DIV.length, title: "Follow-through", text: "Sellers take over: big red delta, price drops. Divergence was the warning — the red delta + price breaking down was the confirmation.", color: BEAR },
        ]}
      />
    </ToolShell>
  );
}

export function AbsorptionLesson() {
  return (
    <ToolShell kicker="REPLAY" title="The wall that ate the sellers" hint="Watch delta at the support level. Huge red bars… and price refuses to fall.">
      <FlowReplay
        bars={S_ABS}
        lines={[{ price: ABS_LEVEL, color: BULL, dashed: true, label: "support / prior low", labelSide: "left" }]}
        marks={[{ at: 11, idx: [9, 10] }, { at: 12, idx: [11] }, { at: 14, idx: [12, 13] }]}
        markers={[
          { i: 9, price: S_ABS[9].l, label: "ABSORPTION", color: GOLD, pos: "below", showAt: 10 },
          { i: 11, price: S_ABS[11].l, label: "EXHAUSTION", color: VIOLET, pos: "below", showAt: 12 },
        ]}
        steps={[
          { at: 9, title: "Sell-off into support", text: "Price drops toward a known level. Delta is red: sellers are aggressive. Nothing special yet." },
          { at: 11, title: "Absorption", text: "Two bars with HUGE volume and big negative delta… but long lower wicks and closes off the lows. Sellers hit and hit — passive buyers soaked it all up.", color: GOLD },
          { at: 12, title: "Exhaustion", text: "Next bar: tiny delta, low volume. Sellers have run out of ammo.", color: VIOLET },
          { at: 14, title: "Flip", text: "Delta flips strongly green and price breaks above the absorption bars. That's the confirmation: buyers are now the aggressor.", color: BULL },
          { at: S_ABS.length, title: "Reversal", text: "Trapped shorts from the sell-off cover (buy back), adding fuel. Stop would sit below the absorption low.", color: BULL },
        ]}
      />
    </ToolShell>
  );
}

export function TrapsLesson() {
  return (
    <ToolShell kicker="REPLAY" title="Anatomy of a trap — seen through order flow" hint="Same stop hunt you learned in Price Action & ICT. Now watch the delta.">
      <FlowReplay
        bars={S_DIV}
        lines={[{ price: DIV_HIGH, from: 8, color: GOLD, dashed: true, label: "obvious high = buy stops", labelSide: "left" }]}
        marks={[{ at: 15, idx: [14] }, { at: 17, idx: [15, 16] }]}
        markers={[
          { i: 14, price: S_DIV[14].h, label: "STOPS + BREAKOUT BUYS", color: GOLD, showAt: 15 },
          { i: 16, price: S_DIV[16].l, label: "TRAPPED LONGS EXIT", color: BEAR, pos: "below", showAt: 17 },
        ]}
        steps={[
          { at: 14, title: "The obvious high", text: "Shorts have buy-stops above it. Breakout traders have buy-stop entries above it. All of those are MARKET buy orders waiting to fire." },
          { at: 15, title: "The run", text: "Price spikes above: stops trigger → a burst of market buying, high volume. But look — the candle closes back below the high and delta is weak for the volume. Someone big SOLD into those stops.", color: GOLD },
          { at: S_DIV.length, title: "Trapped", text: "Breakout buyers are underwater. Their stop-losses are market SELL orders → red delta → fuel for the drop. ICT calls it a BSL sweep; PA calls it a false breakout. Same event.", color: BEAR },
        ]}
      />
    </ToolShell>
  );
}

export function VwapLesson() {
  return (
    <ToolShell kicker="REPLAY · US30" title="VWAP: who's winning the session?" hint="Gold line = VWAP. Dashed violet = ±1 standard deviation bands.">
      <FlowReplay
        bars={S_VWAP}
        vwapOn
        marks={[{ at: 8, idx: [6, 7] }]}
        steps={[
          { at: 6, title: "Open below VWAP", text: "The NYSE opens and US30 sells off. Price trades BELOW VWAP: the average buyer today is losing. Sellers control the session so far." },
          { at: 8, title: "Reclaim + delta", text: "Price pushes back above VWAP with big green delta. Buyers are now willing to pay above the session's average price — acceptance higher.", color: BULL },
          { at: S_VWAP.length, title: "Trend above VWAP", text: "Pullbacks hold at/above VWAP. Many institutions benchmark fills to VWAP, so it often acts as dynamic support in an up-session (resistance in a down-session).", color: GOLD },
        ]}
      />
    </ToolShell>
  );
}

/* ── F8: volume profile tap-quiz ───────────────────────────────────────── */
export function ProfileQuiz() {
  const prof = useMemo(() => volumeProfile(S_PROF, 22), []);
  const maxV = Math.max(...prof.bins.map((b) => b.vol));
  const isLVN = (k: number) => prof.bins[k].vol < maxV * 0.3 && k > 2 && k < prof.bins.length - 3;
  const tasks = [
    { q: "Tap the POC (most volume).", ok: (k: number) => k === prof.poc, why: "The POC is the 'fairest' price — the most business was done there." },
    { q: "Tap a LOW-volume node between the two balance areas.", ok: isLVN, why: "LVNs are rejected prices. Price moved fast through them and tends to do it again." },
    { q: "Tap any bar inside the value area (blue).", ok: (k: number) => prof.bins[k].lo >= prof.val - 1e-9 && prof.bins[k].hi <= prof.vah + 1e-9, why: "~70% of volume traded inside the value area. Inside = balance, outside = imbalance/opportunity." },
  ];
  const [t, setT] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const { award } = useProgress();
  const done = t >= tasks.length;
  return (
    <ToolShell kicker="TAP QUIZ · +20 XP" title="Read the volume profile" hint="The sideways histogram on the right is volume at each PRICE. Gold = POC, blue = value area, grey = outside value.">
      <div className="rounded-2xl bg-black/30 p-2">
        <FlowChart
          bars={S_PROF}
          showProfile
          showDelta={false}
          showCVD={false}
          height={320}
          pickedBin={pick}
          onBinClick={(k) => {
            if (done) return;
            setPick(k);
            const good = tasks[t].ok(k);
            setOk(good);
            if (good) {
              setTimeout(() => {
                setT((x) => {
                  if (x + 1 >= tasks.length) award("of:profile", 20);
                  return x + 1;
                });
                setOk(null);
                setPick(null);
              }, 1200);
            }
          }}
        />
      </div>
      <div className={cn("mt-3 rounded-2xl border p-4", done ? "border-bull/50 bg-bull/10" : ok === false ? "border-bear/50 bg-bear/10" : ok ? "border-bull/50 bg-bull/10" : "border-gold/30 bg-gold/[0.05]")}>
        {done ? (
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-bull">Profile reader: unlocked. HVN = acceptance (slow), LVN = rejection (fast).</span>
            <Btn onClick={() => setT(0)}>
              <RotateCcw size={14} /> Again
            </Btn>
          </div>
        ) : (
          <>
            <div className="font-mono text-[11px] font-bold text-gold">
              TASK {t + 1}/{tasks.length}
            </div>
            <div className="text-lg font-bold text-white">{tasks[t].q}</div>
            {ok !== null && <p className={cn("mt-1 text-sm", ok ? "text-bull" : "text-bear")}>{ok ? `✓ ${tasks[t].why}` : "Not that one — look again at the bar lengths."}</p>}
          </>
        )}
      </div>
    </ToolShell>
  );
}

/* ── F11: data reality ─────────────────────────────────────────────────── */
const INSTR = [
  { k: "xau", n: "XAUUSD (spot / CFD)", type: "CFD", note: "Spot gold trades over-the-counter across many banks — there is no single exchange. Your broker's 'volume' is tick volume (number of price changes), a rough activity proxy only.", caps: ["tick", "no", "no", "proxy", "proxy"] },
  { k: "gc", n: "GC — COMEX gold futures", type: "Futures", note: "100 troy oz. $0.10 tick = $10. Centralised exchange volume: real DOM, tape, footprint, delta. The reference market for gold order flow.", caps: ["yes", "yes", "yes", "yes", "yes"] },
  { k: "mgc", n: "MGC — Micro gold futures", type: "Futures", note: "10 troy oz. $0.10 tick = $1. Same price as GC (thinner book). Many traders WATCH GC flow and trade MGC or the CFD.", caps: ["yes", "yes", "yes", "yes", "yes"] },
  { k: "us30", n: "US30 (CFD)", type: "CFD", note: "Your broker's synthetic Dow price. Tick volume only — real order flow lives in the futures.", caps: ["tick", "no", "no", "proxy", "proxy"] },
  { k: "ym", n: "YM — E-mini Dow futures (CBOT)", type: "Futures", note: "$5 per index point. Real exchange volume. Watch the 9:30 ET cash open.", caps: ["yes", "yes", "yes", "yes", "yes"] },
  { k: "mym", n: "MYM — Micro E-mini Dow", type: "Futures", note: "$0.50 per point. Same price as YM; great for small accounts.", caps: ["yes", "yes", "yes", "yes", "yes"] },
];
const CAPS = ["Real centralised volume", "DOM depth", "Footprint / delta", "Volume profile", "VWAP"];

export function DataPicker() {
  const [k, setK] = useState("xau");
  const [fut, setFut] = useState(4462.4);
  const [cfd, setCfd] = useState(4455.1);
  const [lvl, setLvl] = useState(4470);
  const it = INSTR.find((x) => x.k === k)!;
  const mark = (c: string) =>
    c === "yes" ? <span className="text-bull">✓ real</span> : c === "proxy" ? <span className="text-gold">~ tick-vol proxy</span> : c === "tick" ? <span className="text-gold">~ tick count only</span> : <span className="text-bear">✕ not available</span>;
  return (
    <ToolShell kicker="REALITY CHECK" title="Where real order flow lives for Gold & US30" hint="Order flow is only as good as its data. Tap an instrument.">
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {INSTR.map((x) => (
          <button key={x.k} type="button" onClick={() => setK(x.k)} className={cn("rounded-xl border p-3 text-left transition", k === x.k ? "border-gold/60 bg-gold/10" : "border-white/10 hover:border-white/25")}>
            <div className={cn("font-mono text-[10px] font-bold", x.type === "CFD" ? "text-gold" : "text-bull")}>{x.type}</div>
            <div className="text-sm font-bold text-white">{x.n}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[15px] text-slate-200">{it.note}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            {CAPS.map((c, i) => (
              <div key={c} className="flex justify-between border-b border-white/[0.05] pb-1">
                <span className="text-slate-400">{c}</span>
                <span className="font-mono text-xs font-bold">{mark(it.caps[i])}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-sky/25 bg-sky/[0.05] p-4">
          <div className="font-mono text-[11px] font-bold text-sky">MAP A FUTURES LEVEL ONTO YOUR CFD CHART</div>
          <p className="mt-1 text-xs text-slate-400">Futures and CFD prices differ by a small offset (basis). Subtract today&apos;s difference.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              [
                ["Futures now", fut, setFut],
                ["CFD now", cfd, setCfd],
                ["Futures level", lvl, setLvl],
              ] as const
            ).map(([l, v, set]) => (
              <label key={l} className="block">
                <span className="mb-1 block font-mono text-[10px] font-bold text-slate-500">{l.toUpperCase()}</span>
                <input type="number" step={0.1} value={v} onChange={(e) => set(parseFloat(e.target.value))} className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 font-mono text-sm text-white outline-none focus:border-sky/60" />
              </label>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-300">
            Offset: <b className="font-mono text-white">{fmt(fut - cfd, 1)}</b> → level on CFD ≈ <b className="font-mono text-xl text-sky">{fmt(lvl - (fut - cfd), 1)}</b>
          </div>
          <p className="mt-2 text-xs text-slate-500">The offset drifts (rollover, interest). Recalculate each session.</p>
        </div>
      </div>
    </ToolShell>
  );
}

/* ── F12: setups ───────────────────────────────────────────────────────── */
const SETUPS = [
  {
    id: "abs",
    name: "Absorption reversal",
    bars: S_ABS,
    lines: [{ price: ABS_LEVEL, color: BULL, dashed: true, label: "planned level", labelSide: "left" as const }],
    marks: [{ at: 11, idx: [9, 10] }, { at: 13, idx: [12] }],
    steps: [
      { at: 9, title: "Level first", text: "Mark the level BEFORE price gets there (prior low, PDL, VAL, ICT POI). Order flow is the trigger, not the reason." },
      { at: 11, title: "Absorption", text: "Big negative delta, big volume, price not progressing lower, wicks forming.", color: GOLD },
      { at: 13, title: "Trigger", text: "Delta flips green and price breaks the absorption bar's high. Enter. Stop below the absorption low.", color: BULL },
      { at: S_ABS.length, title: "Target", text: "Prior swing high / VWAP / opposing liquidity. Trapped sellers fuel the move.", color: BULL },
    ],
    rules: ["Pre-planned level", "Heavy aggression with no progress (absorption)", "Exhaustion: aggression fades", "Delta flip + price confirms", "Stop beyond absorption extreme"],
  },
  {
    id: "div",
    name: "Delta divergence at a sweep",
    bars: S_DIV,
    lines: [{ price: DIV_HIGH, from: 8, color: GOLD, dashed: true, label: "liquidity (prior high)", labelSide: "left" as const }],
    marks: [{ at: 15, idx: [14] }, { at: 16, idx: [15] }],
    steps: [
      { at: 14, title: "Liquidity above", text: "An obvious high with stops above it. ICT: BSL. PA: resistance." },
      { at: 15, title: "Sweep + divergence", text: "New high, but CVD makes a lower high and the bar closes back under the level. Buyers are spent.", color: GOLD },
      { at: 16, title: "Trigger", text: "First strong red delta bar closing back inside → short. Stop above the sweep wick.", color: BEAR },
      { at: S_DIV.length, title: "Target", text: "Opposite side of the range / sell-side liquidity.", color: BEAR },
    ],
    rules: ["Obvious liquidity (high/low)", "Sweep beyond it", "CVD divergence", "Close back inside + delta flips", "Stop beyond sweep"],
  },
  {
    id: "stack",
    name: "Stacked-imbalance pullback",
    bars: S_STACK,
    lines: [],
    zones: [{ from: 6, top: STACK_ZONE.top, bottom: STACK_ZONE.bottom, color: SKY, label: "STACKED IMBALANCES", extend: true }],
    marks: [{ at: 7, idx: [6] }, { at: 10, idx: [9] }, { at: 11, idx: [10] }],
    steps: [
      { at: 7, title: "Initiative breakout", text: "A breakout bar with big positive delta and stacked buy imbalances on the footprint. Mark that zone." },
      { at: 10, title: "Pullback into the zone", text: "Price returns to the imbalance zone on LOW volume and small negative delta — no real selling.", color: SKY },
      { at: 11, title: "Trigger", text: "Delta turns green from the zone → long. Stop below the zone. (ICT traders: this zone often overlaps an FVG.)", color: BULL },
      { at: S_STACK.length, title: "Continuation", text: "The initiative buyers defend their area.", color: BULL },
    ],
    rules: ["Breakout with stacked imbalances", "Pullback on weak opposing delta", "Holds the zone", "Delta re-accelerates", "Stop below zone"],
  },
  {
    id: "vwap",
    name: "VWAP reclaim (US30)",
    bars: S_VWAP,
    lines: [],
    vwap: true,
    marks: [{ at: 8, idx: [7] }],
    steps: [
      { at: 6, title: "Below VWAP", text: "Early sell-off after the cash open. Sellers in control." },
      { at: 8, title: "Reclaim", text: "Close back above VWAP with strong positive delta. Enter on the reclaim or first retest; stop below the reclaim bar.", color: BULL },
      { at: S_VWAP.length, title: "Ride", text: "Hold while price stays above VWAP; target the +1σ band / prior day high.", color: GOLD },
    ],
    rules: ["Key session (NY open)", "Reclaim close above VWAP", "Strong positive delta", "Retest holds", "Stop below reclaim bar"],
  },
];

export function SetupLab() {
  const [i, setI] = useState(0);
  const s = SETUPS[i];
  return (
    <ToolShell kicker="PLAYBOOK" title="Four order-flow setups" hint="Each one: context → order-flow evidence → trigger → stop → target.">
      <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {SETUPS.map((x, k) => (
          <Btn key={x.id} active={k === i} onClick={() => setI(k)} className="shrink-0">
            {x.name}
          </Btn>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <FlowReplay key={s.id} bars={s.bars} steps={s.steps} lines={s.lines} zones={s.zones} marks={s.marks} vwapOn={s.vwap} />
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold tracking-widest text-gold">CHECKLIST</div>
          <ol className="space-y-2">
            {s.rules.map((r, k) => (
              <li key={r} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gold font-mono text-xs font-bold text-ink">{k + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ToolShell>
  );
}

/* ── Boss ──────────────────────────────────────────────────────────────── */
type Choice = "long" | "short" | "skip";
const BOSS: { bars: OFBar[]; cut: number; ctx: string; answer: Choice; why: string; lines?: HLine[] }[] = [
  { bars: S_ABS, cut: 13, ctx: "Gold falls into yesterday's low. Read the last few bars' delta.", answer: "long", why: "Absorption (huge red delta, no progress) → exhaustion → delta flip with price breaking up. Long, stop under the absorption low.", lines: [{ price: ABS_LEVEL, color: BULL, dashed: true, label: "PDL", labelSide: "left" }] },
  { bars: S_DIV, cut: 16, ctx: "New high above an obvious high. Check the CVD line.", answer: "short", why: "Sweep of the high with CVD divergence, close back below, and red delta. Trapped breakout buyers → short.", lines: [{ price: DIV_HIGH, color: GOLD, dashed: true, label: "prior high", labelSide: "left" }] },
  { bars: S_CHOP, cut: 14, ctx: "Mid-range, mixed delta, no planned level nearby.", answer: "skip", why: "No level, no absorption, no initiative — just noise. Order flow without context = overtrading." },
  { bars: S_STACK, cut: 11, ctx: "Breakout left stacked buy imbalances. Price pulled back into them.", answer: "long", why: "Pullback on weak selling into the imbalance zone, then delta re-accelerates green. Long, stop below the zone." },
  { bars: mirrorFlow(S_ABS, 4455), cut: 13, ctx: "Gold rallies into a prior high. Big green delta keeps printing…", answer: "short", why: "Mirror image: buyers absorbed at the high (big green delta, no progress), exhaustion, then delta flips red. Short." },
];

export function OFBoss() {
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<Choice | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState(0);
  const { award, complete } = useProgress();
  const done = n >= BOSS.length;
  const s = BOSS[Math.min(n, BOSS.length - 1)];
  const choose = (c: Choice) => {
    if (pick) return;
    setPick(c);
    if (c === s.answer) {
      setScore((x) => x + 1);
      setBurst((b) => b + 1);
    }
  };
  const next = () => {
    const k = n + 1;
    setN(k);
    setPick(null);
    if (k >= BOSS.length) {
      complete("of-boss");
      award("check:of-boss", 50);
      if (score >= 4) award("of:boss", 40);
    }
  };
  return (
    <div data-reveal className="relative overflow-hidden rounded-3xl border border-gold/30 bg-panel/80 p-4 sm:p-6">
      {burst > 0 && <Burst key={burst} seed={burst} />}
      {done ? (
        <div className="py-10 text-center">
          <Trophy className="mx-auto text-gold" size={52} />
          <div className="mt-3 text-6xl font-black text-gold">
            {score}/{BOSS.length}
          </div>
          <p className="mt-2 text-slate-300">{score >= 4 ? "You read the flow. Now combine it with a level — see the Combined tab." : "Re-run F5–F7, then fight again."}</p>
          <Btn
            className="mt-4"
            active
            onClick={() => {
              setN(0);
              setScore(0);
            }}
          >
            <RotateCcw size={14} /> Fight again
          </Btn>
        </div>
      ) : (
        <motion.div key={n} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-2 flex items-center justify-between font-mono text-xs font-bold">
            <span className="rounded-full bg-gold px-2.5 py-1 text-ink">
              ROUND {n + 1}/{BOSS.length}
            </span>
            <span className="text-slate-400">
              SCORE <span className="text-gold">{score}</span>
            </span>
          </div>
          <p className="mb-3 text-lg font-semibold text-white">{s.ctx}</p>
          <div className="rounded-2xl bg-black/30 p-2">
            <FlowChart bars={s.bars} visible={pick ? s.bars.length : s.cut} height={260} lines={s.lines} rightPad={3} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              [
                ["long", "LONG ↑", BULL],
                ["skip", "SKIP", "#94a3b8"],
                ["short", "SHORT ↓", BEAR],
              ] as const
            ).map(([c, l, col]) => {
              const right = pick && c === s.answer;
              const wrong = pick === c && c !== s.answer;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => choose(c)}
                  className={cn("rounded-2xl border-2 py-3.5 text-lg font-black", pick && !right && !wrong && "opacity-30")}
                  style={{ borderColor: right ? BULL : wrong ? BEAR : `${col}55`, color: right ? BULL : wrong ? BEAR : col, background: right ? `${BULL}22` : wrong ? `${BEAR}18` : "transparent" }}
                >
                  {l}
                </button>
              );
            })}
          </div>
          {pick && (
            <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-[15px] text-slate-200">
                <b className={pick === s.answer ? "text-bull" : "text-bear"}>{pick === s.answer ? "Correct. " : `Answer: ${s.answer.toUpperCase()}. `}</b>
                {s.why}
              </p>
              <Btn active onClick={next}>
                {n === BOSS.length - 1 ? "Final score →" : "Next →"}
              </Btn>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

