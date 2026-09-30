import type { LineItem, LineItemId } from './invoiceDocument';

export function blankLineItem(id: LineItemId): LineItem {
  return { id, description: '' };
}
