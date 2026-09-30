import { useReducer } from 'react';
import type { ReactNode } from 'react';
import { useProfilePersistence } from '@/features/persistence/useProfilePersistence';
import { InvoiceContext } from '@/state/InvoiceContext';
import { invoiceReducer } from '@/state/invoiceReducer';
import { selectProfile } from '@/state/invoiceSelectors';
import type { InvoiceState } from '@/state/invoiceState';

interface Props {
  readonly initialState: InvoiceState;
  readonly children: ReactNode;
}

export function InvoiceProvider({ initialState, children }: Props) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);
  useProfilePersistence(selectProfile(state));
  return <InvoiceContext value={{ state, dispatch }}>{children}</InvoiceContext>;
}
