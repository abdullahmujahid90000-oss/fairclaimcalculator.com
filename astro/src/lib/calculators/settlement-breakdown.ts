/**
 * FairClaimCalculator.com v2 — Settlement Check Breakdown calculation module.
 *
 * Ported 1:1 from the verified `js/settlement-breakdown.js` engine (plain-HTML
 * site) — the arithmetic below is UNCHANGED from that version; only the
 * language is now TypeScript, the config is now a versioned object per
 * ASTRO-REBUILD-PLAN.md §5, and DOM rendering has moved out of this module
 * (this file has zero dependency on `document` — it is pure and testable in
 * any JS/TS environment, browser or Node).
 *
 * Answers one question: "How did the insurer get from my vehicle's value to
 * the number on my check?" This is an organizing/arithmetic tool, not a
 * legal determination of what is owed. All money math uses integer CENTS
 * internally; USD formatting happens only at display time.
 *
 * Waterfall model (documented assumptions, shown to the user, never hidden):
 *   1. Start: insurer's stated ACV / base vehicle value.
 *   2. + Sales tax / fees the insurer says it is adding on top (optional;
 *      whether a state requires this varies and is never assumed here).
 *   3. - Deductible (first-party claims only).
 *   4. = Gross settlement.
 *   5. Of the gross settlement, the lienholder is paid first, up to the
 *      loan/lease payoff amount. Any shortfall (payoff > gross settlement)
 *      is shown separately as a potential GAP *scenario*, never folded into
 *      the totals — GAP is typically a separate claim to a separate
 *      provider with its own terms and exclusions, never a guaranteed
 *      benefit.
 *   6. - Salvage deduction, only if the owner is retaining the vehicle.
 *   7. - Any prior partial payment already received.
 *   8. = Net to owner / Net to lienholder.
 */

export const SETTLEMENT_BREAKDOWN_CONFIG = {
  version: "1.0",
  effectiveDate: "2026-07-19",
  reviewedDate: "2026-07-19",
  sources: [
    "Model reflects a standard first-party/third-party total-loss settlement waterfall as commonly described in state insurance-department consumer guides on total-loss claims; it is a general organizing structure, not a citation to any single statute.",
  ],
} as const;

/** $1.00 — avoid flagging trivial rounding as a "mismatch." */
export const CENTS_TOLERANCE = 100;

export type ClaimType = "first-party" | "third-party";

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

export interface BreakdownRow {
  key: string;
  label: string;
  amountCents: number;
  kind: "add" | "subtract" | "subtotal";
}

export interface GapNote {
  amountCents: number;
  text: string;
}

export type ComparisonStatus = "match" | "mismatch";

export interface Comparison {
  status: ComparisonStatus;
  diffCents: number;
  text: string;
}

export interface SettlementBreakdownInput {
  acvCents: number;
  taxFeesCents?: number;
  claimType: ClaimType;
  deductibleCents?: number;
  hasLoan: boolean;
  loanPayoffCents?: number;
  hasGap?: boolean;
  retainingSalvage: boolean;
  salvageDeductionCents?: number;
  priorPaymentCents?: number;
  statedCheckCents?: number | null;
}

export interface SettlementBreakdownResult {
  rows: BreakdownRow[];
  grossSettlementCents: number;
  grossSettlementFlag: string | null;
  netToOwnerCents: number;
  netToLienholderCents: number;
  hasLoan: boolean;
  gapNote: GapNote | null;
  comparison: Comparison | null;
}

export function calculateSettlementBreakdown(i: SettlementBreakdownInput): SettlementBreakdownResult {
  const acv = i.acvCents || 0;
  const taxFees = i.taxFeesCents || 0;
  const deductible = i.claimType === "first-party" ? (i.deductibleCents || 0) : 0;
  const loanPayoff = i.hasLoan ? (i.loanPayoffCents || 0) : 0;
  const salvageDeduction = i.retainingSalvage ? (i.salvageDeductionCents || 0) : 0;
  const priorPayment = i.priorPaymentCents || 0;

  const rows: BreakdownRow[] = [];

  rows.push({ key: "acv", label: "Insurer's stated ACV / base vehicle value", amountCents: acv, kind: "add" });

  if (taxFees > 0) {
    rows.push({ key: "taxFees", label: "Sales tax / fees insurer added on top", amountCents: taxFees, kind: "add" });
  }

  if (deductible > 0) {
    rows.push({ key: "deductible", label: "Your deductible (first-party claim)", amountCents: -deductible, kind: "subtract" });
  }

  let grossSettlement = acv + taxFees - deductible;
  let grossSettlementFlag: string | null = null;
  if (grossSettlement < 0) {
    grossSettlementFlag = "Your deductible is larger than the stated ACV plus fees — that shouldn't happen. Ask the insurer to explain.";
    grossSettlement = 0;
  }

  rows.push({ key: "grossSettlement", label: "Gross settlement (before loan payoff)", amountCents: grossSettlement, kind: "subtotal" });

  let toLienholder = 0;
  let shortfall = 0;
  if (i.hasLoan) {
    toLienholder = Math.min(grossSettlement, loanPayoff);
    shortfall = Math.max(0, loanPayoff - grossSettlement);
    rows.push({ key: "toLienholder", label: "Paid to lienholder toward loan/lease payoff", amountCents: -toLienholder, kind: "subtract" });
  }

  if (salvageDeduction > 0) {
    rows.push({ key: "salvage", label: "Salvage deduction (you're keeping the vehicle)", amountCents: -salvageDeduction, kind: "subtract" });
  }

  if (priorPayment > 0) {
    rows.push({ key: "priorPayment", label: "Prior partial payment already received", amountCents: -priorPayment, kind: "subtract" });
  }

  const netToOwner = grossSettlement - toLienholder - salvageDeduction - priorPayment;
  const netToLienholder = toLienholder;

  let gapNote: GapNote | null = null;
  if (i.hasLoan && i.hasGap) {
    if (shortfall > 0) {
      gapNote = {
        amountCents: shortfall,
        text: `Potential GAP scenario amount: ${formatUSD(shortfall)}. This is NOT included in the totals above — GAP is typically a separate claim to a separate provider, with its own exclusions (fees, prior negative equity, and insurance-required coverage gaps can all reduce what GAP actually pays). Verify this against your GAP certificate or provider.`,
      };
    } else {
      gapNote = {
        amountCents: 0,
        text: "Based on the numbers entered, the loan payoff doesn't exceed the gross settlement, so there's no shortfall for GAP to cover under this simple math — but GAP terms vary, so confirm with your provider if you expected a payout.",
      };
    }
  }

  let comparison: Comparison | null = null;
  if (i.statedCheckCents !== null && i.statedCheckCents !== undefined) {
    const diff = i.statedCheckCents - netToOwner;
    if (Math.abs(diff) <= CENTS_TOLERANCE) {
      comparison = { status: "match", diffCents: diff, text: "Math checks out — the insurer's stated check is within a rounding difference of this breakdown." };
    } else {
      comparison = {
        status: "mismatch",
        diffCents: diff,
        text: `Possible arithmetic mismatch of ${formatUSD(Math.abs(diff))} (insurer's stated check is ${diff > 0 ? "higher" : "lower"} than this breakdown). Ask your adjuster to walk through the difference line by line before you accept the check.`,
      };
    }
  }

  return {
    rows,
    grossSettlementCents: grossSettlement,
    grossSettlementFlag,
    netToOwnerCents: netToOwner,
    netToLienholderCents: netToLienholder,
    hasLoan: !!i.hasLoan,
    gapNote,
    comparison,
  };
}
