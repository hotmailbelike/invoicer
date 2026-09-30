# Decisions

What this project deliberately does and does not do, and why. Read before adding scope.

## Verified, and what is still open

Automated on every push (`npm run verify`, also run in CI): types, lint, formatting, 56 tests
including PDFs rendered with the real fonts and their text read back.

Checked by hand on the live GitHub Pages site (Chromium, 2026-09-30): the app loads with no
console errors, typing reformats and updates the total, the preview renders a valid PDF
(`%PDF-1.3`, ~10 kB) and re-renders after edits, switching to detailed mode keeps the data, and
localStorage holds only the sender's side — no client details, no amounts.

Still open:

- Safari and Firefox, and downloading a PDF end to end.
- The Content-Security-Policy in `public/_headers` has never run: GitHub Pages ignores it. It
  applies only on Netlify or Cloudflare Pages, where it starts as report-only — check the console
  there before renaming it to `Content-Security-Policy`.

## Measured (production build, 2026-09-16)

| Chunk                                            | Size         | gzip     | Loaded                    |
| ------------------------------------------------ | ------------ | -------- | ------------------------- |
| Entry JS                                         | 280 kB       | 86.8 kB  | at startup                |
| CSS                                              | 17.8 kB      | 4.5 kB   | at startup                |
| PDF engine (react-pdf, yoga WebAssembly inlined) | 1.24 MB      | 456.8 kB | on first render           |
| Inter 400 / 600 subsets                          | 160 / 163 kB | —        | fetched by the PDF loader |

The entry chunk contains no react-pdf code; this was checked by searching the built files.

## Deliberately not built

- **Tax / VAT / GST.** Not needed.
- **A currency list or per-currency decimals.** Currency is free text; amounts always print with
  two decimals.
- **Phone preview.** Desktop only. Phones get a message and the Download button.
- **Saved clients, invoice history, save/load invoice as a file.** Only the sender's own details
  and recent invoice numbers are remembered.
- **Logo upload, structured address or tax-ID fields.** From and Bill to are free text.
- **A confirmation dialog when switching to simple mode.** Nothing is lost, and the live preview
  already shows what changed.
- **A validation framework.** The preview shows the actual PDF, so a missing field or odd total is
  visible before sending. Only unparseable numbers block download, plus a warning for a reused
  invoice number.
- **Line-item reordering, undo, or a row limit.**
- **shadcn / Radix, a state library, react-hook-form, date or decimal libraries, icon packages.**
  The app has no complex widgets; native `<details>`, radio groups and `<input type="date">` cover
  it.
- **Dark mode.**

## Where the build differs from the approved plan

- **vitest 4, not 3.** The research claimed vitest 4+ required Vite 8; its published peer range
  includes Vite 7.
- **Discounts and amounts paid are not clamped.** The plan clamped them to the subtotal. That
  would print a figure different from the one typed; a negative total is visible in the preview
  instead.
- **Formatting uses a fixed `en-US` locale** rather than the browser's, so the PDF is identical on
  every machine and the tests are deterministic.
- **Paper size is a setting** (A4 or Letter, defaulting from the browser language), because the
  plan persisted it but offered no way to change it.
- **Fonts are fetched by the app and handed to react-pdf as data URLs.** react-pdf caches a failed
  font fetch for the life of the page, and the obvious recovery, `Font.clear()`, also deletes its
  built-in fonts — found by the PDF test.
- **Long unbroken text is split onto new lines before rendering.** react-pdf clips an overlong
  word at the page edge (a long payment link lost its end). Limits assume the widest glyph, so a
  token may break a little earlier than strictly necessary.
- **The font subset also includes Greek and Cyrillic**, measured at 35 kB more per face (157 kB
  against 122 kB for Latin only), so client names in those scripts print correctly.
- **Vite `base` is `'./'`.** Relative asset URLs let one build serve from a domain root and from a
  GitHub Pages project subdirectory. Verified in the output: the lazy chunk and the fonts both
  resolve against `import.meta.url`.
- **GitHub Pages is the deploy target** because it needs no second account, but it ignores
  `public/_headers`: no CSP, and a short asset cache. Netlify and Cloudflare honour that file.
- **Response headers live in `public/_headers`, not `netlify.toml`.** Vite copies that file into
  the build output, so a drag-and-drop upload gets the same headers as a CLI or Git deploy, and
  there is only one place to edit them. Both Netlify and Cloudflare Pages read it.
- **The CSP ships report-only** until checked on a real deploy, as above.
- **Netlify builds with Node 24**, matching local development.
- **Prettier** was added to the verify step to keep formatting mechanical.

## Accepted limitations

- JPY, KRW and other zero-decimal currencies print with `.00`.
- Chinese, Japanese, Korean, Arabic and Hebrew characters are not in the font subset and print as
  blank boxes. Visible in the preview before sending.
- Saved details live in one browser. Safari may clear them after about a week without a visit.
  Two open tabs: the last change wins.
- A generated invoice number is only as reliable as that browser's storage; there is no server-side
  sequence.
