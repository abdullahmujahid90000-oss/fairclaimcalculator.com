/* ============================================================
   FairClaimCalculator.com — Diminished-Value Baseline &
   Market Evidence Worksheet calculation engine.

   Produces TWO separate outputs and never averages them:
     1. calculate17cBaseline() — a transparent insurer-style
        "17c" baseline (10% cap x damage multiplier x mileage
        multiplier), shown with every substituted number.
     2. evaluateMarketEvidence() — plain mean/median/range for
        user-entered clean-history vs. accident-history comps.

   Source note on the 17c multiplier table (config version 1.0,
   last reviewed July 2026): this is the commonly-published
   description of the insurer-style formula that traces back to
   a 2002 Muscogee County, Georgia class-settlement order
   (Mabry v. State Farm litigation) — compiled here from
   secondary consumer-education sources, not re-verified against
   the original settlement order text or any single insurer's
   internal worksheet. It is not a state or national legal
   standard, and the Georgia Office of Insurance and Safety Fire
   Commissioner (Directive 08-P&C-2, Dec. 2008) has stated no
   formula was ever approved as determinative. Treat this
   baseline as a labeled comparison reference, never as "the"
   correct diminished-value figure. See PHASE-0-RESEARCH.md §2
   for the full sourcing note (internal file, not published).

   Dual export: works as a browser global (window.FairClaim) and
   as a Node module, so the math can be sanity-tested with
   `node -e "require('./js/diminished-value-baseline.js')..."`
   before ever being wired into a page.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FairClaim = root.FairClaim || {};
    var mod = factory();
    for (var k in mod) { if (mod.hasOwnProperty(k)) root.FairClaim[k] = mod[k]; }
  }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var DV_CONFIG = {
    version: "1.0",
    reviewedDate: "July 2026",
    baseCapPct: 0.10,
    damageMultipliers: [
      { key: "severe",   label: "Severe — structural or frame damage",                     value: 1.00 },
      { key: "major",    label: "Major — structural work plus multiple panels replaced",    value: 0.75 },
      { key: "moderate", label: "Moderate — some structural work and panel replacement",    value: 0.50 },
      { key: "minor",    label: "Minor — panel damage only, no structural involvement",      value: 0.25 },
      { key: "none",     label: "Cosmetic only — fully repaired, no structural damage",      value: 0.00 }
    ],
    mileageBands: [
      { max: 19999,    value: 1.00, label: "0 – 19,999 miles" },
      { max: 39999,    value: 0.80, label: "20,000 – 39,999 miles" },
      { max: 59999,    value: 0.60, label: "40,000 – 59,999 miles" },
      { max: 79999,    value: 0.40, label: "60,000 – 79,999 miles" },
      { max: 99999,    value: 0.20, label: "80,000 – 99,999 miles" },
      { max: Infinity, value: 0.00, label: "100,000+ miles" }
    ],
    maxPlausibleMiles: 400000,
    maxPlausibleValueCents: 500000000, // $5,000,000 sanity ceiling
    sourceNote: "Commonly-published version of the insurer-style “17c” formula, compiled from secondary consumer-education sources describing the 2002 Muscogee County, Georgia class-settlement order. Not re-verified against the original order text or any specific insurer's internal worksheet. Not a state or national legal standard — Georgia's insurance regulator has stated no such formula was ever approved as determinative."
  };

  function toCents(raw, label) {
    if (raw === "" || raw === null || typeof raw === "undefined") return null;
    var n = Number(raw);
    if (typeof raw === "string" && raw.trim() === "") return null;
    if (isNaN(n) || !isFinite(n)) {
      throw new Error((label || "Value") + " must be a number.");
    }
    if (n < 0) {
      throw new Error((label || "Value") + " cannot be negative.");
    }
    return Math.round(n * 100);
  }

  function formatUSD(cents) {
    if (cents === null || typeof cents === "undefined" || isNaN(cents)) return "—";
    var sign = cents < 0 ? "-" : "";
    var abs = Math.abs(Math.round(cents));
    var dollars = Math.floor(abs / 100);
    var remainder = abs % 100;
    var dollarsStr = dollars.toLocaleString("en-US");
    return sign + "$" + dollarsStr + "." + (remainder < 10 ? "0" + remainder : remainder);
  }

  function getDamageMultiplier(key) {
    for (var i = 0; i < DV_CONFIG.damageMultipliers.length; i++) {
      if (DV_CONFIG.damageMultipliers[i].key === key) return DV_CONFIG.damageMultipliers[i];
    }
    return null;
  }

  function getMileageBand(miles) {
    for (var i = 0; i < DV_CONFIG.mileageBands.length; i++) {
      if (miles <= DV_CONFIG.mileageBands[i].max) return DV_CONFIG.mileageBands[i];
    }
    return DV_CONFIG.mileageBands[DV_CONFIG.mileageBands.length - 1];
  }

  function calculate17cBaseline(input) {
    input = input || {};

    var preAccidentValueCents = toCents(input.preAccidentValue, "Pre-accident value");
    if (preAccidentValueCents === null) {
      throw new Error("Enter the vehicle's pre-accident value to calculate a baseline.");
    }
    if (preAccidentValueCents === 0) {
      throw new Error("Pre-accident value must be greater than zero.");
    }
    if (preAccidentValueCents > DV_CONFIG.maxPlausibleValueCents) {
      throw new Error("Pre-accident value entered is above a plausible vehicle value — please double-check the number.");
    }

    var milesRaw = input.mileage;
    if (milesRaw === "" || milesRaw === null || typeof milesRaw === "undefined") {
      throw new Error("Enter the vehicle's mileage at the time of loss.");
    }
    var miles = Number(milesRaw);
    if (isNaN(miles) || !isFinite(miles)) {
      throw new Error("Mileage must be a number.");
    }
    if (miles < 0) {
      throw new Error("Mileage cannot be negative.");
    }
    if (miles > DV_CONFIG.maxPlausibleMiles) {
      throw new Error("Mileage entered is above a plausible odometer reading — please double-check the number.");
    }

    var damage = getDamageMultiplier(input.damageCategory);
    if (!damage) {
      throw new Error("Select a damage category.");
    }

    var mileageBand = getMileageBand(miles);

    var baseCapCents = Math.round(preAccidentValueCents * DV_CONFIG.baseCapPct);
    var afterDamageCents = Math.round(baseCapCents * damage.value);
    var resultCents = Math.round(afterDamageCents * mileageBand.value);

    return {
      preAccidentValueCents: preAccidentValueCents,
      baseCapPct: DV_CONFIG.baseCapPct,
      baseCapCents: baseCapCents,
      damageKey: damage.key,
      damageLabel: damage.label,
      damageMultiplier: damage.value,
      afterDamageCents: afterDamageCents,
      mileageLabel: mileageBand.label,
      mileageMultiplier: mileageBand.value,
      resultCents: resultCents,
      configVersion: DV_CONFIG.version,
      reviewedDate: DV_CONFIG.reviewedDate,
      sourceNote: DV_CONFIG.sourceNote
    };
  }

  function statsForCentsList(list) {
    var valid = list.filter(function (v) { return typeof v === "number" && isFinite(v) && v > 0; });
    if (valid.length === 0) return null;
    var sorted = valid.slice().sort(function (a, b) { return a - b; });
    var sum = sorted.reduce(function (a, b) { return a + b; }, 0);
    var mean = Math.round(sum / sorted.length);
    var mid = Math.floor(sorted.length / 2);
    var median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    return {
      count: sorted.length,
      meanCents: mean,
      medianCents: median,
      minCents: sorted[0],
      maxCents: sorted[sorted.length - 1]
    };
  }

  function pricesToCents(comps) {
    return (comps || [])
      .map(function (c) {
        if (!c || c.price === "" || c.price === null || typeof c.price === "undefined") return null;
        var n = Number(c.price);
        if (isNaN(n) || !isFinite(n) || n <= 0) return null;
        return Math.round(n * 100);
      })
      .filter(function (v) { return v !== null; });
  }

  function evaluateMarketEvidence(cleanComps, accidentComps) {
    var cleanStats = statsForCentsList(pricesToCents(cleanComps));
    var accidentStats = statsForCentsList(pricesToCents(accidentComps));

    var gapCents = null;
    if (cleanStats && accidentStats) {
      gapCents = cleanStats.medianCents - accidentStats.medianCents;
    }

    return {
      cleanStats: cleanStats,
      accidentStats: accidentStats,
      gapCents: gapCents,
      hasEnoughEvidence: !!(cleanStats && accidentStats)
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function row(label, value, strong) {
    return "<div" + (strong ? " style=\"font-weight:700;border-top:1px solid var(--color-border);padding-top:8px;margin-top:4px;\"" : "") +
      "><span>" + label + "</span><span>" + value + "</span></div>";
  }

  var CONTEXT_LABELS = {
    structural: "Structural/frame damage confirmed",
    airbag: "Airbags deployed",
    panelCount: "Panels replaced",
    priorDamage: "Prior accident/damage history",
    repairsComplete: "Repairs complete",
    claimState: "State",
    claimRelationship: "Claim relationship"
  };

  var YES_NO_UNKNOWN_LABELS = {
    yes: "Yes",
    no: "No",
    unknown: "Not sure",
    "first-party": "My own insurer (first-party)",
    "third-party": "Another driver's insurer (third-party)"
  };

  function renderContext(resultBox, context) {
    var c = resultBox.querySelector("[data-context]");
    if (!c) return;
    var rows = "";
    var keys = ["structural", "airbag", "panelCount", "priorDamage", "repairsComplete", "claimState", "claimRelationship"];
    keys.forEach(function (key) {
      var raw = context[key];
      if (raw === "" || raw === null || typeof raw === "undefined") return;
      var display = YES_NO_UNKNOWN_LABELS.hasOwnProperty(raw) ? YES_NO_UNKNOWN_LABELS[raw] : escapeHtml(raw);
      rows += row(CONTEXT_LABELS[key], display);
    });
    c.innerHTML = rows ? "<div class=\"breakdown\">" + rows + "</div>" : "<p>No claim-context fields were filled in.</p>";
  }

  function renderResult(resultBox, baseline, market, valueSource) {
    var b = resultBox.querySelector("[data-baseline]");
    if (b) {
      b.innerHTML = "<div class=\"breakdown\">" +
        row("Pre-accident value" + (valueSource ? " (" + escapeHtml(valueSource) + ")" : ""), formatUSD(baseline.preAccidentValueCents)) +
        row("Base loss assumption (10% cap)", formatUSD(baseline.preAccidentValueCents) + " × 10% = " + formatUSD(baseline.baseCapCents)) +
        row("Damage severity modifier — " + baseline.damageLabel, formatUSD(baseline.baseCapCents) + " × " + baseline.damageMultiplier.toFixed(2) + " = " + formatUSD(baseline.afterDamageCents)) +
        row("Mileage modifier — " + baseline.mileageLabel, formatUSD(baseline.afterDamageCents) + " × " + baseline.mileageMultiplier.toFixed(2) + " = " + formatUSD(baseline.resultCents)) +
        row("17c insurer-style baseline result", formatUSD(baseline.resultCents), true) +
        "</div>";
    }

    var m = resultBox.querySelector("[data-market]");
    if (m) {
      if (!market.cleanStats && !market.accidentStats) {
        m.innerHTML = "<p>No market evidence entered yet. Collect at least two or three comparable listings in each category below, then re-run this worksheet:</p>" +
          "<ul><li>Same year, make, model, and similar trim</li><li>Similar mileage (within roughly 10–15%)</li><li>Similar geographic market</li><li>One group with no accident history, one group with disclosed accident history</li></ul>";
      } else {
        var out = "<div class=\"breakdown\">";
        if (market.cleanStats) {
          out += "<h4 style=\"margin:10px 0 4px;\">Clean-history comparables (n=" + market.cleanStats.count + ")</h4>" +
            row("Median", formatUSD(market.cleanStats.medianCents)) +
            row("Mean", formatUSD(market.cleanStats.meanCents)) +
            row("Range", formatUSD(market.cleanStats.minCents) + " – " + formatUSD(market.cleanStats.maxCents));
        } else {
          out += "<p>No clean-history comparables entered yet.</p>";
        }
        if (market.accidentStats) {
          out += "<h4 style=\"margin:14px 0 4px;\">Accident-history comparables (n=" + market.accidentStats.count + ")</h4>" +
            row("Median", formatUSD(market.accidentStats.medianCents)) +
            row("Mean", formatUSD(market.accidentStats.meanCents)) +
            row("Range", formatUSD(market.accidentStats.minCents) + " – " + formatUSD(market.accidentStats.maxCents));
        } else {
          out += "<p>No accident-history comparables entered yet.</p>";
        }
        if (market.hasEnoughEvidence) {
          out += "<h4 style=\"margin:14px 0 4px;\">Evidence gap</h4>" +
            row("Clean median − accident median", formatUSD(market.gapCents), true) +
            "<p class=\"section-note\">This is a difference between your two comp groups' medians — not a legal diminished-value figure, and not something to average with the 17c baseline above.</p>";
        }
        out += "</div>";
        m.innerHTML = out;
      }
    }
  }

  function initDVBaselineForm(formId, resultId) {
    var form = document.getElementById(formId);
    var resultBox = document.getElementById(resultId);
    if (!form || !resultBox) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errorsBox = form.querySelector("[data-field-errors]");
      if (errorsBox) { errorsBox.style.display = "none"; errorsBox.innerHTML = ""; }

      var fd = new FormData(form);
      var baseline;
      try {
        baseline = calculate17cBaseline({
          preAccidentValue: fd.get("preAccidentValue"),
          mileage: fd.get("mileage"),
          damageCategory: fd.get("damageCategory")
        });
      } catch (err) {
        if (errorsBox) {
          errorsBox.style.display = "block";
          errorsBox.innerHTML = "<strong>Please fix the following:</strong><div>" + err.message + "</div>";
        }
        resultBox.classList.remove("visible");
        return;
      }

      var cleanComps = [];
      var accidentComps = [];
      for (var i = 1; i <= 4; i++) {
        var cp = fd.get("clean" + i + "-price");
        if (cp) cleanComps.push({ price: cp });
        var ap = fd.get("accident" + i + "-price");
        if (ap) accidentComps.push({ price: ap });
      }
      var market = evaluateMarketEvidence(cleanComps, accidentComps);

      renderContext(resultBox, {
        structural: fd.get("structural"),
        airbag: fd.get("airbag"),
        panelCount: fd.get("panelCount"),
        priorDamage: fd.get("priorDamage"),
        repairsComplete: fd.get("repairsComplete"),
        claimState: fd.get("claimState"),
        claimRelationship: fd.get("claimRelationship")
      });
      renderResult(resultBox, baseline, market, fd.get("valueSource"));
      resultBox.classList.add("visible");
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return {
    DV_CONFIG: DV_CONFIG,
    toCents: toCents,
    formatUSD: formatUSD,
    getDamageMultiplier: getDamageMultiplier,
    getMileageBand: getMileageBand,
    calculate17cBaseline: calculate17cBaseline,
    evaluateMarketEvidence: evaluateMarketEvidence,
    initDVBaselineForm: initDVBaselineForm
  };
}));
