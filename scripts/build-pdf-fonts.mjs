// Builds the two Inter faces embedded in generated PDFs. Output is committed, so this only
// needs re-running to change the character set or upgrade Inter.
//
//   1. Download the official release: https://github.com/rsms/inter/releases (built from v4.1)
//   2. Unzip it, then: npm run fonts -- /path/to/unzipped/Inter-4.1
//
// react-pdf cannot fall back to another family for a missing glyph and has no unicode-range,
// so each face must itself contain every character an invoice can print. Anything outside
// these ranges renders as a blank box — visible in the preview before an invoice is sent.

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const CODE_POINT_RANGES = [
  [0x0020, 0x007e], // Basic Latin
  [0x00a0, 0x00ff], // Latin-1 Supplement: accented letters, £ ¥ ¢, no-break space
  [0x0100, 0x024f], // Latin Extended-A and -B
  [0x0370, 0x03ff], // Greek
  [0x0400, 0x04ff], // Cyrillic
  [0x2000, 0x206f], // General Punctuation: dashes, curly quotes, bullet, narrow no-break space
  [0x20a0, 0x20c0], // Currency Symbols: € ₹ ₽ ₺ ₦ ₱ ₩ ₿ and the rest
  [0x2116, 0x2116], // Numero sign
  [0x2122, 0x2122], // Trade mark sign
  [0x2190, 0x2193], // Arrows
  [0x2212, 0x2212], // Minus sign
];

const FACES = [
  { source: 'Inter-Regular.ttf', output: 'inter-400.ttf' },
  { source: 'Inter-SemiBold.ttf', output: 'inter-600.ttf' },
];

const OUTPUT_DIR = fileURLToPath(new URL('../src/pdf/fonts/', import.meta.url));

function charactersInRanges(ranges) {
  let text = '';
  for (const [first, last] of ranges) {
    for (let codePoint = first; codePoint <= last; codePoint += 1) {
      text += String.fromCodePoint(codePoint);
    }
  }
  return text;
}

async function main() {
  const releaseDir = process.argv[2];
  if (releaseDir === undefined) {
    console.error('Usage: npm run fonts -- /path/to/unzipped/Inter-4.1');
    process.exitCode = 1;
    return;
  }

  const characters = charactersInRanges(CODE_POINT_RANGES);
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const face of FACES) {
    const sourcePath = join(releaseDir, 'extras', 'ttf', face.source);
    const original = await readFile(sourcePath);
    const subset = await subsetFont(original, characters, {
      targetFormat: 'sfnt',
      // PDF viewers rasterise without TrueType hinting, so the instructions are dead weight.
      noHinting: true,
    });
    await writeFile(join(OUTPUT_DIR, face.output), subset);
    console.warn(
      `${face.output}: ${Math.round(original.length / 1024)} KB -> ${Math.round(subset.length / 1024)} KB`,
    );
  }

  // The OFL requires the licence to travel with the font files.
  await copyFile(join(releaseDir, 'LICENSE.txt'), join(OUTPUT_DIR, 'OFL.txt'));
}

await main();
