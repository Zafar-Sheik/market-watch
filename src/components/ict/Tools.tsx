"use client";

import { motion } from "motion/react";
import { Check, ClipboardCopy, Download, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BEAR, BULL, GOLD, SKY, VIOLET } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { Burst } from "@/components/ui/confetti";
import { BACKTEST_FIELDS, CHECKLIST, PLAYBOOK } from "@/lib/ict/extras";
import { useProgress } from "@/lib/progress";
import { useLocal } from "@/lib/useLocal";
import { cn, fmt } from "@/lib/utils";

export function ToolShell({ kicker, title, hint, children, className }: { kicker: string; title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div data-reveal className={cn("relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6", className)}>
      <div className="mb-1 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">{kicker}</div>
      <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
      {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function NumIn({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] font-bold text-slate-500">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-white outline-none focus:border-gold/60"
      />
    </label>
  );
}

/* ── Dealing range / premium-discount / OTE / CE ───────────────────────── */
export function DealingRange() {
  const [hi, setHi] = useState(4500);
  const [lo, setLo] = useState(4300);
  const [price, setPrice] = useState(4360);
  const [dir, setDir] = useState<"long" | "short">("long");
  const range = hi - lo;
  const eq = (hi + lo) / 2;
  const fib = (r: number) => (dir === "long" ? hi - r * range : lo + r * range);
  const pos = range > 0 ? (price - lo) / range : 0;
  const zone = price >= eq ? "PREMIUM" : "DISCOUNT";
  const good = (dir === "long" && zone === "DISCOUNT") || (dir === "short" && zone === "PREMIUM");
  const inOte = dir === "long" ? price <= fib(0.62) && price >= fib(0.79) : price >= fib(0.62) && price <= fib(0.79);
  const Y = (p: number) => 22 + ((hi - p) / (range || 1)) * 226;
  return (
    <ToolShell kicker="TOOL · SECTIONS 6 & 7" title="Dealing range, premium/discount & OTE" hint="Defaults are the course's $4,500 / $4,300 example. Drag price and flip direction.">
      <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <NumIn label="RANGE HIGH" value={hi} onChange={setHi} step={10} />
            <NumIn label="RANGE LOW" value={lo} onChange={setLo} step={10} />
          </div>
          <div className="flex gap-2">
            <Btn active={dir === "long"} onClick={() => setDir("long")}>
              Bullish narrative
            </Btn>
            <Btn active={dir === "short"} onClick={() => setDir("short")}>
              Bearish narrative
            </Btn>
          </div>
          <label className="block">
            <div className="mb-1 flex justify-between font-mono text-xs text-slate-400">
              <span>current price</span>
              <span className="text-gold">${fmt(price, 0)}</span>
            </div>
            <input type="range" min={lo} max={hi} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full" />
          </label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <Stat l="EQUILIBRIUM 50%" v={`$${fmt(eq, 0)}`} c={GOLD} />
            <Stat l="POSITION IN RANGE" v={`${Math.round(pos * 100)}%`} c="#e2e8f0" />
            <Stat l="OTE 62%" v={`$${fmt(fib(0.62), 1)}`} c={GOLD} />
            <Stat l="OTE 79%" v={`$${fmt(fib(0.79), 1)}`} c={GOLD} />
            <Stat l="70.5% REFERENCE" v={`$${fmt(fib(0.705), 1)}`} c={GOLD} />
            <Stat l="ZONE" v={zone} c={zone === "PREMIUM" ? BEAR : BULL} />
          </div>
          <div className={cn("rounded-xl border p-3 text-sm", good ? "border-bull/40 bg-bull/10 text-slate-100" : "border-bear/40 bg-bear/10 text-slate-200")}>
            {good
              ? `✓ ${dir === "long" ? "Discount" : "Premium"} — a favourable location for a ${dir === "long" ? "bullish" : "bearish"} idea${inOte ? ", and inside OTE" : ""}. Still need: liquidity raid → displacement → MSS → PD array.`
              : `✕ ${zone.toLowerCase()} is an unfavourable location for a ${dir === "long" ? "bullish" : "bearish"} idea. Don't force it — unless the model explicitly expects continuation to higher external liquidity.`}
          </div>
        </div>
        <svg viewBox="0 0 400 260" className="w-full rounded-2xl bg-black/30">
          <rect x={10} y={Y(hi)} width={380} height={Y(eq) - Y(hi)} fill={BEAR} opacity={0.1} />
          <rect x={10} y={Y(eq)} width={380} height={Y(lo) - Y(eq)} fill={BULL} opacity={0.1} />
          <rect x={10} y={Math.min(Y(fib(0.62)), Y(fib(0.79)))} width={380} height={Math.abs(Y(fib(0.62)) - Y(fib(0.79)))} fill={GOLD} opacity={0.18} />
          <text x={20} y={Y(hi) + 18} fontSize={13} fontWeight={900} fill={BEAR}>
            PREMIUM
          </text>
          <text x={20} y={Y(lo) - 8} fontSize={13} fontWeight={900} fill={BULL}>
            DISCOUNT
          </text>
          <text x={20} y={Math.min(Y(fib(0.62)), Y(fib(0.79))) + 14} fontSize={11} fontWeight={800} fill={GOLD}>
            OTE 62–79%
          </text>
          {[
            [hi, "High / ERL"],
            [eq, "50% EQ"],
            [lo, "Low / ERL"],
          ].map(([p, t]) => (
            <g key={t as string}>
              <line x1={10} x2={390} y1={Y(p as number)} y2={Y(p as number)} stroke={t === "50% EQ" ? GOLD : "#64748b"} strokeDasharray="5 4" />
              <text x={386} y={Y(p as number) - 4} textAnchor="end" fontSize={11} fill="#cbd5e1" className="font-mono">
                {t} ${fmt(p as number, 0)}
              </text>
            </g>
          ))}
          <motion.g animate={{ y: Y(price) }} initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <line x1={150} x2={330} y1={0} y2={0} stroke="#fff" strokeWidth={2} />
            <circle cx={330} cy={0} r={6} fill="#fff" />
            <text x={150} y={-6} fontSize={11} fontWeight={800} fill="#fff" className="font-mono">
              price ${fmt(price, 0)}
            </text>
          </motion.g>
        </svg>
      </div>
      <CECalc />
    </ToolShell>
  );
}

function Stat({ l, v, c }: { l: string; v: string; c: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <div className="text-[10px] text-slate-500">{l}</div>
      <div className="text-base font-bold" style={{ color: c }}>
        {v}
      </div>
    </div>
  );
}

function CECalc() {
  const [a, setA] = useState(4419);
  const [b, setB] = useState(4442);
  return (
    <div className="mt-5 grid items-end gap-3 rounded-2xl border border-sky/25 bg-sky/[0.05] p-4 sm:grid-cols-[1fr_1fr_1.3fr]">
      <NumIn label="FVG LOW (candle 1 high)" value={a} onChange={setA} />
      <NumIn label="FVG HIGH (candle 3 low)" value={b} onChange={setB} />
      <div>
        <div className="font-mono text-[11px] font-bold text-sky">CONSEQUENT ENCROACHMENT (50%)</div>
        <div className="text-2xl font-black text-white">${fmt((a + b) / 2, 2)}</div>
        <div className="text-xs text-slate-400">Gap size: ${fmt(Math.abs(b - a), 2)}</div>
      </div>
    </div>
  );
}

/* ── Silver Bullet / killzone clock ────────────────────────────────────── */
function tzOffsetMin(tz: string, d: Date) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const g = (t: string) => +(p.find((x) => x.type === t)?.value ?? 0);
  return Math.round((Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute")) - d.getTime()) / 60000);
}
function nyWallToDate(h: number, m: number, base: Date) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(base);
  const g = (t: string) => +(p.find((x) => x.type === t)?.value ?? 0);
  const off = tzOffsetMin("America/New_York", base);
  return new Date(Date.UTC(g("year"), g("month") - 1, g("day"), h, m) - off * 60000);
}
const fmtIn = (d: Date, tz?: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);

const WINDOWS = [
  { t: "London Silver Bullet", h: 3, kind: "SB", c: VIOLET },
  { t: "NY AM Silver Bullet", h: 10, kind: "SB", c: GOLD },
  { t: "NY PM Silver Bullet", h: 14, kind: "SB", c: SKY },
];
const KZ = [
  { t: "London killzone", from: 2, to: 5 },
  { t: "NY AM killzone", from: 7, to: 10 },
];

export function SilverBulletClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const localTz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "local";
  const rows = useMemo(() => {
    if (!now) return [];
    return WINDOWS.map((w) => {
      let start = nyWallToDate(w.h, 0, now);
      let end = new Date(start.getTime() + 3600_000);
      const active = now >= start && now < end;
      if (!active && now >= end) {
        const tmr = new Date(now.getTime() + 86400_000);
        start = nyWallToDate(w.h, 0, tmr);
        end = new Date(start.getTime() + 3600_000);
      }
      const mins = Math.round((start.getTime() - now.getTime()) / 60000);
      return { ...w, start, end, active, mins };
    });
  }, [now]);
  const nyOff = now ? tzOffsetMin("America/New_York", now) / 60 : -4;
  const saOff = 2;
  const kzActive = now ? KZ.find((k) => now >= nyWallToDate(k.from, 0, now) && now < nyWallToDate(k.to, 0, now)) : undefined;

  return (
    <ToolShell kicker="LIVE TOOL · SECTIONS 13 & 18" title="Silver Bullet & killzone clock" hint="Windows are defined in New York time. Converted live to your time and South African time (SAST, UTC+2) — daylight saving handled automatically.">
      {!now ? (
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 font-mono text-xs">
            <span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">NY now {fmtIn(now, "America/New_York")} (UTC{nyOff >= 0 ? "+" : ""}{nyOff})</span>
            <span className="rounded-full border border-gold/40 px-3 py-1 text-gold">SAST now {fmtIn(now, "Africa/Johannesburg")}</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">You ({localTz}) {fmtIn(now)}</span>
            <span className="rounded-full border border-violet/40 px-3 py-1 text-violet">NY → SAST: +{saOff - nyOff}h right now</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {rows.map((w) => (
              <div key={w.t} className={cn("relative rounded-2xl border p-4", w.active ? "border-gold bg-gold/15" : "border-white/10 bg-black/20")}>
                {w.active && <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-ping rounded-full bg-gold" />}
                <div className="font-mono text-[11px] font-bold" style={{ color: w.c }}>
                  {w.t.toUpperCase()}
                </div>
                <div className="mt-1 text-2xl font-black text-white">
                  {String(w.h).padStart(2, "0")}:00–{String(w.h + 1).padStart(2, "0")}:00 <span className="text-sm font-semibold text-slate-500">NY</span>
                </div>
                <div className="mt-2 space-y-0.5 font-mono text-sm">
                  <div className="text-gold">
                    SAST {fmtIn(w.start, "Africa/Johannesburg")}–{fmtIn(w.end, "Africa/Johannesburg")}
                  </div>
                  <div className="text-slate-400">
                    You {fmtIn(w.start)}–{fmtIn(w.end)}
                  </div>
                </div>
                <div className={cn("mt-3 text-sm font-bold", w.active ? "text-gold" : "text-slate-400")}>
                  {w.active ? "● ACTIVE NOW — watch for a liquidity raid" : `starts in ${Math.floor(w.mins / 60)}h ${w.mins % 60}m`}
                </div>
              </div>
            ))}
          </div>
          <div className={cn("mt-3 rounded-xl border p-3 text-sm", kzActive ? "border-bull/40 bg-bull/10 text-bull" : "border-white/10 text-slate-400")}>
            {kzActive
              ? `Inside the ${kzActive.t} (${kzActive.from}:00–${kzActive.to}:00 NY). Advanced filter: a Silver Bullet setup inside an active killzone — still demand liquidity → MSS/displacement → FVG.`
              : "Killzones (ET): London 02:00–05:00 · NY AM 07:00–10:00. A killzone is a time filter, not a buy/sell signal."}
          </div>
          <p className="mt-2 text-xs text-slate-500">The time filters opportunity; the liquidity and displacement provide the setup. Backtest Gold separately — index statistics don&apos;t transfer.</p>
        </>
      )}
    </ToolShell>
  );
}

/* ── Daily bias builder ────────────────────────────────────────────────── */
const BIAS_FIELDS = [
  ["bias", "HTF bias (Weekly / Daily / 4H)", "e.g. Daily bullish, 4H retracing into discount"],
  ["dol", "Draw on liquidity", "e.g. PDH 4,486 → PWH"],
  ["bull", "Bullish scenario — what must happen", "e.g. London sweeps Asia low/PDL, displaces up, MSS on 15M"],
  ["bear", "Bearish scenario — what must happen", "e.g. Close below 4,380 with displacement → target PWL"],
  ["inval", "Invalidation", "e.g. 4H body close below the discount OB"],
  ["event", "Preferred liquidity event", "e.g. Asia low raid in London KZ"],
  ["notrade", "No-trade condition", "e.g. CPI at 8:30 with no clean sweep; DOL unclear"],
] as const;

export function BiasBuilder() {
  const [v, setV] = useLocal<Record<string, string>>("ict-bias", {});
  const [copied, setCopied] = useState(false);
  const filled = BIAS_FIELDS.filter(([k]) => (v[k] ?? "").trim()).length;
  const text = BIAS_FIELDS.map(([k, l]) => `${l}: ${v[k] ?? ""}`).join("\n");
  return (
    <ToolShell kicker="TOOL · SECTION 14 DRILL" title="Pre-session bias builder" hint="Write it BEFORE the session. A good bias is conditional — saved on this device.">
      <div className="grid gap-3 md:grid-cols-2">
        {BIAS_FIELDS.map(([k, l, ph]) => (
          <label key={k} className={cn("block", (k === "bull" || k === "bear") && "md:col-span-1")}>
            <span className="mb-1 block font-mono text-[11px] font-bold text-slate-500">{l.toUpperCase()}</span>
            <textarea
              rows={2}
              value={v[k] ?? ""}
              placeholder={ph}
              onChange={(e) => setV({ ...v, [k]: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-gold/60"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="mr-auto font-mono text-xs text-slate-400">
          {filled}/{BIAS_FIELDS.length} filled {filled < 3 && "· no DOL + no invalidation = no trade"}
        </div>
        <Btn
          onClick={() => {
            navigator.clipboard?.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <ClipboardCopy size={14} /> {copied ? "Copied!" : "Copy plan"}
        </Btn>
        <Btn onClick={() => setV({})}>
          <RotateCcw size={14} /> Clear
        </Btn>
      </div>
    </ToolShell>
  );
}

/* ── Macro context meter ───────────────────────────────────────────────── */
const FACTORS = [
  { k: "dxy", t: "DXY / USD", opts: [["↑ stronger", -1], ["flat", 0], ["↓ weaker", 1]] },
  { k: "ry", t: "Real yields", opts: [["↑ rising", -1], ["flat", 0], ["↓ falling", 1]] },
  { k: "fed", t: "Fed expectations", opts: [["hawkish", -1], ["neutral", 0], ["dovish", 1]] },
  { k: "cb", t: "Central-bank demand", opts: [["weak", -1], ["normal", 0], ["strong", 1]] },
  { k: "geo", t: "Geopolitical risk / risk-off", opts: [["calm", -1], ["normal", 0], ["elevated", 1]] },
] as const;

export function MacroMeter() {
  const [s, setS] = useState<Record<string, number>>({ dxy: 0, ry: 0, fed: 0, cb: 0, geo: 0 });
  const total = Object.values(s).reduce((a, b) => a + b, 0);
  const label = total >= 2 ? "Supportive backdrop" : total <= -2 ? "Headwind backdrop" : "Mixed backdrop";
  const c = total >= 2 ? BULL : total <= -2 ? BEAR : GOLD;
  return (
    <ToolShell kicker="TOOL · SECTIONS 15 & 22" title="Gold macro context meter" hint="Fundamentals explain WHY the environment may lean one way. Price action decides HOW you execute.">
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-2">
          {FACTORS.map((f) => (
            <div key={f.k} className="flex flex-wrap items-center gap-2">
              <span className="w-40 text-sm font-semibold text-slate-300">{f.t}</span>
              {f.opts.map(([l, val]) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setS({ ...s, [f.k]: val })}
                  className={cn("rounded-lg border px-2.5 py-1 text-xs font-bold transition", s[f.k] === val ? "border-gold/60 bg-gold/15 text-gold" : "border-white/10 text-slate-400 hover:text-white")}
                >
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
          <svg viewBox="0 0 200 110" className="w-full max-w-[240px]">
            <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#1c2433" strokeWidth={14} strokeLinecap="round" />
            <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#mg)" strokeWidth={14} strokeLinecap="round" opacity={0.7} />
            <defs>
              <linearGradient id="mg">
                <stop offset="0" stopColor={BEAR} />
                <stop offset="0.5" stopColor={GOLD} />
                <stop offset="1" stopColor={BULL} />
              </linearGradient>
            </defs>
            <motion.line x1={100} y1={100} x2={100} y2={28} stroke="#fff" strokeWidth={3} strokeLinecap="round" style={{ transformOrigin: "100px 100px", transformBox: "view-box" }} animate={{ rotate: (total / 5) * 85 }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
            <circle cx={100} cy={100} r={6} fill="#fff" />
          </svg>
          <div className="text-lg font-black" style={{ color: c }}>
            {label}
          </div>
          <p className="mt-1 text-xs text-slate-400">Context only — relationships change by regime and Gold can move against them for long periods. Never an entry signal.</p>
        </div>
      </div>
    </ToolShell>
  );
}

/* ── Position size drill (stops 2/5/10/20) ─────────────────────────────── */
export function PositionDrill() {
  const [bal, setBal] = useState(10000);
  const [risk, setRisk] = useState(0.5);
  const [perLot, setPerLot] = useState(100);
  const stops = [2, 5, 10, 20];
  const riskUsd = (bal * risk) / 100;
  const max = riskUsd / (stops[0] * perLot);
  return (
    <ToolShell kicker="TOOL · SECTION 27 DRILL" title="Same risk, different stops" hint="The course drill: test stops of $2, $5, $10 and $20 at fixed account risk. Watch the size shrink.">
      <div className="grid gap-3 sm:grid-cols-3">
        <NumIn label="ACCOUNT ($)" value={bal} onChange={setBal} step={500} />
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] font-bold text-slate-500">RISK % (course: test 0.25–0.5)</span>
          <div className="flex gap-1.5">
            {[0.25, 0.5, 1].map((r) => (
              <Btn key={r} active={risk === r} onClick={() => setRisk(r)} className="flex-1 justify-center">
                {r}%
              </Btn>
            ))}
          </div>
        </label>
        <NumIn label="$ PER $1 MOVE, 1 LOT" value={perLot} onChange={setPerLot} />
      </div>
      <div className="mt-4 font-mono text-sm text-slate-400">
        Max loss per trade: <span className="font-bold text-bear">${fmt(riskUsd || 0)}</span>
      </div>
      <div className="mt-3 space-y-2">
        {stops.map((s) => {
          const lots = riskUsd / (s * perLot);
          return (
            <div key={s} className="flex items-center gap-3">
              <span className="w-24 font-mono text-sm text-slate-300">${s} stop</span>
              <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/5">
                <motion.div className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-gold/70 to-gold/30" animate={{ width: `${(lots / (max || 1)) * 100}%` }} transition={{ type: "spring", stiffness: 140, damping: 20 }} />
                <span className="relative z-10 flex h-full items-center px-3 font-mono text-sm font-bold text-white">{Number.isFinite(lots) ? fmt(lots, 2) : "—"} lots</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">A fixed lot size across different Gold stop distances is especially dangerous. Choose risk first, size second.</p>
    </ToolShell>
  );
}

/* ── Daily playbook stepper + pre-trade checklist ──────────────────────── */
export function Playbook() {
  const [done, setDone] = useLocal<boolean[]>("ict-playbook", PLAYBOOK.map(() => false));
  const [i, setI] = useState(0);
  const count = done.filter(Boolean).length;
  const step = PLAYBOOK[i];
  return (
    <ToolShell kicker="XAUUSD DAILY PLAYBOOK" title="12 questions before every session" hint="One question at a time. Tick it, move on.">
      <div className="mb-3 flex gap-1">
        {PLAYBOOK.map((_, k) => (
          <button key={k} type="button" aria-label={`Step ${k + 1}`} onClick={() => setI(k)} className={cn("h-2 flex-1 rounded-full transition", done[k] ? "bg-bull" : k === i ? "bg-gold" : "bg-white/10")} />
        ))}
      </div>
      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-5">
        <div className="font-mono text-xs font-bold text-gold">STEP {i + 1} / 12</div>
        <div className="mt-1 text-2xl font-black text-white">{step.q}</div>
        <p className="mt-2 text-[15px] text-slate-200">{step.a}</p>
      </motion.div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ← Back
        </Btn>
        <Btn
          active
          onClick={() => {
            setDone(done.map((d, k) => (k === i ? true : d)));
            setI(Math.min(PLAYBOOK.length - 1, i + 1));
          }}
        >
          <Check size={14} /> Done, next
        </Btn>
        <Btn onClick={() => setDone(PLAYBOOK.map(() => false))}>
          <RotateCcw size={14} /> New session
        </Btn>
        <span className="ml-auto self-center font-mono text-xs text-slate-400">{count}/12 complete</span>
      </div>
    </ToolShell>
  );
}

export function GoldChecklist() {
  const [ticks, setTicks] = useLocal<boolean[]>("ict-checklist", CHECKLIST.map(() => false));
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const count = ticks.filter(Boolean).length;
  const go = count === CHECKLIST.length;
  const toggle = (k: number) => {
    const n = ticks.map((v, j) => (j === k ? !v : v));
    setTicks(n);
    if (n.every(Boolean)) {
      setBurst((b) => b + 1);
      award("ict:checklist", 20);
    }
  };
  return (
    <ToolShell kicker="GOLD PRE-TRADE CHECKLIST" title="16 boxes. All of them." hint="Missing one = not yet. Saved on this device.">
      {burst > 0 && <Burst key={burst} />}
      <div className="grid gap-1.5 sm:grid-cols-2">
        {CHECKLIST.map((c, k) => (
          <button
            key={c}
            type="button"
            onClick={() => toggle(k)}
            className={cn("flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm transition", ticks[k] ? "border-bull/40 bg-bull/10 text-white" : "border-white/10 text-slate-300 hover:border-white/25")}
          >
            <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", ticks[k] ? "border-bull bg-bull text-ink" : "border-white/25")}>{ticks[k] && <Check size={13} strokeWidth={3} />}</span>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className={cn("flex-1 rounded-xl border p-3 text-center font-black", go ? "border-bull bg-bull/20 text-bull" : "border-white/10 text-slate-500")}>{go ? "✅ CLEARED — execute the plan" : `${count}/16 — NOT YET`}</div>
        <button type="button" aria-label="Reset checklist" onClick={() => setTicks(CHECKLIST.map(() => false))} className="rounded-xl border border-white/10 p-3 text-slate-400 hover:text-white">
          <RotateCcw size={16} />
        </button>
      </div>
    </ToolShell>
  );
}

/* ── Backtesting journal (template from the course) ────────────────────── */
type Row = Record<string, string>;
export function BacktestJournal() {
  const [rows, setRows] = useLocal<Row[]>("ict-backtest", []);
  const [draft, setDraft] = useState<Row>({});
  const rs = rows.map((r) => parseFloat(r.r)).filter((n) => Number.isFinite(n));
  const wins = rs.filter((n) => n > 0).length;
  const avg = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;
  const viol = rows.filter((r) => r.violation === "Yes").length;

  const exportCsv = () => {
    const head = BACKTEST_FIELDS.map((f) => f.label);
    const esc = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    const csv = [head.map(esc).join(","), ...rows.map((r) => BACKTEST_FIELDS.map((f) => esc(r[f.k] ?? "")).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "xauusd-ict-backtest.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell kicker="BACKTESTING TEMPLATE" title="Your Gold backtest journal" hint="Don't judge a model from a handful of screenshots. One instrument, one model, 1–2 execution timeframes. Saved on this device; export to CSV anytime.">
      <div className="mb-4 grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-5">
        <Stat l="SAMPLES" v={`${rows.length}`} c="#e2e8f0" />
        <Stat l="WIN RATE" v={rs.length ? `${Math.round((wins / rs.length) * 100)}%` : "—"} c={GOLD} />
        <Stat l="AVG R (EXPECTANCY)" v={rs.length ? `${avg >= 0 ? "+" : ""}${avg.toFixed(2)}R` : "—"} c={avg >= 0 ? BULL : BEAR} />
        <Stat l="RULE VIOLATIONS" v={`${viol}`} c={viol ? BEAR : BULL} />
        <Stat l="GOAL" v={`${Math.min(100, rows.length)}/100`} c={VIOLET} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {BACKTEST_FIELDS.map((f) => (
          <label key={f.k} className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold text-slate-500">{f.label.toUpperCase()}</span>
            {f.type === "select" ? (
              <select value={draft[f.k] ?? ""} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:border-gold/60">
                <option value="">—</option>
                {f.options!.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={draft[f.k] ?? ""}
                onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:border-gold/60"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn
          active
          onClick={() => {
            if (!Object.values(draft).some((x) => x)) return;
            setRows([...rows, draft]);
            setDraft({});
          }}
        >
          + Log sample
        </Btn>
        <Btn onClick={exportCsv} disabled={!rows.length}>
          <Download size={14} /> Export CSV
        </Btn>
      </div>
      {rows.length > 0 && (
        <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-panel font-mono text-slate-500">
              <tr>
                {["Date", "Session", "Bias", "Swept", "Array", "R", "Rule?", ""].map((h) => (
                  <th key={h} className="p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, k) => (
                <tr key={k} className="border-t border-white/[0.06] text-slate-300">
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">{r.session}</td>
                  <td className="p-2">{r.bias}</td>
                  <td className="p-2">{r.swept}</td>
                  <td className="p-2">{r.array}</td>
                  <td className={cn("p-2 font-mono font-bold", parseFloat(r.r) > 0 ? "text-bull" : "text-bear")}>{r.r}</td>
                  <td className="p-2">{r.violation}</td>
                  <td className="p-2">
                    <button type="button" aria-label="Delete row" onClick={() => setRows(rows.filter((_, j) => j !== k))} className="text-slate-500 hover:text-bear">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolShell>
  );
}
