import { Font } from '@react-pdf/renderer';
import { PDF_FONT_FAMILY } from './theme';

export interface FontFiles {
  readonly regular: Uint8Array;
  readonly semiBold: Uint8Array;
}

const BASE64_CHUNK_BYTES = 0x8000;

function toBase64DataUrl(bytes: Uint8Array): string {
  let binary = '';
  // Chunked, because spreading a whole font into one call exceeds engine argument limits.
  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_BYTES) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK_BYTES));
  }
  return `data:font/ttf;base64,${btoa(binary)}`;
}

/**
 * Registers Inter from bytes the caller has already loaded. Handing react-pdf a data URL means
 * it never fetches anything itself — it caches a failed fetch for the life of the page, and
 * its Font.clear() also removes the built-in fonts, so a failed load could never be retried.
 */
export function registerFonts(files: FontFiles): void {
  if (files.regular.byteLength === 0 || files.semiBold.byteLength === 0) {
    // Otherwise the invoice would silently render in a fallback font nobody chose.
    throw new Error('Cannot register the invoice font: its file is empty.');
  }
  if (Font.getRegisteredFontFamilies().includes(PDF_FONT_FAMILY)) {
    return;
  }
  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      { src: toBase64DataUrl(files.regular), fontWeight: 400 },
      { src: toBase64DataUrl(files.semiBold), fontWeight: 600 },
    ],
  });
  // Hyphenation is on by default and would split client names, and break an IBAN in two
  // across lines. Returning the word whole disables it. Never return chunks to force long
  // tokens to wrap: react-pdf prints a literal hyphen at every such break.
  Font.registerHyphenationCallback((word) => [word]);
}
