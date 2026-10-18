export type Chapter = {
  id: string;
  num: string;
  title: string;
  short: string;
  minutes: number;
};

export const CHAPTERS: Chapter[] = [
  { id: "candle", num: "01", title: "The Candle Is a Fight", short: "Candles", minutes: 3 },
  { id: "confirmations", num: "02", title: "Confirmation Candles", short: "Confirm", minutes: 5 },
  { id: "structure", num: "03", title: "Market Structure", short: "Structure", minutes: 4 },
  { id: "bos", num: "04", title: "BOS vs CHoCH", short: "BOS/CHoCH", minutes: 4 },
  { id: "levels", num: "05", title: "Levels & Zones", short: "Zones", minutes: 3 },
  { id: "liquidity", num: "06", title: "Liquidity: Where the Stops Live", short: "Liquidity", minutes: 4 },
  { id: "orderblocks", num: "07", title: "Order Blocks & Breakers", short: "OBs", minutes: 4 },
  { id: "fvg", num: "08", title: "Fair Value Gaps", short: "FVG", minutes: 3 },
  { id: "fib", num: "09", title: "Premium, Discount & OTE", short: "P/D", minutes: 3 },
  { id: "entries", num: "10", title: "Entry Models", short: "Entries", minutes: 6 },
  { id: "sessions", num: "11", title: "Sessions: Gold & US30", short: "Sessions", minutes: 4 },
  { id: "risk", num: "12", title: "Risk Is the Real Edge", short: "Risk", minutes: 4 },
  { id: "boss", num: "★", title: "Final Boss: Trade or Skip?", short: "Boss", minutes: 5 },
];

export const XP_PER_CHECK = 50;
// quick checks + the three mini-games (spot-it, find-the-OB, boss bonus)
export const XP_TOTAL = CHAPTERS.length * XP_PER_CHECK + 3 * 40;
