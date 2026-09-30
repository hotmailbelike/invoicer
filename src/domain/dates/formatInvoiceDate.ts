import { INVOICE_LOCALE } from '../invoiceLocale';
import { isoDateToUtcMs } from './isoDate';
import type { IsoDate } from './isoDate';

// timeZone "UTC" is load-bearing: the day is stored as midnight UTC, and formatting it in a
// local zone west of Greenwich would print the previous day.
const invoiceDateFormat = new Intl.DateTimeFormat(INVOICE_LOCALE, {
  dateStyle: 'long',
  timeZone: 'UTC',
});

/** "September 16, 2026". */
export function formatInvoiceDate(date: IsoDate): string {
  return invoiceDateFormat.format(isoDateToUtcMs(date));
}
