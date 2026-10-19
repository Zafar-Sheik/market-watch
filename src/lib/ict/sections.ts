/**
 * ICT XAUUSD Master Course — 2026 Edition.
 * All 30 sections: the visual-map takeaway, the main course text, and the expanded instructor notes
 * (objective, detailed notes, Gold application, common mistakes, study drill).
 */

export type Diagram =
  | { kind: "flow"; steps: { t: string; sub?: string; c: string }[]; note?: string[] }
  | { kind: "path"; pts: [number, number][]; phases?: string[]; levels: { y: number; t: string; c: string; x1?: number; x2?: number }[]; tags?: { x: number; y: number; t: string; c: string }[] }
  | { kind: "ladder"; levels: { y: number; t: string; c: string }[]; bands?: { y1: number; y2: number; t: string; c: string }[]; arrow?: [number, number]; side?: { t: string; c: string }[] }
  | { kind: "tf"; rows: { t: string; sub: string; c: string }[] }
  | { kind: "hub"; center: string; spokes: string[]; note: string }
  | { kind: "myths"; items: string[] }
  | { kind: "grid"; items: string[] }
  | { kind: "smt" };

export type Block = { h: string; items: string[] };

export type Section = {
  n: number;
  title: string;
  visual: string;
  takeaway: string;
  diagram: Diagram;
  teaches: string;
  /** the main course text, kept in its own blocks */
  course: Block[];
  notes: string[];
  gold: string[];
  mistakes: string[];
  drill: string;
};

const C = { blue: "#60a5fa", red: "#ff4d6d", green: "#2ee6a6", gold: "#f5c451", violet: "#a78bfa", slate: "#94a3b8" };

