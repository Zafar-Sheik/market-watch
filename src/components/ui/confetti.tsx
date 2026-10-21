"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { useProgress } from "@/lib/progress";

const COLORS = ["#f5c451", "#2ee6a6", "#60a5fa", "#a78bfa", "#ff4d6d"];

/** Tiny dopamine burst. Render it conditionally; it animates once. */
export function Burst({ seed = 1 }: { seed?: number }) {
  const calm = useProgress().calm;
  const parts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + seed;
        const d = 50 + ((i * 37 + seed * 13) % 60);
        return { x: Math.cos(a) * d, y: Math.sin(a) * d - 20, c: COLORS[i % COLORS.length], r: (i * 47) % 360 };
      }),
    [seed],
  );
  if (calm) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block h-2 w-1.5 rounded-sm"
          style={{ background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y + 40, opacity: 0, rotate: p.r, scale: 0.6 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
