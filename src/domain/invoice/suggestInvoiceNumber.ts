import type { IsoDate } from '../dates/isoDate';

const LAST_DIGIT_RUN = /(\d+)(\D*)$/;

function incrementLastNumber(invoiceNumber: string): string {
  const match = LAST_DIGIT_RUN.exec(invoiceNumber);
  const digits = match?.[1];
  if (match === null || digits === undefined) {
    return invoiceNumber;
  }
  // BigInt, because nothing stops a numbering scheme from outgrowing a double.
  const next = (BigInt(digits) + 1n).toString().padStart(digits.length, '0');
  return `${invoiceNumber.slice(0, match.index)}${next}${match[2] ?? ''}`;
}

/**
 * The number to offer for a new invoice: the most recent one with its last run of digits
 * incremented, keeping zero-padding and any prefix or suffix ("2026-014-ACME" becomes
 * "2026-015-ACME"). Falls back to a date-based number when there is nothing to continue.
 */
export function suggestInvoiceNumber(
  recentInvoiceNumbers: readonly string[],
  today: IsoDate,
): string {
  const latest = recentInvoiceNumbers[0];
  if (latest === undefined || !LAST_DIGIT_RUN.test(latest)) {
    return `INV-${today}`;
  }
  let candidate = incrementLastNumber(latest);
  // Each step yields a new value, so this ends after at most one step per recent number.
  for (
    let step = 0;
    step < recentInvoiceNumbers.length && recentInvoiceNumbers.includes(candidate);
    step += 1
  ) {
    candidate = incrementLastNumber(candidate);
  }
  return candidate;
}
