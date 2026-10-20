"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, Pause, Play, RotateCcw, Snowflake, Wand2 } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { BEAR, BULL, GOLD } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { rng } from "@/lib/candles";
import { cn } from "@/lib/utils";

/* Prices are integer ticks; 1 tick = $0.10 on gold. */
const TICK = 0.1;
const BASE = 44500; // 4,450.0
const px = (t: number) => (t * TICK).toFixed(1);

type Print = { id: number; t: number; size: number; side: "buy" | "sell"; you?: boolean };
type Book = {
  bids: Record<number, number>;
  asks: Record<number, number>;
  last: number;
  prints: Print[];
  msg: string;
  wall: number | null;
  ice: { t: number; hidden: number } | null;
  n: number;
  vol: { buy: number; sell: number };
};

type Action =
  | { type: "market"; side: "buy" | "sell"; size: number; you?: boolean }
  | { type: "limit"; side: "bid" | "ask"; t: number; size: number }
  | { type: "wall" }
  | { type: "pull" }
  | { type: "ice" }
  | { type: "noise"; seed: number }
  | { type: "reset" };

function initBook(): Book {
  const r = rng(7);
  const bids: Record<number, number> = {};
  const asks: Record<number, number> = {};
  for (let k = 1; k <= 14; k++) {
    asks[BASE + k] = Math.round(4 + r() * 22);
    bids[BASE - k + 1] = Math.round(4 + r() * 22);
  }
  return { bids, asks, last: BASE, prints: [], msg: "Pick an order type. Watch what happens to the ladder.", wall: null, ice: null, n: 0, vol: { buy: 0, sell: 0 } };
}

const bestAsk = (b: Book) => Math.min(...Object.keys(b.asks).map(Number).filter((t) => b.asks[t] > 0));
const bestBid = (b: Book) => Math.max(...Object.keys(b.bids).map(Number).filter((t) => b.bids[t] > 0));

function reducer(s: Book, a: Action): Book {
  if (a.type === "reset") return initBook();
  if (a.type === "market") {
    const book = { ...s, bids: { ...s.bids }, asks: { ...s.asks }, prints: [...s.prints], ice: s.ice ? { ...s.ice } : null };
    let left = a.size;
    const start = book.last;
    let levels = 0;
    let absorbed = 0;
    while (left > 0) {
      const side = a.side === "buy" ? book.asks : book.bids;
      const t = a.side === "buy" ? bestAsk(book) : bestBid(book);
      if (!Number.isFinite(t)) break;
      const take = Math.min(left, side[t]);
      side[t] -= take;
      left -= take;
      book.prints.unshift({ id: ++book.n, t, size: take, side: a.side, you: a.you });
      book.last = t;
      // iceberg: the visible ask refills from hidden size
      if (a.side === "buy" && book.ice && book.ice.t === t && side[t] === 0 && book.ice.hidden > 0) {
        const refill = Math.min(10, book.ice.hidden);
        book.ice.hidden -= refill;
        side[t] = refill;
        absorbed += take;
        continue;
      }
      if (side[t] === 0) {
        delete side[t];
        levels++;
      }
    }
    book.prints = book.prints.slice(0, 40);
    book.vol = { buy: s.vol.buy + (a.side === "buy" ? a.size : 0), sell: s.vol.sell + (a.side === "sell" ? a.size : 0) };
    if (a.you) {
      const moved = Math.round(book.last - start);
      book.msg =
        absorbed > 0
          ? `🧊 Your ${a.size}-lot buy kept getting filled at ${px(book.last)} — the ask keeps refilling. That's an ICEBERG absorbing you. Price went nowhere.`
          : moved === 0
            ? `Your ${a.size}-lot ${a.side} filled at ${px(book.last)} without using up the level. Price didn't move — there was enough liquidity.`
            : `Your ${a.size}-lot market ${a.side} ate ${levels} price level${levels === 1 ? "" : "s"} of ${a.side === "buy" ? "sell" : "buy"} orders. Price moved ${moved > 0 ? "+" : ""}${(moved * TICK).toFixed(1)}. THAT is how price moves.`;
    }
    return book;
  }
  if (a.type === "limit") {
    const book = { ...s, bids: { ...s.bids }, asks: { ...s.asks } };
    if (a.side === "bid") book.bids[a.t] = (book.bids[a.t] ?? 0) + a.size;
    else book.asks[a.t] = (book.asks[a.t] ?? 0) + a.size;
    book.msg = `You added a ${a.size}-lot limit ${a.side === "bid" ? "BUY" : "SELL"} at ${px(a.t)}. It rests in the book (passive) and waits for a market order to hit it. Price did NOT move.`;
    return book;
  }
  if (a.type === "wall") {
    const t = bestBid(s) - 4;
    return { ...s, bids: { ...s.bids, [t]: (s.bids[t] ?? 0) + 300 }, wall: t, msg: `A 300-lot bid WALL appeared at ${px(t)}. Looks like a floor, right? Now try pulling it…` };
  }
  if (a.type === "pull") {
    if (s.wall === null) return s;
    const bids = { ...s.bids, [s.wall]: Math.max(0, (s.bids[s.wall] ?? 0) - 300) };
    return { ...s, bids, wall: null, msg: "Poof. The wall was cancelled before anyone traded with it. Displayed orders ≠ real intent. Trust what actually TRADES." };
  }
  if (a.type === "ice") {
    const t = bestAsk(s);
    return { ...s, asks: { ...s.asks, [t]: 10 }, ice: { t, hidden: 240 }, msg: `An iceberg seller is hiding at ${px(t)}: shows only 10 lots, but 240 more are hidden. Hit it with market buys.` };
  }
  if (a.type === "noise") {
    const r = rng(a.seed);
    const book = { ...s, bids: { ...s.bids }, asks: { ...s.asks } };
    // market makers replenish near the touch
    const ba = bestAsk(book);
    const bb = bestBid(book);
    for (let k = 0; k < 3; k++) {
      const da = Math.floor(r() * 6);
      book.asks[ba + da] = (book.asks[ba + da] ?? 0) + Math.round(2 + r() * 8);
      const db = Math.floor(r() * 6);
      book.bids[bb - db] = (book.bids[bb - db] ?? 0) + Math.round(2 + r() * 8);
    }
    // keep the spread at 1 tick after the market moves
    if (!book.asks[book.last + 1] && !Object.keys(book.asks).length) book.asks[book.last + 1] = 8;
    if (!Object.keys(book.bids).length) book.bids[book.last - 1] = 8;
    return reducer(book, { type: "market", side: r() > 0.5 ? "buy" : "sell", size: Math.round(1 + r() * 9) });
  }
  return s;
}

