"use client";

import gsap from "gsap";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Btn } from "./Level";

export type Step = { at: number; title: string; text: string; color?: string };

/**
 * Step-through narrator for chart playback. Each step reveals candles up to `at`
 * using a GSAP tween so new candles "print" one by one.
 */
export function usePlayer(steps: Step[], start = 0) {
  const [step, setStep] = useState(start);
  const [visible, setVisible] = useState(steps[start]?.at ?? 0);
  const [playing, setPlaying] = useState(false);
  const obj = useRef({ v: steps[start]?.at ?? 0 });
  const tween = useRef<gsap.core.Tween | null>(null);

  const goto = useCallback(
    (s: number) => {
      const target = steps[s].at;
      tween.current?.kill();
      const calm = typeof document !== "undefined" && document.documentElement.dataset.calm === "1";
      const back = target < obj.current.v;
      if (back || calm) {
        obj.current.v = target;
        setVisible(target);
      } else {
        tween.current = gsap.to(obj.current, {
          v: target,
          duration: Math.min(2.2, Math.max(0.3, (target - obj.current.v) * 0.09)),
          ease: "none",
          onUpdate: () => setVisible(Math.round(obj.current.v)),
        });
      }
      setStep(s);
    },
    [steps],
  );

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => goto(step + 1), 2600);
    return () => clearTimeout(t);
  }, [playing, step, steps.length, goto]);

  useEffect(() => () => void tween.current?.kill(), []);

  return { step, visible, playing, setPlaying, goto, total: steps.length, current: steps[step] };
}

export function PlayerControls({ p, steps }: { p: ReturnType<typeof usePlayer>; steps: Step[] }) {
  const s = steps[p.step];
  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-1.5">
        {steps.map((st, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Step ${i + 1}: ${st.title}`}
            onClick={() => p.goto(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= p.step ? "bg-gold" : "bg-white/10 hover:bg-white/25",
            )}
          />
        ))}
      </div>
      <div className="min-h-[92px] rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-1 font-mono text-[11px] font-bold tracking-[0.18em]" style={{ color: s.color ?? "#f5c451" }}>
          STEP {p.step + 1}/{steps.length} · {s.title.toUpperCase()}
        </div>
        <p className="text-[15px] leading-relaxed text-slate-200">{s.text}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => p.goto(Math.max(0, p.step - 1))} disabled={p.step === 0}>
          <SkipBack size={15} /> Back
        </Btn>
        <Btn onClick={() => p.goto(Math.min(steps.length - 1, p.step + 1))} disabled={p.step === steps.length - 1} active>
          Next <SkipForward size={15} />
        </Btn>
        <Btn onClick={() => p.setPlaying(!p.playing)}>
          {p.playing ? <Pause size={15} /> : <Play size={15} />} {p.playing ? "Pause" : "Autoplay"}
        </Btn>
        <Btn
          onClick={() => {
            p.setPlaying(false);
            p.goto(0);
          }}
        >
          <RotateCcw size={15} /> Restart
        </Btn>
      </div>
    </div>
  );
}
