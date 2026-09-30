import { INVOICE_LOCALE } from '../invoiceLocale';
import { MINOR_PER_UNIT, MONEY_DECIMALS } from '../units';
import type { Minor } from '../units';

const WELL_FORMED_CURRENCY_CODE = /^[A-Za-z]{3}$/;

const plainAmount = new Intl.NumberFormat(INVOICE_LOCALE, {
  minimumFractionDigits: MONEY_DECIMALS,
  maximumFractionDigits: MONEY_DECIMALS,
});

// The preview re-renders on every pause in typing; constructing a formatter per amount is
// the one measurable cost on that path.
const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(code: string): Intl.NumberFormat {
  const cached = currencyFormatters.get(code);
  if (cached !== undefined) {
    return cached;
  }
  const formatter = new Intl.NumberFormat(INVOICE_LOCALE, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: MONEY_DECIMALS,
    maximumFractionDigits: MONEY_DECIMALS,
  });
  currencyFormatters.set(code, formatter);
  return formatter;
}

/**
 * Formats cents for print: "$3,200.00" for a three-letter code Intl recognises the shape of,
 * otherwise "CODE 3,200.00". Always two decimals — wrong for JPY and KRW, the accepted cost
 * of a free-text currency field. Dividing to a double stays exact to the cent for any amount
 * far beyond the input caps.
 */
export function formatMoney(amount: Minor, currency: string): string {
  const code = currency.trim();
  const value = amount / MINOR_PER_UNIT;
  if (WELL_FORMED_CURRENCY_CODE.test(code)) {
    return currencyFormatter(code.toUpperCase()).format(value);
  }
  const formatted = plainAmount.format(value);
  return code === '' ? formatted : `${code} ${formatted}`;
}
