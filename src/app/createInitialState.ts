import type { IsoDate } from '@/domain/dates/isoDate';
import { createInvoiceDocument } from '@/domain/invoice/createInvoiceDocument';
import { toLineItemId } from '@/domain/invoice/lineItemId';
import { suggestInvoiceNumber } from '@/domain/invoice/suggestInvoiceNumber';
import type { InvoiceState } from '@/state/invoiceState';
import type { StoredProfile } from '@/state/storage/storedProfile';

const DEFAULT_CURRENCY = 'USD';

export function createInitialState(today: IsoDate, profile: StoredProfile): InvoiceState {
  return {
    document: createInvoiceDocument({
      mode: profile.mode,
      from: profile.from,
      paymentHeading: profile.paymentHeading,
      paymentDetails: profile.paymentDetails,
      currency: DEFAULT_CURRENCY,
      invoiceNumber: suggestInvoiceNumber(profile.recentInvoiceNumbers, today),
      issueDate: today,
      firstLineItemId: toLineItemId(0),
    }),
    pageSize: profile.pageSize,
    recentInvoiceNumbers: profile.recentInvoiceNumbers,
    nextLineItemId: toLineItemId(1),
    formRevision: 0,
    invalidFieldKeys: [],
  };
}
