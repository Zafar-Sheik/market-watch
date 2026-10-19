import type { Chapter } from "@/lib/chapters";

/* ── Course intro ("How to use this book") ─────────────────────────────── */
export const INTRO = {
  order: ["Foundations", "Liquidity", "Structure", "PD arrays", "Time / session models", "Daily bias / DOL", "Intermarket context", "Gold-specific execution", "Risk", "Backtesting"],
  principle:
    "A setup is strongest when context, location, liquidity, time, displacement, structure and risk all agree. No single ICT concept is a guarantee.",
  note2026:
    "Current third-party ICT-focused educational material commonly includes concepts such as CISD, IFVG, BPR and newer model terminology. They're included here with a clear distinction between established ICT framework concepts and later/third-party labels.",
  disclaimer:
    "ICT concepts are educational material. Gold-specific combinations and scoring systems here are study frameworks, not a claim of an official ICT “Gold Strategy”. Trading leveraged products involves substantial risk.",
};

/* ── Modules (the ICT Gold "levels") ───────────────────────────────────── */
export type Module = Chapter & { sections: number[]; blurb: string; color: string };

export const MODULES: Module[] = [
  { id: "ict-foundations", num: "M1", title: "Foundations: Market Makers & IPDA", short: "Foundations", minutes: 8, sections: [1, 2, 3], blurb: "The price-delivery mindset", color: "#a78bfa" },
  { id: "ict-liquidity", num: "M2", title: "Liquidity: The Heart of ICT", short: "Liquidity", minutes: 6, sections: [5], blurb: "BSL, SSL, IRL, ERL, DOL", color: "#ff4d6d" },
  { id: "ict-structure", num: "M3", title: "Structure, MSS & CISD", short: "Structure", minutes: 6, sections: [4], blurb: "Three layers of structure", color: "#60a5fa" },
  { id: "ict-pdarrays", num: "M4", title: "PD Arrays: Location", short: "PD Arrays", minutes: 12, sections: [6, 7, 8, 9, 10], blurb: "P/D, OTE, FVG, OB, breakers", color: "#2ee6a6" },
  { id: "ict-time", num: "M5", title: "Time: AMD, Judas & Sessions", short: "Time", minutes: 10, sections: [11, 12, 13, 18], blurb: "When liquidity gets attacked", color: "#f5c451" },
  { id: "ict-bias", num: "M6", title: "Daily Bias, DOL & MMXM", short: "Bias/DOL", minutes: 6, sections: [14, 20], blurb: "Where is price trying to go?", color: "#a78bfa" },
  { id: "ict-macro", num: "M7", title: "Intermarket, News & Fundamentals", short: "Macro", minutes: 8, sections: [15, 21, 22], blurb: "SMT, DXY, yields, CPI/NFP", color: "#60a5fa" },
  { id: "ict-eras", num: "M8", title: "The Mentorship Timeline", short: "Eras", minutes: 5, sections: [16, 17, 19], blurb: "2016 → 2022 → 2024+", color: "#94a3b8" },
  { id: "ict-execution", num: "M9", title: "Gold Execution Models", short: "Execution", minutes: 12, sections: [23, 24, 25, 26], blurb: "Models A–G, MTF, entries, targets", color: "#f5c451" },
  { id: "ict-risk", num: "M10", title: "Risk, Psychology & Myths", short: "Risk", minutes: 8, sections: [27, 28, 29], blurb: "Survive and stay objective", color: "#ff4d6d" },
  { id: "ict-system", num: "M11", title: "The Complete System & Playbook", short: "System", minutes: 8, sections: [30], blurb: "12 steps, one workflow", color: "#2ee6a6" },
  { id: "ict-lab", num: "M12", title: "2026 Expansion, Backtest Lab & Glossary", short: "Lab", minutes: 10, sections: [], blurb: "CISD, IFVG, BPR, vacuum, journal", color: "#a78bfa" },
];

