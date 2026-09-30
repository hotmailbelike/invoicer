/** Whitespace alone is not content: a Notes box holding a stray newline must not print. */
export function hasContent(text: string): boolean {
  return text.trim().length > 0;
}
