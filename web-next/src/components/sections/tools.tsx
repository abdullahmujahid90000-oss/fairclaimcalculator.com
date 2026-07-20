import Link from "next/link";
import { ArrowUpRight, FileSearch, Scale, FileText } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TOOLS = [
  {
    icon: Scale,
    title: "Total-Loss Offer Audit",
    description:
      "Checks your insurer's valuation report against a mismatch checklist, compares their comps to yours, and flags outliers and range issues — the flagship tool.",
    href: "/total-loss-offer-calculator",
    status: "Live",
  },
  {
    icon: FileSearch,
    title: "Settlement Breakdown",
    description:
      "Breaks a diminished-value settlement check down into its components so you can see exactly what you were paid for, and what wasn't addressed.",
    href: "/settlement-check-breakdown",
    status: "Live",
  },
  {
    icon: FileText,
    title: "Evidence Packet Builder",
    description:
      "Assembles the mismatches and comps you've flagged into a clean, exportable summary you can attach to a follow-up with your adjuster.",
    href: "#",
    status: "Coming soon",
  },
];

export function Tools() {
  return (
    <section className="py-24 sm:py-30">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            One job per tool, done properly
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Each tool audits one specific part of a claim offer — no
            do-everything dashboard, no guesswork.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="mt-16 grid gap-6 md:grid-cols-3">
          {TOOLS.map(({ icon: Icon, title, description, href, status }) => (
            <Link key={title} href={href} className="group block">
              <Card interactive className="h-full">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={20} />
                  </div>
                  <Badge className={status === "Live" ? "border-accent/30 text-accent" : undefined}>
                    {status}
                  </Badge>
                </div>
                <CardHeader className="mt-5">
                  <CardTitle className="flex items-center gap-1.5">
                    {title}
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
