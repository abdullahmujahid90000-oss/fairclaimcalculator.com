import { Hero } from "@/components/sections/hero";
import { LiveDemo } from "@/components/sections/live-demo";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Tools } from "@/components/sections/tools";
import { Principles } from "@/components/sections/principles";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <LiveDemo />
      <HowItWorks />
      <Tools />
      <Principles />
      <Cta />
    </>
  );
}
