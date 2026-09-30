import type { ReactNode } from 'react';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';

interface Props {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly hint?: ReactNode;
  readonly placeholder?: string;
  readonly maxLength?: number;
  readonly list?: string;
  readonly autoComplete?: string;
  readonly spellCheck?: boolean;
  readonly className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  maxLength,
  list,
  autoComplete = 'off',
  spellCheck,
  className,
}: Props) {
  return (
    <FieldShell label={label} hint={hint} className={className}>
      {(control) => (
        <input
          {...control}
          type="text"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          list={list}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className={inputClassName}
        />
      )}
    </FieldShell>
  );
}
