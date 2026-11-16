/**
 * FairClaimCalculator.com — My Claim tracker logic.
 *
 * Pure functions only (no `document`, no storage): the page keeps the
 * state in the visitor's own browser (localStorage) and calls these to
 * work out progress, follow-up prompts, the next step, a calendar
 * reminder file, and to validate a backup file before importing it.
 *
 * Dates are plain "YYYY-MM-DD" strings, compared as UTC calendar days so
 * the day counts never shift with the visitor's time zone or DST.
 */

export const TRACKER_STORAGE_KEY = "fcc-my-claim";
export const TRACKER_VERSION = 1;

/**
 * Follow-up prompt thresholds, in days. 15 reflects the acknowledgment
 * window in the NAIC Unfair Claims Settlement Practices model, which many
 * states adapt (often as 10–15 days, sometimes working days). It is used
 * only as a "time to follow up" prompt, never stated as the visitor's
 * state law.
 */
export const ACKNOWLEDGE_PROMPT_DAYS = 15;
export const QUIET_PROMPT_DAYS = 14;

export type ClaimKind = "unknown" | "repair" | "total-loss";
export type WhoPays = "unknown" | "own" | "other";
export type LogType = "call" | "email" | "letter" | "other";

export interface ClaimDetails {
  claimNumber: string;
  insurer: string;
  adjusterName: string;
  adjusterPhone: string;
  adjusterEmail: string;
  policyNumber: string;
  dateOfLoss: string;
  dateFiled: string;
  claimKind: ClaimKind;
  whoPays: WhoPays;
  deductible: string;
  offerAmount: string;
}

export interface LogEntry {
  id: string;
  date: string;
  type: LogType;
  who: string;
  note: string;
}

