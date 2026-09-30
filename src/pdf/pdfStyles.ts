import { StyleSheet } from '@react-pdf/renderer';
import {
  BODY_LINE_HEIGHT,
  LABEL_LETTER_SPACING,
  PDF_FONT_FAMILY,
  colors,
  columnPercent,
  fontSizes,
  spacing,
} from './theme';

export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: spacing.pageMargin,
    paddingBottom: spacing.pageMargin + spacing.section,
    paddingHorizontal: spacing.pageMargin,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: fontSizes.body,
    color: colors.body,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: 600,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  meta: {
    width: `${columnPercent.meta}%`,
    alignItems: 'flex-end',
  },
  metaItem: {
    alignItems: 'flex-end',
    marginBottom: spacing.tight + 2,
  },
  metaValue: {
    fontSize: fontSizes.body,
    lineHeight: BODY_LINE_HEIGHT,
    color: colors.ink,
  },
  divider: {
    borderBottomWidth: 0.75,
    borderBottomColor: colors.rule,
    marginVertical: spacing.section - 6,
  },
  label: {
    fontSize: fontSizes.label,
    fontWeight: 600,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: LABEL_LETTER_SPACING,
    marginBottom: 3,
  },
  row: {
    flexDirection: 'row',
  },
  halfColumn: {
    width: `${columnPercent.half}%`,
    paddingRight: spacing.block,
  },
  fullColumn: {
    width: '100%',
  },
  section: {
    marginBottom: spacing.section,
  },
  text: {
    fontSize: fontSizes.body,
    lineHeight: BODY_LINE_HEIGHT,
    color: colors.ink,
  },
  simpleTotal: {
    alignItems: 'flex-end',
    borderTopWidth: 0.75,
    borderTopColor: colors.rule,
    paddingTop: spacing.block,
  },
  totalDueAmount: {
    fontSize: fontSizes.totalDue,
    fontWeight: 600,
    color: colors.ink,
  },
  table: {
    marginBottom: spacing.block,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.rule,
  },
  cell: {
    paddingVertical: spacing.cellY,
    paddingHorizontal: spacing.cellX,
  },
  headerCell: {
    fontSize: fontSizes.label,
    fontWeight: 600,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: LABEL_LETTER_SPACING,
  },
  descriptionColumn: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    fontSize: fontSizes.body,
    lineHeight: BODY_LINE_HEIGHT,
    color: colors.ink,
  },
  quantityColumn: {
    width: `${columnPercent.quantity}%`,
    textAlign: 'right',
  },
  rateColumn: {
    width: `${columnPercent.rate}%`,
    textAlign: 'right',
  },
  amountColumn: {
    width: `${columnPercent.amount}%`,
    textAlign: 'right',
    color: colors.ink,
  },
  totals: {
    alignSelf: 'flex-end',
    width: `${columnPercent.totals}%`,
    marginBottom: spacing.section,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: spacing.cellX,
  },
  totalsEmphasis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.75,
    borderTopColor: colors.ink,
    marginTop: spacing.tight,
    paddingTop: spacing.tight + 2,
    paddingBottom: spacing.tight,
    paddingHorizontal: spacing.cellX,
  },
  totalsEmphasisLabel: {
    fontWeight: 600,
    color: colors.ink,
  },
  totalsEmphasisValue: {
    fontSize: fontSizes.totalDue - 3,
    fontWeight: 600,
    color: colors.ink,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.pageMargin / 2,
    left: spacing.pageMargin,
    right: spacing.pageMargin,
    textAlign: 'right',
    fontSize: fontSizes.footer,
    color: colors.muted,
  },
});
