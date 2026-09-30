import { defaultPageSize } from '@/domain/invoice/defaultPageSize';
import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';

export function ClearSavedDataButton() {
  const { dispatch } = useInvoice();

  function clearSavedData(): void {
    const confirmed = window.confirm(
      'Clear your saved details from this browser? Your From details, payment details, recent invoice numbers and preferences are removed. The client and line items on screen stay.',
    );
    if (confirmed) {
      dispatch({
        type: 'savedProfileCleared',
        defaultPageSize: defaultPageSize(navigator.language),
      });
    }
  }

  return (
    <Button onClick={clearSavedData} className="w-full">
      Clear saved details
    </Button>
  );
}
