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
  version: "2.0",
  effectiveDate: "2026-11-21",
  reviewedDate: "2026-11-21",
  sources: [
    'Each state\'s statute or regulation, listed with a link on its <a href="/guides/total-loss/state-total-loss-threshold-laws/">state page</a> (checked 2026-11-21). Where a state\'s law sets no percentage, the checker applies the Total Loss Formula, the method most insurers use there.',
  ],
} as const;

export type ThresholdType = "percentage" | "tlf";

export interface StateThreshold {
  state: string;
  /**
   * "percentage": the state's statute or regulation names a percentage of the
   * car's value. "tlf": it does not, so the checker applies the Total Loss
   * Formula (repairs + salvage value vs. ACV), the method insurers there
   * generally use. See `basis` for how the law itself is worded.
   */
  type: ThresholdType;
  /** Percentage as a whole number (e.g. 75 for 75%). Null for TLF states. */
  thresholdPct: number | null;
  /**
   * TLF states only. "formula": the law itself uses a formula-style test
   * (repairs compared with value minus salvage). "insurer": the law ties the
   * total loss to the insurer's decision and sets no test of its own.
   */
  basis?: "formula" | "insurer";
  /**
   * The percentage limits the insurer (it may not total the car below it
   * without the owner's written request) instead of only branding the title.
   */
  insurerFloor?: boolean;
}

/**
 * 50 states + Washington, D.C. Classification from the state-by-state
 * research of 2026-11-21 (src/lib/content/state-threshold-facts.ts holds the
 * citations and details for each state).
 */
export const STATE_THRESHOLDS: StateThreshold[] = [
  { state: "Alabama", type: "percentage", thresholdPct: 75 },
  { state: "Alaska", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Arizona", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Arkansas", type: "percentage", thresholdPct: 70 },
  { state: "California", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Colorado", type: "percentage", thresholdPct: 100 },
  { state: "Connecticut", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Delaware", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Florida", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Georgia", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Hawaii", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Idaho", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Illinois", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Indiana", type: "percentage", thresholdPct: 70 },
  { state: "Iowa", type: "percentage", thresholdPct: 70 },
  { state: "Kansas", type: "percentage", thresholdPct: 75 },
  { state: "Kentucky", type: "percentage", thresholdPct: 75 },
  { state: "Louisiana", type: "percentage", thresholdPct: 75 },
  { state: "Maine", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Maryland", type: "percentage", thresholdPct: 75 },
  { state: "Massachusetts", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Michigan", type: "percentage", thresholdPct: 75 },
  { state: "Minnesota", type: "percentage", thresholdPct: 80 },
  { state: "Mississippi", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Missouri", type: "percentage", thresholdPct: 80 },
  { state: "Montana", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Nebraska", type: "percentage", thresholdPct: 75 },
  { state: "Nevada", type: "percentage", thresholdPct: 65 },
  { state: "New Hampshire", type: "percentage", thresholdPct: 75 },
  { state: "New Jersey", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "New Mexico", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "New York", type: "percentage", thresholdPct: 75 },
  { state: "North Carolina", type: "percentage", thresholdPct: 75 },
  { state: "North Dakota", type: "percentage", thresholdPct: 75 },
  { state: "Ohio", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Oklahoma", type: "percentage", thresholdPct: 70 },
  { state: "Oregon", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Pennsylvania", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Rhode Island", type: "percentage", thresholdPct: 85, insurerFloor: true },
  { state: "South Carolina", type: "percentage", thresholdPct: 75 },
  { state: "South Dakota", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Tennessee", type: "percentage", thresholdPct: 75 },
  { state: "Texas", type: "percentage", thresholdPct: 100 },
  { state: "Utah", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Vermont", type: "tlf", thresholdPct: null, basis: "insurer" },
  { state: "Virginia", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Washington", type: "tlf", thresholdPct: null, basis: "formula" },
  { state: "Washington, D.C.", type: "percentage", thresholdPct: 75 },
  { state: "West Virginia", type: "percentage", thresholdPct: 75 },
  { state: "Wisconsin", type: "percentage", thresholdPct: 70 },
  { state: "Wyoming", type: "tlf", thresholdPct: null, basis: "insurer" },
];

/** Short label for tables: "75% of value", "85% (limits insurers)", "Formula in law", "Insurer decides". */
export function ruleLabel(s: StateThreshold): string {
  if (s.type === "percentage") return s.insurerFloor ? `${s.thresholdPct}% (limits insurers)` : `${s.thresholdPct}% of value`;
  return s.basis === "formula" ? "Formula-style test in law" : "No % in law: insurer decides";
}

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

/**
 * Deterministic URL slug for a state name, used to build one static page per
 * state under /guides/total-loss/state-total-loss-threshold-laws/[slug]/.
 * Kept in this file, next to STATE_THRESHOLDS, so the calculator's exact
 * state names and the state pages' slugs can never drift out of sync.
 * "Washington, D.C." -> "washington-dc".
 */
export function slugifyState(state: string): string {
  return state
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-");
}

/** Reverse lookup: find a StateThreshold entry from its URL slug. */
export function lookupStateBySlug(slug: string): StateThreshold | null {
  return STATE_THRESHOLDS.find((s) => slugifyState(s.state) === slug) ?? null;
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
  basis: "formula" | "insurer" | null;
  /** True when the state's percentage stops the insurer totaling below it (Rhode Island). */
  insurerFloor: boolean;
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
  /**
   * The repair estimate at which the state's own test is met: ACV × threshold
   * in percentage states, ACV − salvage in TLF states. Null for a TLF state
   * with no salvage estimate (the line can't be placed without it).
   */
  repairAtLineCents: number | null;
  /** repairEstimate − repairAtLine. Zero or positive = at or over the line. Null when the line is unknown. */
  marginCents: number | null;
  /**
   * Percentage states only, when a salvage estimate was given: repair + salvage
   * meets or exceeds ACV. Insurers often total a car at that point even below
   * the state percentage, because repairing it costs more than paying it out.
   */
  insurerMayTotalAnyway: boolean | null;
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

  let repairAtLineCents: number | null = null;
  if (match.type === "percentage" && match.thresholdPct !== null) {
    repairAtLineCents = Math.ceil((input.acvCents * match.thresholdPct) / 100);
  } else if (match.type === "tlf" && typeof input.estimatedSalvageValueCents === "number") {
    repairAtLineCents = Math.max(0, input.acvCents - input.estimatedSalvageValueCents);
  }
  const marginCents = repairAtLineCents === null ? null : input.repairEstimateCents - repairAtLineCents;

  let insurerMayTotalAnyway: boolean | null = null;
  if (match.type === "percentage" && !match.insurerFloor && typeof input.estimatedSalvageValueCents === "number") {
    insurerMayTotalAnyway = input.repairEstimateCents + input.estimatedSalvageValueCents >= input.acvCents;
  }

  return {
    state: match.state,
    type: match.type,
    thresholdPct: match.thresholdPct,
    basis: match.basis ?? null,
    insurerFloor: match.insurerFloor === true,
    repairEstimateCents: input.repairEstimateCents,
    acvCents: input.acvCents,
    estimatedSalvageValueCents: input.estimatedSalvageValueCents ?? null,
    repairPercentOfACV,
    meetsPercentageThreshold,
    tlfSumCents,
    meetsTLF,
    repairAtLineCents,
    marginCents,
    insurerMayTotalAnyway,
  };
}
