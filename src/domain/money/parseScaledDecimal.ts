import type { Result } from '../result';

export type NumericParseError = 'not-a-number' | 'too-many-decimals' | 'out-of-range';

// Plain digits, or digits grouped by commas in threes, then an optional fraction. The invoice
// locale is en-US, so "12,34" is rejected instead of being silently read as 1234.
const DECIMAL = /^(\d{1,3}(?:,\d{3})+|\d*)(?:\.(\d*))?$/;
const NON_ZERO_DIGIT = /[1-9]/;

/**
 * Reads a non-negative decimal as an integer count of 10^-scale units: "12.5" at scale 2 is
 * 1250. Never goes through floating point, so no input can round its way to another value.
 * Callers trim whitespace and strip any symbol first.
 */
export function parseScaledDecimal(
  text: string,
  scale: number,
  max: number,
): Result<number, NumericParseError> {
  if (text.startsWith('-')) {
    return { ok: false, error: 'out-of-range' };
  }
  const match = DECIMAL.exec(text);
  if (match === null) {
    return { ok: false, error: 'not-a-number' };
  }
  const integerDigits = (match[1] ?? '').replaceAll(',', '');
  const fractionDigits = match[2] ?? '';
  if (integerDigits === '' && fractionDigits === '') {
    return { ok: false, error: 'not-a-number' };
  }
  // Trailing zeros past the allowed precision change nothing ("1.500" is 1.50).
  if (NON_ZERO_DIGIT.test(fractionDigits.slice(scale))) {
    return { ok: false, error: 'too-many-decimals' };
  }

  const unitsPerWhole = 10 ** scale;
  const wholeDigits = integerDigits.replace(/^0+/, '');
  // Reject oversized input by length before Number() can lose precision on it.
  if (wholeDigits.length > String(Math.floor(max / unitsPerWhole)).length) {
    return { ok: false, error: 'out-of-range' };
  }
  const whole = wholeDigits === '' ? 0 : Number(wholeDigits);
  const fraction = Number(fractionDigits.slice(0, scale).padEnd(scale, '0'));
  const value = whole * unitsPerWhole + fraction;
  if (value > max) {
    return { ok: false, error: 'out-of-range' };
  }
  return { ok: true, value };
}
