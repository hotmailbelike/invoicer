import type { Brand } from '../brand';
import type { IsoDate } from '../dates/isoDate';
import type { Bps, Milli, Minor } from '../units';

export type InvoiceMode = 'simple' | 'detailed';

export type PageSize = 'A4' | 'LETTER';

export type LineItemId = Brand<number, 'LineItemId'>;

export interface LineItem {
  readonly id: LineItemId;
  readonly description: string;
  /** Absent means one unit. */
  readonly quantity?: Milli;
  readonly unitPrice?: Minor;
}

// Absence already means "not provided, do not print", so there is no { kind: 'none' } member.
export type Discount =
  | { readonly kind: 'percent'; readonly rate: Bps }
  | { readonly kind: 'fixed'; readonly amount: Minor };

export type DiscountKind = Discount['kind'];

/** One document shared by both modes. Switching mode changes what prints, never what is kept. */
export interface InvoiceDocument {
  readonly mode: InvoiceMode;
  readonly from: string;
  readonly billTo: string;
  readonly invoiceNumber: string;
  readonly issueDate?: IsoDate;
  readonly dueDate?: IsoDate;
  readonly currency: string;
  readonly lineItems: readonly LineItem[];
  readonly discount?: Discount;
  readonly amountPaid?: Minor;
  readonly paymentHeading: string;
  readonly paymentDetails: string;
  readonly notes: string;
  readonly terms: string;
}
