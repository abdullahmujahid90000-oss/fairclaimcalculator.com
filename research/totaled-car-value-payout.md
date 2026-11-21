# Research: Totaled car value / payout (topic 2, 2026-11-13)

## Search phrases and questions (volumes are estimates; no keyword tool connected)
- Head terms: "totaled car value calculator", "how much will insurance pay for my totaled car",
  "total loss settlement calculator", "how do insurance companies value a totaled car",
  "actual cash value vs replacement cost".
- Questions: is the deductible taken out of a total loss; does insurance pay sales tax on a totaled
  car; what is a projected sold adjustment / condition adjustment; can I negotiate a total loss
  offer; I owe more than the car is worth; is ACV the same as Kelley Blue Book.

## Competitors read
- NerdWallet, Insurify, Bankrate, MoneyGeek, insurance.com, State Farm, Experian, Clark:
  "ACV minus deductible" explanations; few include tax/fees, salvage-if-kept, and lender order
  together; none offer a payout estimator that combines all of them.
- CarsCounsel / mycarcalc-style calculators: ACV − deductible only.
- Gap: almost no consumer page explains condition and projected sold adjustments.

## Facts and sources used
- Settlement order (ACV + sales tax + pro-rated fees, then salvage deduction if kept):
  Washington OIC "How insurers calculate taxes and fees when your car is totaled".
- Kansas requires sales tax and title/registration fees for a comparable vehicle; deductible and
  retained salvage subtracted: Kansas Insurance Department Bulletin 2013-1.
- Condition adjustment and refurbishment adjustments: CCC Valuation Glossary (help.cccis.com).
- Projected sold adjustment: class actions 2021–2025 (Repairer Driven News, Claims Journal,
  Insurance Journal); Seventh Circuit reversed a class certification in 2025; outcomes mixed.
- New Hampshire Insurance Department list of accepted total-loss valuation methods.
- Not used (could not confirm): a "35 miles" comparable radius in the NAIC model regulation.

## What we built that competitors don't have
- Payout estimator: ACV + tax + fees − deductible (first-party only) − salvage if kept,
  lender paid next, leftover loan shown, with a worked example table.
- Report-line explainer (trim/options, mileage, condition, projected sold, comparables).
- Bug fixed in the shared waterfall (salvage before lienholder).
