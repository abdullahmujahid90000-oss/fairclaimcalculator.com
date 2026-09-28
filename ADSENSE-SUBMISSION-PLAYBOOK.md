# ADSENSE-SUBMISSION-PLAYBOOK.md: how to get approved on the first try

Written 2026-09-28. This is the owner's checklist, in order. Steps marked
**YOU** need your Google account or your real personal details, so only you
can do them. Everything marked **DONE** is already in the code.

---

## Stage 0: What's already done in the code

| Done | Item | Why AdSense cares |
|---|---|---|
| DONE | 10 working calculators, 23 guides, 51 state pages | "Enough original content". Thin sites are the #1 rejection reason |
| DONE | About, Contact, Privacy, Terms, Disclaimer, Editorial policy, Methodology, Sources, Corrections, Advertising disclosure | Missing trust pages are the #2 rejection reason |
| DONE | Privacy policy has Google's required AdSense cookie wording and opt-out links (`/privacy/#advertising`) | Required by the AdSense program policies |
| DONE | Clear navigation, no broken links (0 of 4,474), 0 accessibility violations, works on mobile | Rejections for "site navigation" or "poor user experience" |
| DONE | Article + Person + FAQ + Breadcrumb structured data on guides | E-E-A-T signals for money/legal (YMYL) topics |
| DONE | State pages each carry state-specific data (bordering-state comparison, national rank, a cross-border worked example) | Avoids "scaled / templated content" |
| DONE | `google-adsense-account` meta tag + `ads.txt` generated automatically once you paste your ID | Site ownership verification |
| DONE | Ad slots in guides and below the FAQ on calculators, never next to buttons or results | "Accidental click" policy |
| DONE | `llms.txt` for AI assistants | Helps ChatGPT, Perplexity and others cite the site |

---

## Stage 1: Before you apply (1–3 weeks)

1. **YOU: Fill in your real author details** in `astro/src/lib/site/author.ts`:
   a 2–4 sentence real bio, a real photo (put it in `astro/public/images/`),
   and at least one real public profile (LinkedIn is best). **This is the
   single biggest thing still missing.** In 2026, reviewers of money and
   legal sites look for a real person. Never invent credentials. "Independent
   researcher who built this after my own total-loss claim" is fine *if it's
   true*.
2. **YOU: Google Search Console.** Go to search.google.com/search-console →
   Add property → Domain `fairclaimcalculator.com` → verify with the DNS TXT
   record → Sitemaps → submit `https://www.fairclaimcalculator.com/sitemap-index.xml`.
3. **YOU: Request indexing** (URL Inspection → Request indexing) for the
   homepage, `/calculators/`, `/guides/`, and your top 10 calculators and
   guides. Google allows about 10–12 a day.
4. **Wait until Search Console shows at least 30–50 pages as "Indexed"** (Pages
   report). If you apply while Google has barely crawled the site, it's the
   most common cause of "Site isn't ready" / "Low value content".
5. **Check that `info@fairclaimcalculator.com` actually receives mail.** Reviewers
   sometimes test the contact route.
6. **Keep publishing 1–2 new real guides a week** during this wait. A site that
   is visibly being updated reads as "active".

## Stage 2: Apply

1. **YOU:** Go to adsense.google.com → Get started → enter `https://www.fairclaimcalculator.com`.
   Use your real legal name and address. The payment name must match your ID
   and bank account, or payouts fail later.
2. AdSense shows your publisher ID (`ca-pub-` + 16 digits). **Paste it into
   `astro/src/lib/ads/config.ts`** as `ADSENSE_PUBLISHER_ID`. Leave
   `ADS_SERVING_ENABLED = false`. Commit and push to `main`.
3. After the deploy finishes, check both of these load:
   - `https://www.fairclaimcalculator.com/ads.txt` shows `google.com, pub-…, DIRECT, f08c47fec0942fa0`
   - View the page source of the homepage and find `google-adsense-account`
4. In AdSense, choose **"Meta tag"** as the verification method → Verify →
   **Request review**.
5. **Don't change the site's structure while under review** (no URL changes,
   no mass deletes). Adding new guides is fine.
6. Review usually takes **1–14 days**, sometimes up to 4 weeks.

## Stage 3: After approval

1. **YOU:** AdSense → **Privacy & messaging** → create a **European regulations**
   message (GDPR/TCF) **and** a **U.S. state regulations** message. Publish both.
   This is the free, Google-certified consent tool the site's privacy policy
   refers to.
2. Set `ADS_SERVING_ENABLED = true` in `astro/src/lib/ads/config.ts`, then push.
3. AdSense → Ads → turn on **Auto ads**. Start with in-page ads and anchor ads on,
   vignettes off (they annoy calculator users).
4. Optional, usually better earnings: create 3 display ad units and paste their
   slot numbers into `AD_UNIT_IDS` in the same file:
   `guide-top`, `guide-bottom`, `calculator-after-faq`.
5. AdSense → Brand safety → Blocking controls: consider blocking competitor
   categories you don't want (for example, "get rich quick" or dating).

## If you get rejected anyway

| Rejection message | What it actually means | Fix |
|---|---|---|
| Low value content | Too few indexed pages, or pages look generic | Wait for more indexing, add author details, add 5 more in-depth guides |
| Site isn't ready / Site down or unavailable | Google couldn't crawl it | Check the site loads and robots.txt; wait 1 week |
| Site navigation | Menus hard to use or broken links | Already handled; re-check after any change |
| Policy violation | Usually copied content or a prohibited topic | Check no text was copied from other sites |
| Valuable inventory: no content | Pages that are mostly forms | Calculators already carry FAQs and explanations; reapply |

Fix the stated reason, wait **at least 2 weeks**, then reapply. Rapid repeated
reapplications hurt.

## Realistic expectations

- Nobody can guarantee approval or earnings.
- New sites typically take **3–9 months** to build meaningful Google traffic.
- Auto-insurance and claims ads are among the highest-paying ad categories,
  but earnings depend entirely on traffic. Here's a rough scale, **not a
  forecast**: 10,000 visits a month at a $10–$30 page RPM is about $100–$300
  a month.
