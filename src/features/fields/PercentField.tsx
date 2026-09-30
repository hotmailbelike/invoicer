import clsx from 'clsx';
import type { ReactNode } from 'react';
import { formatPercent } from '@/domain/money/formatDecimal';
import { parsePercent } from '@/domain/money/parsePercent';
import type { Bps } from '@/domain/units';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';
import { percentParseMessages } from './numericParseMessages';
import { useNumericDraft } from './useNumericDraft';

interface Props {
  readonly label: ReactNode;
  readonly value: Bps | undefined;
  readonly onValue: (value: Bps | undefined) => void;
  readonly onInvalid: () => void;
  readonly hideLabel?: boolean;
  readonly hint?: ReactNode;
  readonly placeholder?: string;
  readonly className?: string;
}

export function PercentField({
  label,
  value,
  onValue,
  onInvalid,
  hideLabel,
  hint,
  placeholder = '0',
  className,
}: Props) {
  const draft = useNumericDraft({
    value,
    parse: parsePercent,
    format: formatPercent,
    onValue,
    onInvalid,
  });
  return (
    <FieldShell
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={
        draft.visibleError === undefined ? undefined : percentParseMessages[draft.visibleError]
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
