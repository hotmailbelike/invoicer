import { useState } from 'react';
import type { NumericParseError } from '@/domain/money/parseScaledDecimal';
import type { Result } from '@/domain/result';

interface Options<Value> {
  readonly value: Value | undefined;
  readonly parse: (text: string) => Result<Value, NumericParseError>;
  readonly format: (value: Value) => string;
  readonly onValue: (value: Value | undefined) => void;
  readonly onInvalid: () => void;
}

export interface NumericDraft {
  readonly text: string;
  /** Only once the user has left the field — never while they are still typing. */
  readonly visibleError: NumericParseError | undefined;
  readonly handleChange: (text: string) => void;
  readonly handleBlur: () => void;
}

/**
 * The text a number input displays, kept in step with the document it edits.
 *
 * On every change: an emptied box clears the value, parseable text sets it, and anything else
 * leaves the document alone and marks the field invalid, which blocks export. Without the
 * clearing branch, deleting an amount would leave the old figure printing on the PDF while the
 * box reads empty. Remount with a `key` to re-read the document value.
 */
export function useNumericDraft<Value>({
  value,
  parse,
  format,
  onValue,
  onInvalid,
}: Options<Value>): NumericDraft {
  const [text, setText] = useState(() => (value === undefined ? '' : format(value)));
  const [hasLeftField, setHasLeftField] = useState(false);

  const parsed = text.trim() === '' ? undefined : parse(text);
  const error = parsed === undefined || parsed.ok ? undefined : parsed.error;

  function handleChange(nextText: string): void {
    setText(nextText);
    if (nextText.trim() === '') {
      setHasLeftField(false);
      onValue(undefined);
      return;
    }
    const result = parse(nextText);
    if (result.ok) {
      setHasLeftField(false);
      onValue(result.value);
    } else {
      onInvalid();
    }
  }

  function handleBlur(): void {
    if (parsed === undefined) {
      return;
    }
    if (parsed.ok) {
      // Normalise what was typed ("1234.5") to how it reads back ("1,234.50").
      const formatted = format(parsed.value);
      if (formatted !== text) {
        setText(formatted);
      }
    } else {
      setHasLeftField(true);
    }
  }

  return {
    text,
    visibleError: hasLeftField ? error : undefined,
    handleChange,
    handleBlur,
  };
}
