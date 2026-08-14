/**
 * FairClaimCalculator.com v2 — Sales Tax & Title Fee Estimator.
 *
 * Deliberately does NOT hard-code a 50-state sales tax rate table. The
 * companion guide
 * (/guides/total-loss/sales-tax-title-fees-on-a-total-loss/) explains why
 * the Settlement Check Breakdown calculator never assumes a state's tax
 * rate: rates vary by state AND often by county/city within a state, and
 * they change over time — a hard-coded table would go stale and could be
 * confidently wrong for a specific buyer. Instead, this tool asks for the
 * rate you already know or have looked up (e.g. from your own purchase
 * paperwork or your state's Department of Revenue), and only does the
 * arithmetic from there. This mirrors the existing site's design
 * philosophy rather than introducing a new fabrication risk.
 *
 * All money math uses integer CENTS internally; USD formatting happens
 * only at display time. Zero dependency on `document` — pure and testable.
 */

export const SALES_TAX_TITLE_FEE_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-08-14",
  reviewedDate: "2026-08-14",
  sources: [
    'Texas Comptroller, <a href="https://comptroller.texas.gov/taxes/publications/96-254/insurance-settlement-transfers.php" target="_blank" rel="noopener">Motor Vehicle Tax Guide — Insurance Settlement Transfers</a> — same primary state-government source cited in the companion guide, as one real example of how a state handles this.',
    "This tool intentionally does not include a built-in state tax-rate table — see the companion guide for why. Enter your own known or looked-up rate.",
  ],
} as const;

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

export interface RatePercentResult {
  value: number;
  error: string | null;
}

/** Parses a percentage like "7.25" into a decimal (0.0725). Rejects
 * obviously implausible rates (negative, or above 20%) rather than
 * silently computing a nonsense result. */
export function toRateDecimal(raw: string | number | null | undefined, opts: { label?: string } = {}): RatePercentResult {
  if (raw === null || raw === undefined || raw === "") return { value: 0, error: null };
  const n = Number(raw);
  if (isNaN(n)) return { value: 0, error: `${opts.label || "This field"} must be a number.` };
  if (n < 0) return { value: 0, error: `${opts.label || "This field"} can't be negative.` };
  if (n > 20) return { value: 0, error: `${opts.label || "This field"} looks too high for a sales tax rate — please check it (enter as a percentage, e.g. 7.25).` };
  return { value: n / 100, error: null };
}

export interface SalesTaxTitleFeeInput {
  replacementVehiclePriceCents: number;
  taxRateDecimal: number;
  titleAndRegistrationFeeCents: number;
}

export interface SalesTaxTitleFeeResult {
  replacementVehiclePriceCents: number;
  taxRateDecimal: number;
  salesTaxCents: number;
  titleAndRegistrationFeeCents: number;
  totalTaxAndFeesCents: number;
}

export function calculateSalesTaxTitleFee(input: SalesTaxTitleFeeInput): SalesTaxTitleFeeResult {
  const salesTaxCents = Math.round(input.replacementVehiclePriceCents * input.taxRateDecimal);
  const totalTaxAndFeesCents = salesTaxCents + input.titleAndRegistrationFeeCents;
  return {
    replacementVehiclePriceCents: input.replacementVehiclePriceCents,
    taxRateDecimal: input.taxRateDecimal,
    salesTaxCents,
    titleAndRegistrationFeeCents: input.titleAndRegistrationFeeCents,
    totalTaxAndFeesCents,
  };
}
