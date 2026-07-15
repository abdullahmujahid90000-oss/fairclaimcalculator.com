# FairClaimCalculator.com — Content & AdSense Quality Standard

Internal reference only (not part of the live site). Every new page — article or
calculator — should clear every item below before it's considered "done." This
exists so quality stays consistent across a daily/every-other-day publishing
cadence instead of drifting as the site grows.

## 1. E-E-A-T / Content Quality

- [ ] 700–1,000 words of genuine prose in `<main>` (600 is an absolute floor —
      thin pages are the #1 AdSense rejection trigger).
- [ ] Says something a competitor's generic listicle doesn't — a worked
      example, a specific number, a named exception, a "here's what people
      get wrong" angle. No content that could've been written without
      knowing the topic.
- [ ] At least one `.example-box` worked example with realistic (not
      suspiciously round) numbers.
- [ ] Every legal/financial claim is hedged appropriately ("generally,"
      "typically," "in most states," "consult an attorney") — never stated as
      a universal rule when state law varies.
- [ ] No fabricated statistics, no fake citations, no invented case names or
      quotes attributed to real people/organizations.
- [ ] Ends with (or includes) a nudge toward professional consultation where
      the topic is genuinely case-specific — keeps the site in "educational
      tool," not "legal advice," territory.
- [ ] `<em>Last updated: [Month Year]</em>` under the H1, and the editorial
      bio block at the bottom linking to `/about.html`.

## 2. AdSense Policy Compliance

- [ ] No directive advice ("you should sue," "you should accept $X") —
      informational framing only ("here's how this is typically evaluated").
- [ ] No sensitive-content mishandling — topics like wrongful death or
      catastrophic injury are written respectfully, without graphic detail
      or exploitative framing.
- [ ] Page doesn't collect or store personal case data; any form fields
      remain client-side only (matches existing calculator behavior).
- [ ] Cookie consent banner + `/js/main.js` included unmodified — no ad or
      analytics script fires before consent.
- [ ] Footer legal links (Privacy, Terms, Disclaimer) present and unedited.
- [ ] `ads.txt` stays absent until Google issues a publisher ID — do not
      add it preemptively.

## 3. On-Page SEO (must match, not just resemble, the existing template)

- [ ] Title: 50–65 characters, unique sitewide, includes primary keyword
      naturally.
- [ ] Meta description: 150–160 characters, unique sitewide, includes a
      reason to click.
- [ ] `<link rel="canonical">` self-references the **www** URL —
      `https://www.fairclaimcalculator.com/...` (never bare apex).
- [ ] OG + Twitter Card tags present, using `images/og-default.png` unless a
      page-specific image exists.
- [ ] `FAQPage` JSON-LD with 2–3 questions that **exactly match** the
      visible `.faq` block text — no schema/content mismatch.
- [ ] One clear H1; logical H2/H3 hierarchy; no skipped levels.
- [ ] Favicon block present (`favicon.ico`, 32×32, 16×16, apple-touch-icon)
      — copy verbatim from any existing page's `<head>`.
- [ ] `<meta name="viewport">` present; no fixed pixel widths that break
      mobile.

## 4. Internal Linking (prevents orphan pages — this is the step most
   likely to get skipped, so check it explicitly every time)

- [ ] New page links out to 2–3 relevant existing articles/calculators in
      body copy (not just the closing "Try It Yourself" block).
- [ ] "Try It Yourself" block links to the most relevant calculator(s).
- [ ] At least **one existing page** gets edited to link back to the new
      page — new content should never launch as a dead-end with zero
      inbound internal links.
- [ ] Added to `/articles/index.html` hub listing.

## 5. Technical Publish Checklist (run the same verification every time)

- [ ] Added to `sitemap.xml` with `https://www.fairclaimcalculator.com/...`
      (www form) and an appropriate priority (0.6 for standard articles,
      0.7 for pillar/hub pages that multiple other pages link into).
- [ ] Tag-balance check passes (no unclosed/mismatched HTML tags).
- [ ] JSON-LD block parses as valid JSON.
- [ ] All internal `href`/`src` references resolve to real files.
- [ ] Page loads under the shared `/css/style.css` — no page-specific
      stylesheet, no inline `<style>` blocks except small scoped tweaks
      identical in spirit to what's already used elsewhere.

## 6. Topic Selection Rule

Before writing, confirm the topic doesn't meaningfully overlap an existing
page (check `/articles/index.html`). Prefer topics that are: (a) genuinely
useful to someone mid-claim, (b) specific enough to say something concrete,
(c) not requiring a full 50-state table (accuracy/liability risk — use
"verify your state" framing instead, as done in the existing state-law
hub articles).
