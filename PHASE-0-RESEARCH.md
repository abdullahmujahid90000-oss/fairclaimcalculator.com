# PHASE-0-RESEARCH.md — Validation & Source System

Internal reference only — not part of the live site. Companion to `BUILD-LOG.md`.
Produced per master prompt §16 Phase 0 and §19 item 1–5.

---

## 1. Competitor & gap analysis (directional — not a fresh live crawl of each site)

The master prompt names these adjacent products (§3.1). This is a first-pass
gap read based on their known positioning, not a verified feature-by-feature
audit — that audit should happen incrementally as each competing page is
actually outranked, not as a one-time exercise.

| Competitor type | Known pattern | Gap FairClaimCalculator should own |
|---|---|---|
| Simple DV calculators (17cformula.com-style, DVCHECK) | Single-formula number generator, often email-gated | No email gate; show full arithmetic; pair 17c baseline with a market-evidence worksheet instead of presenting one number as "the" value |
| Demand-letter generators (Claimerly-style) | Generate a letter, often skipping the audit step | Letter is generated *from* a completed line-by-line audit, not a mad-lib |
| Paid appraisal/report services (Appraisal Engine, SecondAppraisal, AutoACV) | Human-prepared report, real value but paid and slower | Free self-audit first; paid professional appraisal offered only as a disclosed referral, never faked |
| Total-loss comp tools (Total Loss Tool, TotalLossToolKit, TeslaComps) | Comp gathering/organizing | Comp organizer + arithmetic + mismatch checklist + letter in one flow |
| Insurer/valuation-provider explainers (CCC, Mitchell, Audatex, J.D. Power) | Explain their own report format, naturally not critical of it | Neutral, error-checklist framing: "possible mismatch to verify," never an accusation |

**Owned gap:** a free, no-email, privacy-first audit that turns a valuation
report into (a) a fact-mismatch list, (b) a comp-quality table, (c) an
arithmetic check, (d) a missing-evidence list, (e) a questions-to-ask list,
and (f) an editable letter — usable end to end with zero forms gating the
result. No competitor reviewed above does all six in one free flow.

---

## 2. 17c / Mabry legal memo (verified via live web search, 2026-07-18)

**Do not publish the simplified claim "the Georgia Supreme Court created the
17c formula."** That is the exact error the master prompt (§2.4) prohibits.
Correct, sourced version:

