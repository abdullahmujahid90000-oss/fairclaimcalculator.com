# Open questions (claims not published until verified)

Add an item whenever a claim is left out for lack of a source; remove it once
it is verified (or confirmed false) and record the outcome in BUILD-LOG.md.

## Needs direct access to official sites (blocked from this environment 2026-11-21)

1. Open every `cite.url`, `titleAgency.url` and `regulator.url` in
   `astro/src/lib/content/state-threshold-facts.ts` and confirm it loads and
   says what the page says. Some URLs follow standard site patterns and were
   not load-tested (Alabama ALISON, California leginfo, Connecticut cga anchor,
   Idaho legislature path).
2. Rhode Island: read the enacted S 3115 / P.L. 2026 ch. 286 text. Confirm
   "reaches" vs "exceeds" 85%, and whether DBR has updated 230-RICR-20-40-2.
3. New Hampshire: confirm whether RSA 261:22 still contains a 75% test and
   any age limit. Page stays noindex until then.
4. Mississippi, New Mexico, Utah: read the current definitions (Miss. Code
   § 63-21-33/39; NMSA § 66-1-4.16; Utah Code § 41-1a-1001, and how 2026 H.B.
   228 changes title brands from 2027-01-01).
5. Indiana: confirm whether the 70% test in IC 9-22-3-3 applies to insured
   claims or only to self-insured owners and buyers of damaged cars (sources
   differ by version).
6. Kansas: whether Kansas Insurance Department Bulletin 2015-1 is still in force.
7. Kentucky: what 2026 Ky. Acts ch. 100 (HB 144) changed in KRS 186A.520.
8. Florida: whether the 90%-of-retail "unrebuildable" test for late-model cars
   worth $7,500+ is in § 319.30 or only in FLHSMV procedure (not published as a
   number for that reason).
9. Colorado: whether the six-model-year and collector-vehicle exclusions and
   the hail exclusion are in the current C.R.S. § 42-6-102(17) (left out).
10. Washington: the market value threshold figure effective 2026-07-01
    (WSR 26-13-107) (left out).
11. Oklahoma: confirm SB 1920 kept "greater of guidebook value or ACV" and the
    10-model-year limit unchanged.

## Brief items still to verify before publishing (later batches)

- Reported $15.58M State Farm total-loss valuation settlement (Arkansas):
  find the court record or trade-press report (Cluster B).
- Massachusetts 2025 diminished value decisions (Cubberley/Seaver v.
  Commerce) and the May 2026 Connecticut appellate decision (Amica) on duty to
  defend DV claims (Cluster C).
- Minnesota repealed driver report (2021) and Texas dropped driver form (2017)
  claims used on the accident-reporting pages (Cluster G).
