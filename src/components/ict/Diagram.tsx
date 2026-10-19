"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import type { Diagram as D } from "@/lib/ict/sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Recreates the course's "visual map" diagrams, animated when they scroll into view. */
export function Diagram({ d }: { d: D }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      const st = { trigger: ref.current, start: "top 85%", once: true };
      gsap.from("[data-step]", { y: 16, opacity: 0, stagger: 0.09, duration: 0.5, ease: "power2.out", scrollTrigger: st });
      const path = ref.current?.querySelector<SVGPolylineElement>("[data-draw]");
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", scrollTrigger: st });
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
      {d.kind === "flow" && <Flow d={d} />}
      {d.kind === "path" && <PathD d={d} />}
      {d.kind === "ladder" && <Ladder d={d} />}
      {d.kind === "tf" && (
        <div className="space-y-2">
          {d.rows.map((r, i) => (
            <div key={r.t} data-step className="flex items-center gap-3" style={{ paddingLeft: `${i * 6}%` }}>
              <div className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: r.c }} />
              <div className="flex-1 rounded-xl border px-3 py-2" style={{ borderColor: `${r.c}44`, background: `${r.c}10` }}>
                <div className="font-mono text-xs font-bold" style={{ color: r.c }}>
                  {r.t}
                </div>
                <div className="text-sm text-slate-300">{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {d.kind === "hub" && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1.2fr_1fr] sm:grid-rows-2">
          {d.spokes.slice(0, 2).map((s) => (
            <Spoke key={s} t={s} />
          ))}
          <div data-step className="col-span-2 row-span-2 flex flex-col items-center justify-center rounded-2xl border border-gold/50 bg-gold/10 p-4 text-center sm:order-none sm:col-span-1 sm:col-start-2 sm:row-start-1">
            <div className="text-lg font-black text-gold">{d.center}</div>
            <div className="mt-1 text-xs text-slate-300">{d.note}</div>
          </div>
          {d.spokes.slice(2).map((s) => (
            <Spoke key={s} t={s} />
          ))}
        </div>
      )}
      {d.kind === "myths" && (
        <div className="space-y-1.5">
          {d.items.map((m) => (
            <div key={m} data-step className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="text-sm text-slate-200">{m}</span>
              <span className="flex items-center gap-1 rounded-md bg-bear/15 px-2 py-0.5 font-mono text-xs font-black text-bear">
                <X size={12} /> FALSE
              </span>
            </div>
          ))}
        </div>
      )}
      {d.kind === "grid" && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {d.items.map((t) => {
            const [head, rest] = t.split(" · ");
            return (
              <div key={t} data-step className="rounded-xl border border-gold/25 bg-gold/[0.05] p-3">
                <div className="text-xs font-black text-gold">{head}</div>
                {rest && <div className="mt-1 text-xs leading-relaxed text-slate-300">{rest}</div>}
              </div>
            );
          })}
        </div>
      )}
      {d.kind === "smt" && <SmtMini />}
    </div>
  );
}

function Spoke({ t }: { t: string }) {
  const [a, b] = t.split(" · ");
  return (
    <div data-step className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="text-sm font-bold text-white">{a}</div>
      {b && <div className="text-xs text-slate-400">{b}</div>}
    </div>
  );
}

