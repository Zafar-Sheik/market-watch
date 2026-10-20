import type { Chapter } from "@/lib/chapters";
import type { Flash } from "@/lib/ict/extras";

export const OF_LEVELS: Chapter[] = [
  { id: "of-auction", num: "F1", title: "Every Trade Needs Two Sides", short: "Auction", minutes: 4 },
  { id: "of-book", num: "F2", title: "The Order Book (DOM)", short: "DOM", minutes: 4 },
  { id: "of-aggressor", num: "F3", title: "Who Actually Moves Price?", short: "Aggressor", minutes: 3 },
  { id: "of-tape", num: "F4", title: "Reading the Tape", short: "Tape", minutes: 3 },
  { id: "of-delta", num: "F5", title: "Delta & Cumulative Delta", short: "Delta", minutes: 4 },
  { id: "of-footprint", num: "F6", title: "Footprint Charts", short: "Footprint", minutes: 5 },
  { id: "of-absorption", num: "F7", title: "Absorption & Exhaustion", short: "Absorb", minutes: 4 },
  { id: "of-profile", num: "F8", title: "Volume Profile", short: "Profile", minutes: 4 },
  { id: "of-vwap", num: "F9", title: "VWAP: The Fair-Price Line", short: "VWAP", minutes: 3 },
  { id: "of-traps", num: "F10", title: "Trapped Traders & Stop Runs", short: "Traps", minutes: 3 },
  { id: "of-data", num: "F11", title: "Gold & US30: Where the Real Data Is", short: "Data", minutes: 4 },
  { id: "of-setups", num: "F12", title: "Order Flow Setups", short: "Setups", minutes: 6 },
  { id: "of-boss", num: "★", title: "Boss: Read the Flow", short: "Boss", minutes: 4 },
];

