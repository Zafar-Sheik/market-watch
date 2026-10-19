"use client";

import { useState } from "react";
import { Btn, Callout, Level } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { MODULES, QUIZ, REFERENCES, type Module } from "@/lib/ict/extras";
import { sectionByN } from "@/lib/ict/sections";
import { Glossary } from "./Flashcards";
import { EraTimeline, ExpansionExplorer, GateWalk, LiquiditySorter, MythBuster, ProcessMatrix, SequenceBuilder } from "./Games";
import { SectionCard } from "./SectionCard";
import { STUDY_META, StudyChart, type StudyVariant } from "./StudyChart";
import { BacktestJournal, BiasBuilder, DealingRange, GoldChecklist, MacroMeter, Playbook, PositionDrill, SilverBulletClock, ToolShell } from "./Tools";

const mod = (id: string) => MODULES.find((m) => m.id === id)!;

function Sec({ n, m, children }: { n: number; m: Module; children?: React.ReactNode }) {
  return (
    <SectionCard s={sectionByN(n)} accent={m.color}>
      {children}
    </SectionCard>
  );
}

function Check({ m }: { m: Module }) {
  const q = QUIZ[m.id];
  return <QuickCheck chapter={m.id} question={q.q} options={q.options} answer={q.answer} explain={q.explain} />;
}

/** Tabbed replays of the course's study charts. */
export function ChartLab({ variants, kicker = "CHART REPLAY", labels }: { variants: StudyVariant[]; kicker?: string; labels?: string[] }) {
  const [v, setV] = useState(variants[0]);
  return (
    <ToolShell kicker={kicker} title="Read it in order" hint="Step through each annotated XAUUSD study chart: context → sweep → displacement → MSS/FVG → entry → target.">
      {variants.length > 1 && (
        <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {variants.map((x, i) => (
            <Btn key={x} active={x === v} onClick={() => setV(x)} className="shrink-0">
              {labels?.[i] ?? `Chart ${STUDY_META[x].n}`}
            </Btn>
          ))}
        </div>
      )}
      <StudyChart key={v} variant={v} />
    </ToolShell>
  );
}

