import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <Reveal stagger={0} className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {lastUpdated && (
            <p className="mt-3 text-sm text-muted-foreground">
              <em>Last updated: {lastUpdated}</em>
            </p>
          )}
          <div className="legal-prose mt-8">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
