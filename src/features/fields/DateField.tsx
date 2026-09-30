import type { ReactNode } from 'react';
import { isIsoDate } from '@/domain/dates/isoDate';
import type { IsoDate } from '@/domain/dates/isoDate';
import { FieldShell } from './FieldShell';
import { inputClassName } from './fieldStyles';

interface Props {
  readonly label: string;
  readonly value: IsoDate | undefined;
  readonly onChange: (date: IsoDate | undefined) => void;
  readonly hint?: ReactNode;
  readonly className?: string;
}

export function DateField({ label, value, onChange, hint, className }: Props) {
  return (
    <FieldShell label={label} hint={hint} className={className}>
      {(control) => (
        <input
          {...control}
          type="date"
          value={value ?? ''}
          onChange={(event) => {
            const text = event.target.value;
            // A date input reports "" both when cleared and while a date is half-typed; either
            // way the document must not keep printing the previous date.
            if (text === '') {
              onChange(undefined);
            } else if (isIsoDate(text)) {
              onChange(text);
            }
          }}
          className={inputClassName}
        />
      )}
    </FieldShell>
  );
}
