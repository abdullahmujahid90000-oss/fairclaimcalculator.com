import { describe, expect, it } from "vitest";
import { isNoindexThresholdStatePage } from "../src/lib/seo/indexing.mjs";

describe("isNoindexThresholdStatePage", () => {
  it("keeps templated threshold state pages out of search", () => {
    expect(isNoindexThresholdStatePage("/guides/total-loss/state-total-loss-threshold-laws/texas/")).toBe(true);
    expect(
      isNoindexThresholdStatePage("https://www.fairclaimcalculator.com/guides/total-loss/state-total-loss-threshold-laws/washington-dc/"),
    ).toBe(true);
  });

  it("never hides the hub or unrelated pages", () => {
    expect(isNoindexThresholdStatePage("https://www.fairclaimcalculator.com/guides/total-loss/state-total-loss-threshold-laws/")).toBe(false);
    expect(isNoindexThresholdStatePage("/guides/accident-reporting/texas/")).toBe(false);
    expect(isNoindexThresholdStatePage("/calculators/total-loss-threshold-checker/")).toBe(false);
  });
});

describe("INDEXED_THRESHOLD_STATE_SLUGS (2026-11-21)", () => {
  it("re-indexes rewritten, confirmed state pages and keeps unconfirmed ones out", () => {
    expect(isNoindexThresholdStatePage("/guides/total-loss/state-total-loss-threshold-laws/rhode-island/")).toBe(false);
    expect(isNoindexThresholdStatePage("/guides/total-loss/state-total-loss-threshold-laws/florida/")).toBe(false);
    expect(isNoindexThresholdStatePage("/guides/total-loss/state-total-loss-threshold-laws/new-hampshire/")).toBe(true);
    expect(isNoindexThresholdStatePage("/guides/total-loss/state-total-loss-threshold-laws/mississippi/")).toBe(true);
  });
});
