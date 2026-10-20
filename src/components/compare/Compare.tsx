"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight, Check, RotateCcw, Shuffle } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BEAR, BULL, GOLD } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { ToolShell } from "@/components/ict/Tools";
import { Burst } from "@/components/ui/confetti";
import { GlowCard } from "@/components/ui/card-spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerate } from "@/components/ui/text-generate";
import { CMP_SECTIONS, LENSES, LENS_QUIZ, MATRIX, PRIORITIES, ROSETTA, ROUTINE, STACK, VENN, type LensKey, type Region } from "@/lib/compare";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const KEYS: LensKey[] = ["pa", "ict", "of"];

/* ── Hero ──────────────────────────────────────────────────────────────── */
export function CompareHero() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      gsap.from("[data-circle]", { scale: 0.4, opacity: 0, stagger: 0.18, duration: 1.1, ease: "back.out(1.6)", transformOrigin: "50% 50%" });
      gsap.to("[data-circle]", { y: (i: number) => [-14, 12, 10][i], x: (i: number) => [0, -10, 10][i], duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.4 });
      gsap.from("[data-h] span", { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "expo.out" });
      gsap.from("[data-fade]", { opacity: 0, y: 18, stagger: 0.1, duration: 0.6, delay: 0.4 });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} id="top" className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#a78bfa" />
      <svg viewBox="-20 -20 440 420" className="pointer-events-none absolute -right-16 top-28 hidden h-[480px] w-[480px] overflow-visible opacity-50 md:block" aria-hidden>
        {[
          [200, 140, LENSES.pa.color],
          [140, 240, LENSES.ict.color],
          [260, 240, LENSES.of.color],
        ].map(([cx, cy, c]) => (
          <circle key={c as string} data-circle cx={cx as number} cy={cy as number} r={110} fill={c as string} fillOpacity={0.12} stroke={c as string} strokeWidth={2} />
        ))}
      </svg>
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-36 sm:px-6">
        <div data-fade className="mb-6 flex flex-wrap gap-2 font-mono text-xs font-bold">
          {KEYS.map((k) => (
            <span key={k} className="rounded-full border px-3 py-1" style={{ borderColor: `${LENSES[k].color}66`, color: LENSES[k].color, background: `${LENSES[k].color}12` }}>
              {LENSES[k].emoji} {LENSES[k].name}
            </span>
          ))}
        </div>
        <h1 data-h className="text-[12vw] font-black leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-[112px]">
          <span className="block overflow-hidden">
            <span className="inline-block">One market.</span>
          </span>
          <span className="block overflow-hidden">
            <span className="inline-block bg-gradient-to-r from-gold via-violet to-sky bg-clip-text text-transparent">Three lenses.</span>
          </span>
        </h1>
        <TextGenerate
          className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl"
          words="They aren't rival religions. They describe the same orders hitting the same levels — from three different camera angles. Learn the angles, then stack them."
        />
        <div data-fade className="mt-8 flex flex-wrap items-center gap-4">
          <MovingBorderButton as="a" href={`#${CMP_SECTIONS[0].id}`}>
            Compare them <ArrowDown size={18} />
          </MovingBorderButton>
        </div>
      </div>
    </div>
  );
}

/* ── C1: the three questions ───────────────────────────────────────────── */
export function LensCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {KEYS.map((k) => (
        <GlowCard key={k} color={`${LENSES[k].color}22`}>
          <div className="text-4xl">{LENSES[k].emoji}</div>
          <div className="mt-2 font-mono text-[11px] font-bold tracking-widest" style={{ color: LENSES[k].color }}>
            {LENSES[k].name.toUpperCase()}
          </div>
          <div className="mt-1 text-2xl font-black text-white">{LENSES[k].asks}</div>
          <p className="mt-2 text-sm text-slate-400">Reads: {LENSES[k].reads}</p>
          <Link href={LENSES[k].href} className="mt-4 inline-flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: LENSES[k].color }}>
            Open the course <ArrowRight size={14} />
          </Link>
        </GlowCard>
      ))}
    </div>
  );
}

