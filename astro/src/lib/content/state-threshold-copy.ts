/**
 * Per-state prose for the 51 individual state pages under
 * /guides/total-loss/state-total-loss-threshold-laws/[state]/.
 *
 * Design note (logged for the same reason as SOURCE-REGISTER.md and
 * ADSENSE-READINESS.md §4's "not mass-generated, not templated across
 * states with only place-names swapped in" rule): this file does NOT
 * generate 51 pages by find-and-replacing a state name into one fixed
 * sentence. The explanatory text is branched by threshold TIER (100%,
 * 80%, 75%, 70%, 65%, 60%, or Total Loss Formula) — a real, factual
 * difference between states, not a cosmetic one — so states that share a
 * tier share genuinely-applicable text, and states in different tiers get
 * substantively different explanations. The worked-dollar-amount example
 * on every page is also individually computed from that state's own real
 * percentage (or the TLF example already published in the companion
 * guide), not copy-pasted. No new facts are introduced beyond what's
 * already sourced in STATE_THRESHOLDS / the companion guide.
 */

import type { StateThreshold } from "../calculators/total-loss-threshold";
import { formatUSD } from "../calculators/total-loss-threshold";

/** Illustrative ACV used in every worked example: $10,000 (round number, matches the companion guide's own TLF example). */
export const EXAMPLE_ACV_CENTS = 1_000_000;

export function getPracticalMeaning(entry: StateThreshold): string {
  if (entry.type === "tlf") {
    return `${entry.state} does not use a single percentage — it applies the Total Loss Formula, so a vehicle's fate depends on the combination of repair cost and expected salvage value, not repair cost alone. Two vehicles with an identical repair estimate can land on opposite sides of the total-loss line here if their salvage values differ.`;
  }

  const pct = entry.thresholdPct as number;

  if (pct >= 100) {
    return `At ${pct}%, ${entry.state} sets one of the highest bars in the country — insurers are only required to total a vehicle once estimated repairs would cost as much as the car itself is worth, leaving more room for heavily damaged vehicles to be repaired and returned to the road than in most other states.`;
  }
  if (pct >= 80) {
    return `At ${pct}%, ${entry.state}'s threshold is on the higher side nationally — repair costs have to reach a substantial share of the vehicle's actual cash value before state law requires a total loss.`;
  }
  if (pct === 75) {
    return `${pct}% is the single most common state threshold nationally, and ${entry.state} uses it — roughly three-quarters of the vehicle's actual cash value in repair costs triggers a total loss.`;
  }
  if (pct >= 70) {
    return `At ${pct}%, ${entry.state} sets its bar a little lower than the more common 75% threshold used by many other states — the legal minimum for a total loss is reached at a smaller share of the vehicle's value.`;
  }
  if (pct >= 65) {
    return `At ${pct}%, ${entry.state} is among the more conservative percentage-threshold states — the legal minimum for a total loss is reached at a comparatively small share of the vehicle's value.`;
  }
  return `At ${pct}%, ${entry.state} has the lowest state-set percentage threshold in the country — repairs reaching just ${pct}% of the vehicle's value already meet the legal minimum for a total loss, a deliberately conservative, safety-oriented rule.`;
}

export interface WorkedExample {
  acvText: string;
  repairText: string;
  salvageText?: string;
  sumText?: string;
  verdictText: string;
}

export function getWorkedExample(entry: StateThreshold): WorkedExample {
  const acvText = formatUSD(EXAMPLE_ACV_CENTS);

  if (entry.type === "tlf") {
    // Reuses the exact worked TLF example already published in the
    // companion guide (repair $7,500 + salvage $1,000 = $8,500 < $10,000
    // ACV, so this specific damage would NOT be a total loss under TLF).
    const repairCents = 750_000;
    const salvageCents = 100_000;
    const sumCents = repairCents + salvageCents;
    return {
      acvText,
      repairText: formatUSD(repairCents),
      salvageText: formatUSD(salvageCents),
      sumText: formatUSD(sumCents),
      verdictText: `${formatUSD(repairCents)} repair + ${formatUSD(salvageCents)} estimated salvage = ${formatUSD(sumCents)}, which is below the ${acvText} ACV — so this specific damage would not meet ${entry.state}'s Total Loss Formula, even though the repair estimate alone is 75% of ACV.`,
    };
  }

  const pct = entry.thresholdPct as number;
  const repairCents = Math.round((EXAMPLE_ACV_CENTS * pct) / 100);
  return {
    acvText,
    repairText: formatUSD(repairCents),
    verdictText: `On a ${acvText} vehicle, repair costs reaching ${formatUSD(repairCents)} (${pct}% of ACV) meet ${entry.state}'s total-loss threshold.`,
  };
}
