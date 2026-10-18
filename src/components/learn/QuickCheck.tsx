"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Burst } from "@/components/ui/confetti";
import { XP_PER_CHECK } from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function QuickCheck({
  chapter,
  question,
  options,
  answer,
  explain,
}: {
  chapter: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const { award, complete, done } = useProgress();
  const correct = pick === answer;

  const choose = (i: number) => {
    if (pick === answer) return;
    setPick(i);
    if (i === answer) {
      complete(chapter);
      if (award(`check:${chapter}`, XP_PER_CHECK)) setBurst((b) => b + 1);
    }
  };

  return (
    <div
      data-reveal
      className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/[0.07] to-transparent p-5 sm:p-7"
    >
      {burst > 0 && <Burst key={burst} seed={burst} />}
      <div className="mb-1 flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] text-gold">
        <span>QUICK CHECK · +{XP_PER_CHECK} XP</span>
        {done[chapter] && <span className="text-bull">✓ LEVEL CLEARED</span>}
      </div>
      <p className="mb-5 text-lg font-semibold text-white sm:text-xl">{question}</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((o, i) => {
          const state = pick === null ? "idle" : i === answer && correct ? "right" : pick === i ? "wrong" : "idle";
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.97 }}
              animate={state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => choose(i)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition",
                state === "right" && "border-bull/70 bg-bull/15 text-white",
                state === "wrong" && "border-bear/60 bg-bear/10 text-slate-300",
                state === "idle" && "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/30",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold",
                  state === "right" ? "bg-bull text-ink" : state === "wrong" ? "bg-bear text-ink" : "bg-white/10",
                )}
              >
                {state === "right" ? <Check size={15} /> : state === "wrong" ? <X size={15} /> : "ABCD"[i]}
              </span>
              {o}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {pick !== null && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={cn("mt-4 text-[15px]", correct ? "text-bull" : "text-slate-400")}
          >
            {correct ? explain : "Not quite — try another one. (No penalty. Ever.)"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
