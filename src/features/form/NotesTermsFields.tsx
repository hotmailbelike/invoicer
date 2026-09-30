import { useInvoice } from '@/state/useInvoice';
import { TextAreaField } from '../fields/TextAreaField';

export function NotesTermsFields() {
  const { state, dispatch } = useInvoice();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextAreaField
        label="Notes"
        value={state.document.notes}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'notes', value });
        }}
        placeholder="Thank you for your business."
      />
      <TextAreaField
        label="Terms"
        value={state.document.terms}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'terms', value });
        }}
        placeholder="Payment due within 14 days."
      />
    </div>
  );
}
