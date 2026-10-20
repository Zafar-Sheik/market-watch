# PA/Academy — Price Action for Gold & US30

An interactive, ADHD-friendly course on price action and smart-money concepts, built for **XAUUSD** and **US30** traders.

Built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, **GSAP + ScrollTrigger** and **Motion** (Aceternity-style
components: spotlight, text-generate, moving-border button, glow cards, meteors). Every chart is a custom SVG candle engine
(`src/components/chart/CandleChart.tsx`) so lessons can animate, replay and react to clicks.

## Levels

| # | Level | Interactive bit |
|---|-------|-----------------|
| 01 | The Candle Is a Fight | Drag-to-build a candle, tick-by-tick wick replay, 15m → 1H merge |
| 02 | Confirmation Candles | Pattern gallery (pin bar, engulfing, morning star, inside bar, shooting star, sweep & reclaim) + "Spot it" game |
| 03 | Market Structure | Tap-to-reveal HH/HL/LH/LL, uptrend/downtrend/range, top-down timeframe stack |
| 04 | BOS vs CHoCH | Step-through replay of a trend living and dying; wick-vs-close comparison |
| 05 | Levels & Zones | S/R flip replay, line vs zone toggle |
| 06 | Liquidity | GSAP stop-hunt animation (stops pop on the sweep), liquidity pool cards |
| 07 | Order Blocks & Breakers | Find-the-OB game, OB grading checklist, breaker flip |
| 08 | Fair Value Gaps | Displacement slider that creates a gap, FVG scanner with fill view |
| 09 | Premium, Discount & OTE | Two-tap fib tool with premium/discount/OTE shading |
| 10 | Entry Models | Sweep→CHoCH→FVG, Break & Retest, HTF POI + LTF CHoCH — replayed with entry/SL/TP and R |
| 11 | Sessions: Gold & US30 | Live 24h session/killzone clock in your timezone (DST-safe), news pins, instrument cheat sheet |
| 12 | Risk | Position-size calculator (XAU & US30), expectancy, losing-streak simulator |
| ★ | Final Boss | 5 scenarios — long, short or skip |

Plus a persistent pre-trade checklist and an 8-card recap.

## ICT Gold tab (`/ict-gold`)

The full **ICT XAUUSD Master Course — 2026 Edition** rebuilt as 12 modules covering all 30 sections plus the 2026 expansion:

- **Every section** has its visual-map diagram, key takeaway, and tabs for the course text, deep instructor notes, Gold application,
  common mistakes and the practical study drill ("Mark read" = +10 XP).
- **12 study-chart replays** (bullish/bearish sweep + MSS + FVG, Asian raid, OTE long/short, Silver Bullet long/short, Gold/Silver SMT,
  IRL→ERL, long/short playbooks, no-trade) stepped through 1 → 5.
- **Tools:** dealing-range / premium-discount / OTE / CE calculator, live Silver Bullet & killzone clock (NY → your time → SAST, DST-safe),
  pre-session bias builder, macro context meter, $2/$5/$10/$20 position-size drill, 12-step daily playbook, 16-box pre-trade checklist,
  backtest journal with stats and CSV export.
- **Games:** liquidity sorter, myth buster, Final Master Rule sequence builder, process-vs-outcome matrix, entry-gate walk.
- **Flash deck:** ~70 Leitner-style flashcards (terms, concepts, Gold facts, myths) plus a searchable glossary.

Content lives in `src/lib/ict/` (`sections.ts`, `extras.ts`); components in `src/components/ict/`.

## Order Flow tab (`/order-flow`)

13 beginner-friendly levels, each with an "explain it simply" analogy, TL;DR, interactive and quick check:
the auction, a **working order-book (DOM) simulator** with time & sales (market vs limit orders, spoofed walls, icebergs, live mode),
aggressor-vs-absorber battle, whale-spotting tape reflex game, delta & cumulative delta replays, a **footprint explorer**
(bid × ask, diagonal imbalances, POC), absorption/exhaustion, volume-profile tap quiz (POC, value area, LVN), VWAP (US30 open),
trapped traders, a Gold/US30 data-reality picker (spot/CFD tick volume vs GC/MGC/YM/MYM futures + futures→CFD level mapper),
four order-flow setups, a boss round and a 32-card flash deck. Engine: `src/lib/orderflow.ts`; scenarios: `src/lib/of/`.

## Combined tab (`/compare`)

"One market, three lenses": the same gold chart replayed through Price Action, ICT/SMC and Order Flow overlays with three captions per
step; a Rosetta-stone translation table + translate game; an interactive Venn of similarities/differences; a head-to-head matrix;
a "which lens fits you" path finder; a confluence-stack trade grader (context → location → trigger, with a lens-conflict override);
a pick-the-right-lens quiz; and the combined Gold & US30 daily routine. Content: `src/lib/compare.ts`.

## ADHD-friendly design

- Every level has a **time tag** and a **TL;DR** box with the only three things that matter.
- **XP + "cleared" badges**, confetti bursts, wrong answers cost nothing. Progress saves in `localStorage`.
- **Focus mode** (`F`) fades every level except the one you're on. **Calm mode** turns off decorative motion
  (also respects `prefers-reduced-motion`).
- **J / K** hop between levels; a floating hopper does the same on mobile.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

> Educational content only — not financial advice. Charts are simplified illustrations, not market data.
