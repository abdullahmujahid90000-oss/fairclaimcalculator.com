import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="py-24 sm:py-30">
      <div className="container">
        <Reveal
          stagger={0}
          className="relative overflow-hidden rounded-2xl border border-border bg-surface px-8 py-20 text-center sm:px-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.18),_transparent_60%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to check your offer?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Start with the flagship Total-Loss Offer Audit, or see how the
              tools work first — either way, no email required.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/total-loss-offer-calculator">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/#live-demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
