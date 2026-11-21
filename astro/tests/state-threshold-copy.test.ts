import { describe, it, expect } from "vitest";
import { STATE_THRESHOLDS } from "../src/lib/calculators/total-loss-threshold";
import {
  BORDERING_STATES,
  getNeighborComparisons,
  getCrossBorderScenario,
  getWorkedExample,
  exampleAcvCents,
  exampleSalvageCents,
} from "../src/lib/content/state-threshold-copy";
import { STATE_LAW_FACTS, getAllThresholdChanges } from "../src/lib/content/state-threshold-facts";

describe("getWorkedExample", () => {
  it("percentage state: the line is exactly pct% of that state's example value", () => {
    const nevada = STATE_THRESHOLDS.find((s) => s.state === "Nevada")!;
    const ex = getWorkedExample(nevada);
    expect(ex.acvCents).toBe(exampleAcvCents("Nevada"));
    expect(ex.lineCents).toBe(Math.ceil(ex.acvCents * 0.65));
  });

  it("no-percentage state: the line is value minus example salvage", () => {
    const ca = STATE_THRESHOLDS.find((s) => s.state === "California")!;
    const ex = getWorkedExample(ca);
    expect(ex.salvageCents).toBe(exampleSalvageCents(ex.acvCents));
    expect(ex.lineCents).toBe(ex.acvCents - (ex.salvageCents as number));
  });

  it("neighbors in the list don't all use the same example car", () => {
    const values = new Set(STATE_THRESHOLDS.map((s) => exampleAcvCents(s.state)));
    expect(values.size).toBeGreaterThan(8);
  });

  it("works for every one of the 51 entries", () => {
    for (const s of STATE_THRESHOLDS) expect(() => getWorkedExample(s)).not.toThrow();
  });
});

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
  it("labels Oklahoma (70%) as lower than Texas (100%)", () => {
    const texas = STATE_THRESHOLDS.find((s) => s.state === "Texas")!;
    const ok = getNeighborComparisons(texas, STATE_THRESHOLDS).find((n) => n.state === "Oklahoma");
    expect(ok?.relation).toBe("lower");
  });
});

describe("getCrossBorderScenario", () => {
  it("finds a real disagreement for Texas and none for Alaska", () => {
    const texas = STATE_THRESHOLDS.find((s) => s.state === "Texas")!;
    const alaska = STATE_THRESHOLDS.find((s) => s.state === "Alaska")!;
    expect(getCrossBorderScenario(texas, STATE_THRESHOLDS)).toMatch(/crosses the line|stays under the line/);
    expect(getCrossBorderScenario(alaska, STATE_THRESHOLDS)).toBeNull();
  });

  it("produces distinct scenario text across states that have one", () => {
    const texts = STATE_THRESHOLDS.map((s) => getCrossBorderScenario(s, STATE_THRESHOLDS)).filter(Boolean);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe("STATE_LAW_FACTS", () => {
  it("has a record for every jurisdiction and no extras", () => {
    expect(Object.keys(STATE_LAW_FACTS).sort()).toEqual(STATE_THRESHOLDS.map((s) => s.state).sort());
  });

  it("every record has a citation, agency and regulator with https links", () => {
    for (const [state, f] of Object.entries(STATE_LAW_FACTS)) {
      for (const l of [f.cite, f.titleAgency, f.regulator, ...f.changes.map((c) => c.source)]) {
        expect(l.url, state).toMatch(/^https:\/\//);
        expect(l.name.length, state).toBeGreaterThan(3);
      }
      expect(f.lawSays.length, state).toBeGreaterThan(60);
      expect(f.keeping.length, state).toBeGreaterThan(40);
    }
  });

  it("percentage states mention their percentage in the law summary (or say it is unconfirmed)", () => {
    for (const s of STATE_THRESHOLDS.filter((x) => x.type === "percentage")) {
      const f = STATE_LAW_FACTS[s.state];
      if (f.check === "unconfirmed") continue;
      expect(f.lawSays, s.state).toContain(`${s.thresholdPct}%`);
    }
  });

  it("change dates are YYYY or YYYY-MM-DD and sorted newest first", () => {
    const changes = getAllThresholdChanges();
    for (const c of changes) expect(c.date).toMatch(/^\d{4}(-\d{2}-\d{2})?$/);
    const dates = changes.map((c) => c.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("records the 2026 moves: RI 85% enacted, OK 70% enacted, SD SB 227 failed", () => {
    const changes = getAllThresholdChanges();
    expect(changes.some((c) => c.state === "Rhode Island" && c.date === "2026-06-26" && c.status === "enacted")).toBe(true);
    expect(changes.some((c) => c.state === "Oklahoma" && c.date === "2026-11-01" && c.status === "enacted")).toBe(true);
    expect(changes.some((c) => c.state === "South Dakota" && c.status === "failed")).toBe(true);
  });
});
