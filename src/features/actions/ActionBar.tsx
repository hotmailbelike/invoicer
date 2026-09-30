import { TotalsSummary } from '../form/TotalsSummary';
import { DownloadPdfButton } from './DownloadPdfButton';
import { NewInvoiceButton } from './NewInvoiceButton';

export function ActionBar() {
  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <TotalsSummary />
      <div className="ml-auto flex items-start gap-2">
        <NewInvoiceButton />
        <DownloadPdfButton />
      </div>
    </div>
  );
}
