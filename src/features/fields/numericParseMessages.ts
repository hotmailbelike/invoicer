import { formatAmount, formatQuantity } from '@/domain/money/formatDecimal';
import type { NumericParseError } from '@/domain/money/parseScaledDecimal';
import { MAX_MILLI, MAX_MINOR, toMilli, toMinor } from '@/domain/units';

// Records keyed by every failure, so a new parse error without a message does not compile.

export const moneyParseMessages: Record<NumericParseError, string> = {
  'not-a-number': 'Enter an amount like 1,250.00.',
  'too-many-decimals': 'Use at most two decimal places.',
  'out-of-range': `Enter an amount from 0 to ${formatAmount(toMinor(MAX_MINOR))}.`,
};

export const quantityParseMessages: Record<NumericParseError, string> = {
  'not-a-number': 'Enter a quantity like 7.5.',
  'too-many-decimals': 'Use at most three decimal places.',
  'out-of-range': `Enter a quantity from 0 to ${formatQuantity(toMilli(MAX_MILLI))}.`,
};

export const percentParseMessages: Record<NumericParseError, string> = {
  'not-a-number': 'Enter a percentage like 10 or 12.5.',
  'too-many-decimals': 'Use at most two decimal places.',
  'out-of-range': 'Enter a percentage from 0 to 100.',
};
