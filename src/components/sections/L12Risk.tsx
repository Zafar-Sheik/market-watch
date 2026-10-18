"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { BEAR, BULL, GOLD, SKY } from "@/components/chart/CandleChart";
import { Btn, Callout, Level, Panel, PanelTitle } from "@/components/learn/Level";
import { QuickCheck } from "@/components/learn/QuickCheck";
import { CHAPTERS } from "@/lib/chapters";
import { cn, fmt } from "@/lib/utils";

export function L12Risk() {
  const ch = CHAPTERS[11];
  return (
    <Level
      chapter={ch}
      accent={BEAR}
      tldr={[
        "Risk a fixed small % per trade (0.5–1%). Size the position from the stop, never the other way round.",
        "With 1:2 R:R you can be wrong 6 times out of 10 and still make money.",
        "Losses are a cost of business. Big losses are a choice.",
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SizeCalc />
        <Expectancy />
      </div>
      <Streak />
      <Callout kind="pro">
        ADHD-trader rule: <b>max 2 losses per day, then the platform closes.</b> Impulsive revenge trades are the #1 account
        killer, and they&apos;re a lot easier to avoid with a rule you decided when calm.
      </Callout>
      <QuickCheck
        chapter={ch.id}
        question="$10,000 account, risking 1%. Gold stop is $5 away. Standard contract (100 oz/lot). Position size?"
        options={["2 lots", "0.20 lots", "0.02 lots", "1 lot"]}
        answer={1}
        explain="Risk = $100. 1 lot moves $100 per $1, so a $5 stop = $500 per lot. $100 ÷ $500 = 0.20 lots."
      />
    </Level>
  );
}

function Num({ label, value, onChange, step = 1, suffix }: { label: string; value: number; onChange: (v: number) => void; step?: number; suffix?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] font-bold text-slate-500">{label}</span>
      <div className="flex items-center rounded-xl border border-white/10 bg-black/30 focus-within:border-gold/60">
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full bg-transparent px-3 py-2.5 font-mono text-white outline-none"
        />
        {suffix && <span className="pr-3 font-mono text-xs text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

function SizeCalc() {
  const [inst, setInst] = useState<"xau" | "us30">("xau");
  const [bal, setBal] = useState(10000);
  const [risk, setRisk] = useState(1);
  const [stop, setStop] = useState(5);
  const [perLot, setPerLot] = useState(100);
  const switchTo = (k: "xau" | "us30") => {
    setInst(k);
    if (k === "xau") {
      setPerLot(100);
      setStop(5);
    } else {
      setPerLot(1);
      setStop(40);
    }
  };
  const riskUsd = (bal * risk) / 100;
  const lots = riskUsd / (stop * perLot);
  const bad = risk > 2;
  return (
    <Panel>
      <PanelTitle kicker="TOOL" title="Position size calculator" hint="Size comes from the stop. Always." />
      <div className="mb-4 flex gap-2">
        <Btn active={inst === "xau"} onClick={() => switchTo("xau")}>
          ◆ XAUUSD
        </Btn>
        <Btn active={inst === "us30"} onClick={() => switchTo("us30")}>
          ▲ US30
        </Btn>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Num label="ACCOUNT ($)" value={bal} onChange={setBal} step={500} />
        <Num label="RISK PER TRADE" value={risk} onChange={setRisk} step={0.25} suffix="%" />
        <Num label={inst === "xau" ? "STOP DISTANCE ($ price)" : "STOP DISTANCE (points)"} value={stop} onChange={setStop} step={inst === "xau" ? 0.5 : 5} suffix={inst === "xau" ? "$" : "pts"} />
        <Num label={inst === "xau" ? "$ PER $1 MOVE, 1 LOT" : "$ PER POINT, 1 LOT"} value={perLot} onChange={setPerLot} step={1} suffix="$" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-bear/30 bg-bear/10 p-4">
          <div className="font-mono text-[11px] font-bold text-bear">MAX LOSS</div>
          <div className="text-2xl font-black text-white">${fmt(riskUsd || 0)}</div>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
          <div className="font-mono text-[11px] font-bold text-gold">POSITION SIZE</div>
          <motion.div key={lots.toFixed(2)} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-2xl font-black text-white">
            {Number.isFinite(lots) ? fmt(lots, 2) : "—"} lots
          </motion.div>
        </div>
      </div>
      {bad && <p className="mt-3 text-sm font-semibold text-bear">⚠ Over 2% per trade — five losses in a row would cost you 10%+.</p>}
      <p className="mt-3 text-xs text-slate-500">
        {inst === "xau"
          ? "Standard gold contract = 100 oz, so $1 move = $100 per lot. Some brokers differ — check your contract spec."
          : "US30 contract value varies a LOT by broker ($0.1, $1, $5 or $10 per point per lot). Check your broker's spec and edit the box."}
      </p>
    </Panel>
  );
}

function Expectancy() {
  const [win, setWin] = useState(40);
  const [rr, setRr] = useState(2);
  const ev = (win / 100) * rr - (1 - win / 100);
  const be = 100 / (1 + rr);
  const trades = 100;
  return (
    <Panel>
      <PanelTitle kicker="MATH" title="Do you actually have an edge?" hint="Expectancy = (win% × reward) − (loss% × risk)." />
      <Slider label="Win rate" value={win} min={20} max={80} onChange={setWin} suffix="%" />
      <Slider label="Reward : risk" value={rr} min={0.5} max={5} step={0.5} onChange={setRr} suffix="R" />
      <div
        className="mt-4 rounded-2xl border p-5 text-center transition-colors"
        style={{ borderColor: ev > 0 ? `${BULL}66` : `${BEAR}66`, background: ev > 0 ? `${BULL}10` : `${BEAR}10` }}
      >
        <div className="font-mono text-[11px] font-bold text-slate-400">EXPECTED PER TRADE</div>
        <div className="text-4xl font-black" style={{ color: ev > 0 ? BULL : BEAR }}>
          {ev > 0 ? "+" : ""}
          {ev.toFixed(2)}R
        </div>
        <div className="mt-1 text-sm text-slate-300">
          Over {trades} trades risking $100 each: <b className={ev > 0 ? "text-bull" : "text-bear"}>{ev > 0 ? "+" : "−"}${fmt(Math.abs(ev * trades * 100), 0)}</b>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
          <span>break-even win rate at {rr}R</span>
          <span className="text-gold">{be.toFixed(0)}%</span>
        </div>
        <div className="relative h-3 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gold/40" style={{ width: `${be}%` }} />
          <motion.div className="absolute -top-1 h-5 w-1 rounded bg-white" animate={{ left: `${win}%` }} />
        </div>
        <div className="mt-1 text-xs text-slate-500">White marker = your win rate. Right of gold = profitable.</div>
      </div>
    </Panel>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-bold text-white">
          {value}
          {suffix}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </label>
  );
}

function Streak() {
  const [risk, setRisk] = useState(1);
  const [losses, setLosses] = useState(8);
  const curve = useMemo(() => {
    const pts = [100];
    for (let i = 0; i < losses; i++) pts.push(pts[pts.length - 1] * (1 - risk / 100));
    return pts;
  }, [risk, losses]);
  const end = curve[curve.length - 1];
  const dd = 100 - end;
  const recover = (100 / end - 1) * 100;
  const W = 600;
  const H = 180;
  const X = (i: number) => 20 + (i / Math.max(1, losses)) * (W - 40);
  const floor = Math.max(0, Math.floor((Math.min(end, 80) - 5) / 10) * 10);
  const Y = (v: number) => 10 + ((100 - v) / (100 - floor)) * (H - 20);
  const grid = [0, 1, 2, 3].map((k) => Math.round(100 - ((100 - floor) * (k + 1)) / 4));
  return (
    <Panel>
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <PanelTitle kicker="REALITY CHECK" title="The losing streak simulator" hint="Every trader hits streaks. It's math, not bad luck." />
          <Slider label="Risk per trade" value={risk} min={0.5} max={10} step={0.5} onChange={setRisk} suffix="%" />
          <Slider label="Losses in a row" value={losses} min={1} max={15} onChange={setLosses} suffix="" />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-bear/30 bg-bear/10 p-3">
              <div className="font-mono text-[10px] font-bold text-bear">DRAWDOWN</div>
              <div className="text-xl font-black text-white">−{dd.toFixed(1)}%</div>
            </div>
            <div className={cn("rounded-xl border p-3", recover > 50 ? "border-bear/50 bg-bear/15" : "border-gold/30 bg-gold/10")}>
              <div className="font-mono text-[10px] font-bold text-gold">GAIN NEEDED TO RECOVER</div>
              <div className="text-xl font-black text-white">+{recover.toFixed(1)}%</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => setRisk(1)} active={risk === 1}>
              1% (pro)
            </Btn>
            <Btn onClick={() => setRisk(5)} active={risk === 5}>
              5% (gambler)
            </Btn>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl bg-black/30">
          {grid.map((v) => (
            <g key={v}>
              <line x1={20} x2={W - 20} y1={Y(v)} y2={Y(v)} stroke="#ffffff10" />
              <text x={W - 18} y={Y(v) + 3} fontSize={10} className="fill-slate-600 font-mono">
                {v}%
              </text>
            </g>
          ))}
          <polyline
            fill="none"
            stroke={dd > 30 ? BEAR : dd > 15 ? GOLD : SKY}
            strokeWidth={3}
            strokeLinejoin="round"
            className="transition-[stroke] duration-300"
            points={curve.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}
          />
          {curve.map((v, i) => (
            <circle key={i} cx={X(i)} cy={Y(v)} r={3.5} fill={i === 0 ? BULL : BEAR} />
          ))}
        </svg>
      </div>
    </Panel>
  );
}
