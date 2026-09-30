import { useInvoice } from '@/state/useInvoice';
import { TextAreaField } from '../fields/TextAreaField';
import { TextField } from '../fields/TextField';

export function PaymentFields() {
  const { state, dispatch } = useInvoice();
  return (
    <>
      <TextField
        label="Heading"
        value={state.document.paymentHeading}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'paymentHeading', value });
        }}
        placeholder="Payment details"
        maxLength={60}
      />
      <TextAreaField
        label="How to pay you"
        value={state.document.paymentDetails}
        onChange={(value) => {
          dispatch({ type: 'textChanged', field: 'paymentDetails', value });
        }}
        placeholder={
          'Account holder\nIBAN or account number, SWIFT or routing number\nor a payment link'
        }
        rows={4}
        hint="Remembered in this browser for your next invoice."
      />
    </>
  );
}
