"use client";

import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

/** Aceternity-style "text generate" – words fade up one by one when scrolled into view. */
export function TextGenerate({ words, className }: { words: string; className?: string }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true });
  useEffect(() => {
    if (inView) {
      animate("span", { opacity: 1, filter: "blur(0px)", y: 0 }, { duration: 0.5, delay: stagger(0.06) });
    }
  }, [inView, animate]);
  return (
    <div ref={scope} className={cn(className)}>
      {words.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className="inline-block opacity-0"
          style={{ filter: "blur(8px)", transform: "translateY(8px)" }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </div>
  );
}
