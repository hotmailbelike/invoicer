import type { InvoiceMode, PageSize } from '@/domain/invoice/invoiceDocument';
import { useInvoice } from '@/state/useInvoice';
import { SegmentedControl } from '../fields/SegmentedControl';
import { SettingsMenu } from './SettingsMenu';

const MODE_OPTIONS = [
  { value: 'simple', label: 'Simple' },
  { value: 'detailed', label: 'Detailed' },
] as const satisfies readonly { value: InvoiceMode; label: string }[];

const PAGE_SIZE_OPTIONS = [
  { value: 'A4', label: 'A4' },
  { value: 'LETTER', label: 'Letter' },
] as const satisfies readonly { value: PageSize; label: string }[];

export function AppHeader() {
  const { state, dispatch } = useInvoice();
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 bg-white px-4 py-2 sm:px-6">
      <h1 className="text-base font-semibold tracking-tight text-zinc-900">Invoicer</h1>
      <SegmentedControl
        legend="Invoice type"
        options={MODE_OPTIONS}
        value={state.document.mode}
        onChange={(mode) => {
          dispatch({ type: 'modeChanged', mode });
        }}
      />
      <div className="ml-auto flex items-center gap-2">
        <SegmentedControl
          legend="Paper size"
          options={PAGE_SIZE_OPTIONS}
          value={state.pageSize}
          onChange={(pageSize) => {
            dispatch({ type: 'pageSizeChanged', pageSize });
          }}
        />
        <SettingsMenu />
      </div>
    </header>
  );
}
