import { assert } from '../assert';

/**
 * Integer division rounded half away from zero, exact for every safe-integer input.
 *
 * Works from the remainder rather than a float quotient: near 1e15 a double no longer holds
 * the fractional digits that decide the rounding direction.
 */
export function divideRounded(numerator: number, denominator: number): number {
  assert(Number.isSafeInteger(numerator), `numerator must be a safe integer, got ${numerator}`);
  assert(
    Number.isSafeInteger(denominator) && denominator > 0,
    `denominator must be a positive safe integer, got ${denominator}`,
  );
  const magnitude = Math.abs(numerator);
  const remainder = magnitude % denominator;
  const quotient = (magnitude - remainder) / denominator;
  const rounded = remainder * 2 >= denominator ? quotient + 1 : quotient;
  // Avoids -0, which Intl formats as "-$0.00".
  return numerator < 0 && rounded !== 0 ? -rounded : rounded;
}
