import { describe, it, expect } from "vitest";
import { STATE_CRASH_REPORTING, crashReportingSlug } from "../src/lib/content/state-crash-reporting";
import { STATE_THRESHOLDS, slugifyState } from "../src/lib/calculators/total-loss-threshold";

describe("STATE_CRASH_REPORTING", () => {
  it("covers exactly the same 51 jurisdictions as the total-loss data", () => {
    expect(STATE_CRASH_REPORTING.map((e) => e.state).sort()).toEqual(STATE_THRESHOLDS.map((e) => e.state).sort());
  });

  it("uses the same URL slugs as the total-loss pages, so cross-links resolve", () => {
    for (const e of STATE_CRASH_REPORTING) expect(crashReportingSlug(e.state)).toBe(slugifyState(e.state));
  });

  it("cites an official https source for every state", () => {
    for (const e of STATE_CRASH_REPORTING) {
      expect(e.sourceUrl).toMatch(/^https:\/\//);
      expect(e.sourceLabel.length).toBeGreaterThan(5);
    }
  });

  it("says who to file with whenever a driver report is required", () => {
    for (const e of STATE_CRASH_REPORTING.filter((x) => x.kind === "driver-report" || x.kind === "driver-report-if-no-police")) {
      expect(e.reportTo, e.state).not.toBeNull();
    }
  });
});
