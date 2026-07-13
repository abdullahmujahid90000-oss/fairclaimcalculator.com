/**
 * FairClaimCalculator.com — site-wide behavior
 * Handles the pre-consent cookie banner. No ad or analytics script
 * on this site should fire until "cookie_consent" = "accepted" is
 * present in localStorage. This satisfies the GDPR/AdSense requirement
 * that consent be collected BEFORE any ad-related cookies are set.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "fcc_cookie_consent"; // "accepted" | "rejected"

  function getConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* localStorage unavailable — banner will just re-show next visit */
    }
  }

  function showBanner() {
    var banner = document.getElementById("cookie-consent-banner");
    if (banner) banner.classList.add("visible");
  }

  function hideBanner() {
    var banner = document.getElementById("cookie-consent-banner");
    if (banner) banner.classList.remove("visible");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var consent = getConsent();

    if (!consent) {
      showBanner();
    }

    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        hideBanner();
        // Ad / analytics scripts should check this flag before loading.
        // e.g. if (localStorage.getItem("fcc_cookie_consent") === "accepted") { loadAdsense(); }
        document.dispatchEvent(new CustomEvent("fcc:consent-accepted"));
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        setConsent("rejected");
        hideBanner();
        document.dispatchEvent(new CustomEvent("fcc:consent-rejected"));
      });
    }
  });

  window.FairClaimConsent = { getConsent: getConsent };
})();
