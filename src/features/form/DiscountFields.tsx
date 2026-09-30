import { useState } from 'react';
import type { DiscountKind } from '@/domain/invoice/invoiceDocument';
import { fieldKeys } from '@/state/fieldKeys';
import { useInvoice } from '@/state/useInvoice';
import { MoneyField } from '../fields/MoneyField';
import { PercentField } from '../fields/PercentField';
import { SegmentedControl } from '../fields/SegmentedControl';

type DiscountChoice = DiscountKind | 'none';

const DISCOUNT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'percent', label: 'Percent' },
  { value: 'fixed', label: 'Amount' },
] as const satisfies readonly { value: DiscountChoice; label: string }[];

export function DiscountFields() {
  const { state, dispatch } = useInvoice();
  const { discount } = state.document;
  // The chosen kind is kept locally: picking "Percent" before typing a rate is a real state
  // that the document, which only holds complete discounts, cannot represent.
  const [choice, setChoice] = useState<DiscountChoice>(discount?.kind ?? 'none');

  function handleInvalid(): void {
    dispatch({ type: 'fieldInvalidated', key: fieldKeys.discount });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-800" aria-hidden="true">
          Discount
        </span>
        <SegmentedControl
          legend="Discount"
          options={DISCOUNT_OPTIONS}
          value={choice}
          onChange={(next) => {
            setChoice(next);
            dispatch({ type: 'discountChanged', discount: undefined });
          }}
          className="self-start"
        />
      </div>
      {choice === 'percent' && (
        <PercentField
          label="Discount rate (%)"
          value={discount?.kind === 'percent' ? discount.rate : undefined}
          onValue={(rate) => {
            dispatch({
              type: 'discountChanged',
              discount: rate === undefined ? undefined : { kind: 'percent', rate },
            });
          }}
          onInvalid={handleInvalid}
          className="max-w-40"
        />
      )}
      {choice === 'fixed' && (
        <MoneyField
          label="Discount amount"
          value={discount?.kind === 'fixed' ? discount.amount : undefined}
          onValue={(amount) => {
            dispatch({
              type: 'discountChanged',
              discount: amount === undefined ? undefined : { kind: 'fixed', amount },
            });
          }}
          onInvalid={handleInvalid}
          className="max-w-56"
        />
      )}
    </div>
  );
}
