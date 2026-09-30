import type { LineItemId } from '@/domain/invoice/invoiceDocument';

/** Identifies a numeric input, so the app knows which ones hold text that does not parse. */
export type FieldKey =
  | `simple-amount:${number}`
  | `quantity:${number}`
  | `unit-price:${number}`
  | 'discount'
  | 'amount-paid';

export const fieldKeys = {
  simpleAmount: (id: LineItemId): FieldKey => `simple-amount:${id}`,
  quantity: (id: LineItemId): FieldKey => `quantity:${id}`,
  unitPrice: (id: LineItemId): FieldKey => `unit-price:${id}`,
  discount: 'discount',
  amountPaid: 'amount-paid',
} as const;
