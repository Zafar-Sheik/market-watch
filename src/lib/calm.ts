"use client";

import gsap from "gsap";

/**
 * Calm mode: most motion on the site is JavaScript (GSAP, Motion) or SVG <animate>,
 * which CSS alone can't stop. Finish one-off tweens instantly (so nothing is left
 * half-revealed), pause looping ones, and pause SVG animations.
 */
let watcher: MutationObserver | null = null;

export function applyCalm(on: boolean) {
  if (typeof document === "undefined") return;
  for (const t of gsap.globalTimeline.getChildren(true, true, false)) {
    const looping = (t as gsap.core.Tween).repeat?.() === -1;
    if (on) {
      if (looping) t.pause();
      else if (!t.scrollTrigger || !(t.scrollTrigger.vars.scrub ?? false)) t.progress(1);
    } else if (looping) t.resume();
  }
  document.querySelectorAll("svg").forEach((s) => (on ? s.pauseAnimations?.() : s.unpauseAnimations?.()));
  // charts mount new SVGs as you scroll / switch tabs — keep pausing those too
  watcher?.disconnect();
  watcher = null;
  if (on) {
    let queued = false;
    watcher = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        document.querySelectorAll("svg").forEach((s) => s.pauseAnimations?.());
      });
    });
    watcher.observe(document.body, { childList: true, subtree: true });
  }
}

export const isCalm = () => typeof document !== "undefined" && document.documentElement.dataset.calm === "1";
