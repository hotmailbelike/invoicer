import { useId } from 'react';
import type { ReactNode } from 'react';
import { selectRenderInput } from '@/state/invoiceSelectors';
import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';
import { TotalsSummary } from '../form/TotalsSummary';
import { ExternalLinkIcon } from '../icons/ExternalLinkIcon';
import { canShowPdfInline } from './canShowPdfInline';
import { useInvoicePdf } from './useInvoicePdf';
import type { PdfPreviewState } from './useInvoicePdf';

export function PdfPreview() {
  const { state } = useInvoice();
  const headingId = useId();
  const { preview, retry } = useInvoicePdf(selectRenderInput(state), canShowPdfInline);

  return (
    <section aria-labelledby={headingId} className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-11 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2">
        <h2 id={headingId} className="text-sm font-semibold text-zinc-900">
          Preview
        </h2>
        {preview.status === 'ready' && preview.isUpdating && (
          <span aria-hidden="true" className="text-xs text-zinc-500">
            Updating…
          </span>
        )}
        {preview.status === 'ready' && (
          <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 rounded text-sm font-medium text-indigo-700 hover:text-indigo-900 focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            Open in new tab
            <ExternalLinkIcon className="size-4" />
          </a>
        )}
      </div>
      <div className="relative min-h-[75dvh] flex-1 bg-zinc-200/70 lg:min-h-0">
        <PreviewBody preview={preview} onRetry={retry} />
      </div>
      <div className="sr-only">
        <TotalsSummary />
      </div>
    </section>
  );
}

interface PreviewBodyProps {
  readonly preview: PdfPreviewState;
  readonly onRetry: () => void;
}

function PreviewBody({ preview, onRetry }: PreviewBodyProps) {
  if (!canShowPdfInline) {
    return (
      <PreviewMessage>
        This browser cannot show a PDF inside the page. Use Download PDF to check the invoice.
      </PreviewMessage>
    );
  }
  switch (preview.status) {
    case 'pending':
      return (
        <PreviewMessage>
          Your invoice appears here as you type. Nothing is stored on a server — keep the PDFs you
          download.
        </PreviewMessage>
      );
    case 'ready':
      return (
        <iframe
          // A fresh frame per render, so edits do not pile up as entries in the Back history.
          key={preview.url}
          title="Invoice PDF preview"
          src={`${preview.url}#toolbar=0&view=Fit`}
          className="absolute inset-0 size-full border-0"
        />
      );
    case 'failed':
      return (
        <PreviewMessage>
          <span className="flex flex-col items-center gap-3">
            The preview could not be generated.
            <Button onClick={onRetry}>Try again</Button>
          </span>
        </PreviewMessage>
      );
  }
}

interface PreviewMessageProps {
  readonly children: ReactNode;
}

function PreviewMessage({ children }: PreviewMessageProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="flex aspect-[1/1.414] w-full max-w-sm items-center justify-center rounded-md bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
        {children}
      </div>
    </div>
  );
}
