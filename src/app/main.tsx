import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { localIsoDate } from '@/domain/dates/isoDate';
import { defaultPageSize } from '@/domain/invoice/defaultPageSize';
import { loadStoredProfile } from '@/state/storage/loadStoredProfile';
import { App } from './App';
import { createInitialState } from './createInitialState';
import { InvoiceProvider } from './InvoiceProvider';
import '@/index.css';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Invoicer cannot start: index.html has no #root element.');
}

const initialState = createInitialState(
  localIsoDate(new Date()),
  loadStoredProfile(defaultPageSize(navigator.language)),
);

createRoot(rootElement).render(
  <StrictMode>
    <InvoiceProvider initialState={initialState}>
      <App />
    </InvoiceProvider>
  </StrictMode>,
);
