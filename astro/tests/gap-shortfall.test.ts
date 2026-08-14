import { describe, it, expect } from "vitest";
import {
  toCents,
  formatUSD,
  calculateGapShortfall,
  GAP_SHORTFALL_CONFIG,
} from "../src/lib/calculators/gap-shortfall";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("22000")).toEqual({ value: 2200000, error: null });
  });
  it("empty: blank resolves to 0", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
  });
  it("invalid: non-numeric string errors", () => {
    expect(toCents("abc", { label: "Loan payoff" }).error).toMatch(/must be a number/);
  });
  it("negative: rejected", () => {
    expect(toCents("-1", { label: "Settlement amount" }).error).toMatch(/can't be negative/);
  });
});

describe("formatUSD", () => {
  it("formats correctly", () => {
    expect(formatUSD(2200000)).toBe("$22,000.00");
  });
});

describe("calculateGapShortfall", () => {
  it("normal: payoff exceeds settlement — a real gap exists", () => {
    const result = calculateGapShortfall({ loanOrLeasePayoffCents: 2200000, settlementAmountCents: 1800000 });
    expect(result.shortfallCents).toBe(400000);
    expect(result.hasGap).toBe(true);
  });

  it("edge: settlement exceeds payoff — negative shortfall, no gap", () => {
    const result = calculateGapShortfall({ loanOrLeasePayoffCents: 1500000, settlementAmountCents: 1800000 });
    expect(result.shortfallCents).toBe(-300000);
    expect(result.hasGap).toBe(false);
  });

  it("edge: payoff exactly equals settlement — zero shortfall, no gap", () => {
    const result = calculateGapShortfall({ loanOrLeasePayoffCents: 1800000, settlementAmountCents: 1800000 });
    expect(result.shortfallCents).toBe(0);
    expect(result.hasGap).toBe(false);
  });

  it("edge: zero payoff (paid off already) with a positive settlement — no gap", () => {
    const result = calculateGapShortfall({ loanOrLeasePayoffCents: 0, settlementAmountCents: 1800000 });
    expect(result.shortfallCents).toBe(-1800000);
    expect(result.hasGap).toBe(false);
  });
});

describe("GAP_SHORTFALL_CONFIG.commonExclusions", () => {
  it("matches the 5 items published in the companion guide", () => {
    expect(GAP_SHORTFALL_CONFIG.commonExclusions.length).toBe(5);
  });
});
