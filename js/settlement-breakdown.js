/**
 * FairClaimCalculator.com — Settlement Check Breakdown
 *
 * Answers one question: "How did the insurer get from my vehicle's value
 * to the number on my check?" This is an organizing/arithmetic tool, not a
 * legal determination of what is owed. All money math is done in integer
 * CENTS internally and only formatted to USD at display time, per the
 * project's calculation-engineering standard (see BUILD-LOG.md / the
 * master build prompt §10.4). No hidden weights: every step below is
 * visible in the returned breakdown array.
 *
 * Waterfall model (documented assumptions — shown to the user, not hidden):
 *   1. Start: insurer's stated ACV / base vehicle value.
 *   2. + Sales tax / fees the insurer says it is adding on top (optional;
 *      whether a state requires this varies and is NOT guessed here).
 *   3. - Deductible (first-party claims only; third-party claims generally
 *      don't have the claimant's own deductible applied).
 *   4. = Gross settlement.
 *   5. Of the gross settlement, the lienholder is paid first, up to the
 *      loan/lease payoff amount. Any shortfall (payoff > gross settlement)
 *      is shown separately as a potential GAP scenario, NOT folded into the
 *      totals below, because GAP is typically a separate claim to a
 *      separate provider with its own terms and exclusions.
 *   6. - Salvage deduction, only if the owner is retaining the wrecked
 *      vehicle (this reduces what's left for the owner, not the
 *      lienholder payoff).
 *   7. - Any prior partial payment already received.
 *   8. = Net to owner / Net to lienholder.
 *
 * If the user supplies what the insurer actually told them the check
 * would be, this tool compares it to the computed net-to-owner figure and
 * flags a mismatch beyond a 1-cent-rounding tolerance — it does not
 * accuse anyone of an error, it says "ask your adjuster to explain."
 */

