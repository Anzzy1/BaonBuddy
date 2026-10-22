// Renders review stills at the given frames: node scripts/stills.mjs 0 60 120 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = `${root}/.work/stills`;
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: `${root}/src/index.ts` });
const composition = await selectComposition({ serveUrl, id: 'Showreel' });
const frames = process.argv.slice(2).map(Number);
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: `${out}/f${String(frame).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', scale: 0.5 });
  console.log('still', frame);
}
