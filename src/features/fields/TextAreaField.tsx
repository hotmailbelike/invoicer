import clsx from 'clsx';
import type { ReactNode } from 'react';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';

interface Props {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly hideLabel?: boolean;
  readonly hint?: ReactNode;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly className?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  hideLabel,
  hint,
  placeholder,
  rows = 3,
  className,
}: Props) {
  return (
    <FieldShell label={label} hideLabel={hideLabel} hint={hint} className={className}>
      {(control) => (
        <textarea
          {...control}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          // Grows with its content where supported; elsewhere it keeps `rows` and scrolls.
          className={clsx(inputClassName, 'field-sizing-content resize-y')}
        />
      )}
    </FieldShell>
  );
}
