/**
 * FairClaimCalculator.com v2 — Total-Loss Threshold Checker.
 *
 * Reuses the exact same state-by-state table already researched, sourced,
 * and published in
 * /guides/total-loss/state-total-loss-threshold-laws/ — this calculator
 * does not introduce any new state data, only turns the guide's static
 * table into an interactive lookup plus the two formulas it already
 * explains (simple percentage threshold, and the Total Loss Formula).
 *
 * All money math uses integer CENTS internally; USD formatting happens
 * only at display time. Zero dependency on `document` — pure and testable.
 */

export const TOTAL_LOSS_THRESHOLD_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-08-14",
  reviewedDate: "2026-08-14",
  sources: [
    'Brennan, R., "Total Loss Threshold by State," Policygenius, updated July 2026 — same secondary compilation cited in the companion guide. Treat as a starting point, not a final legal citation; confirm your own state\'s current rule with your state insurance department.',
    'New Hampshire Insurance Department, <a href="https://www.insurance.nh.gov/about-us/property-casualty-division/list-accepted-valuation-methods-total-loss" target="_blank" rel="noopener">List of Accepted Valuation Methods for Total Loss</a> — a real example of a state regulator publishing its own accepted methodology.',
  ],
} as const;

export type ThresholdType = "percentage" | "tlf";

export interface StateThreshold {
  state: string;
  type: ThresholdType;
  /** Percentage as a whole number (e.g. 75 for 75%). Null for TLF states. */
  thresholdPct: number | null;
}

/**
 * Same 51 entries (50 states + Washington, D.C.) as the published guide's
 * table. Keep these two in sync if either is ever updated — see the
 * guide's own sourcing note about periodic review.
 */
export const STATE_THRESHOLDS: StateThreshold[] = [
  { state: "Alabama", type: "percentage", thresholdPct: 75 },
  { state: "Alaska", type: "tlf", thresholdPct: null },
  { state: "Arizona", type: "tlf", thresholdPct: null },
  { state: "Arkansas", type: "percentage", thresholdPct: 70 },
  { state: "California", type: "tlf", thresholdPct: null },
  { state: "Colorado", type: "percentage", thresholdPct: 100 },
  { state: "Connecticut", type: "tlf", thresholdPct: null },
  { state: "Delaware", type: "tlf", thresholdPct: null },
  { state: "Florida", type: "percentage", thresholdPct: 80 },
  { state: "Georgia", type: "tlf", thresholdPct: null },
  { state: "Hawaii", type: "tlf", thresholdPct: null },
  { state: "Idaho", type: "tlf", thresholdPct: null },
  { state: "Illinois", type: "tlf", thresholdPct: null },
  { state: "Indiana", type: "percentage", thresholdPct: 70 },
  { state: "Iowa", type: "percentage", thresholdPct: 70 },
  { state: "Kansas", type: "percentage", thresholdPct: 75 },
  { state: "Kentucky", type: "percentage", thresholdPct: 75 },
  { state: "Louisiana", type: "percentage", thresholdPct: 75 },
  { state: "Maine", type: "tlf", thresholdPct: null },
  { state: "Maryland", type: "percentage", thresholdPct: 75 },
  { state: "Massachusetts", type: "tlf", thresholdPct: null },
  { state: "Michigan", type: "percentage", thresholdPct: 75 },
  { state: "Minnesota", type: "percentage", thresholdPct: 70 },
  { state: "Mississippi", type: "tlf", thresholdPct: null },
  { state: "Missouri", type: "percentage", thresholdPct: 80 },
  { state: "Montana", type: "tlf", thresholdPct: null },
  { state: "Nebraska", type: "percentage", thresholdPct: 75 },
  { state: "Nevada", type: "percentage", thresholdPct: 65 },
  { state: "New Hampshire", type: "percentage", thresholdPct: 75 },
  { state: "New Jersey", type: "tlf", thresholdPct: null },
  { state: "New Mexico", type: "tlf", thresholdPct: null },
  { state: "New York", type: "percentage", thresholdPct: 75 },
  { state: "North Carolina", type: "percentage", thresholdPct: 75 },
  { state: "North Dakota", type: "percentage", thresholdPct: 75 },
  { state: "Ohio", type: "tlf", thresholdPct: null },
  { state: "Oklahoma", type: "percentage", thresholdPct: 60 },
  { state: "Oregon", type: "percentage", thresholdPct: 80 },
  { state: "Pennsylvania", type: "tlf", thresholdPct: null },
  { state: "Rhode Island", type: "tlf", thresholdPct: null },
  { state: "South Carolina", type: "percentage", thresholdPct: 75 },
  { state: "South Dakota", type: "tlf", thresholdPct: null },
  { state: "Tennessee", type: "percentage", thresholdPct: 75 },
  { state: "Texas", type: "percentage", thresholdPct: 100 },
  { state: "Utah", type: "tlf", thresholdPct: null },
  { state: "Vermont", type: "tlf", thresholdPct: null },
  { state: "Virginia", type: "percentage", thresholdPct: 75 },
  { state: "Washington", type: "tlf", thresholdPct: null },
  { state: "Washington, D.C.", type: "percentage", thresholdPct: 75 },
  { state: "West Virginia", type: "percentage", thresholdPct: 75 },
  { state: "Wisconsin", type: "percentage", thresholdPct: 70 },
  { state: "Wyoming", type: "percentage", thresholdPct: 75 },
];

