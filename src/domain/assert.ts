/** Guards an invariant the type system cannot express. A failure is a bug, never bad input. */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violated: ${message}`);
  }
}

/** Makes a missed union member a compile error, and a loud one if it slips through at runtime. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}
