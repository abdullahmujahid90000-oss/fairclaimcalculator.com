import { describe, it, expect } from "vitest";
import {
  toCents,
  toRateDecimal,
  formatUSD,
  calculateSalesTaxTitleFee,
} from "../src/lib/calculators/sales-tax-title-fee";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("19000")).toEqual({ value: 1900000, error: null });
  });
  it("empty: blank resolves to 0", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
  });
  it("invalid: non-numeric errors", () => {
    expect(toCents("abc", { label: "Replacement vehicle price" }).error).toMatch(/must be a number/);
  });
});

describe("toRateDecimal", () => {
  it("normal: converts a percentage string to a decimal", () => {
    expect(toRateDecimal("7")).toEqual({ value: 0.07, error: null });
    expect(toRateDecimal("7.25")).toEqual({ value: 0.0725, error: null });
  });
  it("empty: blank resolves to 0", () => {
    expect(toRateDecimal("")).toEqual({ value: 0, error: null });
  });
  it("invalid: non-numeric errors", () => {
    expect(toRateDecimal("abc", { label: "Tax rate" }).error).toMatch(/must be a number/);
  });
  it("invalid: negative rejected", () => {
    expect(toRateDecimal("-1", { label: "Tax rate" }).error).toMatch(/can't be negative/);
  });
  it("edge: implausibly high rate (>20%) is rejected rather than silently computed", () => {
    expect(toRateDecimal("25", { label: "Tax rate" }).error).toMatch(/too high/);
  });
  it("edge: exactly 20% is accepted (boundary)", () => {
    expect(toRateDecimal("20")).toEqual({ value: 0.2, error: null });
  });
});

describe("formatUSD", () => {
  it("formats correctly", () => {
    expect(formatUSD(133000)).toBe("$1,330.00");
  });
});

describe("calculateSalesTaxTitleFee", () => {
  it("normal: matches the companion guide's worked example exactly ($19,000 @ 7% = $1,330 tax)", () => {
    const result = calculateSalesTaxTitleFee({
      replacementVehiclePriceCents: 1900000,
      taxRateDecimal: 0.07,
      titleAndRegistrationFeeCents: 0,
    });
    expect(result.salesTaxCents).toBe(133000);
    expect(result.totalTaxAndFeesCents).toBe(133000);
  });

  it("normal: adds title/registration fees on top of tax", () => {
    const result = calculateSalesTaxTitleFee({
      replacementVehiclePriceCents: 1900000,
      taxRateDecimal: 0.07,
      titleAndRegistrationFeeCents: 15000,
    });
    expect(result.salesTaxCents).toBe(133000);
    expect(result.totalTaxAndFeesCents).toBe(148000);
  });

  it("edge: zero rate produces zero tax but keeps fees", () => {
    const result = calculateSalesTaxTitleFee({
      replacementVehiclePriceCents: 2000000,
      taxRateDecimal: 0,
      titleAndRegistrationFeeCents: 8500,
    });
    expect(result.salesTaxCents).toBe(0);
    expect(result.totalTaxAndFeesCents).toBe(8500);
  });

  it("edge: rounds fractional-cent tax to the nearest cent", () => {
    const result = calculateSalesTaxTitleFee({
      replacementVehiclePriceCents: 999,
      taxRateDecimal: 0.0725,
      titleAndRegistrationFeeCents: 0,
    });
    // 999 * 0.0725 = 72.4275 -> rounds to 72
    expect(result.salesTaxCents).toBe(72);
  });
});