export interface ToCentsResult {
  value: number;
  error: string | null;
}
export interface ToCentsOptions {
  label?: string;
}

export function toCents(raw: string | number | null | undefined, opts: ToCentsOptions = {}): ToCentsResult {
  if (raw === null || raw === undefined || raw === "") return { value: 0, error: null };
  const n = Number(raw);
  if (isNaN(n)) return { value: 0, error: `${opts.label || "This field"} must be a number.` };
  if (n < 0) return { value: 0, error: `${opts.label || "This field"} can't be negative.` };
  if (n > 10000000) return { value: 0, error: `${opts.label || "This field"} looks too large — please check it.` };
  return { value: Math.round(n * 100), error: null };
}

export function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function lookupState(state: string): StateThreshold | null {
  return STATE_THRESHOLDS.find((s) => s.state.toLowerCase() === state.trim().toLowerCase()) ?? null;
}

export class ThresholdValidationError extends Error {}

export interface ThresholdInput {
  state: string;
  repairEstimateCents: number;
  acvCents: number;
  /** Only used for TLF states; optional. */
  estimatedSalvageValueCents?: number;
}

export interface ThresholdResult {
  state: string;
  type: ThresholdType;
  thresholdPct: number | null;
  repairEstimateCents: number;
  acvCents: number;
  estimatedSalvageValueCents: number | null;
  /** repairEstimateCents / acvCents, as a percentage (e.g. 75.0). */
  repairPercentOfACV: number;
  /** Only meaningful for percentage-threshold states. */
  meetsPercentageThreshold: boolean | null;
  /** repairEstimateCents + estimatedSalvageValueCents, only for TLF states with a salvage estimate provided. */
  tlfSumCents: number | null;
  /** Only meaningful for TLF states when a salvage estimate was provided. */
  meetsTLF: boolean | null;
}

export function checkTotalLossThreshold(input: ThresholdInput): ThresholdResult {
  const match = lookupState(input.state);
  if (!match) {
    throw new ThresholdValidationError("Select a valid U.S. state or Washington, D.C.");
  }
  if (input.acvCents <= 0) {
    throw new ThresholdValidationError("Actual cash value (ACV) must be greater than zero.");
  }

  const repairPercentOfACV = (input.repairEstimateCents / input.acvCents) * 100;

  let meetsPercentageThreshold: boolean | null = null;
  if (match.type === "percentage" && match.thresholdPct !== null) {
    meetsPercentageThreshold = repairPercentOfACV >= match.thresholdPct;
  }

  let tlfSumCents: number | null = null;
  let meetsTLF: boolean | null = null;
  if (match.type === "tlf" && typeof input.estimatedSalvageValueCents === "number") {
    tlfSumCents = input.repairEstimateCents + input.estimatedSalvageValueCents;
    meetsTLF = tlfSumCents >= input.acvCents;
  }

  return {
    state: match.state,
    type: match.type,
    thresholdPct: match.thresholdPct,
    repairEstimateCents: input.repairEstimateCents,
    acvCents: input.acvCents,
    estimatedSalvageValueCents: input.estimatedSalvageValueCents ?? null,
    repairPercentOfACV,
    meetsPercentageThreshold,
    tlfSumCents,
    meetsTLF,
  };
}
