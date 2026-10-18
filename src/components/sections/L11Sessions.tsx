"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BEAR, BULL, GOLD, SKY, VIOLET } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { CHAPTERS } from "@/lib/chapters";
import { cn } from "@/lib/utils";

/** All times in New York (ET) hours, so DST is handled by converting from NY. */
type Block = { name: string; from: number; to: number; color: string; row: 0 | 1 | 2 };
const BLOCKS: Block[] = [
  { name: "Asia", from: 19, to: 28, color: SKY, row: 0 },
  { name: "London", from: 3, to: 11.5, color: VIOLET, row: 0 },
  { name: "New York", from: 8, to: 17, color: GOLD, row: 0 },
  { name: "Asia KZ", from: 20, to: 24, color: SKY, row: 1 },
  { name: "London KZ", from: 2, to: 5, color: VIOLET, row: 1 },
  { name: "NY AM KZ", from: 7, to: 10, color: GOLD, row: 1 },
  { name: "LDN close", from: 10, to: 12, color: "#94a3b8", row: 1 },
  { name: "NY lunch", from: 12, to: 13.5, color: BEAR, row: 1 },
  { name: "US30 cash", from: 9.5, to: 16, color: BULL, row: 2 },
];

const EVENTS = [
  { t: 8.5, label: "8:30 USD data", note: "CPI · NFP · PCE · claims — gold & US30 both explode" },
  { t: 9.5, label: "9:30 NYSE open", note: "US30 cash open: the most important minute of the day" },
  { t: 10, label: "10:00 data", note: "ISM · JOLTS · consumer sentiment" },
  { t: 14, label: "14:00 FOMC", note: "8 times a year. Don't hold a tight stop through it." },
];

function describe(et: number) {
  const h = ((et % 24) + 24) % 24;
  const inR = (a: number, b: number) => (b > 24 ? h >= a || h < b - 24 : h >= a && h < b);
  if (inR(2, 5))
    return { title: "London Killzone", gold: "Prime time. Gold often raids the Asian high or low, then runs the other way. Sweep → CHoCH setups live here.", us30: "Futures wake up but the real show is later. Mark the London high/low — NY will target one.", hot: true };
  if (inR(7, 8.5))
    return { title: "NY AM Killzone (pre-data)", gold: "Positioning before 8:30 data. Often a fake move — let the news candle print first.", us30: "Pre-market. Note the overnight high/low and the previous day's close.", hot: true };
  if (inR(8.5, 9.5))
    return { title: "NY AM Killzone · post-data", gold: "Gold's busiest hour. After data, look for the sweep of the news spike and a structure shift.", us30: "Futures react to data. Watch, don't marry a bias yet — the cash open is coming.", hot: true };
  if (inR(9.5, 11))
    return { title: "NYSE open · first 90 minutes", gold: "Still very active, often continuing or reversing the London move.", us30: "US30's money window. Opening range, break & retest, sweep of overnight levels. Most of the day's range is often set here.", hot: true };
  if (inR(11, 12))
    return { title: "London close", gold: "London desks square up — moves can reverse or stall.", us30: "Momentum fades. Take profits, tighten up.", hot: false };
  if (inR(12, 13.5))
    return { title: "NY lunch — chop zone", gold: "Low volume, fake breakouts. Great time for a walk. Seriously.", us30: "Choppy, liquidity-hunting ranges. Most scalpers bleed here.", hot: false };
  if (inR(13.5, 16))
    return { title: "NY PM session", gold: "Can trend on Fed days (14:00 ET). Otherwise quieter.", us30: "Second wind into the 15:00–16:00 'power hour' as funds rebalance.", hot: false };
  if (inR(16, 19))
    return { title: "Close / rollover", gold: "Daily break around 17:00 ET. Spreads widen massively — avoid.", us30: "Cash market closed. Thin futures, wide CFD spreads. Avoid.", hot: false };
  return { title: "Asia session", gold: "Usually a range builder. Mark the Asian high and low — London will hunt one of them.", us30: "Slow drift. Not the time to trade the Dow.", hot: false };
}

