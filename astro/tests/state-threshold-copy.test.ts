import { describe, it, expect } from "vitest";
import { STATE_THRESHOLDS } from "../src/lib/calculators/total-loss-threshold";
import { getPracticalMeaning, getWorkedExample, EXAMPLE_ACV_CENTS } from "../src/lib/content/state-threshold-copy";

describe("getPracticalMeaning", () => {
  it("normal: every one of the 51 entries produces non-empty text that mentions the state by name", () => {
    for (const s of STATE_THRESHOLDS) {
      const text = getPracticalMeaning(s);
      expect(text.length).toBeGreaterThan(20);
      expect(text).toContain(s.state);
    }
  });

  it("differentiation: distinct percentage tiers produce distinct text (not just the state name swapped)", () => {
    const tier100 = getPracticalMeaning({ state: "Texas", type: "percentage", thresholdPct: 100 });
    const tier75 = getPracticalMeaning({ state: "Texas", type: "percentage", thresholdPct: 75 });
    const tier60 = getPracticalMeaning({ state: "Texas", type: "percentage", thresholdPct: 60 });
    const tierTlf = getPracticalMeaning({ state: "Texas", type: "tlf", thresholdPct: null });
    const texts = [tier100, tier75, tier60, tierTlf];
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("same-tier states share the same underlying template but each still names its own state", () => {
    const alabama = getPracticalMeaning({ state: "Alabama", type: "percentage", thresholdPct: 75 });
    const kansas = getPracticalMeaning({ state: "Kansas", type: "percentage", thresholdPct: 75 });
    expect(alabama).toContain("Alabama");
    expect(kansas).toContain("Kansas");
    expect(alabama).not.toBe(kansas);
  });
});

describe("getWorkedExample", () => {
  it("normal: percentage state — repair figure is exactly pct% of the example ACV", () => {
    const result = getWorkedExample({ state: "Oklahoma", type: "percentage", thresholdPct: 60 });
    // $10,000 * 60% = $6,000
    expect(result.repairText).toBe("$6,000.00");
    expect(result.acvText).toBe(formatUSDLocal(EXAMPLE_ACV_CENTS));
  });

  it("normal: TLF state — reuses the published guide's exact worked figures ($7,500 + $1,000 = $8,500 < $10,000)", () => {
    const result = getWorkedExample({ state: "California", type: "tlf", thresholdPct: null });
    expect(result.repairText).toBe("$7,500.00");
    expect(result.salvageText).toBe("$1,000.00");
    expect(result.sumText).toBe("$8,500.00");
    expect(result.verdictText).toMatch(/not meet/);
  });

  it("edge: works for every one of the 51 entries without throwing", () => {
    for (const s of STATE_THRESHOLDS) {
      expect(() => getWorkedExample(s)).not.toThrow();
    }
  });
});

function formatUSDLocal(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}
