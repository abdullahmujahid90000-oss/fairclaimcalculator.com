/**
 * FairClaimCalculator.com — Total-Loss / ACV Offer Audit
 *
 * Flagship tool (master build prompt §4.2, Modules A-C in §3.3). Helps a
 * vehicle owner check whether an insurer's total-loss valuation report is
 * internally consistent, and compares the insurer's comparable vehicles
 * against the owner's own comps — transparently, without asserting a
 * legally correct ACV. All money math uses integer CENTS internally.
 *
 * This tool does NOT determine what is legally owed. It flags "possible
 * mismatches to verify" and shows arithmetic, nothing more.
 */

(function (root) {
  "use strict";

  var MISMATCH_FIELDS = [
    { key: "vinTrim", label: "VIN and trim level match your vehicle" },
    { key: "drivetrain", label: "Drivetrain, engine, and body configuration match" },
    { key: "options", label: "Factory options and packages match" },
    { key: "mileage", label: "Mileage shown matches your vehicle at the time of loss" },
    { key: "condition", label: "Condition category and deductions seem accurate" },
    { key: "priorDamage", label: "Prior-damage deductions (if any) are explained and justified" },
    { key: "geoRadius", label: "Comparable vehicles come from a reasonable distance" },
    { key: "valuationDate", label: "Valuation date is close to your date of loss" },
    { key: "listingStatus", label: "Comparable listings are clearly dealer/private and currently active" },
    { key: "arithmetic", label: "The math from adjusted comps to the final base value adds up" }
  ];

  var OUTLIER_THRESHOLD_PCT = 0.20; // disclosed heuristic, not a legal/statistical standard

  function toCents(raw, opts) {
    opts = opts || {};
    if (raw === null || raw === undefined || raw === "") return { value: 0, error: null };
    var n = Number(raw);
    if (isNaN(n)) return { value: 0, error: (opts.label || "This field") + " must be a number." };
    if (n < 0) return { value: 0, error: (opts.label || "This field") + " can't be negative." };
    if (n > 10000000) return { value: 0, error: (opts.label || "This field") + " looks too large — please check it." };
    return { value: Math.round(n * 100), error: null };
  }

  function formatUSD(cents) {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  /**
   * Evaluates the mismatch checklist. `statuses` is { [fieldKey]: "correct"|"incorrect"|"unknown"|"not_shown" }.
   * Returns an ordered list of flagged items — "possible mismatch to verify," never an accusation.
   */
  function evaluateMismatches(statuses) {
    var flagged = [];
    MISMATCH_FIELDS.forEach(function (f) {
      var status = statuses[f.key] || "unknown";
      if (status === "incorrect" || status === "unknown" || status === "not_shown") {
        var note =
          status === "incorrect" ? "You marked this as not matching your vehicle — possible mismatch to verify with the insurer." :
          status === "not_shown" ? "The report doesn't show this — ask for the complete report with this field included." :
          "You're not sure — worth confirming before you accept the offer.";
        flagged.push({ key: f.key, label: f.label, status: status, note: note });
      }
    });
    return flagged;
  }

  /**
   * Computes mean/median/min/max/range over a list of {valueCents} comps,
   * and flags indexes that deviate from the median by more than
   * OUTLIER_THRESHOLD_PCT. Returns null if fewer than 1 comp provided.
   */
  function compStats(comps) {
    var values = comps.map(function (c) { return c.valueCents; }).filter(function (v) { return typeof v === "number" && v > 0; });
    if (values.length === 0) return null;

    var sorted = values.slice().sort(function (a, b) { return a - b; });
    var n = sorted.length;
    var median = n % 2 === 1 ? sorted[(n - 1) / 2] : Math.round((sorted[n / 2 - 1] + sorted[n / 2]) / 2);
    var sum = values.reduce(function (a, b) { return a + b; }, 0);
    var mean = Math.round(sum / n);
    var min = sorted[0];
    var max = sorted[n - 1];

    var outlierIndexes = [];
    if (median > 0) {
      comps.forEach(function (c, idx) {
        if (typeof c.valueCents !== "number" || c.valueCents <= 0) return;
        var deviation = Math.abs(c.valueCents - median) / median;
        if (deviation > OUTLIER_THRESHOLD_PCT) outlierIndexes.push(idx);
      });
    }

    return { count: n, meanCents: mean, medianCents: median, minCents: min, maxCents: max, outlierIndexes: outlierIndexes };
  }

  /** Recomputes compStats excluding the given indexes, for a before/after outlier view. */
  function compStatsExcluding(comps, excludeIndexes) {
    var filtered = comps.filter(function (c, idx) { return excludeIndexes.indexOf(idx) === -1; });
    return compStats(filtered);
  }

  /**
   * Combines the insurer's stated ACV with insurer-comp stats and
   * user-comp stats into a plain-language, non-determinative audit view.
   */
  function auditSummary(input) {
    var acv = input.acvCents;
    var insurer = compStats(input.insurerComps || []);
    var user = compStats(input.userComps || []);

    var acvVsInsurerFlag = null;
    if (insurer) {
      if (acv < insurer.minCents || acv > insurer.maxCents) {
        acvVsInsurerFlag = "The insurer's stated ACV (" + formatUSD(acv) + ") falls outside the range of its own comparable vehicles (" + formatUSD(insurer.minCents) + " – " + formatUSD(insurer.maxCents) + "). Worth asking the adjuster to explain how the ACV was derived from these comps.";
      }
    }

    var acvVsUserGapCents = null;
    var acvVsUserNote = null;
    if (user) {
      acvVsUserGapCents = user.medianCents - acv;
      if (Math.abs(acvVsUserGapCents) > 0) {
        acvVsUserNote = acvVsUserGapCents > 0
          ? "Your own comparables suggest a median value " + formatUSD(acvVsUserGapCents) + " higher than the insurer's stated ACV."
          : "Your own comparables suggest a median value " + formatUSD(Math.abs(acvVsUserGapCents)) + " lower than the insurer's stated ACV.";
      }
    }

    return {
      acvCents: acv,
      insurerStats: insurer,
      userStats: user,
      acvVsInsurerFlag: acvVsInsurerFlag,
      acvVsUserGapCents: acvVsUserGapCents,
      acvVsUserNote: acvVsUserNote,
      outlierThresholdPct: OUTLIER_THRESHOLD_PCT
    };
  }

  // ---------- Browser DOM wiring (not exercised by Node sanity tests) ----------

  function readComps(prefix, count, fieldNames) {
    var comps = [];
    for (var i = 1; i <= count; i++) {
      var row = {};
      var hasAny = false;
      fieldNames.forEach(function (fn) {
        var el = document.getElementById(prefix + i + "-" + fn);
        if (el && el.value !== "") hasAny = true;
        row[fn] = el ? el.value : "";
      });
      if (hasAny) comps.push({ index: i, raw: row });
    }
    return comps;
  }

  function buildErrorList(container, errors) {
    if (!container) return;
    container.innerHTML = "";
    if (!errors.length) { container.style.display = "none"; return; }
    var ul = document.createElement("ul");
    errors.forEach(function (msg) {
      var li = document.createElement("li");
      li.textContent = msg;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    container.style.display = "";
  }

  function initTotalLossAuditForm(formId, resultId) {
    if (typeof document === "undefined") return;
    var form = document.getElementById(formId);
    var resultBox = document.getElementById(resultId);
    if (!form || !resultBox) return;
    var errorBox = form.querySelector("[data-field-errors]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = [];

      var acvRes = toCents(form.acv.value, { label: "Insurer's stated ACV" });
      if (form.acv.value === "") errors.push("Insurer's stated ACV is required.");
      if (acvRes.error) errors.push(acvRes.error);

      var statuses = {};
      MISMATCH_FIELDS.forEach(function (f) {
        var el = form["status_" + f.key];
        statuses[f.key] = el ? el.value : "unknown";
      });

      var insurerRawComps = readComps("insurer", 4, ["year", "mileage", "distance", "value"]);
      var userRawComps = readComps("user", 6, ["year", "mileage", "distance", "price"]);

      var insurerComps = [];
      insurerRawComps.forEach(function (row) {
        var res = toCents(row.raw.value, { label: "Insurer comp #" + row.index + " adjusted value" });
        if (res.error) errors.push(res.error);
        insurerComps.push({ valueCents: res.value });
      });

      var userComps = [];
      userRawComps.forEach(function (row) {
        var res = toCents(row.raw.price, { label: "Your comp #" + row.index + " asking price" });
        if (res.error) errors.push(res.error);
        userComps.push({ valueCents: res.value });
      });

      buildErrorList(errorBox, errors);
      if (errors.length) { resultBox.classList.remove("visible"); return; }

      var mismatches = evaluateMismatches(statuses);
      var summary = auditSummary({ acvCents: acvRes.value, insurerComps: insurerComps, userComps: userComps });

      renderResult(resultBox, mismatches, summary, insurerComps, userComps);
    });
  }

  function statBlockHTML(stats, labelPrefix) {
    if (!stats) return "<p>Not enough " + labelPrefix + " comps entered to compute a range — add at least one.</p>";
    var html = "<div class='breakdown'>";
    html += "<div><span>Comps counted</span><span>" + stats.count + "</span></div>";
    html += "<div><span>Mean</span><span>" + formatUSD(stats.meanCents) + "</span></div>";
    html += "<div><span>Median</span><span>" + formatUSD(stats.medianCents) + "</span></div>";
    html += "<div><span>Range</span><span>" + formatUSD(stats.minCents) + " – " + formatUSD(stats.maxCents) + "</span></div>";
    html += "</div>";
    if (stats.outlierIndexes.length) {
      html += "<p style='font-size:0.85rem;color:#92400e;margin-top:6px;'>⚠ " + stats.outlierIndexes.length + " comp(s) flagged as possible outlier(s) — more than 20% away from the median (a simple disclosed heuristic, not a legal or statistical standard).</p>";
    }
    return html;
  }

  function renderResult(resultBox, mismatches, summary, insurerComps, userComps) {
    var mismatchEl = resultBox.querySelector("[data-mismatches]");
    var insurerStatsEl = resultBox.querySelector("[data-insurer-stats]");
    var userStatsEl = resultBox.querySelector("[data-user-stats]");
    var flagsEl = resultBox.querySelector("[data-flags]");
    var summaryEl = resultBox.querySelector(".range");

    summaryEl.textContent = "Insurer's stated ACV: " + formatUSD(summary.acvCents);

    mismatchEl.innerHTML = "";
    if (mismatches.length === 0) {
      mismatchEl.innerHTML = "<p>No fields flagged — you marked every checked item as correct.</p>";
    } else {
      var ul = document.createElement("ul");
      mismatches.forEach(function (m) {
        var li = document.createElement("li");
        li.innerHTML = "<strong>" + m.label + ".</strong> " + m.note;
        ul.appendChild(li);
      });
      mismatchEl.appendChild(ul);
    }

    insurerStatsEl.innerHTML = statBlockHTML(summary.insurerStats, "insurer");
    userStatsEl.innerHTML = statBlockHTML(summary.userStats, "your");

    flagsEl.innerHTML = "";
    var flagLines = [];
    if (summary.acvVsInsurerFlag) flagLines.push(summary.acvVsInsurerFlag);
    if (summary.acvVsUserNote) flagLines.push(summary.acvVsUserNote);
    if (flagLines.length === 0) {
      flagsEl.innerHTML = "<p>No internal-consistency flags based on the numbers entered.</p>";
    } else {
      flagLines.forEach(function (line) {
        var p = document.createElement("p");
        p.style.color = "#92400e";
        p.style.fontWeight = "600";
        p.textContent = "⚠ " + line;
        flagsEl.appendChild(p);
      });
    }

    resultBox.classList.add("visible");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  var api = {
    MISMATCH_FIELDS: MISMATCH_FIELDS,
    toCents: toCents,
    formatUSD: formatUSD,
    evaluateMismatches: evaluateMismatches,
    compStats: compStats,
    compStatsExcluding: compStatsExcluding,
    auditSummary: auditSummary,
    initTotalLossAuditForm: initTotalLossAuditForm
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.FairClaim = root.FairClaim || {};
    for (var k in api) { root.FairClaim[k] = api[k]; }
  }
})(typeof window !== "undefined" ? window : null);
