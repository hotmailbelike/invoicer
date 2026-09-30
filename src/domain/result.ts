/** The outcome of parsing user text: a value, or the specific reason it was rejected. */
export type Result<Value, Failure> =
  { readonly ok: true; readonly value: Value } | { readonly ok: false; readonly error: Failure };
