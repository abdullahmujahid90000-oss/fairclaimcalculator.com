/**
 * How to get a copy of a crash report, state by state.
 *
 * Each entry was checked on 2026-11-20 against the state agency page named in
 * `sourceUrl` (fees as published there; where the agency did not publish a
 * current fee, `cost` says so instead of guessing). States without an entry
 * show a short pointer to the responding police agency instead. Add states
 * here one at a time, each with its own official source.
 */

export interface CrashReportCopy {
  /** Where and how to order, in plain English. */
  how: string;
  /** Cost as published by the agency, or a note that it must be confirmed. */
  cost: string;
  /** Anything that trips people up: waiting periods, who may order, ID. */
  notes?: string[];
  sourceUrl: string;
  sourceLabel: string;
}

export const CRASH_REPORT_COPIES_CHECKED = "2026-11-20";

export const CRASH_REPORT_COPIES: Record<string, CrashReportCopy> = {
  California: {
    how: "For a crash the California Highway Patrol handled, fill in form CHP 190 and hand it in or mail it to the CHP Area office that took the report. For a city police or sheriff's report, ask that department.",
    cost: "A reproduction fee based on the report's length; CHP lists $10 for 1 to 25 pages.",
    notes: [
      "Only a \"proper party of interest\" can get a copy: the drivers, vehicle owners, injured people, and their insurers or attorneys.",
      "Attach a copy of your driver's license or ID card, or have the form notarized.",
    ],
    sourceUrl: "https://www.chp.ca.gov/traffic/request-a-collision-report",
    sourceLabel: "California Highway Patrol — Request a Collision Report",
  },
  Texas: {
    how: "Buy the Texas Peace Officer's Crash Report (CR-3) online through TxDOT's Crash Report Online Purchase System. The report is emailed to you.",
    cost: "$6 for a regular copy, $8 for a certified copy (needed for court or other legal use).",
    notes: ["Avoid third-party \"report finder\" sites that charge far more for the same report."],
    sourceUrl: "https://www.txdot.gov/data-maps/crash-reports-records.html",
    sourceLabel: "Texas Department of Transportation — Crash reports and records",
  },
  Florida: {
    how: "Buy it online through the Florida Crash Portal run by the Department of Highway Safety and Motor Vehicles (FLHSMV).",
    cost: "$10 per report plus a $2 convenience fee per transaction, as set by Florida law.",
    notes: [
      "Florida keeps crash reports confidential for 60 days. In that window only the people involved, their attorneys and insurers, and a few others can get a copy, and you sign a sworn statement (form HSMV 94010).",
      "A report can take up to about 10 days to appear online.",
    ],
    sourceUrl: "https://services.flhsmv.gov/CrashReportPurchasing/",
    sourceLabel: "FLHSMV — Florida's Official Crash Portal",
  },
  "New York": {
    how: "Order it from the New York DMV online, or by mail with form MV-198C. For a New York City crash in the last 30 days, ask the NYPD instead.",
    cost: "Online: a $7 search fee plus $15 per report. The search fee is charged even if no report is found.",
    sourceUrl: "https://dmv.ny.gov/records/order-and-access-motor-vehicle-accident-reports",
    sourceLabel: "New York DMV — Order and access motor vehicle accident reports",
  },
  Pennsylvania: {
    how: "For a Pennsylvania State Police report, request it online through PSP's crash report site or by mail with form SP 7-0015. For a local police report, ask that department.",
    cost: "$22 per report.",
    notes: [
      "Reports become available 15 days after the crash; don't apply sooner.",
      "Online requests are approved by email first, then you pay.",
    ],
    sourceUrl: "https://www.pa.gov/services/psp/request-a-copy-of-a-vehicle-crash-report.html",
    sourceLabel: "Pennsylvania State Police — Request a copy of a vehicle crash report",
  },
  Illinois: {
    how: "For an Illinois State Police report, buy it through ISP's E-Pay crash report service; a redacted copy is emailed to you. For a local police report, ask that department.",
    cost: "$5 statutory fee plus a card service fee (2.35%, $1 minimum). Crash reconstruction reports cost $20 and must be requested by mail.",
    notes: ["Expect the email about 10 days after you order."],
    sourceUrl: "https://isp.illinois.gov/CrashReports/EPay",
    sourceLabel: "Illinois State Police — Crash reports E-Pay",
  },
  Ohio: {
    how: "Many Ohio agencies send crash reports to the Ohio Department of Public Safety's online crash retrieval system, where you can search by report number, last name or crash date. If yours isn't there, ask the police department that responded.",
    cost: "Often free online; some agencies charge a small fee. Check before paying.",
    notes: ["Reports can take several business days to appear."],
    sourceUrl: "https://www.columbus.gov/Services/Public-Safety/Find-a-Police-Report/Find-an-Accident-Report",
    sourceLabel: "City of Columbus — Find an Accident Report",
  },
  Georgia: {
    how: "The Georgia Department of Transportation keeps the state's crash report repository. Buy a report online through BuyCrash, or mail GDOT's crash report request form. Georgia State Patrol reports come through the Department of Public Safety instead.",
    cost: "Varies by channel; confirm the current fee before paying.",
    sourceUrl: "https://www.dot.ga.gov/DriveSmart/Data/Documents/Crash%20Reports%20and%20Forms/request_form.pdf",
    sourceLabel: "Georgia DOT — Crash report request form",
  },
  "North Carolina": {
    how: "Individuals request the crash report (DMV-349) from the NC DMV by mail or in person with form TR-67A. Online ordering is only for businesses such as insurers and attorneys.",
    cost: "Shown on form TR-67A; confirm before paying.",
    sourceUrl: "https://www.ncdot.gov/dmv/offices-services/records-reports/Pages/crash-reports.aspx",
    sourceLabel: "NC DMV — Crash reports",
  },
  Michigan: {
    how: "Every Michigan crash report (UD-10), from any police agency, is bought online through the Michigan State Police Traffic Crash Purchasing System, which since April 14, 2026 requires a MiLogin account.",
    cost: "$15 per report.",
    notes: ["Reports usually appear a few days to a few weeks after the crash."],
    sourceUrl: "https://www.michigan.gov/msp/divisions/cjic/traffic-crash-reporting-unit/traffic-crash-purchasing-system---milogin",
    sourceLabel: "Michigan State Police — Traffic Crash Purchasing System",
  },
};
