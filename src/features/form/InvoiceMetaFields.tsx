import { useInvoice } from '@/state/useInvoice';
import { DateField } from '../fields/DateField';
import { TextField } from '../fields/TextField';
import { DueDateField } from './DueDateField';
import { InvoiceNumberField } from './InvoiceNumberField';

interface Props {
  readonly showDueDate: boolean;
}

export function InvoiceMetaFields({ showDueDate }: Props) {
  const { state, dispatch } = useInvoice();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InvoiceNumberField />
      <DateField
        label="Issue date"
        value={state.document.issueDate}
        onChange={(date) => {
          dispatch({ type: 'issueDateChanged', date });
        }}
      />
      {showDueDate && <DueDateField />}
      <TextField
        label="Currency"
        value={state.document.currency}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'currency', value });
        }}
        maxLength={12}
        spellCheck={false}
        placeholder="USD"
        hint="A code like USD prints as $; anything else prints as typed."
      />
    </div>
  );
}
