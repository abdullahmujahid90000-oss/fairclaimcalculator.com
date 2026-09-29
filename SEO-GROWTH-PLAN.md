# SEO-GROWTH-PLAN.md: how FairClaimCalculator gets found

Written 2026-09-29. Two halves: **on-page** (done in the code: what
Google reads on each page) and **off-page** (owner actions: how other sites
and people send trust and visitors here). Search-volume figures are
estimates. Check real numbers in Google Keyword Planner (free with a Google
Ads account) and in Search Console once the site has data.

---

## 1. How to see your real traffic (do this first)

| Tool | What it tells you | Where |
|---|---|---|
| **Google Search Console** | Searches you appear for, clicks, impressions, average position, indexed pages. **The most important SEO tool.** | search.google.com/search-console (verify the domain with a DNS TXT record) |
| **Google Analytics 4** | Visitors, pages viewed, where they came from. Already installed (`G-Y0W2ZWVGLZ`). It only counts visitors who accept the cookie banner, so it **undercounts**. | analytics.google.com → Reports → Acquisition |
| **Bing Webmaster Tools** | Bing search data. Bing's index also feeds ChatGPT search and Copilot. | bing.com/webmasters (can import from Search Console in one click) |

Check Search Console weekly: Performance → Queries shows exactly what people
typed to find you. Pages with many impressions but few clicks need a better
title and description.

---

## 2. Keyword map: which page targets which searches

| Search intent (what people type) | Page | Type |
|---|---|---|
| is my car totaled, total loss calculator | `/calculators/total-loss-threshold-checker/` | Tool |
| total loss settlement calculator, insurance offer too low totaled car | `/calculators/total-loss-offer-audit/` | Tool |
| diminished value calculator, 17c formula | `/calculators/diminished-value-baseline/` | Tool |
| [state] total loss threshold | `/guides/total-loss/state-total-loss-threshold-laws/[state]/` ×51 | Data |
| do I have to report a car accident in [state], [state] DMV accident report | `/guides/accident-reporting/[state]/` ×51 | Data |
| SR-1 form California, MV-104 New York, [form name] | same state pages (form name in title, FAQ and body) | Data |
| car accident information sheet pdf, what to get after a car accident | `/forms/accident-information-worksheet/` | Download |
| total loss dispute letter template | `/forms/total-loss-valuation-dispute-letter/` | Download |
| diminished value demand letter template | `/forms/diminished-value-claim-letter/` | Download |
| insurance claim log template | `/forms/claim-communication-log/` | Download |
| how to file a complaint against an insurance company | `/forms/insurance-complaint-worksheet/` + claim-process guide | Download + guide |
| car totaled still owe money / gap | `/calculators/gap-shortfall/` + GAP guide | Tool + guide |
| loss of use rental car reimbursement | `/calculators/loss-of-use-reimbursement/` + rental log PDF | Tool + download |

**Why the state and form pages matter most:** they target many small, specific
searches (51 states × several phrasings) where big sites have weaker,
generic pages, and where several popular lists are out of date.

---

## 3. On-page SEO (done)

- Titles written for real searches ("Is My Car Totaled? …", "[State] Car Accident Report: When to File (10 days)")
- Unique meta descriptions on every page
- Structured data: Article, FAQPage, BreadcrumbList, DigitalDocument (PDFs), ItemList, Organization, Person
- Every state page carries state-specific facts, a bordering-states comparison and an official source link. None are name-swapped templates.
- Internal linking: nav, footer, hubs, and cross-links between each state's accident-reporting page and its total-loss page, and from guides to tools to templates
- Sitemap with lastmod, robots.txt, canonical URLs, fast static pages, mobile-friendly, 0 accessibility violations
- `llms.txt` map for AI assistants

## 4. Off-page SEO (owner actions, in priority order)

**Rules first.** Never buy links, use link networks/PBNs, mass-submit to directories
or post AI-spun guest articles. Google penalizes these, and a penalty can also sink
the AdSense application.

1. **Search Console + Bing Webmaster Tools.** Submit `sitemap-index.xml` to both.
2. **Answer real questions where people ask them.** Reddit (r/Insurance,
   r/personalfinance, r/legaladvice, r/cars, state subreddits) and Quora. Give a
   complete answer in the post itself; link only when a page genuinely adds something
   (a state's rule, a PDF). Follow each community's self-promotion rules. One helpful
   answer a day is plenty. These bring visitors directly and teach you what people ask.
3. **Pinterest for the PDFs.** Printables do well there. Make one pin per template
   (a clean image of the first page, linking to its `/forms/` page).
4. **Journalist requests (digital PR).** Sign up free at Qwoted, Featured.com and
   Source of Sources. Answer car-insurance and accident questions. A single quote in a
   news or finance site is worth more than hundreds of weak links. Your best hook is
   the state research: "several widely shared lists are out of date — Minnesota
   repealed its driver report in 2021, Texas dropped its driver form in 2017."
5. **Outreach to people who help drivers**, offering the free PDFs as a resource:
   driving schools and driver's-ed sites (the glove-box worksheet), local legal-aid
   and consumer-help pages, credit unions (GAP and total-loss content), car-model
   owner forums, and auto-body shops' "what to do after an accident" pages. Send a
   short, personal email. No templates blasted to hundreds of addresses.
6. **Keep it fresh.** Re-check state rules and titles every 6 months (update
   `CRASH_REPORTING_CHECKED`). Add 1–2 new guides a week for the searches that show up
   in Search Console but don't have a page yet.

## 5. Content ideas that follow the same demand

Add these only with official sources, and one at a time:

- "How to get a copy of your police crash report in [state]": every state has an official ordering page and fee
- "[State] minimum car insurance requirements": state insurance department sources
- "How long does an insurance company have to settle a claim in [state]": state claim-handling regulations (unfair claims settlement practices)
- "Hit-and-run / uninsured driver: what to do in [state]"
- A glossary entry for each official form name (SR-1, MV-104, AA-600, SR21…)
