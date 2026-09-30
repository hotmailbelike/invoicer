import { ClearSavedDataButton } from './ClearSavedDataButton';

export function SettingsMenu() {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
        Saved data
      </summary>
      <div className="absolute right-0 z-10 mt-2 flex w-72 flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-lg">
        <p>
          Your From details, payment details, recent invoice numbers and preferences are saved in
          this browser only. Nothing is sent to a server.
        </p>
        <p>Safari may clear them after about a week without a visit.</p>
        <ClearSavedDataButton />
      </div>
    </details>
  );
}
