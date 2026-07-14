/**
 * FairClaimCalculator.com — Settlement Estimator Engine
 *
 * Implements the "multiplier method," the most commonly referenced
 * approach insurance adjusters and attorneys use as a starting point
 * for estimating general (non-economic) damages:
 *
 *   general damages = special damages (economic) × multiplier
 *   total estimate   = special damages + general damages
 *
 * where:
 *   special damages = medical bills + lost wages + property damage
 *   multiplier       = 1.5–5, scaled by injury severity, treatment
 *                       duration, and impact on daily life
 *
 * This is a simplified educational model, not a legal or financial
 * prediction tool. Every page using this engine must display the
 * standard disclaimer (see disclaimer.html / partial in each page).
 */

(function () {
  "use strict";

  /**
   * Core multiplier-method calculation.
   * @param {Object} inputs
   * @param {number} inputs.medicalBills
   * @param {number} inputs.lostWages
   * @param {number} inputs.propertyDamage
   * @param {("minor"|"moderate"|"severe"|"catastrophic")} inputs.severity
   * @param {boolean} inputs.ongoingTreatment - true if treatment/recovery is ongoing
   * @param {number} inputs.faultPercentage - 0-100, percentage of fault attributed to the claimant
   * @returns {Object} breakdown
   */
  function calculateSettlement(inputs) {
    const medicalBills = toNumber(inputs.medicalBills);
    const lostWages = toNumber(inputs.lostWages);
    const propertyDamage = toNumber(inputs.propertyDamage);
    const faultPct = clamp(toNumber(inputs.faultPercentage), 0, 100);

    const specialDamages = medicalBills + lostWages + propertyDamage;

    const severityMultipliers = {
      minor: [1.5, 2],
      moderate: [2, 3],
      severe: [3, 4],
      catastrophic: [4, 5],
    };

    const range = severityMultipliers[inputs.severity] || severityMultipliers.moderate;
    let [lowMult, highMult] = range;

    // Ongoing / long-term treatment nudges the multiplier toward the top of its band.
    if (inputs.ongoingTreatment) {
      lowMult += 0.25;
      highMult += 0.5;
    }

    let lowEstimate = specialDamages * lowMult + specialDamages;
    let highEstimate = specialDamages * highMult + specialDamages;

    // Apply comparative negligence: many states reduce recovery by the
    // claimant's own percentage of fault (pure or modified comparative
    // negligence). This is a simplified, non-state-specific adjustment.
    if (faultPct > 0) {
      const retainedShare = (100 - faultPct) / 100;
      lowEstimate *= retainedShare;
      highEstimate *= retainedShare;
    }

    return {
      specialDamages: round2(specialDamages),
      lowMultiplier: lowMult,
      highMultiplier: highMult,
      lowEstimate: round2(lowEstimate),
      highEstimate: round2(highEstimate),
      faultPercentage: faultPct,
    };
  }

  function toNumber(v) {
    const n = parseFloat(v);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function formatCurrency(n) {
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  /**
   * Wires up a calculator form on the page. Expects the form to expose
   * fields with the ids listed below and a results container.
   */
  function initCalculatorForm(formId, resultId) {
    const form = document.getElementById(formId);
    const resultBox = document.getElementById(resultId);
    if (!form || !resultBox) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = {
        medicalBills: form.medicalBills.value,
        lostWages: form.lostWages.value,
        propertyDamage: form.propertyDamage.value,
        severity: form.severity.value,
        ongoingTreatment: form.ongoingTreatment.checked,
        faultPercentage: form.faultPercentage.value,
      };

      const result = calculateSettlement(inputs);

      resultBox.querySelector(".range").textContent =
        formatCurrency(result.lowEstimate) + " – " + formatCurrency(result.highEstimate);

      const breakdown = resultBox.querySelector(".breakdown");
      breakdown.innerHTML = "";
      appendRow(breakdown, "Economic damages (bills, wages, property)", formatCurrency(result.specialDamages));
      appendRow(breakdown, "Multiplier range applied", result.lowMultiplier.toFixed(2) + "x – " + result.highMultiplier.toFixed(2) + "x");
      if (result.faultPercentage > 0) {
        appendRow(breakdown, "Adjustment for your share of fault", "-" + result.faultPercentage + "%");
      }

      resultBox.classList.add("visible");
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function appendRow(container, label, value) {
    const row = document.createElement("div");
    const l = document.createElement("span");
    l.textContent = label;
    const v = document.createElement("span");
    v.textContent = value;
    row.appendChild(l);
    row.appendChild(v);
    container.appendChild(row);
  }

  /**
   * Workers' compensation benefit estimator.
   *
   * Workers' comp is a fundamentally different, no-fault system from a
   * liability injury claim: in nearly every state it does NOT include
   * pain-and-suffering / general damages, fault is not weighed, and
   * medical treatment is generally paid separately and directly rather
   * than folded into a lump "settlement" figure. Benefits are instead
   * based on a wage-replacement formula (commonly ~2/3 of average
   * weekly wage, subject to state minimum/maximum caps) and, for
   * permanent impairment, a state-specific schedule tied to a doctor's
   * impairment rating. Because those schedules vary enormously by
   * state and body part, this estimator intentionally keeps permanent
   * partial disability (PPD) as a wide illustrative range rather than
   * a precise figure, and does not attempt to price permanent total
   * disability (PTD) lump-sum settlements at all — those require
   * present-value/life-expectancy analysis best left to an attorney.
   *
   * @param {Object} inputs
   * @param {number} inputs.averageWeeklyWage
   * @param {("ttd"|"tpd"|"ppd"|"ptd")} inputs.disabilityType
   * @param {number} inputs.weeks - weeks of disability (ttd/tpd only)
   * @param {number} inputs.impairmentRating - 0-100 (ppd only)
   * @returns {Object} breakdown
   */
  function calculateWorkersComp(inputs) {
    const aww = toNumber(inputs.averageWeeklyWage);
    const weeklyBenefit = round2(aww * (2 / 3));
    const weeks = toNumber(inputs.weeks);
    const impairmentRating = clamp(toNumber(inputs.impairmentRating), 0, 100);
    const type = inputs.disabilityType || "ttd";

    const result = {
      weeklyBenefit: weeklyBenefit,
      disabilityType: type,
      lowEstimate: null,
      highEstimate: null,
      note: "",
    };

    if (type === "ttd") {
      const total = round2(weeklyBenefit * weeks);
      result.lowEstimate = total;
      result.highEstimate = total;
    } else if (type === "tpd") {
      // TPD is commonly ~2/3 of the difference between pre- and
      // post-injury wages. Without a post-injury wage input, this is
      // approximated as roughly half of the full TTD benefit.
      const approx = round2(weeklyBenefit * 0.5 * weeks);
      result.lowEstimate = approx;
      result.highEstimate = approx;
    } else if (type === "ppd") {
      // Illustrative-only range: state schedules assign a set number
      // of compensable weeks per body part, scaled by impairment %.
      // 300–600 weeks is a rough cross-state illustrative span for a
      // significant, whole-person-equivalent impairment.
      const lowWeeks = 300 * (impairmentRating / 100);
      const highWeeks = 600 * (impairmentRating / 100);
      result.lowEstimate = round2(weeklyBenefit * lowWeeks);
      result.highEstimate = round2(weeklyBenefit * highWeeks);
    } else if (type === "ptd") {
      result.lowEstimate = null;
      result.highEstimate = null;
    }

    return result;
  }

  /**
   * Wires up the workers' comp form. Shows/hides the weeks vs.
   * impairment-rating fields based on the selected disability type,
   * and renders a weekly-benefit + total range (or a no-total note
   * for PTD).
   */
  function initWorkersCompForm(formId, resultId) {
    const form = document.getElementById(formId);
    const resultBox = document.getElementById(resultId);
    if (!form || !resultBox) return;

    const weeksGroup = form.querySelector("[data-field-group='weeks']");
    const impairmentGroup = form.querySelector("[data-field-group='impairment']");
    const ptdNote = form.querySelector("[data-field-group='ptd-note']");

    function syncFieldVisibility() {
      const type = form.disabilityType.value;
      if (weeksGroup) weeksGroup.style.display = (type === "ttd" || type === "tpd") ? "" : "none";
      if (impairmentGroup) impairmentGroup.style.display = (type === "ppd") ? "" : "none";
      if (ptdNote) ptdNote.style.display = (type === "ptd") ? "" : "none";
    }

    form.disabilityType.addEventListener("change", syncFieldVisibility);
    syncFieldVisibility();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = {
        averageWeeklyWage: form.averageWeeklyWage.value,
        disabilityType: form.disabilityType.value,
        weeks: form.weeks ? form.weeks.value : 0,
        impairmentRating: form.impairmentRating ? form.impairmentRating.value : 0,
      };

      const result = calculateWorkersComp(inputs);
      const breakdown = resultBox.querySelector(".breakdown");
      breakdown.innerHTML = "";

      if (result.disabilityType === "ptd") {
        resultBox.querySelector(".range").textContent = formatCurrency(result.weeklyBenefit) + " / week (ongoing)";
        appendRow(breakdown, "Estimated weekly benefit (≈2/3 of average weekly wage)", formatCurrency(result.weeklyBenefit));
        appendRow(breakdown, "Note", "Permanent total disability often resolves via a negotiated lump-sum settlement based on present value of future benefits and life expectancy — this is not something a simple calculator can responsibly price. Consult a workers' comp attorney for a PTD settlement valuation.");
      } else {
        resultBox.querySelector(".range").textContent =
          formatCurrency(result.lowEstimate) + " – " + formatCurrency(result.highEstimate);
        appendRow(breakdown, "Estimated weekly benefit (≈2/3 of average weekly wage)", formatCurrency(result.weeklyBenefit));
        if (result.disabilityType === "ppd") {
          appendRow(breakdown, "Note", "This range is a broad, illustrative estimate only. Actual permanent partial disability value depends entirely on your state's impairment schedule and the specific body part involved.");
        }
      }

      resultBox.classList.add("visible");
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // Expose to page scripts.
  window.FairClaim = {
    calculateSettlement: calculateSettlement,
    calculateWorkersComp: calculateWorkersComp,
    formatCurrency: formatCurrency,
    initCalculatorForm: initCalculatorForm,
    initWorkersCompForm: initWorkersCompForm,
  };
})();
