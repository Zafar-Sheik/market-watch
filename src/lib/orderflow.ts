import { rng, type Candle } from "./candles";

/** A candle with the extra order-flow fields a footprint chart would show. */
export type OFBar = Candle & { vol: number; delta: number };

/**
 * Attach volume and delta to candles. Delta follows the candle body by default
 * (green bars = more aggressive buying); `over` lets a scenario force specific bars.
 */
export function withFlow(candles: Candle[], seed = 3, over: Record<number, Partial<{ vol: number; delta: number }>> = {}): OFBar[] {
  const r = rng(seed);
  const avgRange = candles.reduce((s, c) => s + (c.h - c.l), 0) / candles.length || 1;
  return candles.map((c, i) => {
    const range = c.h - c.l || avgRange * 0.2;
    const vol = Math.round(400 + (range / avgRange) * 700 + r() * 250);
    const bodyShare = (c.c - c.o) / range;
    const delta = Math.round(vol * (bodyShare * 0.35 + (r() - 0.5) * 0.12));
    return { ...c, vol, delta, ...over[i] };
  });
}

export function cumulative(bars: OFBar[]) {
  let s = 0;
  return bars.map((b) => (s += b.delta));
}

export type ProfileBin = { lo: number; hi: number; vol: number };

/** Volume profile: spread each bar's volume evenly across the price bins it traded through. */
export function volumeProfile(bars: OFBar[], bins = 24) {
  const lo = Math.min(...bars.map((b) => b.l));
  const hi = Math.max(...bars.map((b) => b.h));
  const size = (hi - lo) / bins;
  const out: ProfileBin[] = Array.from({ length: bins }, (_, k) => ({ lo: lo + k * size, hi: lo + (k + 1) * size, vol: 0 }));
  for (const b of bars) {
    const a = Math.max(0, Math.floor((b.l - lo) / size));
    const z = Math.min(bins - 1, Math.floor((b.h - lo) / size));
    // weight toward the body: price spends more time between open and close
    const bodyLo = Math.min(b.o, b.c);
    const bodyHi = Math.max(b.o, b.c);
    let wsum = 0;
    const ws: number[] = [];
    for (let k = a; k <= z; k++) {
      const mid = (out[k].lo + out[k].hi) / 2;
      const w = mid >= bodyLo && mid <= bodyHi ? 2 : 1;
      ws.push(w);
      wsum += w;
    }
    for (let k = a; k <= z; k++) out[k].vol += (b.vol * ws[k - a]) / wsum;
  }
  const poc = out.reduce((m, x, k) => (x.vol > out[m].vol ? k : m), 0);
  // value area: expand from POC until 70% of volume is inside
  const total = out.reduce((s, x) => s + x.vol, 0);
  let up = poc;
  let dn = poc;
  let inside = out[poc].vol;
  while (inside < total * 0.7 && (up < bins - 1 || dn > 0)) {
    const nu = up < bins - 1 ? out[up + 1].vol : -1;
    const nd = dn > 0 ? out[dn - 1].vol : -1;
    if (nu >= nd) inside += out[++up].vol;
    else inside += out[--dn].vol;
  }
  return { bins: out, poc, vah: out[up].hi, val: out[dn].lo, pocPrice: (out[poc].lo + out[poc].hi) / 2, size };
}

/** Session VWAP with ±1σ bands (volume-weighted). */
export function vwap(bars: OFBar[]) {
  let pv = 0;
  let v = 0;
  let pv2 = 0;
  return bars.map((b) => {
    const tp = (b.h + b.l + b.c) / 3;
    pv += tp * b.vol;
    v += b.vol;
    pv2 += tp * tp * b.vol;
    const mean = pv / v;
    const sd = Math.sqrt(Math.max(0, pv2 / v - mean * mean));
    return { vwap: mean, up: mean + sd, dn: mean - sd };
  });
}