/* ── 2026 Expansion appendix ───────────────────────────────────────────── */
export const EXPANSION: { group: string; items: { t: string; d: string; tag?: "core" | "later" | "optional" }[] }[] = [
  {
    group: "A · Structure & delivery",
    items: [
      { t: "CISD — Change in State of Delivery", tag: "later", d: "A refinement of delivery/structure analysis. Useful Gold sequence: liquidity raid → strong displacement → change in delivery → retracement into an aligned array. Do not treat a tiny candle break as a meaningful CISD." },
      { t: "Displacement", tag: "core", d: "Aggressive repricing. On XAUUSD, demand clearer-than-normal candles, range expansion and an obvious break of a relevant short-term swing. Volatility alone is not enough." },
      { t: "Inducement / IDM", tag: "later", d: "Liquidity that encourages traders into a position before price moves toward the larger objective. Mark obvious short-term highs/lows inside the active range, but do not label every minor swing as inducement." },
    ],
  },
  {
    group: "B · Advanced PD arrays",
    items: [
      { t: "IFVG — Inversion Fair Value Gap", tag: "later", d: "An FVG that fails can become an opposing reference. Strongest on Gold when the failure is connected to a liquidity event and subsequent displacement." },
      { t: "BPR — Balanced Price Range", tag: "later", d: "An overlap between opposing imbalances. Treat as a location/reference area and require broader narrative alignment." },
      { t: "Breaker Blocks", tag: "core", d: "A failed order-block reference that can become an opposing array after structure changes. Stronger when tied to a sweep and displacement." },
      { t: "Reaper / newer labels", tag: "optional", d: "Newer ICT-style sources use extra labels around IFVG/breaker relationships. Treat as optional advanced terminology until you've mastered liquidity, FVG, displacement and MSS." },
    ],
  },
  {
    group: "C · Time-based models",
    items: [
      { t: "Silver Bullet", tag: "core", d: "A time-window model built around liquidity, displacement and an FVG. Commonly studied windows: 03:00–04:00, 10:00–11:00 and 14:00–15:00 New York time. Always verify the New York daylight-saving offset before converting to South African time." },
      { t: "Killzones", tag: "core", d: "Time filters for periods of expected participation. A killzone is not a buy/sell signal by itself." },
      { t: "Killzone + Silver Bullet overlap", tag: "optional", d: "Advanced filter: require the Silver Bullet setup to occur inside an active killzone, then demand the full liquidity → MSS/displacement → FVG sequence. A study model — backtest it on XAUUSD." },
      { t: "Macros", tag: "later", d: "Use time-based macros as observation windows rather than automatic entries. Record what liquidity is attacked and what price delivers afterwards." },
    ],
  },
  {
    group: "D · Gold intermarket framework",
    items: [
      { t: "DXY", tag: "core", d: "Dollar strength/weakness as context. Gold often moves inversely, but short-term divergence can persist and should not override price structure." },
      { t: "US10Y & real yields", tag: "core", d: "Gold is sensitive to opportunity cost. Rising real yields can be a headwind; falling real yields can be supportive. Macro context, not an entry trigger." },
      { t: "Gold/Silver SMT", tag: "core", d: "Divergence between Gold and Silver can add confirmation at a meaningful liquidity point. Require price confirmation; SMT alone is not a trade." },
      { t: "News", tag: "core", d: "CPI, PCE, NFP, FOMC, Fed communication and major US data can produce abnormal ranges. Don't chase the first spike; wait for the post-event liquidity/structure sequence." },
    ],
  },
  {
    group: "E · XAUUSD price-vacuum framework",
    items: [
      { t: "What is a price vacuum?", tag: "optional", d: "When Gold moves into relatively uncharted territory above major highs, historical reference points are sparse — price can travel quickly between liquidity references." },
      { t: "How to trade it", tag: "optional", d: "Don't invent resistance because price is at an all-time high. Mark the last meaningful external high, current session liquidity, nearby imbalance and logical expansion targets. Reduce size when volatility expands." },
      { t: "New-high rule", tag: "optional", d: "At new highs, let liquidity and price delivery create the map. A previous high may be the liquidity event; the next objective may be defined by structure, time and risk rather than an arbitrary resistance line." },
    ],
  },
];

