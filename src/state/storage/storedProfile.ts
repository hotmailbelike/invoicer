import type { InvoiceMode, PageSize } from '@/domain/invoice/invoiceDocument';

export const PROFILE_STORAGE_KEY = 'invoicer.profile.v1';
export const MAX_RECENT_INVOICE_NUMBERS = 20;

/** The sender's own side of an invoice — the only data this app keeps between visits. */
export interface StoredProfile {
  readonly from: string;
  readonly paymentHeading: string;
  readonly paymentDetails: string;
  /** Most recent first. */
  readonly recentInvoiceNumbers: readonly string[];
  readonly pageSize: PageSize;
  readonly mode: InvoiceMode;
}

export function emptyProfile(pageSize: PageSize): StoredProfile {
  return {
    from: '',
    paymentHeading: '',
    paymentDetails: '',
    recentInvoiceNumbers: [],
    pageSize,
    mode: 'simple',
  };
}
