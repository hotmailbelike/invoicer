import { Text, View } from '@react-pdf/renderer';
import { formatQuantity } from '@/domain/money/formatDecimal';
import { formatMoney } from '@/domain/money/formatMoney';
import type { PlannedLine } from '@/domain/pdf-plan/invoicePlan';
import { breakLongWords } from '../breakLongWords';
import { pdfStyles } from '../pdfStyles';
import { textRunLimits } from '../textRunLimits';

const DESCRIPTION_CHARS_PER_LINE = 50;
const MAX_UNSPLIT_ROW_LINES = 20;

// Holding a row together on one page reads better, but a row taller than the page with
// wrap={false} is silently clipped. Only rows that comfortably fit are held together.
function fitsOnOnePage(description: string): boolean {
  const estimatedLines = description
    .split('\n')
    .reduce(
      (lines, paragraph) =>
        lines + Math.max(1, Math.ceil(paragraph.length / DESCRIPTION_CHARS_PER_LINE)),
      0,
    );
  return estimatedLines <= MAX_UNSPLIT_ROW_LINES;
}

interface Props {
  readonly lines: readonly PlannedLine[];
  readonly showQuantityColumns: boolean;
  readonly currency: string;
}

export function LineItemsTable({ lines, showQuantityColumns, currency }: Props) {
  const descriptionRunLimit = showQuantityColumns
    ? textRunLimits.descriptionBesideQuantities
    : textRunLimits.descriptionAlone;
  return (
    <View style={pdfStyles.table}>
      {/* fixed inside the table repeats the header on each page the table spans, and only those. */}
      <View style={pdfStyles.tableHeader} fixed minPresenceAhead={24}>
        <Text style={[pdfStyles.cell, pdfStyles.descriptionColumn, pdfStyles.headerCell]}>
          Description
        </Text>
        {showQuantityColumns && (
          <>
            <Text style={[pdfStyles.cell, pdfStyles.quantityColumn, pdfStyles.headerCell]}>
              Qty
            </Text>
            <Text style={[pdfStyles.cell, pdfStyles.rateColumn, pdfStyles.headerCell]}>Rate</Text>
          </>
        )}
        <Text style={[pdfStyles.cell, pdfStyles.amountColumn, pdfStyles.headerCell]}>Amount</Text>
      </View>
      {lines.map((line) => {
        const description = breakLongWords(line.description, descriptionRunLimit);
        return (
          <View key={line.id} style={pdfStyles.tableRow} wrap={!fitsOnOnePage(description)}>
            <Text style={[pdfStyles.cell, pdfStyles.descriptionColumn]}>{description}</Text>
            {showQuantityColumns && (
              <>
                <Text style={[pdfStyles.cell, pdfStyles.quantityColumn]}>
                  {formatQuantity(line.quantity)}
                </Text>
                <Text style={[pdfStyles.cell, pdfStyles.rateColumn]}>
                  {formatMoney(line.unitPrice, currency)}
                </Text>
              </>
            )}
            <Text style={[pdfStyles.cell, pdfStyles.amountColumn]}>
              {formatMoney(line.amount, currency)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
