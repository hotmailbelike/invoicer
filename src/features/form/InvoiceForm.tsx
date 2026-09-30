import { assertNever } from '@/domain/assert';
import { useInvoice } from '@/state/useInvoice';
import { DetailedInvoiceForm } from './DetailedInvoiceForm';
import { SimpleInvoiceForm } from './SimpleInvoiceForm';

export function InvoiceForm() {
  const { state } = useInvoice();
  switch (state.document.mode) {
    case 'simple':
      return <SimpleInvoiceForm />;
    case 'detailed':
      return <DetailedInvoiceForm />;
    default:
      return assertNever(state.document.mode);
  }
}
