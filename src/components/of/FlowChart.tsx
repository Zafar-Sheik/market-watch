"use client";

import { useMemo } from "react";
import { BEAR, BULL, CandleChart, GOLD, SKY, VIOLET, type CandleChartProps } from "@/components/chart/CandleChart";
import { cumulative, volumeProfile, vwap, type OFBar } from "@/lib/orderflow";
import { useMeasure } from "@/lib/useMeasure";

type Props = Omit<CandleChartProps, "candles" | "axis" | "rightPad"> & {
  bars: OFBar[];
  showDelta?: boolean;
  showCVD?: boolean;
  showVWAP?: boolean;
  showProfile?: boolean;
  /** highlight delta bars (index list) */
  deltaMarks?: number[];
  rightPad?: number;
  onBinClick?: (k: number) => void;
  pickedBin?: number | null;
};

/** Price candles on top, delta histogram + cumulative delta underneath, on one shared x-axis. */
export function FlowChart({
  bars,
  visible,
  height = 300,
  showDelta = true,
  showCVD = true,
  showVWAP = false,
  showProfile = false,
  deltaMarks = [],
  rightPad = 2,
  onBinClick,
  pickedBin,
  children,
  ...rest
}: Props) {
  const shown = visible ?? bars.length;
  const pad = showProfile ? Math.max(rightPad, 9) : rightPad;
  const vw = useMemo(() => vwap(bars), [bars]);
  const prof = useMemo(() => volumeProfile(bars.slice(0, shown), 22), [bars, shown]);

  return (
    <div>
      <CandleChart candles={bars} visible={shown} height={height} axis={false} rightPad={pad} {...rest}>
        {(api) => (
          <g>
            {showVWAP && shown > 1 && (
              <g>
                {(["up", "dn"] as const).map((k) => (
                  <polyline key={k} fill="none" stroke={VIOLET} strokeWidth={1} strokeDasharray="3 4" opacity={0.6} points={vw.slice(0, shown).map((v, i) => `${api.x(i)},${api.y(v[k])}`).join(" ")} />
                ))}
                <polyline fill="none" stroke={GOLD} strokeWidth={2.2} points={vw.slice(0, shown).map((v, i) => `${api.x(i)},${api.y(v.vwap)}`).join(" ")} />
                <text x={api.x(shown - 1) + 8} y={api.y(vw[shown - 1].vwap) + 4} fontSize={10.5} fontWeight={800} fill={GOLD} className="font-mono">
                  VWAP
                </text>
              </g>
            )}
            {showProfile && (
              <g>
                {(() => {
                  const maxV = Math.max(...prof.bins.map((b) => b.vol));
                  const x0 = api.plotRight - api.slot * 0.2;
                  const maxW = api.slot * 7.5;
                  return prof.bins.map((b, k) => {
                    const y1 = api.y(b.hi);
                    const y2 = api.y(b.lo);
                    const inVA = b.lo >= prof.val - 1e-9 && b.hi <= prof.vah + 1e-9;
                    const w = (b.vol / maxV) * maxW;
                    return (
                      <g key={k} onClick={onBinClick ? () => onBinClick(k) : undefined} className={onBinClick ? "cursor-pointer" : undefined}>
                        <rect x={x0 - maxW} y={y1} width={maxW} height={Math.max(1, y2 - y1)} fill="transparent" />
                        <rect
                          x={x0 - w}
                          y={y1 + 0.5}
                          width={w}
                          height={Math.max(1, y2 - y1 - 1)}
                          rx={1.5}
                          fill={k === prof.poc ? GOLD : inVA ? SKY : "#64748b"}
                          opacity={pickedBin === k ? 1 : k === prof.poc ? 0.9 : inVA ? 0.45 : 0.3}
                          stroke={pickedBin === k ? "#fff" : undefined}
                        />
                      </g>
                    );
                  });
                })()}
                <line x1={0} x2={api.plotRight} y1={api.y(prof.pocPrice)} y2={api.y(prof.pocPrice)} stroke={GOLD} strokeDasharray="5 4" opacity={0.8} />
                <text x={4} y={api.y(prof.pocPrice) - 4} fontSize={10} fontWeight={800} fill={GOLD} className="font-mono">
                  POC
                </text>
                {(
                  [
                    [prof.vah, "VAH"],
                    [prof.val, "VAL"],
                  ] as const
                ).map(([p, t]) => (
                  <g key={t}>
                    <line x1={0} x2={api.plotRight} y1={api.y(p)} y2={api.y(p)} stroke={SKY} strokeDasharray="2 4" opacity={0.7} />
                    <text x={4} y={api.y(p) - 4} fontSize={10} fontWeight={800} fill={SKY} className="font-mono">
                      {t}
                    </text>
                  </g>
                ))}
              </g>
            )}
            {children?.(api)}
          </g>
        )}
      </CandleChart>
      {(showDelta || showCVD) && <DeltaPanel bars={bars} shown={shown} pad={pad} showDelta={showDelta} showCVD={showCVD} marks={deltaMarks} />}
    </div>
  );
}

function DeltaPanel({ bars, shown, pad, showDelta, showCVD, marks }: { bars: OFBar[]; shown: number; pad: number; showDelta: boolean; showCVD: boolean; marks: number[] }) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const H = 96;
  const plotRight = Math.max(0, width - 6);
  const slot = plotRight / (bars.length + pad);
  const x = (i: number) => slot * i + slot / 2;
  const maxD = Math.max(...bars.map((b) => Math.abs(b.delta)), 1);
  const cvd = cumulative(bars);
  const cMin = Math.min(0, ...cvd);
  const cMax = Math.max(0, ...cvd);
  const yc = (v: number) => 8 + ((cMax - v) / (cMax - cMin || 1)) * (H - 16);
  const mid = H / 2;
  const bw = Math.max(2, Math.min(16, slot * 0.6));
  const m = new Set(marks);
  return (
    <div ref={ref} className="relative mt-1 h-24 w-full rounded-xl bg-black/20">
      <div className="pointer-events-none absolute left-2 top-1 flex gap-3 font-mono text-[10px] font-bold">
        {showDelta && <span className="text-slate-400">DELTA</span>}
        {showCVD && <span style={{ color: SKY }}>CUMULATIVE DELTA</span>}
      </div>
      {width > 0 && (
        <svg width={width} height={H} className="absolute inset-0">
          <line x1={0} x2={plotRight} y1={mid} y2={mid} stroke="#ffffff15" />
          {showDelta &&
            bars.slice(0, shown).map((b, i) => {
              const h = (Math.abs(b.delta) / maxD) * (mid - 6);
              return (
                <rect
                  key={i}
                  x={x(i) - bw / 2}
                  y={b.delta >= 0 ? mid - h : mid}
                  width={bw}
                  height={Math.max(1, h)}
                  rx={1.5}
                  fill={b.delta >= 0 ? BULL : BEAR}
                  opacity={m.size && !m.has(i) ? 0.35 : 0.85}
                  stroke={m.has(i) ? "#fff" : undefined}
                />
              );
            })}
          {showCVD && shown > 1 && <polyline fill="none" stroke={SKY} strokeWidth={2} points={cvd.slice(0, shown).map((v, i) => `${x(i)},${yc(v)}`).join(" ")} />}
        </svg>
      )}
    </div>
  );
}
