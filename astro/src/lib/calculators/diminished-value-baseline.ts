/**
 * FairClaimCalculator.com v2 — Diminished-Value Baseline & Market Evidence.
 *
 * Produces two separate outputs that are never averaged:
 * 1. A transparent, commonly published insurer-style "17c" baseline.
 * 2. Descriptive statistics for user-entered clean-history and
 *    accident-history comparable listings.
 */

export const DV_CONFIG = {
  version: "1.1",
  effectiveDate: "2026-07-29",
  reviewedDate: "2026-07-29",
  baseCapPct: 0.1,
  damageMultipliers: [
    { key: "severe", label: "Severe — structural or frame damage", value: 1 },
    { key: "major", label: "Major — structural work plus multiple panels replaced", value: 0.75 },
    { key: "moderate", label: "Moderate — some structural work and panel replacement", value: 0.5 },
    { key: "minor", label: "Minor — panel damage only, no structural involvement", value: 0.25 },
    { key: "none", label: "Cosmetic only — fully repaired, no structural damage", value: 0 },
  ],
  mileageBands: [
    { max: 19_999, value: 1, label: "0–19,999 miles" },
    { max: 39_999, value: 0.8, label: "20,000–39,999 miles" },
    { max: 59_999, value: 0.6, label: "40,000–59,999 miles" },
    { max: 79_999, value: 0.4, label: "60,000–79,999 miles" },
    { max: 99_999, value: 0.2, label: "80,000–99,999 miles" },
    { max: Number.POSITIVE_INFINITY, value: 0, label: "100,000+ miles" },
  ],
  maxPlausibleMiles: 400_000,
  maxPlausibleValueCents: 500_000_000,
  minimumMarketGroupSize: 2,
  sources: [
    "The multiplier table is the commonly published version of an insurer-style formula associated with a 2002 Muscogee County, Georgia class-settlement order in the Mabry litigation; it is not presented as a state or national legal standard.",
    "Georgia Office of Insurance and Safety Fire Commissioner Directive 08-P&C-2 (December 2008) states that no formula was approved as determinative of diminished value.",
  ],
} as const;

export type DamageCategory = (typeof DV_CONFIG.damageMultipliers)[number]["key"];

export class DVValidationError extends Error {
  field: "preAccidentValue" | "mileage" | "damageCategory";

  constructor(field: DVValidationError["field"], message: string) {
    super(message);
    this.name = "DVValidationError";
    this.field = field;
  }
}

export interface BaselineInput {
  preAccidentValue: string | number | null | undefined;
  mileage: string | number | null | undefined;
  damageCategory: string | null | undefined;
}

export interface BaselineResult {
  preAccidentValueCents: number;
  baseCapPct: number;
  baseCapCents: number;
  damageKey: DamageCategory;
  damageLabel: string;
  damageMultiplier: number;
  afterDamageCents: number;
  mileageLabel: string;
  mileageMultiplier: number;
  resultCents: number;
  configVersion: string;
  reviewedDate: string;
}

export interface MarketComp {
  price: string | number | null | undefined;
}

export interface MarketStats {
  count: number;
  meanCents: number;
  medianCents: number;
  minCents: number;
  maxCents: number;
  confidence: "single-comp" | "limited" | "more-context";
}

export interface MarketEvidenceResult {
  cleanStats: MarketStats | null;
  accidentStats: MarketStats | null;
  gapCents: number | null;
  hasEnoughEvidence: boolean;
}

