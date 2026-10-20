import type { Chapter } from "@/lib/chapters";

export type LensKey = "pa" | "ict" | "of";
export const LENSES: Record<LensKey, { name: string; short: string; color: string; asks: string; reads: string; emoji: string; href: string }> = {
  pa: { name: "Price Action", short: "PA", color: "#f5c451", asks: "WHAT did price do?", reads: "Candles, swings, support/resistance, patterns.", emoji: "🕯️", href: "/" },
  ict: { name: "ICT / SMC", short: "ICT", color: "#a78bfa", asks: "WHERE is price going, and WHEN?", reads: "Liquidity, dealing ranges, PD arrays, time/sessions, narrative.", emoji: "🎯", href: "/ict-gold" },
  of: { name: "Order Flow", short: "OF", color: "#60a5fa", asks: "WHO is doing it right now?", reads: "Executed volume, delta, footprint, DOM, profile, VWAP.", emoji: "🔬", href: "/order-flow" },
};

export const CMP_SECTIONS: Chapter[] = [
  { id: "cmp-lenses", num: "C1", title: "One Market, Three Lenses", short: "Lenses", minutes: 2 },
  { id: "cmp-chart", num: "C2", title: "Same Chart, Three Stories", short: "Same chart", minutes: 5 },
  { id: "cmp-rosetta", num: "C3", title: "The Rosetta Stone", short: "Translate", minutes: 4 },
  { id: "cmp-venn", num: "C4", title: "Where They Agree (and Don't)", short: "Venn", minutes: 3 },
  { id: "cmp-matrix", num: "C5", title: "Head-to-Head", short: "Compare", minutes: 3 },
  { id: "cmp-path", num: "C6", title: "Which Lens Fits You?", short: "Your path", minutes: 2 },
  { id: "cmp-stack", num: "C7", title: "The Confluence Stack", short: "Stack", minutes: 4 },
  { id: "cmp-quiz", num: "C8", title: "Pick the Right Lens", short: "Quiz", minutes: 3 },
  { id: "cmp-routine", num: "C9", title: "The Combined Gold & US30 Routine", short: "Routine", minutes: 3 },
];

/** The same market event, named three ways. */
export const ROSETTA: { event: string; pa: string; ict: string; of: string; why: string }[] = [
  {
    event: "A level price keeps reacting to",
    pa: "Support / resistance, supply & demand zone",
    ict: "Order block, PD array, liquidity pool (BSL/SSL)",
    of: "Resting limit orders, HVN, POC / VAH / VAL",
    why: "All three describe a price where a lot of orders sit or did business before. PA sees the reactions, ICT names the institutional footprint, order flow can see the orders/volume themselves.",
  },
  {
    event: "Price pokes through a level and snaps back",
    pa: "False breakout, pin bar, failed break",
    ict: "Liquidity sweep / raid, Judas swing, turtle soup",
    of: "Stop run: volume + delta spike, then absorption, trapped traders",
    why: "Stops are market orders. The poke triggers them (OF sees the burst), takes the liquidity (ICT), and leaves a wick (PA).",
  },
  {
    event: "A strong, fast move that breaks a swing",
    pa: "Breakout, momentum/marubozu candle, break of structure",
    ict: "Displacement, MSS / CISD / BOS",
    of: "Initiative buying/selling, big delta, stacked imbalances",
    why: "One side is aggressive enough to eat through the other side's orders across many prices.",
  },
  {
    event: "A gap left behind by that move",
    pa: "Momentum gap / thin area, retest zone",
    ict: "Fair Value Gap (FVG), BISI / SIBI, CE",
    of: "Low-volume node, single prints, imbalance zone",
    why: "Price moved so fast little two-way trade happened. All three expect price may revisit and react there.",
  },
  {
    event: "Buying the pullback",
    pa: "Break-and-retest, pullback to the 50%, confirmation candle",
    ict: "Retrace into FVG/OB in discount, OTE 62–79%",
    of: "Pullback on weak opposing delta into imbalance/LVN/VWAP",
    why: "Every lens prefers entering on a retracement into a level, not chasing the breakout candle.",
  },
  {
    event: "A sideways range",
    pa: "Range / consolidation, inside bars",
    ict: "Accumulation, dealing range, equilibrium",
    of: "Balance, value area, two-way auction around POC",
    why: "Buyers and sellers agree on value. All three expect an eventual expansion out of it.",
  },
  {
    event: "A trend",
    pa: "HH/HL or LH/LL structure",
    ict: "Distribution / expansion toward the draw on liquidity",
    of: "Imbalance: price moving away from value, CVD trending, holding above/below VWAP",
    why: "One side keeps winning and the market keeps finding new value.",
  },
  {
    event: "The move is running out of gas",
    pa: "Doji, shrinking candles, wicks at the extreme",
    ict: "Price reaching the DOL / premium, SMT divergence",
    of: "Exhaustion: fading delta, CVD divergence, absorption at the extreme",
    why: "Fewer aggressive participants are pushing; the opposite side starts winning.",
  },
  {
    event: "The best time to trade",
    pa: "When price is at a level (time-agnostic)",
    ict: "Killzones, Silver Bullet windows, session opens",
    of: "When volume is high (opens, news) — liquidity & participation",
    why: "ICT and order flow both point at the same windows: London open, NY open, data releases.",
  },
  {
    event: "Where the stop goes",
    pa: "Beyond the pattern / level",
    ict: "Beyond the sweep / invalidation",
    of: "Beyond the absorption or imbalance that justified the trade",
    why: "Every lens puts the stop where the reason for the trade is proven wrong.",
  },
];

