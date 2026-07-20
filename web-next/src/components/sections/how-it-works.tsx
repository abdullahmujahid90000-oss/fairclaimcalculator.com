import { ClipboardList, Calculator, FileCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Enter your claim basics",
    description:
      "Vehicle details, the insurer's offer, and whatever numbers are on your valuation report or settlement letter. No login, no VIN lookup required.",
  },
  {
    icon: Calculator,
    step: "02",
    title: "We check the math and comps",
    description:
      "The tool runs your figures against internal-consistency checks — comp mismatches, outliers, and whether the offer sits inside the insurer's own reported range.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get a plain-English breakdown",
    description:
      "A line-by-line summary of what checks out, what looks like a possible mismatch worth verifying, and what to ask your adjuster about next.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-30">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Three steps, entirely in your browser — from raw offer to a
            checklist you can actually use.
          </p>
        </Reveal>

        <Reveal
          stagger={0.12}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative rounded-2xl border border-border bg-surface p-8">
              <span className="text-sm font-mono text-accent">{step}</span>
              <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
