// localStorage throws outright in some contexts (Safari private browsing, storage disabled,
// quota exceeded). Remembering details is a convenience, so every failure degrades to "the
// app works, it just doesn't remember" — never an exception and never a toast.

let hasWarned = false;

function warnOnce(error: unknown): void {
  if (hasWarned) {
    return;
  }
  hasWarned = true;
  console.warn(
    'Invoicer cannot use browser storage, so your details will not be remembered.',
    error,
  );
}

/** The parsed value, or undefined when the key is absent, unreadable, or not valid JSON. */
export function readStoredJson(key: string): unknown {
  let text: string | null;
  try {
    text = window.localStorage.getItem(key);
  } catch (error) {
    warnOnce(error);
    return undefined;
  }
  if (text === null) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    // Corrupt or hand-edited data: treat it as absent and let the next save replace it.
    return undefined;
  }
}

export function writeStoredJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    warnOnce(error);
  }
}

export function removeStoredItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    warnOnce(error);
  }
}
