import { Text, View } from '@react-pdf/renderer';
import { formatInvoiceDate } from '@/domain/dates/formatInvoiceDate';
import type { IsoDate } from '@/domain/dates/isoDate';
import { breakLongWords } from '../breakLongWords';
import { pdfStyles } from '../pdfStyles';
import { textRunLimits } from '../textRunLimits';
import { SectionLabel } from './SectionLabel';

interface Props {
  readonly invoiceNumber?: string;
  readonly issueDate?: IsoDate;
  readonly dueDate?: IsoDate;
}

export function InvoiceHeader({ invoiceNumber, issueDate, dueDate }: Props) {
  return (
    <View>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>INVOICE</Text>
        <View style={pdfStyles.meta}>
          {invoiceNumber !== undefined && (
            <MetaItem
              label="Invoice number"
              value={breakLongWords(invoiceNumber, textRunLimits.metaValue)}
            />
          )}
          {issueDate !== undefined && (
            <MetaItem label="Date of issue" value={formatInvoiceDate(issueDate)} />
          )}
          {dueDate !== undefined && (
            <MetaItem label="Due date" value={formatInvoiceDate(dueDate)} />
          )}
        </View>
      </View>
      <View style={pdfStyles.divider} />
    </View>
  );
}

interface MetaItemProps {
  readonly label: string;
  readonly value: string;
}

function MetaItem({ label, value }: MetaItemProps) {
  return (
    <View style={pdfStyles.metaItem}>
      <SectionLabel>{label}</SectionLabel>
      <Text style={pdfStyles.metaValue}>{value}</Text>
    </View>
  );
}
