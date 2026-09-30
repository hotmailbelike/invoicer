import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface Props {
  readonly title: string;
  /** Shown while collapsed, so an optional section still says what it is for. */
  readonly summary: string;
  readonly initiallyOpen: boolean;
  readonly children: ReactNode;
}

export function FormSection({ title, summary, initiallyOpen, children }: Props) {
  // Captured once: if `open` tracked content, clearing the last field in a section would
  // collapse it under the user's cursor.
  const [openOnMount] = useState(initiallyOpen);
  return (
    <details open={openOnMount} className="group rounded-lg border border-zinc-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-4 py-3 focus-visible:outline-2 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <span className="min-w-0 flex-1 truncate text-sm text-zinc-500 group-open:invisible">
          {summary}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-4 border-t border-zinc-200 px-4 pt-4 pb-5">{children}</div>
    </details>
  );
}
