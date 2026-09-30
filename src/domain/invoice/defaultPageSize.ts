import type { PageSize } from './invoiceDocument';

const LETTER_REGIONS = new Set(['US', 'CA', 'MX', 'PH']);

/** Letter where it is the local standard, A4 everywhere else. Only ever an initial value. */
export function defaultPageSize(languageTag: string): PageSize {
  try {
    // maximize() infers the likely region, so a bare "en" resolves to en-Latn-US.
    const region = new Intl.Locale(languageTag).maximize().region;
    return region !== undefined && LETTER_REGIONS.has(region) ? 'LETTER' : 'A4';
  } catch {
    return 'A4';
  }
}
