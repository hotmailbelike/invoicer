const FORBIDDEN_IN_FILE_NAMES = /[\\/:*?"<>|\p{Cc}]/gu;
const MAX_BASE_NAME_LENGTH = 100;

/** "INV 2026/014" becomes "INV-2026014.pdf"; an empty number becomes "invoice.pdf". */
export function invoiceFileName(invoiceNumber: string): string {
  const baseName = invoiceNumber
    .replace(FORBIDDEN_IN_FILE_NAMES, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^\.+/, '')
    .slice(0, MAX_BASE_NAME_LENGTH);
  return `${baseName === '' ? 'invoice' : baseName}.pdf`;
}
