import { assert } from '../assert';
import type { LineItemId } from './invoiceDocument';

function isLineItemId(value: number): value is LineItemId {
  return Number.isSafeInteger(value) && value >= 0;
}

export function toLineItemId(value: number): LineItemId {
  assert(isLineItemId(value), `expected a non-negative integer line item id, got ${value}`);
  return value;
}
