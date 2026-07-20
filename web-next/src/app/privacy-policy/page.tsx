import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | FairClaimCalculator",
  description:
    "Privacy policy for FairClaimCalculator.com — how we handle cookies, data, and third-party advertising including Google AdSense.",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="July 2026">
      <p>
        FairClaimCalculator.com (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates this
        website to provide free educational auto-claim audit tools. This Privacy Policy explains
        what information we collect, how we use it, and your choices — including in connection
        with Google AdSense and other advertising vendors.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Tool inputs</h3>
      <p>
        The information you enter into our tools (vehicle details, mileage, offer amounts,
        comparable listings, and similar claim-related facts) is processed entirely in your
        browser using JavaScript. We do not transmit, store, or log the values you enter into our
        tools on any server. Nothing you enter — including any VIN, claim number, or policy
        number — is sent to us or to any analytics vendor.
      </p>
      <h3>Automatically collected data</h3>
      <p>
        Like most websites, we and our third-party vendors may automatically collect standard
        technical information such as your IP address (typically truncated/anonymized), browser
        type, device type, pages visited, and referring URL, via cookies and similar
        technologies, for analytics and advertising purposes. Analytics events we record are
        limited to non-sensitive categories (for example, that a tool was started or a step was
        completed) and never include the values you typed in.
      </p>

      <h2>2. Cookies and Similar Technologies</h2>
      <p>We use cookies for:</p>
      <p>
        <strong>Essential functionality</strong> — remembering your cookie consent choice.
      </p>
      <p>
        <strong>Analytics</strong> — understanding aggregate traffic patterns (e.g., Google
        Analytics), which may set cookies to distinguish unique visitors.
      </p>
      <p>
        <strong>Advertising</strong> — third-party vendors, including Google, use cookies to
        serve ads based on a user&rsquo;s prior visits to this website or other websites.
        Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you
        based on your visit to this site and/or other sites on the internet. You may opt out of
        personalized advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener">
          Google Ads Settings
        </a>
        , or generally opt out of third-party vendor use of cookies for personalized advertising
        by visiting{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">
          www.aboutads.info/choices
        </a>
        .
      </p>
      <p>
        We do not set advertising cookies until you provide consent via the cookie banner shown
        on your first visit. If you decline, you may still see ads, but they will not be
        personalized based on your browsing history.
      </p>

      <h2>3. Google AdSense</h2>
      <p>
        This site may display advertisements served by Google AdSense once approved. Third-party
        vendors, including Google, use cookies to serve ads based on your prior visits to this
        website or other websites on the internet. You can learn more about how Google uses data
        when you use our site or app in{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">
          Google&rsquo;s Partner Sites policy
        </a>
        .
      </p>

      <h2>4. Your Rights (GDPR / EEA Visitors)</h2>
      <p>
        If you are located in the European Economic Area, you have rights under the GDPR
        including the right to access, correct, delete, or restrict processing of your personal
        data, and the right to withdraw consent to cookies at any time. Non-essential cookies are
        not set until you affirmatively accept them via our cookie banner.
      </p>

      <h2>5. Your Rights (California / CCPA-CPRA Visitors)</h2>
      <p>
        If you are a California resident, you have the right to know what personal information is
        collected, to request deletion, and to opt out of the &ldquo;sale&rdquo; or
        &ldquo;sharing&rdquo; of personal information for cross-context behavioral advertising. We
        honor Global Privacy Control (GPC) signals and restricted data processing requests where
        technically supported.
      </p>

      <h2>6. Local Save and Delete Controls</h2>
      <p>
        Some tools may offer an optional &ldquo;save on this device&rdquo; feature using your
        browser&rsquo;s local storage, only after you explicitly choose it. A &ldquo;Delete my
        answers&rdquo; control is available to clear anything saved locally. Nothing saved this
        way is transmitted to us.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        Tool inputs are never stored on our servers. Standard analytics/advertising cookie data
        is retained according to the retention periods of our third-party vendors (e.g., Google),
        which are described in their own privacy policies.
      </p>

      <h2>8. Children&rsquo;s Privacy</h2>
      <p>
        This site is not directed to children under 13, and we do not knowingly collect personal
        information from children under 13.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Material changes will be reflected by
        updating the &ldquo;Last updated&rdquo; date above.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        Questions about this policy or your data can be sent via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
