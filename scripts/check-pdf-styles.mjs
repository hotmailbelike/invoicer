// Fails when src/pdf contains a style react-pdf silently mishandles. None of these throw: the
// PDF renders, looks almost right, and the mistake reaches a client.

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PDF_DIR = fileURLToPath(new URL('../src/pdf/', import.meta.url));
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const FORBIDDEN = [
  {
    pattern: /\d(?:\.\d+)?(?:rem|px)\b/,
    reason: 'rem is 18pt in react-pdf and px is rounded to whole units; use bare numbers (points)',
  },
  {
    pattern: /\bvar\(/,
    reason: 'CSS custom properties are not supported; the colour silently falls back',
  },
  {
    pattern: /\bokl(?:ch|ab)\(/,
    reason: 'OKLCH/OKLab colours are not parsed; the element paints in the previous fill',
  },
  {
    pattern: /\bcolor-mix\(/,
    reason: 'color-mix is not parsed; the element paints in the previous fill',
  },
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return sourceFiles(path);
      }
      return /\.tsx?$/.test(entry.name) ? [path] : [];
    }),
  );
  return nested.flat();
}

const violations = [];
for (const file of await sourceFiles(PDF_DIR)) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const { pattern, reason } of FORBIDDEN) {
      if (pattern.test(line)) {
        violations.push(`${relative(ROOT, file)}:${index + 1}  ${reason}\n    ${line.trim()}`);
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`Unsupported react-pdf styles:\n\n${violations.join('\n\n')}`);
  process.exitCode = 1;
}
