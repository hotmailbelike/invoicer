import { INVOICE_LOCALE } from '../invoiceLocale';
import {
  BPS_PER_WHOLE,
  MILLI_PER_UNIT,
  MINOR_PER_UNIT,
  MONEY_DECIMALS,
  PERCENT_DECIMALS,
  QUANTITY_DECIMALS,
} from '../units';
import type { Bps, Milli, Minor } from '../units';

const amountFormat = new Intl.NumberFormat(INVOICE_LOCALE, {
  minimumFractionDigits: MONEY_DECIMALS,
  maximumFractionDigits: MONEY_DECIMALS,
});

const quantityFormat = new Intl.NumberFormat(INVOICE_LOCALE, {
  maximumFractionDigits: QUANTITY_DECIMALS,
});

const percentFormat = new Intl.NumberFormat(INVOICE_LOCALE, {
  maximumFractionDigits: PERCENT_DECIMALS,
});

/** "1,234.56" — an amount without a currency, in the shape parseMoney reads back. */
export function formatAmount(amount: Minor): string {
  return amountFormat.format(amount / MINOR_PER_UNIT);
}

/** "7.5" — trailing zeros dropped, as a person would write a quantity. */
export function formatQuantity(quantity: Milli): string {
  return quantityFormat.format(quantity / MILLI_PER_UNIT);
}

/** "12.5" — the percentage without its sign. */
export function formatPercent(rate: Bps): string {
  return percentFormat.format((rate * 100) / BPS_PER_WHOLE);
}
