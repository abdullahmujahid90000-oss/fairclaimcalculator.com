import { describe, it, expect } from "vitest";
import {
  toCents,
  formatUSD,
  formatSignedUSD,
  calculateSettlementBreakdown,
  CENTS_TOLERANCE,
} from "../src/lib/calculators/settlement-breakdown";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("18500")).toEqual({ value: 1850000, error: null });
  });

  it("boundary: parses zero", () => {
    expect(toCents("0")).toEqual({ value: 0, error: null });
  });

  it("empty: blank/null/undefined all resolve to 0 with no error (optional fields)", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
    expect(toCents(null)).toEqual({ value: 0, error: null });
    expect(toCents(undefined)).toEqual({ value: 0, error: null });
  });

  it("invalid: non-numeric string produces a labeled error", () => {
    const res = toCents("abc", { label: "Deductible" });
    expect(res.value).toBe(0);
    expect(res.error).toMatch(/Deductible must be a number/);
  });

  it("negative: rejected with a labeled error", () => {
    const res = toCents("-500", { label: "Loan payoff" });
    expect(res.value).toBe(0);
    expect(res.error).toMatch(/can't be negative/);
  });

  it("extreme: values above the $10,000,000 ceiling are rejected", () => {
    const res = toCents("99999999", { label: "ACV" });
    expect(res.value).toBe(0);
    expect(res.error).toMatch(/too large/);
  });

  it("boundary: exactly at the $10,000,000 ceiling is accepted", () => {
    const res = toCents("10000000");
    expect(res.error).toBeNull();
    expect(res.value).toBe(1000000000);
  });
});

describe("formatUSD / formatSignedUSD", () => {
  it("formats whole and fractional cents correctly", () => {
    expect(formatUSD(75000)).toBe("$750.00");
    expect(formatUSD(0)).toBe("$0.00");
    expect(formatUSD(150)).toBe("$1.50");
  });

  it("formatSignedUSD adds explicit sign for positive/negative/zero", () => {
    expect(formatSignedUSD(50000)).toBe("+$500.00");
    expect(formatSignedUSD(-50000)).toBe("−$500.00");
    expect(formatSignedUSD(0)).toBe("$0.00");
  });
});

describe("calculateSettlementBreakdown", () => {
  it("normal: no loan, first-party with deductible", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1420000, // $14,200
      claimType: "first-party",
      deductibleCents: 50000, // $500
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.grossSettlementCents).toBe(1370000); // $13,700
    expect(r.netToOwnerCents).toBe(1370000);
    expect(r.netToLienholderCents).toBe(0);
    expect(r.grossSettlementFlag).toBeNull();
  });

  it("normal: third-party claims never apply the user's deductible", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "third-party",
      deductibleCents: 50000, // present but must be ignored
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.grossSettlementCents).toBe(1000000);
    expect(r.rows.find((row) => row.key === "deductible")).toBeUndefined();
  });

  it("normal: loan payoff less than gross settlement — no GAP shortfall", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1420000,
      claimType: "first-party",
      deductibleCents: 50000,
      hasLoan: true,
      loanPayoffCents: 900000, // $9,000
      retainingSalvage: false,
    });
    expect(r.netToLienholderCents).toBe(900000);
    expect(r.netToOwnerCents).toBe(1370000 - 900000); // $4,700
  });

  it("boundary/GAP: loan payoff exceeds gross settlement — shortfall flagged, not blended into totals", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 500000, // $5,000
      claimType: "first-party",
      deductibleCents: 0,
      hasLoan: true,
      loanPayoffCents: 800000, // $8,000 — exceeds gross
      hasGap: true,
      retainingSalvage: false,
    });
    expect(r.netToLienholderCents).toBe(500000); // capped at gross settlement
    expect(r.netToOwnerCents).toBe(0);
    expect(r.gapNote).not.toBeNull();
    expect(r.gapNote!.amountCents).toBe(300000); // $3,000 shortfall
    expect(r.gapNote!.text).toMatch(/NOT included in the totals/);
  });

  it("hasGap true but no shortfall still returns an informative (non-alarming) gapNote", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: true,
      loanPayoffCents: 400000,
      hasGap: true,
      retainingSalvage: false,
    });
    expect(r.gapNote).not.toBeNull();
    expect(r.gapNote!.amountCents).toBe(0);
  });

  it("no loan at all: gapNote is null even if hasGap were somehow true", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      hasGap: true,
      retainingSalvage: false,
    });
    expect(r.gapNote).toBeNull();
    expect(r.netToLienholderCents).toBe(0);
  });

  it("salvage retention deducts from owner's net, not the lienholder's payoff", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: true,
      loanPayoffCents: 300000,
      retainingSalvage: true,
      salvageDeductionCents: 150000,
    });
    expect(r.netToLienholderCents).toBe(300000);
    expect(r.netToOwnerCents).toBe(1000000 - 300000 - 150000);
  });

  it("prior partial payment reduces net to owner", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
      priorPaymentCents: 200000,
    });
    expect(r.netToOwnerCents).toBe(800000);
  });

  it("invalid/edge: deductible exceeding ACV+fees is floored at zero and flagged, never negative", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 100000,
      claimType: "first-party",
      deductibleCents: 500000, // larger than ACV
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.grossSettlementCents).toBe(0);
    expect(r.grossSettlementFlag).toMatch(/deductible is larger/);
    expect(r.netToOwnerCents).toBe(0);
  });

  it("empty/zero: all-zero input produces a well-formed, non-crashing zero result", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 0,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.netToOwnerCents).toBe(0);
    expect(r.rows.length).toBe(2); // acv row + gross-settlement subtotal only
  });

  it("extreme: very large ACV still computes correctly (no overflow/precision loss at this scale)", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 999999900, // $9,999,999.00 — just under the input ceiling
      claimType: "third-party",
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.netToOwnerCents).toBe(999999900);
  });

  it("stated-check comparison: match within tolerance", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
      statedCheckCents: 1000000 + CENTS_TOLERANCE, // exactly at tolerance boundary
    });
    expect(r.comparison?.status).toBe("match");
  });

  it("stated-check comparison: mismatch just beyond tolerance, in both directions", () => {
    const higher = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
      statedCheckCents: 1000000 + CENTS_TOLERANCE + 1,
    });
    expect(higher.comparison?.status).toBe("mismatch");
    expect(higher.comparison?.text).toMatch(/higher/);

    const lower = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
      statedCheckCents: 1000000 - CENTS_TOLERANCE - 1,
    });
    expect(lower.comparison?.status).toBe("mismatch");
    expect(lower.comparison?.text).toMatch(/lower/);
  });

  it("no stated check supplied: comparison is null, not a false match", () => {
    const r = calculateSettlementBreakdown({
      acvCents: 1000000,
      claimType: "first-party",
      hasLoan: false,
      retainingSalvage: false,
    });
    expect(r.comparison).toBeNull();
  });
});
