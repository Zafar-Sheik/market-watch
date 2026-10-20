"use client";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Search, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Btn } from "@/components/learn/Level";
import { Burst } from "@/components/ui/confetti";
import { FLASHCARDS as ICT_CARDS, GLOSSARY, type Flash } from "@/lib/ict/extras";
import { useProgress } from "@/lib/progress";
import { useLocal } from "@/lib/useLocal";
import { cn } from "@/lib/utils";

const DECKS = ["All", "Terms", "Concepts", "Gold", "Myths"] as const;
type Deck = (typeof DECKS)[number];
const DECK_COLOR: Record<Flash["deck"], string> = { Terms: "#60a5fa", Concepts: "#a78bfa", Gold: "#f5c451", Myths: "#ff4d6d" };

/**
 * Leitner-style flashcards: "Again" sends a card back to box 0, "Got it" promotes it.
 * Box 3 = mastered. Lowest boxes come up first.
 */
export function Flashcards({
  cards: FLASHCARDS = ICT_CARDS,
  storageKey = "ict-flash",
  xpKey = "ict",
  id = "ict-flash",
}: { cards?: Flash[]; storageKey?: string; xpKey?: string; id?: string } = {}) {
  const [boxes, setBoxes] = useLocal<Record<string, number>>(storageKey, {});
  const [deck, setDeck] = useState<Deck>("All");
  const [flipped, setFlipped] = useState(false);
  const [seed, setSeed] = useState(1);
  const [burst, setBurst] = useState(0);
  const { award } = useProgress();

  const queue = useMemo(() => {
    const deckCards = FLASHCARDS.filter((c) => deck === "All" || c.deck === deck);
    const jitter = (id: string) => ((id.charCodeAt(id.length - 1) * 31 + seed * 17) % 97) / 100;
    return [...deckCards].sort((a, b) => (boxes[a.id] ?? 0) + jitter(a.id) - ((boxes[b.id] ?? 0) + jitter(b.id)));
  }, [deck, boxes, seed, FLASHCARDS]);

  const card = queue[0];
  const mastered = FLASHCARDS.filter((c) => (boxes[c.id] ?? 0) >= 3).length;
  const deckMastered = queue.filter((c) => (boxes[c.id] ?? 0) >= 3).length;

  const grade = (ok: boolean) => {
    if (!card) return;
    const nb = ok ? Math.min(3, (boxes[card.id] ?? 0) + 1) : 0;
    const next = { ...boxes, [card.id]: nb };
    setBoxes(next);
    setFlipped(false);
    setSeed((s) => s + 1);
    const m = FLASHCARDS.filter((c) => (next[c.id] ?? 0) >= 3).length;
    if (m >= 20 && award(`${xpKey}:flash20`, 40)) setBurst((b) => b + 1);
    if (m === FLASHCARDS.length && award(`${xpKey}:flashall`, 60)) setBurst((b) => b + 1);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "1") grade(false);
      if (e.key === "2") grade(true);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <div id={id} className="relative rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6">
      {burst > 0 && <Burst key={burst} />}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {DECKS.filter((d) => d === "All" || FLASHCARDS.some((c) => c.deck === d)).map((d) => (
          <Btn
            key={d}
            active={deck === d}
            onClick={() => {
              setDeck(d);
              setFlipped(false);
            }}
          >
            {d}
            <span className="font-mono text-[10px] opacity-60">{d === "All" ? FLASHCARDS.length : FLASHCARDS.filter((c) => c.deck === d).length}</span>
          </Btn>
        ))}
        <div className="ml-auto font-mono text-xs text-slate-400">
          mastered <span className="text-bull">{mastered}</span>/{FLASHCARDS.length}
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div className="h-full bg-gradient-to-r from-violet via-gold to-bull" animate={{ width: `${(deckMastered / Math.max(1, queue.length)) * 100}%` }} />
      </div>

      {card && (
        <div className="mx-auto max-w-2xl">
          <div className="[perspective:1400px]">
            <AnimatePresence mode="wait">
              <motion.button
                key={card.id + seed}
                type="button"
                onClick={() => setFlipped(!flipped)}
                initial={{ opacity: 0, y: 30, rotateZ: -2 }}
                animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.25 }}
                className="relative block h-64 w-full sm:h-72"
              >
                <motion.div className="relative h-full w-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 160, damping: 20 }}>
                  <Face color={DECK_COLOR[card.deck]} label={`${card.deck.toUpperCase()} · box ${boxes[card.id] ?? 0}/3`}>
                    <div className="text-2xl font-black text-white sm:text-3xl">{card.front}</div>
                    <div className="mt-4 font-mono text-xs text-slate-500">tap or press space to flip</div>
                  </Face>
                  <Face color={DECK_COLOR[card.deck]} label="ANSWER" back>
                    <div className="text-lg leading-relaxed text-slate-100 sm:text-xl">{card.back}</div>
                  </Face>
                </motion.div>
              </motion.button>
            </AnimatePresence>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => grade(false)} className="rounded-2xl border-2 border-bear/40 py-3 font-black text-bear transition hover:bg-bear/10">
              Again <span className="font-mono text-xs opacity-60">[1]</span>
            </button>
            <button type="button" onClick={() => grade(true)} className="rounded-2xl border-2 border-bull/40 py-3 font-black text-bull transition hover:bg-bull/10">
              Got it <span className="font-mono text-xs opacity-60">[2]</span>
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <Btn onClick={() => setSeed((s) => s + 7)}>
              <Shuffle size={14} /> Shuffle
            </Btn>
            <Btn onClick={() => setBoxes({})}>
              <RotateCcw size={14} /> Reset progress
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Face({ children, color, label, back }: { children: React.ReactNode; color: string; label: string; back?: boolean }) {
  return (
    <div
      className={cn("absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 p-6 text-center [backface-visibility:hidden]", back && "[transform:rotateY(180deg)]")}
      style={{ borderColor: `${color}66`, background: `linear-gradient(160deg, ${color}1f, #0b0f17 60%)` }}
    >
      <div className="absolute left-4 top-3 font-mono text-[10px] font-bold tracking-widest" style={{ color }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export function Glossary() {
  const [q, setQ] = useState("");
  const list = GLOSSARY.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase()));
  return (
    <div data-reveal className="rounded-3xl border border-white/[0.08] bg-panel/80 p-4 sm:p-6">
      <div className="mb-1 font-mono text-[11px] font-bold tracking-[0.2em] text-gold">2026 TERMINOLOGY GLOSSARY</div>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3">
        <Search size={15} className="text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms… (e.g. CISD, BPR, OTE)" className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600" />
      </div>
      <div className="grid max-h-[420px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
        {list.map(([t, d]) => (
          <div key={t} className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
            <div className="font-mono text-sm font-black text-gold">{t}</div>
            <div className="text-sm text-slate-300">{d}</div>
          </div>
        ))}
        {!list.length && <div className="text-sm text-slate-500">No match.</div>}
      </div>
    </div>
  );
}
