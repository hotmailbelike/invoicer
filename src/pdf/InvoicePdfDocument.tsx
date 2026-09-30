import { Document, Page } from '@react-pdf/renderer';
import type { PdfRenderInput } from '@/domain/pdf-plan/invoicePlan';
import { InvoiceHeader } from './components/InvoiceHeader';
import { PageFooter } from './components/PageFooter';
import { TextColumns } from './components/TextColumns';
import { pdfStyles } from './pdfStyles';
import { DetailedInvoiceBody } from './templates/DetailedInvoiceBody';
import { SimpleInvoiceBody } from './templates/SimpleInvoiceBody';

interface Props {
  readonly input: PdfRenderInput;
}

/** A pure function of the render input: no state, no provider, no side effects. */
export function InvoicePdfDocument({ input }: Props) {
  const { plan, pageSize } = input;
  return (
    <Document
      title={plan.invoiceNumber === undefined ? 'Invoice' : `Invoice ${plan.invoiceNumber}`}
      creator="Invoicer"
      producer="Invoicer"
      language="en-US"
    >
      <Page size={pageSize} style={pdfStyles.page}>
        <InvoiceHeader
          invoiceNumber={plan.invoiceNumber}
          issueDate={plan.issueDate}
          dueDate={plan.mode === 'detailed' ? plan.dueDate : undefined}
        />
        <TextColumns
          left={plan.from === undefined ? undefined : { label: 'From', text: plan.from }}
          right={plan.billTo === undefined ? undefined : { label: 'Bill to', text: plan.billTo }}
        />
        {plan.mode === 'simple' ? (
          <SimpleInvoiceBody plan={plan} />
        ) : (
          <DetailedInvoiceBody plan={plan} />
        )}
        <PageFooter />
      </Page>
    </Document>
  );
}
