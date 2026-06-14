import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/cursor";
import { RailJourney } from "@/components/rail-journey";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imaddi47.github.io"),
  title: "Ankit Kumar — Software Engineer",
  description:
    "Software engineer at Toddle. Builds tooling for the unglamorous middle of the stack — auth flows, AWS plumbing, AI-augmented workflows.",
  authors: [{ name: "Ankit Kumar", url: "https://github.com/imaddi47" }],
  openGraph: {
    title: "Ankit Kumar — Software Engineer",
    description:
      "Software engineer building tooling for the unglamorous middle of the stack.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${newsreader.variable} ${jbmono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Cursor />
        <RailJourney />
        <div className="relative z-10 flex flex-col flex-1 lg:pl-[92px]">{children}</div>
      </body>
    </html>
  );
}
