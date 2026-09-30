import { useInvoice } from '@/state/useInvoice';
import { TextAreaField } from '../fields/TextAreaField';

export function PartyFields() {
  const { state, dispatch } = useInvoice();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextAreaField
        label="From"
        value={state.document.from}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'from', value });
        }}
        placeholder={'Your name or business\nAddress, email, tax number'}
        hint="Remembered in this browser for your next invoice."
      />
      <TextAreaField
        label="Bill to"
        value={state.document.billTo}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'billTo', value });
        }}
        placeholder={'Client name\nAddress, VAT number, PO or reference'}
        hint="Printed exactly as typed."
      />
    </div>
  );
}
