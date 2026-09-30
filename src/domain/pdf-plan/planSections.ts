import { assertNever } from '../assert';
import { hasContent } from '../invoice/hasContent';
import type { InvoiceDocument } from '../invoice/invoiceDocument';
import { simpleLineItem } from '../invoice/simpleLineItem';
import { computeTotals } from '../totals/computeTotals';
import { isVisibleLine } from '../totals/isVisibleLine';
import { lineAmount } from '../totals/lineAmount';
import { ONE_UNIT, ZERO_MINOR } from '../units';
import type {
  DetailedPlan,
  InvoicePlan,
  PlannedDiscount,
  PlannedHeader,
  PlannedPayment,
  SimplePlan,
} from './invoicePlan';

const DEFAULT_PAYMENT_HEADING = 'Payment details';

function optionalText(text: string): string | undefined {
  return hasContent(text) ? text.trim() : undefined;
}

function planHeader(document: InvoiceDocument): PlannedHeader {
  return {
    currency: document.currency,
    invoiceNumber: optionalText(document.invoiceNumber),
    issueDate: document.issueDate,
    from: optionalText(document.from),
    billTo: optionalText(document.billTo),
  };
}

function planSimple(document: InvoiceDocument): SimplePlan {
  const line = simpleLineItem(document);
  return {
    ...planHeader(document),
    mode: 'simple',
    description: line === undefined ? undefined : optionalText(line.description),
    totalDue: line === undefined ? ZERO_MINOR : lineAmount(line),
  };
}

function planDetailed(document: InvoiceDocument): DetailedPlan {
  const lines = document.lineItems.filter(isVisibleLine);
  const totals = computeTotals(lines, document.discount, document.amountPaid);

  const discount: PlannedDiscount | undefined =
    document.discount === undefined || totals.discount === 0
      ? undefined
      : {
          rate: document.discount.kind === 'percent' ? document.discount.rate : undefined,
          amount: totals.discount,
        };
  const payment: PlannedPayment | undefined =
    totals.amountPaid > 0
      ? { amountPaid: totals.amountPaid, balanceDue: totals.balanceDue }
      : undefined;
  const paymentBody = optionalText(document.paymentDetails);

  return {
    ...planHeader(document),
    mode: 'detailed',
    dueDate: document.dueDate,
    lines: lines.map((item) => ({
      id: item.id,
      description: item.description.trim(),
      quantity: item.quantity ?? ONE_UNIT,
      unitPrice: item.unitPrice ?? ZERO_MINOR,
      amount: lineAmount(item),
    })),
    showQuantityColumns: lines.some(
      (item) => item.quantity !== undefined && item.quantity !== ONE_UNIT,
    ),
    // A subtotal equal to the total is noise; it only earns a row when something follows it.
    subtotal:
      lines.length > 0 && (discount !== undefined || payment !== undefined)
        ? totals.subtotal
        : undefined,
    discount,
    totalDue: totals.total,
    payment,
    paymentDetails:
      paymentBody === undefined
        ? undefined
        : {
            heading: optionalText(document.paymentHeading) ?? DEFAULT_PAYMENT_HEADING,
            body: paymentBody,
          },
    notes: optionalText(document.notes),
    terms: optionalText(document.terms),
  };
}

/**
 * Decides exactly what prints. Mode gates first — simple mode hides detailed data without
 * discarding it — and presence second: an empty section is undefined, never an empty block.
 */
export function planSections(document: InvoiceDocument): InvoicePlan {
  switch (document.mode) {
    case 'simple':
      return planSimple(document);
    case 'detailed':
      return planDetailed(document);
    default:
      return assertNever(document.mode);
  }
}
