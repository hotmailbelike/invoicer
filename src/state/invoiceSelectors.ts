import { assertNever } from '@/domain/assert';
import { simpleLineItem } from '@/domain/invoice/simpleLineItem';
import type { PdfRenderInput } from '@/domain/pdf-plan/invoicePlan';
import { planSections } from '@/domain/pdf-plan/planSections';
import { fieldKeys } from './fieldKeys';
import type { FieldKey } from './fieldKeys';
import type { InvoiceState } from './invoiceState';
import type { StoredProfile } from './storage/storedProfile';

export function selectProfile(state: InvoiceState): StoredProfile {
  return {
    from: state.document.from,
    paymentHeading: state.document.paymentHeading,
    paymentDetails: state.document.paymentDetails,
    recentInvoiceNumbers: state.recentInvoiceNumbers,
    pageSize: state.pageSize,
    mode: state.document.mode,
  };
}

/** True when the number is already on an earlier invoice — not just this one downloaded again. */
export function selectIsDuplicateInvoiceNumber(state: InvoiceState): boolean {
  const invoiceNumber = state.document.invoiceNumber.trim();
  return (
    invoiceNumber !== state.exportedInvoiceNumber &&
    state.recentInvoiceNumbers.includes(invoiceNumber)
  );
}

export function selectRenderInput(state: InvoiceState): PdfRenderInput {
  return { plan: planSections(state.document), pageSize: state.pageSize };
}

/** The numeric inputs currently on screen, so stale keys from unmounted inputs never block. */
function mountedFieldKeys(state: InvoiceState): ReadonlySet<FieldKey> {
  const { document } = state;
  switch (document.mode) {
    case 'simple': {
      const line = simpleLineItem(document);
      return new Set(line === undefined ? [] : [fieldKeys.simpleAmount(line.id)]);
    }
    case 'detailed':
      return new Set([
        ...document.lineItems.flatMap((item) => [
          fieldKeys.quantity(item.id),
          fieldKeys.unitPrice(item.id),
        ]),
        fieldKeys.discount,
        fieldKeys.amountPaid,
      ]);
    default:
      return assertNever(document.mode);
  }
}

/**
 * True while any visible numeric input holds text that does not parse. The document still has
 * the last valid value at that point, so exporting would send a number the form is not showing.
 */
export function selectIsExportBlocked(state: InvoiceState): boolean {
  const mounted = mountedFieldKeys(state);
  return state.invalidFieldKeys.some((key) => mounted.has(key));
}
