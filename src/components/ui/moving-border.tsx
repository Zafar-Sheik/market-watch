"use client";

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Aceternity "moving border" button – a glowing dot that orbits the button outline. */
export function MovingBorderButton({
  children,
  className,
  duration = 3000,
  as: Tag = "button",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  as?: "button" | "a";
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tag
      className="relative inline-block overflow-hidden rounded-2xl bg-transparent p-[1.5px] text-lg"
      {...(rest as Record<string, unknown>)}
    >
      <div className="absolute inset-0 rounded-2xl">
        <MovingBorder duration={duration} rx="16" ry="16">
          <div className="h-20 w-20 bg-[radial-gradient(#f5c451_40%,transparent_60%)] opacity-90" />
        </MovingBorder>
      </div>
      <div
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-[15px] border border-white/10 bg-ink/90 px-6 py-3.5 font-semibold text-white backdrop-blur-xl",
          className,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

function MovingBorder({
  children,
  duration,
  rx,
  ry,
}: {
  children: React.ReactNode;
  duration: number;
  rx: string;
  ry: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);
  useAnimationFrame((time) => {
    const len = pathRef.current?.getTotalLength();
    if (len) progress.set((time * (len / duration)) % len);
  });
  const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).x ?? 0);
  const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;
  return (
    <>
      <svg preserveAspectRatio="none" className="absolute h-full w-full" width="100%" height="100%">
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>
        {children}
      </motion.div>
    </>
  );
}
