import { Text } from '@react-pdf/renderer';
import { pdfStyles } from '../pdfStyles';

/** Page numbers, printed only when the invoice runs past one page. */
export function PageFooter() {
  return (
    <Text
      fixed
      style={pdfStyles.footer}
      render={({ pageNumber, totalPages }) =>
        totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
      }
    />
  );
}
