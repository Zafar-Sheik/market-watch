"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Card with a mouse-following radial glow (Aceternity "card spotlight"). */
export function GlowCard({
  children,
  className,
  color = "rgba(245,196,81,0.13)",
  ...rest
}: { children: React.ReactNode; className?: string; color?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${color}, transparent 75%)`;
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/80 p-5 sm:p-6",
        className,
      )}
      {...rest}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
