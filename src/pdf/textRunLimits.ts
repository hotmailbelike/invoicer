import { LABEL_LETTER_SPACING, columnPercent, fontSizes, spacing } from './theme';

// The widest glyph in the embedded Inter subset is "W": 0.985em regular, 1.02em semibold.
// Budgeting every character at that width guarantees a broken run fits even if it is all Ws;
// realistic tokens simply break a little earlier than strictly necessary.
const WIDEST_GLYPH_EM = 1.02;

// A4 is narrower than Letter, so limits that fit A4 also fit Letter.
const A4_WIDTH_PT = 595.28;
const CONTENT_WIDTH_PT = A4_WIDTH_PT - 2 * spacing.pageMargin;

function percentOfContent(percent: number): number {
  return (CONTENT_WIDTH_PT * percent) / 100;
}

function maxRunLength(widthPt: number, fontSize: number, letterSpacing = 0): number {
  return Math.max(1, Math.floor(widthPt / (fontSize * WIDEST_GLYPH_EM + letterSpacing)));
}

const tableCellPadding = 2 * spacing.cellX;

/** Longest unbroken run of characters that fits each text slot on the page. */
export const textRunLimits = {
  fullWidth: maxRunLength(CONTENT_WIDTH_PT, fontSizes.body),
  halfColumn: maxRunLength(percentOfContent(columnPercent.half) - spacing.block, fontSizes.body),
  metaValue: maxRunLength(percentOfContent(columnPercent.meta), fontSizes.body),
  label: maxRunLength(CONTENT_WIDTH_PT, fontSizes.label, LABEL_LETTER_SPACING),
  descriptionBesideQuantities: maxRunLength(
    percentOfContent(100 - columnPercent.quantity - columnPercent.rate - columnPercent.amount) -
      tableCellPadding,
    fontSizes.body,
  ),
  descriptionAlone: maxRunLength(
    percentOfContent(100 - columnPercent.amount) - tableCellPadding,
    fontSizes.body,
  ),
};
