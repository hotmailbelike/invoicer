import { useState } from 'react';
import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';

type CopyStatus = 'idle' | 'copied' | 'failed';

/** Shown when part of the page crashes. The invoice state lives above the crash, so it survives. */
export function CrashFallback() {
  const { state } = useInvoice();
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  async function copyInvoice(): Promise<void> {
    try {
      await navigator.clipboard.writeText(JSON.stringify(state.document, null, 2));
      setCopyStatus('copied');
    } catch (error) {
      // The user asked for this, so a silent failure would mislead them.
      console.error('Invoicer could not copy the invoice.', error);
      setCopyStatus('failed');
    }
  }

  return (
    <div
      role="alert"
      className="m-6 flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-900"
    >
      <p className="font-semibold">Something went wrong in this part of the page.</p>
      <p>Copy what you have typed before reloading, so nothing is lost.</p>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            void copyInvoice();
          }}
        >
          Copy my invoice data
        </Button>
        <Button
          variant="quiet"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
      {copyStatus === 'copied' && <p role="status">Copied to the clipboard.</p>}
      {copyStatus === 'failed' && (
        <p role="status">Copying failed. Keep this tab open and try again before reloading.</p>
      )}
    </div>
  );
}
