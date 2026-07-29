/**
 * FairClaimCalculator.com v2 — Total-Loss Offer Audit.
 *
 * The price statistics are a typed port of `js/total-loss-audit.js`. The
 * comparable-quality review is new in v2 because the old form collected
 * year, mileage, and distance without using them in any visible result.
 * Quality fields never create a dollar adjustment or a score. They produce
 * factual, plain-language questions for the user to verify.
 */

export const TOTAL_LOSS_AUDIT_CONFIG = {
  version: "2.0",
  effectiveDate: "2026-07-29",
  reviewedDate: "2026-07-29",
  outlierThresholdPct: 0.2,
  minimumGroupSize: 2,
  preferredGroupSize: 3,
  sources: [
    "The mean, median, range, and 20% possible-outlier check are descriptive arithmetic only. The outlier threshold is a disclosed review heuristic, not a legal or professional appraisal standard.",
    "Comparable-quality prompts do not assign dollar weights. They surface year, mileage, trim/configuration, distance, listing status/date, seller type, condition, and adjustment differences for the user to verify.",
  ],
} as const;

export type ReportStatus = "correct" | "incorrect" | "unknown" | "not_shown";
export type MatchStatus = "yes" | "no" | "unknown";
export type ListingStatus = "active" | "sold" | "expired" | "unknown";
export type SellerType = "dealer" | "private" | "unknown";
export type ConditionMatch = "similar" | "better" | "worse" | "unknown";
export type CompSource = "insurer" | "owner";

export interface ToCentsResult {
  value: number;
  error: string | null;
}

export interface MismatchField {
  key: string;
  label: string;
}

export const MISMATCH_FIELDS: readonly MismatchField[] = [
  { key: "vinTrim", label: "VIN and trim level match your vehicle" },
  { key: "drivetrain", label: "Drivetrain, engine, and body configuration match" },
  { key: "options", label: "Factory options and packages match" },
  { key: "mileage", label: "Mileage shown matches your vehicle at the time of loss" },
  { key: "condition", label: "Condition category and deductions seem accurate" },
  { key: "priorDamage", label: "Prior-damage deductions, if any, are explained" },
  { key: "geoRadius", label: "Comparable vehicles come from a reasonable market area" },
  { key: "valuationDate", label: "Valuation date is close to your date of loss" },
  { key: "listingStatus", label: "Comparable listing status and seller type are shown" },
  { key: "arithmetic", label: "The math from adjusted comps to the final base value adds up" },
] as const;

export interface FlaggedMismatch {
  key: string;
  label: string;
  status: Exclude<ReportStatus, "correct">;
  note: string;
}

export interface PriceComp {
  valueCents: number;
}

export type SampleConfidence = "single-comp" | "limited" | "more-context";

export interface CompStats {
  count: number;
  meanCents: number;
  medianCents: number;
  minCents: number;
  maxCents: number;
  outlierIndexes: number[];
  confidence: SampleConfidence;
  canCompareGroup: boolean;
}

export interface AuditSummary {
  acvCents: number;
  insurerStats: CompStats | null;
  userStats: CompStats | null;
  acvVsInsurerFlag: string | null;
  acvVsUserGapCents: number | null;
  acvVsUserNote: string | null;
  outlierThresholdPct: number;
}

export interface SubjectVehicle {
  year: number | null;
  mileage: number | null;
  trim: string;
  configuration: string;
}

export interface ComparableVehicle {
  id: string;
  source: CompSource;
  year: number | null;
  mileage: number | null;
  distanceMiles: number | null;
  trimMatch: MatchStatus;
  configurationMatch: MatchStatus;
  listingStatus: ListingStatus;
  listingDate: string;
  sellerType: SellerType;
  conditionMatch: ConditionMatch;
  adjustmentsShown: MatchStatus;
}

export interface QualityQuestion {
  key: string;
  text: string;
}

export interface ComparableQualityReview {
  compId: string;
  source: CompSource;
  questions: QualityQuestion[];
}

export function toCents(
  raw: string | number | null | undefined,
  opts: { label?: string } = {},
): ToCentsResult {
  if (raw === null || raw === undefined || raw === "") {
    return { value: 0, error: null };
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return { value: 0, error: `${opts.label || "This field"} must be a number.` };
  }
  if (n < 0) {
    return { value: 0, error: `${opts.label || "This field"} can't be negative.` };
  }
  if (n > 10_000_000) {
    return { value: 0, error: `${opts.label || "This field"} looks too large — please check it.` };
  }
  return { value: Math.round(n * 100), error: null };
}

