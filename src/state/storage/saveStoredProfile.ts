import type { PageSize } from '@/domain/invoice/invoiceDocument';
import { removeStoredItem, writeStoredJson } from './safeStorage';
import { PROFILE_STORAGE_KEY } from './storedProfile';
import type { StoredProfile } from './storedProfile';
import type { StoredProfileRecord } from './storedProfileSchema';

function isEmpty(profile: StoredProfile, defaultPageSize: PageSize): boolean {
  return (
    profile.from === '' &&
    profile.paymentHeading === '' &&
    profile.paymentDetails === '' &&
    profile.recentInvoiceNumbers.length === 0 &&
    profile.pageSize === defaultPageSize &&
    profile.mode === 'simple'
  );
}

/** Writes the profile, or removes the key when there is nothing worth remembering. */
export function saveStoredProfile(profile: StoredProfile, defaultPageSize: PageSize): void {
  if (isEmpty(profile, defaultPageSize)) {
    removeStoredItem(PROFILE_STORAGE_KEY);
    return;
  }
  // Typed against the schema, so the writer cannot drift from what the reader accepts.
  const record: StoredProfileRecord = {
    version: 1,
    from: profile.from,
    paymentHeading: profile.paymentHeading,
    paymentDetails: profile.paymentDetails,
    recentInvoiceNumbers: [...profile.recentInvoiceNumbers],
    pageSize: profile.pageSize,
    mode: profile.mode,
  };
  writeStoredJson(PROFILE_STORAGE_KEY, record);
}
