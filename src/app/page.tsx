import { Boss } from "@/components/sections/Boss";
import { Hero, HowItWorks } from "@/components/sections/Hero";
import { HUD } from "@/components/sections/HUD";
import { CHAPTERS } from "@/lib/chapters";
import { L01Candle } from "@/components/sections/L01Candle";
import { L02Confirmations } from "@/components/sections/L02Confirmations";
import { L03Structure } from "@/components/sections/L03Structure";
import { L04Bos } from "@/components/sections/L04Bos";
import { L05Levels } from "@/components/sections/L05Levels";
import { L06Liquidity } from "@/components/sections/L06Liquidity";
import { L07OrderBlocks } from "@/components/sections/L07OrderBlocks";
import { L08Fvg } from "@/components/sections/L08Fvg";
import { L09Fib } from "@/components/sections/L09Fib";
import { L10Entries } from "@/components/sections/L10Entries";
import { L11Sessions } from "@/components/sections/L11Sessions";
import { L12Risk } from "@/components/sections/L12Risk";
import { Outro } from "@/components/sections/Outro";

export default function Home() {
  return (
    <main className="relative pb-28">
      <HUD chapters={CHAPTERS} tab="pa" subs={{ boss: [{ id: "checklist", label: "Pre-trade checklist & recap" }] }} />
      <Hero />
      <HowItWorks />
      <L01Candle />
      <L02Confirmations />
      <L03Structure />
      <L04Bos />
      <L05Levels />
      <L06Liquidity />
      <L07OrderBlocks />
      <L08Fvg />
      <L09Fib />
      <L10Entries />
      <L11Sessions />
      <L12Risk />
      <Boss />
      <Outro />
    </main>
  );
}
