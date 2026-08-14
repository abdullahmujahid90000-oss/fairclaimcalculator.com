/**
 * FairClaimCalculator.com v2 — Loan/Lease Payoff vs. ACV Gap calculator.
 *
 * This is deliberately NOT a rebuild of the Settlement Check Breakdown
 * calculator. That tool shows how an insurer's ACV becomes a check amount
 * (ACV minus deductible, minus liens, etc.). This tool starts one step
 * later: it takes whatever settlement number you actually have (from that
 * check breakdown, or from your insurer's offer directly) and compares it
 * to what you still owe your lender, so you know whether a gap exists at
 * all *before* you go check your GAP certificate.
 *
 * As the companion guide
 * (/guides/total-loss/gap-insurance-loan-lease-after-total-loss/)
 * explains, whether GAP actually pays out — and how much — depends on your
 * specific certificate's terms and exclusions, which this site cannot
 * know. So this tool never claims to calculate a GAP payout; it only
 * computes the raw shortfall, then surfaces the same common-exclusions
 * checklist already published in that guide, for you to check against
 * your own paperwork.
 *
 * All money math uses integer CENTS internally; USD formatting happens
 * only at display time. Zero dependency on `document` — pure and testable.
 */

export const GAP_SHORTFALL_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-08-14",
  reviewedDate: "2026-08-14",
  sources: [
    'Consumer Financial Protection Bureau (CFPB), <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-guaranteed-asset-protection-gap-insurance-en-797/" target="_blank" rel="noopener">"What is Guaranteed Asset Protection (GAP) insurance?"</a>, last reviewed March 8, 2024 — same primary federal source cited in the companion guide.',
  ],
  /** Same common-exclusions list published in the companion guide — kept
   * here as data so the calculator's checklist and the guide's prose never
   * drift out of sync. Not a claim about any specific policy's terms. */
  commonExclusions: [
    "Past-due payments or late fees on your loan before the loss.",
    "Extended warranties, credit insurance, or other add-on products rolled into the same loan.",
    "Your auto insurance deductible — some GAP products cover it, many don't.",
    "Negative equity already rolled over from a previous loan or trade-in, in some policies.",
    "Any amount above the policy's own coverage cap or loan-to-value limit, if it has one.",
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

export interface GapShortfallInput {
  loanOrLeasePayoffCents: number;
  settlementAmountCents: number;
}

export interface GapShortfallResult {
  loanOrLeasePayoffCents: number;
  settlementAmountCents: number;
  /** Positive = you'd still owe money (a gap exists). Zero or negative = no gap. */
  shortfallCents: number;
  hasGap: boolean;
}

export function calculateGapShortfall(input: GapShortfallInput): GapShortfallResult {
  const shortfallCents = input.loanOrLeasePayoffCents - input.settlementAmountCents;
  return {
    loanOrLeasePayoffCents: input.loanOrLeasePayoffCents,
    settlementAmountCents: input.settlementAmountCents,
    shortfallCents,
    hasGap: shortfallCents > 0,
  };
}
