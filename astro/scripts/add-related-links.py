#!/usr/bin/env python3
"""Append extra relatedLinks to guide pages so thinly-linked guides and forms
get more contextual internal links. Idempotent: skips hrefs already present.
Run from astro/:  python3 scripts/add-related-links.py
"""
import re, os
P = "src/pages/"
G = "/guides/"
L = {
 "dv_inherent":  (G+"diminished-value/inherent-vs-repair-related-diminished-value/", "Inherent vs. repair-related diminished value"),
 "dv_leased":    (G+"diminished-value/leased-vehicle-diminished-value/", "Diminished value on a leased vehicle"),
 "tl_salestax":  (G+"total-loss/sales-tax-title-fees-on-a-total-loss/", "Sales tax and title fees on a total loss"),
 "tl_retained":  (G+"total-loss/owner-retained-total-loss-and-salvage-titles/", "Keeping a totaled car: owner-retained and salvage titles"),
 "tl_gap":       (G+"total-loss/gap-insurance-loan-lease-after-total-loss/", "GAP insurance after a total loss"),
 "tl_reading":   (G+"total-loss/reading-your-total-loss-valuation-report/", "How to read your total loss valuation report"),
 "cp_dvvstl":    (G+"claim-process/diminished-value-vs-total-loss-which-claim/", "Diminished value vs. total loss: which claim fits?"),
 "dv_17c":       (G+"diminished-value/the-17c-formula-history-calculation-and-limits/", "The 17c formula: history, calculation and limits"),
 "cp_rental":    (G+"claim-process/rental-car-loss-of-use-reimbursement/", "Rental car and loss-of-use reimbursement"),
 "f_dvletter":   ("/forms/diminished-value-claim-letter/", "Diminished value claim letter template"),
 "f_dispute":    ("/forms/total-loss-valuation-dispute-letter/", "Total loss valuation dispute letter template"),
 "f_comps":      ("/forms/comparable-vehicles-worksheet/", "Comparable vehicles worksheet"),
 "f_complaint":  ("/forms/insurance-complaint-worksheet/", "Insurance complaint worksheet"),
 "f_rentallog":  ("/forms/rental-loss-of-use-log/", "Rental and loss-of-use log"),
}
# source page (relative to src/pages) -> link keys to add
PLAN = {
 "guides/diminished-value/what-is-diminished-value": ["dv_inherent","dv_leased","f_dvletter"],
 "guides/diminished-value/the-17c-formula-history-calculation-and-limits": ["dv_inherent","f_dvletter"],
 "guides/diminished-value/building-diminished-value-market-evidence": ["dv_inherent","f_dvletter","f_comps"],
 "guides/diminished-value/state-laws-first-party-diminished-value-claims": ["dv_leased","dv_17c","f_dvletter"],
 "guides/claim-process/first-party-vs-third-party-auto-claims": ["cp_dvvstl","cp_rental"],
 "guides/claim-process/what-to-do-after-a-car-accident": ["cp_dvvstl","cp_rental","tl_gap"],
 "guides/claim-process/how-to-respond-to-a-lowball-offer": ["tl_reading","f_dispute","f_complaint"],
 "guides/claim-process/filing-a-complaint-with-your-state-insurance-department": ["f_complaint"],
 "guides/claim-process/auto-claim-evidence-checklist": ["cp_rental","f_rentallog"],
 "guides/claim-process/when-to-consider-an-independent-appraisal-or-attorney": ["tl_reading","cp_dvvstl"],
 "guides/claim-process/rental-car-loss-of-use-reimbursement": ["f_rentallog"],
 "guides/total-loss/how-insurers-value-a-total-loss-vehicle": ["tl_reading","tl_salestax","tl_retained"],
 "guides/total-loss/how-to-dispute-a-total-loss-valuation": ["tl_reading","tl_salestax","tl_gap","f_dispute","f_comps"],
 "guides/total-loss/acv-vs-replacement-cost-loan-payoff-asking-price": ["tl_gap","tl_salestax","tl_retained"],
 "guides/total-loss/common-valuation-report-errors": ["tl_reading","f_dispute","tl_salestax"],
 "guides/total-loss/finding-your-own-comparable-vehicles": ["tl_reading","f_comps"],
 "guides/total-loss/reading-your-total-loss-valuation-report": ["tl_gap"],
 "guides/total-loss/state-total-loss-threshold-laws": ["tl_retained","tl_salestax"],
 "guides/total-loss/gap-insurance-loan-lease-after-total-loss": ["tl_retained","tl_salestax"],
 "guides/diminished-value": ["dv_inherent","dv_leased"],
}
CAP = 7
def main():
    n = 0
    for rel, keys in PLAN.items():
        f = P + rel + "/index.astro"
        if not os.path.exists(f): print("MISSING", f); continue
        s = open(f, encoding="utf8").read()
        m = re.search(r'relatedLinks=\{\[(.*?)\]\}', s, flags=re.S)
        if not m: print("NO relatedLinks", f); continue
        body = m.group(1)
        have = set(re.findall(r'href:\s*"([^"]+)"', body))
        path = "/" + rel + "/"
        add = [k for k in keys if L[k][0] not in have and L[k][0] != path]
        room = max(0, CAP - len(have))
        add = add[:room]
        if not add: continue
        lines = "".join(f'    {{ label: "{L[k][1]}", href: "{L[k][0]}" }},\n' for k in add)
        new_body = body.rstrip() + ("\n" if not body.rstrip().endswith(",") and False else "")
        nb = body.rstrip()
        if not nb.endswith(","): nb += ","
        nb += "\n" + lines + "  "
        s = s[:m.start(1)] + nb + s[m.end(1):]
        open(f, "w", encoding="utf8").write(s); n += 1
        print(f"{rel}: +{len(add)}")
    print("pages updated", n)
main()
