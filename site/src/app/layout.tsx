import type { Metadata } from "next";
import { Archivo, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/cursor";
import { SnakeRail } from "@/components/rail3d/snake-rail";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
  metadataBase: new URL("https://imaddi47.lonebuilder.com"),
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
      className={`${archivo.variable} ${newsreader.variable} ${jbmono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Cursor />
        {/* The snaking railway lives behind the content, weaving side to side. */}
        <SnakeRail />
        <div className="relative z-10 flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
