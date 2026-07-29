import { describe, expect, it } from "vitest";
import {
  DV_CONFIG,
  DVValidationError,
  calculate17cBaseline,
  evaluateMarketEvidence,
  formatUSD,
  getDamageMultiplier,
  getMileageBand,
  statsForCentsList,
  toCents,
} from "../src/lib/calculators/diminished-value-baseline";

describe("diminished-value input helpers", () => {
  it("normal: parses dollars to integer cents", () => {
    expect(toCents("123.45")).toBe(12_345);
  });

  it("empty: optional blanks return null", () => {
    expect(toCents("")).toBeNull();
    expect(toCents("   ")).toBeNull();
    expect(toCents(null)).toBeNull();
  });

  it("invalid and negative: throws a labeled error", () => {
    expect(() => toCents("abc", "Value")).toThrow(/must be a number/);
    expect(() => toCents("-1", "Value")).toThrow(/cannot be negative/);
  });

  it("formats zero, positive, negative, and absent cents", () => {
    expect(formatUSD(0)).toBe("$0.00");
    expect(formatUSD(123_456)).toBe("$1,234.56");
    expect(formatUSD(-100)).toBe("-$1.00");
    expect(formatUSD(null)).toBe("—");
  });
});

describe("17c-style baseline", () => {
  it("normal: reproduces the disclosed cap × damage × mileage arithmetic", () => {
    const result = calculate17cBaseline({
      preAccidentValue: "20000",
      mileage: "45000",
      damageCategory: "moderate",
    });
    expect(result.baseCapCents).toBe(200_000);
    expect(result.afterDamageCents).toBe(100_000);
    expect(result.mileageMultiplier).toBe(0.6);
    expect(result.resultCents).toBe(60_000);
  });

  it("boundary: applies every mileage-band edge correctly", () => {
    expect(getMileageBand(19_999).value).toBe(1);
    expect(getMileageBand(20_000).value).toBe(0.8);
    expect(getMileageBand(39_999).value).toBe(0.8);
    expect(getMileageBand(40_000).value).toBe(0.6);
    expect(getMileageBand(99_999).value).toBe(0.2);
    expect(getMileageBand(100_000).value).toBe(0);
  });

  it("supports every declared damage category, including zero", () => {
    expect(getDamageMultiplier("severe")?.value).toBe(1);
    expect(getDamageMultiplier("minor")?.value).toBe(0.25);
    expect(getDamageMultiplier("none")?.value).toBe(0);
    expect(getDamageMultiplier("unknown")).toBeNull();
  });

  it("empty: points missing required values to the correct field", () => {
    for (const input of [
      { preAccidentValue: "", mileage: "1", damageCategory: "minor" },
      { preAccidentValue: "1", mileage: "", damageCategory: "minor" },
      { preAccidentValue: "1", mileage: "1", damageCategory: "" },
    ]) {
      try {
        calculate17cBaseline(input);
        throw new Error("Expected validation error");
      } catch (error) {
        expect(error).toBeInstanceOf(DVValidationError);
      }
    }
  });

  it("invalid: rejects nonnumeric and fractional mileage", () => {
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: "10000",
        mileage: "abc",
        damageCategory: "minor",
      }),
    ).toThrow(/Mileage must be a number/);
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: "10000",
        mileage: "1.5",
        damageCategory: "minor",
      }),
    ).toThrow(/whole number/);
  });

  it("negative: rejects negative value and mileage", () => {
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: "-1",
        mileage: "1",
        damageCategory: "minor",
      }),
    ).toThrow(/cannot be negative/);
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: "1",
        mileage: "-1",
        damageCategory: "minor",
      }),
    ).toThrow(/cannot be negative/);
  });

  it("extreme: accepts the ceilings and rejects values above them", () => {
    expect(
      calculate17cBaseline({
        preAccidentValue: DV_CONFIG.maxPlausibleValueCents / 100,
        mileage: DV_CONFIG.maxPlausibleMiles,
        damageCategory: "severe",
      }).resultCents,
    ).toBe(0);
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: DV_CONFIG.maxPlausibleValueCents / 100 + 1,
        mileage: "1",
        damageCategory: "minor",
      }),
    ).toThrow(/plausibility ceiling/);
    expect(() =>
      calculate17cBaseline({
        preAccidentValue: "1",
        mileage: DV_CONFIG.maxPlausibleMiles + 1,
        damageCategory: "minor",
      }),
    ).toThrow(/plausibility ceiling/);
  });
});

describe("market evidence", () => {
  it("computes mean, median, and range", () => {
    expect(statsForCentsList([1_000_000, 1_200_000, 1_400_000])).toMatchObject({
      count: 3,
      meanCents: 1_200_000,
      medianCents: 1_200_000,
      minCents: 1_000_000,
      maxCents: 1_400_000,
      confidence: "more-context",
    });
  });

  it("empty/invalid: returns null when there are no positive finite prices", () => {
    expect(statsForCentsList([])).toBeNull();
    expect(statsForCentsList([0, -1, Number.NaN])).toBeNull();
  });

  it("keeps a one-comp group visible but does not calculate an evidence gap", () => {
    const result = evaluateMarketEvidence([{ price: "15000" }], [{ price: "13000" }]);
    expect(result.cleanStats?.confidence).toBe("single-comp");
    expect(result.hasEnoughEvidence).toBe(false);
    expect(result.gapCents).toBeNull();
  });

  it("calculates the median gap only with at least two comps in each group", () => {
    const result = evaluateMarketEvidence(
      [{ price: "15000" }, { price: "17000" }],
      [{ price: "12000" }, { price: "14000" }],
    );
    expect(result.hasEnoughEvidence).toBe(true);
    expect(result.gapCents).toBe(300_000);
  });

  it("never blends the market gap with the 17c result", () => {
    const result = evaluateMarketEvidence(
      [{ price: "15000" }, { price: "17000" }],
      [{ price: "12000" }, { price: "14000" }],
    );
    expect(Object.keys(result)).not.toContain("combinedValue");
    expect(Object.keys(result)).not.toContain("average");
  });
});

