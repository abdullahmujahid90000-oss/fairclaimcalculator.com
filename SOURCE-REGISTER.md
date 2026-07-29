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
  own results page next to the baseline output.
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

## 6. What is NOT yet in this register

No guides have been published yet (Phase 5). Each guide, when written, adds
its own primary-source citations here before publication — never after. A
guide does not ship without its sources logged in this file and reflected
on the public `/sources/` page.
