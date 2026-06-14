import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Instruments } from "@/components/sections/instruments";
import { Writing } from "@/components/sections/writing";
import { Now } from "@/components/sections/now";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Instruments />
        <Writing />
        <Now />
      </main>
      <Footer />
    </>
  );
}
