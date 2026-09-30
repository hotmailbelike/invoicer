# Invoicer

A small invoice generator that runs entirely in the browser and produces a real PDF.

- **Simple** — who it's from, who it's for, one amount and a note.
- **Detailed** — line items with quantity and rate, discount, amount already paid, payment
  details, notes and terms. Every field is optional; empty sections don't print.
- Live preview of the actual PDF beside the form.
- Remembers your own details, payment details and recent invoice numbers in this browser, and
  suggests the next number. Client details and amounts are never stored.

No server, no account, no tracking.

## Develop

Requires Node 22.13 or newer.

```bash
npm install
```

```bash
npm run dev
```

Before committing, run the full check — types, lint, formatting, tests and the PDF style guard:

```bash
npm run verify
```

`CLAUDE.md` holds the engineering rules. `DECISIONS.md` records what was deliberately left out,
the accepted limitations, and what still needs checking by hand.

## Deploy

Nothing to install. `npm run build` writes plain static files to `dist/`, and the build works both
at a domain root and in a subdirectory.

### GitHub Pages — automatic, already set up

`.github/workflows/deploy.yml` builds and publishes on every push to `main`, running the same
`npm run verify` gate first. The first run switches Pages on by itself; if that step fails, enable
it once by hand under repository Settings → Pages → Source: GitHub Actions.

One trade-off: GitHub Pages cannot send custom response headers, so `public/_headers` is ignored
there — no Content-Security-Policy, and assets get a short cache instead of a long one. Nothing
about the app stops working. The hosts below do apply it.

### Netlify or Cloudflare Pages — if you want the headers

Both read `_headers` from the build output, so a plain upload keeps the security and caching rules.

- **Netlify Drop:** open <https://app.netlify.com/drop> and drag the `dist` folder onto the page.
- **Cloudflare Pages:** dashboard → Workers & Pages → Create → Pages, then either upload `dist` or
  connect this repository for automatic builds (build command `npm run build`, output `dist`).

### After the first deploy

Open the site with the browser console showing, create an invoice and download it, and look for
Content-Security-Policy reports. If there are none and you are on a host that sends headers,
rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `public/_headers`.
Until then the policy only reports, so it cannot break the page.

Opening `dist/index.html` straight from Finder will not work: the app fetches its fonts, and
browsers block that on a `file://` page. It has to be served over http.

## The PDF font

The PDF embeds subsets of [Inter](https://github.com/rsms/inter) (SIL Open Font License, copied
to `src/pdf/fonts/OFL.txt`). The subsets are committed. To change the character set, download
and unzip the Inter 4.1 release, edit the ranges in `scripts/build-pdf-fonts.mjs`, then run:

```bash
npm run fonts -- /path/to/unzipped/Inter-4.1
```
