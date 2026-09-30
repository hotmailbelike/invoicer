import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';

const variantClassNames: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 disabled:bg-indigo-300',
  secondary:
    'border border-zinc-300 bg-white text-zinc-800 shadow-xs hover:bg-zinc-50 disabled:text-zinc-400',
  quiet: 'text-zinc-700 hover:bg-zinc-200/60 disabled:text-zinc-400',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: Variant;
}

export function Button({ variant = 'secondary', type = 'button', className, ...rest }: Props) {
  return (
    <button
      {...rest}
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed',
        variantClassNames[variant],
        className,
      )}
    />
  );
}
