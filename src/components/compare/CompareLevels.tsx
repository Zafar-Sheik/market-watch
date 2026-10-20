"use client";

import { Callout, Level } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { CMP_QUIZ, CMP_SECTIONS } from "@/lib/compare";
import { ConfluenceStack, LensCards, LensQuiz, Matrix, PathFinder, Rosetta, Routine, TranslateGame, Venn } from "./Compare";
import { LensChart } from "./LensChart";

const S = (id: string) => CMP_SECTIONS.find((c) => c.id === id)!;
const ACCENT = "#a78bfa";

function Check({ id }: { id: string }) {
  const q = CMP_QUIZ[id];
  return <QuickCheck chapter={id} question={q.q} options={q.options} answer={q.answer} explain={q.explain} />;
}

export function CompareLevels() {
  return (
    <>
      <Level chapter={S("cmp-lenses")} accent={ACCENT} tldr={["Price Action = WHAT price did.", "ICT / SMC = WHERE price is likely going, and WHEN.", "Order Flow = WHO is pushing right now, and whether they're winning."]}>
        <LensCards />
        <Check id="cmp-lenses" />
      </Level>
      <Level chapter={S("cmp-chart")} accent={ACCENT} tldr={["One gold chart. Toggle the lens to see each method's overlay.", "Every step gets three captions — one per lens.", "Watch how they describe the SAME event."]}>
        <div data-reveal className="rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6">
          <LensChart />
        </div>
        <Check id="cmp-chart" />
      </Level>
      <Level chapter={S("cmp-rosetta")} accent={ACCENT} tldr={["Most 'new' concepts are old ideas with new names.", "Support ≈ order block ≈ resting bids / HVN.", "False breakout ≈ liquidity sweep ≈ absorbed stop run."]}>
        <Rosetta />
        <TranslateGame />
        <Check id="cmp-rosetta" />
      </Level>
      <Level chapter={S("cmp-venn")} accent={ACCENT} tldr={["All three agree on the big rules: levels, context, confirmation, risk.", "PA ∩ ICT share structure. ICT ∩ OF share liquidity & aggression.", "Each has one superpower the others don't."]}>
        <Venn />
        <Check id="cmp-venn" />
      </Level>
      <Level chapter={S("cmp-matrix")} accent={ACCENT} tldr={["PA: simplest, works anywhere, less precise.", "ICT: best at direction, targets and timing; easy to over-fit.", "OF: most precise evidence; needs futures data and screen time."]}>
        <Matrix />
        <Callout kind="gold">
          For XAUUSD and US30 CFD traders: PA and ICT work directly on your chart. For order flow, watch COMEX gold (GC/MGC) or CBOT Dow (YM/MYM) futures and map the levels to your CFD.
        </Callout>
        <Check id="cmp-matrix" />
      </Level>
      <Level chapter={S("cmp-path")} accent={ACCENT} tldr={["Pick ONE base lens. Master it.", "Use the others as filters (context) or triggers (timing).", "Your data, schedule and personality decide the base — not hype."]}>
        <PathFinder />
        <Check id="cmp-path" />
      </Level>
      <Level chapter={S("cmp-stack")} accent={ACCENT} tldr={["Context → Location → Trigger. Every layer needs evidence.", "The more lenses agree per layer, the higher the grade.", "If any lens disagrees, skip. That's the edge."]}>
        <ConfluenceStack />
        <Check id="cmp-stack" />
      </Level>
      <Level chapter={S("cmp-quiz")} accent={ACCENT} tldr={["Each lens is a tool for a specific question.", "Use the right tool, not every tool.", "Some questions need all three."]}>
        <LensQuiz />
        <Check id="cmp-quiz" />
      </Level>
      <Level chapter={S("cmp-routine")} accent={ACCENT} tldr={["Plan with PA + ICT before the session.", "Wait for price at the level, inside the time window.", "Let order flow pull the trigger. Review all three after."]}>
        <Routine />
        <Check id="cmp-routine" />
      </Level>
    </>
  );
}
