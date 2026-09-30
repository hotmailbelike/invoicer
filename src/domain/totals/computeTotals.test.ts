import { describe, expect, it } from 'vitest';
import type { LineItem } from '../invoice/invoiceDocument';
import { toLineItemId } from '../invoice/lineItemId';
import { divideRounded } from '../money/divideRounded';
import { percentOf } from '../money/percentOf';
import { toBps, toMilli, toMinor } from '../units';
import { computeTotals } from './computeTotals';
import { lineAmount } from './lineAmount';

function line(id: number, unitPrice: number, quantity?: number): LineItem {
  return {
    id: toLineItemId(id),
    description: `Line ${id}`,
    unitPrice: toMinor(unitPrice),
    quantity: quantity === undefined ? undefined : toMilli(quantity),
  };
}

describe('divideRounded', () => {
  it('rounds half away from zero in both directions', () => {
    expect(divideRounded(1_500, 1_000)).toBe(2);
    expect(divideRounded(1_499, 1_000)).toBe(1);
    expect(divideRounded(-1_500, 1_000)).toBe(-2);
    expect(divideRounded(-1_499, 1_000)).toBe(-1);
  });

  it('never produces negative zero', () => {
    expect(Object.is(divideRounded(-1, 1_000), 0)).toBe(true);
  });

  it('stays exact where a float quotient would not', () => {
    expect(divideRounded(999_999_999_999_999, 1_000)).toBe(1_000_000_000_000);
    expect(divideRounded(999_999_999_999_499, 1_000)).toBe(999_999_999_999);
  });
});

describe('percentOf', () => {
  it('rounds the share half away from zero', () => {
    expect(percentOf(toMinor(12_345), toBps(1_000))).toBe(1_235);
    expect(percentOf(toMinor(5), toBps(1_000))).toBe(1);
  });

  it('does not overflow on subtotals whose product with the rate is unsafe', () => {
    expect(percentOf(toMinor(9_000_000_000_000_001), toBps(5_000))).toBe(4_500_000_000_000_001);
  });
});

describe('lineAmount', () => {
  it('treats a missing quantity as one and a missing price as zero', () => {
    expect(lineAmount({ id: toLineItemId(1), description: '', unitPrice: toMinor(4_200) })).toBe(
      4_200,
    );
    expect(lineAmount({ id: toLineItemId(1), description: 'Unpriced' })).toBe(0);
  });

  it('rounds each line to the cent', () => {
    expect(lineAmount(line(1, 1, 1_500))).toBe(2);
    expect(lineAmount(line(1, 1_000, 333))).toBe(333);
  });
});

describe('computeTotals', () => {
  it('makes the printed line amounts add up to the printed subtotal', () => {
    const lines = [line(1, 333, 1_500), line(2, 1_001, 2_250), line(3, 1, 500), line(4, 999, 333)];
    const printedSum = lines.reduce((sum, item) => sum + lineAmount(item), 0);
    expect(computeTotals(lines, undefined, undefined).subtotal).toBe(printedSum);
  });

  it('applies a percentage discount to the subtotal', () => {
    const totals = computeTotals(
      [line(1, 12_000, 7_500), line(2, 45_000, 2_000)],
      { kind: 'percent', rate: toBps(1_000) },
      undefined,
    );
    expect(totals).toEqual({
      subtotal: 180_000,
      discount: 18_000,
      total: 162_000,
      amountPaid: 0,
      balanceDue: 162_000,
    });
  });

  it('subtracts an amount already paid from the balance', () => {
    const totals = computeTotals([line(1, 100_000)], undefined, toMinor(40_000));
    expect(totals.total).toBe(100_000);
    expect(totals.balanceDue).toBe(60_000);
  });

  it('does not clamp a discount larger than the subtotal', () => {
    const totals = computeTotals(
      [line(1, 30_000)],
      { kind: 'fixed', amount: toMinor(50_000) },
      undefined,
    );
    expect(totals.total).toBe(-20_000);
  });

  it('is zero for an invoice with no lines', () => {
    expect(computeTotals([], undefined, undefined)).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
      amountPaid: 0,
      balanceDue: 0,
    });
  });
});
