import type { Result } from '../result';
import { MAX_BPS, PERCENT_DECIMALS, toBps } from '../units';
import type { Bps } from '../units';
import { parseScaledDecimal } from './parseScaledDecimal';
import type { NumericParseError } from './parseScaledDecimal';

const TRAILING_PERCENT_SIGN = /\s*%$/;

/** Parses a percentage such as "12.5" or "12.5%" into integer basis points. */
export function parsePercent(text: string): Result<Bps, NumericParseError> {
  const digits = text.trim().replace(TRAILING_PERCENT_SIGN, '');
  const parsed = parseScaledDecimal(digits, PERCENT_DECIMALS, MAX_BPS);
  return parsed.ok ? { ok: true, value: toBps(parsed.value) } : parsed;
}
