import { readFile } from 'node:fs/promises';
import { extractText, getDocumentProxy } from 'unpdf';
import { describe, expect, it } from 'vitest';
import { toIsoDate } from '@/domain/dates/isoDate';
import type { InvoiceDocument, LineItem, PageSize } from '@/domain/invoice/invoiceDocument';
import { toLineItemId } from '@/domain/invoice/lineItemId';
import { planSections } from '@/domain/pdf-plan/planSections';
import { toBps, toMilli, toMinor } from '@/domain/units';
import { createInvoicePdfRenderer } from './createInvoicePdfRenderer';
import { registerFonts } from './registerFonts';
import type { FontFiles } from './registerFonts';

const RENDER_TIMEOUT_MS = 30_000;

const bundledFonts: FontFiles = {
  regular: new Uint8Array(await readFile(new URL('./fonts/inter-400.ttf', import.meta.url))),
  semiBold: new Uint8Array(await readFile(new URL('./fonts/inter-600.ttf', import.meta.url))),
};

async function renderPdf(
  document: InvoiceDocument,
  options: { pageSize?: PageSize } = {},
): Promise<Uint8Array> {
  const render = createInvoicePdfRenderer(bundledFonts);
  const blob = await render({ plan: planSections(document), pageSize: options.pageSize ?? 'A4' });
  return new Uint8Array(await blob.arrayBuffer());
}

async function pageTexts(bytes: Uint8Array): Promise<string[]> {
  const { text } = await extractText(bytes, { mergePages: false });
  return text;
}

/** Text extraction inserts whitespace at line and item boundaries; compare without it. */
function compact(text: string): string {
  return text.replace(/\s+/g, '');
}

function invoice(fields: Partial<InvoiceDocument>): InvoiceDocument {
  return {
    mode: 'simple',
    from: 'Omar Haddad\n12 Studio Street',
    billTo: 'Northwind Studio Ltd',
    invoiceNumber: 'INV-0042',
    issueDate: toIsoDate('2026-09-16'),
    currency: 'USD',
    lineItems: [
      {
        id: toLineItemId(0),
        description: 'Product design retainer, 1–14 September',
        unitPrice: toMinor(320_000),
      },
    ],
    paymentHeading: '',
    paymentDetails: '',
    notes: '',
    terms: '',
    ...fields,
  };
}

const IBAN = 'GB29NWBK60161331926819';

describe('InvoicePdfDocument', () => {
  it(
    'prints a simple invoice with only its own sections',
    async () => {
      const pages = await pageTexts(
        await renderPdf(
          invoice({
            notes: 'Detailed-only note',
            discount: { kind: 'percent', rate: toBps(1_000) },
          }),
        ),
      );
      expect(pages).toHaveLength(1);
      const page = compact(pages.join(' '));
      for (const expected of [
        'INVOICE',
        'INV-0042',
        'September16,2026',
        'OmarHaddad',
        'NorthwindStudioLtd',
        'Productdesignretainer,1–14September',
        '$3,200.00',
      ]) {
        expect(page).toContain(expected);
      }
      for (const hidden of ['Detailed-onlynote', 'Subtotal', 'Discount', 'Page1of']) {
        expect(page).not.toContain(hidden);
      }
    },
    RENDER_TIMEOUT_MS,
  );

  it(
    'paginates a long detailed invoice, repeating the table header and keeping totals whole',
    async () => {
      const lineItems: LineItem[] = Array.from({ length: 36 }, (_, index) => ({
        id: toLineItemId(index),
        description: `Consulting session ${index + 1}`,
        quantity: toMilli(1_500),
        unitPrice: toMinor(12_000),
      }));
      const pages = await pageTexts(
        await renderPdf(
          invoice({
            mode: 'detailed',
            dueDate: toIsoDate('2026-09-30'),
            lineItems,
            discount: { kind: 'percent', rate: toBps(1_000) },
            amountPaid: toMinor(88_000),
            paymentHeading: 'Bank transfer',
            paymentDetails: `Beneficiary: Omar Haddad\nIBAN ${IBAN}`,
            notes: 'Thank you for your business.',
            terms: 'Payable within 14 days.',
          }),
        ),
      );

      expect(pages.length).toBeGreaterThanOrEqual(2);
      pages.forEach((text, index) => {
        const page = compact(text);
        expect(page).toContain(`Page${index + 1}of${pages.length}`);
        // The header is uppercased in print, and repeats on every page the table reaches.
        if (page.includes('Consultingsession')) {
          expect(page).toContain('DESCRIPTIONQTYRATEAMOUNT');
        }
      });

      const lastPage = compact(pages.at(-1) ?? '');
      // 36 × 1.5 × $120.00 = $6,480.00; 10% off = $5,832.00; $880.00 paid leaves $4,952.00.
      for (const expected of [
        'Subtotal$6,480.00',
        'Discount(10%)−$648.00',
        'Total$5,832.00',
        'Paid−$880.00',
        'Balancedue$4,952.00',
      ]) {
        expect(lastPage).toContain(expected);
      }

      const everything = compact(pages.join(' '));
      expect(everything).toContain('September30,2026');
      expect(everything).toContain('Consultingsession36');
      expect(everything).toContain('Thankyouforyourbusiness.');
      expect(everything).toContain('Payablewithin14days.');
    },
    RENDER_TIMEOUT_MS,
  );

  it(
    'never breaks a long unspaced token with an inserted hyphen',
    async () => {
      // Hyphenation only happens at a line break, so the token must be too long for one line
      // or a broken hyphenation callback would pass unnoticed.
      const unbreakable = IBAN.repeat(5);
      const pages = await pageTexts(
        await renderPdf(
          invoice({ mode: 'detailed', paymentDetails: `IBAN ${IBAN}\nRef ${unbreakable}` }),
        ),
      );
      const everything = compact(pages.join(' '));
      expect(everything).toContain(`IBAN${IBAN}`);
      expect(everything).toContain(`Ref${unbreakable}`);
    },
    RENDER_TIMEOUT_MS,
  );

  it(
    'draws currency symbols and non-English names with the embedded font',
    async () => {
      const pages = await pageTexts(
        await renderPdf(
          invoice({
            currency: 'EUR',
            billTo: 'Łódź Café — Жук & Ωmega\n£ ¥ ₹ ₺ ₦',
          }),
        ),
      );
      const everything = compact(pages.join(' '));
      expect(everything).toContain('€3,200.00');
      expect(everything).toContain('ŁódźCafé—Жук&Ωmega');
      expect(everything).toContain('£¥₹₺₦');
    },
    RENDER_TIMEOUT_MS,
  );

  it(
    'honours the page size',
    async () => {
      const letter = await getDocumentProxy(await renderPdf(invoice({}), { pageSize: 'LETTER' }));
      const a4 = await getDocumentProxy(await renderPdf(invoice({}), { pageSize: 'A4' }));
      const letterPage = (await letter.getPage(1)).getViewport({ scale: 1 });
      const a4Page = (await a4.getPage(1)).getViewport({ scale: 1 });
      expect([Math.round(letterPage.width), Math.round(letterPage.height)]).toEqual([612, 792]);
      expect([Math.round(a4Page.width), Math.round(a4Page.height)]).toEqual([595, 842]);
    },
    RENDER_TIMEOUT_MS,
  );

  it('refuses empty font data instead of rendering in a fallback font', () => {
    const empty: FontFiles = { regular: new Uint8Array(), semiBold: bundledFonts.semiBold };
    expect(() => {
      registerFonts(empty);
    }).toThrow('empty');
  });
});
