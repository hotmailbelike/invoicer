import type { IsoDate } from '@/domain/dates/isoDate';
import type { Discount, InvoiceMode, LineItemId, PageSize } from '@/domain/invoice/invoiceDocument';
import type { Milli, Minor } from '@/domain/units';
import type { FieldKey } from './fieldKeys';

export type TextFieldName =
  | 'from'
  | 'billTo'
  | 'invoiceNumber'
  | 'currency'
  | 'paymentHeading'
  | 'paymentDetails'
  | 'notes'
  | 'terms';

// Numeric and date actions carry `undefined` for a cleared input: an emptied box must remove
// its value from the document, or the PDF keeps printing a number the form no longer shows.
export type InvoiceAction =
  | { readonly type: 'modeChanged'; readonly mode: InvoiceMode }
  | { readonly type: 'textChanged'; readonly field: TextFieldName; readonly value: string }
  | { readonly type: 'issueDateChanged'; readonly date: IsoDate | undefined }
  | { readonly type: 'dueDateChanged'; readonly date: IsoDate | undefined }
  | { readonly type: 'lineItemAdded' }
  | { readonly type: 'lineItemRemoved'; readonly id: LineItemId }
  | {
      readonly type: 'lineDescriptionChanged';
      readonly id: LineItemId;
      readonly description: string;
    }
  | {
      readonly type: 'lineQuantityChanged';
      readonly id: LineItemId;
      readonly quantity: Milli | undefined;
    }
  | {
      readonly type: 'lineUnitPriceChanged';
      readonly id: LineItemId;
      readonly unitPrice: Minor | undefined;
    }
  | {
      readonly type: 'simpleAmountChanged';
      readonly id: LineItemId;
      readonly amount: Minor | undefined;
    }
  | { readonly type: 'discountChanged'; readonly discount: Discount | undefined }
  | { readonly type: 'amountPaidChanged'; readonly amount: Minor | undefined }
  | { readonly type: 'fieldInvalidated'; readonly key: FieldKey }
  | { readonly type: 'pageSizeChanged'; readonly pageSize: PageSize }
  | { readonly type: 'invoiceExported'; readonly invoiceNumber: string }
  | { readonly type: 'newInvoiceStarted'; readonly today: IsoDate }
  | { readonly type: 'savedProfileCleared'; readonly defaultPageSize: PageSize };