(function (root) {
  "use strict";

  var CENTS_TOLERANCE = 100; // $1.00 — avoid flagging trivial rounding as a "mismatch"

  /**
   * Parses a user-entered dollar string into integer cents.
   * Returns { value, error } — error is a string if the input is invalid
   * for the given field, so callers can reject impossible inputs with a
   * specific message rather than silently clamping them.
   */
  function toCents(raw, opts) {
    opts = opts || {};
    if (raw === null || raw === undefined || raw === "") {
      return { value: 0, error: null };
    }
    var n = Number(raw);
    if (isNaN(n)) {
      return { value: 0, error: (opts.label || "This field") + " must be a number." };
    }
    if (n < 0) {
      return { value: 0, error: (opts.label || "This field") + " can't be negative." };
    }
    if (n > 10000000) {
      // $10,000,000 — generous ceiling; catches fat-finger/placeholder values.
      return { value: 0, error: (opts.label || "This field") + " looks too large — please check it." };
    }
    return { value: Math.round(n * 100), error: null };
  }

  function formatUSD(cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function formatSignedUSD(cents) {
    if (cents > 0) return "+" + formatUSD(cents);
    if (cents < 0) return "−" + formatUSD(Math.abs(cents));
    return formatUSD(0);
  }

  /**
   * Core calculation. All *Cents inputs must already be validated,
   * non-negative integers (use toCents() first).
   *
   * @param {Object} i
   * @param {number} i.acvCents - required, insurer's stated ACV/base value
   * @param {number} i.taxFeesCents
   * @param {("first-party"|"third-party")} i.claimType
   * @param {number} i.deductibleCents
   * @param {boolean} i.hasLoan
   * @param {number} i.loanPayoffCents
   * @param {boolean} i.hasGap
   * @param {boolean} i.retainingSalvage
   * @param {number} i.salvageDeductionCents
   * @param {number} i.priorPaymentCents
   * @param {number|null} i.statedCheckCents - optional, what insurer said the check would be
   * @returns {Object} result
   */
  function calculateSettlementBreakdown(i) {
    var acv = i.acvCents || 0;
    var taxFees = i.taxFeesCents || 0;
    var deductible = i.claimType === "first-party" ? (i.deductibleCents || 0) : 0;
    var loanPayoff = i.hasLoan ? (i.loanPayoffCents || 0) : 0;
    var salvageDeduction = i.retainingSalvage ? (i.salvageDeductionCents || 0) : 0;
    var priorPayment = i.priorPaymentCents || 0;

    var rows = [];

    rows.push({ key: "acv", label: "Insurer's stated ACV / base vehicle value", amountCents: acv, kind: "add" });

    if (taxFees > 0) {
      rows.push({ key: "taxFees", label: "Sales tax / fees insurer added on top", amountCents: taxFees, kind: "add" });
    }

    if (deductible > 0) {
      rows.push({ key: "deductible", label: "Your deductible (first-party claim)", amountCents: -deductible, kind: "subtract" });
    }

    var grossSettlement = acv + taxFees - deductible;
    var grossSettlementFlag = null;
    if (grossSettlement < 0) {
      grossSettlementFlag = "Your deductible is larger than the stated ACV plus fees — that shouldn't happen. Ask the insurer to explain.";
      grossSettlement = 0;
    }

    rows.push({ key: "grossSettlement", label: "Gross settlement (before loan payoff)", amountCents: grossSettlement, kind: "subtotal" });

    var toLienholder = 0;
    var shortfall = 0;
    if (i.hasLoan) {
      toLienholder = Math.min(grossSettlement, loanPayoff);
      shortfall = Math.max(0, loanPayoff - grossSettlement);
      rows.push({ key: "toLienholder", label: "Paid to lienholder toward loan/lease payoff", amountCents: -toLienholder, kind: "subtract" });
    }

    if (salvageDeduction > 0) {
      rows.push({ key: "salvage", label: "Salvage deduction (you're keeping the vehicle)", amountCents: -salvageDeduction, kind: "subtract" });
    }

    if (priorPayment > 0) {
      rows.push({ key: "priorPayment", label: "Prior partial payment already received", amountCents: -priorPayment, kind: "subtract" });
    }

    var netToOwner = grossSettlement - toLienholder - salvageDeduction - priorPayment;
    var netToLienholder = toLienholder;

    var gapNote = null;
    if (i.hasLoan && i.hasGap) {
      if (shortfall > 0) {
        gapNote = {
          amountCents: shortfall,
          text: "Potential GAP scenario amount: " + formatUSD(shortfall) + ". This is NOT included in the totals above — GAP is typically a separate claim to a separate provider, with its own exclusions (fees, prior negative equity, and insurance-required coverage gaps can all reduce what GAP actually pays). Verify this against your GAP certificate or provider."
        };
      } else {
        gapNote = {
          amountCents: 0,
          text: "Based on the numbers entered, the loan payoff doesn't exceed the gross settlement, so there's no shortfall for GAP to cover under this simple math — but GAP terms vary, so confirm with your provider if you expected a payout."
        };
      }
    }

    var comparison = null;
    if (i.statedCheckCents !== null && i.statedCheckCents !== undefined) {
      var diff = i.statedCheckCents - netToOwner;
      if (Math.abs(diff) <= CENTS_TOLERANCE) {
        comparison = { status: "match", diffCents: diff, text: "Math checks out — the insurer's stated check is within a rounding difference of this breakdown." };
      } else {
        comparison = {
          status: "mismatch",
          diffCents: diff,
          text: "Possible arithmetic mismatch of " + formatUSD(Math.abs(diff)) + " (insurer's stated check is " + (diff > 0 ? "higher" : "lower") + " than this breakdown). Ask your adjuster to walk through the difference line by line before you accept the check."
        };
      }
    }

    return {
      rows: rows,
      grossSettlementCents: grossSettlement,
      grossSettlementFlag: grossSettlementFlag,
      netToOwnerCents: netToOwner,
      netToLienholderCents: netToLienholder,
      hasLoan: !!i.hasLoan,
      gapNote: gapNote,
      comparison: comparison
    };
  }

  /**
   * Wires up the Settlement Check Breakdown form: conditional field
   * visibility, validation, calculation, and rendering the waterfall.
   * Browser-only (uses `document`) — not exercised by the Node sanity
   * tests, which call calculateSettlementBreakdown() directly instead.
   */
  function initSettlementBreakdownForm(formId, resultId) {
    if (typeof document === "undefined") return;
    var form = document.getElementById(formId);
    var resultBox = document.getElementById(resultId);
    if (!form || !resultBox) return;

    var deductibleGroup = form.querySelector("[data-field-group='deductible']");
    var loanGroup = form.querySelector("[data-field-group='loan']");
    var gapGroup = form.querySelector("[data-field-group='gap']");
    var salvageGroup = form.querySelector("[data-field-group='salvage']");
    var errorBox = form.querySelector("[data-field-errors]");

    function syncVisibility() {
      var claimType = form.claimType.value;
      var hasLoan = form.hasLoan.value === "yes";
      var retainingSalvage = form.retainingSalvage.value === "yes";

      if (deductibleGroup) deductibleGroup.style.display = claimType === "first-party" ? "" : "none";
      if (loanGroup) loanGroup.style.display = hasLoan ? "" : "none";
      if (gapGroup) gapGroup.style.display = hasLoan ? "" : "none";
      if (salvageGroup) salvageGroup.style.display = retainingSalvage ? "" : "none";
    }

    form.claimType.addEventListener("change", syncVisibility);
    form.hasLoan.addEventListener("change", syncVisibility);
    form.retainingSalvage.addEventListener("change", syncVisibility);
    syncVisibility();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var errors = [];
      function field(name, label) {
        var res = toCents(form[name] ? form[name].value : "", { label: label });
        if (res.error) errors.push(res.error);
        return res.value;
      }

      var acvRes = toCents(form.acv.value, { label: "Insurer's stated ACV" });
      if (form.acv.value === "" ) errors.push("Insurer's stated ACV is required.");
      if (acvRes.error) errors.push(acvRes.error);
      var acvCents = acvRes.value;

      var taxFeesCents = field("taxFees", "Tax/fees added");
      var claimType = form.claimType.value;
      var deductibleCents = field("deductible", "Deductible");
      var hasLoan = form.hasLoan.value === "yes";
      var loanPayoffCents = field("loanPayoff", "Loan payoff");
      var hasGap = form.hasGap ? form.hasGap.value === "yes" : false;
      var retainingSalvage = form.retainingSalvage.value === "yes";
      var salvageDeductionCents = field("salvageDeduction", "Salvage deduction");
      var priorPaymentCents = field("priorPayment", "Prior payment already received");

      var statedCheckCents = null;
      if (form.statedCheck && form.statedCheck.value !== "") {
        var scRes = toCents(form.statedCheck.value, { label: "Stated check amount" });
        if (scRes.error) errors.push(scRes.error);
        statedCheckCents = scRes.value;
      }

      if (errorBox) {
        errorBox.innerHTML = "";
        if (errors.length) {
          var list = document.createElement("ul");
          errors.forEach(function (msg) {
            var li = document.createElement("li");
            li.textContent = msg;
            list.appendChild(li);
          });
          errorBox.appendChild(list);
          errorBox.style.display = "";
        } else {
          errorBox.style.display = "none";
        }
      }

      if (errors.length) {
        resultBox.classList.remove("visible");
        return;
      }

      var result = calculateSettlementBreakdown({
        acvCents: acvCents,
        taxFeesCents: taxFeesCents,
        claimType: claimType,
        deductibleCents: deductibleCents,
        hasLoan: hasLoan,
        loanPayoffCents: loanPayoffCents,
        hasGap: hasGap,
        retainingSalvage: retainingSalvage,
        salvageDeductionCents: salvageDeductionCents,
        priorPaymentCents: priorPaymentCents,
        statedCheckCents: statedCheckCents
      });

      renderResult(resultBox, result);
    });
  }

  function renderResult(resultBox, result) {
    var rangeEl = resultBox.querySelector(".range");
    var breakdownEl = resultBox.querySelector(".breakdown");
    var statusEl = resultBox.querySelector("[data-status]");
    var gapEl = resultBox.querySelector("[data-gap-note]");

    rangeEl.textContent = "Net to you: " + formatUSD(result.netToOwnerCents) +
      (result.hasLoan ? " · Net to lienholder: " + formatUSD(result.netToLienholderCents) : "");

    breakdownEl.innerHTML = "";
    result.rows.forEach(function (row) {
      var div = document.createElement("div");
      if (row.kind === "subtotal") div.style.fontWeight = "700";
      var l = document.createElement("span");
      l.textContent = row.label;
      var v = document.createElement("span");
      v.textContent = row.kind === "subtotal" ? formatUSD(row.amountCents) : formatSignedUSD(row.amountCents);
      div.appendChild(l);
      div.appendChild(v);
      breakdownEl.appendChild(div);
    });

    if (result.grossSettlementFlag) {
      var flagDiv = document.createElement("div");
      flagDiv.style.color = "#92400e";
      flagDiv.style.fontWeight = "600";
      flagDiv.textContent = "⚠ " + result.grossSettlementFlag;
      breakdownEl.appendChild(flagDiv);
    }

    if (statusEl) {
      if (result.comparison) {
        statusEl.style.display = "";
        statusEl.textContent = result.comparison.status === "match" ? "✓ " + result.comparison.text : "⚠ " + result.comparison.text;
        statusEl.style.color = result.comparison.status === "match" ? "#0f3d21" : "#92400e";
      } else {
        statusEl.style.display = "none";
      }
    }

    if (gapEl) {
      if (result.gapNote) {
        gapEl.style.display = "";
        gapEl.textContent = result.gapNote.text;
      } else {
        gapEl.style.display = "none";
      }
    }

    resultBox.classList.add("visible");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  var api = {
    toCents: toCents,
    formatUSD: formatUSD,
    formatSignedUSD: formatSignedUSD,
    calculateSettlementBreakdown: calculateSettlementBreakdown,
    initSettlementBreakdownForm: initSettlementBreakdownForm
  };

  // Dual browser/Node export (Node used only for local sanity-testing this
  // file before shipping — see BUILD-LOG.md session notes). No bundler
  // required in the browser: `module` is simply undefined there.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.FairClaim = root.FairClaim || {};
    for (var k in api) {
      root.FairClaim[k] = api[k];
    }
  }
})(typeof window !== "undefined" ? window : null);
