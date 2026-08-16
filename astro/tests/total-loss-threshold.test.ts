import { describe, it, expect } from "vitest";
import {
  toCents,
  formatUSD,
  lookupState,
  checkTotalLossThreshold,
  ThresholdValidationError,
  STATE_THRESHOLDS,
  slugifyState,
  lookupStateBySlug,
} from "../src/lib/calculators/total-loss-threshold";

describe("toCents", () => {
  it("normal: parses a plain dollar amount", () => {
    expect(toCents("10000")).toEqual({ value: 1000000, error: null });
  });
  it("empty: blank/null/undefined all resolve to 0 with no error", () => {
    expect(toCents("")).toEqual({ value: 0, error: null });
    expect(toCents(null)).toEqual({ value: 0, error: null });
  });
  it("invalid: non-numeric string produces a labeled error", () => {
    expect(toCents("abc", { label: "Repair estimate" }).error).toMatch(/must be a number/);
  });
  it("negative: rejected", () => {
    expect(toCents("-5", { label: "ACV" }).error).toMatch(/can't be negative/);
  });
  it("extreme: values above the ceiling are rejected", () => {
    expect(toCents("99999999").error).toMatch(/too large/);
  });
});

describe("formatUSD", () => {
  it("formats correctly", () => {
    expect(formatUSD(1000000)).toBe("$10,000.00");
  });
});

describe("STATE_THRESHOLDS", () => {
  it("has exactly 51 entries (50 states + D.C.)", () => {
    expect(STATE_THRESHOLDS.length).toBe(51);
  });
  it("every entry has a valid type and matching thresholdPct nullability", () => {
    for (const s of STATE_THRESHOLDS) {
      expect(["percentage", "tlf"]).toContain(s.type);
      if (s.type === "percentage") expect(s.thresholdPct).not.toBeNull();
      if (s.type === "tlf") expect(s.thresholdPct).toBeNull();
    }
  });
});

describe("lookupState", () => {
  it("normal: finds a state case-insensitively and with surrounding whitespace", () => {
    expect(lookupState("  texas ")?.state).toBe("Texas");
    expect(lookupState("TEXAS")?.state).toBe("Texas");
  });
  it("edge: Washington, D.C. is a distinct entry from Washington (the state)", () => {
    expect(lookupState("Washington")?.type).toBe("tlf");
    expect(lookupState("Washington, D.C.")?.type).toBe("percentage");
  });
  it("invalid: unknown state returns null", () => {
    expect(lookupState("Atlantis")).toBeNull();
  });
});

describe("checkTotalLossThreshold — percentage states", () => {
  it("normal: matches the guide's worked example exactly (75% threshold state, $10,000 ACV, $7,500 repair)", () => {
    const result = checkTotalLossThreshold({
      state: "Alabama",
      repairEstimateCents: 750000,
      acvCents: 1000000,
    });
    expect(result.type).toBe("percentage");
    expect(result.thresholdPct).toBe(75);
    expect(result.repairPercentOfACV).toBeCloseTo(75, 5);
    expect(result.meetsPercentageThreshold).toBe(true);
  });

  it("edge: exactly at threshold counts as meeting it (>=, not >)", () => {
    const result = checkTotalLossThreshold({ state: "Nevada", repairEstimateCents: 650000, acvCents: 1000000 });
    expect(result.repairPercentOfACV).toBeCloseTo(65, 5);
    expect(result.meetsPercentageThreshold).toBe(true);
  });

  it("normal: below threshold does not meet it", () => {
    const result = checkTotalLossThreshold({ state: "Texas", repairEstimateCents: 500000, acvCents: 1000000 });
    expect(result.meetsPercentageThreshold).toBe(false);
  });

  it("tlf fields are null for a percentage-threshold state", () => {
    const result = checkTotalLossThreshold({ state: "Florida", repairEstimateCents: 900000, acvCents: 1000000 });
    expect(result.tlfSumCents).toBeNull();
    expect(result.meetsTLF).toBeNull();
  });
});

describe("checkTotalLossThreshold — TLF states", () => {
  it("normal: matches the guide's worked TLF example exactly (California, $7,500 repair + $1,000 salvage < $10,000 ACV)", () => {
    const result = checkTotalLossThreshold({
      state: "California",
      repairEstimateCents: 750000,
      acvCents: 1000000,
      estimatedSalvageValueCents: 100000,
    });
    expect(result.type).toBe("tlf");
    expect(result.thresholdPct).toBeNull();
    expect(result.tlfSumCents).toBe(850000);
    expect(result.meetsTLF).toBe(false);
    expect(result.meetsPercentageThreshold).toBeNull();
  });

  it("edge: TLF sum exactly equal to ACV counts as meeting it", () => {
    const result = checkTotalLossThreshold({
      state: "Ohio",
      repairEstimateCents: 900000,
      acvCents: 1000000,
      estimatedSalvageValueCents: 100000,
    });
    expect(result.tlfSumCents).toBe(1000000);
    expect(result.meetsTLF).toBe(true);
  });

  it("edge: no salvage estimate provided leaves TLF fields null rather than guessing", () => {
    const result = checkTotalLossThreshold({ state: "Arizona", repairEstimateCents: 750000, acvCents: 1000000 });
    expect(result.tlfSumCents).toBeNull();
    expect(result.meetsTLF).toBeNull();
    // repairPercentOfACV is still computed for reference, even though it isn't the legal test in a TLF state
    expect(result.repairPercentOfACV).toBeCloseTo(75, 5);
  });
});

describe("slugifyState / lookupStateBySlug", () => {
  it("normal: lowercases and hyphenates a simple two-word state", () => {
    expect(slugifyState("New York")).toBe("new-york");
  });
  it("edge: strips commas and periods from Washington, D.C.", () => {
    expect(slugifyState("Washington, D.C.")).toBe("washington-dc");
  });
  it("edge: Washington (state) and Washington, D.C. produce distinct slugs", () => {
    expect(slugifyState("Washington")).not.toBe(slugifyState("Washington, D.C."));
  });
  it("produces 51 unique slugs across all STATE_THRESHOLDS entries (no state-page URL collisions)", () => {
    const slugs = STATE_THRESHOLDS.map((s) => slugifyState(s.state));
    expect(new Set(slugs).size).toBe(51);
  });
  it("lookupStateBySlug reverses slugifyState for every entry", () => {
    for (const s of STATE_THRESHOLDS) {
      expect(lookupStateBySlug(slugifyState(s.state))?.state).toBe(s.state);
    }
  });
  it("invalid: unknown slug returns null", () => {
    expect(lookupStateBySlug("not-a-real-state")).toBeNull();
  });
});

describe("checkTotalLossThreshold — validation", () => {
  it("invalid: unknown state throws", () => {
    expect(() => checkTotalLossThreshold({ state: "Narnia", repairEstimateCents: 100, acvCents: 100 })).toThrow(
      ThresholdValidationError,
    );
  });
  it("invalid: zero ACV throws rather than dividing by zero", () => {
    expect(() => checkTotalLossThreshold({ state: "Texas", repairEstimateCents: 100, acvCents: 0 })).toThrow(
      ThresholdValidationError,
    );
  });
});