export const STEPS = [
  { key: "reported", label: "Reported the crash where my state requires it", href: "/guides/accident-reporting/" },
  { key: "evidence", label: "Took photos and collected the other driver's details", href: "/forms/accident-information-worksheet/" },
  { key: "filed", label: "Filed the claim with the insurer", href: "/guides/claim-process/first-party-vs-third-party-auto-claims/" },
  { key: "acknowledged", label: "Insurer acknowledged the claim and named an adjuster", href: null },
  { key: "inspected", label: "Car was inspected or photos were reviewed", href: null },
  { key: "estimate", label: "Got the repair estimate or total loss valuation in writing", href: "/guides/total-loss/reading-your-total-loss-valuation-report/" },
  { key: "reviewed", label: "Checked the numbers", href: "/calculators/total-loss-offer-audit/" },
  { key: "responded", label: "Sent a written response, if anything was wrong", href: "/calculators/claim-letter-builder/" },
  { key: "agreed", label: "Agreed on the amount", href: null },
  { key: "paid", label: "Payment received", href: null },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export interface ClaimState {
  version: number;
  claim: ClaimDetails;
  steps: Record<StepKey, boolean>;
  log: LogEntry[];
  updatedAt: string;
}

export function emptyState(): ClaimState {
  return {
    version: TRACKER_VERSION,
    claim: {
      claimNumber: "",
      insurer: "",
      adjusterName: "",
      adjusterPhone: "",
      adjusterEmail: "",
      policyNumber: "",
      dateOfLoss: "",
      dateFiled: "",
      claimKind: "unknown",
      whoPays: "unknown",
      deductible: "",
      offerAmount: "",
    },
    steps: Object.fromEntries(STEPS.map((s) => [s.key, false])) as Record<StepKey, boolean>,
    log: [],
    updatedAt: "",
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Whole calendar days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  if (!isIsoDate(from) || !isIsoDate(to)) throw new Error("Dates must be YYYY-MM-DD.");
  const a = Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10));
  const b = Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

/** Adds days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
  if (!isIsoDate(date)) throw new Error("Dates must be YYYY-MM-DD.");
  const t = new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10) + days));
  return t.toISOString().slice(0, 10);
}

export function progress(state: ClaimState): { done: number; total: number; percent: number } {
  const done = STEPS.filter((s) => state.steps[s.key]).length;
  return { done, total: STEPS.length, percent: Math.round((done / STEPS.length) * 100) };
}

/** Most recent logged contact date, or the filing date if nothing is logged. */
export function lastContactDate(state: ClaimState): string | null {
  const dates = state.log.map((e) => e.date).filter(isIsoDate).sort();
  if (dates.length) return dates[dates.length - 1];
  return isIsoDate(state.claim.dateFiled) ? state.claim.dateFiled : null;
}

export interface Prompt {
  level: "info" | "action";
  text: string;
  href?: string;
  linkText?: string;
}

/** Helpful, non-alarming prompts based on dates and progress. */
export function prompts(state: ClaimState, today: string): Prompt[] {
  const out: Prompt[] = [];
  const { claim, steps } = state;

  if (steps.paid) {
    out.push({ level: "info", text: "Payment received. Keep this record and your documents until any loan, repair or warranty questions are settled." });
    return out;
  }

  if (!isIsoDate(claim.dateFiled)) {
    out.push({ level: "info", text: "Add the date you filed the claim to get follow-up reminders." });
  } else if (!steps.acknowledged) {
    const days = daysBetween(claim.dateFiled, today);
    if (days >= ACKNOWLEDGE_PROMPT_DAYS) {
      out.push({
        level: "action",
        text: `It has been ${days} days since you filed and the claim isn't marked as acknowledged. Many states expect insurers to acknowledge a claim within about ${ACKNOWLEDGE_PROMPT_DAYS} days. Follow up in writing and log it below.`,
        href: "/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/",
        linkText: "When to contact your state insurance department",
      });
    }
  }

  const last = lastContactDate(state);
  if (last && steps.acknowledged) {
    const quiet = daysBetween(last, today);
    if (quiet >= QUIET_PROMPT_DAYS) {
      out.push({
        level: "action",
        text: `No contact logged for ${quiet} days. A short email asking for an update creates a written record. Log it below when you send it.`,
      });
    }
  }

  if (steps.estimate && !steps.reviewed) {
    out.push(
      claim.claimKind === "repair"
        ? { level: "action", text: "You have the estimate. If the car is being repaired, check whether you can claim its lost resale value.", href: "/calculators/diminished-value-baseline/", linkText: "Estimate diminished value" }
        : { level: "action", text: "You have the valuation. Check the numbers before you accept.", href: "/calculators/total-loss-offer-audit/", linkText: "Check the payout and valuation" },
    );
  }

  return out;
}

/** The first unchecked step, with its helper link. */
export function nextStep(state: ClaimState): (typeof STEPS)[number] | null {
  return STEPS.find((s) => !state.steps[s.key]) ?? null;
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** An all-day calendar reminder (.ics) the visitor can add to any calendar app. */
export function buildIcs(opts: { date: string; title: string; description: string; uid: string; stamp: string }): string {
  if (!isIsoDate(opts.date)) throw new Error("Reminder date must be YYYY-MM-DD.");
  const start = opts.date.replace(/-/g, "");
  const end = addDays(opts.date, 1).replace(/-/g, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FairClaimCalculator//My Claim//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${opts.uid}@fairclaimcalculator.com`,
    `DTSTAMP:${opts.stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(opts.title)}`,
    `DESCRIPTION:${icsEscape(opts.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

const str = (v: unknown, max = 2000): string => (typeof v === "string" ? v.slice(0, max) : "");

/**
 * Validates a saved or imported state, keeping only known fields with the
 * right types. Throws if the input isn't a tracker backup at all.
 */
export function parseState(raw: unknown): ClaimState {
  if (!raw || typeof raw !== "object") throw new Error("This file isn't a My Claim backup.");
  const r = raw as Record<string, unknown>;
  if (typeof r.version !== "number" || !r.claim || typeof r.claim !== "object") {
    throw new Error("This file isn't a My Claim backup.");
  }
  const base = emptyState();
  const c = r.claim as Record<string, unknown>;
  const kinds: ClaimKind[] = ["unknown", "repair", "total-loss"];
  const payers: WhoPays[] = ["unknown", "own", "other"];
  const types: LogType[] = ["call", "email", "letter", "other"];

  for (const key of Object.keys(base.claim) as (keyof ClaimDetails)[]) {
    if (key === "claimKind") base.claim.claimKind = kinds.includes(c.claimKind as ClaimKind) ? (c.claimKind as ClaimKind) : "unknown";
    else if (key === "whoPays") base.claim.whoPays = payers.includes(c.whoPays as WhoPays) ? (c.whoPays as WhoPays) : "unknown";
    else base.claim[key] = str(c[key], 200);
  }
  const steps = (r.steps && typeof r.steps === "object" ? r.steps : {}) as Record<string, unknown>;
  for (const s of STEPS) base.steps[s.key] = steps[s.key] === true;
  if (Array.isArray(r.log)) {
    base.log = r.log
      .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
      .slice(0, 500)
      .map((e, i) => ({
        id: str(e.id, 64) || `imported-${i}`,
        date: isIsoDate(str(e.date)) ? str(e.date) : "",
        type: types.includes(e.type as LogType) ? (e.type as LogType) : "other",
        who: str(e.who, 200),
        note: str(e.note, 2000),
      }));
  }
  base.updatedAt = str(r.updatedAt, 40);
  return base;
}