export type Region = "pa" | "ict" | "of" | "pa-ict" | "ict-of" | "pa-of" | "all";
export const VENN: Record<Region, { title: string; items: string[] }> = {
  all: {
    title: "All three agree",
    items: [
      "Price moves between levels where orders/liquidity concentrate.",
      "Context first (higher timeframe), trigger last.",
      "Wait for confirmation — never trade the level alone.",
      "Enter on pullbacks, not chases.",
      "Stops beyond the invalidation; targets at the next level/liquidity.",
      "Risk management and a journal decide whether you survive.",
    ],
  },
  "pa-ict": {
    title: "Price Action ∩ ICT",
    items: ["Market structure (HH/HL, BOS/CHoCH ≈ MSS).", "Support/resistance ≈ order blocks & breakers.", "Candles as confirmation at a level.", "Fibonacci retracements (50% / OTE)."],
  },
  "ict-of": {
    title: "ICT ∩ Order Flow",
    items: ["Stops = liquidity = market orders waiting.", "Displacement ≈ aggressive initiative + imbalance.", "FVG ≈ low-volume / imbalance zone.", "Session timing matters: opens & news bring participation.", "Both think in terms of institutions and trapped traders."],
  },
  "pa-of": {
    title: "Price Action ∩ Order Flow",
    items: ["Volume confirms breakouts; low volume warns of fakes.", "Wicks = rejection ≈ absorption.", "Range ≈ balance; breakout ≈ imbalance.", "Levels from the past matter."],
  },
  pa: { title: "Only Price Action", items: ["Works on ANY chart, any broker, no special data.", "Simplest to learn and fastest to apply.", "Candlestick patterns as a language."] },
  ict: { title: "Only ICT / SMC", items: ["Time-based models: killzones, Silver Bullet, macros.", "Narrative tools: daily bias, DOL, IPDA ranges, MMXM.", "PD-array vocabulary (OTE, CE, BPR, IFVG…).", "Intermarket SMT (Gold vs Silver)."] },
  of: { title: "Only Order Flow", items: ["Sees actual transactions: who's aggressive, who's absorbing.", "Real-time evidence (delta, footprint, DOM, tape).", "Volume profile & VWAP as objective value.", "Needs centralised data (futures: GC/MGC, YM/MYM)."] },
};

export const MATRIX: { dim: string; pa: [number, string]; ict: [number, string]; of: [number, string] }[] = [
  { dim: "Beginner-friendly", pa: [5, "Candles + levels. Day one."], ict: [2, "Lots of vocabulary, many models."], of: [2, "New tools & concepts to learn."] },
  { dim: "Data you need", pa: [5, "Any chart."], ict: [5, "Any chart (+ a clock)."], of: [2, "Futures data & a footprint/DOM platform."] },
  { dim: "Works on XAUUSD / US30 CFDs", pa: [5, "Fully."], ict: [5, "Fully."], of: [2, "Only via futures (GC/MGC, YM/MYM) mapped to the CFD."] },
  { dim: "Tells you direction / target", pa: [3, "Structure & levels."], ict: [5, "Daily bias + draw on liquidity."], of: [2, "Mostly short-term intent."] },
  { dim: "Precision of entry timing", pa: [3, "Candle closes."], ict: [4, "MSS + FVG on LTF."], of: [5, "Tick-level evidence of absorption/initiative."] },
  { dim: "Objectivity (less hindsight)", pa: [3, "Patterns can be subjective."], ict: [2, "Easy to 'see' setups after the fact."], of: [4, "Numbers are numbers — interpretation still needed."] },
  { dim: "ADHD-friendliness", pa: [5, "Simple, visual, few rules."], ict: [3, "Great stories; risk of model-hopping."], of: [3, "Exciting but fast/noisy — needs strict filters."] },
  { dim: "Screen time needed", pa: [4, "Can trade on candle closes."], ict: [3, "Specific windows."], of: [2, "Needs live attention at the level."] },
];