export const EXEC_MODELS_2026 = [
  { n: 1, t: "PDL/SSL Sweep Long", seq: ["Bullish HTF context", "PDL/SSL raid", "Displacement", "MSS/CISD", "FVG/OB retracement", "Internal liquidity", "External BSL"] },
  { n: 2, t: "PDH/BSL Sweep Short", seq: ["Bearish HTF context", "PDH/BSL raid", "Displacement", "MSS/CISD", "FVG/OB retracement", "Internal liquidity", "External SSL"] },
  { n: 3, t: "Asian Low Raid", seq: ["Bullish context", "Asian low taken", "London/NY displacement", "Structure shift", "FVG entry", "Upside liquidity"] },
  { n: 4, t: "Asian High Raid", seq: ["Bearish context", "Asian high taken", "London/NY displacement", "Structure shift", "FVG entry", "Downside liquidity"] },
  { n: 5, t: "Silver Bullet", seq: ["Correct time window", "Relevant liquidity", "Displacement/MSS", "FVG", "Retracement entry", "Next liquidity objective"] },
  { n: 6, t: "SMT Confirmation", seq: ["Gold/Silver divergence at liquidity", "Price confirmation", "FVG/OB entry", "Liquidity target"] },
];

/* ── Daily playbook + checklist ────────────────────────────────────────── */
export const PLAYBOOK = [
  { q: "Weekly context?", a: "Mark major highs/lows, PWH/PWL and broad dealing range." },
  { q: "Daily context?", a: "Mark PDH/PDL, daily FVG/OB and premium/discount." },
  { q: "4H/1H narrative?", a: "Define active dealing range and likely DOL." },
  { q: "Liquidity?", a: "Mark BSL/SSL, equal highs/lows and session levels." },
  { q: "Macro?", a: "Check DXY, yields and major scheduled US data." },
  { q: "Session?", a: "Mark Asian range and relevant London/NY window." },
  { q: "Raid?", a: "Wait for meaningful liquidity to be taken." },
  { q: "Confirmation?", a: "Require displacement + meaningful MSS/CISD." },
  { q: "Entry?", a: "Use FVG/OB/IFVG/BPR only when aligned." },
  { q: "Risk?", a: "Calculate position size from account risk and invalidation." },
  { q: "Target?", a: "Use internal then external liquidity where appropriate." },
  { q: "Review?", a: "Journal the process, not only the P/L." },
];

export const CHECKLIST = [
  "HTF bias defined",
  "DOL defined",
  "Dealing range defined",
  "Premium/discount checked",
  "PDH/PDL + PWH/PWL marked",
  "Equal highs/lows marked",
  "Asian range marked",
  "Macro calendar checked",
  "Liquidity raid occurred",
  "Displacement occurred",
  "MSS/CISD confirmed",
  "Entry array identified",
  "Invalidation defined",
  "Position size calculated",
  "Target liquidity defined",
  "No FOMO / revenge trading",
];

export const MASTER_RULE = [
  "Higher-timeframe context",
  "Liquidity",
  "Draw on liquidity",
  "Dealing range",
  "Premium/discount",
  "Time/session",
  "Liquidity raid",
  "Displacement",
  "MSS/CISD",
  "PD array",
  "Entry",
  "Invalidation",
  "Liquidity target",
  "Review",
];

/* ── Backtesting template ──────────────────────────────────────────────── */
export type FieldDef = { k: string; label: string; type: "text" | "select" | "number"; options?: string[] };
export const BACKTEST_FIELDS: FieldDef[] = [
  { k: "date", label: "Date / New York time", type: "text" },
  { k: "session", label: "Session / killzone", type: "select", options: ["Asia", "London KZ", "NY AM KZ", "NY PM", "Silver Bullet 03–04", "Silver Bullet 10–11", "Silver Bullet 14–15", "Other"] },
  { k: "bias", label: "HTF bias", type: "select", options: ["Bullish", "Bearish", "Unclear"] },
  { k: "dol", label: "DOL", type: "text" },
  { k: "swept", label: "Liquidity swept", type: "select", options: ["BSL", "SSL", "Equal highs", "Equal lows", "PDH", "PDL", "Asia high", "Asia low", "Other"] },
  { k: "disp", label: "Displacement quality", type: "select", options: ["Weak", "Normal", "Strong"] },
  { k: "mss", label: "MSS/CISD", type: "select", options: ["Yes", "No"] },
  { k: "array", label: "PD array", type: "select", options: ["FVG", "OB", "IFVG", "BPR", "Breaker", "Other"] },
  { k: "levels", label: "Entry / stop / target", type: "text" },
  { k: "risk", label: "Risk %", type: "number" },
  { k: "r", label: "Result (R)", type: "number" },
  { k: "mae", label: "MAE / MFE", type: "text" },
  { k: "news", label: "News environment", type: "select", options: ["None", "Medium", "High-impact"] },
  { k: "shot", label: "Screenshot (before + after link)", type: "text" },
  { k: "violation", label: "Rule violation?", type: "select", options: ["No", "Yes"] },
  { k: "lesson", label: "Lesson", type: "text" },
];

