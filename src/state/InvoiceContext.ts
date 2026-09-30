import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { InvoiceAction } from './invoiceActions';
import type { InvoiceState } from './invoiceState';

export interface InvoiceContextValue {
  readonly state: InvoiceState;
  readonly dispatch: Dispatch<InvoiceAction>;
}

export const InvoiceContext = createContext<InvoiceContextValue | undefined>(undefined);
