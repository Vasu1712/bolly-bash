import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Rozha_One, Yellowtail } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const display = Rozha_One({ weight: "400", subsets: ["latin"], variable: "--font-rozha" });
const script = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Vaswani Social Presents: Bollywood Night — Official Party Pass",
  description:
    "Claim your Bollywood character and get your VIP party pass. Friday, 16th October, 8 PM onwards. Drinks, food, games, pictures and music.",
  openGraph: {
    title: "Bollywood Night — Official Party Pass",
    description: "Dress like your favorite Bollywood character! Claim yours before someone else does.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07030f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${script.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