/* ── C3: Rosetta stone + translate game ────────────────────────────────── */
export function Rosetta() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ToolShell kicker="TRANSLATION TABLE" title="Same event, three names" hint="Tap a row to see WHY they're the same thing.">
      <div className="hidden grid-cols-[1.1fr_1fr_1fr_1fr] gap-2 px-3 pb-2 font-mono text-[11px] font-bold md:grid">
        <span className="text-slate-500">WHAT HAPPENS</span>
        {KEYS.map((k) => (
          <span key={k} style={{ color: LENSES[k].color }}>
            {LENSES[k].emoji} {LENSES[k].name.toUpperCase()}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {ROSETTA.map((r, i) => (
          <button key={r.event} type="button" onClick={() => setOpen(open === i ? null : i)} className={cn("block w-full rounded-2xl border p-3 text-left transition", open === i ? "border-white/25 bg-white/[0.04]" : "border-white/10 hover:border-white/20")}>
            <div className="grid gap-2 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
              <div className="font-bold text-white">{r.event}</div>
              {KEYS.map((k) => (
                <div key={k} className="text-sm">
                  <span className="mr-1 font-mono text-[10px] font-black md:hidden" style={{ color: LENSES[k].color }}>
                    {LENSES[k].short}
                  </span>
                  <span className="text-slate-200" style={{ borderBottom: `2px solid ${LENSES[k].color}55` }}>
                    {r[k]}
                  </span>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2 text-sm text-gold">
                  {r.why}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </ToolShell>
  );
}

export function TranslateGame() {
  const rounds = useMemo(() => {
    const out: { from: LensKey; to: LensKey; row: number }[] = [];
    ROSETTA.forEach((_, i) => {
      const from = KEYS[i % 3];
      const to = KEYS[(i + 1 + (i % 2)) % 3] === from ? KEYS[(i + 2) % 3] : KEYS[(i + 1 + (i % 2)) % 3];
      out.push({ from, to, row: i });
    });
    return out;
  }, []);
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const done = n >= rounds.length;
  const r = rounds[Math.min(n, rounds.length - 1)];
  const options = useMemo(() => {
    const idx = [r.row, (r.row + 3) % ROSETTA.length, (r.row + 6) % ROSETTA.length, (r.row + 8) % ROSETTA.length];
    return [...new Set(idx)].sort((a, b) => ((a * 7 + n) % 5) - ((b * 7 + n) % 5));
  }, [r, n]);

  const choose = (i: number) => {
    if (pick !== null) return;
    setPick(i);
    if (i === r.row) setScore((s) => s + 1);
  };
  const next = () => {
    setPick(null);
    const k = n + 1;
    setN(k);
    if (k >= rounds.length && score >= 8 && award("cmp:translate", 30)) setBurst((b) => b + 1);
  };

  return (
    <ToolShell kicker="MINI-GAME · +30 XP" title="Translate it" hint="You'll get a term from one lens. Pick what the other lens calls the same thing.">
      {burst > 0 && <Burst key={burst} />}
      {done ? (
        <div className="py-6 text-center">
          <div className="text-5xl font-black text-gold">
            {score}/{rounds.length}
          </div>
          <p className="mt-2 text-slate-300">{score >= 8 ? "Fluent in all three languages." : "Re-read the table and go again."}</p>
          <Btn
            className="mt-3"
            active
            onClick={() => {
              setN(0);
              setScore(0);
            }}
          >
            <Shuffle size={14} /> Again
          </Btn>
        </div>
      ) : (
        <div>
          <div className="mb-2 font-mono text-xs text-slate-500">
            {n + 1}/{rounds.length} · score {score}
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: `${LENSES[r.from].color}55`, background: `${LENSES[r.from].color}0d` }}>
            <div className="font-mono text-[11px] font-bold" style={{ color: LENSES[r.from].color }}>
              {LENSES[r.from].name.toUpperCase()} SAYS
            </div>
            <div className="mt-1 text-xl font-bold text-white">“{ROSETTA[r.row][r.from]}”</div>
            <div className="mt-3 text-sm text-slate-300">
              What does <b style={{ color: LENSES[r.to].color }}>{LENSES[r.to].name}</b> call it?
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => choose(o)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition",
                  pick === null && "border-white/10 hover:border-white/30",
                  pick !== null && o === r.row && "border-bull bg-bull/15 text-white",
                  pick === o && o !== r.row && "border-bear bg-bear/10",
                  pick !== null && pick !== o && o !== r.row && "opacity-40",
                )}
              >
                {ROSETTA[o][r.to]}
              </button>
            ))}
          </div>
          {pick !== null && (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm text-slate-300">{ROSETTA[r.row].why}</p>
              <Btn active onClick={next}>
                Next →
              </Btn>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

/* ── C4: Venn ──────────────────────────────────────────────────────────── */
const SPOTS: { r: Region; x: number; y: number; label: string }[] = [
  { r: "pa", x: 200, y: 70, label: "PA only" },
  { r: "ict", x: 85, y: 285, label: "ICT only" },
  { r: "of", x: 315, y: 285, label: "OF only" },
  { r: "pa-ict", x: 128, y: 168, label: "PA ∩ ICT" },
  { r: "pa-of", x: 272, y: 168, label: "PA ∩ OF" },
  { r: "ict-of", x: 200, y: 300, label: "ICT ∩ OF" },
  { r: "all", x: 200, y: 212, label: "ALL 3" },
];
export function Venn() {
  const [sel, setSel] = useState<Region>("all");
  const inSel = (k: LensKey) => sel === "all" || sel.split("-").includes(k);
  const circles: [LensKey, number, number][] = [
    ["pa", 200, 140],
    ["ict", 140, 245],
    ["of", 260, 245],
  ];
  return (
    <ToolShell kicker="TAP A REGION" title="Similarities & differences" hint="Each circle is a lens. Overlaps are what they share.">
      <div className="grid items-center gap-5 md:grid-cols-[1fr_1fr]">
        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]">
          {circles.map(([k, cx, cy]) => (
            <motion.circle
              key={k}
              cx={cx}
              cy={cy}
              r={120}
              fill={LENSES[k].color}
              stroke={LENSES[k].color}
              animate={{ fillOpacity: inSel(k) ? 0.2 : 0.04, strokeWidth: inSel(k) ? 3 : 1, strokeOpacity: inSel(k) ? 1 : 0.4 }}
            />
          ))}
          {circles.map(([k, cx, cy]) => (
            <text key={k} x={k === "pa" ? cx : k === "ict" ? cx - 40 : cx + 40} y={k === "pa" ? 13 : 388} textAnchor="middle" fontSize={13} fontWeight={900} fill={LENSES[k].color}>
              {LENSES[k].name}
            </text>
          ))}
          {SPOTS.map((s) => (
            <g key={s.r} onClick={() => setSel(s.r)} className="cursor-pointer">
              <rect x={s.x - 38} y={s.y - 13} width={76} height={24} rx={12} fill={sel === s.r ? "#fff" : "#0b0f17"} stroke="#ffffff55" />
              <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill={sel === s.r ? "#05070c" : "#e2e8f0"} className="font-mono">
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-xl font-black text-white">{VENN[sel].title}</div>
            <ul className="mt-3 space-y-2">
              {VENN[sel].items.map((t) => (
                <li key={t} className="flex gap-2 text-[15px] text-slate-200">
                  <Check size={16} className="mt-1 shrink-0 text-bull" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </ToolShell>
  );
}

/* ── C5: matrix ────────────────────────────────────────────────────────── */
export function Matrix() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <ToolShell kicker="HEAD-TO-HEAD" title="Strengths and blind spots" hint="5 bars = strong. Tap/hover a row for the details.">
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-3 px-2 pb-2 font-mono text-[11px] font-bold">
            <span className="text-slate-500">DIMENSION</span>
            {KEYS.map((k) => (
              <span key={k} style={{ color: LENSES[k].color }}>
                {LENSES[k].emoji} {LENSES[k].name.toUpperCase()}
              </span>
            ))}
          </div>
          {MATRIX.map((m) => (
            <div key={m.dim} onMouseEnter={() => setHover(m.dim)} onClick={() => setHover(hover === m.dim ? null : m.dim)} className="grid grid-cols-[180px_1fr_1fr_1fr] items-start gap-3 border-t border-white/[0.06] px-2 py-2.5">
              <span className="text-sm font-semibold text-slate-300">{m.dim}</span>
              {KEYS.map((k) => {
                const [score, note] = m[k];
                const best = Math.max(m.pa[0], m.ict[0], m.of[0]) === score;
                return (
                  <div key={k}>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <motion.span key={j} className="h-2.5 flex-1 rounded-full" initial={false} animate={{ background: j < score ? LENSES[k].color : "#1c2433", opacity: j < score ? (best ? 1 : 0.6) : 1 }} />
                      ))}
                    </div>
                    <AnimatePresence>
                      {hover === m.dim && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-1.5 text-xs text-slate-400">
                          {note}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

/* ── C6: which lens fits you ───────────────────────────────────────────── */
export function PathFinder() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const score = useMemo(() => {
    const s = { pa: 4, ict: 3, of: 2 };
    for (const p of PRIORITIES) if (on[p.k]) for (const k of KEYS) s[k] += p.w[k];
    return s;
  }, [on]);
  const order = [...KEYS].sort((a, b) => score[b] - score[a]);
  const max = Math.max(1, ...KEYS.map((k) => score[k]));
  const plan: Record<LensKey, string> = {
    pa: "Make price action your base: structure + levels + confirmation candles. Add ICT's time windows and liquidity ideas once you're consistent.",
    ict: "Make ICT your base: bias → DOL → killzone → sweep → MSS → FVG. Use price action candles as confirmation; add order flow later via futures data.",
    of: "Use order flow as your trigger at levels you plan with PA/ICT. Get futures data (GC/MGC, YM/MYM) — it doesn't work properly on CFD tick volume.",
  };
  return (
    <ToolShell kicker="QUIZ YOURSELF" title="Which lens should be your base?" hint="Tick everything that's true for you. There's no wrong answer — and you can combine later.">
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="grid gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.k}
              type="button"
              onClick={() => setOn({ ...on, [p.k]: !on[p.k] })}
              className={cn("flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm transition", on[p.k] ? "border-gold/50 bg-gold/10 text-white" : "border-white/10 text-slate-300 hover:border-white/25")}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", on[p.k] ? "border-gold bg-gold text-ink" : "border-white/25")}>{on[p.k] && <Check size={13} strokeWidth={3} />}</span>
              {p.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {order.map((k, i) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-bold" style={{ color: LENSES[k].color }}>
                  {i === 0 && "★ "}
                  {LENSES[k].name}
                </span>
                <span className="font-mono text-slate-400">{Math.max(0, score[k])}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/5">
                <motion.div className="h-full rounded-full" style={{ background: LENSES[k].color }} animate={{ width: `${(Math.max(0, score[k]) / max) * 100}%` }} />
              </div>
            </div>
          ))}
          <motion.div key={order[0]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-4" style={{ borderColor: `${LENSES[order[0]].color}66`, background: `${LENSES[order[0]].color}10` }}>
            <div className="font-mono text-[11px] font-bold" style={{ color: LENSES[order[0]].color }}>
              YOUR BASE: {LENSES[order[0]].name.toUpperCase()}
            </div>
            <p className="mt-1 text-[15px] text-slate-100">{plan[order[0]]}</p>
          </motion.div>
        </div>
      </div>
    </ToolShell>
  );
}

/* ── C7: confluence stack ──────────────────────────────────────────────── */
export function ConfluenceStack() {
  const [on, setOn] = useState<boolean[]>(STACK.map(() => false));
  const [conflict, setConflict] = useState(false);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const total = STACK.reduce((s, x, i) => s + (on[i] ? x.w : 0), 0);
  const lensesUsed = new Set(STACK.filter((_, i) => on[i]).map((x) => x.lens));
  const layers = ["Context", "Location", "Trigger"] as const;
  const layerOk = (l: (typeof layers)[number]) => STACK.some((x, i) => on[i] && x.layer === l);
  const allLayers = layers.every(layerOk);
  const grade = conflict
    ? { t: "SKIP — the lenses disagree", c: BEAR, d: "When order flow shows absorption against you, or PA structure fights your ICT bias, the trade isn't clean. Skipping is a position." }
    : !allLayers
      ? { t: "NOT YET", c: "#94a3b8", d: "You need at least one item in every layer: context → location → trigger." }
      : total >= 11 && lensesUsed.size === 3
        ? { t: "A+ — full confluence", c: BULL, d: "All three lenses agree across every layer. This is the trade you wait all week for." }
        : total >= 8
          ? { t: "A — strong", c: GOLD, d: "Solid. More lenses agreeing would make it A+." }
          : { t: "B — tradeable, reduce size", c: GOLD, d: "Every layer is covered, but thinly. Consider half risk." };

  const toggle = (i: number) => {
    const n = on.map((v, j) => (j === i ? !v : v));
    setOn(n);
    const t = STACK.reduce((s, x, j) => s + (n[j] ? x.w : 0), 0);
    const used = new Set(STACK.filter((_, j) => n[j]).map((x) => x.lens));
    if (!conflict && t >= 11 && used.size === 3 && layers.every((l) => STACK.some((x, j) => n[j] && x.layer === l)) && award("cmp:stack", 20)) setBurst((b) => b + 1);
  };

  return (
    <ToolShell kicker="BUILD A TRADE · +20 XP" title="The confluence stack" hint="Context → Location → Trigger. Tick what you see. Each lens can contribute to each layer.">
      {burst > 0 && <Burst key={burst} />}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          {layers.map((l, li) => (
            <div key={l}>
              <div className={cn("mb-1.5 flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest", layerOk(l) ? "text-bull" : "text-slate-500")}>
                {li + 1} · {l.toUpperCase()} {layerOk(l) && "✓"}
              </div>
              <div className="grid gap-1.5">
                {STACK.map((x, i) =>
                  x.layer !== l ? null : (
                    <button
                      key={x.t}
                      type="button"
                      onClick={() => toggle(i)}
                      className={cn("flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm transition", on[i] ? "bg-white/[0.05] text-white" : "border-white/10 text-slate-300 hover:border-white/25")}
                      style={on[i] ? { borderColor: `${LENSES[x.lens].color}88` } : undefined}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border" style={{ borderColor: LENSES[x.lens].color, background: on[i] ? LENSES[x.lens].color : "transparent" }}>
                        {on[i] && <Check size={13} strokeWidth={3} className="text-ink" />}
                      </span>
                      <span className="w-9 shrink-0 font-mono text-[10px] font-black" style={{ color: LENSES[x.lens].color }}>
                        {LENSES[x.lens].short}
                      </span>
                      {x.t}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setConflict(!conflict)}
            className={cn("flex w-full items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-semibold", conflict ? "border-bear bg-bear/15 text-bear" : "border-bear/30 text-slate-300")}
          >
            <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border border-bear", conflict && "bg-bear text-ink")}>{conflict && <Check size={13} strokeWidth={3} />}</span>
            ⚠ A lens disagrees (e.g. absorption AGAINST my direction, or HTF structure opposite)
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col-reverse gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-3">
            {layers.map((l) => (
              <motion.div key={l} animate={{ opacity: layerOk(l) ? 1 : 0.25, scale: layerOk(l) ? 1 : 0.96 }} className="rounded-xl border border-white/10 p-3 text-center">
                <div className="font-mono text-[11px] font-bold text-slate-400">{l.toUpperCase()}</div>
                <div className="mt-1 flex justify-center gap-1.5">
                  {KEYS.map((k) => (
                    <span key={k} className="h-2.5 w-8 rounded-full" style={{ background: STACK.some((x, i) => on[i] && x.layer === l && x.lens === k) ? LENSES[k].color : "#1c2433" }} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: `${grade.c}66`, background: `${grade.c}12` }}>
            <div className="text-xl font-black" style={{ color: grade.c }}>
              {grade.t}
            </div>
            <p className="mt-1 text-sm text-slate-200">{grade.d}</p>
            <div className="mt-2 font-mono text-xs text-slate-500">
              score {total} · lenses {lensesUsed.size}/3
            </div>
          </div>
          <Btn
            onClick={() => {
              setOn(STACK.map(() => false));
              setConflict(false);
            }}
          >
            <RotateCcw size={14} /> Clear
          </Btn>
        </div>
      </div>
    </ToolShell>
  );
}

/* ── C8: which lens answers the question ───────────────────────────────── */
export function LensQuiz() {
  const [n, setN] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const done = n >= LENS_QUIZ.length;
  const q = LENS_QUIZ[Math.min(n, LENS_QUIZ.length - 1)];
  const choose = (k: string) => {
    if (pick) return;
    setPick(k);
    if (k === q.a) setScore((s) => s + 1);
  };
  const next = () => {
    setPick(null);
    const k = n + 1;
    setN(k);
    if (k >= LENS_QUIZ.length && score >= 7 && award("cmp:quiz", 40)) setBurst((b) => b + 1);
  };
  const opts: { k: string; label: string; c: string }[] = [...KEYS.map((k) => ({ k, label: `${LENSES[k].emoji} ${LENSES[k].name}`, c: LENSES[k].color })), { k: "all", label: "✦ All three", c: "#e2e8f0" }];
  return (
    <ToolShell kicker="QUIZ · +40 XP" title="Which lens answers this question best?" hint="10 trader questions. Pick the lens built for it.">
      {burst > 0 && <Burst key={burst} />}
      {done ? (
        <div className="py-6 text-center">
          <div className="text-5xl font-black text-gold">
            {score}/{LENS_QUIZ.length}
          </div>
          <Btn
            className="mt-3"
            active
            onClick={() => {
              setN(0);
              setScore(0);
            }}
          >
            <RotateCcw size={14} /> Again
          </Btn>
        </div>
      ) : (
        <div>
          <div className="mb-2 font-mono text-xs text-slate-500">
            {n + 1}/{LENS_QUIZ.length} · score {score}
          </div>
          <motion.div key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 text-xl font-bold text-white">
            {q.q}
          </motion.div>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {opts.map((o) => {
              const right = pick && o.k === q.a;
              const wrong = pick === o.k && o.k !== q.a;
              return (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => choose(o.k)}
                  className={cn("rounded-2xl border-2 px-3 py-3 text-sm font-black transition", pick && !right && !wrong && "opacity-30")}
                  style={{ borderColor: right ? BULL : wrong ? BEAR : `${o.c}55`, color: right ? BULL : wrong ? BEAR : o.c, background: right ? `${BULL}18` : "transparent" }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          {pick && (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm text-slate-200">{q.why}</p>
              <Btn active onClick={next}>
                Next →
              </Btn>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

/* ── C9: combined routine ──────────────────────────────────────────────── */
export function Routine() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      gsap.fromTo("[data-beam]", { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-row]", ref.current).forEach((el) => gsap.from(el, { x: 30, opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="relative pl-8">
      <div className="absolute bottom-0 left-3 top-0 w-px bg-white/10" />
      <div data-beam className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-gold via-violet to-sky" />
      <div className="space-y-3">
        {ROUTINE.map((r, i) => (
          <div key={r.when} data-row className="relative rounded-2xl border border-white/10 bg-panel/80 p-4">
            <span className="absolute -left-[26px] top-5 flex h-3 w-3 rounded-full bg-gold ring-4 ring-ink" />
            <div className="font-mono text-xs font-bold text-gold">
              {String(i + 1).padStart(2, "0")} · {r.when.toUpperCase()}
            </div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {KEYS.map((k) => (
                <div key={k} className="rounded-xl border p-2.5 text-sm text-slate-200" style={{ borderColor: `${LENSES[k].color}33`, background: `${LENSES[k].color}0a` }}>
                  <div className="font-mono text-[10px] font-black" style={{ color: LENSES[k].color }}>
                    {LENSES[k].short}
                  </div>
                  {r[k]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
