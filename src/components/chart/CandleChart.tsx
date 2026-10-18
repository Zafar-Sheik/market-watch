"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";
import type { Candle } from "@/lib/candles";
import { useMeasure } from "@/lib/useMeasure";
import { cn } from "@/lib/utils";

export const BULL = "#2ee6a6";
export const BEAR = "#ff4d6d";
export const GOLD = "#f5c451";
export const SKY = "#60a5fa";
export const VIOLET = "#a78bfa";
export const MUTED = "#64748b";

export type Zone = {
  from: number;
  to?: number;
  top: number;
  bottom: number;
  color: string;
  label?: string;
  showAt?: number;
  /** extend the zone to the right edge */
  extend?: boolean;
  labelPos?: "top" | "bottom";
};
export type HLine = {
  price: number;
  from?: number;
  to?: number;
  color: string;
  label?: string;
  dashed?: boolean;
  showAt?: number;
  labelSide?: "left" | "right";
};
export type Marker = {
  i: number;
  price: number;
  label: string;
  color?: string;
  pos?: "above" | "below";
  showAt?: number;
  pill?: boolean;
};
export type Segment = {
  a: [number, number];
  b: [number, number];
  color: string;
  dashed?: boolean;
  showAt?: number;
  width?: number;
};
export type Dot = { i: number; price: number; color: string; r?: number; showAt?: number; pulse?: boolean };

export type CandleChartProps = {
  candles: Candle[];
  height?: number;
  /** how many candles are drawn (for playback). Defaults to all. */
  visible?: number;
  zones?: Zone[];
  lines?: HLine[];
  markers?: Marker[];
  segments?: Segment[];
  dots?: Dot[];
  highlight?: number[];
  dimOthers?: boolean;
  onCandleClick?: (i: number) => void;
  selected?: number | null;
  decimals?: number;
  className?: string;
  axis?: boolean;
  /** reserve empty candle slots on the right (room for projections) */
  rightPad?: number;
  colorFor?: (i: number, c: Candle) => string | undefined;
  children?: (api: ChartApi) => React.ReactNode;
};

export type ChartApi = {
  x: (i: number) => number;
  y: (p: number) => number;
  inv: (py: number) => number;
  slot: number;
  width: number;
  height: number;
  plotRight: number;
};

const AXIS_W = 58;
const PAD_T = 18;
const PAD_B = 18;

