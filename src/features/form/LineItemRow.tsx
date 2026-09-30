import type { LineItem } from '@/domain/invoice/invoiceDocument';
import { formatMoney } from '@/domain/money/formatMoney';
import { lineAmount } from '@/domain/totals/lineAmount';
import { fieldKeys } from '@/state/fieldKeys';
import { useInvoice } from '@/state/useInvoice';
import { MoneyField } from '../fields/MoneyField';
import { QuantityField } from '../fields/QuantityField';
import { TextAreaField } from '../fields/TextAreaField';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  readonly item: LineItem;
  readonly position: number;
}

export function LineItemRow({ item, position }: Props) {
  const { state, dispatch } = useInvoice();
  const { currency } = state.document;
  return (
    <li className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50/60 p-3">
      <TextAreaField
        label={`Line ${position} description`}
        hideLabel
        value={item.description}
        onChange={(description) => {
          dispatch({ type: 'lineDescriptionChanged', id: item.id, description });
        }}
        placeholder="What was delivered"
        rows={1}
      />
      <div className="flex items-end gap-2">
        <QuantityField
          label={<RowLabel text="Qty" position={position} />}
          value={item.quantity}
          onValue={(quantity) => {
            dispatch({ type: 'lineQuantityChanged', id: item.id, quantity });
          }}
          onInvalid={() => {
            dispatch({ type: 'fieldInvalidated', key: fieldKeys.quantity(item.id) });
          }}
          className="w-24 shrink-0"
        />
        <MoneyField
          label={<RowLabel text="Rate" position={position} />}
          value={item.unitPrice}
          onValue={(unitPrice) => {
            dispatch({ type: 'lineUnitPriceChanged', id: item.id, unitPrice });
          }}
          onInvalid={() => {
            dispatch({ type: 'fieldInvalidated', key: fieldKeys.unitPrice(item.id) });
          }}
          className="min-w-0 flex-1"
        />
        {/* Plain text, not <output>: an output is a live region and would announce every keystroke. */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-800">
            <RowLabel text="Amount" position={position} />
          </span>
          <p className="truncate py-2 text-right text-sm font-medium text-zinc-900 tabular-nums">
            {formatMoney(lineAmount(item), currency)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'lineItemRemoved', id: item.id });
          }}
          aria-label={`Remove line ${position}`}
          className="mb-0.5 rounded-md p-2 text-zinc-500 hover:bg-zinc-200/70 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </li>
  );
}

interface RowLabelProps {
  readonly text: string;
  readonly position: number;
}

/** A short visible label that still tells a screen reader which line it belongs to. */
function RowLabel({ text, position }: RowLabelProps) {
  return (
    <>
      {text}
      <span className="sr-only">, line {position}</span>
    </>
  );
}