/* ── Glossary ──────────────────────────────────────────────────────────── */
export const GLOSSARY: [string, string][] = [
  ["BSL", "Buy-side liquidity above highs."],
  ["SSL", "Sell-side liquidity below lows."],
  ["DOL", "Draw on Liquidity — the objective suggested by the narrative."],
  ["MSS", "Market Structure Shift."],
  ["CISD", "Change in State of Delivery."],
  ["BOS", "Break of Structure."],
  ["CHoCH", "Change of Character."],
  ["FVG", "Fair Value Gap / imbalance."],
  ["IFVG", "Inversion Fair Value Gap."],
  ["CE", "Consequent Encroachment, commonly the 50% midpoint of an FVG."],
  ["BPR", "Balanced Price Range."],
  ["OB", "Order Block."],
  ["Breaker", "Failed order-block reference that can act as an opposing array."],
  ["OTE", "Optimal Trade Entry, commonly associated with the 62%–79% retracement area."],
  ["IRL", "Internal Range Liquidity."],
  ["ERL", "External Range Liquidity."],
  ["AMD / PO3", "Accumulation → Manipulation → Distribution."],
  ["SMT", "Intermarket divergence used as confirmation/context."],
  ["MMXM", "Market Maker Model framework."],
  ["PDH / PDL", "Previous Day High / Low."],
  ["PWH / PWL", "Previous Week High / Low."],
  ["XAUUSD", "Gold quoted in US dollars."],
  ["IPDA", "Interbank Price Delivery Algorithm — a conceptual framework for how price moves through time and liquidity (not a literal revealed bank algorithm)."],
  ["NDOG / NWOG", "New Day / New Week Opening Gap — later ICT gap references, treated as contextual PD arrays."],
  ["BISI / SIBI", "Buy-side imbalance sell-side inefficiency (bullish FVG) / sell-side imbalance buy-side inefficiency (bearish FVG)."],
  ["Inducement (IDM)", "Smaller obvious liquidity that attracts positioning before price seeks the larger objective."],
  ["Mitigation", "Price revisiting a prior institutional reference/array before continuation or rebalancing."],
  ["Displacement", "Aggressive repricing: range expansion and an obvious break of a relevant swing — not just volatility."],
  ["Killzone", "A time filter for periods of expected participation. Not a signal by itself."],
  ["Silver Bullet", "Time-based model: one-hour NY window → liquidity → displacement → FVG retracement."],
  ["Judas Swing", "A deceptive move against the eventual direction that raids liquidity before true delivery."],
  ["Equilibrium", "The 50% midpoint of a meaningful dealing range."],
  ["Price vacuum", "Uncharted territory above major highs where reference points are sparse and price travels fast."],
];

/* ── Flashcards (glossary + concept cards) ─────────────────────────────── */
export type Flash = { id: string; front: string; back: string; deck: "Terms" | "Concepts" | "Gold" | "Myths" };

