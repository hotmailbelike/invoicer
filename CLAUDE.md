# Invoicer

Static single-page invoice generator: React + Vite + TypeScript, deployed to Netlify. No backend,
no database, no accounts. Produces a real vector PDF with `@react-pdf/renderer`; the preview pane
shows that same PDF. Desktop only. One user, a couple of invoices a month.

Every rule below names the bug it prevents. Do not add a rule that cannot.

## Commands

```bash
npm run dev          # local dev server
npm run verify       # typecheck + lint + format check + tests + PDF style guard — must pass
npm run build        # typecheck + production build into dist/
npm run fonts -- /path/to/unzipped/Inter-4.1   # only to change the embedded font subset
```

## Stack — pinned on purpose

- **`typescript` is pinned to 6.0.3.** `typescript-eslint` peers `<6.1.0`. Never "fix" an install
  error with `--legacy-peer-deps`: typed linting silently stops working and the `any` rules below
  become decorative.
- **Vite 7 with `@vitejs/plugin-react` 5.** plugin-react 6 requires Vite 8.
- **`@react-pdf/renderer` is pinned exactly.** Minor releases have changed text layout; a silently
  reflowed invoice is the worst regression this app can have.
- Tailwind v4 is CSS-first: `@import 'tailwindcss'` in `src/index.css`, no config file.
- Do not add: a component library, a state library, `react-hook-form`, a date or decimal library,
  an icon package, `pdfjs-dist`. Each was considered and rejected — see `DECISIONS.md`.

## Layering — three edges are enforced by ESLint

```
src/domain/     pure TypeScript: units, money, dates, totals, what prints. No React, no DOM.
src/pdf/        the react-pdf document. A pure function of its render input.
src/state/      reducer, actions, context, selectors, localStorage adapter.
src/features/   components and hooks.
src/app/        composition root.
```

1. `src/domain` imports no React, CSS, `@react-pdf/*`, state, features or app — it is the one
   layer testable without rendering anything.
2. `src/pdf` imports no state, features or app — the PDF must render from plain values, which is
   what makes the PDF test cheap.
3. **Only `src/features/preview/loadPdfRenderer.ts` may import `@/pdf` or `@react-pdf/*` as
   values.** Anything else pulls ~460 kB gzipped into the first page load. Type-only imports are
   allowed anywhere; `verbatimModuleSyntax` keeps them visibly distinct.

## TypeScript

- **Never `any`.** ESLint runs `recommendedTypeChecked`, whose `no-unsafe-*` rules catch `any`
  _spreading_ through assignments, calls and returns — not just the keyword. `JSON.parse` returns
  `any`, so stored data enters only through `readStoredJson` (returns `unknown`) and a zod schema.
- Type assertions (`as SomeType`) are allowed only in test fixtures; brand constructors narrow
  with type predicates instead. `as const` is fine.
- `@ts-ignore` is banned; `@ts-expect-error` needs a reason.
- `noUncheckedIndexedAccess` is on: `lineItems[0]` is `LineItem | undefined`, and zero lines is a
  real state. `exactOptionalPropertyTypes` is off: every detailed field is optional and it would
  force casts at every React boundary.
- Union members are string literals and every `switch` over one is exhaustive. `assertNever`
  guards the ones where a missed case would produce a wrong number.

## Errors — one strategy

Exceptions by default. `Result` only for parsing user text. A nullable return never signals
failure, except `readStoredJson`, where absence has exactly one meaning.

| Operation      | Handling                                                                           |
| -------------- | ---------------------------------------------------------------------------------- |
| Numeric input  | `Result<Minor, NumericParseError>`; messages are a `Record` over every error       |
| localStorage   | try/catch in `safeStorage`; failure means "works, doesn't remember", never a toast |
| Stored profile | zod with a fallback per field; never `.parse` — it runs at startup                 |
| PDF render     | caught where awaited, shown as a status union with Retry                           |
| Clipboard      | caught, and the user is told — they asked for it                                   |
| Overflow       | unreachable by the input caps, then asserted — firing is a bug                     |

## Money and dates

- Money is integer cents (`Minor`), quantities integer thousandths (`Milli`), rates basis points
  (`Bps`) — branded, so passing one where another is expected does not compile.
