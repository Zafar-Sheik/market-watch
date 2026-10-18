export type Candle = { o: number; h: number; l: number; c: number };

/** Small deterministic RNG so every chart renders identically on server + client. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build candles that follow a piecewise-linear path of closes.
 * waypoints: [candleIndex, closePrice] — the first must be index 0.
 */
export function fromPath(
  waypoints: [number, number][],
  opts: { seed?: number; noise?: number; wick?: number } = {},
): Candle[] {
  const { seed = 7, noise = 0.35, wick = 0.6 } = opts;
  const r = rng(seed);
  const last = waypoints[waypoints.length - 1][0];
  const closes: number[] = [];
  for (let i = 0; i <= last; i++) {
    let k = 0;
    while (k < waypoints.length - 1 && waypoints[k + 1][0] < i) k++;
    const [i0, p0] = waypoints[k];
    const [i1, p1] = waypoints[Math.min(k + 1, waypoints.length - 1)];
    const t = i1 === i0 ? 0 : (i - i0) / (i1 - i0);
    const base = p0 + (p1 - p0) * t;
    const step = Math.abs(p1 - p0) / Math.max(1, i1 - i0);
    const isAnchor = waypoints.some(([wi]) => wi === i);
    closes.push(isAnchor ? base : base + (r() - 0.5) * 2 * noise * Math.max(step, 1));
  }
  const avgStep =
    closes.slice(1).reduce((s, c, i) => s + Math.abs(c - closes[i]), 0) / Math.max(1, closes.length - 1);
  const out: Candle[] = [];
  for (let i = 0; i < closes.length; i++) {
    const o = i === 0 ? closes[0] - (closes[1] - closes[0]) * 0.6 : closes[i - 1];
    const c = closes[i];
    const top = Math.max(o, c);
    const bot = Math.min(o, c);
    out.push({
      o,
      c,
      h: top + r() * wick * avgStep,
      l: bot - r() * wick * avgStep,
    });
  }
  return out;
}

/** Override part of a candle (keeps h/l consistent with the body). */
export function patch(candles: Candle[], idx: number, p: Partial<Candle>): Candle[] {
  const next = candles.slice();
  const c = { ...next[idx], ...p };
  c.h = Math.max(c.h, c.o, c.c);
  c.l = Math.min(c.l, c.o, c.c);
  next[idx] = c;
  // keep continuity: next candle opens at this close
  if (p.c !== undefined && next[idx + 1]) {
    const n = { ...next[idx + 1], o: c.c };
    n.h = Math.max(n.h, n.o, n.c);
    n.l = Math.min(n.l, n.o, n.c);
    next[idx + 1] = n;
  }
  return next;
}

export const isBull = (c: Candle) => c.c >= c.o;

export type Pivot = { i: number; price: number; kind: "high" | "low" };

/** Fractal swing points: a high higher than `len` candles either side (and vice versa). */
export function pivots(candles: Candle[], len = 2): Pivot[] {
  const res: Pivot[] = [];
  for (let i = len; i < candles.length - len; i++) {
    let hi = true;
    let lo = true;
    for (let k = 1; k <= len; k++) {
      if (candles[i].h <= candles[i - k].h || candles[i].h < candles[i + k].h) hi = false;
      if (candles[i].l >= candles[i - k].l || candles[i].l > candles[i + k].l) lo = false;
    }
    if (hi) res.push({ i, price: candles[i].h, kind: "high" });
    if (lo) res.push({ i, price: candles[i].l, kind: "low" });
  }
  // enforce alternation high/low, keeping the more extreme of consecutive same-kind pivots
  const alt: Pivot[] = [];
  for (const p of res) {
    const prev = alt[alt.length - 1];
    if (prev && prev.kind === p.kind) {
      if ((p.kind === "high" && p.price > prev.price) || (p.kind === "low" && p.price < prev.price)) {
        alt[alt.length - 1] = p;
      }
    } else alt.push(p);
  }
  return alt;
}

export type StructureLabel = "HH" | "HL" | "LH" | "LL";

export function labelStructure(pv: Pivot[]): (Pivot & { label?: StructureLabel })[] {
  return pv.map((p, idx) => {
    const prevSame = [...pv.slice(0, idx)].reverse().find((q) => q.kind === p.kind);
    if (!prevSame) return p;
    if (p.kind === "high") return { ...p, label: p.price > prevSame.price ? "HH" : "LH" };
    return { ...p, label: p.price > prevSame.price ? "HL" : "LL" };
  });
}

export type Gap = { i: number; top: number; bottom: number; dir: "bull" | "bear" };

/** Three-candle fair value gaps. `i` is the middle (displacement) candle. */
export function fairValueGaps(candles: Candle[], minSize = 0): Gap[] {
  const gaps: Gap[] = [];
  for (let i = 1; i < candles.length - 1; i++) {
    const a = candles[i - 1];
    const b = candles[i + 1];
    if (b.l > a.h && b.l - a.h > minSize) gaps.push({ i, top: b.l, bottom: a.h, dir: "bull" });
    if (b.h < a.l && a.l - b.h > minSize) gaps.push({ i, top: a.l, bottom: b.h, dir: "bear" });
  }
  return gaps;
}

/**
 * Hand-craft candles quickly: each step is [close, extraHigh, extraLow] and
 * opens at the previous close (or [open, close, extraHigh, extraLow] to gap).
 */
export function chain(start: number, steps: ([number, number, number] | [number, number, number, number])[]): Candle[] {
  const out: Candle[] = [];
  let prev = start;
  for (const s of steps) {
    const [o, c, hx, lx] = s.length === 4 ? s : [prev, s[0], s[1], s[2]];
    out.push({ o, c, h: Math.max(o, c) + hx, l: Math.min(o, c) - lx });
    prev = c;
  }
  return out;
}
