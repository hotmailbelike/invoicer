import { assert } from '../assert';
import type { Brand } from '../brand';

/** A calendar day as YYYY-MM-DD. No time and no zone: an issue date is a day, not an instant. */
export type IsoDate = Brand<string, 'IsoDate'>;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

/** True only for a real calendar day, so "2026-02-30" is rejected. */
export function isIsoDate(text: string): text is IsoDate {
  const match = ISO_DATE.exec(text);
  if (match === null) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function toIsoDate(text: string): IsoDate {
  assert(isIsoDate(text), `expected a YYYY-MM-DD calendar date, got "${text}"`);
  return text;
}

/** Midnight UTC of the day — formatting it with timeZone "UTC" can never shift the date. */
export function isoDateToUtcMs(date: IsoDate): number {
  const match = ISO_DATE.exec(date);
  assert(match !== null, `malformed IsoDate "${date}"`);
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** The calendar day in the user's own timezone — the day they are writing the invoice. */
export function localIsoDate(now: Date): IsoDate {
  const year = String(now.getFullYear()).padStart(4, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return toIsoDate(`${year}-${month}-${day}`);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const shifted = new Date(isoDateToUtcMs(date) + days * MS_PER_DAY);
  return toIsoDate(shifted.toISOString().slice(0, 10));
}