export const OF_QUIZ: Record<string, { q: string; options: string[]; answer: number; explain: string }> = {
  "of-auction": {
    q: "Price just ticked up from 4,450.0 to 4,450.1. What had to happen?",
    options: ["Someone placed a limit buy", "Buyers with market orders ate ALL the sell orders at 4,450.0", "The broker decided", "Volume went down"],
    answer: 1,
    explain: "Price only moves when aggressive (market) orders use up every resting order at the current price. Then the next price becomes the trade price.",
  },
  "of-book": {
    q: "A huge 900-lot bid appears below price, then vanishes the second price gets close. What might it be?",
    options: ["A guaranteed floor", "Spoofing / a pulled order — not real intent", "An iceberg that got filled", "A market order"],
    answer: 1,
    explain: "Resting orders can be cancelled any time. Walls that disappear as price approaches were never meant to be filled. Trust executed trades more than displayed orders.",
  },
  "of-aggressor": {
    q: "Aggressive buying keeps hitting a level, but price won't go up. What's happening?",
    options: ["Buyers are winning", "A big passive seller is absorbing them", "The market is closed", "Nothing — keep buying"],
    answer: 1,
    explain: "Absorption: limit sellers soak up every market buy. If the buyers run out, price often drops hard.",
  },
  "of-tape": {
    q: "On the tape you see a 250-lot print when typical prints are 1–5 lots. What is it?",
    options: ["A typo", "A large/institutional participant transacting", "Proof price will rise", "A limit order"],
    answer: 1,
    explain: "Big prints show where size is active. Direction still needs context: was it aggressive buying or selling, and did price react?",
  },
  "of-delta": {
    q: "Price makes a new high but cumulative delta makes a LOWER high. What is that?",
    options: ["Bullish confirmation", "A bearish delta divergence — buyers are weakening", "Meaningless", "A volume profile"],
    answer: 1,
    explain: "Fewer aggressive buyers are pushing the new high. Divergence is a warning, not a trigger — wait for price to confirm.",
  },
  "of-footprint": {
    q: "A footprint shows 3 price levels in a row where ask volume is 3× the bid volume diagonally. What's that called?",
    options: ["Stacked buy imbalances", "A POC", "A sell-off", "Absorption"],
    answer: 0,
    explain: "Stacked imbalances = aggressive buyers overwhelming sellers across several levels. That zone often acts as support on a pullback.",
  },
  "of-absorption": {
    q: "Huge negative delta at a low, long lower wick, candle closes near its high. Best read?",
    options: ["Sellers are in control", "Sellers were absorbed by passive buyers — possible reversal", "Ignore it", "Short more"],
    answer: 1,
    explain: "Lots of selling, no follow-through. Passive buyers absorbed it. Combine with a level/sweep for a high-quality reversal idea.",
  },
  "of-profile": {
    q: "Price drops into a low-volume node (LVN). What usually happens?",
    options: ["Price slows down and ranges", "Price tends to move quickly through it", "Price must reverse", "Volume doubles"],
    answer: 1,
    explain: "LVNs are areas the market rejected — little business was done there. Price often travels fast through them to the next high-volume area.",
  },
  "of-vwap": {
    q: "US30 opens, dips below VWAP, then reclaims it with strong positive delta. Most common read?",
    options: ["Bearish", "Buyers are back in control of the session — bullish bias while above", "VWAP is broken", "No information"],
    answer: 1,
    explain: "VWAP is the session's volume-weighted fair price. A reclaim with aggressive buying shows buyers accepting higher prices.",
  },
  "of-traps": {
    q: "Gold breaks above a high, delta spikes positive, then price falls back below the high. Who's trapped?",
    options: ["Short sellers", "Breakout buyers who bought the spike", "Nobody", "The broker"],
    answer: 1,
    explain: "The spike was buy stops + breakout buyers. When price falls back, they're underwater — their exits add fuel to the drop.",
  },
  "of-data": {
    q: "Why is a footprint on a spot XAUUSD CFD chart less reliable?",
    options: ["Gold has no volume", "Spot gold is decentralised — CFD volume is only your broker's tick count", "Footprints are illegal", "It's actually perfect"],
    answer: 1,
    explain: "For real order flow on gold use COMEX gold futures (GC / MGC). For the Dow use CBOT futures (YM / MYM).",
  },
  "of-setups": {
    q: "Which is the order-flow 'confirmation' in an absorption reversal?",
    options: ["Price touching the level", "Delta flipping positive and price breaking the absorption candle's high", "A green candle anywhere", "Low volume"],
    answer: 1,
    explain: "The absorption shows intent; the flip in delta + price confirming is the trigger.",
  },
};

