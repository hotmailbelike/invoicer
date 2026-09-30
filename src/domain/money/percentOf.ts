import { BPS_PER_WHOLE, toMinor } from '../units';
import type { Bps, Minor } from '../units';
import { divideRounded } from './divideRounded';

/**
 * `amount × rate / 10_000`, rounded half away from zero.
 *
 * Multiplying first could exceed Number.MAX_SAFE_INTEGER for large subtotals, so the whole
 * multiples of 10_000 are scaled exactly and only the remainder is rounded.
 */
export function percentOf(amount: Minor, rate: Bps): Minor {
  const remainder = amount % BPS_PER_WHOLE;
  const wholeParts = (amount - remainder) / BPS_PER_WHOLE;
  return toMinor(wholeParts * rate + divideRounded(remainder * rate, BPS_PER_WHOLE));
}
