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

  // Expose to page scripts.
  window.FairClaim = {
    calculateSettlement: calculateSettlement,
    formatCurrency: formatCurrency,
    initCalculatorForm: initCalculatorForm,
  };
})();
