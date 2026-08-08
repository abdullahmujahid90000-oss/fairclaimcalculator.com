# SOURCE-REGISTER.md — FairClaimCalculator.com v2

Internal reference only — not part of the live site, not linked from
navigation, not in the sitemap. The **public-facing** version of this
register is `/sources/` on the live site, which renders directly from each
calculator's own `sources: string[]` config (see
`astro/src/lib/calculators/*.ts`) so it can never drift from the code. This
file is the fuller internal companion: same facts, plus the primary-source
citations and context that don't fit on the public page.

Every legal, regulatory, or formula-history claim made anywhere on the site
must trace to an entry here. See `ASTRO-REBUILD-PLAN.md` and
`/editorial-policy/` for the sourcing standard this register enforces.

---

## 1. Diminished Value Baseline (`/calculators/diminished-value-baseline/`)

**Claim:** the disclosed 17c-style multiplier table (10% value cap ×
damage-severity multiplier × mileage multiplier) is a commonly published
version of a formula associated with a specific 2002 Georgia class-action
settlement — not a national or state legal standard.

- **Primary source:** *Mabry v. State Farm Mutual Automobile Insurance Co.*,
  Superior Court of Muscogee County, Georgia (2001–2002 class settlement).
  This is the litigation commonly cited as the origin of the "17c" formula
  name and structure that spread into claims-industry practice afterward.
- **Primary source:** Georgia Office of Insurance and Safety Fire
  Commissioner, **Directive 08-P&C-2** (December 2008) — states that no
  specific diminished-value calculation methodology (including 17c-style
  formulas) has been approved by the Commissioner as determinative. This is
  the citation that directly supports the site's repeated framing that the
  formula is *not* a legal standard.
- **How it's used on the site:** `DV_CONFIG.sources` in
  `diminished-value-baseline.ts`; surfaced verbatim on `/methodology/`,
  `/sources/`, and `/disclaimer/`, and referenced inline in the calculator's
  own results page next to the baseline output. As of 2026-08-08, also
  reused verbatim by `/calculators/leased-vehicle-diminished-value/`, which
  imports the same `calculate17cBaseline`/`evaluateMarketEvidence` functions
  rather than duplicating the calculation logic — see register entry #17
  for that page's additional lease-specific sources.
- **What is deliberately NOT claimed:** that any specific state requires or
  endorses this formula; that the formula produces "diminished value" as a
  matter of law; that the 10%/damage/mileage multiplier values are anything
  other than a commonly-published version subject to variation elsewhere.

## 2. Total-Loss Offer Audit (`/calculators/total-loss-offer-audit/`)

**Claim:** the comparable-vehicle statistics (mean, median, range, and a
20%-threshold possible-outlier flag) are descriptive arithmetic only, and
the outlier threshold is a disclosed review heuristic, not a legal or
professional appraisal standard.

- **Basis:** this is a methodology disclosure about the tool's own design,
  not a citation to an external authority — logged here because it is a
  claim about what the numbers do and don't mean, and must not be
  overstated as an industry-standard practice.
- **How it's used:** `TOTAL_LOSS_AUDIT_CONFIG.sources` in
  `total-loss-audit.ts`; the comparable-quality review (year/mileage/trim/
  distance/listing/condition differences) is described the same way —
  factual prompts to verify, never a weighted score or dollar adjustment.

## 3. Settlement Check Breakdown (`/calculators/settlement-check-breakdown/`)

**Claim:** the arithmetic model (stated ACV → tax/fees → deductible → loan
payoff → salvage → prior payments → net to owner/lienholder, plus a
separate possible GAP scenario) reflects a standard first-party/third-party
total-loss settlement waterfall as commonly described in state
insurance-department consumer guides on total-loss claims.

- **Basis:** a general organizing structure drawn from the common pattern
  across state insurance-department consumer-facing total-loss guides
  (e.g., "how your total loss settlement is calculated" style consumer
  pages published by state DOIs), not a citation to any single statute or
  state. Framed on the site as a general model, not state-specific law.