export function CandleChart({
  candles,
  height = 320,
  visible,
  zones = [],
  lines = [],
  markers = [],
  segments = [],
  dots = [],
  highlight = [],
  dimOthers = false,
  onCandleClick,
  selected = null,
  decimals = 2,
  className,
  axis = true,
  rightPad = 2,
  colorFor,
  children,
}: CandleChartProps) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const shown = visible ?? candles.length;

  const { min, max } = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const c of candles) {
      mn = Math.min(mn, c.l);
      mx = Math.max(mx, c.h);
    }
    for (const z of zones) {
      mn = Math.min(mn, z.bottom);
      mx = Math.max(mx, z.top);
    }
    for (const l of lines) {
      mn = Math.min(mn, l.price);
      mx = Math.max(mx, l.price);
    }
    const pad = (mx - mn) * 0.08;
    return { min: mn - pad, max: mx + pad };
  }, [candles, zones, lines]);

  const plotRight = Math.max(0, width - (axis ? AXIS_W : 6));
  const slot = plotRight / (candles.length + rightPad);
  const x = (i: number) => slot * i + slot / 2;
  const y = (p: number) => PAD_T + ((max - p) / (max - min)) * (height - PAD_T - PAD_B);
  const inv = (py: number) => max - ((py - PAD_T) / (height - PAD_T - PAD_B)) * (max - min);
  const bodyW = Math.max(2, Math.min(18, slot * 0.62));

  const ticks = useMemo(() => {
    const n = 5;
    const step = (max - min) / n;
    return Array.from({ length: n + 1 }, (_, k) => min + step * k);
  }, [min, max]);

  const hl = new Set(highlight);
  const on = (showAt?: number) => showAt === undefined || shown > showAt;

  return (
    <div ref={ref} className={cn("relative w-full select-none", className)} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} className="absolute inset-0 overflow-visible">
          {/* grid */}
          {ticks.map((t, k) => (
            <g key={k}>
              <line x1={0} x2={plotRight} y1={y(t)} y2={y(t)} stroke="rgba(148,163,184,0.08)" />
              {axis && (
                <text
                  x={plotRight + 8}
                  y={y(t) + 4}
                  className="fill-slate-500 font-mono"
                  fontSize={10}
                >
                  {t.toFixed(decimals > 1 ? 1 : decimals)}
                </text>
              )}
            </g>
          ))}

          {/* zones */}
          <AnimatePresence>
            {zones.filter((z) => on(z.showAt)).map((z, k) => {
              const x1 = x(z.from) - slot / 2;
              const x2 = z.extend ? plotRight : x(z.to ?? candles.length - 1) + slot / 2;
              return (
                <motion.g
                  key={`z${k}-${z.label}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <rect
                    x={x1}
                    y={y(z.top)}
                    width={Math.max(0, x2 - x1)}
                    height={Math.max(1, y(z.bottom) - y(z.top))}
                    fill={z.color}
                    fillOpacity={0.16}
                    stroke={z.color}
                    strokeOpacity={0.5}
                    strokeDasharray="3 3"
                    rx={3}
                  />
                  {z.label && (
                    <text
                      x={x2 - 6}
                      y={z.labelPos === "bottom" ? y(z.bottom) - 5 : y(z.top) + 13}
                      textAnchor="end"
                      fontSize={10.5}
                      fontWeight={700}
                      fill={z.color}
                      className="font-mono"
                    >
                      {z.label}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* horizontal lines */}
          {lines.filter((l) => on(l.showAt)).map((l, k) => {
            const x1 = l.from !== undefined ? x(l.from) : 0;
            const x2 = l.to !== undefined ? x(l.to) : plotRight;
            const left = l.labelSide === "left";
            return (
              <motion.g key={`l${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line
                  x1={x1}
                  x2={x2}
                  y1={y(l.price)}
                  y2={y(l.price)}
                  stroke={l.color}
                  strokeWidth={1.4}
                  strokeDasharray={l.dashed ? "5 4" : undefined}
                />
                {l.label && (
                  <text
                    x={left ? x1 + 4 : x2 - 4}
                    y={y(l.price) - 5}
                    textAnchor={left ? "start" : "end"}
                    fontSize={10.5}
                    fontWeight={700}
                    fill={l.color}
                    className="font-mono"
                  >
                    {l.label}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* candles */}
          {candles.slice(0, shown).map((c, i) => {
            const bull = c.c >= c.o;
            const color = colorFor?.(i, c) ?? (bull ? BULL : BEAR);
            const top = y(Math.max(c.o, c.c));
            const bot = y(Math.min(c.o, c.c));
            const faded = dimOthers && hl.size > 0 && !hl.has(i);
            const isSel = selected === i;
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: faded ? 0.22 : 1, scaleY: 1 }}
                transition={{ duration: 0.25 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                onClick={onCandleClick ? () => onCandleClick(i) : undefined}
                className={onCandleClick ? "cursor-pointer" : undefined}
              >
                {onCandleClick && (
                  <rect x={x(i) - slot / 2} y={0} width={slot} height={height} fill="transparent" />
                )}
                {(hl.has(i) || isSel) && (
                  <rect
                    x={x(i) - slot / 2 + 1}
                    y={y(c.h) - 6}
                    width={slot - 2}
                    height={y(c.l) - y(c.h) + 12}
                    rx={4}
                    fill={isSel ? "rgba(245,196,81,0.18)" : "rgba(255,255,255,0.07)"}
                    stroke={isSel ? GOLD : "rgba(255,255,255,0.25)"}
                    strokeDasharray={isSel ? undefined : "2 3"}
                  />
                )}
                <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1.3} />
                <rect
                  x={x(i) - bodyW / 2}
                  y={top}
                  width={bodyW}
                  height={Math.max(1.2, bot - top)}
                  fill={bull ? color : color}
                  fillOpacity={bull ? 0.9 : 0.9}
                  rx={1.5}
                />
              </motion.g>
            );
          })}

          {/* segments */}
          {segments.filter((s) => on(s.showAt)).map((s, k) => (
            <motion.line
              key={`s${k}`}
              x1={x(s.a[0])}
              y1={y(s.a[1])}
              x2={x(s.b[0])}
              y2={y(s.b[1])}
              stroke={s.color}
              strokeWidth={s.width ?? 1.6}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {/* dots */}
          {dots.filter((d) => on(d.showAt)).map((d, k) => (
            <g key={`d${k}`}>
              {d.pulse && (
                <circle cx={x(d.i)} cy={y(d.price)} r={(d.r ?? 4) + 4} fill={d.color} opacity={0.3}>
                  <animate attributeName="r" values={`${d.r ?? 4};${(d.r ?? 4) + 9}`} dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x(d.i)} cy={y(d.price)} r={d.r ?? 4} fill={d.color} />
            </g>
          ))}

          {/* markers */}
          {markers.filter((m) => on(m.showAt)).map((m, k) => {
            const above = (m.pos ?? "above") === "above";
            const py = y(m.price) + (above ? -10 : 18);
            const color = m.color ?? "#e2e8f0";
            const w = m.label.length * 6.6 + 10;
            return (
              <motion.g
                key={`m${k}-${m.label}`}
                initial={{ opacity: 0, y: above ? 6 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {m.pill !== false && (
                  <rect
                    x={x(m.i) - w / 2}
                    y={py - 11}
                    width={w}
                    height={15}
                    rx={7.5}
                    fill="#0b0f17"
                    stroke={color}
                    strokeOpacity={0.6}
                  />
                )}
                <text
                  x={x(m.i)}
                  y={py}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={800}
                  fill={color}
                  className="font-mono"
                >
                  {m.label}
                </text>
              </motion.g>
            );
          })}

          {children?.({ x, y, inv, slot, width, height, plotRight })}
        </svg>
      )}
    </div>
  );
}
