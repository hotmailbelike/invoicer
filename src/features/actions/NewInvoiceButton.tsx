import { localIsoDate } from '@/domain/dates/isoDate';
import { hasContent } from '@/domain/invoice/hasContent';
import type { InvoiceDocument } from '@/domain/invoice/invoiceDocument';
import { isVisibleLine } from '@/domain/totals/isVisibleLine';
import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';

function hasClientWork(document: InvoiceDocument): boolean {
  return (
    hasContent(document.billTo) ||
    hasContent(document.notes) ||
    hasContent(document.terms) ||
    document.lineItems.some(isVisibleLine) ||
    document.discount !== undefined ||
    document.amountPaid !== undefined ||
    document.dueDate !== undefined
  );
}

export function NewInvoiceButton() {
  const { state, dispatch } = useInvoice();

  function startNewInvoice(): void {
    const confirmed =
      !hasClientWork(state.document) ||
      window.confirm(
        'Start a new invoice? The client, line items, notes and terms on screen will be cleared. Your own details and payment details are kept.',
      );
    if (confirmed) {
      dispatch({ type: 'newInvoiceStarted', today: localIsoDate(new Date()) });
    }
  }

  return (
    <Button variant="quiet" onClick={startNewInvoice}>
      New invoice
    </Button>
  );
}
