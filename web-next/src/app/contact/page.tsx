import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact | FairClaimCalculator",
  description:
    "Contact FairClaimCalculator.com with questions, corrections, or feedback about our auto diminished-value and total-loss claim audit tools.",
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <Reveal stagger={0} className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Have a question, correction, or feedback about this site or its tools? We read every
            message.
          </p>

          <Card className="mt-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Mail size={20} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Get in Touch</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Email us directly at:{" "}
              <a href="mailto:info@fairclaimcalculator.com" className="text-accent hover:underline">
                info@fairclaimcalculator.com
              </a>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We typically respond within 2–3 business days. For questions about your specific
              claim or policy, please contact a licensed attorney or your state insurance
              department — we&rsquo;re not able to give case-specific advice by email.
            </p>
          </Card>

          <div className="legal-prose mt-10">
            <h2>Content Corrections</h2>
            <p>
              If you believe any information on this site is outdated or inaccurate — especially
              anything referencing state-specific laws or regulator guidance, which change
              periodically — please tell us which page and what you believe is incorrect. We
              review and update content on an ongoing basis.
            </p>

            <h2>Business Inquiries</h2>
            <p>
              For advertising, partnership, or press inquiries, please use the email above and
              include &ldquo;Business Inquiry&rdquo; in your subject line.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
