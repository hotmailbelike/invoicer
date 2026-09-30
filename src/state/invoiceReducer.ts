import { assertNever } from '@/domain/assert';
import { blankLineItem } from '@/domain/invoice/blankLineItem';
import { createInvoiceDocument } from '@/domain/invoice/createInvoiceDocument';
import type { InvoiceDocument, LineItem, LineItemId } from '@/domain/invoice/invoiceDocument';
import { toLineItemId } from '@/domain/invoice/lineItemId';
import { suggestInvoiceNumber } from '@/domain/invoice/suggestInvoiceNumber';
import { fieldKeys } from './fieldKeys';
import type { FieldKey } from './fieldKeys';
import type { InvoiceAction, TextFieldName } from './invoiceActions';
import type { InvoiceState } from './invoiceState';
import { MAX_RECENT_INVOICE_NUMBERS } from './storage/storedProfile';

function withText(document: InvoiceDocument, field: TextFieldName, value: string): InvoiceDocument {
  switch (field) {
    case 'from':
      return { ...document, from: value };
    case 'billTo':
      return { ...document, billTo: value };
    case 'invoiceNumber':
      return { ...document, invoiceNumber: value };
    case 'currency':
      return { ...document, currency: value };
    case 'paymentHeading':
      return { ...document, paymentHeading: value };
    case 'paymentDetails':
      return { ...document, paymentDetails: value };
    case 'notes':
      return { ...document, notes: value };
    case 'terms':
      return { ...document, terms: value };
    default:
      return assertNever(field);
  }
}

function withoutKey(keys: readonly FieldKey[], key: FieldKey): readonly FieldKey[] {
  return keys.includes(key) ? keys.filter((existing) => existing !== key) : keys;
}

function withLine(
  state: InvoiceState,
  id: LineItemId,
  update: (item: LineItem) => LineItem,
): InvoiceState {
  return {
    ...state,
    document: {
      ...state.document,
      lineItems: state.document.lineItems.map((item) => (item.id === id ? update(item) : item)),
    },
  };
}

export function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case 'modeChanged':
      if (action.mode === state.document.mode) {
        return state;
      }
      // Mode-specific numeric inputs unmount on a switch, taking their unparsed text with them.
      // Nothing in the document is cleared: the other mode's data is hidden, not discarded.
      return {
        ...state,
        document: { ...state.document, mode: action.mode },
        invalidFieldKeys: [],
      };

    case 'textChanged':
      return { ...state, document: withText(state.document, action.field, action.value) };

    case 'issueDateChanged':
      return { ...state, document: { ...state.document, issueDate: action.date } };

    case 'dueDateChanged':
      return { ...state, document: { ...state.document, dueDate: action.date } };

    case 'lineItemAdded':
      return {
        ...state,
        document: {
          ...state.document,
          lineItems: [...state.document.lineItems, blankLineItem(state.nextLineItemId)],
        },
        nextLineItemId: toLineItemId(state.nextLineItemId + 1),
      };

    case 'lineItemRemoved': {
      const remaining = state.document.lineItems.filter((item) => item.id !== action.id);
      if (remaining.length === state.document.lineItems.length) {
        return state;
      }
      const removedKeys = new Set([
        fieldKeys.quantity(action.id),
        fieldKeys.unitPrice(action.id),
        fieldKeys.simpleAmount(action.id),
      ]);
      // There is always one row to type into; replacing the last one needs a fresh id so its
      // inputs remount empty rather than inheriting the removed row's text.
      const replacesLastRow = remaining.length === 0;
      return {
        ...state,
        document: {
          ...state.document,
          lineItems: replacesLastRow ? [blankLineItem(state.nextLineItemId)] : remaining,
        },
        nextLineItemId: replacesLastRow
          ? toLineItemId(state.nextLineItemId + 1)
          : state.nextLineItemId,
        invalidFieldKeys: state.invalidFieldKeys.filter((key) => !removedKeys.has(key)),
      };
    }

    case 'lineDescriptionChanged':
      return withLine(state, action.id, (item) => ({ ...item, description: action.description }));

    case 'lineQuantityChanged':
      return {
        ...withLine(state, action.id, (item) => ({ ...item, quantity: action.quantity })),
        invalidFieldKeys: withoutKey(state.invalidFieldKeys, fieldKeys.quantity(action.id)),
      };

    case 'lineUnitPriceChanged':
      return {
        ...withLine(state, action.id, (item) => ({ ...item, unitPrice: action.unitPrice })),
        invalidFieldKeys: withoutKey(state.invalidFieldKeys, fieldKeys.unitPrice(action.id)),
      };

    case 'simpleAmountChanged':
      // Simple mode shows one amount per line, so typing it replaces quantity × rate with that
      // amount; otherwise the box would say 900 while the PDF printed 7.5 × 900.
      return {
        ...withLine(state, action.id, (item) => ({
          ...item,
          unitPrice: action.amount,
          quantity: undefined,
        })),
        invalidFieldKeys: withoutKey(state.invalidFieldKeys, fieldKeys.simpleAmount(action.id)),
      };

    case 'discountChanged':
      return {
        ...state,
        document: { ...state.document, discount: action.discount },
        invalidFieldKeys: withoutKey(state.invalidFieldKeys, fieldKeys.discount),
      };

    case 'amountPaidChanged':
      return {
        ...state,
        document: { ...state.document, amountPaid: action.amount },
        invalidFieldKeys: withoutKey(state.invalidFieldKeys, fieldKeys.amountPaid),
      };

    case 'fieldInvalidated':
      return state.invalidFieldKeys.includes(action.key)
        ? state
        : { ...state, invalidFieldKeys: [...state.invalidFieldKeys, action.key] };

    case 'pageSizeChanged':
      return { ...state, pageSize: action.pageSize };

    case 'invoiceExported': {
      const invoiceNumber = action.invoiceNumber.trim();
      if (invoiceNumber === '') {
        return state;
      }
      return {
        ...state,
        exportedInvoiceNumber: invoiceNumber,
        recentInvoiceNumbers: [
          invoiceNumber,
          ...state.recentInvoiceNumbers.filter((existing) => existing !== invoiceNumber),
        ].slice(0, MAX_RECENT_INVOICE_NUMBERS),
      };
    }

    case 'newInvoiceStarted':
      return {
        ...state,
        document: createInvoiceDocument({
          mode: state.document.mode,
          from: state.document.from,
          paymentHeading: state.document.paymentHeading,
          paymentDetails: state.document.paymentDetails,
          currency: state.document.currency,
          invoiceNumber: suggestInvoiceNumber(state.recentInvoiceNumbers, action.today),
          issueDate: action.today,
          firstLineItemId: state.nextLineItemId,
        }),
        nextLineItemId: toLineItemId(state.nextLineItemId + 1),
        formRevision: state.formRevision + 1,
        invalidFieldKeys: [],
        exportedInvoiceNumber: undefined,
      };

    case 'savedProfileCleared':
      // Clears what would otherwise be saved straight back: the sender's details and the
      // remembered preferences. The client, line items and notes on screen are kept.
      return {
        ...state,
        document: {
          ...state.document,
          mode: 'simple',
          from: '',
          paymentHeading: '',
          paymentDetails: '',
        },
        pageSize: action.defaultPageSize,
        recentInvoiceNumbers: [],
        invalidFieldKeys: state.document.mode === 'simple' ? state.invalidFieldKeys : [],
      };

    default:
      return assertNever(action);
  }
}