- **How it's used:** `SETTLEMENT_BREAKDOWN_CONFIG.sources` in
  `settlement-breakdown.ts`.
- **What is deliberately NOT claimed:** any specific state's tax/fee
  treatment (the calculator only applies tax/fees the user affirmatively
  says the insurer's own paperwork shows); any GAP payout is guaranteed —
  the tool explicitly labels it a separate, non-guaranteed scenario and
  tells the user to check their GAP certificate's own terms and exclusions.

## 4. Claim Letter & Evidence Packet Builder (`/calculators/claim-letter-builder/`)

**Claim:** the six letter templates are narrow, factual requests with no
invented legal citations, threats, deadlines, or "bad faith" accusations.

- **Basis:** an internal editorial/design rule, not an external citation —
  logged here because it is a standing constraint on what the generated
  text may ever contain, checked by `tests/claim-letter-builder.test.ts`.
- **How it's used:** `LETTER_BUILDER_CONFIG.sources` in
  `claim-letter-builder.ts`.
- **Explicitly out of scope:** a state insurance-department complaint
  template. Not offered until a specific state's actual current complaint
  process and its primary source (the state DOI's own complaint page/form)
  has been verified — see `ASTRO-REBUILD-PLAN.md` open items.

---

## 5. Domain/SEO context source

- **Claim:** fairclaimcalculator.com had zero Google index footprint as of
  2026-07-19, supporting the decision to retire (not redirect) the old
  personal-injury content with no ranking equity at stake.
- **Source:** `PHASE-0-RESEARCH.md` §7.3 — a `site:` search of the domain
  performed as part of pre-rebuild research, returning no results.
- **How it's used:** justifies the retired-content-stub approach (200 +
  noindex, not a redirect) documented in `ASTRO-REBUILD-PLAN.md` §3 and
  `URL-MIGRATION.md`.

---

## 6. Guide Library (23 guides, `/guides/`)

Each guide below cites its sources inline next to the claim (rendered via
its own `sources: string[]` prop in `GuideLayout.astro`) and states plainly,
in its own "What this guide cannot tell you" section, what it does not
verify. Sources marked **(primary)** are official government/regulatory
sources or primary litigation records. Sources marked **(secondary/general)**
are compiled from industry commentary, general concept explanations, or
this site's own methodology notes — not independent verification against
all 50 states' statutes. Guides are told to direct readers to confirm
state-specific rules with their own state insurance department.

### Total Loss cluster (`/guides/total-loss/`)

1. **How Insurers Value a Total-Loss Vehicle** —
   (a) state total-loss threshold variance (percentage-of-ACV test vs.
   Total Loss Formula in ~20 states incl. California, Georgia, Washington)
   — *secondary*, compiled from multiple summaries, not independently
   verified against all 50 states; (b) New Hampshire Insurance Department,
   [List of Accepted Valuation Methods for Total Loss](https://www.insurance.nh.gov/about-us/property-casualty-division/list-accepted-valuation-methods-total-loss)
   — *primary*.
2. **How to Read Your Total-Loss Valuation Report** —
   (a) general commentary on CCC/Mitchell/Audatex-style report structure —
   *secondary/general*; (b) same NH DOI valuation-methods list as above —
   *primary*.
3. **Finding Your Own Comparable Vehicles** — methodology note describing a
   search technique; not tied to an external citation.
4. **Common Valuation Report Errors to Check For** — checklist of
   factual/data-error categories drawn from consumer-facing guidance and
   litigation commentary about valuation systems generally; not a citation
   to any single insurer or product finding.
5. **ACV vs. Replacement Cost vs. Loan Payoff vs. Asking Price** — general
   concept explanation; cross-references the Settlement Check Breakdown
   calculator's own methodology note.
6. **Sales Tax, Title, and Fees on a Total-Loss Settlement** —
   (a) Texas Comptroller, [Motor Vehicle Tax Guide — Insurance Settlement Transfers](https://comptroller.texas.gov/taxes/publications/96-254/insurance-settlement-transfers.php)
   — *primary*; (b) 34 Tex. Admin. Code § 3.62,
   [Insurance Settlements](https://www.law.cornell.edu/regulations/texas/34-Tex-Admin-Code-SS-3-62)
   via Cornell Law's LII — *primary*; (c) general multi-state summary
   (roughly two-thirds of states require some form of sales-tax
   reimbursement, typically after proof of replacement purchase) —
   *secondary*, not independently verified against all 50 states.
7. **Owner-Retained Total Loss & Salvage Titles** —
   (a) Wikipedia, [Salvage title](https://en.wikipedia.org/wiki/Salvage_title)
   — *secondary/general* overview, branding criteria differ by state;
   (b) New York State Department of Financial Services,
   [OGC Opinion No. 00-02-07: Salvage Vehicle Branding](https://www.dfs.ny.gov/insurance/ogco2000/rg000207.htm)
   — *primary*.
8. **How to Dispute a Total-Loss Valuation Factually** — general description
   of the appraisal-clause process (independent appraisers per side, neutral
   umpire if they disagree); a common policy provision whose exact wording
   varies by insurer/state — not tied to one external citation.
17. **State Total-Loss Threshold Laws Explained** (added 2026-08-01) —
    (a) Brennan, R., "Total Loss Threshold by State," Policygenius, updated
    July 2026 — *secondary*, a dated, editorially-reviewed 50-state + DC
    comparison table by a named, credentialed author (licensed insurance
    expert); this is the primary source for the state-by-state table on the
    page; (b) New Hampshire Insurance Department, List of Accepted
    Valuation Methods for Total Loss — *primary*, same citation as register
    entry #1 (How Insurers Value a Total-Loss Vehicle). **What is
    deliberately NOT claimed:** that the table reflects each state's
    current statute verified directly against primary legal text (it is
    one secondary compiled review, dated, subject to change); that any
    state's number is guaranteed accurate for a specific claim today —
    readers are told to confirm with their state insurance department.
18. **What Happens to Your Loan or Lease After a Total Loss (GAP Insurance
    Explained)** (added 2026-08-01) —
    (a) Consumer Financial Protection Bureau, "What is Guaranteed Asset
    Protection (GAP) insurance?", last reviewed March 8, 2024 — *primary*,
    federal source for what GAP is, that it's optional, and cancellation/
    refund rights; (b) California AB 2311 and SB 1311 (effective Jan. 1,
    2023), as summarized by Ballard Spahr's Consumer Finance Monitor —
    *secondary summary of primary legislation*, used as one illustrative
    state example, explicitly not framed as universal. **What is
    deliberately NOT claimed:** that any specific GAP certificate covers or
    excludes any particular item (varies by provider/contract); that every
    state regulates GAP the way California does; that lease-embedded GAP-
    style protection works identically to standalone GAP insurance.

### Diminished Value cluster (`/guides/diminished-value/`)

9. **What Is Diminished Value?** — general concept explanation; defers the
   17c-specific history/formula to guide #11 below.
10. **Inherent vs. Repair-Related Diminished Value** — general industry
    concept distinction from claims/appraisal literature; not tied to a
    single external citation.
11. **The 17c Formula's Real History, Calculation, and Limits** —
    (a) *Mabry v. State Farm Mutual Automobile Insurance Co.*, Superior
    Court of Muscogee County, Georgia (2001–2002 class settlement) —
    *primary litigation record*, same citation as register entry #1 above;
    (b) Georgia Office of Insurance and Safety Fire Commissioner, Directive
    08-P&C-2 (December 2008) — *primary*, same citation as register entry
    #1 above.
12. **Building Diminished-Value Market Evidence** — methodology note
    describing the clean-history vs. accident-history comparison technique;
    not tied to an external legal source.
16. **Does Your State Allow a First-Party Diminished Value Claim?** (added
    2026-08-01) —
    (a) Wells-Dietel, B., Erkan-Barlow, A., &amp; Walkowiak, W., "Automobile
    Diminished Value Claims," *Journal of Insurance Regulation*, National
    Association of Insurance Commissioners (NAIC), 2023 — *primary/academic*,
    the main source for the state-by-state case summaries; (b) *State Farm
    Mut. Auto. Ins. Co. v. Mabry*, 274 Ga. 498 (2001), and *U.S. Fidelity &amp;
    Guar. Co. v. Corbett*, 35 Ga. App. 606 (1926) — *primary litigation*;
    (c) *Siegle v. Progressive Consumers Ins. Co.*, 819 So. 2d 732 (Fla.
    2002) — *primary litigation*; (d) *American Manufacturers Mutual Ins.
    Co. v. Schaefer*, 124 S.W.3d 154 (Tex. 2003), and Texas Dept. of
    Insurance Commissioner's Bulletin B-0027-00 (2000) — *primary*; (e) *Ray
    v. Farmers Ins. Exchange*, 200 Cal. App. 3d 1411 (Cal. Ct. App. 1988) —
    *primary litigation*; (f) *Delledonne v. State Farm Mutual Ins. Co.*,
    621 A.2d 350 (Del. Super. Ct. 1992), and *O'Brien v. Progressive
    Northern Ins. Co.*, No. 58, 2001 (Del. 2001) — *primary litigation*;
    (g) N.C. Gen. Stat. § 20-279.21(d)(1) — *primary statute*; (h)
    Matthiesen, Wickert &amp; Lehrer, S.C., "Diminution in Value Cases in All
    50 States" (2022 survey, as cited in source (a)) — *secondary*, used
    only for the documented third-party-recognition state list, explicitly
    framed as not a complete or current-as-of-today 50-state survey.
    **What is deliberately NOT claimed:** that any state not listed has a
    settled rule either way; that any of the above rulings remain
    unchanged today (case law and regulations can shift); that this
    substitutes for confirming current status with a state insurance
    department or licensed attorney.
17. **Diminished Value on a Leased Vehicle** (added 2026-08-08) —
    (a) New York State Department of Financial Services, Office of General
    Counsel, [OGC Opinion No. 11-02-01: "Adjusting the Total Loss of a New,
    Leased Vehicle & Payment to Insured or Loss Payee"](https://www.dfs.ny.gov/insurance/ogco2011/rg110201.htm)
    (February 7, 2011) — *primary regulator opinion letter*, fetched and
    verified directly; cited specifically for its conclusion that whether an
    insurer's loss payment goes to the lessee (named insured) or the
    leasing company (loss payee) "is dependent upon the full terms and
    conditions of the policy," not a fixed default; (b) North Carolina
    General Statutes § 25-2A-219, [Article 2A (Leases), "Risk of Loss"](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByArticle/Chapter_25/Article_2A.html)
    — *primary statute*, fetched and verified directly (exact text: "Except
    in the case of a finance lease, risk of loss is retained by the lessor
    and does not pass to the lessee"); cited as one state's codification of
    the UCC leasing-article risk-of-loss framework, not a claim that every
    state's statute reads identically.
    **What is deliberately NOT claimed:** that either source establishes a
    universal rule on who may file a diminished-value claim on a leased
    vehicle; that every state's leasing statute or insurance-department
    guidance reads the same as these two examples; that this substitutes
    for reading the reader's own lease contract, policy, and state law.

### Claim Process cluster (`/guides/claim-process/`)

13. **First-Party vs. Third-Party Auto Claims** — National Association of
    Insurance Commissioners (NAIC),
    [Unfair Claims Settlement Practices Act (Model Act #900)](https://content.naic.org/sites/default/files/model-law-900.pdf)
    — *primary*, a model law defining first-party/third-party claimants and
    baseline claims-handling standards; most states have adopted some
    version, but enacted text varies by state.
14. **When to Consider an Independent Appraisal or Attorney** — same
    general appraisal-clause description as guide #8 above; not tied to one
    external citation.
15. **Auto Claim Evidence Checklist** — practical checklist compiled for
    this site, expanding on the Claim Letter Builder's own evidence
    checklist; not a citation to an external standard.
19. **Rental Car & Loss-of-Use Reimbursement** (added 2026-08-01) —
    (a) Nevada Division of Insurance, filed policy endorsement Form A-431
    (05-11), "Rental Reimbursement Endorsement" — *primary*, a real
    publicly filed example of first-party rental-reimbursement wording
    (24-hour trigger, total-loss cutoff at 72 hours after settlement
    offer); (b) Texas Office of Public Insurance Counsel (OPIC), Auto
    Insurance resources — *primary*, a state consumer-advocate agency's
    framing of loss-of-use as part of property-damage liability coverage.
    **What is deliberately NOT claimed:** that the Nevada-filed endorsement
    applies to any policy other than the one it was filed for; that every
    state's minimum liability law works the way Texas's does; that
    "reasonable" rental period/cost has one fixed definition nationwide.
20. **How to Respond to a Lowball Total-Loss or Diminished-Value Offer**
    (added 2026-08-01) — National Association of Insurance Commissioners
    (NAIC), Unfair Claims Settlement Practices Act (Model Act #900) —
    *primary*, same citation as register entry #13, cited here to support
    the state-insurance-department-complaint escalation step. The
    step-by-step process itself is a methodology note describing how this
    site's own tools/guides fit together, not an external citation.
    **What is deliberately NOT claimed:** that a specific rebuttal will
    succeed; that every state's complaint process works identically. Note:
    this guide deliberately overlaps in structure with guide #8 (How to
    Dispute a Total-Loss Valuation Factually) — it's the general version
    covering both total-loss and diminished-value offers, cross-linked
    both directions, not an independent duplicate.
21. **Filing a Complaint with Your State Insurance Department** (added
    2026-08-08) —
    (a) National Association of Insurance Commissioners (NAIC),
    ["Need Help with Insurance? Insurance Departments Are Your Trusted Source"](https://content.naic.org/article/need-help-insurance-insurance-departments-are-your-trusted-source)
    (Sept. 15, 2025) — *primary*, fetched and verified directly, describes
    what a state DOI can and cannot do; (b) NAIC,
    ["How to File a Complaint and Research Complaints Against Insurance Carriers"](https://content.naic.org/article/how-file-complaint-and-research-complaints-against-insurance-carriers)
    (Sept. 1, 2022) — *primary*, fetched and verified directly, the general
    complaint-filing steps and the NAIC's own complaint-index research tool;
    (c) NAIC, [Insurance Departments contact directory](https://content.naic.org/state-insurance-departments)
    — *primary*, the NAIC's own live, maintained state-by-state DOI contact
    tool, linked directly rather than hand-copied into a 50-state table on
    this site (a table that would go stale between reviews and could not be
    continuously re-verified).
    **What is deliberately NOT claimed:** that this site maintains or
    verifies the individual state contact details itself (it links to the
    NAIC's own directory instead); that filing a complaint will result in
    any particular outcome; that every state's DOI complaint process is
    identical.
22. **Diminished Value vs. Total Loss: Which Claim Do I Have?** (added
    2026-08-08) — general routing/synthesis note cross-linking this site's
    own existing tools and guides based on one factual distinction
    (repaired vs. total loss); not tied to an external citation. Fills the
    uploaded fix-prompts document's item 4.4 ("a short decision-guide
    article that routes users to the right tool based on whether their
    vehicle was repaired or declared a total loss"), which had been covered
    functionally by the interactive `/check-my-offer/` router but not yet
    as a standalone article.

---

## 7. What is NOT yet in this register

The 20-guide library above is complete and logged as of 2026-08-01.
Nothing currently published on the site is missing from this register. Any
future guide, calculator, or claim added after this point must have its
sources logged here — and reflected on the public `/sources/` page —
before publication, never after.