export function OrderBookSim({ features = [] as ("spoof" | "ice" | "live" | "limit")[], compact = false }) {
  const [book, dispatch] = useReducer(reducer, undefined, initBook);
  const [live, setLive] = useState(false);
  const seed = useRef(1);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => dispatch({ type: "noise", seed: seed.current++ }), 650);
    return () => clearInterval(id);
  }, [live]);

  const ba = bestAsk(book);
  const bb = bestBid(book);
  const center = Number.isFinite(ba) && Number.isFinite(bb) ? Math.round((ba + bb) / 2) : book.last;
  const rows = Array.from({ length: compact ? 12 : 16 }, (_, k) => center + (compact ? 6 : 8) - k);
  const maxSize = Math.max(30, ...rows.map((t) => Math.max(book.bids[t] ?? 0, book.asks[t] ?? 0)));
  const has = (f: string) => (features as string[]).includes(f);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div className="mb-2 grid grid-cols-[1fr_88px_1fr] px-1 font-mono text-[10px] font-bold text-slate-500">
          <span className="text-right text-bull">BIDS (buyers waiting)</span>
          <span className="text-center">PRICE</span>
          <span className="text-bear">ASKS (sellers waiting)</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {rows.map((t) => {
            const bid = book.bids[t] ?? 0;
            const ask = book.asks[t] ?? 0;
            const isLast = t === book.last;
            return (
              <div key={t} className={cn("grid grid-cols-[1fr_88px_1fr] items-center border-b border-white/[0.04] text-sm", isLast && "bg-gold/15")}>
                <button
                  type="button"
                  disabled={!has("limit") || t >= ba}
                  onClick={() => dispatch({ type: "limit", side: "bid", t, size: 20 })}
                  className="relative flex h-7 items-center justify-end px-2 font-mono text-xs enabled:hover:bg-bull/10"
                  title={has("limit") ? "Click: place a 20-lot limit BUY here" : undefined}
                >
                  <motion.span className="absolute inset-y-1 right-0 rounded-l bg-bull/25" animate={{ width: `${(bid / maxSize) * 100}%` }} transition={{ duration: 0.2 }} />
                  <span className={cn("relative", bid ? "text-bull" : "text-transparent", book.wall === t && "font-black text-white")}>{bid || "·"}</span>
                </button>
                <div className={cn("text-center font-mono text-xs", isLast ? "font-black text-gold" : "text-slate-400")}>
                  {px(t)}
                  {isLast && " ◀"}
                </div>
                <button
                  type="button"
                  disabled={!has("limit") || t <= bb}
                  onClick={() => dispatch({ type: "limit", side: "ask", t, size: 20 })}
                  className="relative flex h-7 items-center px-2 font-mono text-xs enabled:hover:bg-bear/10"
                  title={has("limit") ? "Click: place a 20-lot limit SELL here" : undefined}
                >
                  <motion.span className="absolute inset-y-1 left-0 rounded-r bg-bear/25" animate={{ width: `${(ask / maxSize) * 100}%` }} transition={{ duration: 0.2 }} />
                  <span className={cn("relative", ask ? "text-bear" : "text-transparent")}>
                    {ask || "·"}
                    {book.ice?.t === t && ask > 0 && " 🧊"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => dispatch({ type: "market", side: "buy", size: 10, you: true })} className="border-bull/40 text-bull">
            Market BUY 10
          </Btn>
          <Btn onClick={() => dispatch({ type: "market", side: "buy", size: 60, you: true })} className="border-bull/40 text-bull">
            Market BUY 60
          </Btn>
          <Btn onClick={() => dispatch({ type: "market", side: "sell", size: 10, you: true })} className="border-bear/40 text-bear">
            Market SELL 10
          </Btn>
          <Btn onClick={() => dispatch({ type: "market", side: "sell", size: 60, you: true })} className="border-bear/40 text-bear">
            Market SELL 60
          </Btn>
          {has("spoof") && (
            <>
              <Btn onClick={() => dispatch({ type: "wall" })}>
                <Wand2 size={14} /> Add bid wall
              </Btn>
              <Btn onClick={() => dispatch({ type: "pull" })} disabled={book.wall === null}>
                <Eye size={14} /> Pull wall
              </Btn>
            </>
          )}
          {has("ice") && (
            <Btn onClick={() => dispatch({ type: "ice" })}>
              <Snowflake size={14} /> Hide an iceberg
            </Btn>
          )}
          {has("live") && (
            <Btn active={live} onClick={() => setLive(!live)}>
              {live ? <Pause size={14} /> : <Play size={14} />} {live ? "Pause market" : "Make it live"}
            </Btn>
          )}
          <Btn onClick={() => dispatch({ type: "reset" })}>
            <RotateCcw size={14} /> Reset
          </Btn>
        </div>
        {has("limit") && <p className="mt-2 text-xs text-slate-500">Tip: click any empty bid/ask cell to rest your own 20-lot limit order there.</p>}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={book.msg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gold/30 bg-gold/[0.07] p-4 text-[15px] leading-relaxed text-slate-100">
            {book.msg}
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <Mini l="LAST" v={px(book.last)} c={GOLD} />
          <Mini l="SPREAD" v={Number.isFinite(ba) && Number.isFinite(bb) ? `${((ba - bb) * TICK).toFixed(1)}` : "—"} c="#e2e8f0" />
          <Mini l="DELTA" v={`${book.vol.buy - book.vol.sell >= 0 ? "+" : ""}${book.vol.buy - book.vol.sell}`} c={book.vol.buy >= book.vol.sell ? BULL : BEAR} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40">
          <div className="grid grid-cols-3 border-b border-white/10 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-500">
            <span>TIME & SALES</span>
            <span className="text-center">PRICE</span>
            <span className="text-right">SIZE</span>
          </div>
          <div className="h-56 overflow-hidden">
            <AnimatePresence initial={false}>
              {book.prints.slice(0, 12).map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: p.side === "buy" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("grid grid-cols-3 px-3 py-1 font-mono text-xs", p.side === "buy" ? "text-bull" : "text-bear", p.size >= 20 && "bg-white/[0.04] font-black")}
                >
                  <span>
                    {p.side === "buy" ? "▲ lifted ask" : "▼ hit bid"} {p.you && "(you)"}
                  </span>
                  <span className="text-center">{px(p.t)}</span>
                  <span className="text-right">{p.size}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!book.prints.length && <div className="p-4 text-xs text-slate-500">No trades yet. A trade only happens when a market order meets a limit order.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ l, v, c }: { l: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2">
      <div className="text-[10px] text-slate-500">{l}</div>
      <div className="text-base font-bold" style={{ color: c }}>
        {v}
      </div>
    </div>
  );
}
