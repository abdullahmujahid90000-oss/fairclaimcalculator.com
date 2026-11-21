import { describe, expect, it } from "vitest";
import {
  ACKNOWLEDGE_PROMPT_DAYS,
  addDays,
  buildIcs,
  daysBetween,
  emptyState,
  isIsoDate,
  lastContactDate,
  nextStep,
  parseState,
  progress,
  prompts,
} from "../src/lib/tracker/claim-tracker";

describe("dates", () => {
  it("validates real calendar dates only", () => {
    expect(isIsoDate("2026-02-28")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("02/28/2026")).toBe(false);
  });

  it("counts whole days across month and DST boundaries", () => {
    expect(daysBetween("2026-03-01", "2026-03-15")).toBe(14);
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
    expect(daysBetween("2026-11-02", "2026-10-31")).toBe(-2);
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
  });
});

describe("progress and next step", () => {
  it("starts at zero with the first step next", () => {
    const s = emptyState();
    expect(progress(s)).toEqual({ done: 0, total: 10, percent: 0 });
    expect(nextStep(s)?.key).toBe("reported");
  });

  it("skips completed steps", () => {
    const s = emptyState();
    s.steps.reported = true;
    s.steps.evidence = true;
    expect(nextStep(s)?.key).toBe("filed");
    expect(progress(s).percent).toBe(20);
  });
});

describe("prompts", () => {
  it("asks for the filing date first", () => {
    const p = prompts(emptyState(), "2026-11-16");
    expect(p[0].text).toMatch(/date you filed/);
  });

  it("prompts a follow-up once the acknowledgment window passes", () => {
    const s = emptyState();
    s.claim.dateFiled = "2026-11-01";
    expect(prompts(s, addDays("2026-11-01", ACKNOWLEDGE_PROMPT_DAYS - 1)).some((p) => p.level === "action")).toBe(false);
    const p = prompts(s, addDays("2026-11-01", ACKNOWLEDGE_PROMPT_DAYS));
    expect(p.some((x) => x.level === "action" && x.text.includes("15 days since you filed"))).toBe(true);
  });

  it("flags a quiet claim using the latest logged contact", () => {
    const s = emptyState();
    s.claim.dateFiled = "2026-10-01";
    s.steps.acknowledged = true;
    s.log.push({ id: "a", date: "2026-10-20", type: "call", who: "Adjuster", note: "" });
    s.log.push({ id: "b", date: "2026-10-05", type: "email", who: "Adjuster", note: "" });
    expect(lastContactDate(s)).toBe("2026-10-20");
    expect(prompts(s, "2026-11-03").some((p) => p.text.includes("14 days"))).toBe(true);
    expect(prompts(s, "2026-11-02").some((p) => p.text.includes("No contact"))).toBe(false);
  });

  it("points a total loss to the payout check and a repair to diminished value", () => {
    const s = emptyState();
    s.claim.dateFiled = "2026-11-10";
    s.steps.estimate = true;
    s.claim.claimKind = "total-loss";
    expect(prompts(s, "2026-11-12").some((p) => p.href === "/calculators/total-loss-offer-audit/")).toBe(true);
    s.claim.claimKind = "repair";
    expect(prompts(s, "2026-11-12").some((p) => p.href === "/calculators/diminished-value-baseline/")).toBe(true);
  });

  it("stops prompting once paid", () => {
    const s = emptyState();
    s.claim.dateFiled = "2026-01-01";
    s.steps.paid = true;
    const p = prompts(s, "2026-11-16");
    expect(p).toHaveLength(1);
    expect(p[0].level).toBe("info");
  });
});

describe("buildIcs", () => {
  it("builds a valid all-day event and escapes text", () => {
    const ics = buildIcs({ date: "2026-11-20", title: "Follow up, claim 123", description: "Call; ask about offer", uid: "x1", stamp: "20261116T000000Z" });
    expect(ics).toContain("DTSTART;VALUE=DATE:20261120");
    expect(ics).toContain("DTEND;VALUE=DATE:20261121");
    expect(ics).toContain("SUMMARY:Follow up\\, claim 123");
    expect(ics).toContain("DESCRIPTION:Call\\; ask about offer");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });

  it("rejects a bad date", () => {
    expect(() => buildIcs({ date: "soon", title: "t", description: "d", uid: "u", stamp: "s" })).toThrow();
  });
});

describe("parseState", () => {
  it("round-trips a saved state", () => {
    const s = emptyState();
    s.claim.claimNumber = "ABC-123";
    s.claim.claimKind = "total-loss";
    s.steps.filed = true;
    s.log.push({ id: "1", date: "2026-11-02", type: "email", who: "Jane", note: "Sent photos" });
    expect(parseState(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });

  it("drops unknown fields and fixes bad values", () => {
    const parsed = parseState({
      version: 1,
      claim: { claimNumber: 42, claimKind: "spaceship", insurer: "Acme", extra: "x" },
      steps: { filed: "yes", paid: true, hacked: true },
      log: [{ date: "nope", type: "fax", note: "n" }, null],
    });
    expect(parsed.claim.claimNumber).toBe("");
    expect(parsed.claim.claimKind).toBe("unknown");
    expect(parsed.claim.insurer).toBe("Acme");
    expect(parsed.steps.filed).toBe(false);
    expect(parsed.steps.paid).toBe(true);
    expect("hacked" in parsed.steps).toBe(false);
    expect(parsed.log).toHaveLength(1);
    expect(parsed.log[0]).toMatchObject({ date: "", type: "other", note: "n" });
  });

  it("rejects files that aren't backups", () => {
    expect(() => parseState(null)).toThrow();
    expect(() => parseState({ hello: "world" })).toThrow();
  });
});