export function parseOptionalWholeNumber(
  raw: string | number | null | undefined,
  opts: { label: string; max: number },
): { value: number | null; error: string | null } {
  if (raw === null || raw === undefined || raw === "") {
    return { value: null, error: null };
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { value: null, error: `${opts.label} must be a whole number.` };
  }
  if (n < 0) {
    return { value: null, error: `${opts.label} can't be negative.` };
  }
  if (n > opts.max) {
    return { value: null, error: `${opts.label} looks too large — please check it.` };
  }
  return { value: n, error: null };
}

export function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function evaluateMismatches(
  statuses: Partial<Record<string, ReportStatus>>,
): FlaggedMismatch[] {
  const flagged: FlaggedMismatch[] = [];
  for (const field of MISMATCH_FIELDS) {
    const status = statuses[field.key] ?? "unknown";
    if (status === "correct") continue;
    const note =
      status === "incorrect"
        ? "You marked this as not matching your vehicle — a possible mismatch to verify with the insurer."
        : status === "not_shown"
          ? "The report doesn't show this — ask whether a complete report includes it."
          : "You're not sure — worth confirming before you rely on the offer.";
    flagged.push({ ...field, status, note });
  }
  return flagged;
}

function confidenceForCount(count: number): SampleConfidence {
  if (count <= 1) return "single-comp";
  if (count < TOTAL_LOSS_AUDIT_CONFIG.preferredGroupSize) return "limited";
  return "more-context";
}

export function compStats(comps: PriceComp[]): CompStats | null {
  const values = comps
    .map((comp) => comp.valueCents)
    .filter((value) => Number.isFinite(value) && value > 0);
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const middle = Math.floor(count / 2);
  const medianCents =
    count % 2 === 1
      ? sorted[middle]
      : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  const meanCents = Math.round(values.reduce((sum, value) => sum + value, 0) / count);
  const outlierIndexes: number[] = [];

  if (medianCents > 0 && count >= TOTAL_LOSS_AUDIT_CONFIG.minimumGroupSize) {
    comps.forEach((comp, index) => {
      if (!Number.isFinite(comp.valueCents) || comp.valueCents <= 0) return;
      const deviation = Math.abs(comp.valueCents - medianCents) / medianCents;
      if (deviation > TOTAL_LOSS_AUDIT_CONFIG.outlierThresholdPct) {
        outlierIndexes.push(index);
      }
    });
  }

  return {
    count,
    meanCents,
    medianCents,
    minCents: sorted[0],
    maxCents: sorted[count - 1],
    outlierIndexes,
    confidence: confidenceForCount(count),
    canCompareGroup: count >= TOTAL_LOSS_AUDIT_CONFIG.minimumGroupSize,
  };
}

export function compStatsExcluding(
  comps: PriceComp[],
  excludeIndexes: number[],
): CompStats | null {
  return compStats(comps.filter((_, index) => !excludeIndexes.includes(index)));
}

export function auditSummary(input: {
  acvCents: number;
  insurerComps?: PriceComp[];
  userComps?: PriceComp[];
}): AuditSummary {
  const insurerStats = compStats(input.insurerComps ?? []);
  const userStats = compStats(input.userComps ?? []);

  let acvVsInsurerFlag: string | null = null;
  if (
    insurerStats?.canCompareGroup &&
    (input.acvCents < insurerStats.minCents || input.acvCents > insurerStats.maxCents)
  ) {
    acvVsInsurerFlag =
      `The insurer's stated ACV (${formatUSD(input.acvCents)}) falls outside ` +
      `the range of its entered comparables (${formatUSD(insurerStats.minCents)} – ` +
      `${formatUSD(insurerStats.maxCents)}). Ask how the ACV was derived from those comps.`;
  }

  let acvVsUserGapCents: number | null = null;
  let acvVsUserNote: string | null = null;
  if (userStats?.canCompareGroup) {
    acvVsUserGapCents = userStats.medianCents - input.acvCents;
    if (acvVsUserGapCents !== 0) {
      acvVsUserNote =
        acvVsUserGapCents > 0
          ? `Your entered comparables have a median ${formatUSD(acvVsUserGapCents)} higher than the insurer's stated ACV.`
          : `Your entered comparables have a median ${formatUSD(Math.abs(acvVsUserGapCents))} lower than the insurer's stated ACV.`;
    }
  }

  return {
    acvCents: input.acvCents,
    insurerStats,
    userStats,
    acvVsInsurerFlag,
    acvVsUserGapCents,
    acvVsUserNote,
    outlierThresholdPct: TOTAL_LOSS_AUDIT_CONFIG.outlierThresholdPct,
  };
}

