"use client";

import { useEffect, useState } from "react";

/** Aceternity-style meteors. Positions are randomised after mount to avoid hydration mismatch. */
export function Meteors({ number = 14 }: { number?: number }) {
  const [items, setItems] = useState<{ left: number; delay: number; dur: number }[]>([]);
  useEffect(() => {
    setItems(
      Array.from({ length: number }, () => ({
        left: Math.floor(Math.random() * 1400 - 300),
        delay: Math.random() * 5,
        dur: 4 + Math.random() * 6,
      })),
    );
  }, [number]);
  return (
    <>
      {items.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-gold shadow-[0_0_0_1px_#ffffff10] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-gold before:to-transparent before:content-['']"
          style={{ left: m.left, animationDelay: `${m.delay}s`, animationDuration: `${m.dur}s` }}
        />
      ))}
    </>
  );
}
