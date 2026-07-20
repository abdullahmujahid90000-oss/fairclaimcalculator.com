import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About | FairClaimCalculator",
  description:
    "About FairClaimCalculator.com — why we rebuilt this site around auto diminished-value and total-loss claim auditing, and how we research what we publish.",
};

export default function AboutPage() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <Reveal stagger={0} className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            About FairClaimCalculator.com
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <em>Last updated: July 2026</em>
          </p>

          <div className="legal-prose mt-8">
            <h2>Why This Site Is Being Rebuilt</h2>
            <p>
              FairClaimCalculator.com originally hosted a set of general personal-injury
              settlement calculators. We&rsquo;re retiring that direction and rebuilding the site
              around a narrower, more useful problem: helping U.S. vehicle owners check the facts
              and arithmetic behind a <strong>diminished-value</strong> or{" "}
              <strong>total-loss</strong> auto insurance offer.
            </p>
            <p>
              That problem deserves its own focused tool rather than a small corner of a broader
              site. Vehicle owners handed an actual-cash-value number or told their repaired car
              &ldquo;doesn&rsquo;t qualify&rdquo; for diminished value are often given a single
              figure with no visible math, no comparable-vehicle detail, and no easy way to check
              whether the insurer&rsquo;s own facts about the vehicle are even correct. The gap
              isn&rsquo;t another calculator that produces a different single number — it&rsquo;s
              a tool that shows its work and lets the owner audit the offer itself.
            </p>

            <h2>What We Are — and Are Not</h2>
            <p>
              FairClaimCalculator is an educational self-help and document-organization resource.
              It is <strong>not</strong> a law firm, insurer, public adjuster, appraisal company,
              or medical service, and it does not promise any recovery or settlement outcome. It
              will never tell a user that a specific dollar amount is legally owed — that depends
              on the user&rsquo;s state, policy language, and facts, and should be verified by a
              qualified professional.
            </p>
            <p>
              No qualified insurance-law attorney or credentialed appraiser is currently retained
              to review this site&rsquo;s content. Until that changes, any page discussing
              state-specific law will say so plainly and stay unpublished from search results
              until it has real, cited primary sources behind it.
            </p>

            <h2>How We Research What We Publish</h2>
            <p>
              Legal and regulatory claims are checked against primary sources — statutes, court
              opinions, and state insurance regulator guidance — before publication, with the
              source cited next to the claim. We do not publish keyword-volume,
              settlement-amount, or &ldquo;average recovery&rdquo; statistics we can&rsquo;t
              attribute to a named, dated source. If you spot something outdated or incorrect,
              please <a href="/contact">let us know</a>.
            </p>

            <h2>How This Site Makes Money</h2>
            <p>
              The plan is limited, clearly-labeled display advertising once the site qualifies,
              plus — later, and only when real, vetted, and disclosed — referrals to independent
              auto appraisers. We do not accept payment to rank a referral higher, and no
              professional partnership will be represented on this site unless it actually
              exists.
            </p>
          </div>

          <Card className="mt-10 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              DB
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">David Bennett — Founder &amp; Editor</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Independent web publisher, not an attorney, insurer, or appraiser. Content on this
                site is researched from public primary sources and reviewed for accuracy on an
                ongoing basis. Always verify anything case-specific with a licensed attorney or
                qualified appraiser in your state.
              </p>
            </div>
          </Card>

          <div className="legal-prose mt-10">
            <h2>Contact</h2>
            <p>
              Questions, corrections, or feedback are always welcome via our{" "}
              <a href="/contact">Contact page</a>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