export const OF_FLASH: Flash[] = [
  { id: "o1", deck: "Terms", front: "Order flow", back: "Reading the actual buying and selling — orders, trades, volume — to see WHO is in control right now." },
  { id: "o2", deck: "Terms", front: "Market order", back: "'Fill me now at any price.' The aggressor. Market orders are what move price." },
  { id: "o3", deck: "Terms", front: "Limit order", back: "'Fill me only at my price.' Passive liquidity that rests in the order book." },
  { id: "o4", deck: "Terms", front: "Bid / Ask", back: "Bid = best price buyers are waiting at. Ask (offer) = best price sellers are waiting at. Gap = spread." },
  { id: "o5", deck: "Terms", front: "DOM / order book", back: "Depth of Market: a ladder showing resting limit orders at each price." },
  { id: "o6", deck: "Terms", front: "Time & Sales (the tape)", back: "A live list of every executed trade: time, price, size, and whether it hit the bid or lifted the ask." },
  { id: "o7", deck: "Terms", front: "Delta", back: "Aggressive buy volume minus aggressive sell volume for a bar or price level." },
  { id: "o8", deck: "Terms", front: "Cumulative delta (CVD)", back: "Running total of delta. Shows whether buyers or sellers have been more aggressive over time." },
  { id: "o9", deck: "Terms", front: "Footprint chart", back: "A candle opened up: the bid × ask volume traded at every price inside it." },
  { id: "o10", deck: "Terms", front: "Imbalance", back: "On a footprint, when one side's volume is ~3× (300%) the other side diagonally. Shows aggression." },
  { id: "o11", deck: "Terms", front: "Stacked imbalances", back: "3+ imbalances in a row. A strong aggressive zone that often acts as support/resistance later." },
  { id: "o12", deck: "Terms", front: "Absorption", back: "Heavy aggressive orders get soaked up by passive limit orders. Lots of volume, little price movement." },
  { id: "o13", deck: "Terms", front: "Exhaustion", back: "Aggression dries up at an extreme — the push runs out of participants." },
  { id: "o14", deck: "Terms", front: "Iceberg order", back: "A large limit order that only shows a small part. It keeps refilling at the same price." },
  { id: "o15", deck: "Terms", front: "Spoofing / pulling", back: "Displayed orders that get cancelled before they're hit. Displayed ≠ real intent." },
  { id: "o16", deck: "Terms", front: "Volume profile", back: "Volume traded at each PRICE (sideways histogram), not each time period." },
  { id: "o17", deck: "Terms", front: "POC", back: "Point of Control: the price with the most volume. The 'fairest' price of the period." },
  { id: "o18", deck: "Terms", front: "Value Area (VAH / VAL)", back: "Where ~70% of volume traded. VAH = top, VAL = bottom." },
  { id: "o19", deck: "Terms", front: "HVN / LVN", back: "High-volume node = acceptance, price slows. Low-volume node = rejection, price moves fast through it." },
  { id: "o20", deck: "Terms", front: "VWAP", back: "Volume-Weighted Average Price — the session's average price paid, weighted by volume. Institutional benchmark." },
  { id: "o21", deck: "Terms", front: "Unfinished auction", back: "A candle extreme with volume on both bid and ask — the auction didn't finish, price often revisits it." },
  { id: "o22", deck: "Concepts", front: "Why does price move?", back: "Aggressive orders exhaust all resting liquidity at the current price, so the next trade happens at a new price." },
  { id: "o23", deck: "Concepts", front: "Delta divergence (bearish)", back: "Price makes a higher high, delta/CVD makes a lower high → fewer buyers pushing. Warning, not a trigger." },
  { id: "o24", deck: "Concepts", front: "What does a stop run look like in order flow?", back: "A burst of market orders (stops) → big delta spike + volume at the extreme. If price can't continue, the stops were absorbed → reversal." },
  { id: "o25", deck: "Concepts", front: "Absorption reversal — the trigger?", back: "Absorption at a level → delta flips → price breaks the absorption bar's opposite extreme. Stop beyond the absorption." },
  { id: "o26", deck: "Concepts", front: "Trust what: displayed orders or executed trades?", back: "Executed trades (tape, footprint, delta). Displayed orders can be pulled." },
  { id: "o27", deck: "Gold", front: "Real order flow for gold?", back: "COMEX gold futures: GC (full) or MGC (micro). Spot XAUUSD CFDs only show tick volume." },
  { id: "o28", deck: "Gold", front: "Real order flow for US30?", back: "CBOT Dow futures: YM (mini) or MYM (micro). Watch the 9:30 ET NYSE open." },
  { id: "o29", deck: "Gold", front: "Futures vs CFD price?", back: "They differ by a small basis/offset. Map key futures levels onto your CFD chart by the current difference." },
  { id: "o30", deck: "Myths", front: "“A big bid on the DOM means price will hold.”", back: "FALSE — it can be pulled. Watch whether it actually trades (absorption on the tape/footprint)." },
  { id: "o31", deck: "Myths", front: "“Positive delta = price must go up.”", back: "FALSE — positive delta into a passive seller is absorption, often bearish." },
  { id: "o32", deck: "Myths", front: "“Order flow works without context.”", back: "FALSE — it's best at a pre-planned level (PA level, ICT POI, profile edge)." },
];

/** quick checks + boss check + tape/profile/boss games + flashcard milestones */
export const OF_XP_TOTAL = Object.keys(OF_QUIZ).length * 50 + 50 + 30 + 20 + 40 + 40 + 60;
