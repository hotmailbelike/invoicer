import { Text, View } from '@react-pdf/renderer';
import { formatMoney } from '@/domain/money/formatMoney';
import type { SimplePlan } from '@/domain/pdf-plan/invoicePlan';
import { SectionLabel } from '../components/SectionLabel';
import { TextSection } from '../components/TextSection';
import { pdfStyles } from '../pdfStyles';

interface Props {
  readonly plan: SimplePlan;
}

export function SimpleInvoiceBody({ plan }: Props) {
  return (
    <>
      {plan.description !== undefined && (
        <TextSection label="Description" text={plan.description} />
      )}
      <View style={pdfStyles.simpleTotal} wrap={false}>
        <SectionLabel>Total due</SectionLabel>
        <Text style={pdfStyles.totalDueAmount}>{formatMoney(plan.totalDue, plan.currency)}</Text>
      </View>
    </>
  );
}
