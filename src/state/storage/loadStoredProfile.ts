import * as z from 'zod/mini';
import type { PageSize } from '@/domain/invoice/invoiceDocument';
import { readStoredJson } from './safeStorage';
import { MAX_RECENT_INVOICE_NUMBERS, PROFILE_STORAGE_KEY, emptyProfile } from './storedProfile';
import type { StoredProfile } from './storedProfile';
import { storedProfileSchema } from './storedProfileSchema';

/**
 * Reads the saved profile. Runs during startup, so it never throws: anything missing, from
 * another version, or unreadable yields the empty profile instead of a blank screen.
 */
export function loadStoredProfile(defaultPageSize: PageSize): StoredProfile {
  const parsed = z.safeParse(storedProfileSchema, readStoredJson(PROFILE_STORAGE_KEY));
  if (!parsed.success) {
    return emptyProfile(defaultPageSize);
  }
  const record = parsed.data;
  return {
    from: record.from,
    paymentHeading: record.paymentHeading,
    paymentDetails: record.paymentDetails,
    recentInvoiceNumbers: record.recentInvoiceNumbers.slice(0, MAX_RECENT_INVOICE_NUMBERS),
    pageSize: record.pageSize ?? defaultPageSize,
    mode: record.mode,
  };
}
