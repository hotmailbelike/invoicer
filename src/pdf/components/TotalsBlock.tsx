import { Text, View } from '@react-pdf/renderer';
import { formatPercent } from '@/domain/money/formatDecimal';
import { formatMoney } from '@/domain/money/formatMoney';
import type { DetailedPlan } from '@/domain/pdf-plan/invoicePlan';
import { pdfStyles } from '../pdfStyles';

// U+2212 rather than a hyphen, so deductions line up with the digits they precede.
const MINUS = '−';

interface Props {
  readonly plan: DetailedPlan;
}

export function TotalsBlock({ plan }: Props) {
  const { currency, discount, payment } = plan;
  return (
    // Never split: a total orphaned onto its own page reads as a different invoice.
    <View style={pdfStyles.totals} wrap={false}>
      {plan.subtotal !== undefined && (
        <TotalsRow label="Subtotal" value={formatMoney(plan.subtotal, currency)} />
      )}
      {discount !== undefined && (
        <TotalsRow
          label={
            discount.rate === undefined ? 'Discount' : `Discount (${formatPercent(discount.rate)}%)`
          }
          value={`${MINUS}${formatMoney(discount.amount, currency)}`}
        />
      )}
      <EmphasisRow
        label={payment === undefined ? 'Total due' : 'Total'}
        value={formatMoney(plan.totalDue, currency)}
      />
      {payment !== undefined && (
        <>
          <TotalsRow label="Paid" value={`${MINUS}${formatMoney(payment.amountPaid, currency)}`} />
          <EmphasisRow label="Balance due" value={formatMoney(payment.balanceDue, currency)} />
        </>
      )}
    </View>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
}

function TotalsRow({ label, value }: RowProps) {
  return (
    <View style={pdfStyles.totalsRow}>
      <Text>{label}</Text>
      <Text style={pdfStyles.text}>{value}</Text>
    </View>
  );
}

function EmphasisRow({ label, value }: RowProps) {
  return (
    <View style={pdfStyles.totalsEmphasis}>
      <Text style={pdfStyles.totalsEmphasisLabel}>{label}</Text>
      <Text style={pdfStyles.totalsEmphasisValue}>{value}</Text>
    </View>
  );
}
