import type { LineItem } from '../invoice/invoiceDocument';
import { divideRounded } from '../money/divideRounded';
import { MILLI_PER_UNIT, ONE_UNIT, ZERO_MINOR, toMinor } from '../units';
import type { Minor } from '../units';

/** Rounded per line, so the printed line amounts always add up to the printed subtotal. */
export function lineAmount(item: LineItem): Minor {
  const quantity = item.quantity ?? ONE_UNIT;
  const unitPrice = item.unitPrice ?? ZERO_MINOR;
  return toMinor(divideRounded(unitPrice * quantity, MILLI_PER_UNIT));
}