export const SECTIONS: Section[] = [
  {
    n: 1,
    title: "Early ICT / Market-Maker Concepts",
    visual: "Market Maker Buy Model",
    takeaway:
      "The model is a narrative, not a guaranteed script: liquidity is engineered or attacked, price reprices with displacement, then seeks an opposing pool of liquidity.",
    diagram: {
      kind: "path",
      phases: ["Accumulation", "Manipulation (sweep SSL)", "Displacement", "Distribution to BSL"],
      pts: [[0, 62], [10, 55], [18, 60], [26, 57], [34, 82], [42, 56], [52, 44], [64, 34], [78, 22], [92, 12]],
      levels: [
        { y: 70, t: "Sell-side liquidity", c: C.red, x1: 22, x2: 46 },
        { y: 14, t: "Buy-side liquidity / target", c: C.green, x1: 70, x2: 100 },
      ],
    },
    teaches:
      "Learn the price-delivery mindset behind the later vocabulary. Stop seeing highs and lows only as support/resistance and start asking where orders and stops are likely concentrated.",
    course: [
      {
        h: "1.1 The basic idea",
        items: [
          "Markets are not simply random sequences of candles — price moves through areas where orders/liquidity are concentrated.",
          "The practical question: where are traders likely to have their stops and pending orders?",
          "Obvious XAUUSD locations: previous highs, previous lows, equal highs, equal lows, Previous Day High, Previous Day Low, Previous Week High, Previous Week Low, session highs/lows, major swing points.",
        ],
      },
      {
        h: "1.2 Market Maker Buy Model",
        items: [
          "Accumulation → manipulation → expansion/distribution. The market first creates or attacks sell-side liquidity, then reverses and expands upward.",
          "XAUUSD application: Daily bias bullish → Asian low established → London opens → Gold aggressively drops through Asian low → PDL sits underneath → Gold takes PDL → strong bullish displacement → MSS → FVG.",
          "That's a much more interesting long than simply buying because gold is bullish.",
        ],
      },
      {
        h: "1.3 Market Maker Sell Model",
        items: [
          "Accumulation → manipulation higher → distribution lower.",
          "Gold: bullish-looking move → takes PDH → rejects → bearish displacement → MSS → FVG → short.",
        ],
      },
      {
        h: "1.4 – 1.6 Accumulation, Manipulation, Distribution",
        items: [
          "Accumulation: price develops a range — not necessarily institutions literally 'accumulating'. For trading: price is establishing a range from which a later expansion may occur. On gold, the Asian session can create a contained range that becomes useful for London/NY liquidity analysis.",
          "Manipulation: the market moves beyond an obvious range boundary — e.g. London takes the Asian LOW, then reverses.",
          "Distribution: the expansion after the manipulation — e.g. Asian range → London SSL sweep → NY bullish expansion. AMD is useful as a framework for understanding price behaviour, not as a rigid strategy.",
        ],
      },
      {
        h: "1.7 – 1.9 Equilibrium, fair value, liquidity runs",
        items: [
          "Equilibrium = the 50% midpoint of a range. Above = premium, below = discount. Critical later with Fibonacci/OTE.",
          "Fair value: price moves away from and returns toward perceived equilibrium — useful for dealing ranges, FVGs, premium/discount, equilibrium and retracements.",
          "Liquidity runs: price approaches an obvious high/low, traders place stops there, price trades through it — then either continues or reverses. The key skill is determining which one.",
        ],
      },
      {
        h: "1.10 XAUUSD takeaway",
        items: ["Don't treat highs and lows simply as support/resistance. Treat them as potential liquidity pools. That change in thinking is fundamental."],
      },
    ],
    notes: [
      "Markets are auction processes, but ICT frames price action through liquidity, dealing ranges and delivery toward objectives.",
      "The early Market Maker Buy/Sell Model describes price accumulating, raiding liquidity and then expanding toward an opposing objective.",
      "Accumulation is a range-building phase; manipulation is the deceptive move through a range boundary; distribution is the directional expansion that follows.",
      "Equilibrium is the 50% point of a meaningful range. Fair value, premium and discount are location concepts within that range.",
      "A liquidity run can reverse after taking stops or continue through them; the reaction after the raid matters more than the raid itself.",
    ],
    gold: [
      "On XAUUSD, Asian-session ranges can become useful references for London and New York liquidity analysis.",
      "A bullish study model might see Gold take the Asian low/PDL, then displace upward and target PDH or another pool of BSL.",
    ],
    mistakes: ["Assuming every range break is manipulation.", "Calling every session an AMD day.", "Thinking the framework reveals a literal private bank algorithm."],
    drill: "On 20 historical Gold sessions, mark the Asian high/low, PDH/PDL, first liquidity raid, and the eventual session direction. Note whether the raid reversed or continued.",
  },
  {
    n: 2,
    title: "2016–2017 Core Content",
    visual: "Core ICT building blocks",
    takeaway:
      "Do not study concepts as isolated signals. The older material becomes more useful when you see how time, liquidity, structure and location work together.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "TIME", c: C.gold },
        { t: "PRICE", c: C.blue },
        { t: "LIQUIDITY", c: C.red },
        { t: "PD ARRAYS", c: C.green },
        { t: "RISK", c: C.slate },
      ],
      note: [
        "Use time to frame when movement is likely.",
        "Use price structure/liquidity to frame where movement may seek.",
        "Use PD arrays to frame location.",
        "Use risk rules to survive uncertainty.",
      ],
    },
    teaches: "Understand the foundational curriculum as a connected framework rather than isolated patterns.",
    course: [
      {
        h: "What the Core Content covers",
        items: [
          "Archival indexes organise it into a long, multi-month curriculum: market structure, liquidity, OTE, order blocks, FVG/imbalances, premium/discount, Market Maker Models, IPDA, intermarket analysis, time/price relationships, risk management.",
        ],
      },
      {
        h: "2.1 Why this material matters",
        items: ["If you jump straight to 'FVG + MSS = entry' you can learn the mechanics without understanding WHY price is moving there. The older material provides the context."],
      },
      {
        h: "2.2 Core Content principle",
        items: ["Higher timeframe → Liquidity → Dealing range → Premium/discount → Time → Price delivery → Execution. That remains relevant to gold."],
      },
    ],
    notes: [
      "Core Content links higher-timeframe context, market structure, liquidity, premium/discount, OTE, order blocks, imbalances, IPDA, intermarket analysis and risk.",
      "The hierarchy matters: higher timeframe → liquidity → dealing range → time → price delivery → execution.",
      "An FVG or OB becomes more meaningful when it sits inside that hierarchy.",
      "The older material explains why modern shorthand such as 'MSS + FVG' is incomplete without context.",
    ],
    gold: ["For Gold, build the Weekly/Daily map first, then use 4H/1H for the active dealing range and 15M/5M for session execution."],
    mistakes: ["Jumping directly to 1M execution.", "Learning definitions without learning narrative.", "Mixing multiple models before one model is testable."],
    drill: "Choose one month of XAUUSD. For every trading day, write the HTF context, nearest external liquidity and the session that produced the largest expansion.",
  },
  {
    n: 3,
    title: "IPDA & Institutional Price Delivery",
    visual: "IPDA / Draw on Liquidity",
    takeaway:
      "Treat IPDA language as a framework for organising price delivery. The practical question is always: which meaningful liquidity pool is price most likely drawing toward?",
    diagram: {
      kind: "ladder",
      levels: [
        { y: 6, t: "EXTERNAL BSL", c: C.red },
        { y: 28, t: "Internal high", c: C.red },
        { y: 40, t: "FVG / imbalance", c: C.blue },
        { y: 50, t: "EQUILIBRIUM 50%", c: C.gold },
        { y: 64, t: "Internal low", c: C.green },
        { y: 78, t: "Old low", c: C.green },
        { y: 94, t: "EXTERNAL SSL", c: C.green },
      ],
      arrow: [80, 26],
      side: [{ t: "Price delivery can move from internal to external liquidity", c: "#e2e8f0" }],
    },
    teaches:
      "Use IPDA as a framework for organising time, price, historical ranges and liquidity — not as a claim that you can observe a literal universal bank algorithm.",
    course: [
      {
        h: "3.1 What is IPDA?",
        items: [
          "ICT uses the Interbank Price Delivery Algorithm as a conceptual framework for thinking about how price moves through time and liquidity.",
          "Don't interpret it as 'ICT has revealed a literal bank algorithm' — that's an overstatement commonly made online.",
          "Use it to study: time, price, liquidity, ranges, institutional dealing, historical highs/lows.",
        ],
      },
      {
        h: "3.2 IPDA data ranges",
        items: ["Examine price within historical windows to ask: where is price relative to significant historical ranges? For XAUUSD this is a higher-timeframe tool — not something to use to enter a 1-minute trade."],
      },
      {
        h: "3.3 XAUUSD application",
        items: ["Combine Daily, Weekly and 20/40/60-day context with major highs, major lows, premium/discount and liquidity. Then ask: what external liquidity is potentially being targeted?"],
      },
    ],
    notes: [
      "Study where current price sits relative to significant historical highs/lows and dealing ranges.",
      "The commonly referenced 20/40/60-day lookbacks are context tools for identifying meaningful historical reference points.",
      "Use historical ranges to ask where external liquidity is located and whether price is in premium or discount.",
      "IPDA context should influence bias and target selection, not become a 1-minute entry trigger.",
    ],
    gold: ["Gold can trade into price-vacuum conditions near major all-time highs. Historical windows help identify the last meaningful external references below price while session structure helps manage new territory."],
    mistakes: ["Treating a lookback window as a guaranteed cycle.", "Forcing a precise target because it lies inside a historical range."],
    drill: "Mark 20-, 40- and 60-trading-day highs/lows on Daily Gold. Note which were later raided and how price behaved around them.",
  },
  {
    n: 4,
    title: "Market Structure",
    visual: "Market structure + MSS",
    takeaway:
      "A short-term bearish retracement does not automatically reverse a bullish Daily structure. Match the structure label to the timeframe you are actually trading.",
    diagram: {
      kind: "tf",
      rows: [
        { t: "DAILY / WEEKLY", sub: "Major structure and external liquidity", c: C.violet },
        { t: "4H / 1H", sub: "Active dealing range and intermediate swings", c: C.gold },
        { t: "15M / 5M / 1M", sub: "Execution structure and MSS/CISD", c: C.green },
      ],
    },
    teaches: "Distinguish long-term, intermediate and short-term structure and learn when a structure change is actually meaningful.",
    course: [
      { h: "4.1 – 4.3 Three layers of structure", items: ["Long-term: Daily/Weekly — major trend and major swings.", "Intermediate: 4H/1H — useful for defining the active dealing range.", "Short-term: 15M/5M/1M — useful for entries."] },
      {
        h: "4.4 Don't confuse them",
        items: ["Daily bullish, 4H bullish, 15M bearish retracement does NOT automatically mean the Daily has turned bearish. The 15M move might simply be taking SSL before continuation."],
      },
      {
        h: "4.5 MSS",
        items: [
          "Bullish reversal: SSL → sweep → displacement → break of short-term high → bullish MSS.",
          "Bearish reversal: BSL → sweep → displacement → break of short-term low → bearish MSS.",
        ],
      },
    ],
    notes: [
      "Weekly/Daily structure defines major swings and broad directional context.",
      "4H/1H structure defines the active dealing range and intermediate narrative.",
      "15M/5M/1M structure is useful for execution and should not overrule the higher timeframe without evidence.",
      "BOS is generally used for a meaningful break in the direction of existing structure; CHoCH/MSS describe a change in prior delivery.",
      "CISD (Change in State of Delivery) is a later term used to recognise a meaningful shift in how price is being delivered; use it alongside liquidity and displacement.",
      "The strongest reversal structure usually appears after a liquidity event and impulsive displacement.",
    ],
    gold: ["Gold often produces violent micro-swings. A 1M bearish break inside a Daily bullish impulse may simply be a retracement into SSL or a bullish PD array."],
    mistakes: ["Calling every candle break MSS.", "Ignoring displacement quality.", "Using one timeframe to define all structure."],
    drill: "Print 30 Gold charts and label Weekly/Daily, 4H/1H and 15M structure separately. Circle cases where lower-timeframe structure reversed without changing the Daily trend.",
  },
  {
    n: 5,
    title: "Liquidity",
    visual: "Liquidity pools and sweeps",
    takeaway:
      "Liquidity is a location, not an entry trigger. Wait for evidence after the raid: displacement, a meaningful structure shift and an aligned PD array.",
    diagram: {
      kind: "path",
      pts: [[0, 40], [12, 22], [22, 46], [32, 24], [44, 52], [56, 36], [66, 70], [72, 86], [80, 66], [92, 44], [100, 30]],
      levels: [
        { y: 18, t: "BSL: equal highs / PDH / swing highs", c: C.red },
        { y: 76, t: "SSL: equal lows / PDL / swing lows", c: C.green },
        { y: 48, t: "Internal liquidity", c: C.slate, x1: 50, x2: 100 },
      ],
      tags: [{ x: 74, y: 94, t: "Sweep below SSL, then reclaim", c: C.gold }],
    },
    teaches: "Map where stops and pending orders are likely concentrated and separate internal from external liquidity. Arguably the heart of ICT.",
    course: [
      { h: "5.1 Buy-side liquidity", items: ["Above highs: PDH, PWH, equal highs, previous swing highs, session highs."] },
      { h: "5.2 Sell-side liquidity", items: ["Below lows: PDL, PWL, equal lows, previous swing lows, session lows."] },
      { h: "5.3 Internal liquidity", items: ["Inside the current dealing range: short-term highs/lows, FVGs, minor swings."] },
      { h: "5.4 External liquidity", items: ["Outside the current range: major Daily high, major Daily low, PWH, PWL."] },
      { h: "5.5 Liquidity sweep", items: ["Price trades through liquidity. Example: PDL = SSL → Gold trades below PDL → then immediately reverses. That's the sweep.", "But: sweep ≠ automatic entry. We need confirmation."] },
    ],
    notes: [
      "BSL commonly rests above equal highs, swing highs, PDH, PWH and session highs.",
      "SSL commonly rests below equal lows, swing lows, PDL, PWL and session lows.",
      "Internal Range Liquidity (IRL) sits inside the active range; External Range Liquidity (ERL) sits beyond the range boundaries.",
      "A sweep/raid means price traded through a liquidity reference. It is not an automatic reversal signal.",
      "Inducement is a smaller obvious reference that may attract positioning before price seeks a larger objective.",
      "The Draw on Liquidity (DOL) is the objective your narrative expects price to seek.",
    ],
    gold: ["Before London and New York, mark Asia high/low, PDH/PDL and the nearest equal highs/lows. Ask which pool is most likely to be attacked first and which larger pool could be the DOL."],
    mistakes: ["Entering at the moment of the sweep.", "Marking every minor high/low as important.", "Confusing a liquidity pool with a guaranteed target."],
    drill: "For 50 Gold sessions, record which of PDH, PDL, Asia high or Asia low was taken first and what price did next.",
  },
  {
    n: 6,
    title: "Premium, Discount & Dealing Ranges",
    visual: "Dealing range / premium / discount",
    takeaway:
      "Premium and discount only have meaning relative to a valid dealing range and directional narrative. Do not buy merely because price is below 50%.",
    diagram: {
      kind: "ladder",
      levels: [
        { y: 6, t: "Range high / ERL", c: C.red },
        { y: 50, t: "50% EQ", c: C.gold },
        { y: 94, t: "Range low / ERL", c: C.green },
      ],
      bands: [
        { y1: 6, y2: 50, t: "PREMIUM", c: C.red },
        { y1: 50, y2: 94, t: "DISCOUNT", c: C.green },
      ],
      side: [
        { t: "Bearish idea: prefer shorts from meaningful premium", c: C.red },
        { t: "Bullish idea: prefer longs from meaningful discount", c: C.green },
      ],
    },
    teaches: "Use a meaningful range to judge whether price is trading at a favourable location for the directional narrative.",
    course: [
      { h: "The dealing range", items: ["Take a meaningful high and low. 50% = equilibrium. Above = PREMIUM, below = DISCOUNT.", "Bullish idea: prefer buying in discount. Bearish idea: prefer selling in premium."] },
      {
        h: "6.1 XAUUSD example",
        items: [
          "Gold: $4,500 high, $4,300 low → midpoint $4,400.",
          "$4,400–$4,500 = premium. $4,300–$4,400 = discount.",
          "If your higher-timeframe bias is bullish, you'd rather see gold retrace into the lower half before looking for longs.",
        ],
      },
      {
        h: "Visual Example 4 — Dealing range, P/D & IRL",
        items: [
          "Bullish narrative: prefer meaningful discount locations and a path toward BSL (ERL).",
          "Bearish narrative: prefer meaningful premium locations and a path toward SSL (ERL).",
          "Do not choose a range simply to make the chart look bullish or bearish.",
        ],
      },
    ],
    notes: [
      "Select a meaningful high and low that define the active dealing range.",
      "The 50% midpoint is equilibrium. Above is premium; below is discount.",
      "Bullish narratives generally prefer buying from discount; bearish narratives generally prefer selling from premium.",
      "Premium/discount is a location filter, not a reversal trigger.",
      "The quality of the selected range matters more than the exact Fibonacci line.",
    ],
    gold: ["Use Daily/4H ranges to avoid buying Gold after a large expansion into premium unless the model explicitly expects continuation toward higher external liquidity."],
    mistakes: ["Choosing a random range that puts price in the preferred half.", "Assuming premium means 'must short' or discount means 'must buy'."],
    drill: "On 20 Gold impulses, mark the dealing range and 50% equilibrium. Record whether the best retracement entry occurred in premium, discount or near equilibrium.",
  },
  {
    n: 7,
    title: "Fibonacci & OTE",
    visual: "OTE (Optimal Trade Entry)",
    takeaway:
      "OTE is a location framework. The highest-quality use combines the retracement zone with liquidity, time, displacement and a PD array — not a Fibonacci number by itself.",
    diagram: {
      kind: "ladder",
      levels: [
        { y: 4, t: "0%", c: C.slate },
        { y: 40, t: "50%", c: C.gold },
        { y: 56, t: "62%", c: C.gold },
        { y: 64, t: "70.5% — central reference", c: C.gold },
        { y: 72, t: "79%", c: C.gold },
        { y: 96, t: "100%", c: C.slate },
      ],
      bands: [{ y1: 56, y2: 72, t: "OTE ZONE 62%–79% · FVG / OB", c: C.gold }],
    },
    teaches: "Use OTE as a retracement-location concept within a larger narrative.",
    course: [
      { h: "7.1 OTE", items: ["The classic ICT OTE zone is approximately 62%–79%. Also mark 70.5% as the central reference."] },
      { h: "7.2 / 7.3 Measuring", items: ["Bullish OTE: measure low → high, then look for a 62–79% retracement.", "Bearish OTE: measure high → low, then look for a 62–79% retracement."] },
      { h: "7.4 But this is critical", items: ["Don't buy OTE simply because price touches it. The better sequence: HTF bias → liquidity → OTE → sweep → MSS → FVG → entry."] },
      { h: "Visual Example 5 — OTE + OB + FVG confluence", items: ["Retracement into the 62%–79% area where an order block and FVG sit → continuation.", "OTE is location. The entry still needs a valid narrative, liquidity event and/or structure confirmation according to the model being tested."] },
    ],
    notes: [
      "The commonly taught ICT OTE zone is approximately 62%–79% retracement, with 70.5% often used as a reference.",
      "For a bullish impulse, measure from meaningful low to high; for bearish, high to low.",
      "OTE is most useful when it aligns with premium/discount, liquidity, an FVG/OB and the expected DOL.",
      "OTE does not create a reversal by itself. Confirmation may still be required by your model.",
    ],
    gold: ["Gold can retrace deeply after large displacement candles. Recalculate position size from stop distance rather than carrying over a fixed lot size."],
    mistakes: ["Redrawing Fibonacci until price fits OTE.", "Entering because price touched 70.5%.", "Measuring insignificant micro-swings."],
    drill: "Backtest 30 Gold impulses and compare outcomes when OTE aligned with a liquidity sweep and structure shift versus OTE alone.",
  },
  {
    n: 8,
    title: "Fair Value Gaps & Imbalances",
    visual: "Fair Value Gap anatomy",
    takeaway:
      "The important clue is the displacement that creates the imbalance. An FVG without context is only a marked area; it is not an automatic trade.",
    diagram: { kind: "flow", steps: [{ t: "Candle 1", c: C.slate }, { t: "Displacement candle", c: C.green }, { t: "Candle 3", c: C.slate }, { t: "Retracement may rebalance part or all of the gap", c: C.blue }] },
    teaches: "Identify imbalances created by rapid price delivery and learn which ones deserve attention.",
    course: [
      { h: "8.1 What is an FVG?", items: ["An imbalance created by aggressive price movement. A three-candle structure creates a gap between the first and third candle's relevant wicks/bodies."] },
      { h: "8.2 / 8.3 Bullish & bearish", items: ["Bullish FVG: created during strong upward displacement; price may later retrace into it.", "Bearish FVG: created during strong downward displacement; price may later retrace into it."] },
      { h: "8.4 The best FVG", items: ["Not 'any FVG'. Instead: liquidity sweep → displacement → MSS → FVG. That FVG now has a narrative."] },
      { h: "8.5 Consequent Encroachment", items: ["The 50% midpoint of the FVG. Useful as a reference."] },
      { h: "8.6 Gold", items: ["Gold's large displacement candles can create very visible FVGs — but volatility also creates an enormous number of meaningless small imbalances.", "Higher-timeframe FVG + meaningful displacement > tiny 1M FVG."] },
      {
        h: "Visual Example 3 — What to look for",
        items: [
          "Three-candle imbalance; the gap is between candle 1 and candle 3 wicks.",
          "Strong displacement creates the imbalance.",
          "The FVG is a location/reference, not a guaranteed reaction.",
          "CE is the 50% midpoint of the FVG.",
          "Context matters: liquidity + structure + time + DOL should come first.",
        ],
      },
    ],
    notes: [
      "An FVG is a three-candle imbalance created when price moves aggressively enough to leave inefficient overlap between candle 1 and candle 3.",
      "Bullish FVGs form during upward displacement; bearish FVGs during downward displacement.",
      "Consequent Encroachment (CE) is the 50% midpoint of the FVG.",
      "An Inversion FVG (IFVG) is a failed FVG that can become an opposing reference.",
      "A Balanced Price Range (BPR) can form where opposing imbalances overlap.",
      "Liquidity voids and volume imbalances are related inefficiency concepts; use them as context rather than automatic entries.",
      "BISI/SIBI terminology describes directional imbalance: buy-side imbalance / sell-side inefficiency and the inverse.",
    ],
    gold: ["Gold creates many FVGs in high-volatility sessions. Prioritise FVGs created by clear displacement at meaningful liquidity and within the correct timeframe narrative."],
    mistakes: ["Marking every small FVG.", "Assuming every FVG must fill.", "Ignoring whether the FVG caused or followed meaningful structure change."],
    drill: "Collect 50 XAUUSD FVGs. Grade each by HTF alignment, liquidity event, displacement quality and whether it led to a clean reaction.",
  },
  {
    n: 9,
    title: "Order Blocks",
    visual: "Order block",
    takeaway:
      "Do not label every final opposite candle as an order block. Prioritise the candle/range that is tied to real displacement, a structure event and relevant liquidity.",
    diagram: {
      kind: "path",
      pts: [[0, 30], [14, 42], [26, 56], [36, 70], [44, 62], [56, 36], [70, 18], [80, 40], [88, 60], [100, 22]],
      levels: [{ y: 66, t: "Last meaningful down candle before bullish displacement", c: C.violet, x1: 30, x2: 100 }],
      tags: [{ x: 86, y: 76, t: "Possible mitigation / revisit", c: C.gold }],
    },
    teaches: "Use order blocks as contextual price-delivery arrays rather than 'last opposite candle' signals.",
    course: [
      { h: "9.1 / 9.2 Definitions", items: ["Bullish OB: a relevant bearish candle preceding bullish displacement.", "Bearish OB: a relevant bullish candle preceding bearish displacement."] },
      { h: "9.3 Don't mark every candle", items: ["The OB should have a reason to matter: liquidity → displacement → structure → OB."] },
      { h: "9.4 Gold example", items: ["PDL gets swept → Gold explodes upward → the last relevant bearish candle before the expansion becomes a potential bullish OB → price later retraces there.", "If FVG + OB + OTE align: interesting setup."] },
    ],
    notes: [
      "A bullish OB is a relevant bearish candle/zone preceding meaningful bullish displacement; a bearish OB is the corresponding bullish candle/zone before bearish displacement.",
      "The exact candle boundaries you use must be defined consistently in your model.",
      "Strong OBs usually have a reason to matter: liquidity was taken, displacement followed, structure changed, and the zone fits premium/discount.",
      "OBs can overlap FVGs, OTE or other PD arrays to create confluence.",
      "Rejection blocks and propulsion blocks are related ICT array terms; learn them only after mastering the core OB/FVG/liquidity framework.",
    ],
    gold: ["A Gold OB after a PDL sweep and strong bullish displacement is more meaningful than a random 1M bearish candle inside chop."],
    mistakes: ["Labeling every last down/up candle.", "Ignoring context.", "Using an OB as the only reason for entry."],
    drill: "On 20 strong Gold displacement moves, mark the pre-displacement candle/zone and record whether later mitigation produced a reaction.",
  },
  {
    n: 10,
    title: "Breakers & Mitigation",
    visual: "Breaker vs mitigation",
    takeaway:
      "The failure is the information. A breaker is stronger when the violation is linked to a liquidity event and decisive displacement, not a tiny wick through a box.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "1. ORIGINAL ORDER BLOCK", sub: "Expected to hold", c: C.violet },
        { t: "2. FAILURE / BREAK", sub: "Price trades through it", c: C.red },
        { t: "3. BREAKER REFERENCE", sub: "Failed block can act from the opposite side on revisit", c: C.gold },
      ],
      note: ["Mitigation = revisit to rebalance / manage prior institutional positioning.", "Breaker = failed block that changes role after a decisive violation."],
    },
    teaches: "Understand how failed arrays and revisits to prior references can become tradable context. These are advanced.",
    course: [
      {
        h: "Breaker & mitigation",
        items: [
          "Breaker: an order block fails and subsequently becomes a potential opposing reference.",
          "Mitigation: price returns to a prior institutional reference before continuing/rebalancing.",
          "For the Gold system: don't make either mandatory. First master Liquidity → MSS → FVG. Then add OB → breaker → mitigation.",
        ],
      },
    ],
    notes: [
      "A Breaker is a failed order-block reference that can later function as an opposing array after structure changes.",
      "Mitigation describes price revisiting a prior institutional reference/array before continuation or rebalancing.",
      "A breaker is stronger when its failure is connected to liquidity and displacement.",
      "Mitigation is not mandatory for every trade; sometimes price never returns.",
    ],
    gold: ["On Gold, breaker/mitigation setups can be very fast. Use the lower timeframe only after the higher-timeframe narrative is defined."],
    mistakes: ["Assuming every failed OB becomes a breaker.", "Waiting for mitigation when price has already confirmed and left without a valid retracement model."],
    drill: "Find 15 Gold breakers and 15 mitigation examples. Record the liquidity context and whether the return happened in a tested session.",
  },
  {
    n: 11,
    title: "Power of Three / AMD",
    visual: "Power of Three / AMD",
    takeaway:
      "AMD describes a broad three-phase delivery pattern. On Gold, the manipulation leg often appears around a session open or news event, but it must still be confirmed by price action.",
    diagram: {
      kind: "path",
      phases: ["Accumulation", "Manipulation", "Distribution"],
      pts: [[0, 50], [8, 44], [16, 54], [24, 46], [30, 52], [38, 82], [46, 60], [60, 40], [76, 26], [100, 8]],
      levels: [{ y: 58, t: "Liquidity below range", c: C.red, x1: 0, x2: 44 }],
    },
    teaches: "Understand Accumulation → Manipulation → Distribution as a session and dealing-range framework.",
    course: [
      { h: "A · M · D", items: ["A — Accumulation: range.", "M — Manipulation: liquidity raid / deceptive move.", "D — Distribution: expansion."] },
      { h: "Gold example", items: ["Asia → accumulation. London → manipulation. New York → distribution.", "But don't force this pattern onto every day."] },
    ],
    notes: [
      "Accumulation: price develops a range or balanced condition.",
      "Manipulation: price makes a deceptive move or raids liquidity outside the range.",
      "Distribution: price expands in the intended direction toward liquidity.",
      "AMD can occur on multiple timeframes; the Daily candle itself can be studied through opening price, manipulation and expansion.",
      "Do not force AMD onto every day. Some days trend directly or remain balanced.",
    ],
    gold: ["A common Gold study sequence is Asia range → London raid → New York expansion, but the exact session roles can reverse."],
    mistakes: ["Treating every Asian range as accumulation.", "Assuming the first sweep must reverse.", "Ignoring high-impact news that changes the session structure."],
    drill: "Classify 50 Gold days as clear AMD, trend day, range day or unclear. Compare the best-performing entry model in each regime.",
  },
  {
    n: 12,
    title: "Judas Swing",
    visual: "Judas Swing",
    takeaway:
      "The Judas Swing is not simply the first move after an open. The useful pattern is a deceptive liquidity move followed by evidence that delivery has shifted in the opposite direction.",
    diagram: {
      kind: "path",
      pts: [[0, 56], [10, 52], [18, 56], [28, 34], [36, 14], [44, 30], [54, 56], [66, 66], [80, 78], [100, 92]],
      levels: [
        { y: 22, t: "BSL", c: C.red, x1: 20, x2: 60 },
        { y: 54, t: "Opening range / reference", c: C.slate, x1: 0, x2: 50 },
      ],
      tags: [
        { x: 30, y: 8, t: "False expansion / liquidity raid", c: C.gold },
        { x: 84, y: 96, t: "True delivery", c: C.green },
      ],
    },
    teaches: "Identify the deceptive move against the eventual directional delivery.",
    course: [
      {
        h: "A deceptive move against the eventual direction",
        items: [
          "Bullish day: Gold initially falls → traders become bearish → SSL gets taken → MSS → bullish expansion.",
          "Bearish day: Gold initially rallies → BSL gets taken → MSS → bearish expansion.",
          "Especially useful for understanding why the first major session move isn't necessarily the day's true direction.",
        ],
      },
    ],
    notes: [
      "A bullish-day Judas Swing can push down first, raid SSL and then reverse higher.",
      "A bearish-day Judas Swing can push up first, raid BSL and then reverse lower.",
      "The first major session move is not necessarily the true Daily direction.",
      "The move should be interpreted in relation to time, liquidity and the Daily narrative.",
    ],
    gold: ["Gold frequently reacts around London and New York participation. Use the Judas idea only when the initial move takes meaningful liquidity and subsequent displacement confirms."],
    mistakes: ["Calling any early-session retracement a Judas Swing.", "Entering before the deceptive move is confirmed as failed."],
    drill: "Review 30 Gold days with strong directional closes. Mark the first major session move and determine whether it functioned as a Judas-style liquidity raid.",
  },
  {
    n: 13,
    title: "Time & Session Models",
    visual: "Time and session model",
    takeaway:
      "Use session windows as context for when liquidity is likely to be attacked. Time does not replace the need for a clear liquidity event and displacement.",
    diagram: {
      kind: "path",
      phases: ["ASIA", "LONDON", "NEW YORK"],
      pts: [[0, 50], [8, 42], [16, 54], [24, 44], [32, 50], [40, 76], [48, 58], [60, 40], [74, 30], [88, 18], [100, 8]],
      levels: [
        { y: 40, t: "Asia high / BSL", c: C.red, x1: 0, x2: 34 },
        { y: 58, t: "Asia low / SSL", c: C.green, x1: 0, x2: 44 },
      ],
      tags: [
        { x: 40, y: 88, t: "London raid", c: C.gold },
        { x: 86, y: 6, t: "NY continuation / DOL", c: C.green },
      ],
    },
    teaches: "Learn to use time as a filter for when liquidity and volatility are most likely to become active. This is crucial for XAUUSD.",
    course: [
      { h: "Mark the ranges", items: ["Mark the Asian range, London range and New York range. Then observe: who takes whose liquidity?"] },
      { h: "13.1 – 13.3 Session roles", items: ["Asian session: potential range creation.", "London: potential manipulation/expansion.", "New York: potential continuation or reversal."] },
      {
        h: "13.4 Silver Bullet",
        items: [
          "A later ICT model that formalises a specific time window and FVG-based execution. ICT's official 2023 material explicitly calls it the Silver Bullet Time Based Trading Model.",
          "For gold: test it. Don't assume the same statistics apply as the instruments ICT demonstrated.",
        ],
      },
      { h: "Visual Example 6 — Asian range → raid → London", items: ["Study question: which side of Asia was taken first, and did price then displace and shift structure? Session behaviour is not guaranteed."] },
    ],
    notes: [
      "Track the Asian range, London activity, New York AM activity and later-session behaviour.",
      "ICT killzones and time windows are filters; they are not entries.",
      "Use New York local time consistently when studying ICT models, and account for daylight-saving changes when converting to South African time or broker-server time.",
      "Opening prices, session highs/lows and timed macro events can become key references.",
      "NDOG/NWOG (New Day/New Week Opening Gap) are later ICT gap references used in some modern analysis; treat them as contextual PD arrays.",
    ],
    gold: ["Gold responds strongly to London liquidity and US macro releases. Session timing should be combined with PDH/PDL, Asian range, DOL and structure."],
    mistakes: ["Using the clock as the entry trigger.", "Mixing timezones.", "Ignoring daylight-saving changes."],
    drill: "Create a journal column for New York time. For 30 sessions, record the time of the first meaningful sweep, displacement and final session high/low.",
  },
  {
    n: 14,
    title: "Daily Bias & Draw on Liquidity",
    visual: "Daily bias + draw on liquidity",
    takeaway: "Daily bias is a probability framework, not a prediction. If the draw on liquidity is unclear, the correct decision can be to stand aside.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "WEEKLY", sub: "context", c: C.violet },
        { t: "DAILY", sub: "structure", c: C.blue },
        { t: "4H", sub: "location", c: C.gold },
        { t: "SESSION", sub: "liquidity", c: C.red },
        { t: "DOL", sub: "target", c: C.green },
      ],
      note: ["Bullish narrative: wait for a discounted retracement, then target the most logical buy-side liquidity (PWH / equal highs / old daily high)."],
    },
    teaches: "Build a pre-session directional narrative and identify the objective that would validate it. This is where everything starts becoming a coherent strategy.",
    course: [
      {
        h: "Daily bias asks",
        items: ["What is the most probable directional narrative today?", "Consider: Weekly structure, Daily structure, 4H structure, liquidity, premium/discount, FVGs, previous day, previous week, macro, session."],
      },
      {
        h: "Draw on liquidity",
        items: ["Ask: where is price likely trying to go?", "Example: Gold is bullish. Above sit PWH, equal highs, an old Daily high — that's your potential draw. You then wait for an entry during a retracement."],
      },
    ],
    notes: [
      "Bias combines Weekly/Daily/4H structure, liquidity, premium/discount, major PD arrays, previous-day/week levels, time and macro conditions.",
      "The DOL is the liquidity objective price is likely to seek if the narrative is correct.",
      "Write both bullish and bearish scenarios; define what price must do to activate each.",
      "A good bias is conditional, not a prediction that must be defended.",
    ],
    gold: ["For Gold, a bullish DOL might be PDH, PWH, equal highs or an old Daily high. A bearish DOL might be PDL, PWL, equal lows or a major Daily low."],
    mistakes: ["Changing bias after every 1M candle.", "Having a direction but no target.", "Ignoring what would invalidate the narrative."],
    drill: "Before each Gold session, write: HTF bias, DOL, invalidation, preferred liquidity event and no-trade condition.",
  },
  {
    n: 15,
    title: "SMT & Intermarket Analysis",
    visual: "SMT divergence: Gold vs Silver",
    takeaway: "SMT is a divergence clue, not a standalone entry. Combine it with a liquidity raid, displacement, MSS/CISD and a tradable PD array.",
    diagram: { kind: "smt" },
    teaches: "Use divergence and related markets as confirmation/context, not as automatic signals.",
    course: [
      {
        h: "15.1 Gold vs Silver",
        items: [
          "The most obvious SMT relationship for gold.",
          "Bullish divergence: Gold makes a new low, Silver doesn't → potential bullish SMT.",
          "Bearish: Gold makes a new high, Silver doesn't → potential bearish SMT.",
        ],
      },
      { h: "15.2 Gold vs DXY", items: ["Not technically the same as SMT, but extremely useful. Generally DXY ↓ → Gold ↑ is supportive; DXY ↑ → Gold ↓ is supportive. Divergence can be informative."] },
      { h: "15.3 Gold vs yields", items: ["Watch US10Y and eventually real yields. Higher real yields can create headwinds for gold; falling yields can be supportive. Context, not an entry signal."] },
      { h: "Visual Example 7 — How to use it", items: ["Look for SMT at meaningful liquidity and then demand price confirmation: displacement, MSS/CISD and a tradable PD array."] },
    ],
    notes: [
      "SMT divergence compares correlated markets that fail to confirm each other at a meaningful high/low.",
      "For precious metals, Gold vs Silver is the most intuitive pair.",
      "Potential bullish SMT: Gold makes a lower low while Silver does not. Potential bearish SMT: Gold makes a higher high while Silver does not.",
      "DXY is useful macro/intermarket context because Gold often has an inverse relationship with the US dollar, but this is not a perfect tick-for-tick relationship.",
      "US Treasury yields and especially real yields can influence Gold through opportunity-cost and policy expectations.",
    ],
    gold: ["Use Gold/Silver SMT only at meaningful liquidity and then demand Gold price confirmation such as displacement and MSS/CISD."],
    mistakes: ["Trading divergence without liquidity context.", "Assuming DXY and Gold are always perfectly inverse."],
    drill: "Collect 25 Gold/Silver SMT examples around PDH/PDL or major session liquidity. Record whether Gold produced a confirming MSS/FVG afterwards.",
  },
  {
    n: 16,
    title: "2020–2021 Mentorship",
    visual: "2020–2021 mentorship bridge",
    takeaway: "Study the continuity of the ideas rather than memorising a different strategy for each mentorship year.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "DAILY BIAS", c: C.violet },
        { t: "LIQUIDITY", c: C.red },
        { t: "OTE / FVG", c: C.gold },
        { t: "SMT", c: C.blue },
        { t: "SESSION TIMING", c: C.green },
        { t: "RISK", c: C.slate },
      ],
      note: ["FOUNDATION → MODERN EXECUTION. This period connects older market-maker language with the cleaner liquidity / structure / FVG execution framework that became more prominent later."],
    },
    teaches: "Use this period to understand how older core concepts were refined into the modern execution language.",
    course: [
      {
        h: "What to extract",
        items: [
          "Daily bias, liquidity, FVGs, OTE, market structure, SMT, Market Maker Models, session timing, intermarket analysis, risk management.",
          "Why study it? You can see ICT refining terminology and execution. Rather than memorising '2022 says X', you understand 'this concept existed earlier and was refined into X' — a much stronger understanding.",
        ],
      },
    ],
    notes: [
      "Key recurring themes include Daily bias, liquidity, FVGs, OTE, structure, SMT, Market Maker Models, session timing and risk.",
      "The value of studying this period is conceptual continuity: modern models were not created from nothing; they reorganise older concepts.",
      "Compare terminology across eras instead of arguing over labels.",
    ],
    gold: ["For Gold, extract repeatable principles rather than copying an instrument-specific setup that was demonstrated elsewhere."],
    mistakes: ["Memorising year-specific terminology without understanding the underlying price behaviour."],
    drill: "Choose five concepts from this section and find one Gold example of each on Daily/15M data.",
  },
  {
    n: 17,
    title: "2022 Mentorship",
    visual: "2022 core execution sequence",
    takeaway:
      "For XAUUSD, demand clean context because Gold can create large candles and apparent structure shifts purely from volatility. Location and liquidity must come first.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "HTF BIAS", c: C.violet },
        { t: "LIQUIDITY", c: C.red },
        { t: "SWEEP", c: C.gold },
        { t: "DISPLACEMENT", c: C.green },
        { t: "MSS", c: C.blue },
        { t: "FVG", c: C.gold },
        { t: "TARGET", c: C.green },
      ],
      note: ["The sequence is the model. A single FVG or MSS is not the model."],
    },
    teaches: "Learn the streamlined modern sequence many traders use for execution.",
    course: [
      {
        h: "What 2022 consolidates",
        items: [
          "Liquidity, market structure, FVG, order blocks, OTE, premium/discount, daily bias, AMD, Judas, SMT, session timing, risk management.",
          "Gold application — the core sequence: HTF bias → liquidity → sweep → displacement → MSS → FVG → retracement → entry → liquidity target.",
        ],
      },
      { h: "Visual Examples 1 & 2", items: ["Read it in order: HTF bullish context → SSL taken → displacement → MSS/CISD → FVG/PD array → retracement → defined invalidation → draw on liquidity. A sweep alone is not the entry.", "The bearish model is the mirror image: BSL sweep → bearish displacement → MSS → bearish FVG → retrace/entry → DOL sell-side liquidity."] },
    ],
    notes: [
      "The core workflow: HTF bias → liquidity → sweep → displacement → MSS → FVG → retracement → entry → liquidity target.",
      "2022 material emphasises reading price in context rather than blindly trading named patterns.",
      "The FVG is typically the execution location after displacement; it is not the starting point of the analysis.",
    ],
    gold: ["For Gold, the same sequence can be applied around PDL/PDH, Asian range liquidity and major Daily/4H levels."],
    mistakes: ["Reducing the entire model to 'MSS + FVG'.", "Ignoring the DOL."],
    drill: "Backtest one 2022-style sequence on Gold for at least 50 examples using fixed rules for sweep, MSS and FVG entry.",
  },
  {
    n: 18,
    title: "2023 Mentorship & Silver Bullet",
    visual: "Silver Bullet",
    takeaway:
      'Silver Bullet is time-based, but not "buy at this time." The tradable idea still requires a liquidity event, decisive repricing and a valid imbalance/PD array.',
    diagram: {
      kind: "flow",
      steps: [
        { t: "TIME WINDOW", sub: "Window starts", c: C.violet },
        { t: "LIQUIDITY", sub: "Liquidity raid", c: C.red },
        { t: "DISPLACEMENT", c: C.green },
        { t: "MSS / CISD", c: C.blue },
        { t: "FVG RETRACE", sub: "FVG entry", c: C.gold },
      ],
    },
    teaches: "Understand the Silver Bullet as a time-based liquidity and FVG model, not a clock-based automatic trade.",
    course: [
      {
        h: "The Silver Bullet",
        items: [
          "ICT's official video presents it as a time-based trading model; a later official lesson demonstrates an evolving Silver Bullet example.",
          "The important lesson is: time + liquidity + displacement + FVG. Not 'at this exact time, buy'.",
          "Commonly studied windows: 03:00–04:00, 10:00–11:00 and 14:00–15:00 New York time.",
        ],
      },
    ],
    notes: [
      "The model combines a defined one-hour window with a counter-bias liquidity sweep, displacement and an FVG.",
      "Workflow: establish Daily bias → wait for the window → let price take opposing liquidity → require displacement → identify the FVG → enter on retracement if risk and DOL are clear.",
      "The time window filters opportunity; the liquidity and displacement provide the setup.",
      "Performance on one instrument should not be assumed to transfer to Gold.",
    ],
    gold: ["Gold should be independently backtested because its volatility, spreads and macro sensitivity differ from index futures."],
    mistakes: ["Trading every Silver Bullet window.", "Entering without a sweep or displacement.", "Using another market's statistics as if they apply to XAUUSD."],
    drill: "Backtest at least 60 Gold Silver-Bullet windows and record setup frequency, win rate, average R, MAE/MFE and whether high-impact news was present.",
  },
  {
    n: 19,
    title: "2024+ / Later ICT Teaching",
    visual: "Later teaching / refinements",
    takeaway: "Treat newer labels as refinements of the core price-delivery story. Do not let terminology replace the hierarchy of context → liquidity → time → displacement → execution.",
    diagram: { kind: "hub", center: "CORE FRAMEWORK", spokes: ["CISD · change in delivery", "IFVG · failed imbalance", "INDUCEMENT · internal liquidity", "MODEL REFINEMENT · context first"], note: "Liquidity + displacement + structure + PD arrays" },
    teaches: "Keep the framework current without abandoning the foundations.",
    course: [
      {
        h: "Don't freeze ICT's framework in 2022",
        items: [
          "Later teaching continues refining the concepts and introducing/reframing models. Use later material to answer: has ICT changed the model? Has terminology changed? Which concepts became more / less important? What does he emphasise in actual contemporary chart analysis?",
          "Always distinguish ICT's own teaching from third-party 'ICT strategy' interpretations.",
        ],
      },
    ],
    notes: [
      "The official ICT channel released a substantial 2024 mentorship series, continuing the emphasis on time, price delivery, chart annotation and disciplined study.",
      "Later terminology includes CISD, IFVG, opening gaps (NDOG/NWOG) and more granular gap/price-array analysis.",
      "Later material should refine your model, not cause you to abandon a tested core every time a new term appears.",
      "Incorporate a new concept by defining it objectively and testing whether it improves expectancy or clarity.",
      "Source note: original ICT material should be the primary source for terminology and intent; later community summaries can be useful.",
    ],
    gold: ["For Gold, later concepts can be layered onto the same foundation: HTF context, DOL, session timing, liquidity, displacement and execution."],
    mistakes: ["Collecting terminology instead of improving execution.", "Changing the model before collecting enough data."],
    drill: "Add one later concept at a time to your Gold journal and compare results with/without it.",
  },
  {
    n: 20,
    title: "ICT Market-Maker Models / MMXM",
    visual: "Market Maker Models / MMXM",
    takeaway: "MMXM is a higher-timeframe narrative model. Use it to organise sequences across dealing ranges; do not treat it as a precise entry trigger by itself.",
    diagram: {
      kind: "path",
      phases: ["Accumulation", "Manipulation", "Expansion", "Re-accum / re-distribution", "External liquidity"],
      pts: [[0, 78], [8, 72], [14, 80], [20, 86], [28, 64], [40, 52], [48, 58], [56, 50], [62, 56], [74, 32], [88, 18], [100, 6]],
      levels: [
        { y: 82, t: "Dealing range A", c: C.blue, x1: 0, x2: 26 },
        { y: 54, t: "Dealing range B", c: C.violet, x1: 38, x2: 66 },
      ],
    },
    teaches: "View price as a larger sequence across multiple dealing ranges rather than a single entry pattern.",
    course: [
      {
        h: "A deeper framework",
        items: [
          "Instead of merely saying 'price swept liquidity', understand the larger market-making sequence: accumulation → manipulation → distribution → re-accumulation/re-distribution across multiple dealing ranges.",
          "XAUUSD bearish MMXM: Daily premium → BSL → distribution → bearish expansion → SSL.",
          "Much more of a higher-timeframe narrative model than an entry trigger.",
        ],
      },
    ],
    notes: [
      "MMXM identifies larger accumulation/manipulation/distribution and re-accumulation/re-distribution sequences.",
      "A bullish sequence may begin from discount/SSL and progress toward external BSL; bearish is the inverse.",
      "The model can contain multiple internal dealing ranges before reaching the final external objective.",
      "Use MMXM primarily for narrative and target selection; lower-timeframe entries still require their own confirmation.",
    ],
    gold: ["Gold's strong multi-session trends can be easier to understand when you track how London/NY expansions fit inside a larger Daily MMXM."],
    mistakes: ["Forcing a perfect schematic onto every trend.", "Using MMXM as a precise entry trigger."],
    drill: "Map one month of Gold on 4H/15M and draw the nested dealing ranges from major SSL to BSL or vice versa.",
  },
  {
    n: 21,
    title: "News & Macroeconomic Events",
    visual: "News / macro event model",
    takeaway: "Do not chase the first CPI/NFP/FOMC spike. Let the event create volatility, then use the ICT framework to assess whether a real liquidity raid and repricing occurred.",
    diagram: {
      kind: "path",
      pts: [[0, 46], [10, 50], [20, 44], [30, 48], [38, 86], [44, 40], [50, 66], [60, 50], [72, 34], [86, 22], [100, 10]],
      levels: [{ y: 60, t: "SSL / stop pool", c: C.red, x1: 18, x2: 54 }],
      tags: [
        { x: 38, y: 96, t: "News volatility raids liquidity", c: C.gold },
        { x: 82, y: 6, t: "Displacement + structure confirmation", c: C.green },
      ],
    },
    teaches: "Understand how scheduled catalysts affect Gold volatility and how to protect execution quality. For gold this is essential.",
    course: [
      { h: "Watch", items: ["CPI, PCE, NFP, FOMC, Fed speeches, PPI, GDP, retail sales, unemployment data."] },
      { h: "News model", items: ["Don't chase the CPI spike. Instead: liquidity raid → displacement → MSS → FVG → retracement.", "The news can provide the volatility; ICT structure can provide the framework."] },
    ],
    notes: [
      "Key releases include CPI, PCE, NFP, FOMC decisions/press conferences, PPI, GDP, retail sales and labour-market data.",
      "News can provide the volatility that raids liquidity and creates displacement, but the first spike is not automatically the trade.",
      "If your model requires structure confirmation, wait for it even during news.",
      "Spreads, slippage and candle ranges can expand sharply around releases.",
    ],
    gold: ["Gold is particularly sensitive to US inflation, labour data, Fed expectations and the dollar/yield response."],
    mistakes: ["Chasing the first macro candle.", "Using normal stop assumptions during abnormal volatility.", "Ignoring the economic calendar."],
    drill: "Add a news flag to every backtest. Compare Gold setup performance on high-impact vs ordinary sessions.",
  },
  {
    n: 22,
    title: "Gold / XAUUSD Fundamentals",
    visual: "Gold fundamental context",
    takeaway: "Gold can move with or against the usual USD/yield relationships for periods of time. Treat macro as context, not an automatic entry signal.",
    diagram: { kind: "hub", center: "XAUUSD GOLD", spokes: ["DXY / USD", "REAL YIELDS", "FED EXPECTATIONS", "RISK / FLOWS"], note: "Context relationships are not deterministic. Use fundamentals to understand the environment; use price action to execute." },
    teaches: "Separate the technical ICT framework from the macro forces that influence Gold. This isn't necessarily ICT — it's separated deliberately.",
    course: [
      {
        h: "Gold is affected by",
        items: ["US dollar, real yields, nominal yields, Federal Reserve expectations, inflation expectations, central-bank demand, geopolitical risk, risk sentiment, investment flows."],
      },
      { h: "Why this matters", items: ["ICT gives you HOW to read price. Fundamentals help explain WHY the environment may be bullish/bearish. Don't mix the two."] },
    ],
    notes: [
      "Drivers include the US dollar, nominal yields, real yields, Federal Reserve expectations, inflation expectations, central-bank demand, geopolitical risk, risk sentiment and investment flows.",
      "Higher real yields can be a headwind for Gold; falling real yields can be supportive, but relationships change by regime.",
      "Central-bank buying and geopolitical demand can support Gold even when short-term dollar/yield relationships appear unusual.",
      "Fundamentals provide environment/context; your price model provides execution.",
    ],
    gold: ["Use macro context to decide when a Daily bullish or bearish narrative deserves extra caution, not to bypass the chart confirmation process."],
    mistakes: ["Treating one macro relationship as permanent.", "Trading a macro opinion without technical invalidation."],
    drill: "For 20 major Gold days, record DXY, US10Y/real-yield direction, major news and whether technical DOL aligned with macro pressure.",
  },
  {
    n: 23,
    title: "Gold-Specific ICT Models",
    visual: "Gold-specific ICT models",
    takeaway:
      'These are study models for applying ICT concepts to Gold, not an official guaranteed "Gold strategy." Backtest each model separately and keep the context-to-execution hierarchy intact.',
    diagram: {
      kind: "grid",
      items: [
        "PDL SWEEP LONG · PDL/SSL → sweep → MSS → FVG → PDH",
        "PDH SWEEP SHORT · PDH/BSL → sweep → MSS → FVG → PDL",
        "ASIA RAID · Asia high/low → London raid → shift → expansion",
        "OTE REVERSAL · HTF impulse → 62–79% → raid → MSS → FVG",
        "SMT REVERSAL · Gold/Silver divergence → raid → confirmation",
        "SILVER BULLET · Time window → liquidity → displacement → FVG",
      ],
    },
    teaches: "Convert the framework into a small number of repeatable Gold setups. Now we combine everything.",
    course: [
      {
        h: "Models A – G",
        items: [
          "A · PDL Sweep Long: PDL → SSL sweep → MSS → FVG → long → PDH/BSL.",
          "B · PDH Sweep Short: PDH → BSL sweep → MSS → FVG → short → PDL/SSL.",
          "C · Asian Low Raid: Asian low → London sweep → MSS → FVG → long.",
          "D · Asian High Raid: Asian high → London sweep → MSS → FVG → short.",
          "E · OTE Reversal: HTF impulse → 62–79% → liquidity sweep → MSS → FVG.",
          "F · SMT Reversal: Gold/Silver divergence → liquidity sweep → MSS → FVG.",
          "G · Silver Bullet: specific time window → liquidity → displacement → FVG.",
        ],
      },
    ],
    notes: [
      "PDL Sweep Long: bullish context → PDL/SSL raid → displacement → MSS/CISD → FVG/OB retracement → PDH/BSL.",
      "PDH Sweep Short: bearish context → PDH/BSL raid → bearish displacement → structure shift → FVG/OB → PDL/SSL.",
      "Asian Low Raid Long and Asian High Raid Short use session liquidity as the initial event.",
      "OTE Reversal/Continuation adds retracement location to the liquidity/structure sequence.",
      "SMT Reversal uses Gold/Silver divergence as confirmation.",
      "Silver Bullet uses a defined time window with liquidity, displacement and FVG execution.",
      "Unicorn-style confluence is commonly used in ICT communities for overlapping breaker/FVG structure; treat it as an advanced confluence idea and define your exact rules before testing.",
    ],
    gold: ["Do not trade all models at once. Pick one, define exact rules, backtest it, then add another only if necessary."],
    mistakes: ["Model-hopping.", "Taking a setup without HTF narrative.", "Using a different definition of MSS/FVG on every trade."],
    drill: "Choose ONE Gold model and collect 50–100 samples before evaluating it.",
  },
  {
    n: 24,
    title: "XAUUSD Multi-Timeframe Analysis",
    visual: "Multi-timeframe analysis",
    takeaway: "Higher timeframes tell you the story and location. Lower timeframes refine execution. Do not let a 1-minute pattern override an opposing Daily narrative without strong evidence.",
    diagram: {
      kind: "tf",
      rows: [
        { t: "WEEKLY", sub: "Major liquidity / long-term range", c: C.violet },
        { t: "DAILY", sub: "Bias, PDH/PDL, daily PD arrays", c: C.blue },
        { t: "4H / 1H", sub: "Dealing range and narrative", c: C.gold },
        { t: "15M", sub: "Sweep, displacement, MSS, FVG", c: C.red },
        { t: "5M / 1M", sub: "Execution refinement", c: C.green },
      ],
    },
    teaches: "Make each timeframe answer a different question.",
    course: [
      {
        h: "How to structure your chart",
        items: [
          "Weekly — find PWH, PWL, major swings, major FVG, long-term dealing range.",
          "Daily — find PDH, PDL, Daily FVG, Daily OB, premium/discount, draw on liquidity.",
          "4H — find current dealing range, OTE, liquidity, structure.",
          "1H — build the intraday narrative.",
          "15M — find sweep, MSS, displacement, FVG.",
          "5M/1M — execution refinement.",
        ],
      },
    ],
    notes: [
      "Weekly: major external liquidity, broad dealing range, long-term premium/discount.",
      "Daily: structure, PDH/PDL, Daily FVG/OB, DOL.",
      "4H: active dealing range, intermediate liquidity, OTE/premium/discount.",
      "1H: intraday narrative and session path.",
      "15M: sweep, displacement, MSS/CISD and tradable PD array.",
      "5M/1M: execution refinement only after the higher-timeframe case exists.",
    ],
    gold: ["Gold's 1M chart can be extremely noisy. If the setup is not visible on 15M/5M context, a perfect 1M pattern may be meaningless."],
    mistakes: ["Letting the 1M chart define the Daily bias.", "Marking too many levels on every timeframe."],
    drill: "Build a six-timeframe Gold template. Limit yourself to three important annotations per timeframe.",
  },
  {
    n: 25,
    title: "XAUUSD Entry Models",
    visual: "Entry model hierarchy",
    takeaway: 'The entry is near the end of the reasoning process. FVG/OB should answer "where do I execute?" — not "why am I bullish or bearish?"',
    diagram: {
      kind: "flow",
      steps: [
        { t: "SETUP", sub: "HTF narrative", c: C.violet },
        { t: "LOCATION", sub: "P/D or OTE", c: C.gold },
        { t: "LIQUIDITY", sub: "BSL / SSL", c: C.red },
        { t: "TRIGGER", sub: "Sweep", c: C.gold },
        { t: "CONFIRM", sub: "MSS / CISD", c: C.blue },
        { t: "ENTRY", sub: "FVG / OB", c: C.green },
        { t: "TARGET", sub: "Liquidity", c: C.green },
      ],
      note: ["ENTRY FILTER: if the setup, location, liquidity event or confirmation is missing, do not use the PD array as a reason to force a trade."],
    },
    teaches: "Create an execution hierarchy so entry is the final step, not the first.",
    course: [{ h: "Preferred hierarchy", items: ["Setup (HTF narrative) → Location (premium/discount/OTE) → Liquidity (BSL/SSL) → Trigger (sweep) → Confirmation (displacement/MSS) → Entry (FVG/OB) → Target (liquidity)."] }],
    notes: [
      "Setup: HTF narrative and DOL.",
      "Location: premium/discount, OTE and relevant PD arrays.",
      "Liquidity: define the BSL/SSL that should be swept.",
      "Trigger: the liquidity raid.",
      "Confirmation: displacement plus MSS/CISD/meaningful structure change.",
      "Entry: FVG/OB/IFVG/Breaker or another pre-defined array.",
      "Target: internal and/or external liquidity.",
    ],
    gold: ["Gold often moves too quickly for discretionary improvisation. Know the exact entry type, invalidation and target before the candle reaches your POI."],
    mistakes: ["Entering because the setup looks close enough.", "Changing entry method after missing the first retracement."],
    drill: "Write a one-page entry protocol that another trader could follow without asking you what you meant.",
  },
  {
    n: 26,
    title: "Stops, Targets & Trade Management",
    visual: "Stops, targets and management",
    takeaway: "Stops belong beyond the price level that invalidates the setup. Targets should be logical liquidity objectives, not arbitrary fixed distances.",
    diagram: {
      kind: "ladder",
      levels: [
        { y: 8, t: "TP3 external BSL / PWH", c: C.green },
        { y: 26, t: "TP2 PDH", c: C.green },
        { y: 44, t: "TP1 internal liquidity", c: C.green },
        { y: 66, t: "LONG ENTRY", c: C.gold },
        { y: 90, t: "Invalidation / sweep low", c: C.red },
      ],
      arrow: [66, 10],
    },
    teaches: "Define risk and exit logic from market structure and liquidity rather than arbitrary dollar distances.",
    course: [
      { h: "Stop", items: ["Don't place it arbitrarily. Bullish liquidity-sweep trade: below the sweep/invalidation area. Bearish: above the sweep/invalidation area."] },
      { h: "Target", items: ["Prefer logical liquidity: internal liquidity first, external liquidity later.", "Example long: SSL sweep → MSS → FVG → entry → TP1 = internal high → TP2 = PDH → TP3 = PWH."] },
    ],
    notes: [
      "Stops belong beyond the point that invalidates the setup.",
      "For bullish sweep models, invalidation is typically beyond the relevant low/sweep or structural failure; bearish is the inverse.",
      "Targets should be logical liquidity references. Internal liquidity can be an intermediate target; external liquidity can be the larger objective.",
      "Predefine whether you scale, move to breakeven or hold full size. Test the management rule separately from the entry.",
      "A stop order may suffer slippage during fast Gold markets.",
    ],
    gold: ["Example long: SSL sweep → entry → TP1 internal high → TP2 PDH → TP3 PWH, provided the original DOL remains valid."],
    mistakes: ["Widening a losing stop.", "Moving to breakeven too early without testing.", "Holding for a distant target after the narrative has changed."],
    drill: "Backtest the same entry with at least two management styles and compare expectancy, average R and drawdown.",
  },
  {
    n: 27,
    title: "Risk Management",
    visual: "Risk management",
    takeaway: "Never move the stop farther away just to avoid a loss, and never increase size because the previous trade lost. Risk is the part of the trade you control most directly.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "DEFINE STOP", c: C.red },
        { t: "CALCULATE RISK", c: C.gold },
        { t: "SIZE POSITION", c: C.blue },
        { t: "ACCEPT LOSS", c: C.green },
      ],
      note: ["RISK PER TRADE: account equity × chosen risk % = maximum loss.", "GOLD REMINDER: Gold can expand violently. Test conservative risk such as 0.25%–0.5% per trade before considering anything larger."],
    },
    teaches: "Make position sizing and loss limits part of the strategy itself. This is where strategy meets reality.",
    course: [
      {
        h: "Test small",
        items: [
          "Test 0.25–0.5% risk per trade rather than trying to make huge returns from every setup. Gold can move violently.",
          "Never: widen a losing stop, revenge trade, increase size after losses, enter because you 'missed' the move, take every FVG.",
        ],
      },
    ],
    notes: [
      "Choose the account risk first; calculate position size from stop distance second.",
      "A conservative learning framework might test 0.25%–0.5% risk per trade, but actual risk must match your circumstances and tested edge.",
      "Set a maximum daily loss and maximum attempts before the session.",
      "Do not martingale, revenge trade or increase size because a setup 'looks perfect'.",
      "Gold volatility means a fixed lot size is especially dangerous across different stop distances.",
    ],
    gold: ["If a Gold stop is twice as wide as usual, the position size should generally be smaller if the risk percentage is unchanged."],
    mistakes: ["Choosing lot size first.", "Increasing risk after losses.", "Ignoring spread/slippage in backtests."],
    drill: "Build a position-size calculator and test it on stops of 2, 5, 10 and 20 dollars to see how size changes at fixed account risk.",
  },
  {
    n: 28,
    title: "Trading Psychology",
    visual: "Process over outcome",
    takeaway: "A valid setup can lose. The goal is not to make each trade prove you right; it is to execute a tested process consistently and review the evidence afterward.",
    diagram: {
      kind: "flow",
      steps: [
        { t: "PLAN", c: C.violet },
        { t: "WAIT", c: C.blue },
        { t: "EXECUTE", c: C.gold },
        { t: "REVIEW", c: C.green },
        { t: "IMPROVE", c: C.green },
      ],
      note: ["GOOD PROCESS + LOSING TRADE = ACCEPTABLE", "BAD PROCESS + WINNING TRADE = DANGEROUS"],
    },
    teaches: "Build process discipline around a probabilistic model.",
    course: [
      {
        h: "The mindset",
        items: [
          "ICT's framework doesn't remove uncertainty. You can have a perfect setup and lose. That's normal. Your job is to execute the model consistently.",
          "Don't think 'this trade must win'. Think 'does this trade meet my rules?' That's the difference between prediction and execution.",
        ],
      },
    ],
    notes: [
      "A high-quality setup can lose; a poor setup can win. Outcome and process must be graded separately.",
      "FOMO is especially dangerous on Gold because fast candles make missed moves feel urgent.",
      "Revenge trading often follows a valid loss that the trader interprets as personal failure.",
      "Confirmation addiction can become hindsight storytelling; define your mandatory conditions before the session.",
      "Journal emotional state and rule adherence alongside P/L.",
    ],
    gold: ["Gold rewards patience because many of the best setups appear after the obvious first move has already trapped or stopped traders."],
    mistakes: ["Judging the model by one trade.", "Changing rules after a loss.", "Chasing because price moved without you."],
    drill: "After every trade, score execution 0–5 before looking at P/L. Review the process score weekly.",
  },
  {
    n: 29,
    title: "What to Ignore / Common ICT Misinterpretations",
    visual: "Common ICT misinterpretations",
    takeaway: "Context is what turns an ICT concept from a label into a trade idea. Avoid universal claims and test the exact rules you intend to use on XAUUSD.",
    diagram: {
      kind: "myths",
      items: ["Every sweep reverses", "Every FVG fills", "OTE guarantees reversal", "Every last down candle is an OB", "SMT = automatic reversal", "One model works every day"],
    },
    teaches: "Remove myths that turn a flexible framework into false certainty. This is very important.",
    course: [
      {
        h: "Don't believe",
        items: [
          "'Every liquidity sweep reverses.' False — sometimes liquidity is taken and price continues.",
          "'Every FVG gets filled.' No — some remain unfilled.",
          "'OTE guarantees a reversal.' No — it's a location framework.",
          "'Every last down candle is an OB.' No — context matters.",
          "'SMT means automatic reversal.' No — it's confirmation/context.",
          "'ICT knows exactly what banks are doing.' Be careful — the institutional language is a framework, not a window into the private order books of every major participant.",
          "'One ICT model works every day.' No — market conditions change.",
        ],
      },
    ],
    notes: [
      "Every liquidity sweep reverses — false.",
      "Every FVG fills — false.",
      "OTE guarantees reversal — false.",
      "Every last opposite candle is an OB — false.",
      "SMT means automatic reversal — false.",
      "Every killzone produces a setup — false.",
      "One ICT model works every day — false.",
      "No public framework gives you complete visibility into every institution's private order book.",
      "The value of the framework is in creating testable observations and disciplined execution.",
    ],
    gold: ["Gold's volatility amplifies the cost of believing a pattern must work. Use invalidation and position sizing on every setup."],
    mistakes: ["Explaining losses away instead of recording them.", "Using different rules for winners and losers."],
    drill: 'Write your model as objective yes/no rules. Highlight any rule that still depends on vague words such as "strong", "clean" or "looks good", then define it better.',
  },
  {
    n: 30,
    title: "The Complete XAUUSD ICT System",
    visual: "Complete XAUUSD ICT system",
    takeaway: 'Do not reduce the system to "FVG + MSS = entry." The strongest model starts with context and liquidity, then uses time and price delivery to earn the right to execute.',
    diagram: {
      kind: "grid",
      items: ["1. HTF CONTEXT", "2. LIQUIDITY / DOL", "3. DEALING RANGE", "4. TIME / SESSION", "5. RAID / SWEEP", "6. DISPLACEMENT", "7. MSS / CISD", "8. PD ARRAY", "9. ENTRY", "10. INVALIDATION", "11. TARGET", "12. REVIEW"],
    },
    teaches: "Combine everything into one repeatable top-down workflow.",
    course: [
      {
        h: "■ LONG",
        items: ["1 Weekly bullish context → 2 Daily bullish structure → 3 4H discount/OTE → 4 Liquidity: SSL below → 5 Session: London/NY → 6 Event: SSL sweep → 7 Confirmation: bullish displacement → 8 Structure: MSS → 9 Entry: FVG/OB → 10 Risk: stop beneath invalidation → 11 Target: internal liquidity → 12 Final target: external BSL."],
      },
      { h: "■ SHORT", items: ["Weekly bearish → Daily bearish → 4H premium/OTE → Liquidity: BSL → Session: London/NY → BSL sweep → bearish displacement → MSS → FVG/OB → SHORT → SSL target."] },
      {
        h: "The whole ICT framework in one diagram",
        items: [
          "Higher timeframe → market structure → liquidity → draw on liquidity → premium/discount → OTE → time → session range → liquidity sweep → displacement → MSS → FVG/OB → entry → internal liquidity → external liquidity → trade management → risk management.",
          "Around the outside for XAUUSD — GOLD MACRO: DXY, US10Y, real yields, Fed, CPI/PCE/NFP/FOMC, Gold/Silver → ICT price model → XAUUSD execution.",
        ],
      },
      {
        h: "Final distinction",
        items: [
          "The ICT concepts are the teaching framework; the XAUUSD combinations and scoring system are a synthesis for applying it to gold, not an official ICT 'Gold Strategy'. ICT's own videos warn that hypothetical/simulated performance isn't a guarantee of future results.",
          "To study seriously: take Section 1 and go extremely deep, then Section 2, and so on — otherwise 30 sections of terminology will be hard to turn into chart-reading skill.",
        ],
      },
      { h: "Visual Example 8", items: ["HTF bias (Daily/4H bullish) → Liquidity (PDL/SSL) → Sweep (SSL raid) → Displacement (strong bullish leg) → MSS/CISD (structure shifts) → PD array (FVG/OB) → Entry (retracement) → DOL (PDH/BSL).", "The entry is the final step, not the starting point. If the bias, liquidity and DOL are unclear, the lower-timeframe pattern should not persuade you into a trade."] },
    ],
    notes: [
      "LONG: Weekly/Daily bullish context → identify external BSL DOL → locate discount/appropriate PD array → wait for London/NY opportunity → SSL raid → bullish displacement → MSS/CISD → FVG/OB entry → stop beyond invalidation → internal liquidity → external BSL.",
      "SHORT: Weekly/Daily bearish context → identify external SSL DOL → locate premium/appropriate PD array → wait for BSL raid → bearish displacement → MSS/CISD → FVG/OB entry → stop beyond invalidation → internal liquidity → external SSL.",
      "Macro layer: DXY, yields, Fed expectations and scheduled data can alter volatility and directional pressure.",
      "No-trade layer: no clear bias, no DOL, no meaningful liquidity event, weak displacement, poor risk/reward, or unmanaged high-impact event risk.",
      "Review layer: screenshot, journal, process grade, MAE/MFE and model statistics.",
    ],
    gold: ["The goal is not to use every ICT concept in every Gold trade. The goal is to use the smallest set of concepts that creates a clear, testable and repeatable model."],
    mistakes: ["Adding more confirmations after every loss.", "Trading outside the model because Gold is moving.", "Failing to define invalidation before entry."],
    drill: "Run the complete checklist on 100 historical Gold sessions. Only then decide which variables materially improve your results.",
  },
];

export const sectionByN = (n: number) => SECTIONS.find((s) => s.n === n)!;