export function toCents(
  raw: string | number | null | undefined,
  label = "Value",
): number | null {
  if (raw === "" || raw === null || raw === undefined) return null;
  if (typeof raw === "string" && raw.trim() === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${label} must be a number.`);
  if (value < 0) throw new Error(`${label} cannot be negative.`);
  return Math.round(value * 100);
}

export function formatUSD(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return "—";
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function getDamageMultiplier(key: string | null | undefined) {
  return DV_CONFIG.damageMultipliers.find((item) => item.key === key) ?? null;
}

export function getMileageBand(miles: number) {
  return (
    DV_CONFIG.mileageBands.find((band) => miles <= band.max) ??
    DV_CONFIG.mileageBands[DV_CONFIG.mileageBands.length - 1]
  );
}

export function calculate17cBaseline(input: BaselineInput): BaselineResult {
  let preAccidentValueCents: number | null;
  try {
    preAccidentValueCents = toCents(input.preAccidentValue, "Pre-accident value");
  } catch (error) {
    throw new DVValidationError("preAccidentValue", (error as Error).message);
  }
  if (preAccidentValueCents === null) {
    throw new DVValidationError("preAccidentValue", "Enter the vehicle's pre-accident value.");
  }
  if (preAccidentValueCents === 0) {
    throw new DVValidationError("preAccidentValue", "Pre-accident value must be greater than zero.");
  }
  if (preAccidentValueCents > DV_CONFIG.maxPlausibleValueCents) {
    throw new DVValidationError(
      "preAccidentValue",
      "Pre-accident value is above the calculator's plausibility ceiling — please double-check it.",
    );
  }

  if (input.mileage === "" || input.mileage === null || input.mileage === undefined) {
    throw new DVValidationError("mileage", "Enter the vehicle's mileage at the time of loss.");
  }
  const mileage = Number(input.mileage);
  if (!Number.isFinite(mileage)) {
    throw new DVValidationError("mileage", "Mileage must be a number.");
  }
  if (!Number.isInteger(mileage)) {
    throw new DVValidationError("mileage", "Mileage must be a whole number.");
  }
  if (mileage < 0) {
    throw new DVValidationError("mileage", "Mileage cannot be negative.");
  }
  if (mileage > DV_CONFIG.maxPlausibleMiles) {
    throw new DVValidationError(
      "mileage",
      "Mileage is above the calculator's plausibility ceiling — please double-check it.",
    );
  }

  const damage = getDamageMultiplier(input.damageCategory);
  if (!damage) {
    throw new DVValidationError("damageCategory", "Select a damage category.");
  }

  const mileageBand = getMileageBand(mileage);
  const baseCapCents = Math.round(preAccidentValueCents * DV_CONFIG.baseCapPct);
  const afterDamageCents = Math.round(baseCapCents * damage.value);
  const resultCents = Math.round(afterDamageCents * mileageBand.value);

  return {
    preAccidentValueCents,
    baseCapPct: DV_CONFIG.baseCapPct,
    baseCapCents,
    damageKey: damage.key,
    damageLabel: damage.label,
    damageMultiplier: damage.value,
    afterDamageCents,
    mileageLabel: mileageBand.label,
    mileageMultiplier: mileageBand.value,
    resultCents,
    configVersion: DV_CONFIG.version,
    reviewedDate: DV_CONFIG.reviewedDate,
  };
}

export function statsForCentsList(list: number[]): MarketStats | null {
  const valid = list.filter((value) => Number.isFinite(value) && value > 0);
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((a, b) => a - b);
  const count = sorted.length;
  const meanCents = Math.round(sorted.reduce((sum, value) => sum + value, 0) / count);
  const middle = Math.floor(count / 2);
  const medianCents =
    count % 2 === 1
      ? sorted[middle]
      : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  return {
    count,
    meanCents,
    medianCents,
    minCents: sorted[0],
    maxCents: sorted[count - 1],
    confidence: count === 1 ? "single-comp" : count === 2 ? "limited" : "more-context",
  };
}

function pricesToCents(comps: MarketComp[]): number[] {
  return comps
    .map((comp) => {
      if (comp?.price === "" || comp?.price === null || comp?.price === undefined) return null;
      const price = Number(comp.price);
      if (!Number.isFinite(price) || price <= 0) return null;
      return Math.round(price * 100);
    })
    .filter((value): value is number => value !== null);
}

export function evaluateMarketEvidence(
  cleanComps: MarketComp[],
  accidentComps: MarketComp[],
): MarketEvidenceResult {
  const cleanStats = statsForCentsList(pricesToCents(cleanComps));
  const accidentStats = statsForCentsList(pricesToCents(accidentComps));
  const hasEnoughEvidence = Boolean(
    cleanStats &&
      accidentStats &&
      cleanStats.count >= DV_CONFIG.minimumMarketGroupSize &&
      accidentStats.count >= DV_CONFIG.minimumMarketGroupSize,
  );

  return {
    cleanStats,
    accidentStats,
    gapCents:
      hasEnoughEvidence && cleanStats && accidentStats
        ? cleanStats.medianCents - accidentStats.medianCents
        : null,
    hasEnoughEvidence,
  };
}

