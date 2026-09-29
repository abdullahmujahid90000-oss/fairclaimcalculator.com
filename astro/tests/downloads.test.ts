import { describe, it, expect } from "vitest";
import { DOWNLOAD_PAGES } from "../src/lib/content/downloads";
import { PDF_TEMPLATES } from "../scripts/pdf-templates.mjs";

describe("download pages and PDF templates", () => {
  it("have exactly the same slugs, so every landing page has a PDF and vice versa", () => {
    const pages = DOWNLOAD_PAGES.map((p) => p.slug).sort();
    const pdfs = (PDF_TEMPLATES as { slug: string }[]).map((t) => t.slug).sort();
    expect(pages).toEqual(pdfs);
  });

  it("every landing page has substantive content and working internal links", () => {
    for (const p of DOWNLOAD_PAGES) {
      expect(p.whenToUse.length).toBeGreaterThanOrEqual(2);
      expect(p.howTo.length).toBeGreaterThanOrEqual(3);
      expect(p.faqs.length).toBeGreaterThanOrEqual(2);
      expect(p.metaTitle.length).toBeLessThanOrEqual(60);
      for (const r of p.related) expect(r.href).toMatch(/^\/.*\/$/);
    }
  });
});
