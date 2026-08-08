/**
 * Client-side GA4 custom-event helper. Fires tool-usage events (which
 * calculator was completed, which letter type was generated, etc.) on top
 * of the automatic pageview tracking already wired in CookieConsent.astro.
 *
 * Safe to call unconditionally, regardless of consent state or whether
 * ANALYTICS_ENABLED is on: CookieConsent.astro defines `window.gtag` as a
 * stub that pushes into `window.dataLayer` on every single page load,
 * before any consent decision and even before the real gtag.js script is
 * requested. Calling gtag("event", ...) here just queues the event; it has
 * no user-visible effect and sends nothing to Google unless the visitor
 * has separately granted analytics consent and the real script has loaded.
 * If ANALYTICS_ENABLED is false, `window.gtag` is never defined at all, so
 * every call below is a no-op guarded by the `typeof` check.
 */

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

/** Fired when a calculator finishes computing and renders its results. */
export function trackCalculatorCompleted(
  calculator:
    | "diminished_value"
    | "total_loss"
    | "settlement_breakdown"
    | "loss_of_use"
    | "salvage_value"
    | "leased_diminished_value",
): void {
  trackEvent("calculator_completed", { calculator });
}

/** Fired when the Claim Letter Builder generates a letter. */
export function trackLetterGenerated(letterType: string): void {
  trackEvent("letter_generated", { letter_type: letterType });
}

export function trackLetterCopied(letterType: string): void {
  trackEvent("letter_copied", { letter_type: letterType });
}

export function trackLetterPrinted(letterType: string): void {
  trackEvent("letter_printed", { letter_type: letterType });
}
