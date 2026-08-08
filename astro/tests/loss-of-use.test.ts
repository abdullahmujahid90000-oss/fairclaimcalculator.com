import { describe, it, expect } from "vitest";
import {
  toCents,
  toWholeNumber,
  formatUSD,
  formatSignedUSD,
  calculateLossOfUse,
} from "../src/lib/calculators/loss-of-use";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("45")).toEqual({ value: 4500, error: null });
  });

  it("empty: blank/null/undefined all resolve to 0 with no error", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
    expect(toCents(null)).toEqual({ value: 0, error: null });
    expect(toCents(undefined)).toEqual({ value: 0, error: null });
  });

  it("invalid: non-numeric string produces a labeled error", () => {
    const res = toCents("abc", { label: "Daily rate offered" });
    expect(res.value).toBe(0);
    expect(res.error).toMatch(/Daily rate offered must be a number/);
  });

  it("negative: rejected with a labeled error", () => {
    const res = toCents("-45", { label: "Daily rate offered" });
    expect(res.error).toMatch(/can't be negative/);
  });

  it("extreme: values above the $10,000,000 ceiling are rejected", () => {
    const res = toCents("99999999");
    expect(res.error).toMatch(/too large/);
  });
});

describe("toWholeNumber", () => {
  it("normal: parses a whole day count", () => {
    expect(toWholeNumber("14")).toEqual({ value: 14, error: null });
  });

  it("boundary: parses zero", () => {
    expect(toWholeNumber("0")).toEqual({ value: 0, error: null });
  });

  it("empty: resolves to 0 with no error", () => {
    expect(toWholeNumber("")).toEqual({ value: 0, error: null });
  });

  it("negative: rejected with a labeled error", () => {
    const res = toWholeNumber("-3", { label: "Days without vehicle" });
    expect(res.error).toMatch(/can't be negative/);
  });

  it("invalid: non-numeric string produces a labeled error", () => {
    const res = toWholeNumber("abc", { label: "Days without vehicle" });
    expect(res.error).toMatch(/must be a number/);
  });

  it("extreme: rejects values above a supplied max", () => {
    const res = toWholeNumber("9999", { label: "Days without vehicle", max: 365 });
    expect(res.error).toMatch(/too large/);
  });

  it("rounds fractional input", () => {
    expect(toWholeNumber("14.6").value).toBe(15);
  });
});

describe("formatUSD / formatSignedUSD", () => {
  it("formats whole and fractional cents correctly", () => {
    expect(formatUSD(4500)).toBe("$45.00");
    expect(formatUSD(0)).toBe("$0.00");
  });

  it("formatSignedUSD adds explicit sign for positive/negative/zero", () => {
    expect(formatSignedUSD(5000)).toBe("+$50.00");
    expect(formatSignedUSD(-5000)).toBe("−$50.00");
    expect(formatSignedUSD(0)).toBe("$0.00");
  });
});

describe("calculateLossOfUse", () => {
  it("normal: no caps, no actual cost — simple daily rate x days", () => {
    const result = calculateLossOfUse({ dailyRateOfferedCents: 4500, daysWithoutVehicle: 10 });
    expect(result.reimbursementAtOfferedRateCents).toBe(45000);
    expect(result.reimbursementCappedByTotalCap).toBe(false);
    expect(result.daysCoveredUnderTotalCap).toBeNull();
    expect(result.totalCapExceededFlag).toBeNull();
    expect(result.gapVsActualCents).toBeNull();
    expect(result.lowRateFlag).toBeNull();
  });

  it("boundary: zero days without vehicle produces zero reimbursement", () => {
    const result = calculateLossOfUse({ dailyRateOfferedCents: 4500, daysWithoutVehicle: 0 });
    expect(result.reimbursementAtOfferedRateCents).toBe(0);
  });

  it("total cap not exceeded: days remaining is positive", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 5,
      totalCapCents: 30000,
    });
    // $300 cap / $30/day = 10 days covered; 10 - 5 = 5 remaining
    expect(result.daysCoveredUnderTotalCap).toBe(10);
    expect(result.daysRemainingUnderTotalCap).toBe(5);
    expect(result.totalCapExceededFlag).toBeNull();
    expect(result.reimbursementCappedByTotalCap).toBe(false);
    expect(result.reimbursementAtOfferedRateCents).toBe(15000);
  });

  it("total cap exceeded: reimbursement is capped and a flag is produced", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 15,
      totalCapCents: 30000,
    });
    // Uncapped would be $450, but cap is $300.
    expect(result.reimbursementAtOfferedRateCents).toBe(30000);
    expect(result.reimbursementCappedByTotalCap).toBe(true);
    expect(result.daysCoveredUnderTotalCap).toBe(10);
    expect(result.daysRemainingUnderTotalCap).toBe(-5);
    expect(result.totalCapExceededFlag).toMatch(/covers about 10 day/);
  });

  it("boundary: exactly at the total cap produces no exceeded flag", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      totalCapCents: 30000,
    });
    expect(result.daysRemainingUnderTotalCap).toBe(0);
    expect(result.totalCapExceededFlag).toBeNull();
    expect(result.reimbursementCappedByTotalCap).toBe(false);
  });

  it("daily rate above a supplied daily cap produces a flag", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 5000,
      daysWithoutVehicle: 5,
      dailyCapCents: 4000,
    });
    expect(result.dailyRateAboveDailyCapFlag).toMatch(/higher than the daily cap/);
  });

  it("daily rate at or below the daily cap produces no flag", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 4000,
      daysWithoutVehicle: 5,
      dailyCapCents: 4000,
    });
    expect(result.dailyRateAboveDailyCapFlag).toBeNull();
  });

  it("gap vs actual: actual cost higher than reimbursement produces a positive gap", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      actualRentalCostCents: 40000,
    });
    expect(result.gapVsActualCents).toBe(10000);
    expect(result.actualDailyCostCents).toBe(4000);
  });

  it("gap vs actual: actual cost lower than reimbursement produces a negative gap", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      actualRentalCostCents: 20000,
    });
    expect(result.gapVsActualCents).toBe(-10000);
  });

  it("low-rate flag: actual daily cost more than 20% above the offered rate", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      actualRentalCostCents: 40000, // $40/day actual vs $30/day offered = 33% higher
    });
    expect(result.lowRateFlag).toMatch(/more than 20% above/);
  });

  it("no low-rate flag when actual daily cost is within the threshold", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      actualRentalCostCents: 33000, // $33/day actual vs $30/day offered = 10% higher
    });
    expect(result.lowRateFlag).toBeNull();
  });

  it("boundary: actual daily cost exactly at the 20% threshold produces no flag", () => {
    const result = calculateLossOfUse({
      dailyRateOfferedCents: 3000,
      daysWithoutVehicle: 10,
      actualRentalCostCents: 36000, // exactly $36/day = 20% above $30/day
    });
    expect(result.lowRateFlag).toBeNull();
  });

  it("no gap or low-rate calculation when actual cost is not entered", () => {
    const result = calculateLossOfUse({ dailyRateOfferedCents: 3000, daysWithoutVehicle: 10 });
    expect(result.gapVsActualCents).toBeNull();
    expect(result.actualDailyCostCents).toBeNull();
    expect(result.lowRateFlag).toBeNull();
  });

  it("extreme: very high daily rate and many days still computes correctly", () => {
    const result = calculateLossOfUse({ dailyRateOfferedCents: 100000, daysWithoutVehicle: 90 });
    expect(result.reimbursementAtOfferedRateCents).toBe(9000000);
  });
});
