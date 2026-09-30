import { useId, useState } from 'react';
import { invoiceFileName } from '@/domain/invoice/invoiceFileName';
import { selectIsExportBlocked, selectRenderInput } from '@/state/invoiceSelectors';
import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';
import { DownloadIcon } from '../icons/DownloadIcon';
import { loadPdfRenderer } from '../preview/loadPdfRenderer';
import { saveBlob } from './saveBlob';

type DownloadStatus = 'idle' | 'preparing' | 'failed';

export function DownloadPdfButton() {
  const { state, dispatch } = useInvoice();
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const messageId = useId();
  const isBlocked = selectIsExportBlocked(state);

  // Renders a fresh PDF from the state at the moment of the click rather than reusing the
  // preview, which can be a pause behind the latest keystroke.
  async function download(): Promise<void> {
    setStatus('preparing');
    try {
      const render = await loadPdfRenderer();
      const blob = await render(selectRenderInput(state));
      saveBlob(blob, invoiceFileName(state.document.invoiceNumber));
      dispatch({ type: 'invoiceExported', invoiceNumber: state.document.invoiceNumber });
      setStatus('idle');
    } catch (error) {
      console.error('Invoicer could not generate the PDF.', error);
      setStatus('failed');
    }
  }

  const message = isBlocked
    ? 'Fix the highlighted number first.'
    : status === 'failed'
      ? 'The PDF could not be generated. Try again.'
      : undefined;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="primary"
        disabled={isBlocked || status === 'preparing'}
        aria-describedby={message === undefined ? undefined : messageId}
        onClick={() => {
          void download();
        }}
      >
        <DownloadIcon className="size-4" />
        {status === 'preparing' ? 'Preparing…' : 'Download PDF'}
      </Button>
      {message !== undefined && (
        <p id={messageId} role="status" className="text-xs font-medium text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
