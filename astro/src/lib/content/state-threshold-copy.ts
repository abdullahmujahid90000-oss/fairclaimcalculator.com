/**
 * Computed pieces of the 51 state pages under
 * /guides/total-loss/state-total-loss-threshold-laws/[state]/: a worked
 * example with that state's own rule, the bordering-state comparison and a
 * cross-border scenario. The legal facts themselves live in
 * state-threshold-facts.ts.
 *
 * 2026-11-21: the old tier-based paragraphs ("At 75%, X uses the most common
 * threshold...") were removed. They were the same sentences on every page
 * in a tier and made the pages near-duplicates (89–98% similar).
 */

import type { StateThreshold } from "../calculators/total-loss-threshold";
import { formatUSD, ruleLabel, STATE_THRESHOLDS } from "../calculators/total-loss-threshold";

/**
 * Illustrative pre-crash values for the worked examples, rotated by the
 * state's position so neighboring pages don't all use the same car. They are
 * examples, labeled as such on the page, not market data.
 */
const EXAMPLE_VALUES_DOLLARS = [8450, 9725, 11380, 12640, 13950, 15275, 16890, 18420, 19760, 21350, 23180];

/** Example salvage value: 17% of the car's value, rounded to the nearest $25. */
export function exampleSalvageCents(acvCents: number): number {
  return Math.round((acvCents * 0.17) / 2500) * 2500;
}

export function exampleAcvCents(state: string): number {
  const i = Math.max(0, STATE_THRESHOLDS.findIndex((s) => s.state === state));
  return EXAMPLE_VALUES_DOLLARS[(i * 7) % EXAMPLE_VALUES_DOLLARS.length] * 100;
}

export interface WorkedExample {
  acvCents: number;
  /** Repair amount where the state's test is met. */
  lineCents: number;
  salvageCents: number | null;
  /** Repair amount where repairs + salvage reach the car's value (when an insurer would usually total it). */
  formulaLineCents: number;
}

export function getWorkedExample(entry: StateThreshold): WorkedExample {
  const acvCents = exampleAcvCents(entry.state);
  const salvageCents = exampleSalvageCents(acvCents);
  const formulaLineCents = acvCents - salvageCents;
  if (entry.type === "percentage") {
    return {
      acvCents,
      lineCents: Math.ceil((acvCents * (entry.thresholdPct as number)) / 100),
      salvageCents,
      formulaLineCents,
    };
  }
  return { acvCents, lineCents: formulaLineCents, salvageCents, formulaLineCents };
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
  return ruleLabel(entry);
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
 * A concrete cross-border scenario for the page's state: the same car and
 * repair estimate, run through this state's rule and one bordering state's
 * rule that differs. Returns null when every neighbor uses the same rule
 * (or there are no neighbors). Uses the $10,000 ACV example vehicle.
 */
export function getCrossBorderScenario(entry: StateThreshold, all: StateThreshold[]): string | null {
  const acv = exampleAcvCents(entry.state);
  const salvage = exampleSalvageCents(acv);
  const neighbors = getNeighborComparisons(entry, all).filter((n) => n.relation !== "same");
  if (neighbors.length === 0) return null;
  const other = all.find((s) => s.state === neighbors[0].state) as StateThreshold;

  const isTotal = (s: StateThreshold, repair: number) =>
    s.type === "tlf" ? repair + salvage >= acv : repair >= (acv * (s.thresholdPct as number)) / 100;

  // Find a repair estimate (in $250 steps, from half the car's value up) where the two rules disagree.
  for (let repair = Math.round(acv / 2 / 25_000) * 25_000; repair <= acv; repair += 25_000) {
    const here = isTotal(entry, repair);
    const there = isTotal(other, repair);
    if (here !== there) {
      const verdict = (s: StateThreshold, total: boolean) =>
        `${total ? "crosses" : "stays under"} the line in ${s.state} (${s.type === "tlf" ? `repairs plus a ${formatUSD(salvage)} salvage value against the car's value` : `${s.thresholdPct}% of value`})`;
      return `The same ${formatUSD(acv)} car with a ${formatUSD(repair)} repair estimate ${verdict(entry, here)}, but ${verdict(other, there)}. The rule that applies is usually the one where the car is registered and insured, not where the crash happened.`;
    }
  }
  return null;
}