- Rounding is `divideRounded`: half away from zero, exact for every safe integer. Never divide to
  a float and round.
- **Round each line, then sum.** The printed line amounts must add up to the printed subtotal.
- Nothing is clamped. A discount larger than the subtotal prints a negative total: the preview
  shows it, while a silently changed figure is a wrong invoice nobody notices.
- Always two decimals, even for JPY — the accepted cost of a free-text currency.
- Formatting uses the fixed `INVOICE_LOCALE`, never the browser's. Dates are `IsoDate` strings,
  formatted with `timeZone: 'UTC'`; `Date` objects shift the printed day across time zones.

## React

- One context, reached through `useInvoice()`, which throws outside the provider.
- No `useMemo`, `useCallback` or `React.memo`: the expensive work is already debounced.
- Two effects only: rendering the preview PDF, and saving the profile.
- **Number inputs keep their own text; the document keeps the parsed value** (`useNumericDraft`).
  Emptied → clear the value. Parses → set it. Malformed → change nothing and mark the field
  invalid, which blocks download. Without the clearing branch, deleting an amount keeps printing
  the old figure. Re-read a document value by changing the input's `key`, never with an effect.
- Line items are keyed by id, never index, or deleting a row hands its typed text to the next.
- Mode switching hides data, never clears it.

## The PDF layer — react-pdf fails silently, so these are mandatory

- **Load fonts as bytes and register them as data URLs.** react-pdf caches a failed font fetch
  for the life of the page, and `Font.clear()` also deletes its built-in fonts, breaking every
  later render. Never call `Font.clear()`.
- **Hyphenation is disabled** (`registerHyphenationCallback(word => [word])`). Never return chunks
  from it: react-pdf prints a literal hyphen at each break, corrupting IBANs and links.
- **Long words go through `breakLongWords` with a limit from `textRunLimits`.** react-pdf cannot
  break inside a word, and an overlong word is clipped at the page edge, cutting the end off a
  payment link. The limits assume the widest glyph, so they hold even for strings of "W".
- **Pass each `<Text>` a single string.** Where two string children meet at a line break,
  react-pdf inserts a hyphen.
- **Set `lineHeight` only together with `fontSize` in the same style, and never on a container.**
  A unitless line height is multiplied by that style's own font size (18pt when missing), then
  inherited as points and multiplied again in dynamic nodes — which erased the page footer.
- Colours are six-digit hex from `theme.ts`. Sizes are bare numbers (points). Widths are
  percentages from `columnPercent`, so one layout fits A4 and Letter. `npm run check:pdf-styles`
  rejects `rem`, `px`, `var(`, OKLCH and `color-mix` under `src/pdf`, all of which react-pdf
  ignores without an error.
- `usePDF`, `PDFViewer` and `BlobProvider` are not used: each imports react-pdf eagerly.

## Persistence and zod

- One localStorage key, `invoicer.profile.v1`, holding only the sender's side: From, payment
  details, recent invoice numbers, paper size, mode. Never client data or amounts.
- zod (`zod/mini`) is used in exactly one place: reading that profile. Each field has its own
  `z.catch` fallback so one corrupt value resets only itself. Array fallbacks use a thunk.
- zod is **not** for the invoice document (our own reducer builds it), numeric input (coercion
  reads an empty box as `0`), dates, or props.

## Files and naming

- One concern per file. Components `PascalCase.tsx`, everything else `camelCase.ts`.
- Named exports only; no default exports; no barrel files (a barrel in `src/pdf` would defeat the
  lazy chunk).
- A small unexported helper component below the main one is fine.
- Comments explain intent and constraints, never what the next line does.

## Tests

Four files, co-located: money parsing, totals, `planSections`, and the rendered PDF (real fonts,
text extracted with `unpdf`). No component tests, no coverage target. When fixing a PDF layout
bug, add an assertion to `InvoicePdfDocument.test.tsx` that would have caught it.

## Refuse these

A repository or service layer over localStorage. An event bus. A custom hook wrapping one
`useState`. A generic field component taking a parser and a renderer. A strategy pattern for two
discount kinds. An injected clock. A diagnostics framework. Token codegen. i18n scaffolding,
analytics or a service worker.

## Commits

One logical change per commit, and `npm run verify` passes before each. Record anything
deliberately not done in `DECISIONS.md`.
