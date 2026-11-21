# Research: Is my car totaled? (topic 1, 2026-11-11)

## Search phrases and questions found (volumes are estimates; no keyword tool connected)
- Head terms: "is my car totaled", "total loss calculator", "is my car totaled calculator",
  "total loss threshold by state", "[state] total loss threshold", "when is a car considered totaled".
- Questions repeated across results and Q&A sites: what percentage of damage totals a car;
  is a car totaled if the airbags deploy; can I refuse a total loss / repair it anyway;
  is frame damage always a total loss; can the insurer total below the threshold;
  which states use the total loss formula; can I keep my totaled car.

## Competitors read (real ones; spam/scraped copies skipped)
- The Zebra "Is my car totaled? calculator": simple yes/no, no distance to the line.
- Policygenius, CarInsurance.com, Insurify, SoFi, insurance.com state tables: copy each other;
  disagree on several states (FL 75/80, CO 80/100, OK 60/70, IA 50/70, MN 70/80).
- GEICO, American Family, Maryland Insurance Administration: explain ACV vs repair cost.
- Gaps: none shows the repair amount that crosses the line or how far the estimate is from it;
  few explain that insurers total below the state percentage; Oklahoma's Nov 1 2026 change missing.

## Facts confirmed this run (official or primary sources)
- Oklahoma: 60% → 70% effective 2026-11-01, SB 1920 became law without signature 2026-05-13
  (LegiScan; Oklahoma Insurance Department 2026 Statute and Rule Changes PDF). Measured against the
  greater of guidebook value and ACV (47 O.S. § 1111).
- Colorado: salvage when repair cost exceeds retail fair market value (= 100%); hail damage excluded
  (C.R.S. § 42-6-102; Colorado DMV salvage page; DR 2410 form).
- Florida: 80% in § 319.30 (FLHSMV procedure TL-35). 2014 bills proposed changes; not confirmed enacted.
- Minnesota 80% and Iowa 70% were confirmed on 2026-10-29 (see BUILD-LOG).

## What we built that competitors don't have
- Distance to the line in dollars, and the repair amount that crosses it.
- "Insurer may total it anyway" check (repairs + salvage ≥ ACV) for percentage states.
- Same-car, four-state comparison table; per-state "$10,000 car" dollar column on the hub.
- "Why lists online disagree" section with confirmed recent changes.
- Remember-my-numbers on this device (localStorage, opt-in).
