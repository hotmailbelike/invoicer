import type { IsoDate } from '../dates/isoDate';
import type { LineItemId, PageSize } from '../invoice/invoiceDocument';
import type { Bps, Milli, Minor } from '../units';

// Every optional section is either present with its content or undefined, so the PDF
// renders a section exactly when its value is defined and holds no presence logic itself.

export interface PlannedLine {
  readonly id: LineItemId;
  readonly description: string;
  readonly quantity: Milli;
  readonly unitPrice: Minor;
  readonly amount: Minor;
}

export interface PlannedDiscount {
  /** Set for a percentage discount so its label can show the rate. */
  readonly rate?: Bps;
  readonly amount: Minor;
}

export interface PlannedPayment {
  readonly amountPaid: Minor;
  readonly balanceDue: Minor;
}

export interface PlannedPaymentDetails {
  readonly heading: string;
  readonly body: string;
}

export interface PlannedHeader {
  readonly currency: string;
  readonly invoiceNumber?: string;
  readonly issueDate?: IsoDate;
  readonly from?: string;
  readonly billTo?: string;
}

export interface SimplePlan extends PlannedHeader {
  readonly mode: 'simple';
  readonly description?: string;
  readonly totalDue: Minor;
}

export interface DetailedPlan extends PlannedHeader {
  readonly mode: 'detailed';
  readonly dueDate?: IsoDate;
  readonly lines: readonly PlannedLine[];
  readonly showQuantityColumns: boolean;
  readonly subtotal?: Minor;
  readonly discount?: PlannedDiscount;
  readonly totalDue: Minor;
  readonly payment?: PlannedPayment;
  readonly paymentDetails?: PlannedPaymentDetails;
  readonly notes?: string;
  readonly terms?: string;
}

export type InvoicePlan = SimplePlan | DetailedPlan;

/** Everything the PDF needs, as plain serialisable values. */
export interface PdfRenderInput {
  readonly plan: InvoicePlan;
  readonly pageSize: PageSize;
}
