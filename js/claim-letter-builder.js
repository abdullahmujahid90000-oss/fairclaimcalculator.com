/**
 * FairClaimCalculator.com — Claim Letter & Evidence Packet Builder
 *
 * Generates factual, calm, editable letter drafts (master build prompt
 * §4.4). No threats, fake deadlines, legal citations, or "bad faith"
 * accusations — ever. The state insurance-department complaint mode is
 * intentionally NOT implemented here: the master prompt requires that
 * mode to wait until a state's workflow is individually verified with
 * real sources (see BUILD-LOG.md / PHASE-0-RESEARCH.md), which hasn't
 * happened for any state yet.
 *
 * Output is placed in a <textarea> (never innerHTML), so there is no HTML
 * injection surface from user-entered text — the browser treats textarea
 * content as plain text by construction.
 */

(function (root) {
  "use strict";

  var MODES = [
    { key: "valuation-report", label: "Request for Complete Valuation Report" },
    { key: "factual-correction", label: "Factual Correction Request" },
    { key: "comparable-reconsideration", label: "Comparable-Vehicle Reconsideration Request" },
    { key: "dv-notice", label: "Diminished-Value Claim Notice" },
    { key: "adjustment-explanation", label: "Request for Written Explanation of Adjustment" },
    { key: "appraisal-clause", label: "Request for Policy Appraisal-Clause Language" }
  ];

  function orPlaceholder(value, placeholder) {
    var v = (value || "").toString().trim();
    return v.length ? v : placeholder;
  }

  function today() {
    var d = new Date();
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  /**
   * Builds the shared letter header/greeting/closing used by every mode,
   * and returns the pieces so mode bodies can be inserted between them.
   */
  function commonParts(f) {
    var date = orPlaceholder(f.letterDate, today());
    var yourName = orPlaceholder(f.yourName, "[Your Name]");
    var insurerName = orPlaceholder(f.insurerName, "[Insurer Name]");
    var adjusterName = orPlaceholder(f.adjusterName, "[Adjuster Name]");
    var claimNumber = orPlaceholder(f.claimNumber, "[Claim Number, if known]");
    var vehicleDesc = orPlaceholder(f.vehicleDesc, "[Year/Make/Model of your vehicle]");
    var dateOfLoss = orPlaceholder(f.dateOfLoss, "[Date of loss]");

    var header = date + "\n\n" +
      insurerName + "\nAttn: " + adjusterName + "\nRe: Claim Number " + claimNumber + "\nVehicle: " + vehicleDesc + " — Date of Loss: " + dateOfLoss + "\n\n" +
      "Dear " + adjusterName + ",\n\n";

    var closing = "\n\nPlease confirm receipt of this letter and let me know if you need any additional information from me. I appreciate your time in reviewing this.\n\nSincerely,\n" + yourName;

    return { header: header, closing: closing, yourName: yourName, insurerName: insurerName, adjusterName: adjusterName, claimNumber: claimNumber, vehicleDesc: vehicleDesc, dateOfLoss: dateOfLoss };
  }

  function bodyFor(mode, f, p) {
    switch (mode) {
      case "valuation-report":
        return "I am writing to request a complete copy of the written valuation report used to determine the settlement offer on the claim referenced above, including every comparable vehicle considered, each adjustment applied (mileage, condition, options, and any others), and the arithmetic used to arrive at the final base value.\n\n" +
          "I understand a summary or verbal explanation may have already been provided. I would like the full written report itself so I can review it in detail before deciding how to proceed.";

      case "factual-correction":
        return "After reviewing the valuation report for the vehicle referenced above, I believe the following information does not accurately reflect my vehicle:\n\n" +
          orPlaceholder(f.correctionDetails, "[Describe specifically what the report shows and what you believe is actually correct — for example: the report lists a base trim, but the vehicle was the EX-L trim with a sunroof and leather package.]") +
          "\n\nCould you please review this and let me know whether the valuation will be corrected and reissued, or explain why the current information is accurate?";

      case "comparable-reconsideration":
        return "I would like to ask that the following comparable vehicles be considered as part of the valuation for the vehicle referenced above:\n\n" +
          orPlaceholder(f.comparablesDetails, "[List the comparable vehicles you found — year/trim/mileage/distance/asking price and source — and briefly explain why each is a reasonable match for your vehicle's condition before the loss.]") +
          "\n\nI understand not every comparable will necessarily be used, but I'd appreciate a written response explaining how these were considered, and if any were excluded, why.";

      case "dv-notice":
        return "I am writing to give notice of a diminished-value claim related to the vehicle referenced above, following completion of covered repairs.\n\n" +
          "Repair summary: " + orPlaceholder(f.repairSummary, "[Briefly describe the repair work completed — e.g., front-end collision repair including bumper, fender, and frame-rail work.]") + "\n\n" +
          "Basis for this claim: " + orPlaceholder(f.dvBasis, "[Explain briefly why you believe the vehicle's resale value was reduced by the accident history — e.g., the vehicle now carries a reportable accident record affecting resale value even though repairs were completed.]") + "\n\n" +
          "I understand this notice does not itself establish an amount owed, and that first-party and third-party diminished-value claims are treated differently depending on the state and policy involved. I would like to understand your process for evaluating this claim and what documentation you'll need from me.";

      case "adjustment-explanation":
        return "I have reviewed the valuation report for the vehicle referenced above and would like a written explanation of the following adjustment(s):\n\n" +
          orPlaceholder(f.adjustmentDetails, "[Identify the specific adjustment(s) you have questions about — e.g., a $1,200 'condition' deduction, or a negative 'typical negotiation' adjustment applied to each comparable — and what you'd like explained.]") +
          "\n\nSpecifically, I'd like to understand how the amount was calculated and what it was based on.";

      case "appraisal-clause":
        return "I am requesting a copy of the appraisal-clause language from my policy that applies to disputes over vehicle valuation, including any procedural requirements (such as deadlines to invoke it, how each side selects an appraiser, and how an umpire is chosen if the two appraisers disagree).\n\n" +
          "I would like to review this language before deciding whether to pursue this option.";

      default:
        return "";
    }
  }

  /**
   * Generates the full letter text for a given mode and field set.
   * @param {string} mode - one of MODES[].key
   * @param {Object} f - field values (all optional; blanks become bracket placeholders)
   * @returns {string} the letter text
   */
  function generateLetter(mode, f) {
    f = f || {};
    var p = commonParts(f);
    var body = bodyFor(mode, f, p);
    return p.header + body + p.closing;
  }

  var api = {
    MODES: MODES,
    generateLetter: generateLetter,
    today: today
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.FairClaim = root.FairClaim || {};
    for (var k in api) { root.FairClaim[k] = api[k]; }
  }
})(typeof window !== "undefined" ? window : null);
