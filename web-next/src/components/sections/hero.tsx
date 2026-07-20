"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBackground } from "@/components/three/hero-background";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackground />

      <div className="container relative flex flex-col items-center py-30 text-center md:py-30">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-3xl flex-col items-center"
        >
          <motion.div variants={item}>
            <Badge>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Free — no email or account required
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-display-lg"
          >
            Check the facts and math behind your{" "}
            <span className="text-accent">auto claim offer</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            FairClaimCalculator audits a diminished-value or total-loss
            insurance offer line by line — the mismatches, the comps, the
            math — so you know what to check before you respond.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/total-loss-offer-calculator">
                Get Started
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/#live-demo">
                <PlayCircle size={18} />
                View Demo
              </Link>
            </Button>
          </motion.div>

          <motion.p variants={item} className="mt-6 text-xs text-muted-foreground">
            Built for U.S. vehicle owners &middot; Local-only by default &middot; No claim data sent to a server
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
