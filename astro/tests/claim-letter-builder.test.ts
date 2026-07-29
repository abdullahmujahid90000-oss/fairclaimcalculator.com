import { describe, expect, it } from "vitest";
import {
  EVIDENCE_CHECKLIST,
  LETTER_MODES,
  generateLetter,
  today,
  type LetterMode,
} from "../src/lib/calculators/claim-letter-builder";

const fixedDate = new Date("2026-07-29T12:00:00Z");

describe("claim letter builder", () => {
  it("normal: generates all six declared modes", () => {
    for (const mode of LETTER_MODES) {
      const letter = generateLetter(
        mode.key,
        {
          yourName: "Avery Owner",
          insurerName: "Example Mutual",
          adjusterName: "Jordan Adjuster",
          claimNumber: "ABC-123",
          vehicleDesc: "2020 Example Sedan",
          dateOfLoss: "July 1, 2026",
        },
        fixedDate,
      );
      expect(letter).toContain("Example Mutual");
      expect(letter).toContain("ABC-123");
      expect(letter).toContain("Sincerely,\nAvery Owner");
    }
  });

  it("uses a deterministic UTC date when no letter date is provided", () => {
    expect(today(fixedDate)).toBe("July 29, 2026");
    expect(generateLetter("valuation-report", {}, fixedDate)).toMatch(/^July 29, 2026/);
  });

  it("empty: preserves obvious bracketed placeholders for every missing fact", () => {
    const letter = generateLetter("valuation-report", {}, fixedDate);
    expect(letter).toContain("[Insurer Name]");
    expect(letter).toContain("[Adjuster Name]");
    expect(letter).toContain("[Claim Number, if known]");
    expect(letter).toContain("[Year/Make/Model of your vehicle]");
    expect(letter).toContain("[Date of loss]");
    expect(letter).toContain("[Your Name]");
  });

  it("boundary: trims whitespace-only fields back to placeholders", () => {
    const letter = generateLetter(
      "valuation-report",
      { yourName: "   ", insurerName: "\n" },
      fixedDate,
    );
    expect(letter).toContain("[Your Name]");
    expect(letter).toContain("[Insurer Name]");
  });

  it("invalid: rejects an unknown mode instead of generating an empty letter", () => {
    expect(() => generateLetter("bad-mode" as LetterMode, {}, fixedDate)).toThrow(
      /valid letter type/,
    );
  });

  it("keeps user-entered angle brackets and punctuation as plain text", () => {
    const details = '<script>alert("not HTML")</script> & exact factual note';
    const letter = generateLetter(
      "factual-correction",
      { correctionDetails: details },
      fixedDate,
    );
    expect(letter).toContain(details);
  });

  it("extreme: preserves a long factual detail block without truncating it", () => {
    const details = "Comparable detail. ".repeat(1_000);
    const letter = generateLetter(
      "comparable-reconsideration",
      { comparablesDetails: details },
      fixedDate,
    );
    expect(letter).toContain(details.trim());
    expect(letter.length).toBeGreaterThan(details.length);
  });

  it("factual-correction mode includes the supplied correction", () => {
    expect(
      generateLetter(
        "factual-correction",
        { correctionDetails: "The report shows LX; the VIN record shows EX-L." },
        fixedDate,
      ),
    ).toMatch(/VIN record shows EX-L/);
  });

  it("comparable mode asks for a written inclusion/exclusion explanation", () => {
    expect(generateLetter("comparable-reconsideration", {}, fixedDate)).toMatch(
      /written response explaining how these were considered/,
    );
  });

  it("DV notice states that the notice does not establish an amount owed", () => {
    expect(generateLetter("dv-notice", {}, fixedDate)).toMatch(
      /does not itself establish an amount owed/,
    );
  });

  it("adjustment mode requests the arithmetic and evidence behind the amount", () => {
    expect(generateLetter("adjustment-explanation", {}, fixedDate)).toMatch(
      /how the amount was calculated and what evidence/,
    );
  });

  it("appraisal-clause mode asks for policy language without invoking the clause", () => {
    const letter = generateLetter("appraisal-clause", {}, fixedDate);
    expect(letter).toMatch(/requesting a copy/);
    expect(letter).toMatch(/before deciding whether to pursue/);
  });

  it("templates contain no threats, fake deadlines, or bad-faith accusations", () => {
    const allLetters = LETTER_MODES.map((mode) =>
      generateLetter(mode.key, {}, fixedDate),
    ).join("\n");
    expect(allLetters).not.toMatch(/bad faith|\bsue\b|lawsuit|within \d+ days|demand payment/i);
  });

  it("ships a practical evidence checklist", () => {
    expect(EVIDENCE_CHECKLIST.length).toBeGreaterThanOrEqual(8);
    expect(EVIDENCE_CHECKLIST.join(" ")).toMatch(/valuation|comparable|policy|calls/i);
  });
});
