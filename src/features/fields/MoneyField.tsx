import clsx from 'clsx';
import type { ReactNode } from 'react';
import { formatAmount } from '@/domain/money/formatDecimal';
import { parseMoney } from '@/domain/money/parseMoney';
import type { Minor } from '@/domain/units';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';
import { moneyParseMessages } from './numericParseMessages';
import { useNumericDraft } from './useNumericDraft';

interface Props {
  readonly label: ReactNode;
  readonly value: Minor | undefined;
  readonly onValue: (value: Minor | undefined) => void;
  readonly onInvalid: () => void;
  readonly hideLabel?: boolean;
  readonly hint?: ReactNode;
  readonly placeholder?: string;
  readonly className?: string;
}

export function MoneyField({
  label,
  value,
  onValue,
  onInvalid,
  hideLabel,
  hint,
  placeholder = '0.00',
  className,
}: Props) {
  const draft = useNumericDraft({
    value,
    parse: parseMoney,
    format: formatAmount,
    onValue,
    onInvalid,
  });
  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={draft.visibleError === undefined ? undefined : moneyParseMessages[draft.visibleError]}
      className={className}
    >
      {(control) => (
        <input
          {...control}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft.text}
          placeholder={placeholder}
          onChange={(event) => {
            draft.handleChange(event.target.value);
          }}
          onBlur={draft.handleBlur}
          className={clsx(inputClassName, 'text-right tabular-nums')}
        />
      )}
    </FieldShell>
  );
}
