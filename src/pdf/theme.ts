// Six-digit hex only. react-pdf's colour parser rejects OKLCH colours, CSS custom properties
// and colour mixing, and pdfkit then silently paints in the previous fill — so this palette
// is never shared with the Tailwind side, whose defaults are authored in OKLCH.
type HexColor = `#${string}`;

export const colors = {
  ink: '#18181b',
  body: '#3f3f46',
  muted: '#71717a',
  rule: '#e4e4e7',
  surface: '#f4f4f5',
} satisfies Record<string, HexColor>;

// Bare numbers are points. Never rem (react-pdf's rem is 18pt) or px (rounded to whole units).
export const fontSizes = {
  title: 22,
  totalDue: 16,
  body: 9.5,
  label: 7.5,
  footer: 7.5,
};

export const spacing = {
  pageMargin: 48,
  section: 24,
  block: 12,
  tight: 4,
  cellX: 6,
  cellY: 5,
};

// Always declare this in the same style as an explicit fontSize, and never on a container.
// react-pdf multiplies a unitless line height by the fontSize declared in that style — falling
// back to 18pt, not the inherited size — and passes the resulting points down to descendants,
// where dynamic nodes such as the page-number footer multiply it again and vanish.
export const BODY_LINE_HEIGHT = 1.45;

export const LABEL_LETTER_SPACING = 0.6;

// Percentages of the content width, so one layout serves A4 and the wider Letter page.
export const columnPercent = {
  half: 50,
  meta: 45,
  quantity: 12,
  rate: 18,
  amount: 20,
  totals: 50,
};

export const PDF_FONT_FAMILY = 'Inter';
