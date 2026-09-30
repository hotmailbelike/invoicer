import type { Result } from '../result';
import { MAX_MINOR, MONEY_DECIMALS, toMinor } from '../units';
import type { Minor } from '../units';
import { parseScaledDecimal } from './parseScaledDecimal';
import type { NumericParseError } from './parseScaledDecimal';

const LEADING_CURRENCY_SYMBOL = /^\p{Sc}\s*/u;

/** Parses an amount such as "1,234.56" or "$1,234.56" into integer cents. */
export function parseMoney(text: string): Result<Minor, NumericParseError> {
  const digits = text.trim().replace(LEADING_CURRENCY_SYMBOL, '');
  const parsed = parseScaledDecimal(digits, MONEY_DECIMALS, MAX_MINOR);
  return parsed.ok ? { ok: true, value: toMinor(parsed.value) } : parsed;
}
