"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { applyCalm } from "./calm";

type State = {
  xp: number;
  done: Record<string, boolean>;
  claimed: Record<string, boolean>;
  focus: boolean;
  calm: boolean;
};

type Ctx = State & {
  award: (key: string, xp: number) => boolean;
  complete: (chapter: string) => void;
  setFocus: (v: boolean) => void;
  setCalm: (v: boolean) => void;
  reset: () => void;
  lastGain: { amount: number; t: number } | null;
};

const KEY = "pa-academy-v1";
const initial: State = { xp: 0, done: {}, claimed: {}, focus: false, calm: false };

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  const [lastGain, setLastGain] = useState<Ctx["lastGain"]>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  useEffect(() => {
    document.documentElement.dataset.calm = state.calm ? "1" : "0";
    applyCalm(state.calm);
  }, [state.calm]);

  const award = useCallback(
    (key: string, xp: number) => {
      if (state.claimed[key]) return false;
      setState((s) => ({ ...s, xp: s.xp + xp, claimed: { ...s.claimed, [key]: true } }));
      setLastGain({ amount: xp, t: Date.now() });
      return true;
    },
    [state.claimed],
  );

  const complete = useCallback((chapter: string) => {
    setState((s) => ({ ...s, done: { ...s.done, [chapter]: true } }));
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        ...state,
        award,
        complete,
        lastGain,
        setFocus: (v) => setState((s) => ({ ...s, focus: v })),
        setCalm: (v) => setState((s) => ({ ...s, calm: v })),
        reset: () => setState(initial),
      }}
    >
      {/* Calm mode also tells Motion to skip transform/layout animations */}
      <MotionConfig reducedMotion={state.calm ? "always" : "user"}>{children}</MotionConfig>
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be inside ProgressProvider");
  return ctx;
}
