import type { IsoDate } from '../dates/isoDate';
import { blankLineItem } from './blankLineItem';
import type { InvoiceDocument, InvoiceMode, LineItemId } from './invoiceDocument';

export interface NewInvoiceDetails {
  readonly mode: InvoiceMode;
  readonly from: string;
  readonly paymentHeading: string;
  readonly paymentDetails: string;
  readonly currency: string;
  readonly invoiceNumber: string;
  readonly issueDate: IsoDate;
  readonly firstLineItemId: LineItemId;
}

/** A fresh invoice carrying over only the sender's own side. */
export function createInvoiceDocument(details: NewInvoiceDetails): InvoiceDocument {
  return {
    mode: details.mode,
    from: details.from,
    billTo: '',
    invoiceNumber: details.invoiceNumber,
    issueDate: details.issueDate,
    currency: details.currency,
    lineItems: [blankLineItem(details.firstLineItemId)],
    paymentHeading: details.paymentHeading,
    paymentDetails: details.paymentDetails,
    notes: '',
    terms: '',
  };
}
