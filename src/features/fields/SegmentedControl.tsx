import clsx from 'clsx';
import { useId } from 'react';

interface Option<Value extends string> {
  readonly value: Value;
  readonly label: string;
}

interface Props<Value extends string> {
  readonly legend: string;
  readonly options: readonly Option<Value>[];
  readonly value: Value;
  readonly onChange: (value: Value) => void;
  readonly className?: string;
}

/** A radio group styled as segments, so arrow-key navigation and semantics come for free. */
export function SegmentedControl<Value extends string>({
  legend,
  options,
  value,
  onChange,
  className,
}: Props<Value>) {
  const name = useId();
  return (
    <fieldset className={clsx('inline-flex rounded-lg bg-zinc-200/70 p-0.5', className)}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={clsx(
            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
            'has-focus-visible:outline-2 has-focus-visible:outline-indigo-500',
            option.value === value
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => {
              onChange(option.value);
            }}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
