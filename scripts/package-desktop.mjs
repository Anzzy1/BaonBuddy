// Builds a portable Windows app folder:
//   release/BaonBuddy/BaonBuddy.exe  (Electron runtime + the exported app)
//
// We copy Electron's own binary untouched instead of patching its resources,
// because patching breaks the signature and Windows Smart App Control blocks it.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electronDist = path.join(path.dirname(require.resolve('electron')), 'dist');
const out = path.join(root, 'out');
const target = path.join(root, 'release', 'BaonBuddy');

if (!fs.existsSync(path.join(out, 'index.html'))) {
  console.error('Missing out/. Run "npm run build" first.');
  process.exit(1);
}

await fsp.rm(target, { recursive: true, force: true });
await fsp.mkdir(target, { recursive: true });

// 1. Copy the Electron runtime (electron.exe + DLLs + resources)
await fsp.cp(electronDist, target, { recursive: true });

// 2. Rename the launcher (content stays identical, so its signature stays valid)
await fsp.rename(path.join(target, 'electron.exe'), path.join(target, 'BaonBuddy.exe'));

// 3. Drop Electron's demo app and install ours next to it
const resources = path.join(target, 'resources');
await fsp.rm(path.join(resources, 'default_app.asar'), { force: true });
const appDir = path.join(resources, 'app');
await fsp.mkdir(appDir, { recursive: true });
await fsp.cp(out, path.join(appDir, 'out'), { recursive: true });
await fsp.cp(path.join(root, 'desktop', 'main.js'), path.join(appDir, 'main.js'));
await fsp.cp(path.join(root, 'desktop', 'icon.png'), path.join(appDir, 'icon.png'));
await fsp.cp(path.join(root, 'desktop', 'icon.ico'), path.join(target, 'BaonBuddy.ico'));
await fsp.writeFile(
  path.join(appDir, 'package.json'),
  JSON.stringify({ name: 'baonbuddy', productName: 'BaonBuddy', version: '1.0.0', main: 'main.js' }, null, 2),
);

console.log(`\nWindows app ready: ${path.join(target, 'BaonBuddy.exe')}`);
