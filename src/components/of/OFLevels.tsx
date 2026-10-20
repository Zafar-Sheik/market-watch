"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, Baby, Layers } from "lucide-react";
import { useRef } from "react";
import { BULL, GOLD, SKY } from "@/components/chart/CandleChart";
import { Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { ToolShell } from "@/components/ict/Tools";
import { GlowCard } from "@/components/ui/card-spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerate } from "@/components/ui/text-generate";
import { OF_LEVELS, OF_QUIZ } from "@/lib/of/content";
import { AbsorptionLesson, AggressionLab, DataPicker, DeltaLesson, FootprintExplorer, OFBoss, ProfileQuiz, SetupLab, TapeGame, TrapsLesson, VwapLesson } from "./Labs";
import { OrderBookSim } from "./OrderBook";

gsap.registerPlugin(useGSAP);

const L = (id: string) => OF_LEVELS.find((c) => c.id === id)!;

/** "Explain it like I'm new" analogy card. */
function Simple({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="flex gap-4 rounded-3xl border border-sky/25 bg-gradient-to-br from-sky/[0.08] to-transparent p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky/15 text-3xl">{emoji}</div>
      <div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-sky">
          <Baby size={13} /> EXPLAIN IT SIMPLY
        </div>
        <div className="mt-0.5 text-lg font-bold text-white">{title}</div>
        <div className="mt-1 text-[15px] leading-relaxed text-slate-300">{children}</div>
      </div>
    </div>
  );
}

function Check({ id }: { id: string }) {
  const q = OF_QUIZ[id];
  return <QuickCheck chapter={id} question={q.q} options={q.options} answer={q.answer} explain={q.explain} />;
}

export function OFHero() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (document.documentElement.dataset.calm === "1") return;
      gsap.from("[data-h] span", { yPercent: 110, stagger: 0.08, duration: 0.9, ease: "expo.out" });
      gsap.from("[data-fade]", { opacity: 0, y: 18, stagger: 0.1, duration: 0.6, delay: 0.4 });
      gsap.to("[data-bar]", { scaleX: () => 0.25 + Math.random() * 0.75, duration: 0.6, ease: "power2.inOut", stagger: { each: 0.05, repeat: -1, yoyo: true }, transformOrigin: (i: number) => (i % 2 ? "left" : "right") });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} id="top" className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#60a5fa" />
      {/* animated DOM ladder backdrop */}
      <div className="pointer-events-none absolute right-[-40px] top-24 hidden w-[420px] space-y-1 opacity-30 md:block" aria-hidden>
        {Array.from({ length: 22 }, (_, k) => (
          <div key={k} className="grid grid-cols-[1fr_70px_1fr] items-center gap-2 font-mono text-[11px] text-slate-500">
            <div className="flex justify-end">{k >= 11 && <div data-bar className="h-3 w-full rounded-l bg-bull/70" />}</div>
            <span className="text-center">{(4455.0 - k * 0.1).toFixed(1)}</span>
            <div>{k < 11 && <div data-bar className="h-3 w-full rounded-r bg-bear/70" />}</div>
          </div>
        ))}
      </div>
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
        <div data-fade className="mb-6 flex flex-wrap gap-2 font-mono text-xs font-bold">
          <span className="rounded-full border border-sky/40 bg-sky/10 px-3 py-1 text-sky">◎ ORDER FLOW · BEGINNER → PRO</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-slate-400">
            {OF_LEVELS.length} levels · ~{OF_LEVELS.reduce((s, c) => s + c.minutes, 0)} min
          </span>
        </div>
        <h1 data-h className="text-[12vw] font-black leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-[112px]">
          <span className="block overflow-hidden">
            <span className="inline-block">See who&apos;s</span>
          </span>
          <span className="block overflow-hidden">
            <span className="inline-block bg-gradient-to-b from-white via-sky to-blue-700 bg-clip-text text-transparent">pushing.</span>
          </span>
        </h1>
        <TextGenerate
          className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl"
          words="Price action shows WHAT happened. ICT shows WHERE price wants to go. Order flow shows WHO is buying and selling right now — and whether they're winning."
        />
        <div data-fade className="mt-8 flex flex-wrap items-center gap-4">
          <MovingBorderButton as="a" href={`#${OF_LEVELS[0].id}`}>
            Start Level F1 <ArrowDown size={18} />
          </MovingBorderButton>
          <a href="#of-flash" className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white">
            <Layers size={16} /> Flashcards
          </a>
        </div>
      </div>
    </div>
  );
}