function Flow({ d }: { d: Extract<D, { kind: "flow" }> }) {
  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-1.5">
        {d.steps.map((s, i) => (
          <div key={s.t} className="flex items-center gap-1.5">
            <div data-step className="min-w-[88px] rounded-xl border px-3 py-2.5" style={{ borderColor: `${s.c}55`, background: `${s.c}12` }}>
              <div className="font-mono text-[11px] font-black leading-tight" style={{ color: s.c }}>
                {s.t}
              </div>
              {s.sub && <div className="mt-0.5 text-[11px] leading-tight text-slate-400">{s.sub}</div>}
            </div>
            {i < d.steps.length - 1 && <ChevronRight size={14} className="shrink-0 text-gold" />}
          </div>
        ))}
      </div>
      {d.note && (
        <div data-step className="mt-3 rounded-xl border border-gold/30 bg-gold/[0.05] p-3">
          {d.note.map((n) => (
            <p key={n} className="text-sm text-slate-200">
              {n}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

const W = 600;
const H = 240;
const sx = (x: number) => 20 + (x / 100) * (W - 40);
const sy = (y: number) => 14 + (y / 100) * (H - 28);

function PathD({ d }: { d: Extract<D, { kind: "path" }> }) {
  return (
    <div>
      {d.phases && (
        <div className="mb-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${d.phases.length}, minmax(0,1fr))` }}>
          {d.phases.map((p, i) => (
            <div key={p} data-step className="rounded-lg border border-white/10 bg-white/[0.03] px-1.5 py-1.5 text-center font-mono text-[10px] font-bold leading-tight text-slate-300 sm:text-[11px]">
              <span className="text-gold">{i + 1}</span> {p}
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {d.levels.map((l) => (
          <g key={l.t}>
            <line x1={sx(l.x1 ?? 0)} x2={sx(l.x2 ?? 100)} y1={sy(l.y)} y2={sy(l.y)} stroke={l.c} strokeWidth={1.4} strokeDasharray="6 4" />
            <text x={sx(l.x1 ?? 0) + 4} y={sy(l.y) - 5} fontSize={12} fontWeight={700} fill={l.c}>
              {l.t}
            </text>
          </g>
        ))}
        <polyline data-draw fill="none" stroke="#e2e8f0" strokeWidth={2.6} strokeLinejoin="round" points={d.pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")} />
        {d.tags?.map((t) => (
          <text key={t.t} x={sx(t.x)} y={sy(t.y)} textAnchor="middle" fontSize={12} fontWeight={800} fill={t.c}>
            {t.t}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Ladder({ d }: { d: Extract<D, { kind: "ladder" }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
        {d.bands?.map((b) => (
          <g key={b.t}>
            <rect x={20} y={sy(b.y1)} width={W - 40} height={sy(b.y2) - sy(b.y1)} fill={b.c} opacity={0.12} rx={4} />
            <text x={34} y={(sy(b.y1) + sy(b.y2)) / 2 + 5} fontSize={14} fontWeight={900} fill={b.c} opacity={0.9}>
              {b.t}
            </text>
          </g>
        ))}
        {d.levels.map((l) => (
          <g key={l.t}>
            <line x1={220} x2={W - 20} y1={sy(l.y)} y2={sy(l.y)} stroke={l.c} strokeWidth={1.6} />
            <text x={W - 24} y={sy(l.y) - 5} textAnchor="end" fontSize={12} fontWeight={700} fill={l.c}>
              {l.t}
            </text>
          </g>
        ))}
        {d.arrow && (
          <g>
            <defs>
              <marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f5c451" />
              </marker>
            </defs>
            <line x1={170} x2={170} y1={sy(d.arrow[0])} y2={sy(d.arrow[1])} stroke="#f5c451" strokeWidth={3} markerEnd="url(#ah)" />
          </g>
        )}
      </svg>
      {d.side && (
        <div className="flex flex-col justify-center gap-2">
          {d.side.map((s) => (
            <div key={s.t} data-step className="rounded-xl border p-3 text-sm font-semibold" style={{ borderColor: `${s.c}44`, color: s.c, background: `${s.c}0d` }}>
              {s.t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmtMini() {
  const gold = [[0, 30], [15, 55], [30, 40], [45, 70], [60, 55], [75, 88], [100, 40]];
  const silver = [[0, 30], [15, 55], [30, 40], [45, 72], [60, 56], [75, 64], [100, 34]];
  const draw = (pts: number[][], off: number) => pts.map(([x, y]) => `${sx(x)},${off + (y / 100) * 90}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} 240`} className="w-full">
      <text x={20} y={16} fontSize={12} fontWeight={900} fill="#f5c451">
        GOLD
      </text>
      <polyline data-draw fill="none" stroke="#f5c451" strokeWidth={2.4} points={draw(gold, 10)} />
      <line x1={sx(40)} x2={sx(85)} y1={10 + 0.7 * 90} y2={10 + 0.7 * 90} stroke="#ff4d6d" strokeDasharray="5 4" />
      <text x={sx(76)} y={10 + 0.88 * 90 + 16} fontSize={11} fontWeight={800} fill="#f5c451">
        Gold makes lower low
      </text>
      <text x={20} y={136} fontSize={12} fontWeight={900} fill="#a78bfa">
        SILVER
      </text>
      <polyline fill="none" stroke="#a78bfa" strokeWidth={2.4} points={draw(silver, 130)} />
      <line x1={sx(40)} x2={sx(85)} y1={130 + 0.72 * 90} y2={130 + 0.72 * 90} stroke="#ff4d6d" strokeDasharray="5 4" />
      <text x={sx(76)} y={130 + 0.64 * 90 - 8} fontSize={11} fontWeight={800} fill="#a78bfa">
        Silver does not confirm
      </text>
    </svg>
  );
}
