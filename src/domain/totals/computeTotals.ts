import { assertNever } from '../assert';
import type { Discount, LineItem } from '../invoice/invoiceDocument';
import { percentOf } from '../money/percentOf';
import { ZERO_MINOR, addMinor, subtractMinor } from '../units';
import type { Minor } from '../units';
import { lineAmount } from './lineAmount';

export interface InvoiceTotals {
  readonly subtotal: Minor;
  readonly discount: Minor;
  readonly total: Minor;
  readonly amountPaid: Minor;
  readonly balanceDue: Minor;
}

function discountAmount(subtotal: Minor, discount: Discount | undefined): Minor {
  if (discount === undefined) {
    return ZERO_MINOR;
  }
  switch (discount.kind) {
    case 'percent':
      return percentOf(subtotal, discount.rate);
    case 'fixed':
      return discount.amount;
    default:
      return assertNever(discount);
  }
}

/**
 * Nothing is clamped: a discount larger than the subtotal prints a negative total, because
 * the preview shows it and a silently altered figure is a wrong invoice nobody notices.
 */
export function computeTotals(
  lines: readonly LineItem[],
  discount: Discount | undefined,
  amountPaid: Minor | undefined,
): InvoiceTotals {
  const subtotal = lines.reduce((sum, line) => addMinor(sum, lineAmount(line)), ZERO_MINOR);
  const discountValue = discountAmount(subtotal, discount);
  const total = subtractMinor(subtotal, discountValue);
  const paid = amountPaid ?? ZERO_MINOR;
  return {
    subtotal,
    discount: discountValue,
    total,
    amountPaid: paid,
    balanceDue: subtractMinor(total, paid),
  };
}
