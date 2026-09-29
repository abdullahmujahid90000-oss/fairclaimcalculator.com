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

/**
 * Land borders between states (plus D.C.), standard U.S. geography. Used to
 * give every state page a comparison that is genuinely specific to that
 * state: the same damaged car can be treated differently one state over.
 * Alaska and Hawaii have no bordering states.
 */
export const BORDERING_STATES: Record<string, string[]> = {
  Alabama: ["Florida", "Georgia", "Mississippi", "Tennessee"],
  Alaska: [],
  Arizona: ["California", "Colorado", "Nevada", "New Mexico", "Utah"],
  Arkansas: ["Louisiana", "Mississippi", "Missouri", "Oklahoma", "Tennessee", "Texas"],
  California: ["Arizona", "Nevada", "Oregon"],
  Colorado: ["Arizona", "Kansas", "Nebraska", "New Mexico", "Oklahoma", "Utah", "Wyoming"],
  Connecticut: ["Massachusetts", "New York", "Rhode Island"],
  Delaware: ["Maryland", "New Jersey", "Pennsylvania"],
  Florida: ["Alabama", "Georgia"],
  Georgia: ["Alabama", "Florida", "North Carolina", "South Carolina", "Tennessee"],
  Hawaii: [],
  Idaho: ["Montana", "Nevada", "Oregon", "Utah", "Washington", "Wyoming"],
  Illinois: ["Indiana", "Iowa", "Kentucky", "Missouri", "Wisconsin"],
  Indiana: ["Illinois", "Kentucky", "Michigan", "Ohio"],
  Iowa: ["Illinois", "Minnesota", "Missouri", "Nebraska", "South Dakota", "Wisconsin"],
  Kansas: ["Colorado", "Missouri", "Nebraska", "Oklahoma"],
  Kentucky: ["Illinois", "Indiana", "Missouri", "Ohio", "Tennessee", "Virginia", "West Virginia"],
  Louisiana: ["Arkansas", "Mississippi", "Texas"],
  Maine: ["New Hampshire"],
  Maryland: ["Delaware", "Pennsylvania", "Virginia", "West Virginia", "Washington, D.C."],
  Massachusetts: ["Connecticut", "New Hampshire", "New York", "Rhode Island", "Vermont"],
  Michigan: ["Indiana", "Ohio", "Wisconsin"],
  Minnesota: ["Iowa", "North Dakota", "South Dakota", "Wisconsin"],
  Mississippi: ["Alabama", "Arkansas", "Louisiana", "Tennessee"],
  Missouri: ["Arkansas", "Illinois", "Iowa", "Kansas", "Kentucky", "Nebraska", "Oklahoma", "Tennessee"],
  Montana: ["Idaho", "North Dakota", "South Dakota", "Wyoming"],
  Nebraska: ["Colorado", "Iowa", "Kansas", "Missouri", "South Dakota", "Wyoming"],
  Nevada: ["Arizona", "California", "Idaho", "Oregon", "Utah"],
  "New Hampshire": ["Maine", "Massachusetts", "Vermont"],
  "New Jersey": ["Delaware", "New York", "Pennsylvania"],
  "New Mexico": ["Arizona", "Colorado", "Oklahoma", "Texas", "Utah"],
  "New York": ["Connecticut", "Massachusetts", "New Jersey", "Pennsylvania", "Vermont"],
  "North Carolina": ["Georgia", "South Carolina", "Tennessee", "Virginia"],
  "North Dakota": ["Minnesota", "Montana", "South Dakota"],
  Ohio: ["Indiana", "Kentucky", "Michigan", "Pennsylvania", "West Virginia"],
  Oklahoma: ["Arkansas", "Colorado", "Kansas", "Missouri", "New Mexico", "Texas"],
  Oregon: ["California", "Idaho", "Nevada", "Washington"],
  Pennsylvania: ["Delaware", "Maryland", "New Jersey", "New York", "Ohio", "West Virginia"],
  "Rhode Island": ["Connecticut", "Massachusetts"],
  "South Carolina": ["Georgia", "North Carolina"],
  "South Dakota": ["Iowa", "Minnesota", "Montana", "Nebraska", "North Dakota", "Wyoming"],
  Tennessee: ["Alabama", "Arkansas", "Georgia", "Kentucky", "Mississippi", "Missouri", "North Carolina", "Virginia"],
  Texas: ["Arkansas", "Louisiana", "New Mexico", "Oklahoma"],
  Utah: ["Arizona", "Colorado", "Idaho", "Nevada", "New Mexico", "Wyoming"],
  Vermont: ["Massachusetts", "New Hampshire", "New York"],
  Virginia: ["Kentucky", "Maryland", "North Carolina", "Tennessee", "West Virginia", "Washington, D.C."],
  Washington: ["Idaho", "Oregon"],
  "Washington, D.C.": ["Maryland", "Virginia"],
  "West Virginia": ["Kentucky", "Maryland", "Ohio", "Pennsylvania", "Virginia"],
  Wisconsin: ["Illinois", "Iowa", "Michigan", "Minnesota"],
  Wyoming: ["Colorado", "Idaho", "Montana", "Nebraska", "South Dakota", "Utah"],
};

