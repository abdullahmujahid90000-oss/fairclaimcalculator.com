/**
 * The site's topic clusters: one source of truth for internal linking.
 *
 * Each cluster has a pillar (its hub page) and an ordered list of pages, in
 * the order a reader would naturally go through them. From this one map:
 *  - each hub page renders its list of pages (so a new page appears on its
 *    hub as soon as it is added here);
 *  - every page in a cluster gets an "In this topic" block (TopicLinks.astro,
 *    rendered by BaseLayout) linking up to the pillar, to the previous and
 *    next page in the reading order, and to the cluster's main tools.
 *
 * Rules: each page belongs to exactly one cluster; `label` is the link text
 * (descriptive, not "click here"); `desc` is one plain sentence for hubs.
 * State pages are not listed here: they are reached from their own hubs
 * (the threshold and accident-reporting tables) and link to each other.
 */

export type PageKind = "guide" | "calculator" | "form" | "data" | "tool";

export interface ClusterPage {
  href: string;
  label: string;
  desc: string;
  kind: PageKind;
}

export interface TopicCluster {
  id: string;
  name: string;
  pillar: { href: string; label: string };
  /** Tools shown in every page's "In this topic" block (hrefs, must be in `pages`). */
  keyTools: string[];
  pages: ClusterPage[];
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: "total-loss",
    name: "Totaled cars",
    pillar: { href: "/guides/total-loss/", label: "All totaled-car guides" },
    keyTools: ["/calculators/total-loss-threshold-checker/", "/calculators/total-loss-offer-audit/"],
    pages: [
      { href: "/calculators/total-loss-threshold-checker/", label: "Is my car totaled? Calculator", desc: "Enter the repair estimate and the car's value to see your state's line and how close you are to it.", kind: "calculator" },
      { href: "/guides/total-loss/state-total-loss-threshold-laws/", label: "Total loss threshold by state", desc: "Every state's rule, checked against its statute, with what it means in dollars.", kind: "data" },
      { href: "/guides/total-loss/total-loss-threshold-changes/", label: "Recent total loss threshold changes", desc: "Dated, sourced changes to state total loss laws, including bills that failed.", kind: "data" },
      { href: "/guides/total-loss/how-insurers-value-a-total-loss-vehicle/", label: "How insurers value a totaled car", desc: "Comparable cars, condition and mileage adjustments, and the report lines that most often lower the value.", kind: "guide" },
      { href: "/calculators/total-loss-offer-audit/", label: "Totaled car value calculator", desc: "Estimate your payout, then check the insurer's valuation report line by line.", kind: "calculator" },
      { href: "/guides/total-loss/reading-your-total-loss-valuation-report/", label: "How to read a total loss valuation report", desc: "The sections of a typical CCC, Mitchell or Audatex-style report, explained.", kind: "guide" },
      { href: "/guides/total-loss/common-valuation-report-errors/", label: "Common valuation report errors", desc: "Mileage, trim, condition and comparable-car mistakes worth checking for.", kind: "guide" },
      { href: "/guides/total-loss/finding-your-own-comparable-vehicles/", label: "Finding your own comparable cars", desc: "How to search for comparable listings and what makes one strong or weak.", kind: "guide" },
      { href: "/forms/comparable-vehicles-worksheet/", label: "Comparable vehicles worksheet (PDF)", desc: "A printable sheet for recording the comparable cars you find.", kind: "form" },
      { href: "/guides/total-loss/how-to-dispute-a-total-loss-valuation/", label: "How to dispute a total loss valuation", desc: "A step-by-step, evidence-based way to challenge a low valuation.", kind: "guide" },
      { href: "/forms/total-loss-valuation-dispute-letter/", label: "Total loss dispute letter template", desc: "A factual dispute letter you can fill in and send.", kind: "form" },
      { href: "/guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price/", label: "Actual cash value vs. replacement cost", desc: "Why the check doesn't match what you paid, what a new car costs or what you owe.", kind: "guide" },
      { href: "/guides/total-loss/sales-tax-title-fees-on-a-total-loss/", label: "Sales tax and title fees on a total loss", desc: "Whether the insurer owes tax and fees on top of the car's value.", kind: "guide" },
      { href: "/calculators/sales-tax-title-fee-estimator/", label: "Sales tax and title fee estimator", desc: "Estimate the tax and fees of replacing a totaled car with your own rate.", kind: "calculator" },
      { href: "/calculators/settlement-check-breakdown/", label: "Total loss settlement check breakdown", desc: "See how the value turns into your check after the deductible, loan and salvage.", kind: "calculator" },
      { href: "/guides/total-loss/gap-insurance-loan-lease-after-total-loss/", label: "GAP insurance after a total loss", desc: "What GAP covers and doesn't when you owe more than the payout.", kind: "guide" },
      { href: "/calculators/gap-shortfall/", label: "Car totaled but still owe? Gap calculator", desc: "The gap between your loan or lease payoff and the settlement.", kind: "calculator" },
      { href: "/guides/total-loss/owner-retained-total-loss-and-salvage-titles/", label: "Keeping a totaled car: salvage titles", desc: "How the salvage deduction works and what a salvage or rebuilt title means.", kind: "guide" },
      { href: "/calculators/salvage-value/", label: "Salvage value calculator", desc: "The cash math of keeping your totaled car versus handing it over.", kind: "calculator" },
      { href: "/check-my-offer/", label: "Which claim tool should I use?", desc: "Answer a few questions to find the right calculator for your offer.", kind: "tool" },
    ],
  },
  {
    id: "diminished-value",
    name: "Diminished value",
    pillar: { href: "/guides/diminished-value/", label: "All diminished value guides" },
    keyTools: ["/calculators/diminished-value-baseline/", "/forms/diminished-value-claim-letter/"],
    pages: [
      { href: "/guides/diminished-value/what-is-diminished-value/", label: "What is diminished value?", desc: "Why a repaired car can be worth less, and who can claim for it.", kind: "guide" },
      { href: "/calculators/diminished-value-baseline/", label: "Diminished value calculator", desc: "A transparent 17c-style baseline, compared with real market evidence.", kind: "calculator" },
      { href: "/guides/diminished-value/the-17c-formula-history-calculation-and-limits/", label: "The 17c formula and its limits", desc: "Where the formula came from, how it is calculated and why insurers dispute it.", kind: "guide" },
      { href: "/guides/diminished-value/inherent-vs-repair-related-diminished-value/", label: "Inherent vs. repair-related diminished value", desc: "The two kinds of value loss after a repair, and how each is shown.", kind: "guide" },
      { href: "/guides/diminished-value/building-diminished-value-market-evidence/", label: "Building diminished value evidence", desc: "How to gather market evidence that supports a diminished value claim.", kind: "guide" },
      { href: "/guides/diminished-value/state-laws-first-party-diminished-value-claims/", label: "Diminished value claims by state", desc: "Where you can claim diminished value from your own insurer.", kind: "guide" },
      { href: "/guides/claim-process/diminished-value-vs-total-loss-which-claim/", label: "Diminished value or total loss?", desc: "Which claim fits when the damage is close to the total loss line.", kind: "guide" },
      { href: "/forms/diminished-value-claim-letter/", label: "Diminished value claim letter template", desc: "A factual demand letter for a diminished value claim.", kind: "form" },
      { href: "/guides/diminished-value/leased-vehicle-diminished-value/", label: "Diminished value on a leased car", desc: "Who usually holds the claim when the car is leased.", kind: "guide" },
      { href: "/calculators/leased-vehicle-diminished-value/", label: "Leased car diminished value calculator", desc: "The same baseline and evidence check, adapted for a lease.", kind: "calculator" },
    ],
  },
  {
    id: "claim-process",
    name: "Claims and disputes",
    pillar: { href: "/guides/claim-process/", label: "All claim process guides" },
    keyTools: ["/my-claim/", "/calculators/claim-letter-builder/"],
    pages: [
      { href: "/guides/claim-process/first-party-vs-third-party-auto-claims/", label: "First-party vs. third-party claims", desc: "Claiming on your own policy or the other driver's, and what changes.", kind: "guide" },
      { href: "/my-claim/", label: "My Claim tracker", desc: "A private, browser-saved timeline, checklist and contact log for your claim.", kind: "tool" },
      { href: "/forms/claim-communication-log/", label: "Insurance claim log template (PDF)", desc: "A printable log for every call and email with the insurer.", kind: "form" },
      { href: "/guides/claim-process/rental-car-loss-of-use-reimbursement/", label: "Rental car and loss of use after an accident", desc: "When the insurer pays for a rental, and for how long.", kind: "guide" },
      { href: "/calculators/loss-of-use-reimbursement/", label: "Loss of use calculator", desc: "Check whether a rental or loss-of-use offer adds up.", kind: "calculator" },
      { href: "/forms/rental-loss-of-use-log/", label: "Rental and loss of use log (PDF)", desc: "A printable record of rental days and costs.", kind: "form" },
      { href: "/guides/claim-process/how-to-respond-to-a-lowball-offer/", label: "Responding to a lowball offer", desc: "What to do when a total loss or diminished value offer looks too low.", kind: "guide" },
      { href: "/calculators/claim-letter-builder/", label: "Claim letter generator", desc: "Build a factual total loss or diminished value letter in your browser.", kind: "calculator" },
      { href: "/guides/claim-process/when-to-consider-an-independent-appraisal-or-attorney/", label: "When to get an appraiser or attorney", desc: "Signs that a claim needs outside help, and what each can do.", kind: "guide" },
      { href: "/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/", label: "Filing an insurance complaint", desc: "How to complain to your state insurance department, step by step.", kind: "guide" },
      { href: "/forms/insurance-complaint-worksheet/", label: "Insurance complaint worksheet (PDF)", desc: "Organize the facts before you file a complaint.", kind: "form" },
    ],
  },
  {
    id: "accident",
    name: "After an accident",
    pillar: { href: "/guides/accident-reporting/", label: "Accident reporting rules in every state" },
    keyTools: ["/guides/claim-process/what-to-do-after-a-car-accident/", "/forms/accident-information-worksheet/"],
    pages: [
      { href: "/guides/claim-process/what-to-do-after-a-car-accident/", label: "What to do after a car accident", desc: "A step-by-step checklist, saved in your browser as you go.", kind: "guide" },
      { href: "/forms/accident-information-worksheet/", label: "Car accident information sheet (PDF)", desc: "A glove-box sheet for the details to collect at the scene.", kind: "form" },
      { href: "/guides/claim-process/auto-claim-evidence-checklist/", label: "Documents you need for a car insurance claim", desc: "What to gather at each stage of the claim.", kind: "guide" },
      { href: "/forms/claim-evidence-checklist/", label: "Claim evidence checklist (PDF)", desc: "A printable version of the documents checklist.", kind: "form" },
    ],
  },
];

export function findCluster(path: string): { cluster: TopicCluster; index: number } | null {
  for (const cluster of TOPIC_CLUSTERS) {
    const index = cluster.pages.findIndex((p) => p.href === path);
    if (index !== -1) return { cluster, index };
  }
  return null;
}

export interface TopicLinkSet {
  cluster: TopicCluster;
  previous: ClusterPage | null;
  next: ClusterPage | null;
  tools: ClusterPage[];
}

/** Links for a page's "In this topic" block, or null when the page is in no cluster. */
export function getTopicLinks(path: string): TopicLinkSet | null {
  const found = findCluster(path);
  if (!found) return null;
  const { cluster, index } = found;
  const pages = cluster.pages;
  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : pages[0] !== pages[index] ? pages[0] : null;
  const shown = new Set([path, previous?.href, next?.href]);
  const tools = cluster.keyTools
    .filter((href) => !shown.has(href))
    .map((href) => pages.find((p) => p.href === href) as ClusterPage);
  return { cluster, previous, next, tools };
}
