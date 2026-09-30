import { hasContent } from '@/domain/invoice/hasContent';
import { useInvoice } from '@/state/useInvoice';
import { FormSection } from '../fields/FormSection';
import { AmountPaidField } from './AmountPaidField';
import { DiscountFields } from './DiscountFields';
import { InvoiceMetaFields } from './InvoiceMetaFields';
import { LineItemsEditor } from './LineItemsEditor';
import { NotesTermsFields } from './NotesTermsFields';
import { PartyFields } from './PartyFields';
import { PaymentFields } from './PaymentFields';

export function DetailedInvoiceForm() {
  const { state } = useInvoice();
  const { document } = state;
  return (
    <div className="flex flex-col gap-4">
      <FormSection title="Who" summary="From and bill to" initiallyOpen>
        <PartyFields />
      </FormSection>
      <FormSection title="Invoice" summary="Number, dates and currency" initiallyOpen>
        <InvoiceMetaFields showDueDate />
      </FormSection>
      <FormSection title="Items" summary="What you are billing for" initiallyOpen>
        <LineItemsEditor />
      </FormSection>
      <FormSection
        title="Discount and payments"
        summary="Optional"
        initiallyOpen={document.discount !== undefined || document.amountPaid !== undefined}
      >
        <DiscountFields />
        <AmountPaidField />
      </FormSection>
      <FormSection
        title="Payment details"
        summary="Optional — how the client pays you"
        initiallyOpen={hasContent(document.paymentHeading) || hasContent(document.paymentDetails)}
      >
        <PaymentFields />
      </FormSection>
      <FormSection
        title="Notes and terms"
        summary="Optional"
        initiallyOpen={hasContent(document.notes) || hasContent(document.terms)}
      >
        <NotesTermsFields />
      </FormSection>
    </div>
  );
}
