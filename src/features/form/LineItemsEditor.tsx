import { useInvoice } from '@/state/useInvoice';
import { Button } from '../fields/Button';
import { PlusIcon } from '../icons/PlusIcon';
import { LineItemRow } from './LineItemRow';

export function LineItemsEditor() {
  const { state, dispatch } = useInvoice();
  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-3">
        {state.document.lineItems.map((item, index) => (
          // Keyed by id, never index: removing a row must not hand its typed text to the next.
          <LineItemRow key={item.id} item={item} position={index + 1} />
        ))}
      </ol>
      <Button
        className="self-start"
        onClick={() => {
          dispatch({ type: 'lineItemAdded' });
        }}
      >
        <PlusIcon className="size-4" />
        Add line
      </Button>
    </div>
  );
}
