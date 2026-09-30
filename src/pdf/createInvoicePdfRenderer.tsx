import { pdf } from '@react-pdf/renderer';
import type { PdfRenderInput } from '@/domain/pdf-plan/invoicePlan';
import { InvoicePdfDocument } from './InvoicePdfDocument';
import { registerFonts } from './registerFonts';
import type { FontFiles } from './registerFonts';

export type InvoicePdfRenderer = (input: PdfRenderInput) => Promise<Blob>;

export function createInvoicePdfRenderer(fonts: FontFiles): InvoicePdfRenderer {
  registerFonts(fonts);
  return (input) => pdf(<InvoicePdfDocument input={input} />).toBlob();
}
