import { describe, expect, it } from 'vitest';
import { toIsoDate } from '../dates/isoDate';
import type { InvoiceDocument, LineItem } from '../invoice/invoiceDocument';
import { toLineItemId } from '../invoice/lineItemId';
import { toBps, toMilli, toMinor } from '../units';
import { planSections } from './planSections';

function item(id: number, fields: Partial<Omit<LineItem, 'id'>> = {}): LineItem {
  return { id: toLineItemId(id), description: '', ...fields };
}

function invoice(fields: Partial<InvoiceDocument> = {}): InvoiceDocument {
  return {
    mode: 'detailed',
    from: 'Omar\nStudio Street 1',
    billTo: 'Northwind Ltd',
    invoiceNumber: 'INV-0042',
    issueDate: toIsoDate('2026-09-16'),
    currency: 'USD',
    lineItems: [item(1, { description: 'Design retainer', unitPrice: toMinor(320_000) })],
    paymentHeading: '',
    paymentDetails: '',
    notes: '',
    terms: '',
    ...fields,
  };
}

const everyDetailedSection = invoice({
  dueDate: toIsoDate('2026-09-30'),
  lineItems: [
    item(1, { description: 'Design', quantity: toMilli(7_500), unitPrice: toMinor(12_000) }),
    item(2, { description: 'Testing', quantity: toMilli(2_000), unitPrice: toMinor(45_000) }),
  ],
  discount: { kind: 'percent', rate: toBps(1_000) },
  amountPaid: toMinor(62_000),
  paymentHeading: 'Bank transfer',
  paymentDetails: 'IBAN GB29NWBK60161331926819',
  notes: 'Thanks!',
  terms: 'Net 14',
});

describe('planSections — simple mode', () => {
  it('prints one description and one amount, hiding detailed data without discarding it', () => {
    const document = { ...everyDetailedSection, mode: 'simple' as const };
    expect(planSections(document)).toEqual({
      mode: 'simple',
      currency: 'USD',
      invoiceNumber: 'INV-0042',
      issueDate: '2026-09-16',
      from: 'Omar\nStudio Street 1',
      billTo: 'Northwind Ltd',
      description: 'Design',
      totalDue: 90_000,
    });
    expect(planSections({ ...document, mode: 'detailed' })).toMatchObject({
      discount: { rate: 1_000, amount: 18_000 },
      notes: 'Thanks!',
    });
  });

  it('shows the first line with content rather than a blank first row', () => {
    const plan = planSections(
      invoice({
        mode: 'simple',
        lineItems: [item(1), item(2, { description: 'Second', unitPrice: toMinor(5_000) })],
      }),
    );
    expect(plan).toMatchObject({ description: 'Second', totalDue: 5_000 });
  });

  it('prints nothing optional for an untouched invoice', () => {
    const plan = planSections(
      invoice({
        mode: 'simple',
        from: '  ',
        billTo: '',
        invoiceNumber: '',
        issueDate: undefined,
        lineItems: [item(1)],
      }),
    );
    expect(plan).toEqual({ mode: 'simple', currency: 'USD', totalDue: 0 });
  });
});

describe('planSections — detailed mode', () => {
  it('includes every section once each has content', () => {
    expect(planSections(everyDetailedSection)).toMatchObject({
      dueDate: '2026-09-30',
      showQuantityColumns: true,
      subtotal: 180_000,
      discount: { rate: 1_000, amount: 18_000 },
      totalDue: 162_000,
      payment: { amountPaid: 62_000, balanceDue: 100_000 },
      paymentDetails: { heading: 'Bank transfer', body: 'IBAN GB29NWBK60161331926819' },
      notes: 'Thanks!',
      terms: 'Net 14',
    });
  });

  it('omits every empty optional section rather than printing an empty block', () => {
    const plan = planSections(
      invoice({
        from: '',
        billTo: '\n',
        notes: '   ',
        terms: '',
        paymentHeading: 'Unused heading',
      }),
    );
    expect(plan).toEqual({
      mode: 'detailed',
      currency: 'USD',
      invoiceNumber: 'INV-0042',
      issueDate: '2026-09-16',
      lines: [
        {
          id: 1,
          description: 'Design retainer',
          quantity: 1_000,
          unitPrice: 320_000,
          amount: 320_000,
        },
      ],
      showQuantityColumns: false,
      totalDue: 320_000,
    });
  });

  it('skips rows the user never touched', () => {
    const plan = planSections(
      invoice({ lineItems: [item(1), item(2, { unitPrice: toMinor(100) }), item(3)] }),
    );
    expect(plan.mode === 'detailed' && plan.lines.map((line) => line.id)).toEqual([2]);
  });

  it('hides a discount that comes to nothing', () => {
    const plan = planSections(invoice({ discount: { kind: 'percent', rate: toBps(0) } }));
    expect(plan).toMatchObject({ discount: undefined, subtotal: undefined });
  });

  it('labels payment details with a default heading when only the body is given', () => {
    const plan = planSections(invoice({ paymentDetails: 'PayPal: omar@example.com' }));
    expect(plan).toMatchObject({
      paymentDetails: { heading: 'Payment details', body: 'PayPal: omar@example.com' },
    });
  });
});