export const FLASHCARDS: Flash[] = [
  ...GLOSSARY.map(([t, d], i) => ({ id: `g${i}`, front: t, back: d, deck: "Terms" as const })),
  { id: "c1", deck: "Concepts", front: "The core 2022 sequence (Gold application)?", back: "HTF bias → liquidity → sweep → displacement → MSS → FVG → retracement → entry → liquidity target." },
  { id: "c2", deck: "Concepts", front: "Bullish MSS — in order", back: "SSL → sweep → displacement → break of short-term high → bullish MSS." },
  { id: "c3", deck: "Concepts", front: "What makes 'the best FVG'?", back: "Not any FVG: liquidity sweep → displacement → MSS → FVG. That FVG has a narrative." },
  { id: "c4", deck: "Concepts", front: "OTE zone + central reference?", back: "62%–79% retracement, with 70.5% as the central reference. Location, not a trigger." },
  { id: "c5", deck: "Concepts", front: "Measure a bullish OTE from…?", back: "Meaningful low → high, then look for a 62–79% retracement. (Bearish: high → low.)" },
  { id: "c6", deck: "Concepts", front: "Breaker vs mitigation?", back: "Breaker = failed block that changes role after a decisive violation. Mitigation = revisit to rebalance/manage prior positioning." },
  { id: "c7", deck: "Concepts", front: "Silver Bullet windows (NY time)?", back: "03:00–04:00, 10:00–11:00, 14:00–15:00. Verify the NY DST offset before converting to SAST." },
  { id: "c8", deck: "Concepts", front: "Entry hierarchy (7 steps)?", back: "Setup (HTF) → Location (P/D, OTE) → Liquidity (BSL/SSL) → Trigger (sweep) → Confirm (MSS/CISD) → Entry (FVG/OB) → Target (liquidity)." },
  { id: "c9", deck: "Concepts", front: "Where does the stop go on a bullish sweep trade?", back: "Below the sweep / invalidation area — the price that invalidates the setup, not an arbitrary distance." },
  { id: "c10", deck: "Concepts", front: "TP ladder for a Gold long?", back: "TP1 internal high → TP2 PDH → TP3 PWH (external BSL), provided the DOL stays valid." },
  { id: "c11", deck: "Concepts", front: "Core Content principle (hierarchy)?", back: "Higher timeframe → liquidity → dealing range → premium/discount → time → price delivery → execution." },
  { id: "c12", deck: "Concepts", front: "Each timeframe's job?", back: "Weekly: major liquidity/range · Daily: bias, PDH/PDL, arrays, DOL · 4H: dealing range/OTE · 1H: narrative · 15M: sweep/MSS/FVG · 5M/1M: execution refinement." },
  { id: "c13", deck: "Concepts", front: "Process vs outcome?", back: "Good process + losing trade = ACCEPTABLE. Bad process + winning trade = DANGEROUS." },
  { id: "c14", deck: "Concepts", front: "Daily bias is…?", back: "A conditional probability framework, not a prediction. Write both scenarios and what activates each. Unclear DOL → stand aside." },
  { id: "c15", deck: "Concepts", front: "The No-trade layer?", back: "No clear bias, no DOL, no meaningful liquidity event, weak displacement, poor R:R, or unmanaged high-impact event risk." },
  { id: "c16", deck: "Concepts", front: "News model?", back: "Don't chase the first spike: liquidity raid → displacement → MSS → FVG → retracement. News gives volatility; ICT gives the framework." },
  { id: "c17", deck: "Concepts", front: "Bearish MMXM on Gold?", back: "Daily premium → BSL → distribution → bearish expansion → SSL. A narrative model, not an entry trigger." },
  { id: "c18", deck: "Concepts", front: "A strong order block has…?", back: "A reason to matter: liquidity taken → displacement → structure change → fits premium/discount." },
  { id: "x1", deck: "Gold", front: "$4,500 high, $4,300 low. Equilibrium?", back: "$4,400. $4,400–$4,500 = premium; $4,300–$4,400 = discount." },
  { id: "x2", deck: "Gold", front: "Typical Gold AMD study sequence?", back: "Asia → accumulation, London → manipulation, New York → distribution. Don't force it every day." },
  { id: "x3", deck: "Gold", front: "Bullish Gold SMT?", back: "Gold makes a lower low, Silver does not confirm. Then demand displacement + MSS/CISD + PD array." },
  { id: "x4", deck: "Gold", front: "DXY ↑ usually means…?", back: "Generally a headwind for Gold (inverse tendency) — but not tick-for-tick; divergence can persist." },
  { id: "x5", deck: "Gold", front: "Real yields rising?", back: "Can be a headwind for Gold (opportunity cost). Falling real yields can be supportive. Regimes change." },
  { id: "x6", deck: "Gold", front: "Suggested learning risk per trade on Gold?", back: "Test 0.25%–0.5%. Choose risk % first, size from the stop second." },
  { id: "x7", deck: "Gold", front: "Stop twice as wide as usual — position size?", back: "Smaller (roughly half) if the risk % is unchanged." },
  { id: "x8", deck: "Gold", front: "Gold drivers (macro)?", back: "USD, real & nominal yields, Fed expectations, inflation expectations, central-bank demand, geopolitics, risk sentiment, investment flows." },
  { id: "x9", deck: "Gold", front: "At new all-time highs (price vacuum)…", back: "Don't invent resistance. Mark the last external high, session liquidity, nearby imbalance and logical targets; reduce size as volatility expands." },
  { id: "x10", deck: "Gold", front: "Which FVGs matter on Gold?", back: "Higher-timeframe FVG + meaningful displacement > tiny 1M FVG. Gold prints many meaningless micro-imbalances." },
  { id: "x11", deck: "Gold", front: "Key US releases for Gold?", back: "CPI, PCE, NFP, FOMC, Fed speeches, PPI, GDP, retail sales, unemployment data." },
  { id: "m1", deck: "Myths", front: "“Every sweep reverses.”", back: "FALSE — sometimes liquidity is taken and price continues." },
  { id: "m2", deck: "Myths", front: "“Every FVG fills.”", back: "FALSE — some remain unfilled." },
  { id: "m3", deck: "Myths", front: "“OTE guarantees a reversal.”", back: "FALSE — OTE is a location framework." },
  { id: "m4", deck: "Myths", front: "“Every last down candle is an OB.”", back: "FALSE — context matters." },
  { id: "m5", deck: "Myths", front: "“SMT = automatic reversal.”", back: "FALSE — it's confirmation/context." },
  { id: "m6", deck: "Myths", front: "“Every killzone produces a setup.”", back: "FALSE — killzones are filters, not signals." },
  { id: "m7", deck: "Myths", front: "“One ICT model works every day.”", back: "FALSE — market conditions change." },
  { id: "m8", deck: "Myths", front: "“ICT knows exactly what banks are doing.”", back: "Careful — the institutional language is a framework, not a window into private order books." },
];

