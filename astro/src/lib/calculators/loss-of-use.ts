/**
 * FairClaimCalculator.com v2 — Rental / Loss-of-Use Reimbursement calculator.
 *
 * Answers one question: "Given the daily rate I was offered and any policy
 * cap, does the math work out, and how does it compare with what I actually
 * spent?" This is organizing arithmetic, not a determination of what a
 * "reasonable" rental period or rate is for your claim — see
 * /guides/claim-process/rental-car-loss-of-use-reimbursement/ for why that
 * varies by policy (first-party rental-reimbursement coverage) or by state
 * (third-party loss-of-use claims) and cannot be reduced to one number.
 *
 * All money math uses integer CENTS internally; USD formatting happens only
 * at display time. Zero dependency on `document` — pure and testable.
 */

export const LOSS_OF_USE_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-08-08",
  reviewedDate: "2026-08-08",
  sources: [
    'Nevada Division of Insurance, filed policy endorsement Form A-431 (05-11), "Rental Reimbursement Endorsement" — a real, publicly filed example of how one insurer\'s first-party rental-reimbursement coverage structures a daily cap and a total per-claim cap.',
    "Texas Office of Public Insurance Counsel (OPIC), Auto Insurance resources — describing loss-of-use damages under a third-party property-damage liability claim as governed by a reasonableness standard, not a fixed formula.",
  ],
  /** Matches the 20% possible-outlier heuristic already used in the
   * Total-Loss Offer Audit calculator, for internal consistency across
   * this site's tools. A disclosed review heuristic, not a legal standard. */
  lowRateThresholdPct: 0.2,
} as const;

export interface ToCentsResult {
  value: number;
  error: string | null;
}

export interface ToCentsOptions {
  label?: string;
}

/**
 * Parses a user-entered dollar string into integer cents. Returns
 * { value, error } instead of throwing, so callers can collect every
 * field's error into one focusable summary rather than stopping at the
 * first bad field.
 */
export function toCents(raw: string | number | null | undefined, opts: ToCentsOptions = {}): ToCentsResult {
  if (raw === null || raw === undefined || raw === "") {
    return { value: 0, error: null };
  }
  const n = Number(raw);
  if (isNaN(n)) {
    return { value: 0, error: `${opts.label || "This field"} must be a number.` };
  }
  if (n < 0) {
    return { value: 0, error: `${opts.label || "This field"} can't be negative.` };
  }
  if (n > 10000000) {
    return { value: 0, error: `${opts.label || "This field"} looks too large — please check it.` };
  }
  return { value: Math.round(n * 100), error: null };
}

export function formatUSD(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatSignedUSD(cents: number): string {
  if (cents > 0) return `+${formatUSD(cents)}`;
  if (cents < 0) return `−${formatUSD(Math.abs(cents))}`;
  return formatUSD(0);
}

export interface ParsedWholeNumberResult {
  value: number;
  error: string | null;
}

export function toWholeNumber(raw: string | number | null | undefined, opts: { label?: string; max?: number } = {}): ParsedWholeNumberResult {
  if (raw === null || raw === undefined || raw === "") {
    return { value: 0, error: null };
  }
  const n = Number(raw);
  if (isNaN(n) || !Number.isFinite(n)) {
    return { value: 0, error: `${opts.label || "This field"} must be a number.` };
  }
  if (n < 0) {
    return { value: 0, error: `${opts.label || "This field"} can't be negative.` };
  }
  if (opts.max !== undefined && n > opts.max) {
    return { value: 0, error: `${opts.label || "This field"} looks too large — please check it.` };
  }
  return { value: Math.round(n), error: null };
}

export interface LossOfUseInput {
  dailyRateOfferedCents: number;
  daysWithoutVehicle: number;
  dailyCapCents?: number;
  totalCapCents?: number;
  actualRentalCostCents?: number;
}

export interface LossOfUseResult {
  reimbursementAtOfferedRateCents: number;
  reimbursementCappedByTotalCap: boolean;
  daysCoveredUnderTotalCap: number | null;
  daysRemainingUnderTotalCap: number | null;
  totalCapExceededFlag: string | null;
  dailyRateAboveDailyCapFlag: string | null;
  gapVsActualCents: number | null;
  actualDailyCostCents: number | null;
  lowRateFlag: string | null;
}

export function calculateLossOfUse(i: LossOfUseInput): LossOfUseResult {
  const dailyRate = i.dailyRateOfferedCents || 0;
  const days = i.daysWithoutVehicle || 0;
  const dailyCap = i.dailyCapCents || 0;
  const totalCap = i.totalCapCents || 0;

  const uncappedReimbursement = dailyRate * days;
  const reimbursementAtOfferedRateCents =
    totalCap > 0 ? Math.min(uncappedReimbursement, totalCap) : uncappedReimbursement;
  const reimbursementCappedByTotalCap = totalCap > 0 && uncappedReimbursement > totalCap;

  let daysCoveredUnderTotalCap: number | null = null;
  let daysRemainingUnderTotalCap: number | null = null;
  let totalCapExceededFlag: string | null = null;
  if (totalCap > 0 && dailyRate > 0) {
    daysCoveredUnderTotalCap = Math.floor(totalCap / dailyRate);
    daysRemainingUnderTotalCap = daysCoveredUnderTotalCap - days;
    if (daysRemainingUnderTotalCap < 0) {
      totalCapExceededFlag = `At ${formatUSD(dailyRate)}/day, your total policy cap of ${formatUSD(totalCap)} covers about ${daysCoveredUnderTotalCap} day(s) — ${Math.abs(daysRemainingUnderTotalCap)} more than you entered. Reimbursement beyond the cap is not automatic; verify with your insurer.`;
    }
  }

  let dailyRateAboveDailyCapFlag: string | null = null;
  if (dailyCap > 0 && dailyRate > dailyCap) {
    dailyRateAboveDailyCapFlag = `The offered daily rate (${formatUSD(dailyRate)}) is higher than the daily cap you entered (${formatUSD(dailyCap)}) — worth double-checking which figure is actually in your policy or offer letter.`;
  }

  let gapVsActualCents: number | null = null;
  let actualDailyCostCents: number | null = null;
  let lowRateFlag: string | null = null;
  if (i.actualRentalCostCents !== undefined && i.actualRentalCostCents !== null) {
    gapVsActualCents = i.actualRentalCostCents - reimbursementAtOfferedRateCents;
    if (days > 0) {
      actualDailyCostCents = Math.round(i.actualRentalCostCents / days);
      if (dailyRate > 0 && actualDailyCostCents > dailyRate * (1 + LOSS_OF_USE_CONFIG.lowRateThresholdPct)) {
        lowRateFlag = `What you actually paid works out to about ${formatUSD(actualDailyCostCents)}/day — more than ${Math.round(LOSS_OF_USE_CONFIG.lowRateThresholdPct * 100)}% above the ${formatUSD(dailyRate)}/day offered. This is a comparison, not a legal conclusion about what a "reasonable" rate should have been.`;
      }
    }
  }

  return {
    reimbursementAtOfferedRateCents,
    reimbursementCappedByTotalCap,
    daysCoveredUnderTotalCap,
    daysRemainingUnderTotalCap,
    totalCapExceededFlag,
    dailyRateAboveDailyCapFlag,
    gapVsActualCents,
    actualDailyCostCents,
    lowRateFlag,
  };
}
