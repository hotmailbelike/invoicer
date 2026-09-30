import { describe, expect, it } from 'vitest';
import { parseMoney } from './parseMoney';
import { parsePercent } from './parsePercent';
import { parseQuantity } from './parseQuantity';

describe('parseMoney', () => {
  it.each([
    ['1,234.56', 123_456],
    ['$1,234.56', 123_456],
    ['€ 99', 9_900],
    ['  42  ', 4_200],
    ['0.5', 50],
    ['.5', 50],
    ['5.', 500],
    ['1.500', 150],
    ['0', 0],
    ['007', 700],
    ['1,000,000.00', 100_000_000],
  ])('reads %j as %d cents', (text, cents) => {
    expect(parseMoney(text)).toEqual({ ok: true, value: cents });
  });

  it.each(['', ' ', '.', 'abc', '12OO', '1 000', '1.2.3', '12,34', '1,2345', 'USD 5'])(
    'rejects %j as not a number',
    (text) => {
      expect(parseMoney(text)).toEqual({ ok: false, error: 'not-a-number' });
    },
  );

  it('rejects sub-cent precision instead of rounding it away', () => {
    expect(parseMoney('1.505')).toEqual({ ok: false, error: 'too-many-decimals' });
  });

  it.each(['-5', '$-5', '1,000,000.01', '99999999999999999999'])(
    'rejects %j as out of range',
    (text) => {
      expect(parseMoney(text)).toEqual({ ok: false, error: 'out-of-range' });
    },
  );
});

describe('parseQuantity', () => {
  it('reads thousandths', () => {
    expect(parseQuantity('7.5')).toEqual({ ok: true, value: 7_500 });
    expect(parseQuantity('0.333')).toEqual({ ok: true, value: 333 });
    expect(parseQuantity('10,000')).toEqual({ ok: true, value: 10_000_000 });
  });

  it('rejects what it cannot represent exactly', () => {
    expect(parseQuantity('0.0005')).toEqual({ ok: false, error: 'too-many-decimals' });
    expect(parseQuantity('10000.001')).toEqual({ ok: false, error: 'out-of-range' });
  });
});

describe('parsePercent', () => {
  it('reads basis points, with or without a percent sign', () => {
    expect(parsePercent('12.5%')).toEqual({ ok: true, value: 1_250 });
    expect(parsePercent('12.5 %')).toEqual({ ok: true, value: 1_250 });
    expect(parsePercent('100')).toEqual({ ok: true, value: 10_000 });
  });

  it('rejects rates it cannot represent', () => {
    expect(parsePercent('100.01')).toEqual({ ok: false, error: 'out-of-range' });
    expect(parsePercent('12.345')).toEqual({ ok: false, error: 'too-many-decimals' });
  });
});
