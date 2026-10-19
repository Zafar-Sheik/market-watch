"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, Shuffle, X } from "lucide-react";
import { useRef, useState } from "react";
import { BEAR, BULL, GOLD, SKY, VIOLET } from "@/components/chart/CandleChart";
import { Btn } from "@/components/learn/Level";
import { Burst } from "@/components/ui/confetti";
import { EXPANSION, EXEC_MODELS_2026, MASTER_RULE } from "@/lib/ict/extras";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { ToolShell } from "./Tools";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function shuffle<T>(a: T[], seed = Math.random()) {
  const r = [...a];
  let s = Math.floor(seed * 1e9) || 1;
  for (let i = r.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/* ── Liquidity sorter (Section 5) ──────────────────────────────────────── */
const POOLS = [
  { t: "PDH", a: "BSL" },
  { t: "Equal lows", a: "SSL" },
  { t: "Asia high", a: "BSL" },
  { t: "PWL", a: "SSL" },
  { t: "FVG inside the range", a: "IRL" },
  { t: "Session low", a: "SSL" },
  { t: "Minor swing high inside the range", a: "IRL" },
  { t: "Equal highs", a: "BSL" },
  { t: "PDL", a: "SSL" },
  { t: "PWH", a: "BSL" },
  { t: "Short-term low inside the range", a: "IRL" },
  { t: "Previous swing high", a: "BSL" },
] as const;
const BUCKETS = [
  { k: "BSL", label: "BSL (above highs)", c: BEAR },
  { k: "SSL", label: "SSL (below lows)", c: BULL },
  { k: "IRL", label: "Internal (IRL)", c: SKY },
] as const;

export function LiquiditySorter() {
  const [order, setOrder] = useState(() => POOLS.map((_, i) => i));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<null | boolean>(null);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const done = i >= POOLS.length;
  const item = POOLS[order[Math.min(i, POOLS.length - 1)]];

  const pick = (k: string) => {
    if (done) return;
    const ok = k === item.a;
    setLast(ok);
    if (ok) setScore((s) => s + 1);
    const n = i + 1;
    setI(n);
    if (n >= POOLS.length && score + (ok ? 1 : 0) >= 10) {
      setBurst((b) => b + 1);
      award("ict:sorter", 30);
    }
  };

  return (
    <ToolShell kicker="MINI-GAME · +30 XP" title="Where do the stops live?" hint="Sort each level: buy-side, sell-side, or internal range liquidity. 12 cards, fast.">
      {burst > 0 && <Burst key={burst} />}
      {done ? (
        <div className="py-6 text-center">
          <div className="text-5xl font-black text-gold">
            {score}/{POOLS.length}
          </div>
          <p className="mt-2 text-slate-300">{score >= 10 ? "Liquidity map: locked in." : "Re-read Section 5.1–5.4 and run it back."}</p>
          <Btn
            className="mt-4"
            active
            onClick={() => {
              setOrder(shuffle(order));
              setI(0);
              setScore(0);
              setLast(null);
            }}
          >
            <Shuffle size={14} /> Again
          </Btn>
        </div>
      ) : (
        <div className="grid items-center gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="relative h-36">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: last ? 120 : -120, rotate: last ? 8 : -8 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-gold/40 bg-gold/[0.07] p-4 text-center"
              >
                <div className="font-mono text-[11px] text-slate-500">
                  CARD {i + 1}/{POOLS.length} · SCORE {score}
                </div>
                <div className="mt-1 text-2xl font-black text-white">{item.t}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid gap-2">
            {BUCKETS.map((b) => (
              <button
                key={b.k}
                type="button"
                onClick={() => pick(b.k)}
                className="rounded-2xl border-2 px-4 py-3.5 text-left text-base font-black transition active:scale-[0.98]"
                style={{ borderColor: `${b.c}66`, color: b.c, background: `${b.c}10` }}
              >
                {b.label}
              </button>
            ))}
            <div className={cn("h-5 text-sm font-semibold", last === null ? "" : last ? "text-bull" : "text-bear")}>
              {last === null ? "" : last ? "✓ correct" : "✕ not quite — keep going"}
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

/* ── Myth buster (Section 29) ──────────────────────────────────────────── */
const STATEMENTS: { t: string; true: boolean; why: string }[] = [
  { t: "Every liquidity sweep reverses.", true: false, why: "Sometimes liquidity is taken and price continues." },
  { t: "A sweep is a location; the evidence comes after it.", true: true, why: "Wait for displacement, a meaningful MSS and an aligned PD array." },
  { t: "Every FVG gets filled.", true: false, why: "Some remain unfilled — often a sign of a strong trend." },
  { t: "OTE guarantees a reversal.", true: false, why: "It's a location framework, not a trigger." },
  { t: "Every last down candle is an order block.", true: false, why: "Context matters: liquidity, displacement, structure, P/D." },
  { t: "SMT means automatic reversal.", true: false, why: "It's confirmation/context. Gold still needs to confirm." },
  { t: "Every killzone produces a setup.", true: false, why: "Killzones are time filters, not signals." },
  { t: "A valid setup can lose.", true: true, why: "Good process + losing trade = acceptable." },
  { t: "One ICT model works every day.", true: false, why: "Market conditions change. Classify regimes; test models per regime." },
  { t: "Stops belong beyond the level that invalidates the setup.", true: true, why: "Not arbitrary dollar distances." },
  { t: "ICT knows exactly what banks are doing.", true: false, why: "The institutional language is a framework, not a window into private order books." },
  { t: "If the draw on liquidity is unclear, standing aside is a valid decision.", true: true, why: "Daily bias is a probability framework, not a prediction." },
];

export function MythBuster() {
  const [deck, setDeck] = useState(() => shuffle(STATEMENTS, 0.42));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [ans, setAns] = useState<null | boolean>(null);
  const { award } = useProgress();
  const done = i >= deck.length;
  const s = deck[Math.min(i, deck.length - 1)];

  const answer = (v: boolean) => {
    if (ans !== null) return;
    setAns(v);
    if (v === s.true) setScore((x) => x + 1);
  };
  const next = () => {
    setAns(null);
    const n = i + 1;
    setI(n);
    if (n >= deck.length && score >= 10) award("ict:myths", 30);
  };

  return (
    <ToolShell kicker="MINI-GAME · +30 XP" title="Myth buster: true or false?" hint="Section 29 — the beliefs that turn a framework into false certainty.">
      {done ? (
        <div className="py-6 text-center">
          <div className="text-5xl font-black text-gold">
            {score}/{deck.length}
          </div>
          <Btn
            className="mt-4"
            active
            onClick={() => {
              setDeck(shuffle(STATEMENTS));
              setI(0);
              setScore(0);
            }}
          >
            <Shuffle size={14} /> Shuffle & replay
          </Btn>
        </div>
      ) : (
        <div>
          <div className="mb-2 font-mono text-xs text-slate-500">
            {i + 1}/{deck.length} · score {score}
          </div>
          <motion.div key={i} initial={{ opacity: 0, rotateX: -30 }} animate={{ opacity: 1, rotateX: 0 }} className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-center text-xl font-bold text-white sm:text-2xl">
            “{s.t}”
          </motion.div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[true, false].map((v) => {
              const right = ans !== null && v === s.true;
              const wrong = ans === v && v !== s.true;
              return (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => answer(v)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-2xl border-2 py-4 text-lg font-black transition",
                    right ? "border-bull bg-bull/20 text-bull" : wrong ? "border-bear bg-bear/15 text-bear" : v ? "border-bull/40 text-bull" : "border-bear/40 text-bear",
                    ans !== null && !right && !wrong && "opacity-30",
                  )}
                >
                  {v ? <Check size={20} /> : <X size={20} />} {v ? "TRUE" : "FALSE"}
                </button>
              );
            })}
          </div>
          {ans !== null && (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm text-slate-200">
                <b className={ans === s.true ? "text-bull" : "text-bear"}>{s.true ? "TRUE. " : "FALSE. "}</b>
                {s.why}
              </p>
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

/* ── Sequence builder: the Final Master Rule ───────────────────────────── */
export function SequenceBuilder() {
  const [pool, setPool] = useState(() => shuffle(MASTER_RULE, 0.77));
  const [built, setBuilt] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();
  const next = MASTER_RULE[built.length];
  const done = built.length === MASTER_RULE.length;

  const tap = (t: string) => {
    if (t === next) {
      const b = [...built, t];
      setBuilt(b);
      setPool(pool.filter((x) => x !== t));
      setWrong(null);
      if (b.length === MASTER_RULE.length) {
        setBurst((x) => x + 1);
        award("ict:sequence", 40);
      }
    } else {
      setWrong(t);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <ToolShell kicker="MINI-GAME · +40 XP" title="Build the Final Master Rule" hint="Tap the 14 steps in order. Wrong taps just wiggle — no penalty.">
      {burst > 0 && <Burst key={burst} />}
      <div className="min-h-[72px] rounded-2xl border border-dashed border-gold/40 bg-gold/[0.04] p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {built.map((t, k) => (
            <motion.span key={t} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5">
              <span className="rounded-lg bg-gold px-2.5 py-1 text-xs font-bold text-ink">
                {k + 1}. {t}
              </span>
              {k < MASTER_RULE.length - 1 && <span className="text-gold">→</span>}
            </motion.span>
          ))}
          {!done && <span className="font-mono text-xs text-slate-500">step {built.length + 1}: ?</span>}
        </div>
      </div>
      {done ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="flex-1 text-sm text-bull">If the story is unclear, there is no requirement to trade. The best skill is often knowing when the chart does not meet your model.</p>
          <Btn
            onClick={() => {
              setPool(shuffle(MASTER_RULE));
              setBuilt([]);
            }}
          >
            <RotateCcw size={14} /> Again
          </Btn>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {pool.map((t) => (
            <motion.button
              key={t}
              type="button"
              layout
              onClick={() => tap(t)}
              animate={wrong === t ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              className={cn("rounded-xl border px-3 py-2 text-sm font-semibold transition", wrong === t ? "border-bear bg-bear/15 text-bear" : "border-white/15 bg-white/[0.03] text-slate-200 hover:border-gold/50")}
            >
              {t}
            </motion.button>
          ))}
        </div>
      )}
    </ToolShell>
  );
}

/* ── Process vs outcome matrix (Section 28) ────────────────────────────── */
const CASES = [
  { t: "Followed every rule, got stopped out by a clean sweep that continued.", p: "good", o: "loss" },
  { t: "Chased the CPI spike with no MSS — it ran +3R.", p: "bad", o: "win" },
  { t: "Waited for SSL raid, displacement, MSS, FVG entry, hit TP2.", p: "good", o: "win" },
  { t: "Widened my stop to avoid a loss — lost 2.5R instead of 1R.", p: "bad", o: "loss" },
  { t: "Revenge trade after a loss, doubled size, it worked.", p: "bad", o: "win" },
  { t: "Skipped the session: no DOL, CPI in 10 minutes.", p: "good", o: "none" },
] as const;
const QUAD: Record<string, { label: string; c: string }> = {
  "good-win": { label: "Earned", c: BULL },
  "good-loss": { label: "ACCEPTABLE", c: SKY },
  "bad-win": { label: "DANGEROUS", c: BEAR },
  "bad-loss": { label: "Lesson", c: GOLD },
  "good-none": { label: "Discipline", c: VIOLET },
};

export function ProcessMatrix() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<null | "good" | "bad">(null);
  const c = CASES[i % CASES.length];
  const key = `${c.p}-${c.o}`;
  return (
    <ToolShell kicker="SORT IT" title="Grade the process, not the P/L" hint="Was the PROCESS good or bad? (Outcome is shown — ignore it.)">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="font-mono text-xs text-slate-500">
          CASE {(i % CASES.length) + 1}/{CASES.length} · outcome: {c.o === "none" ? "no trade" : c.o.toUpperCase()}
        </div>
        <div className="mt-1 text-lg font-bold text-white">{c.t}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["good", "bad"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setPick(g)}
            className={cn("rounded-2xl border-2 py-3 font-black", pick === g ? (g === c.p ? "border-bull bg-bull/15 text-bull" : "border-bear bg-bear/15 text-bear") : "border-white/15 text-slate-300")}
          >
            {g === "good" ? "GOOD PROCESS" : "BAD PROCESS"}
          </button>
        ))}
      </div>
      {pick && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border p-3" style={{ borderColor: `${QUAD[key].c}55`, background: `${QUAD[key].c}10` }}>
          <span className="font-black" style={{ color: QUAD[key].c }}>
            {QUAD[key].label}
          </span>
          <span className="flex-1 text-sm text-slate-300">
            {c.p === "good" ? "Good process" : "Bad process"} + {c.o === "none" ? "no trade" : c.o === "win" ? "winning trade" : "losing trade"}.
          </span>
          <Btn
            active
            onClick={() => {
              setPick(null);
              setI(i + 1);
            }}
          >
            Next →
          </Btn>
        </div>
      )}
    </ToolShell>
  );
}

/* ── Entry gate walk (Section 25) ──────────────────────────────────────── */
const GATES = [
  { k: "SETUP", q: "Is there a clear HTF narrative and DOL?" },
  { k: "LOCATION", q: "Is price at a favourable P/D or OTE location?" },
  { k: "LIQUIDITY", q: "Is the BSL/SSL to be swept clearly defined?" },
  { k: "TRIGGER", q: "Has the liquidity raid happened?" },
  { k: "CONFIRM", q: "Displacement + meaningful MSS/CISD?" },
  { k: "ENTRY", q: "Is a pre-defined FVG/OB/IFVG/breaker aligned?" },
  { k: "TARGET", q: "Is a logical internal/external liquidity target defined?" },
];
export function GateWalk() {
  const [i, setI] = useState(0);
  const [failed, setFailed] = useState<number | null>(null);
  const done = i >= GATES.length;
  return (
    <ToolShell kicker="INTERACTIVE · SECTION 25" title="Walk the entry gates" hint="Answer honestly. Any 'no' = the PD array is not a reason to force a trade.">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {GATES.map((g, k) => (
          <span
            key={g.k}
            className={cn(
              "rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold",
              failed === k ? "border-bear bg-bear/20 text-bear" : k < i ? "border-bull/50 bg-bull/15 text-bull" : k === i && failed === null ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-slate-500",
            )}
          >
            {g.k}
          </span>
        ))}
      </div>
      {failed !== null ? (
        <div className="rounded-2xl border border-bear/50 bg-bear/10 p-5">
          <div className="text-2xl font-black text-bear">NO TRADE</div>
          <p className="mt-1 text-slate-200">Gate “{GATES[failed].k}” failed. If the setup, location, liquidity event or confirmation is missing, don&apos;t force it.</p>
        </div>
      ) : done ? (
        <div className="rounded-2xl border border-bull/50 bg-bull/10 p-5">
          <div className="text-2xl font-black text-bull">EXECUTE THE PLAN</div>
          <p className="mt-1 text-slate-200">All 7 gates passed. Know your exact entry type, invalidation and target before price reaches your POI.</p>
        </div>
      ) : (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gold/30 bg-gold/[0.05] p-5">
          <div className="font-mono text-xs font-bold text-gold">
            GATE {i + 1}/7 · {GATES[i].k}
          </div>
          <div className="mt-1 text-xl font-bold text-white">{GATES[i].q}</div>
          <div className="mt-4 flex gap-2">
            <Btn active onClick={() => setI(i + 1)}>
              <Check size={14} /> Yes
            </Btn>
            <Btn onClick={() => setFailed(i)}>
              <X size={14} /> No
            </Btn>
          </div>
        </motion.div>
      )}
      {(failed !== null || done) && (
        <Btn
          className="mt-3"
          onClick={() => {
            setI(0);
            setFailed(null);
          }}
        >
          <RotateCcw size={14} /> Walk again
        </Btn>
      )}
    </ToolShell>
  );
}

/* ── Mentorship timeline (Sections 2, 16–19) ───────────────────────────── */
const ERAS = [
  { y: "Early", t: "Market-maker concepts", d: "Liquidity pools, MM buy/sell models, AMD, equilibrium, liquidity runs.", c: VIOLET, s: 1 },
  { y: "2016–17", t: "Core Content", d: "Structure, liquidity, OTE, OBs, FVGs, P/D, MM models, IPDA, intermarket, time/price, risk — a connected framework.", c: SKY, s: 2 },
  { y: "2020–21", t: "Mentorship bridge", d: "Daily bias, liquidity, OTE/FVG, SMT, session timing, risk. Older language refined into modern execution.", c: GOLD, s: 16 },
  { y: "2022", t: "Core execution sequence", d: "HTF bias → liquidity → sweep → displacement → MSS → FVG → target. The sequence is the model.", c: BULL, s: 17 },
  { y: "2023", t: "Silver Bullet", d: "A time-based trading model: time + liquidity + displacement + FVG. Not 'at this time, buy'.", c: GOLD, s: 18 },
  { y: "2024+", t: "Refinements", d: "CISD, IFVG, NDOG/NWOG, inducement. Refine the core — don't abandon a tested model for every new term.", c: BEAR, s: 19 },
];
export function EraTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      gsap.fromTo("[data-beam]", { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-era]", ref.current).forEach((el) => gsap.from(el, { x: 30, opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="relative pl-8">
      <div className="absolute bottom-0 left-3 top-0 w-px bg-white/10" />
      <div data-beam className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-violet via-gold to-bear" />
      <div className="space-y-4">
        {ERAS.map((e) => (
          <a key={e.y} href={`#ict-s${e.s}`} data-era className="relative block rounded-2xl border border-white/10 bg-panel/80 p-4 transition hover:border-white/30">
            <span className="absolute -left-[26px] top-5 h-3 w-3 rounded-full ring-4 ring-ink" style={{ background: e.c }} />
            <div className="font-mono text-xs font-bold" style={{ color: e.c }}>
              {e.y}
            </div>
            <div className="text-lg font-bold text-white">{e.t}</div>
            <p className="text-sm text-slate-400">{e.d}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── 2026 expansion explorer ───────────────────────────────────────────── */
const TAGS = { core: { l: "Core ICT", c: BULL }, later: { l: "Later term", c: GOLD }, optional: { l: "Advanced / optional", c: VIOLET } } as const;
export function ExpansionExplorer() {
  const [f, setF] = useState<"all" | keyof typeof TAGS>("all");
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ToolShell kicker="2026 EXPANSION" title="The current ICT concept map for XAUUSD" hint="Tap a concept to open it. Filter by how established the term is.">
      <div className="mb-3 flex flex-wrap gap-2">
        <Btn active={f === "all"} onClick={() => setF("all")}>
          All
        </Btn>
        {(Object.keys(TAGS) as (keyof typeof TAGS)[]).map((k) => (
          <Btn key={k} active={f === k} onClick={() => setF(k)}>
            <span className="h-2 w-2 rounded-full" style={{ background: TAGS[k].c }} /> {TAGS[k].l}
          </Btn>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {EXPANSION.map((g) => {
          const items = g.items.filter((it) => f === "all" || it.tag === f);
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <div className="mb-2 font-mono text-xs font-bold text-slate-400">{g.group.toUpperCase()}</div>
              <div className="space-y-1.5">
                {items.map((it) => (
                  <button key={it.t} type="button" onClick={() => setOpen(open === it.t ? null : it.t)} className="block w-full rounded-xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-white/25">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">{it.t}</span>
                      {it.tag && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TAGS[it.tag].c }} />}
                    </div>
                    <AnimatePresence>
                      {open === it.t && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2 text-sm text-slate-300">
                          {it.d}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <div className="mb-2 font-mono text-xs font-bold text-slate-400">F · GOLD-SPECIFIC EXECUTION MODELS</div>
        <div className="grid gap-2 md:grid-cols-2">
          {EXEC_MODELS_2026.map((m) => (
            <div key={m.n} className="rounded-xl border border-gold/20 bg-gold/[0.04] p-3">
              <div className="text-sm font-bold text-gold">
                Model {m.n} — {m.t}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-slate-300">
                {m.seq.map((x, k) => (
                  <span key={x} className="flex items-center gap-1">
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5">{x}</span>
                    {k < m.seq.length - 1 && <span className="text-gold">→</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
