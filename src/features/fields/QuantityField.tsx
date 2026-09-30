import clsx from 'clsx';
import type { ReactNode } from 'react';
import { formatQuantity } from '@/domain/money/formatDecimal';
import { parseQuantity } from '@/domain/money/parseQuantity';
import type { Milli } from '@/domain/units';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';
import { quantityParseMessages } from './numericParseMessages';
import { useNumericDraft } from './useNumericDraft';

interface Props {
  readonly label: ReactNode;
  readonly value: Milli | undefined;
  readonly onValue: (value: Milli | undefined) => void;
  readonly onInvalid: () => void;
  readonly hideLabel?: boolean;
  readonly hint?: ReactNode;
  readonly placeholder?: string;
  readonly className?: string;
}

export function QuantityField({
  label,
  value,
  onValue,
  onInvalid,
  hideLabel,
  hint,
  placeholder = '1',
  className,
}: Props) {
  const draft = useNumericDraft({
    value,
    parse: parseQuantity,
    format: formatQuantity,
    onValue,
    onInvalid,
  });
  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={
        draft.visibleError === undefined ? undefined : quantityParseMessages[draft.visibleError]
      }
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
