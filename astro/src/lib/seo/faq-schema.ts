/**
 * Builds a schema.org FAQPage JSON-LD object from the same faqs array a
 * page renders visibly via FaqSection.astro. Keeping both in one source
 * array (passed to both) is deliberate: Google's structured-data
 * guidelines require FAQ schema to match visible on-page text exactly, and
 * generating both from one array makes that impossible to drift.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