export function describeRule(entry: StateThreshold): string {
  return entry.type === "percentage" ? `${entry.thresholdPct}% of ACV` : "Total Loss Formula";
}

export interface NeighborComparison {
  state: string;
  rule: string;
  /** "same" | "lower" | "higher" | "different-method", relative to the page's own state. */
  relation: "same" | "lower" | "higher" | "different-method";
}

export function getNeighborComparisons(entry: StateThreshold, all: StateThreshold[]): NeighborComparison[] {
  const neighbors = BORDERING_STATES[entry.state] ?? [];
  return neighbors
    .map((name) => all.find((s) => s.state === name))
    .filter((s): s is StateThreshold => s !== undefined)
    .map((n) => {
      let relation: NeighborComparison["relation"];
      if (n.type !== entry.type) relation = "different-method";
      else if (n.type === "tlf" || n.thresholdPct === entry.thresholdPct) relation = "same";
      else relation = (n.thresholdPct as number) < (entry.thresholdPct as number) ? "lower" : "higher";
      return { state: n.state, rule: describeRule(n), relation };
    });
}

/**
 * Where a percentage state sits nationally: how many percentage-threshold
 * jurisdictions set a lower, equal or higher bar, and how many use the TLF.
 */
export function getNationalPosition(entry: StateThreshold, all: StateThreshold[]) {
  const pctStates = all.filter((s) => s.type === "percentage");
  const tlfCount = all.length - pctStates.length;
  if (entry.type === "tlf") {
    return { tlfCount, pctCount: pctStates.length, lower: 0, same: tlfCount - 1, higher: 0 };
  }
  const pct = entry.thresholdPct as number;
  return {
    tlfCount,
    pctCount: pctStates.length,
    lower: pctStates.filter((s) => (s.thresholdPct as number) < pct).length,
    same: pctStates.filter((s) => s.thresholdPct === pct && s.state !== entry.state).length,
    higher: pctStates.filter((s) => (s.thresholdPct as number) > pct).length,
  };
}

/**
 * A concrete cross-border scenario for the page's state: the same car and
 * repair estimate, run through this state's rule and one bordering state's
 * rule that differs. Returns null when every neighbor uses the same rule
 * (or there are no neighbors). Uses the $10,000 ACV example vehicle.
 */
export function getCrossBorderScenario(entry: StateThreshold, all: StateThreshold[]): string | null {
  const acv = EXAMPLE_ACV_CENTS;
  const salvage = 100_000;
  const neighbors = getNeighborComparisons(entry, all).filter((n) => n.relation !== "same");
  if (neighbors.length === 0) return null;
  const other = all.find((s) => s.state === neighbors[0].state) as StateThreshold;

  const isTotal = (s: StateThreshold, repair: number) =>
    s.type === "tlf" ? repair + salvage >= acv : repair >= (acv * (s.thresholdPct as number)) / 100;

  // Find a repair estimate (in $250 steps) where the two rules disagree.
  for (let repair = 500_000; repair <= 1_000_000; repair += 25_000) {
    const here = isTotal(entry, repair);
    const there = isTotal(other, repair);
    if (here !== there) {
      const verdict = (s: StateThreshold, total: boolean) =>
        `${total ? "is" : "is not"} a total loss in ${s.state} (${describeRule(s)}${s.type === "tlf" ? `, with an assumed ${formatUSD(salvage)} salvage value` : ""})`;
      return `Take a ${formatUSD(acv)} car with a ${formatUSD(repair)} repair estimate. It ${verdict(entry, here)}, but it ${verdict(other, there)}. If your accident happened near the ${other.state} line, check which state's rule actually applies — usually the state where the vehicle is registered and insured.`;
    }
  }
  return null;
}
