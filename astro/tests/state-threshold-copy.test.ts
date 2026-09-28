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

import {
  BORDERING_STATES,
  getNeighborComparisons,
  getNationalPosition,
  getCrossBorderScenario,
} from "../src/lib/content/state-threshold-copy";

describe("BORDERING_STATES", () => {
  it("covers every jurisdiction and only names real ones", () => {
    const names = new Set(STATE_THRESHOLDS.map((s) => s.state));
    expect(Object.keys(BORDERING_STATES).sort()).toEqual([...names].sort());
    for (const list of Object.values(BORDERING_STATES)) {
      for (const n of list) expect(names.has(n)).toBe(true);
    }
  });

  it("is symmetric: if A borders B, B borders A", () => {
    for (const [a, list] of Object.entries(BORDERING_STATES)) {
      for (const b of list) expect(BORDERING_STATES[b]).toContain(a);
    }
  });
});

describe("getNeighborComparisons", () => {
  it("labels Oklahoma (60%) as lower than Texas (100%)", () => {
    const texas = STATE_THRESHOLDS.find((s) => s.state === "Texas")!;
    const ok = getNeighborComparisons(texas, STATE_THRESHOLDS).find((n) => n.state === "Oklahoma");
    expect(ok?.relation).toBe("lower");
  });
});

describe("getNationalPosition", () => {
  it("counts add up to all jurisdictions", () => {
    for (const s of STATE_THRESHOLDS) {
      const p = getNationalPosition(s, STATE_THRESHOLDS);
      expect(p.pctCount + p.tlfCount).toBe(STATE_THRESHOLDS.length);
      if (s.type === "percentage") expect(p.lower + p.same + p.higher + 1).toBe(p.pctCount);
    }
  });
});

describe("getCrossBorderScenario", () => {
  it("finds a real disagreement for Texas and none for Alaska", () => {
    const texas = STATE_THRESHOLDS.find((s) => s.state === "Texas")!;
    const alaska = STATE_THRESHOLDS.find((s) => s.state === "Alaska")!;
    expect(getCrossBorderScenario(texas, STATE_THRESHOLDS)).toMatch(/is a total loss|is not a total loss/);
    expect(getCrossBorderScenario(alaska, STATE_THRESHOLDS)).toBeNull();
  });

  it("produces distinct scenario text across states that have one", () => {
    const texts = STATE_THRESHOLDS.map((s) => getCrossBorderScenario(s, STATE_THRESHOLDS)).filter(Boolean);
    expect(new Set(texts).size).toBe(texts.length);
  });
});
