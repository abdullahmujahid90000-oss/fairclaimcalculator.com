import { ShieldCheck, Lock, Ban, CircleDollarSign } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const PRINCIPLES = [
  {
    icon: Lock,
    title: "No email or account",
    description: "Get a result without signing up for anything.",
  },
  {
    icon: ShieldCheck,
    title: "Local-only by default",
    description: "Your claim numbers stay in your browser, not on a server.",
  },
  {
    icon: Ban,
    title: "Never tells you what to demand",
    description: "Flags what to verify — the decision stays yours.",
  },
  {
    icon: CircleDollarSign,
    title: "Free, always",
    description: "No paywall on the core audit tools, ever.",
  },
];

export function Principles() {
  return (
    <section className="border-y border-border bg-surface/40 py-20">
      <div className="container">
        <Reveal stagger={0.1} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
