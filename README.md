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
