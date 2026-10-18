import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ProgressProvider } from "@/lib/progress";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Price Action Academy — Gold & US30",
  description:
    "An interactive, bite-sized price action and smart money course built for XAUUSD and US30 traders. Candles, structure, liquidity, order blocks, FVGs, entry models and risk.",
};

export const viewport: Viewport = {
  themeColor: "#05070c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="font-sans">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