export const PRIORITIES = [
  { k: "simple", label: "Keep it simple", w: { pa: 3, ict: 0, of: 0 } },
  { k: "cfd", label: "I only trade CFDs (no futures data)", w: { pa: 2, ict: 2, of: -3 } },
  { k: "target", label: "I want a daily direction & target", w: { pa: 1, ict: 3, of: 0 } },
  { k: "timing", label: "I want sniper entries", w: { pa: 0, ict: 1, of: 3 } },
  { k: "time", label: "I trade the opens (London / NY)", w: { pa: 0, ict: 2, of: 2 } },
  { k: "little", label: "I have limited screen time", w: { pa: 3, ict: 1, of: -2 } },
  { k: "proof", label: "I want hard evidence, not stories", w: { pa: 0, ict: -1, of: 3 } },
  { k: "news", label: "I like trading news volatility", w: { pa: -1, ict: 2, of: 2 } },
] as const;

export const STACK: { lens: LensKey; layer: "Context" | "Location" | "Trigger"; t: string; w: number }[] = [
  { lens: "pa", layer: "Context", t: "HTF structure agrees (HH/HL for longs)", w: 2 },
  { lens: "ict", layer: "Context", t: "Daily bias + clear draw on liquidity", w: 2 },
  { lens: "ict", layer: "Context", t: "Inside a killzone / session open", w: 1 },
  { lens: "pa", layer: "Location", t: "At a marked S/R or demand zone", w: 2 },
  { lens: "ict", layer: "Location", t: "Liquidity swept + price in discount / FVG / OB", w: 2 },
  { lens: "of", layer: "Location", t: "At a profile edge / POC / VWAP", w: 1 },
  { lens: "pa", layer: "Trigger", t: "Confirmation candle closed (engulfing / pin bar)", w: 1 },
  { lens: "ict", layer: "Trigger", t: "MSS / CISD with displacement", w: 2 },
  { lens: "of", layer: "Trigger", t: "Absorption then delta flip in your direction", w: 2 },
];

export const LENS_QUIZ: { q: string; a: LensKey | "all"; why: string }[] = [
  { q: "“Is someone big defending this low RIGHT NOW?”", a: "of", why: "Only order flow sees live absorption, icebergs and delta at the level." },
  { q: "“Where is gold most likely trying to go today?”", a: "ict", why: "Daily bias + draw on liquidity is ICT's core question." },
  { q: "“Did that candle close as a pin bar at support?”", a: "pa", why: "Classic price action — readable on any chart." },
  { q: "“Should I even be looking for trades at 12:40 New York?”", a: "ict", why: "Time-based thinking: killzones and lunch chop. (Order flow agrees: volume is low.)" },
  { q: "“Was that breakout real or a stop run?”", a: "all", why: "PA: did it close back inside? ICT: was liquidity swept then MSS? OF: was the volume burst absorbed? Best answered by all three." },
  { q: "“Is US30 trading above or below today's average price?”", a: "of", why: "That's VWAP — an order-flow / volume tool." },
  { q: "“Is price in premium or discount of the dealing range?”", a: "ict", why: "Premium/discount is an ICT location filter (PA's version is 'buy low in the range')." },
  { q: "“Is the trend still making higher highs and higher lows?”", a: "pa", why: "Market structure — price action's bread and butter." },
  { q: "“Where's the fairest price of the last two days?”", a: "of", why: "Volume profile POC." },
  { q: "“Where should my stop go?”", a: "all", why: "Every lens: beyond the thing that proves you wrong (pattern, sweep, absorption)." },
];

