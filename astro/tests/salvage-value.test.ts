import { describe, it, expect } from "vitest";
import {
  toCents,
  formatUSD,
  formatSignedUSD,
  calculateSalvageValue,
} from "../src/lib/calculators/salvage-value";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("16000")).toEqual({ value: 1600000, error: null });
  });

  it("empty: blank/null/undefined all resolve to 0 with no error", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
    expect(toCents(null)).toEqual({ value: 0, error: null });
    expect(toCents(undefined)).toEqual({ value: 0, error: null });
  });

  it("invalid: non-numeric string produces a labeled error", () => {
    const res = toCents("abc", { label: "Insurer's stated ACV" });
    expect(res.error).toMatch(/must be a number/);
  });

  it("negative: rejected with a labeled error", () => {
    const res = toCents("-100", { label: "Salvage deduction" });
    expect(res.error).toMatch(/can't be negative/);
  });

  it("extreme: values above the $10,000,000 ceiling are rejected", () => {
    const res = toCents("99999999");
    expect(res.error).toMatch(/too large/);
  });
});

describe("formatUSD / formatSignedUSD", () => {
  it("formats correctly", () => {
    expect(formatUSD(320000)).toBe("$3,200.00");
    expect(formatSignedUSD(50000)).toBe("+$500.00");
    expect(formatSignedUSD(-50000)).toBe("−$500.00");
    expect(formatSignedUSD(0)).toBe("$0.00");
  });
});

describe("calculateSalvageValue", () => {
  it("normal: matches the guide's worked example (ACV $16,000, salvage deduction $3,200)", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 320000,
      comparableSalvagePricesCents: [],
    });
    expect(result.netIfRetainedCents).toBe(1280000);
    expect(result.netIfSurrenderedCents).toBe(1600000);
    expect(result.costOfKeepingCents).toBe(320000);
    expect(result.marketStats).toBeNull();
    expect(result.gapVsMarketCents).toBeNull();
    expect(result.outlierFlag).toBeNull();
  });

  it("boundary: zero salvage deduction means retaining costs nothing extra", () => {
    const result = calculateSalvageValue({
      acvCents: 1000000,
      salvageDeductionCents: 0,
      comparableSalvagePricesCents: [],
    });
    expect(result.netIfRetainedCents).toBe(1000000);
    expect(result.costOfKeepingCents).toBe(0);
  });

  it("one comp: not enough for a group comparison, no market stats returned as comparable", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 320000,
      comparableSalvagePricesCents: [300000],
    });
    expect(result.marketStats).not.toBeNull();
    expect(result.marketStats!.canCompareGroup).toBe(false);
    expect(result.gapVsMarketCents).toBeNull();
  });

  it("two or more comps: computes mean, median, range", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 320000,
      comparableSalvagePricesCents: [280000, 300000, 320000],
    });
    expect(result.marketStats!.canCompareGroup).toBe(true);
    expect(result.marketStats!.count).toBe(3);
    expect(result.marketStats!.medianCents).toBe(300000);
    expect(result.marketStats!.meanCents).toBe(300000);
    expect(result.marketStats!.minCents).toBe(280000);
    expect(result.marketStats!.maxCents).toBe(320000);
    expect(result.marketStats!.confidence).toBe("typical");
  });

  it("gap vs market: insurer deduction matches market median closely, no outlier flag", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 300000,
      comparableSalvagePricesCents: [290000, 300000, 310000],
    });
    expect(result.gapVsMarketCents).toBe(0);
    expect(result.outlierFlag).toBeNull();
  });

  it("outlier flag: insurer deduction more than 20% above market median", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 500000,
      comparableSalvagePricesCents: [280000, 300000, 320000],
    });
    // Median 300000; 500000 is 66.7% above.
    expect(result.gapVsMarketCents).toBe(200000);
    expect(result.outlierFlag).toMatch(/higher than/);
  });

  it("outlier flag: insurer deduction more than 20% below market median", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 100000,
      comparableSalvagePricesCents: [280000, 300000, 320000],
    });
    expect(result.gapVsMarketCents).toBe(-200000);
    expect(result.outlierFlag).toMatch(/lower than/);
  });

  it("boundary: exactly at the 20% threshold produces no flag", () => {
    const result = calculateSalvageValue({
      acvCents: 1600000,
      salvageDeductionCents: 360000, // 20% above 300000 median
      comparableSalvagePricesCents: [280000, 300000, 320000],
    });
    expect(result.outlierFlag).toBeNull();
  });

  it("state field is echoed back unchanged and never used in the math", () => {
    const withState = calculateSalvageValue({
      acvCents: 1000000,
      salvageDeductionCents: 100000,
      comparableSalvagePricesCents: [],
      state: "Georgia",
    });
    const withoutState = calculateSalvageValue({
      acvCents: 1000000,
      salvageDeductionCents: 100000,
      comparableSalvagePricesCents: [],
    });
    expect(withState.state).toBe("Georgia");
    expect(withoutState.state).toBe("");
    expect(withState.netIfRetainedCents).toBe(withoutState.netIfRetainedCents);
  });

  it("extreme: very high ACV and deduction still compute correctly", () => {
    const result = calculateSalvageValue({
      acvCents: 100000000,
      salvageDeductionCents: 20000000,
      comparableSalvagePricesCents: [],
    });
    expect(result.netIfRetainedCents).toBe(80000000);
  });
});