function nyNow() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const h = +(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = +(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}

function fmtH(h: number) {
  const x = ((h % 24) + 24) % 24;
  const hh = Math.floor(x);
  const mm = Math.round((x - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm === 60 ? 0 : mm).padStart(2, "0")}`;
}

export function L11Sessions() {
  const ch = CHAPTERS[10];
  return (
    <Level
      chapter={ch}
      accent={SKY}
      tldr={[
        "WHEN you trade matters as much as WHERE. Volume comes in bursts called killzones.",
        "Gold: London open + NY AM (8:30 data). US30: the NYSE cash open at 9:30 ET.",
        "Asia builds the range → London raids it → NY expands or reverses.",
      ]}
    >
      <Clock24 />
      <Playbooks />
      <QuickCheck
        chapter={ch.id}
        question="You trade US30. It's 12:40 New York time and price is chopping sideways. Best move?"
        options={["Scalp every break", "Size up to make back losses", "Step away — it's NY lunch chop", "Switch to 1-second charts"]}
        answer={2}
        explain="Lunch (≈12:00–13:30 ET) is low volume and full of fake breaks. Protecting your focus and capital IS a trading decision."
      />
    </Level>
  );
}

function Clock24() {
  const [offset, setOffset] = useState(0); // local - NY, hours
  const [now, setNow] = useState<number | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);
  const [mode, setMode] = useState<"local" | "ny">("local");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const ny = nyNow();
      const d = new Date();
      const local = d.getHours() + d.getMinutes() / 60;
      let off = Math.round((local - ny) * 2) / 2;
      if (off > 12) off -= 24;
      if (off < -12) off += 24;
      setOffset(off);
      setNow(ny);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const shift = mode === "local" ? offset : 0;
  // the bar starts at 0:00 in the displayed zone; convert NY → displayed
  const pos = (nyH: number) => ((((nyH + shift) % 24) + 24) % 24) / 24;
  const cursor = scrub ?? now ?? 9.5;
  const info = describe(cursor);

  const segments = useMemo(
    () =>
      BLOCKS.flatMap((b) => {
        const s = pos(b.from);
        const len = (b.to - b.from) / 24;
        return s + len > 1
          ? [
              { ...b, s, len: 1 - s, key: `${b.name}a` },
              { ...b, s: 0, len: s + len - 1, key: `${b.name}b` },
            ]
          : [{ ...b, s, len, key: b.name }];
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shift],
  );

  const onPointer = (e: React.PointerEvent) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const r = barRef.current!.getBoundingClientRect();
    const f = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width));
    setScrub(f * 24 - shift);
  };

  return (
    <Panel>
      <PanelTitle kicker="LIVE CLOCK" title="Your trading day, decoded" hint="Drag across the bar to time-travel. The needle starts at right now." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Btn active={mode === "local"} onClick={() => setMode("local")}>
          My time {offset !== 0 && `(NY ${offset > 0 ? "+" : ""}${offset}h)`}
        </Btn>
        <Btn active={mode === "ny"} onClick={() => setMode("ny")}>
          New York time
        </Btn>
        {scrub !== null && (
          <Btn onClick={() => setScrub(null)} className="ml-auto">
            ↺ Back to now
          </Btn>
        )}
      </div>

      <div
        ref={barRef}
        className="relative touch-none select-none rounded-2xl border border-white/10 bg-black/40 px-0 py-3"
        onPointerDown={onPointer}
        onPointerMove={onPointer}
      >
        {[0, 1, 2].map((row) => (
          <div key={row} className="relative mx-2 my-1.5 h-8">
            {segments
              .filter((s) => s.row === row)
              .map((s) => (
                <div
                  key={s.key}
                  className="absolute top-0 flex h-full items-center overflow-hidden rounded-lg px-2 text-[11px] font-bold whitespace-nowrap"
                  style={{
                    left: `${s.s * 100}%`,
                    width: `${s.len * 100}%`,
                    background: `${s.color}${row === 0 ? "26" : "40"}`,
                    color: s.color,
                    border: `1px solid ${s.color}55`,
                    top: row === 0 && s.name === "New York" ? 0 : undefined,
                    zIndex: s.name === "New York" ? 2 : 1,
                    opacity: row === 0 && s.name !== "New York" ? 0.9 : 1,
                  }}
                >
                  {s.len > 0.06 ? s.name : ""}
                </div>
              ))}
          </div>
        ))}
        {/* hour ticks */}
        <div className="relative mx-2 mt-2 h-4 font-mono text-[10px] text-slate-500">
          {Array.from({ length: 9 }, (_, k) => k * 3).map((h) => (
            <span key={h} className="absolute -translate-x-1/2" style={{ left: `${(h / 24) * 100}%` }}>
              {String(h).padStart(2, "0")}
            </span>
          ))}
        </div>
        {/* event pins */}
        {EVENTS.map((ev) => (
          <div key={ev.label} className="absolute top-1 h-[calc(100%-26px)] w-px bg-white/25" style={{ left: `calc(0.5rem + ${pos(ev.t)} * (100% - 1rem))` }} title={ev.note} />
        ))}
        {/* needle */}
        <motion.div
          className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white"
          animate={{ left: `calc(0.5rem + ${pos(cursor)} * (100% - 1rem))` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">
            {fmtH(cursor + shift)}
          </div>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
        <div className={cn("rounded-2xl border p-4", info.hot ? "border-gold/50 bg-gold/10" : "border-white/10")}>
          <div className="font-mono text-[11px] font-bold tracking-widest text-slate-400">
            {scrub === null ? "RIGHT NOW" : "AT THIS TIME"} · {fmtH(cursor)} NY
          </div>
          <div className="mt-1 text-xl font-bold text-white">{info.title}</div>
          <div className={cn("mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[11px] font-bold", info.hot ? "bg-gold text-ink" : "bg-white/10 text-slate-400")}>
            {info.hot ? "🔥 HIGH ACTIVITY" : "😴 LOW PRIORITY"}
          </div>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-4">
          <div className="font-mono text-[11px] font-bold tracking-widest text-gold">◆ XAUUSD</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{info.gold}</p>
        </div>
        <div className="rounded-2xl border border-sky/25 bg-sky/[0.04] p-4">
          <div className="font-mono text-[11px] font-bold tracking-widest text-sky">▲ US30</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{info.us30}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {EVENTS.map((ev) => (
          <button
            type="button"
            key={ev.label}
            onClick={() => setScrub(ev.t)}
            className="rounded-xl border border-white/10 p-3 text-left transition hover:border-white/30"
          >
            <div className="font-mono text-xs font-bold text-white">
              {ev.label} ET {mode === "local" && offset !== 0 && <span className="text-slate-500">→ {fmtH(ev.t + offset)} you</span>}
            </div>
            <div className="text-xs text-slate-400">{ev.note}</div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Session times are approximate and anchored to New York so daylight-saving shifts are handled. Killzones follow the common
        ICT definitions. Always check your broker&apos;s server time and an economic calendar.
      </p>
    </Panel>
  );
}

function Playbooks() {
  const rows = [
    ["Personality", "Fast, wicky, emotional. Loves stop hunts.", "Trendy at the open, choppy midday. Respects round numbers."],
    ["What moves it", "USD (DXY), US real yields, Fed, geopolitics, central-bank buying.", "30 big US stocks (price-weighted: high-priced names move it most), yields, Fed, earnings."],
    ["Best windows (ET)", "02:00–05:00 London · 08:00–11:00 NY AM", "09:30–11:00 cash open · 15:00–16:00 power hour"],
    ["Key levels", "Asian high/low, PDH/PDL, $50/$100 handles, weekly open", "Overnight high/low, PDH/PDL/PDC, 9:30 open price, 000/500 levels"],
    ["Danger zones", "8:30 data, FOMC, 17:00 ET rollover, Sunday open gaps", "Pre-market spreads, NY lunch, mega-cap earnings, FOMC"],
    ["Stops", "Give room beyond the wick — gold sweeps tight stops for fun.", "Use structure, not a fixed number. Volatility at the open is 2–3× midday."],
  ];
  return (
    <Panel>
      <PanelTitle kicker="CHEAT CODES" title="Know your instrument" />
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[110px_1fr_1fr] bg-white/[0.03] font-mono text-[11px] font-bold sm:grid-cols-[160px_1fr_1fr]">
          <div className="p-3 text-slate-500" />
          <div className="p-3 text-gold">◆ XAUUSD</div>
          <div className="p-3 text-sky">▲ US30</div>
        </div>
        {rows.map(([k, g, u]) => (
          <div key={k} className="grid grid-cols-[110px_1fr_1fr] border-t border-white/[0.06] text-sm sm:grid-cols-[160px_1fr_1fr]">
            <div className="p-3 font-semibold text-slate-400">{k}</div>
            <div className="p-3 text-slate-200">{g}</div>
            <div className="p-3 text-slate-200">{u}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Callout kind="gold">
          The classic gold day: Asia ranges → London sweeps one side of the Asian range → NY either extends London&apos;s move or
          reverses it after the 8:30 data. Learn to recognise which day you&apos;re in by 9:00 ET.
        </Callout>
        <Callout kind="us30">
          A simple US30 routine: mark the overnight high/low and PDH/PDL before 9:30. Let the first 5–15 minutes print. Trade the
          sweep or the break & retest of those levels — not the very first candle.
        </Callout>
      </div>
    </Panel>
  );
}