export const ROUTINE = [
  { when: "Weekend / pre-week", pa: "Mark weekly structure & major S/R.", ict: "Weekly bias, PWH/PWL, major PD arrays, IPDA ranges.", of: "Weekly/composite profile: POC, VAH, VAL, LVNs." },
  { when: "Pre-session (15 min)", pa: "Daily structure, PDH/PDL, the one level you care about.", ict: "Daily bias + DOL, Asian range, killzone & Silver Bullet times, news.", of: "Prior day POC/VA, overnight high/low, anchor VWAP (London or 9:30 ET)." },
  { when: "Wait", pa: "Price must reach your level. No level = no trade.", ict: "Wait for the liquidity raid in the time window.", of: "Watch delta/footprint ONLY at the level — ignore the noise elsewhere." },
  { when: "Trigger", pa: "Confirmation candle closes.", ict: "Displacement + MSS, FVG forms.", of: "Absorption → delta flip / initiative in your direction." },
  { when: "Execute", pa: "Enter on close or retest.", ict: "Enter at FVG/OB/OTE retrace.", of: "Enter when the order-flow trigger prints; stop beyond the absorption." },
  { when: "Manage", pa: "Target next S/R; 2R minimum.", ict: "TP1 internal liquidity → TP2 PDH/PDL → TP3 external DOL.", of: "Scale at VWAP / POC / HVN; exit if delta flips hard against you." },
  { when: "Review", pa: "Screenshot + journal.", ict: "Did the narrative play out? Grade the process.", of: "Was the order-flow evidence real (futures) or a CFD tick-volume illusion?" },
];

export const CMP_QUIZ: Record<string, { q: string; options: string[]; answer: number; explain: string }> = {
  "cmp-lenses": { q: "Which lens is built to answer “WHO is aggressive right now?”", options: ["Price Action", "ICT / SMC", "Order Flow", "None"], answer: 2, explain: "Order flow reads executed transactions — the who and how hard." },
  "cmp-chart": { q: "In the replay, what did ICT call the event PA saw as a pin-bar rejection below support?", options: ["Displacement", "A liquidity sweep of SSL", "A breaker", "A premium array"], answer: 1, explain: "Same wick, two names: PA's rejection = ICT's sweep = order flow's absorbed stop run." },
  "cmp-rosetta": { q: "ICT's Fair Value Gap is closest to which order-flow idea?", options: ["POC", "A low-volume / imbalance zone", "VWAP", "An iceberg"], answer: 1, explain: "Both describe price that moved so fast little two-way trade happened." },
  "cmp-venn": { q: "Which belief is shared by ALL three lenses?", options: ["Killzones are essential", "Footprints are essential", "Context first, wait for confirmation at a level", "Candle patterns work anywhere"], answer: 2, explain: "Every lens: level/context first, confirmation second, risk always." },
  "cmp-matrix": { q: "You trade XAUUSD on a CFD broker with no futures data. Which lens is weakest for you?", options: ["Price Action", "ICT", "Order Flow", "They're equal"], answer: 2, explain: "Real order flow needs centralised data (GC/MGC). CFD tick volume is only a proxy." },
  "cmp-path": { q: "What's the most sensible way to combine the lenses?", options: ["Use all tools on every trade", "Pick one base lens, add others as filters/triggers", "Switch lens after every loss", "Never combine"], answer: 1, explain: "A base lens keeps you consistent; the others add confluence. Model-hopping kills consistency." },
  "cmp-stack": { q: "PA and ICT both say long, but order flow shows heavy absorption of buyers at your entry. Best move?", options: ["Double size", "Go long anyway", "Skip or wait — a lens disagrees", "Short immediately"], answer: 2, explain: "Conflict = not a clean trade. Wait for the disagreement to resolve." },
  "cmp-quiz": { q: "“Is price in premium or discount?” is primarily an … question.", options: ["Order flow", "ICT", "Price action", "Macro"], answer: 1, explain: "Premium/discount of a dealing range is ICT's location filter." },
  "cmp-routine": { q: "In the combined routine, when should you look at the footprint/delta?", options: ["All day, every tick", "Only when price reaches your pre-planned level", "Never", "Only after the trade"], answer: 1, explain: "Order flow is the trigger at the level. Watching it everywhere is noise (and exhausting)." },
};

/** quick checks + chart replay + translate + stack + lens quiz */
export const CMP_XP_TOTAL = Object.keys(CMP_QUIZ).length * 50 + 20 + 30 + 20 + 40;
