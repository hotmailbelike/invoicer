// A run of characters with no breaking space. No-break spaces join a run rather than end it,
// because react-pdf will not break there either.
const UNBREAKABLE_RUN = /(?:\S|[\u00A0\u2007\u202F])+/gu;

/**
 * Splits any run longer than `maxRunLength` characters onto new lines.
 *
 * react-pdf cannot break inside a word without printing a hyphen, and an overlong word runs
 * off the page and is clipped — silently cutting the end off a payment link. A newline starts
 * a new paragraph instead, which never gets a hyphen and keeps every character visible.
 */
export function breakLongWords(text: string, maxRunLength: number): string {
  return text.replace(UNBREAKABLE_RUN, (run) => {
    // By code point, so a surrogate pair such as an emoji is never cut in half.
    const characters = Array.from(run);
    if (characters.length <= maxRunLength) {
      return run;
    }
    const lines: string[] = [];
    for (let start = 0; start < characters.length; start += maxRunLength) {
      lines.push(characters.slice(start, start + maxRunLength).join(''));
    }
    return lines.join('\n');
  });
}
