import { assert } from './assert';
import type { Brand } from './brand';

/** Integer cents. Always two decimal places, whatever the currency. */
export type Minor = Brand<number, 'Minor'>;
/** Integer thousandths of a unit: 7_500 is 7.5. */
export type Milli = Brand<number, 'Milli'>;
/** Integer basis points: 1_000 is 10%. */
export type Bps = Brand<number, 'Bps'>;

export const MONEY_DECIMALS = 2;
export const QUANTITY_DECIMALS = 3;
export const PERCENT_DECIMALS = 2;

export const MINOR_PER_UNIT = 100;
export const MILLI_PER_UNIT = 1_000;
export const BPS_PER_WHOLE = 10_000;

// These caps keep every intermediate product exact: the largest line product is
// MAX_MINOR × MAX_MILLI = 1e15, below Number.MAX_SAFE_INTEGER (~9.007e15).
export const MAX_MINOR = 100_000_000; // 1,000,000.00
export const MAX_MILLI = 10_000_000; // 10,000.000
export const MAX_BPS = 10_000; // 100%

function isMinor(value: number): value is Minor {
  return Number.isSafeInteger(value);
}

function isMilli(value: number): value is Milli {
  return Number.isSafeInteger(value);
}

function isBps(value: number): value is Bps {
  return Number.isSafeInteger(value);
}

export function toMinor(value: number): Minor {
  assert(isMinor(value), `expected integer cents, got ${value}`);
  return value;
}

export function toMilli(value: number): Milli {
  assert(isMilli(value), `expected integer thousandths, got ${value}`);
  return value;
}

export function toBps(value: number): Bps {
  assert(isBps(value), `expected integer basis points, got ${value}`);
  return value;
}

export const ZERO_MINOR = toMinor(0);
export const ONE_UNIT = toMilli(MILLI_PER_UNIT);

export function addMinor(left: Minor, right: Minor): Minor {
  return toMinor(left + right);
}

export function subtractMinor(left: Minor, right: Minor): Minor {
  return toMinor(left - right);
}
