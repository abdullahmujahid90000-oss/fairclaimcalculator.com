import { describe, expect, it } from "vitest";
import {
  TOTAL_LOSS_AUDIT_CONFIG,
  auditSummary,
  compStats,
  compStatsExcluding,
  evaluateMismatches,
  parseOptionalWholeNumber,
  reviewComparableQuality,
  toCents,
  type ComparableVehicle,
  type ReportStatus,
} from "../src/lib/calculators/total-loss-audit";

describe("total-loss input parsing", () => {
  it("normal: converts dollars to integer cents", () => {
    expect(toCents("18.57")).toEqual({ value: 1857, error: null });
  });

  it("boundary/empty: accepts zero and treats blank optional fields as zero", () => {
    expect(toCents("0")).toEqual({ value: 0, error: null });
    expect(toCents("")).toEqual({ value: 0, error: null });
    expect(toCents(null)).toEqual({ value: 0, error: null });
  });

  it("invalid: rejects non-finite values", () => {
    expect(toCents("nope", { label: "ACV" }).error).toMatch(/ACV must be a number/);
    expect(toCents(Number.POSITIVE_INFINITY).error).toMatch(/must be a number/);
  });

  it("negative: rejects negative dollar values", () => {
    expect(toCents("-1", { label: "Comp price" }).error).toMatch(/can't be negative/);
  });

  it("extreme: enforces the disclosed dollar ceiling", () => {
    expect(toCents("10000000").error).toBeNull();
    expect(toCents("10000000.01").error).toMatch(/too large/);
  });

  it("whole-number helper rejects decimals, negatives, and extremes", () => {
    expect(parseOptionalWholeNumber("2019", { label: "Year", max: 2100 })).toEqual({
      value: 2019,
      error: null,
    });
    expect(parseOptionalWholeNumber("1.5", { label: "Mileage", max: 500000 }).error).toMatch(/whole number/);
    expect(parseOptionalWholeNumber("-1", { label: "Mileage", max: 500000 }).error).toMatch(/negative/);
    expect(parseOptionalWholeNumber("500001", { label: "Mileage", max: 500000 }).error).toMatch(/too large/);
  });
});

describe("mismatch checklist", () => {
  it("returns no flags when every item is correct", () => {
    const statuses: Partial<Record<string, ReportStatus>> = Object.fromEntries(
      [
        "vinTrim",
        "drivetrain",
        "options",
        "mileage",
        "condition",
        "priorDamage",
        "geoRadius",
        "valuationDate",
        "listingStatus",
        "arithmetic",
      ].map((key) => [key, "correct" as ReportStatus]),
    );
    expect(evaluateMismatches(statuses)).toHaveLength(0);
  });

  it("flags incorrect, unknown, missing, and not-shown values with distinct guidance", () => {
    const flags = evaluateMismatches({
      vinTrim: "incorrect",
      drivetrain: "not_shown",
      options: "unknown",
    });
    expect(flags.find((item) => item.key === "vinTrim")?.note).toMatch(/not matching/);
    expect(flags.find((item) => item.key === "drivetrain")?.note).toMatch(/doesn't show/);
    expect(flags.find((item) => item.key === "options")?.note).toMatch(/not sure/);
  });
});

describe("comparable price statistics", () => {
  it("normal: computes mean, median, and range with integer-cent arithmetic", () => {
    const stats = compStats([
      { valueCents: 1_500_000 },
      { valueCents: 1_700_000 },
      { valueCents: 1_600_000 },
    ]);
    expect(stats).toMatchObject({
      count: 3,
      meanCents: 1_600_000,
      medianCents: 1_600_000,
      minCents: 1_500_000,
      maxCents: 1_700_000,
      confidence: "more-context",
      canCompareGroup: true,
    });
  });

  it("boundary: computes the median for an even number of comps", () => {
    expect(
      compStats([{ valueCents: 1_000_001 }, { valueCents: 1_000_002 }])?.medianCents,
    ).toBe(1_000_002);
  });

  it("empty/invalid: ignores nonpositive and non-finite values", () => {
    expect(compStats([])).toBeNull();
    expect(compStats([{ valueCents: 0 }, { valueCents: -1 }, { valueCents: Number.NaN }])).toBeNull();
  });

  it("does not make group comparisons or outlier claims from one comp", () => {
    const stats = compStats([{ valueCents: 1_000_000 }]);
    expect(stats?.confidence).toBe("single-comp");
    expect(stats?.canCompareGroup).toBe(false);
    expect(stats?.outlierIndexes).toEqual([]);
  });

  it("labels two comps as limited and three as more context", () => {
    expect(compStats([{ valueCents: 1 }, { valueCents: 2 }])?.confidence).toBe("limited");
    expect(compStats([{ valueCents: 1 }, { valueCents: 2 }, { valueCents: 3 }])?.confidence).toBe("more-context");
  });

  it("flags values more than 20% from the median, not exactly 20%", () => {
    const atBoundary = compStats([
      { valueCents: 800_000 },
      { valueCents: 1_000_000 },
      { valueCents: 1_200_000 },
    ]);
    expect(atBoundary?.outlierIndexes).toEqual([]);

    const overBoundary = compStats([
      { valueCents: 790_000 },
      { valueCents: 1_000_000 },
      { valueCents: 1_200_000 },
    ]);
    expect(overBoundary?.outlierIndexes).toEqual([0]);
  });

  it("recomputes statistics after excluding selected indexes", () => {
    const stats = compStatsExcluding(
      [{ valueCents: 100 }, { valueCents: 200 }, { valueCents: 10_000 }],
      [2],
    );
    expect(stats?.count).toBe(2);
    expect(stats?.maxCents).toBe(200);
  });
});

describe("audit summary", () => {
  it("flags an ACV outside the insurer's multi-comp range", () => {
    const result = auditSummary({
      acvCents: 1_000_000,
      insurerComps: [{ valueCents: 1_200_000 }, { valueCents: 1_300_000 }],
    });
    expect(result.acvVsInsurerFlag).toMatch(/falls outside/);
  });

  it("does not compare an ACV to a one-comp range", () => {
    const result = auditSummary({
      acvCents: 1_000_000,
      insurerComps: [{ valueCents: 1_200_000 }],
    });
    expect(result.acvVsInsurerFlag).toBeNull();
  });

  it("reports the signed gap between an owner-comp median and the ACV", () => {
    const higher = auditSummary({
      acvCents: 1_000_000,
      userComps: [{ valueCents: 1_200_000 }, { valueCents: 1_400_000 }],
    });
    expect(higher.acvVsUserGapCents).toBe(300_000);
    expect(higher.acvVsUserNote).toMatch(/higher/);

    const lower = auditSummary({
      acvCents: 1_500_000,
      userComps: [{ valueCents: 1_000_000 }, { valueCents: 1_200_000 }],
    });
    expect(lower.acvVsUserGapCents).toBe(-400_000);
    expect(lower.acvVsUserNote).toMatch(/lower/);
  });
});

describe("transparent comparable-quality review", () => {
  const baseComp: ComparableVehicle = {
    id: "insurer-1",
    source: "insurer",
    year: 2020,
    mileage: 50_000,
    distanceMiles: 20,
    trimMatch: "yes",
    configurationMatch: "yes",
    listingStatus: "active",
    listingDate: "2026-07-01",
    sellerType: "dealer",
    conditionMatch: "similar",
    adjustmentsShown: "yes",
  };

  it("shows factual year/mileage/distance/seller questions without a score or dollar adjustment", () => {
    const review = reviewComparableQuality(
      { year: 2021, mileage: 40_000, trim: "EX-L", configuration: "FWD" },
      [baseComp],
    )[0];
    expect(review.questions.map((item) => item.key)).toEqual(
      expect.arrayContaining(["year", "mileage", "distance", "seller-type"]),
    );
    expect(JSON.stringify(review)).not.toMatch(/\$|score|weight/i);
  });

  it("flags missing and nonmatching quality fields as questions to verify", () => {
    const review = reviewComparableQuality(
      { year: 2020, mileage: 50_000, trim: "EX-L", configuration: "FWD" },
      [
        {
          ...baseComp,
          year: null,
          mileage: null,
          distanceMiles: null,
          trimMatch: "no",
          configurationMatch: "unknown",
          listingStatus: "sold",
          listingDate: "",
          sellerType: "unknown",
          conditionMatch: "worse",
          adjustmentsShown: "no",
        },
      ],
    )[0];
    expect(review.questions.map((item) => item.key)).toEqual(
      expect.arrayContaining([
        "year",
        "mileage",
        "trim",
        "configuration",
        "distance",
        "listing-status",
        "listing-date",
        "seller-type",
        "condition",
        "adjustments",
      ]),
    );
  });

  it("keeps the outlier heuristic disclosed in config", () => {
    expect(TOTAL_LOSS_AUDIT_CONFIG.outlierThresholdPct).toBe(0.2);
    expect(TOTAL_LOSS_AUDIT_CONFIG.sources.join(" ")).toMatch(/not a legal or professional appraisal standard/);
  });
});