/* ── Module quick checks ───────────────────────────────────────────────── */
export const QUIZ: Record<string, { q: string; options: string[]; answer: number; explain: string }> = {
  "ict-foundations": {
    q: "London drops Gold through the Asian low and PDL, then a strong bullish displacement breaks structure. In the Market Maker Buy Model, the drop was…",
    options: ["Distribution", "Manipulation (sweep of SSL)", "Accumulation", "A guaranteed reversal"],
    answer: 1,
    explain: "The raid through an obvious range boundary is manipulation. The displacement and MSS afterward are what make it interesting — the model is a narrative, not a script.",
  },
  "ict-liquidity": {
    q: "Gold trades below PDL and instantly snaps back. What's the correct next step?",
    options: ["Buy the instant it reclaims", "Wait for displacement, a meaningful MSS and an aligned PD array", "Short — PDL broke", "Nothing ever happens at PDL"],
    answer: 1,
    explain: "Sweep ≠ automatic entry. Liquidity is a location; the evidence comes after the raid.",
  },
  "ict-structure": {
    q: "Daily bullish, 4H bullish, 15M just printed a bearish break. Best read?",
    options: ["Daily trend is now bearish", "Possibly a 15M retracement taking SSL before continuation", "Sell everything", "Structure doesn't matter"],
    answer: 1,
    explain: "Match the structure label to the timeframe. A short-term bearish retracement does not automatically reverse a bullish Daily.",
  },
  "ict-pdarrays": {
    q: "Bullish FVG from 4,436 to 4,452. Where is the CE?",
    options: ["4,436", "4,444", "4,452", "4,460"],
    answer: 1,
    explain: "Consequent Encroachment = 50% of the gap: (4,436 + 4,452) / 2 = 4,444.",
  },
  "ict-time": {
    q: "It's 10:05 New York time — inside a Silver Bullet window. What does the model require next?",
    options: ["Buy because it's the window", "A liquidity raid, displacement/MSS and an FVG to retrace into", "Wait for 11:00", "Nothing — time is the signal"],
    answer: 1,
    explain: "Time filters opportunity; liquidity and displacement provide the setup. Not 'at this time, buy'.",
  },
  "ict-bias": {
    q: "Your HTF read is bullish, but you can't identify a logical draw on liquidity. Correct decision?",
    options: ["Trade anyway", "Stand aside — no clear DOL", "Go short instead", "Use a 1M chart to decide"],
    answer: 1,
    explain: "Daily bias is a probability framework. If the DOL is unclear, standing aside is a valid decision.",
  },
  "ict-macro": {
    q: "Gold makes a lower low at PDL; Silver makes a higher low. What is this and what do you still need?",
    options: ["Bearish SMT, short now", "Potential bullish SMT — still need displacement, MSS/CISD and a PD array", "Nothing, metals don't correlate", "A guaranteed reversal"],
    answer: 1,
    explain: "SMT is a divergence clue at liquidity, not a standalone entry.",
  },
  "ict-eras": {
    q: "What's the best way to study the different mentorship years?",
    options: ["Memorise a new strategy for each year", "Study the continuity — how older concepts were refined", "Only study 2024", "Ignore pre-2022 content"],
    answer: 1,
    explain: "Modern models reorganise older concepts. Understanding the refinement beats memorising labels.",
  },
  "ict-execution": {
    q: "In the entry hierarchy, what question should the FVG/OB answer?",
    options: ["Why am I bullish?", "Where do I execute?", "What is the HTF bias?", "Which session is it?"],
    answer: 1,
    explain: "The entry is near the end of the reasoning process. The PD array answers WHERE, never WHY.",
  },
  "ict-risk": {
    q: "Your last Gold trade lost on a valid setup. Which response matches the course?",
    options: ["Double size to win it back", "Widen the stop next time", "Keep risk fixed, grade the process, follow the plan", "Stop journaling"],
    answer: 2,
    explain: "Good process + losing trade = acceptable. Never increase size after losses or widen stops.",
  },
  "ict-system": {
    q: "Which is the course's 'final master rule' in spirit?",
    options: ["FVG + MSS = entry", "Context → liquidity → DOL → range → P/D → time → raid → displacement → MSS/CISD → PD array → entry → invalidation → target → review", "Buy every Silver Bullet", "Trade whatever moves"],
    answer: 1,
    explain: "If the story is unclear, there is no requirement to trade.",
  },
  "ict-lab": {
    q: "How should you evaluate a Gold model?",
    options: ["From a handful of screenshots", "Build a sample (50–100+), one instrument, one model, 1–2 execution timeframes", "Test 5 models at once", "Use index statistics"],
    answer: 1,
    explain: "Track the conditions that matter, add complexity only after the base model has enough observations.",
  },
};

export const REFERENCES = [
  "Original source: “XAUUSD ICT 4.docx” (43 pages) — framework preserved and expanded. It explicitly distinguishes the teaching framework from the author's Gold-specific synthesis.",
  "The Inner Circle Trader — official YouTube channel / 2026 market commentary (carries hypothetical-performance and risk disclaimers).",
  "Inner Circle Trader-focused concept index — current 2026 update (liquidity, FVG, displacement, MSS, BOS, CHoCH, OBs, inducement, daily bias, P/D, OTE, PO3, Silver Bullet, killzones, macros, SMT, Turtle Soup, Judas, IRL/ERL).",
  "ICT Silver Bullet — current 2026 educational reference including an XAU/USD example.",
  "2026 IFVG / newer terminology reference (marked advanced/optional).",
  "Use the creator's own current material as the primary authority when terminology or model definitions evolve.",
];

/** quick checks (12×50) + section reads (30×10) + games/tools */
export const ICT_XP_TOTAL = MODULES.length * 50 + 30 * 10 + 30 + 30 + 40 + 20 + 40 + 60;
