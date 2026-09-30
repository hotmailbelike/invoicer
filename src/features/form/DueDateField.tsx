import { addDays, localIsoDate } from '@/domain/dates/isoDate';
import { useInvoice } from '@/state/useInvoice';
import { DateField } from '../fields/DateField';

const PRESETS = [
  { label: 'On receipt', days: 0 },
  { label: 'Net 14', days: 14 },
  { label: 'Net 30', days: 30 },
] as const;

export function DueDateField() {
  const { state, dispatch } = useInvoice();
  const { issueDate, dueDate } = state.document;

  function applyPreset(days: number): void {
    dispatch({
      type: 'dueDateChanged',
      date: addDays(issueDate ?? localIsoDate(new Date()), days),
    });
  }

  return (
    <DateField
      label="Due date"
      value={dueDate}
      onChange={(date) => {
        dispatch({ type: 'dueDateChanged', date });
      }}
      hint={
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                applyPreset(preset.days);
              }}
              className="font-medium text-indigo-700 hover:text-indigo-900"
            >
              {preset.label}
            </button>
          ))}
          {dueDate !== undefined && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'dueDateChanged', date: undefined });
              }}
              className="font-medium text-zinc-600 hover:text-zinc-900"
            >
              No due date
            </button>
          )}
        </span>
      }
    />
  );
}
