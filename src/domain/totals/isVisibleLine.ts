import { hasContent } from '../invoice/hasContent';
import type { LineItem } from '../invoice/invoiceDocument';

/** A row prints once the user has put anything in it; untouched editor rows never do. */
export function isVisibleLine(item: LineItem): boolean {
  return (
    hasContent(item.description) || item.quantity !== undefined || item.unitPrice !== undefined
  );
}
