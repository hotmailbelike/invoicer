import clsx from 'clsx';
import { useState } from 'react';
import { ActionBar } from '@/features/actions/ActionBar';
import { SegmentedControl } from '@/features/fields/SegmentedControl';
import { InvoiceForm } from '@/features/form/InvoiceForm';
import { AppHeader } from '@/features/layout/AppHeader';
import { CrashFallback } from '@/features/layout/CrashFallback';
import { ErrorBoundary } from '@/features/layout/ErrorBoundary';
import { PdfPreview } from '@/features/preview/PdfPreview';
import { useInvoice } from '@/state/useInvoice';

type NarrowView = 'edit' | 'preview';

const NARROW_VIEW_OPTIONS = [
  { value: 'edit', label: 'Edit' },
  { value: 'preview', label: 'Preview' },
] as const satisfies readonly { value: NarrowView; label: string }[];

export function App() {
  const { state } = useInvoice();
  // Below the lg breakpoint only one pane shows at a time. Both stay mounted — hidden with CSS —
  // so the preview keeps rendering in the background and switching is instant.
  const [narrowView, setNarrowView] = useState<NarrowView>('edit');

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <AppHeader />
      <SegmentedControl
        legend="View"
        options={NARROW_VIEW_OPTIONS}
        value={narrowView}
        onChange={setNarrowView}
        className="mx-4 mt-3 self-start lg:hidden"
      />
      <main className="flex flex-1 flex-col lg:grid lg:min-h-0 lg:grid-cols-[minmax(420px,1fr)_minmax(480px,1.1fr)]">
        <section
          aria-label="Invoice details"
          className={clsx(
            'flex min-h-0 flex-col lg:border-r lg:border-zinc-200',
            narrowView === 'preview' && 'max-lg:hidden',
          )}
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <ErrorBoundary fallback={<CrashFallback />}>
              {/* Remounts every input when a new invoice replaces the document. */}
              <InvoiceForm key={state.formRevision} />
            </ErrorBoundary>
          </div>
          <ActionBar />
        </section>
        <div className={clsx('min-h-0', narrowView === 'edit' && 'max-lg:hidden')}>
          <ErrorBoundary fallback={<CrashFallback />}>
            <PdfPreview />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
