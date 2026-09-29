// Generates the free fillable PDF templates into public/downloads/ from
// scripts/pdf-templates.mjs. Runs in `prebuild`, so the PDFs always match
// the template content and are never committed (see .gitignore).

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PDF_TEMPLATES } from "./pdf-templates.mjs";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "downloads");

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_SPACE = 40;
const GREEN = rgb(0.086, 0.325, 0.2); // matches the site's primary color
const GREY = rgb(0.35, 0.35, 0.35);
const FIELD_BORDER = rgb(0.6, 0.6, 0.6);
const FIELD_BG = rgb(0.96, 0.98, 1);

function wrap(text, font, size, width) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildPdf(template) {
  const doc = await PDFDocument.create();
  doc.setTitle(`${template.title} — FairClaimCalculator`);
  doc.setAuthor("FairClaimCalculator.com");
  doc.setSubject(template.intro);
  doc.setCreator("FairClaimCalculator.com");
  doc.setKeywords(["auto insurance claim", "template", template.title]);

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const form = doc.getForm();

  let page;
  let y;
  let fieldCount = 0;
  const fieldName = (label) => `f${++fieldCount}_${label.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}`;

  function newPage() {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  }
  function ensure(height) {
    if (y - height < MARGIN + FOOTER_SPACE) newPage();
  }
  function text(str, { font = regular, size = 10, color = rgb(0, 0, 0), gap = 4 } = {}) {
    for (const line of wrap(str, font, size, CONTENT_W)) {
      ensure(size + gap);
      page.drawText(line, { x: MARGIN, y: y - size, size, font, color });
      y -= size + gap;
    }
  }
  function textField(label, x, width, lines = 1) {
    const height = lines > 1 ? 14 * lines + 6 : 18;
    page.drawText(label, { x, y: y - 8, size: 7.5, font: regular, color: GREY });
    const f = form.createTextField(fieldName(label));
    if (lines > 1) f.enableMultiline();
    f.addToPage(page, {
      x,
      y: y - 11 - height,
      width,
      height,
      borderColor: FIELD_BORDER,
      backgroundColor: FIELD_BG,
      borderWidth: 0.6,
      font: regular,
    });
    f.setFontSize(lines > 1 ? 9 : 10);
    return height + 11;
  }

  newPage();
  page.drawText(template.title, { x: MARGIN, y: y - 18, size: 18, font: bold, color: GREEN });
  y -= 28;
  text(template.intro, { size: 9.5, color: GREY });
  y -= 6;

  for (const block of template.blocks) {
    if (block.h) {
      ensure(30);
      y -= 8;
      page.drawText(block.h, { x: MARGIN, y: y - 12, size: 12, font: bold, color: GREEN });
      page.drawLine({ start: { x: MARGIN, y: y - 16 }, end: { x: PAGE_W - MARGIN, y: y - 16 }, thickness: 0.5, color: GREEN });
      y -= 22;
    } else if (block.p) {
      y -= 2;
      text(block.p, { size: 10 });
      y -= 4;
    } else if (block.field) {
      const lines = block.lines ?? 1;
      ensure(lines > 1 ? 14 * lines + 22 : 34);
      y -= textField(block.field, MARGIN, CONTENT_W, lines) + 6;
    } else if (block.row) {
      ensure(34);
      const gap = 10;
      const width = (CONTENT_W - gap * (block.row.length - 1)) / block.row.length;
      let used = 0;
      block.row.forEach((label, i) => {
        used = textField(label, MARGIN + i * (width + gap), width);
      });
      y -= used + 6;
    } else if (block.check) {
      ensure(18);
      const cb = form.createCheckBox(fieldName(block.check));
      cb.addToPage(page, { x: MARGIN, y: y - 12, width: 11, height: 11, borderColor: FIELD_BORDER, borderWidth: 0.8 });
      const lines = wrap(block.check, regular, 10, CONTENT_W - 20);
      lines.forEach((line, i) => {
        page.drawText(line, { x: MARGIN + 18, y: y - 10 - i * 13, size: 10, font: regular });
      });
      y -= Math.max(18, lines.length * 13 + 5);
    } else if (block.table) {
      const cols = block.table.length;
      const colW = CONTENT_W / cols;
      const rowH = 20;
      const drawHeader = () => {
        ensure(rowH + 28);
        block.table.forEach((label, i) => {
          const lines = wrap(label, bold, 7.5, colW - 4);
          lines.forEach((line, j) => {
            page.drawText(line, { x: MARGIN + i * colW + 2, y: y - 8 - j * 9, size: 7.5, font: bold, color: GREY });
          });
        });
        y -= 22;
      };
      drawHeader();
      for (let r = 0; r < block.rows; r++) {
        if (y - rowH < MARGIN + FOOTER_SPACE) {
          newPage();
          drawHeader();
        }
        block.table.forEach((label, i) => {
          const f = form.createTextField(fieldName(`r${r + 1}_${label}`));
          f.addToPage(page, {
            x: MARGIN + i * colW,
            y: y - rowH,
            width: colW,
            height: rowH,
            borderColor: FIELD_BORDER,
            backgroundColor: FIELD_BG,
            borderWidth: 0.5,
            font: regular,
          });
          f.setFontSize(8);
        });
        y -= rowH;
      }
      y -= 10;
    }
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const footer = `Free template from FairClaimCalculator.com — educational only, not legal advice.   Page ${i + 1} of ${pages.length}`;
    p.drawText(footer, { x: MARGIN, y: MARGIN - 20, size: 7.5, font: regular, color: GREY });
  });

  form.updateFieldAppearances(regular);
  return doc.save();
}

await mkdir(outDir, { recursive: true });
for (const template of PDF_TEMPLATES) {
  const bytes = await buildPdf(template);
  await writeFile(join(outDir, `${template.slug}.pdf`), bytes);
}
console.log(`[pdfs] generated ${PDF_TEMPLATES.length} templates in public/downloads/`);
