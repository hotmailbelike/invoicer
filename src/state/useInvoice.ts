import { use } from 'react';
import { InvoiceContext } from './InvoiceContext';
import type { InvoiceContextValue } from './InvoiceContext';

/** Throws outside the provider, turning a silent undefined into a clear message. */
export function useInvoice(): InvoiceContextValue {
  const value = use(InvoiceContext);
  if (value === undefined) {
    throw new Error('useInvoice must be called inside <InvoiceProvider>.');
  }
  return value;
}
