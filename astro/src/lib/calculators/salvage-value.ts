/**
 * FairClaimCalculator.com v2 — Salvage / Owner-Retained Vehicle Value calculator.
 *
 * The Settlement Check Breakdown calculator touches owner-retained salvage
 * as one line item in a larger waterfall. This tool goes deeper for someone
 * specifically deciding whether to keep a totaled vehicle: it isolates the
 * salvage deduction, shows the net-cash difference between keeping and
 * surrendering the vehicle, and — never averaged, always shown separately —
 * compares the insurer's proposed deduction against real salvage-title sale
 * prices the user has found. See
 * /guides/total-loss/owner-retained-total-loss-and-salvage-titles/ for what
 * "owner retention" means and why salvage/rebuilt title branding rules are
 * state-specific and not calculated here.
 *
 * All money math uses integer CENTS internally; USD formatting happens only
 * at display time. Zero dependency on `document` — pure and testable.
 */

export const SALVAGE_VALUE_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-08-08",
  reviewedDate: "2026-08-08",
  sources: [
    'Wikipedia, "Salvage title" — general overview of owner-retained salvage and branded titles; branding criteria differ by state and should be confirmed with your state DMV.',
    "New York State Department of Financial Services, OGC Opinion No. 00-02-07: Salvage Vehicle Branding — a real regulator opinion letter on salvage-title branding.",
  ],
  /** Matches the 20% possible-outlier heuristic already used in the
   * Total-Loss Offer Audit calculator, for internal consistency across
   * this site's tools. A disclosed review heuristic, not a legal standard. */
  outlierThresholdPct: 0.2,
  minimumGroupSize: 2,
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

export type SampleConfidence = "limited" | "typical";

export interface MarketStats {
  count: number;
  meanCents: number;
  medianCents: number;
  minCents: number;
  maxCents: number;
  confidence: SampleConfidence;
  canCompareGroup: boolean;
}

function computeStats(pricesCents: number[]): MarketStats | null {
  if (pricesCents.length === 0) return null;
  const sorted = [...pricesCents].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((total, value) => total + value, 0);
  const mid = Math.floor(count / 2);
  const median = count % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
  return {
    count,
    meanCents: Math.round(sum / count),
    medianCents: median,
    minCents: sorted[0],
    maxCents: sorted[count - 1],
    confidence: count >= 3 ? "typical" : "limited",
    canCompareGroup: count >= SALVAGE_VALUE_CONFIG.minimumGroupSize,
  };
}

export interface SalvageValueInput {
  acvCents: number;
  salvageDeductionCents: number;
  comparableSalvagePricesCents: number[];
  state?: string;
}

export interface SalvageValueResult {
  netIfRetainedCents: number;
  netIfSurrenderedCents: number;
  costOfKeepingCents: number;
  marketStats: MarketStats | null;
  gapVsMarketCents: number | null;
  outlierFlag: string | null;
  state: string;
}

export function calculateSalvageValue(i: SalvageValueInput): SalvageValueResult {
  const acv = i.acvCents || 0;
  const salvageDeduction = i.salvageDeductionCents || 0;

  const netIfSurrenderedCents = acv;
  const netIfRetainedCents = acv - salvageDeduction;
  const costOfKeepingCents = netIfSurrenderedCents - netIfRetainedCents;

  const marketStats = computeStats(i.comparableSalvagePricesCents || []);

  let gapVsMarketCents: number | null = null;
  let outlierFlag: string | null = null;
  if (marketStats && marketStats.canCompareGroup) {
    gapVsMarketCents = salvageDeduction - marketStats.medianCents;
    if (marketStats.medianCents > 0) {
      const deviation = Math.abs(gapVsMarketCents) / marketStats.medianCents;
      if (deviation > SALVAGE_VALUE_CONFIG.outlierThresholdPct) {
        const direction = gapVsMarketCents > 0 ? "higher than" : "lower than";
        outlierFlag = `The insurer's salvage deduction (${formatUSD(salvageDeduction)}) is more than ${Math.round(SALVAGE_VALUE_CONFIG.outlierThresholdPct * 100)}% ${direction} the median of your comparable salvage sale prices (${formatUSD(marketStats.medianCents)}). This is a disclosed comparison heuristic, not a professional appraisal or a legal conclusion about the correct deduction.`;
      }
    }
  }

  return {
    netIfRetainedCents,
    netIfSurrenderedCents,
    costOfKeepingCents,
    marketStats,
    gapVsMarketCents,
    outlierFlag,
    state: i.state || "",
  };
}
