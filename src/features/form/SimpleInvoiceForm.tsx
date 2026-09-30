import { simpleLineItem } from '@/domain/invoice/simpleLineItem';
import { lineAmount } from '@/domain/totals/lineAmount';
import { fieldKeys } from '@/state/fieldKeys';
import { useInvoice } from '@/state/useInvoice';
import { MoneyField } from '../fields/MoneyField';
import { TextAreaField } from '../fields/TextAreaField';
import { InvoiceMetaFields } from './InvoiceMetaFields';
import { PartyFields } from './PartyFields';

export function SimpleInvoiceForm() {
  const { state, dispatch } = useInvoice();
  // The reducer always keeps at least one line, so this is only undefined for a malformed state.
  const line = simpleLineItem(state.document);
  return (
    <div className="flex flex-col gap-5">
      <PartyFields />
      <InvoiceMetaFields showDueDate={false} />
      {line !== undefined && (
        // Keyed by line: if a different line becomes the one simple mode shows, the amount
        // input must re-read it rather than keep the previous line's text.
        <div key={line.id} className="flex flex-col gap-4">
          <MoneyField
            label="Amount"
            // Shows the line's total, which is what prints, even if it was built from a
            // quantity and rate in detailed mode.
            value={line.unitPrice === undefined ? undefined : lineAmount(line)}
            onValue={(amount) => {
              dispatch({ type: 'simpleAmountChanged', id: line.id, amount });
            }}
            onInvalid={() => {
              dispatch({ type: 'fieldInvalidated', key: fieldKeys.simpleAmount(line.id) });
            }}
            className="max-w-56"
          />
          <TextAreaField
            label="Note"
            value={line.description}
            onChange={(description) => {
              dispatch({ type: 'lineDescriptionChanged', id: line.id, description });
            }}
            placeholder="What this invoice is for, e.g. Design retainer, 1–14 September"
          />
        </div>
      )}
    </div>
  );
}
