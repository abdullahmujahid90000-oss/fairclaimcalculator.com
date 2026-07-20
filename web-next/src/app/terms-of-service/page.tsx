import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | FairClaimCalculator",
  description:
    "Terms of Service for FairClaimCalculator.com — the rules and conditions that apply when you use our free auto diminished-value and total-loss claim audit tools.",
  robots: { index: false, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="July 2026">
      <p>
        By accessing or using FairClaimCalculator.com (the &ldquo;Site&rdquo;), you agree to
        these Terms of Service. If you do not agree, please do not use the Site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>
        The Site provides free, self-service educational tools and articles related to auditing
        auto diminished-value and total-loss insurance claim offers. You may use the Site for
        personal, non-commercial informational purposes.
      </p>

      <h2>2. No Professional Advice</h2>
      <p>
        Content on this Site, including tool outputs, does not constitute legal, financial, or
        appraisal advice. See our full <a href="/disclaimer">Legal Disclaimer</a> for details.
      </p>

      <h2>3. No Warranty</h2>
      <p>
        The Site and its tools are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
        without warranties of any kind, express or implied, including accuracy, completeness, or
        fitness for a particular purpose. Tool outputs are estimates and organizational aids only
        and may not reflect any real-world outcome.
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, FairClaimCalculator.com and its operators shall
        not be liable for any indirect, incidental, special, or consequential damages arising
        from your use of, or inability to use, the Site.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        The content, design, and code of this Site are owned by FairClaimCalculator.com unless
        otherwise noted, and may not be reproduced or redistributed without permission, except
        for personal, non-commercial reference.
      </p>

      <h2>6. Third-Party Advertising</h2>
      <p>
        This Site may display advertisements served by third parties, including Google AdSense.
        We are not responsible for the content of third-party advertisements.
      </p>

      <h2>7. Changes to the Site or Terms</h2>
      <p>
        We may modify the Site or these Terms at any time. Continued use of the Site after
        changes constitutes acceptance of the updated Terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the United States and the state in which the
        Site operator resides, without regard to conflict-of-law principles.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms can be sent via our <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