export function ICTModules() {
  return (
    <>
      {/* M1 */}
      <Level
        chapter={mod("ict-foundations")}
        accent={mod("ict-foundations").color}
        tldr={[
          "Treat highs and lows as liquidity pools — not just support/resistance.",
          "Market Maker models: accumulation → manipulation (raid) → displacement → distribution to the opposing pool.",
          "IPDA is a framework for time, price and liquidity — not a literal revealed bank algorithm.",
        ]}
      >
        <Sec n={1} m={mod("ict-foundations")} />
        <Sec n={2} m={mod("ict-foundations")} />
        <Sec n={3} m={mod("ict-foundations")} />
        <Check m={mod("ict-foundations")} />
      </Level>

      {/* M2 */}
      <Level
        chapter={mod("ict-liquidity")}
        accent={mod("ict-liquidity").color}
        tldr={["BSL rests above highs (PDH, PWH, equal highs). SSL rests below lows (PDL, PWL, equal lows).", "IRL sits inside the range; ERL sits beyond it. The DOL is where your narrative expects price to go.", "Sweep ≠ automatic entry. Liquidity is a location, not a trigger."]}
      >
        <Sec n={5} m={mod("ict-liquidity")} />
        <LiquiditySorter />
        <ChartLab variants={["irl"]} />
        <Check m={mod("ict-liquidity")} />
      </Level>

      {/* M3 */}
      <Level
        chapter={mod("ict-structure")}
        accent={mod("ict-structure").color}
        tldr={["Weekly/Daily = major structure. 4H/1H = dealing range. 15M–1M = execution.", "Bullish MSS: SSL → sweep → displacement → break of short-term high.", "On Gold, demand displacement — volatility can fake structure shifts."]}
      >
        <Sec n={4} m={mod("ict-structure")} />
        <ChartLab variants={["bull", "bear"]} labels={["Visual Ex. 1 · Bullish", "Visual Ex. 2 · Bearish"]} />
        <Callout kind="pro">
          <b>CISD</b> (Change in State of Delivery) refines structure analysis: liquidity raid → strong displacement → change in delivery → retracement into an aligned array. <b>Displacement</b> = aggressive repricing with range expansion and an obvious break of a relevant swing.{" "}
          <b>Inducement</b> = obvious short-term liquidity inside the range that pulls traders in before the larger objective. Don&apos;t label every minor swing as inducement.
        </Callout>
        <Check m={mod("ict-structure")} />
      </Level>

      {/* M4 */}
      <Level
        chapter={mod("ict-pdarrays")}
        accent={mod("ict-pdarrays").color}
        tldr={["Premium/discount only means something inside a valid dealing range + narrative.", "OTE = 62–79% (70.5% reference). FVG CE = 50% of the gap. All are LOCATIONS.", "OBs and breakers need a reason to matter: liquidity, displacement, structure."]}
      >
        <Sec n={6} m={mod("ict-pdarrays")} />
        <DealingRange />
        <Sec n={7} m={mod("ict-pdarrays")} />
        <ChartLab variants={["oteLong", "oteShort"]} labels={["Chart 4 · OTE long", "Chart 5 · OTE short"]} />
        <Sec n={8} m={mod("ict-pdarrays")} />
        <Sec n={9} m={mod("ict-pdarrays")} />
        <Sec n={10} m={mod("ict-pdarrays")} />
        <Check m={mod("ict-pdarrays")} />
      </Level>

      {/* M5 */}
      <Level
        chapter={mod("ict-time")}
        accent={mod("ict-time").color}
        tldr={["AMD: Asia accumulates → London manipulates → NY distributes (study sequence, not every day).", "Judas Swing: the first big session move may be the trap — confirm it failed first.", "Silver Bullet: 03–04, 10–11, 14–15 NY. Time filters; liquidity + displacement + FVG set up."]}
      >
        <SilverBulletClock />
        <Sec n={11} m={mod("ict-time")} />
        <Sec n={12} m={mod("ict-time")} />
        <Sec n={13} m={mod("ict-time")} />
        <ChartLab variants={["asia", "sbLong", "sbShort"]} labels={["Chart 3 · Asia raid", "Chart 6 · SB long", "Chart 7 · SB short"]} />
        <Sec n={18} m={mod("ict-time")} />
        <Check m={mod("ict-time")} />
      </Level>

      {/* M6 */}
      <Level
        chapter={mod("ict-bias")}
        accent={mod("ict-bias").color}
        tldr={["Daily bias = the most probable narrative today. It's conditional, not a prediction.", "DOL = where price is likely trying to go (PDH, PWH, equal highs… or the lows).", "MMXM organises nested dealing ranges — for narrative and targets, not entries."]}
      >
        <Sec n={14} m={mod("ict-bias")} />
        <BiasBuilder />
        <Sec n={20} m={mod("ict-bias")} />
        <Check m={mod("ict-bias")} />
      </Level>

      {/* M7 */}
      <Level
        chapter={mod("ict-macro")}
        accent={mod("ict-macro").color}
        tldr={["Gold/Silver SMT: one makes a new extreme, the other doesn't — at liquidity, it's a clue.", "DXY, real yields, Fed, central banks, geopolitics = context. Not entries.", "News provides volatility. Don't chase the first spike — wait for the ICT sequence."]}
      >
        <Sec n={15} m={mod("ict-macro")} />
        <ChartLab variants={["smt"]} />
        <Sec n={21} m={mod("ict-macro")} />
        <Sec n={22} m={mod("ict-macro")} />
        <MacroMeter />
        <Check m={mod("ict-macro")} />
      </Level>

      {/* M8 */}
      <Level
        chapter={mod("ict-eras")}
        accent={mod("ict-eras").color}
        tldr={["Study continuity: modern models reorganise older concepts.", "2022's core: HTF bias → liquidity → sweep → displacement → MSS → FVG → target.", "Later terms (CISD, IFVG, NDOG/NWOG) refine — they don't replace a tested core."]}
      >
        <EraTimeline />
        <Sec n={16} m={mod("ict-eras")} />
        <Sec n={17} m={mod("ict-eras")} />
        <Sec n={19} m={mod("ict-eras")} />
        <Check m={mod("ict-eras")} />
      </Level>

      {/* M9 */}
      <Level
        chapter={mod("ict-execution")}
        accent={mod("ict-execution").color}
        tldr={["Seven study models (A–G). Pick ONE, define exact rules, collect 50–100 samples.", "Each timeframe answers a different question. Don't let the 1M override the Daily.", "Stops beyond invalidation; targets at internal then external liquidity."]}
      >
        <Sec n={23} m={mod("ict-execution")} />
        <ChartLab
          kicker="MODEL LAB"
          variants={["bull", "bear", "asia", "oteLong", "smt", "sbLong"]}
          labels={["A · PDL sweep long", "B · PDH sweep short", "C · Asian low raid", "E · OTE reversal", "F · SMT reversal", "G · Silver Bullet"]}
        />
        <Sec n={24} m={mod("ict-execution")} />
        <Sec n={25} m={mod("ict-execution")} />
        <GateWalk />
        <Sec n={26} m={mod("ict-execution")} />
        <Check m={mod("ict-execution")} />
      </Level>

      {/* M10 */}
      <Level
        chapter={mod("ict-risk")}
        accent={mod("ict-risk").color}
        tldr={["Test 0.25–0.5% risk per trade. Risk first, size from the stop second.", "Good process + losing trade = acceptable. Bad process + winning trade = dangerous.", "Every sweep reverses, every FVG fills, OTE guarantees… — all FALSE."]}
      >
        <Sec n={27} m={mod("ict-risk")} />
        <PositionDrill />
        <Sec n={28} m={mod("ict-risk")} />
        <ProcessMatrix />
        <Sec n={29} m={mod("ict-risk")} />
        <MythBuster />
        <Check m={mod("ict-risk")} />
      </Level>

      {/* M11 */}
      <Level
        chapter={mod("ict-system")}
        accent={mod("ict-system").color}
        tldr={["The entry is the final step, not the starting point.", "Use the smallest set of concepts that makes a clear, testable, repeatable model.", "No clear bias / DOL / raid / displacement / R:R = no trade."]}
      >
        <Sec n={30} m={mod("ict-system")} />
        <SequenceBuilder />
        <ChartLab variants={["playLong", "playShort", "noTrade"]} labels={["Chart 10 · Long playbook", "Chart 11 · Short playbook", "Chart 12 · No-trade"]} />
        <Playbook />
        <GoldChecklist />
        <Check m={mod("ict-system")} />
      </Level>

      {/* M12 */}
      <Level
        chapter={mod("ict-lab")}
        accent={mod("ict-lab").color}
        tldr={["2026 terms (CISD, IFVG, BPR, Reaper…) are refinements — master liquidity, FVG, displacement and MSS first.", "Price vacuum: at new highs, let liquidity and delivery draw the map. Reduce size.", "Judge a model by a real sample, not screenshots."]}
      >
        <ExpansionExplorer />
        <BacktestJournal />
        <Glossary />
        <div data-reveal className="rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6">
          <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">REFERENCES & UPDATE NOTES</div>
          <ul className="space-y-1.5 text-sm text-slate-400">
            {REFERENCES.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
        <Check m={mod("ict-lab")} />
      </Level>
    </>
  );
}
