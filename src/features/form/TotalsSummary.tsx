import { formatMoney } from '@/domain/money/formatMoney';
import { planSections } from '@/domain/pdf-plan/planSections';
import { useInvoice } from '@/state/useInvoice';

/** The figure the client is asked to pay, as it will print. */
export function TotalsSummary() {
  const { state } = useInvoice();
  const plan = planSections(state.document);
  const payment = plan.mode === 'detailed' ? plan.payment : undefined;
  return (
    <p className="flex min-w-0 flex-col text-xs text-zinc-500">
      {payment === undefined ? 'Total due' : 'Balance due'}
      <span className="truncate text-lg font-semibold text-zinc-900 tabular-nums">
        {formatMoney(payment === undefined ? plan.totalDue : payment.balanceDue, plan.currency)}
      </span>
    </p>
  );
}
