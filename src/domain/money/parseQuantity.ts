import type { Result } from '../result';
import { MAX_MILLI, QUANTITY_DECIMALS, toMilli } from '../units';
import type { Milli } from '../units';
import { parseScaledDecimal } from './parseScaledDecimal';
import type { NumericParseError } from './parseScaledDecimal';

/** Parses a quantity such as "7.5" into integer thousandths. */
export function parseQuantity(text: string): Result<Milli, NumericParseError> {
  const parsed = parseScaledDecimal(text.trim(), QUANTITY_DECIMALS, MAX_MILLI);
  return parsed.ok ? { ok: true, value: toMilli(parsed.value) } : parsed;
}
