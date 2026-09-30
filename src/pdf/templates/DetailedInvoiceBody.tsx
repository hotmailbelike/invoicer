import type { DetailedPlan } from '@/domain/pdf-plan/invoicePlan';
import { LineItemsTable } from '../components/LineItemsTable';
import { TextColumns } from '../components/TextColumns';
import { TextSection } from '../components/TextSection';
import { TotalsBlock } from '../components/TotalsBlock';

interface Props {
  readonly plan: DetailedPlan;
}

export function DetailedInvoiceBody({ plan }: Props) {
  return (
    <>
      {plan.lines.length > 0 && (
        <LineItemsTable
          lines={plan.lines}
          showQuantityColumns={plan.showQuantityColumns}
          currency={plan.currency}
        />
      )}
      <TotalsBlock plan={plan} />
      {/* Full width: payment details are the likeliest home of an unbreakable IBAN or URL. */}
      {plan.paymentDetails !== undefined && (
        <TextSection label={plan.paymentDetails.heading} text={plan.paymentDetails.body} />
      )}
      <TextColumns
        left={plan.notes === undefined ? undefined : { label: 'Notes', text: plan.notes }}
        right={plan.terms === undefined ? undefined : { label: 'Terms', text: plan.terms }}
      />
    </>
  );
}