function signedWhole(value: number): string {
  return Math.abs(value).toLocaleString("en-US");
}

export function reviewComparableQuality(
  subject: SubjectVehicle,
  comps: ComparableVehicle[],
): ComparableQualityReview[] {
  return comps.map((comp) => {
    const questions: QualityQuestion[] = [];

    if (subject.year !== null && comp.year !== null && comp.year !== subject.year) {
      const difference = comp.year - subject.year;
      questions.push({
        key: "year",
        text: `Model year differs by ${signedWhole(difference)} year${Math.abs(difference) === 1 ? "" : "s"} (${comp.year} comp vs. ${subject.year} vehicle). Ask how that difference was handled.`,
      });
    } else if (comp.year === null) {
      questions.push({ key: "year", text: "Model year was not entered; verify it before relying on this comp." });
    }

    if (
      subject.mileage !== null &&
      subject.mileage > 0 &&
      comp.mileage !== null &&
      comp.mileage !== subject.mileage
    ) {
      const difference = comp.mileage - subject.mileage;
      const direction = difference > 0 ? "higher" : "lower";
      const pct = Math.round((Math.abs(difference) / subject.mileage) * 100);
      questions.push({
        key: "mileage",
        text: `Mileage is ${signedWhole(difference)} miles ${direction} (${pct}% difference). Verify any mileage adjustment shown in the report.`,
      });
    } else if (comp.mileage === null) {
      questions.push({ key: "mileage", text: "Comparable mileage was not entered; verify it and any mileage adjustment." });
    }

    if (comp.trimMatch !== "yes") {
      questions.push({
        key: "trim",
        text:
          comp.trimMatch === "no"
            ? "Trim does not match. Check whether the report explains a trim/options adjustment."
            : "Trim match is unknown. Confirm the exact trim and option package.",
      });
    }

    if (comp.configurationMatch !== "yes") {
      questions.push({
        key: "configuration",
        text:
          comp.configurationMatch === "no"
            ? "Engine, drivetrain, or body configuration does not match. Ask how that difference was handled."
            : "Configuration match is unknown. Confirm engine, drivetrain, and body style.",
      });
    }

    if (comp.distanceMiles === null) {
      questions.push({ key: "distance", text: "Listing distance was not entered; confirm whether the comp is from the same market area." });
    } else {
      questions.push({
        key: "distance",
        text: `Listing is ${comp.distanceMiles.toLocaleString("en-US")} miles away. Decide whether that represents the same geographic market and ask how location was handled.`,
      });
    }

    if (comp.listingStatus !== "active") {
      const statusText =
        comp.listingStatus === "unknown"
          ? "Listing status is unknown"
          : `Listing is marked ${comp.listingStatus}`;
      questions.push({ key: "listing-status", text: `${statusText}; verify its status on the valuation date.` });
    }

    if (!comp.listingDate) {
      questions.push({ key: "listing-date", text: "Listing date was not entered; save the date checked and a copy or screenshot." });
    }

    if (comp.sellerType === "unknown") {
      questions.push({ key: "seller-type", text: "Seller type is unknown; confirm whether this is a dealer or private-party listing." });
    } else {
      questions.push({
        key: "seller-type",
        text: `Seller is marked ${comp.sellerType === "dealer" ? "dealer" : "private party"}; compare like-for-like or ask how seller type was handled.`,
      });
    }

    if (comp.conditionMatch !== "similar") {
      const conditionText =
        comp.conditionMatch === "unknown"
          ? "Comparable condition is unknown"
          : `Comparable condition is marked ${comp.conditionMatch} than the subject vehicle`;
      questions.push({ key: "condition", text: `${conditionText}; verify the condition evidence and any adjustment.` });
    }

    if (comp.adjustmentsShown !== "yes") {
      questions.push({
        key: "adjustments",
        text:
          comp.adjustmentsShown === "no"
            ? "No itemized adjustments are shown. Ask for the written adjustment lines and arithmetic."
            : "It is unclear whether itemized adjustments are shown. Check the full report.",
      });
    }

    return { compId: comp.id, source: comp.source, questions };
  });
}