1. **Mabry v. State Farm (2001).** In *State Farm Mutual Automobile Insurance
   Co. v. Mabry*, 274 Ga. 498, 556 S.E.2d 114 (Ga. 2001), the Georgia Supreme
   Court held that Georgia law requires insurers to evaluate and, where
   present, pay first-party policyholders for diminished value after a
   covered physical-damage repair — not just the repair cost itself. The
   case did **not** hand down a specific calculation formula. ([Justia case
   text](https://law.justia.com/cases/georgia/supreme-court/2001/s01a0982-1.html), [FindLaw](https://caselaw.findlaw.com/court/ga-supreme-court/1358011.html))

2. **The 17(c) formula's actual origin.** Because the underlying *Mabry*
   litigation involved a class of 25,000+ claimants whose vehicles could not
   practically be individually appraised, the **Superior Court of Muscogee
   County** approved a generic formula (base value × damage-severity
   multiplier × mileage multiplier, with a 10% cap) in a **2002 class
   settlement order** as a practical mechanism for resolving *that specific
   class action* — not a rule of general Georgia law and not authored by the
   Supreme Court. Sources describing this order and its limited settlement
   purpose should be pulled from the actual court filing/order text
   (`17cformula.com`-hosted copy of the order and 11th Circuit filings
   discuss this history; the operative point — that it was a settlement
   mechanism for a specific class, not a statewide valuation standard — should
   be re-confirmed against the order itself before any page states it as fact).

3. **Georgia OCI Directive 08-P&C-2 (December 1, 2008).** The Georgia Office
   of Insurance and Safety Fire Commissioner (under Commissioner John W.
   Oxendine) issued this directive stating that the Department had **not**
   approved any specific formula for calculating diminished value, and that
   carriers should not represent to insureds that the Department had
   endorsed one. The directive requires carriers to consider all relevant
   claim-specific information, not apply 17(c) mechanically as a determinative
   answer. **Action item:** obtain the archived directive text directly from
   the Georgia OCI (or an authenticated copy) before quoting specific wording
   on the live guide page — today's research confirms the directive's
   existence and substance via secondary discussion, not a primary-source PDF
   read.

**Required framing on every page that mentions 17c** (per doc §2.4, carried
into `BUILD-LOG.md` §5):
- Call it "17c insurer-style baseline," never "true diminished value."
- Distinguish the 2001 Supreme Court holding (general first-party DV
  obligation exists) from the 2002 Muscogee County settlement order (where
  the specific 17(c) formula actually comes from).
- State plainly that Georgia's insurance regulator has said it never approved
  a definitive formula.
- Cite primary sources next to the claim; link the actual case and, once
  obtained, the actual directive PDF — not just secondary commentary.

---

## 3. State candidate scorecard

This is the master prompt's own candidate list (§6), carried forward
unverified. **No state-law fact for any of these states — including
Georgia beyond the Mabry/17c history above — is confirmed yet.** Each
requires its own primary-source research pass before any page publishes
non-`noindex`.

| State | Why a candidate | Research status |
|---|---|---|
| Georgia | *Mabry*/17(c) history, major first-party DV relevance | 17c/Mabry history verified above; broader current GA claims-settlement statute/regulation review still needed |
| California | Large audience, detailed claims-settlement regulation (Ins. Code + 10 CCR) | Not yet researched |
| Texas | Large vehicle market, first/third-party distinctions | Not yet researched |
| Florida | Large market, first-party policy-language nuance | Not yet researched |
| North Carolina | Possible distinct valuation/DV treatment | Not yet researched |
| New York | Large audience, state-specific regulation | Not yet researched |
| Illinois | Large audience, possible content opportunity | Not yet researched |

No page for any of these (other than the already-verified 17c/Mabry history,
which lives on a guide page, not a `/states/{state}/` page) should go live
without the full source-record fields the doc requires in §6, and every
`/states/{state}/...` page stays `noindex` + out of `sitemap.xml` until then.

---

## 4. Legal/editorial risk register (top items)

| Risk | Mitigation in place |
|---|---|
| Fabricating a state-law conclusion | Per-page source-record requirement; `noindex` gate; hedged language only (§2.3) |
| Presenting 17c as nationwide/mandatory | Explicit framing rule above and in `BUILD-LOG.md` |
| Implying legal/professional review that doesn't exist | Explicit "not yet reviewed by a qualified professional" disclosure until a real reviewer is retained (D5) |
| Fabricated appraiser/attorney partners or reviews | Never invented; referral sections stay empty/absent until a real, disclosed partnership exists |
| Analytics capturing claim data | Carried into technical build — no sensitive fields to analytics, ever |
| AdSense enabled before real approval | `ads.txt` and ad code stay off; existing standard already enforces this |

---

## 5. Monetization compliance register (top items, from doc §12)

| Stream | Status | Gate before activation |
|---|---|---|
| Display ads (AdSense) | Off | Doc §11.1 readiness gate: 4 tools + 12 guides + trust pages + real traffic, reviewed again at application time |
| Appraiser referrals | Off | Real vetted partner required — cannot fabricate |
| Attorney referrals | Off, high-risk | Written state-by-state legal review required before any build work — do not build UI for this without that review existing |
| Paid packet product | Off | Only after free tool is solid and trusted |
| Affiliate links | Off | Only real, useful, disclosed partners |
| B2B licensing | Off | Only after consumer product is reliable |

---

## 6. Go / no-go

**Go**, on the terms above: the free line-by-line offer-audit + evidence
packet is a real, ownable gap (no reviewed competitor does all six audit
outputs in one no-email flow), the 17c/Mabry history can be told correctly
with verified sources, and the existing plain-HTML stack + cookie-consent/
disclaimer infrastructure is reusable rather than a blocker. Condition: no
state-law page beyond the verified 17c/Mabry history goes live until it has
its own real source record, and no monetization beyond "off" activates
without the specific gate in §5 being met.

---

## 7. Old-vs-new topic comparison, live SERP gap-check, and domain suitability
(added 2026-07-19, in response to a direct request to re-evaluate before
cleanup)

### 7.1 Old (deleted) topics vs. new topic map

There is **no genuine topical overlap** between the deleted personal-injury
content (car accident/slip-and-fall/dog-bite/workers-comp settlement
calculators, pain-and-suffering, multiplier-method, demand-letter, statute-
of-limitations articles) and the new auto diminished-value/total-loss topic
map. The only surface-level collision was the phrase "car accident," but the
old page was about bodily-injury settlement value and the new site is about
vehicle-value claims — different search intent, different SERP, different
competitors entirely. So this wasn't a case of trimming true duplicates; it
was retiring an entire off-scope topic in favor of a new one, per D1/D8.

### 7.2 Directional demand/competition read on new-topic candidates
(live search snapshots, 2026-07-19 — directional only, no keyword-tool
volume data used or fabricated, per doc §2.2/§7.2)

| Topic | What the SERP looks like today | Directional competition | Directional opportunity |
|---|---|---:|---|
| "diminished value calculator" | Crowded: DVCHECK, Appraisal Engine, NADVA, MyFairClaim, The Zebra, wreckcheck.com, diminishedvaluecalculator.com, JunkCarsUs — mostly email-gated or VIN-gated lead-gen tools, several with real domain authority (Zebra, KBB) | High | Real, but only winnable by being visibly more transparent (full arithmetic, no gate) than every incumbent — hard to out-rank Zebra/KBB directly, easier to out-rank the smaller lead-gen tools |
| "total loss settlement calculator" | Smaller, more fragmented field: SecondAppraisal, autoclaimconsultants, sunautoappraisers, totallossnw, mycarcalc, a law-firm site or two — mostly small independent-appraiser marketing sites, no big-brand incumbent | Medium | Better opportunity than DV calculator — fewer high-authority competitors, most existing tools are marketing fronts for a paid appraisal upsell rather than a genuinely complete free audit |
| "how to read a CCC total-loss valuation report" | CCC's own help docs plus SecondAppraisal, SnapClaim, TotalLossNW, DiminishedValueExpert, MyDVAC — niche appraisal-adjacent sites, no mainstream personal-finance site competing here | Medium | Good opportunity — matches the doc's "field-by-field walkthrough + interactive checklist" differentiator directly, and the audit tool can go one step further than any competitor's static article |
| "total loss offer too low / how to dispute" | Heavily populated, including high-authority general sites (Bankrate, Insurance.com) plus law-firm and appraisal-company content | High | Hardest of the four to rank for directly; better approached as a supporting/internal-linking guide once the audit tool itself has traction, not a first-wave target |

**Read-through for build-queue ordering:** this supports (without overriding)
the already-chosen "tools first" order in `BUILD-LOG.md`. Within Phase 4
content, the CCC-report guide and the total-loss settlement/breakdown angle
look like better near-term ranking opportunities than the crowded generic
"diminished value calculator" and "total loss dispute" terms — those two are
still worth building (they're the flagship tools/guides and the doc is right
that a genuinely more transparent tool is the differentiator), just don't
expect them to rank quickly against Zebra/KBB/Bankrate-level domains.

### 7.3 Domain suitability

- **fairclaimcalculator.com had zero Google index footprint** as of
  2026-07-19 (a `site:` search returned no results for the domain). That's
  good news for a clean pivot: there was no ranking equity, indexed URLs, or
  likely meaningful backlink profile to lose by deleting the PI content.
  Practically, expect this domain to behave like a brand-new site for SEO
  purposes regardless of which topic it covers — real link-earning (doc
  §14) will matter more than legacy authority either way.
- **Name collision risk:** the search surfaced **myfairclaim.com**, an
  existing, actively-marketed diminished-value calculator/appraisal service
  with a near-identical brand name ("Fair Claim" vs. "FairClaimCalculator").
  This is a real user-confusion and competitive-differentiation risk worth
  the operator's awareness — it's not a reason to abandon the domain (no
  literal trademark on a generic descriptive phrase like "fair claim" is
  likely enforceable, and that's not legal advice), but marketing/outreach
  copy should avoid language that reads as if affiliated with or copying
  MyFairClaim, and it reinforces why the differentiator (free, no-email,
  full-audit-in-one-flow) needs to be obvious on sight.
- **Semantic fit:** "FairClaimCalculator" reads neutrally as a claims/
  insurance term generally — it does not lexically commit to personal
  injury or to auto claims, so the existing domain name is a fine fit for
  the new product and did not need to change.
