import { fieldKeys } from '@/state/fieldKeys';
import { useInvoice } from '@/state/useInvoice';
import { MoneyField } from '../fields/MoneyField';

export function AmountPaidField() {
  const { state, dispatch } = useInvoice();
  return (
    <MoneyField
      label="Already paid"
      value={state.document.amountPaid}
      onValue={(amount) => {
        dispatch({ type: 'amountPaidChanged', amount });
      }}
      onInvalid={() => {
        dispatch({ type: 'fieldInvalidated', key: fieldKeys.amountPaid });
      }}
      hint="A deposit or part-payment. The PDF then shows the balance due."
      className="max-w-56"
    />
  );
}
