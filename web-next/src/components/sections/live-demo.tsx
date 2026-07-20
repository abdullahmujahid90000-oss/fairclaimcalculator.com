"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const OUTLIER_THRESHOLD = 0.2; // 20% from median — same flag the real audit tool uses

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const LABELS = ["Comp 1", "Comp 2", "Comp 3"] as const;

/**
 * A real, working miniature of the outlier check from the flagship
 * Total-Loss Offer Audit tool: enter three comparable-vehicle prices, see
 * which one sits more than 20% from the median — live, client-side, no
 * fabricated output. This is what "View Demo" scrolls to.
 */
export function LiveDemo() {
  const [values, setValues] = useState<number[]>([14200, 14650, 11300]);

  const { med, flags } = useMemo(() => {
    const nums = values.filter((v) => v > 0);
    if (nums.length < 2) return { med: 0, flags: values.map(() => false) };
    const m = median(nums);
    return {
      med: m,
      flags: values.map((v) => (v > 0 && m > 0 ? Math.abs(v - m) / m > OUTLIER_THRESHOLD : false)),
    };
  }, [values]);

  const anyFlagged = flags.some(Boolean);

  return (
    <section id="live-demo" className="py-24 sm:py-30">
      <div className="container">
        <Reveal stagger={0} className="mx-auto max-w-3xl text-center">
          <Badge>Live, editable — not a screenshot</Badge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Try the outlier check
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            This is a simplified version of the comp-mismatch check inside the
            Total-Loss Offer Audit tool. Edit any comparable-vehicle price
            below — the flag recalculates in your browser as you type.
          </p>
        </Reveal>

        <Reveal
          stagger={0}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-3">
            {LABELS.map((label, i) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`comp-${i}`}>
                  {label}
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id={`comp-${i}`}
                    type="number"
                    inputMode="numeric"
                    className="pl-7"
                    value={values[i]}
                    onChange={(e) => {
                      const next = [...values];
                      next[i] = Number(e.target.value) || 0;
                      setValues(next);
                    }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={flags[i] ? "flag" : "ok"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className={
                      "mt-2.5 flex items-center gap-1.5 text-xs font-medium " +
                      (flags[i] ? "text-accent" : "text-muted-foreground")
                    }
                  >
                    {flags[i] ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                    {flags[i] ? "20%+ from median" : "Within range"}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-muted-foreground">
              Median of your three comps: <span className="font-mono text-foreground">{formatUSD(med)}</span>
            </p>
            <p className={"text-sm font-medium " + (anyFlagged ? "text-accent" : "text-muted-foreground")}>
              {anyFlagged
                ? "Possible mismatch to verify — not an accusation, just worth a second look."
                : "No outliers at the 20% threshold."}
            </p>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          Illustrative only. The full Total-Loss Offer Audit tool checks up to ten comps against
          your insurer&rsquo;s own reported range, plus the full valuation-report mismatch
          checklist.
        </p>
      </div>
    </section>
  );
}
