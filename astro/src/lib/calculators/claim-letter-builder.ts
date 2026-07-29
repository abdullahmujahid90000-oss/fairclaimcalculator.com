/**
 * FairClaimCalculator.com v2 — Claim Letter & Evidence Packet Builder.
 *
 * Templates stay factual and non-accusatory: no threats, fake deadlines,
 * invented legal citations, or promises of a result. All output is plain
 * text and is rendered into a textarea by the page.
 */

export const LETTER_BUILDER_CONFIG = {
  version: "1.1",
  effectiveDate: "2026-07-29",
  reviewedDate: "2026-07-29",
  sources: [
    "Editorial template rules: use a narrow factual request, preserve bracketed placeholders for missing facts, and require the user to verify every name, date, figure, recipient, and attachment.",
  ],
} as const;

export const LETTER_MODES = [
  { key: "valuation-report", label: "Request for Complete Valuation Report" },
  { key: "factual-correction", label: "Factual Correction Request" },
  { key: "comparable-reconsideration", label: "Comparable-Vehicle Reconsideration Request" },
  { key: "dv-notice", label: "Diminished-Value Claim Notice" },
  { key: "adjustment-explanation", label: "Request for Written Explanation of Adjustment" },
  { key: "appraisal-clause", label: "Request for Policy Appraisal-Clause Language" },
] as const;

export type LetterMode = (typeof LETTER_MODES)[number]["key"];

export const EVIDENCE_CHECKLIST = [
  "Insurer's complete written valuation or repair estimate",
  "Photos of the vehicle before and after the loss, if available",
  "Repair invoice or itemized repair order",
  "Comparable listings with source, date checked, mileage, trim, distance, and price",
  "Maintenance records or upgrade receipts showing the vehicle's condition",
  "Loan or lease payoff statement, if applicable",
  "GAP coverage certificate, if applicable",
  "Relevant policy pages, including any appraisal-clause language",
  "A dated log of calls and emails, including who you spoke with",
] as const;

export interface LetterFields {
  letterDate?: string;
  yourName?: string;
  insurerName?: string;
  adjusterName?: string;
  claimNumber?: string;
  vehicleDesc?: string;
  dateOfLoss?: string;
  correctionDetails?: string;
  comparablesDetails?: string;
  repairSummary?: string;
  dvBasis?: string;
  adjustmentDetails?: string;
}

function orPlaceholder(value: string | null | undefined, placeholder: string): string {
  const trimmed = (value ?? "").toString().trim();
  return trimmed.length ? trimmed : placeholder;
}

export function today(now = new Date()): string {
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function commonParts(fields: LetterFields, now?: Date) {
  const date = orPlaceholder(fields.letterDate, today(now));
  const yourName = orPlaceholder(fields.yourName, "[Your Name]");
  const insurerName = orPlaceholder(fields.insurerName, "[Insurer Name]");
  const adjusterName = orPlaceholder(fields.adjusterName, "[Adjuster Name]");
  const claimNumber = orPlaceholder(fields.claimNumber, "[Claim Number, if known]");
  const vehicleDesc = orPlaceholder(fields.vehicleDesc, "[Year/Make/Model of your vehicle]");
  const dateOfLoss = orPlaceholder(fields.dateOfLoss, "[Date of loss]");

  const header =
    `${date}\n\n${insurerName}\nAttn: ${adjusterName}\n` +
    `Re: Claim Number ${claimNumber}\nVehicle: ${vehicleDesc} — Date of Loss: ${dateOfLoss}\n\n` +
    `Dear ${adjusterName},\n\n`;
  const closing =
    "\n\nPlease confirm receipt of this letter and let me know if you need any additional information from me. " +
    "I appreciate your time in reviewing this.\n\nSincerely,\n" +
    yourName;

  return { header, closing };
}

function bodyFor(mode: LetterMode, fields: LetterFields): string {
  switch (mode) {
    case "valuation-report":
      return (
        "I am writing to request a complete copy of the written valuation report used to determine the settlement offer on the claim referenced above, including every comparable vehicle considered, each adjustment applied (mileage, condition, options, and any others), and the arithmetic used to arrive at the final base value.\n\n" +
        "I understand a summary or verbal explanation may have already been provided. I would like the full written report itself so I can review it in detail before deciding how to proceed."
      );
    case "factual-correction":
      return (
        "After reviewing the valuation report for the vehicle referenced above, I believe the following information does not accurately reflect my vehicle:\n\n" +
        orPlaceholder(
          fields.correctionDetails,
          "[Describe specifically what the report shows and what you believe is correct, with supporting documents if available.]",
        ) +
        "\n\nCould you please review this and let me know whether the valuation will be corrected and reissued, or explain why the current information is accurate?"
      );
    case "comparable-reconsideration":
      return (
        "I would like to ask that the following comparable vehicles be considered as part of the valuation for the vehicle referenced above:\n\n" +
        orPlaceholder(
          fields.comparablesDetails,
          "[List each comparable's year, trim, mileage, distance, asking price, seller type, source, and date checked, then explain why it is a reasonable match.]",
        ) +
        "\n\nI understand not every comparable will necessarily be used, but I would appreciate a written response explaining how these were considered and, if any were excluded, why."
      );
    case "dv-notice":
      return (
        "I am writing to give notice of a diminished-value claim related to the vehicle referenced above, following completion of covered repairs.\n\n" +
        `Repair summary: ${orPlaceholder(fields.repairSummary, "[Briefly describe the completed repair work.]")}\n\n` +
        `Basis for this claim: ${orPlaceholder(fields.dvBasis, "[Explain the supported facts that you believe affected the vehicle's post-repair market value.]")}\n\n` +
        "I understand this notice does not itself establish an amount owed, and that first-party and third-party diminished-value claims are treated differently depending on the state and policy involved. I would like to understand your process for evaluating this claim and what documentation you need from me."
      );
    case "adjustment-explanation":
      return (
        "I have reviewed the valuation report for the vehicle referenced above and would like a written explanation of the following adjustment(s):\n\n" +
        orPlaceholder(
          fields.adjustmentDetails,
          "[Identify each adjustment, the amount shown, and the specific question you want answered.]",
        ) +
        "\n\nSpecifically, I would like to understand how the amount was calculated and what evidence it was based on."
      );
    case "appraisal-clause":
      return (
        "I am requesting a copy of the appraisal-clause language from my policy that applies to disputes over vehicle valuation, including any procedural requirements such as deadlines to invoke it, how each side selects an appraiser, and how an umpire is chosen if the two appraisers disagree.\n\n" +
        "I would like to review this language before deciding whether to pursue this option."
      );
  }
}

export function generateLetter(
  mode: LetterMode,
  fields: LetterFields = {},
  now?: Date,
): string {
  if (!LETTER_MODES.some((item) => item.key === mode)) {
    throw new Error("Select a valid letter type.");
  }
  const parts = commonParts(fields, now);
  return parts.header + bodyFor(mode, fields) + parts.closing;
}

