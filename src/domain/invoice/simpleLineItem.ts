import { isVisibleLine } from '../totals/isVisibleLine';
import type { InvoiceDocument, LineItem } from './invoiceDocument';

/**
 * The line simple mode shows and edits: the first one with content, not lineItems[0], because
 * a user who clears row 1 in detailed mode and fills rows 2 and 3 expects to see row 2.
 */
export function simpleLineItem(document: InvoiceDocument): LineItem | undefined {
  return document.lineItems.find(isVisibleLine) ?? document.lineItems[0];
}
