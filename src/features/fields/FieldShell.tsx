import clsx from 'clsx';
import { useId } from 'react';
import type { ReactNode } from 'react';

export interface ControlAttributes {
  readonly id: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-invalid'?: true;
}

interface Props {
  readonly label: ReactNode;
  /** Keeps the label for assistive technology when a visible column heading already says it. */
  readonly hideLabel?: boolean;
  readonly hint?: ReactNode;
  readonly error?: string;
  readonly className?: string;
  readonly children: (control: ControlAttributes) => ReactNode;
}

export function FieldShell({ label, hideLabel = false, hint, error, className, children }: Props) {
  const id = useId();
  const controlId = `${id}-control`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  // Only reference descriptions that are actually rendered.
  const describedBy = [
    hint === undefined ? undefined : hintId,
    error === undefined ? undefined : errorId,
  ]
    .filter((value): value is string => value !== undefined)
    .join(' ');

  return (
    <div className={clsx('flex min-w-0 flex-col gap-1.5', className)}>
      <label
        htmlFor={controlId}
        className={hideLabel ? 'sr-only' : 'text-sm font-medium text-zinc-800'}
      >
        {label}
      </label>
      {children({
        id: controlId,
        'aria-describedby': describedBy === '' ? undefined : describedBy,
        'aria-invalid': error === undefined ? undefined : true,
      })}
      {hint !== undefined && (
        <div id={hintId} className="text-xs text-zinc-500">
          {hint}
        </div>
      )}
      {error !== undefined && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
