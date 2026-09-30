import { useId } from 'react';
import { localIsoDate } from '@/domain/dates/isoDate';
import { suggestInvoiceNumber } from '@/domain/invoice/suggestInvoiceNumber';
import { selectIsDuplicateInvoiceNumber } from '@/state/invoiceSelectors';
import { useInvoice } from '@/state/useInvoice';
import { TextField } from '../fields/TextField';

export function InvoiceNumberField() {
  const { state, dispatch } = useInvoice();
  const listId = useId();
  const { recentInvoiceNumbers } = state;
  const invoiceNumber = state.document.invoiceNumber;
  const lastUsed = recentInvoiceNumbers[0];
  const isDuplicate = selectIsDuplicateInvoiceNumber(state);

  function applyNextNumber(): void {
    dispatch({
      type: 'textChanged',
      field: 'invoiceNumber',
      value: suggestInvoiceNumber(recentInvoiceNumbers, localIsoDate(new Date())),
    });
  }

  const hint = isDuplicate ? (
    <span className="flex flex-wrap items-center gap-x-2 text-amber-800">
      Already used on a previous invoice.
      <button
        type="button"
        onClick={applyNextNumber}
        className="font-medium underline underline-offset-2 hover:text-amber-950"
      >
        Use the next number
      </button>
    </span>
  ) : lastUsed === undefined ? undefined : (
    `Last used: ${lastUsed}`
  );

  return (
    <>
      <TextField
        label="Invoice number"
        value={invoiceNumber}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'invoiceNumber', value });
        }}
        list={listId}
        spellCheck={false}
        hint={hint}
      />
      <datalist id={listId}>
        {recentInvoiceNumbers.map((recent) => (
          <option key={recent} value={recent} />
        ))}
      </datalist>
    </>
  );
}
