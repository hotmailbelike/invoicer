import type { InvoiceDocument, LineItemId, PageSize } from '@/domain/invoice/invoiceDocument';
import type { FieldKey } from './fieldKeys';

export interface InvoiceState {
  readonly document: InvoiceDocument;
  readonly pageSize: PageSize;
  /** Most recent first; drives the next suggested number and the duplicate warning. */
  readonly recentInvoiceNumbers: readonly string[];
  /** The number this invoice was last downloaded under, so downloading it does not flag it
   *  as a duplicate of itself. Cleared when a new invoice starts. */
  readonly exportedInvoiceNumber?: string;
  /** Line ids come from a counter, never array indices, so deleting a row cannot hand its
   *  half-typed input to the row below. */
  readonly nextLineItemId: LineItemId;
  /** Bumped when the whole invoice is replaced, so inputs holding raw text remount clean. */
  readonly formRevision: number;
  /** Numeric inputs currently showing text that does not parse. */
  readonly invalidFieldKeys: readonly FieldKey[];
}