export function OFLevels() {
  return (
    <>
      <Level
        chapter={L("of-auction")}
        accent={SKY}
        tldr={[
          "Every trade = one buyer + one seller. Always.",
          "One of them is impatient (market order). The other was waiting (limit order).",
          "Price moves only when the impatient side uses up ALL the waiting orders at a price.",
        ]}
      >
        <Simple emoji="🍎" title="It's a farmers' market">
          Sellers put apples on the table with price tags ($4,450.1). Buyers who must have an apple NOW grab them at that price. When the
          $4,450.1 apples are all gone and buyers still want more, the next apple costs $4,450.2. That&apos;s a price tick up. Nothing more
          mysterious than that.
        </Simple>
        <Panel>
          <PanelTitle kicker="PLAY" title="Be the market order" hint="Hit Market BUY 60 and watch it chew through the sell orders. Then try the small 10-lot." />
          <OrderBookSim compact />
        </Panel>
        <Check id="of-auction" />
      </Level>

      <Level
        chapter={L("of-book")}
        accent={SKY}
        tldr={["The DOM (order book) shows waiting limit orders at every price.", "Bids = buyers waiting below. Asks = sellers waiting above.", "Displayed orders can be cancelled — trust what actually TRADES."]}
      >
        <Simple emoji="🧾" title="A queue of people holding price tags">
          The order book is everyone standing in line with a sign saying the price they&apos;d accept. Some are real. Some will walk away the
          second you get close (spoofing). Some are hiding a much bigger order behind a small sign (icebergs).
        </Simple>
        <Panel>
          <PanelTitle kicker="SANDBOX" title="The full order book" hint="Add your own limit orders (click empty cells), fake a bid wall and pull it, hide an iceberg, or make the market live." />
          <OrderBookSim features={["spoof", "ice", "live", "limit"]} />
        </Panel>
        <Callout kind="warn">Big DOM walls are the most-faked thing in trading. Use the book for context; make decisions on executed volume (tape, footprint, delta).</Callout>
        <Check id="of-book" />
      </Level>

      <Level chapter={L("of-aggressor")} accent={SKY} tldr={["Market orders = aggressors. They cross the spread and move price.", "Limit orders = passive. They absorb aggression.", "The fight between them is ALL of order flow."]}>
        <Simple emoji="🥊" title="Impatient vs patient">
          Impatient traders (market orders) push. Patient traders (limit orders) stand their ground. If the pushers are stronger, price
          moves. If the wall is stronger, the pushers get exhausted — and often price snaps the other way.
        </Simple>
        <AggressionLab />
        <Check id="of-aggressor" />
      </Level>

      <Level chapter={L("of-tape")} accent={SKY} tldr={["Time & Sales = a live receipt of every trade.", "Green = someone bought at the ask. Red = someone sold at the bid.", "Big prints at a key level matter. Big prints in the middle of nowhere don't."]}>
        <Simple emoji="🧾" title="The market's receipt printer">
          Every single transaction prints: time, price, size, and which side was the aggressor. Most prints are tiny. When a whale shows up,
          it stands out — that&apos;s your cue to look at WHERE it happened and what price does next.
        </Simple>
        <TapeGame />
        <Check id="of-tape" />
      </Level>

      <Level chapter={L("of-delta")} accent={SKY} tldr={["Delta = aggressive buys − aggressive sells (per candle).", "Cumulative delta (CVD) = the running score.", "Price and CVD disagreeing (divergence) = a warning the move is tiring."]}>
        <Simple emoji="🪢" title="A tug-of-war score">
          Count every lot bought by impatient buyers, subtract every lot sold by impatient sellers. +500 means buyers pulled harder this
          candle. Keep a running total and you get CVD — the scoreboard for the whole session.
        </Simple>
        <DeltaLesson />
        <Callout kind="pro">Divergence alone is not a trade. It becomes one at a level, after a sweep, when price confirms — exactly like an ICT MSS confirms a sweep.</Callout>
        <Check id="of-delta" />
      </Level>

      <Level chapter={L("of-footprint")} accent={SKY} tldr={["A footprint = a candle cut open: bid × ask volume at every price.", "Imbalance = one side ≥ 3× the other (compared diagonally).", "3+ imbalances stacked = a strong zone. POC = busiest price in the candle."]}>
        <Simple emoji="🩻" title="An X-ray of a candle">
          A normal candle shows open, high, low and close. A footprint shows the fight inside: at each price, how many lots sellers dumped into
          buyers and how many lots buyers took from sellers.
        </Simple>
        <FootprintExplorer />
        <Check id="of-footprint" />
      </Level>

      <Level chapter={L("of-absorption")} accent={SKY} tldr={["Absorption = heavy aggression, no price progress. A passive wall is eating it.", "Exhaustion = the aggressor runs out of participants.", "Absorption → exhaustion → delta flip = classic reversal sequence."]}>
        <Simple emoji="🧤" title="A goalkeeper who saves every shot">
          Sellers keep shooting (big red delta) but the ball never goes in (price won&apos;t drop). Eventually they stop shooting
          (exhaustion), and the other team counter-attacks.
        </Simple>
        <AbsorptionLesson />
        <Check id="of-absorption" />
      </Level>

      <Level chapter={L("of-profile")} accent={SKY} tldr={["Volume profile = volume at each PRICE, not each time.", "POC = fairest price. Value area = where 70% traded.", "HVN = acceptance (price slows). LVN = rejection (price moves fast through)."]}>
        <Simple emoji="🗺️" title="Busy streets vs empty highways">
          Where lots of business happened, price likes to hang around (busy street). Where almost nothing traded, price zooms through (empty
          highway). The profile shows you the map.
        </Simple>
        <ProfileQuiz />
        <Check id="of-profile" />
      </Level>

      <Level chapter={L("of-vwap")} accent={SKY} tldr={["VWAP = the average price paid today, weighted by volume.", "Above VWAP: buyers winning the session. Below: sellers.", "Reclaims/losses of VWAP with strong delta are high-signal on US30 at the NY open."]}>
        <Simple emoji="⚖️" title="The average price everyone paid today">
          If price is above VWAP, the average buyer today is in profit and happy to defend. Below VWAP, the average buyer is losing and may
          sell. Big funds literally grade their fills against VWAP.
        </Simple>
        <VwapLesson />
        <Callout kind="us30">VWAP resets each session. On US30 most traders anchor it to the 9:30 ET cash open. On gold, many use the futures session open or the London open (anchored VWAP).</Callout>
        <Check id="of-vwap" />
      </Level>

      <Level chapter={L("of-traps")} accent={SKY} tldr={["Stops are market orders waiting to fire.", "A stop run = burst of volume + delta at an obvious high/low.", "If price can't continue after the burst → trapped traders → reversal fuel."]}>
        <Simple emoji="🚪" title="Everyone runs for the same fire exit">
          When price goes the wrong way, traders with stops all exit at once — with market orders. That burst is visible in the volume and
          delta. If someone big is absorbing it, the exits become fuel in the opposite direction.
        </Simple>
        <TrapsLesson />
        <Check id="of-traps" />
      </Level>

      <Level chapter={L("of-data")} accent={GOLD} tldr={["Spot XAUUSD & US30 CFDs only show tick volume — not real order flow.", "Real data: COMEX gold futures (GC/MGC) and CBOT Dow futures (YM/MYM).", "Watch futures flow, map the levels to your CFD with the offset."]}>
        <Simple emoji="📸" title="You can't count a stadium crowd from one turnstile">
          Spot gold trades across hundreds of banks; your CFD broker only sees its own clients. Futures trade on ONE exchange, so every
          contract is counted. That&apos;s why order-flow traders watch futures.
        </Simple>
        <DataPicker />
        <Callout kind="gold">Key gold futures times (ET): COMEX day-session open 8:20, US data 8:30, NYSE 9:30. CME Globex trades almost 24h with a daily break 17:00–18:00 ET.</Callout>
        <Check id="of-data" />
      </Level>

      <Level chapter={L("of-setups")} accent={BULL} tldr={["Order flow is the TRIGGER, a pre-planned level is the REASON.", "Four setups: absorption reversal, divergence at a sweep, stacked-imbalance pullback, VWAP reclaim.", "Always: stop beyond the order-flow evidence, target the next liquidity."]}>
        <SetupLab />
        <Check id="of-setups" />
      </Level>

      <Level chapter={L("of-boss")} accent={GOLD} tldr={["5 order-flow scenarios. Long, short or skip.", "Read the delta panel — it's the whole game.", "Score 4+ for bonus XP."]}>
        <OFBoss />
      </Level>
    </>
  );
}

export function OFCheat() {
  const items = [
    ["Market order", "Impatient. Moves price."],
    ["Limit order", "Patient. Absorbs."],
    ["Delta", "Buy aggression − sell aggression."],
    ["CVD", "Running delta score."],
    ["Absorption", "Big volume, no progress."],
    ["Imbalance", "≥3:1 diagonally."],
    ["POC / VA", "Fair price / 70% zone."],
    ["VWAP", "Today's average price."],
  ];
  return (
    <ToolShell kicker="ONE-SCREEN RECAP" title="Order flow in 8 cards">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(([t, d], i) => (
          <GlowCard key={t} color="#60a5fa22" className="p-4 sm:p-4">
            <div className="font-mono text-[10px] font-bold text-slate-500">{String(i + 1).padStart(2, "0")}</div>
            <div className="font-bold text-white">{t}</div>
            <div className="text-xs text-slate-400">{d}</div>
          </GlowCard>
        ))}
      </div>
    </ToolShell>
  );
}
