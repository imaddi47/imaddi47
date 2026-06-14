import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Instruments } from "@/components/sections/instruments";
import { Writing } from "@/components/sections/writing";
import { Now } from "@/components/sections/now";
import { Footer } from "@/components/sections/footer";
import { SnakeRow } from "@/components/snake-row";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <SnakeRow index={0}>
          <Hero />
        </SnakeRow>
        <SnakeRow index={1}>
          <About />
        </SnakeRow>
        <SnakeRow index={2}>
          <Projects />
        </SnakeRow>
        <SnakeRow index={3}>
          <Instruments />
        </SnakeRow>
        <SnakeRow index={4}>
          <Writing />
        </SnakeRow>
        <SnakeRow index={5}>
          <Now />
        </SnakeRow>
      </main>
      <SnakeRow index={6}>
        <Footer />
      </SnakeRow>
    </>
  );
}
