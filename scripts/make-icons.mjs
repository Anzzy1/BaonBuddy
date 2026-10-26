// Generates the Android + iOS icons/splash screens and the desktop icon from app/icon.svg
// Usage: node scripts/make-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const res = path.join(root, 'android', 'app', 'src', 'main', 'res');
const iconPath = path.join(root, 'app', 'icon.svg');
const icon = fs.readFileSync(iconPath, 'utf8');

// The mascot drawing sits inside the app icon's nested SVG
const inner = icon.match(/<svg width="32" height="32" viewBox="8 19 84 84">([\s\S]*?)<\/svg>/)?.[1];
if (!inner) throw new Error('Could not find the mascot artwork in app/icon.svg');

const mascot = (size, x = 0, y = 0) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="8 19 84 84" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

const MIPMAPS = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

const write = async (file, svg, width, height = width) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(file);
};

for (const [density, legacy, adaptive] of MIPMAPS) {
  const dir = path.join(res, `mipmap-${density}`);

  // Normal launcher icon
  await write(path.join(dir, 'ic_launcher.png'), icon, legacy);

  // Round launcher icon: lime circle with the mascot
  const round = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
    <circle cx="54" cy="54" r="54" fill="#D7F25C"/>
    ${mascot(68, 20, 20)}
  </svg>`;
  await write(path.join(dir, 'ic_launcher_round.png'), round, legacy);

  // Adaptive foreground: transparent, mascot inside the 66dp safe zone
  const foreground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
    ${mascot(64, 22, 22)}
  </svg>`;
  await write(path.join(dir, 'ic_launcher_foreground.png'), foreground, adaptive);
}

// Splash screens: keep the exact size of the generated Capacitor ones
const splashFiles = [
  'drawable/splash.png',
  ...['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].flatMap(d => [
    `drawable-port-${d}/splash.png`,
    `drawable-land-${d}/splash.png`,
  ]),
];

for (const rel of splashFiles) {
  const file = path.join(res, rel);
  if (!fs.existsSync(file)) continue;
  const { width, height } = await sharp(file).metadata();
  const size = Math.round(Math.min(width, height) * 0.3);
  const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#D7F25C"/>
    ${mascot(size, (width - size) / 2, (height - size) / 2)}
    <circle cx="${width / 2}" cy="${height / 2}" r="${size * 0.68}" fill="none" stroke="#0E0E10" stroke-opacity=".12" stroke-width="${size * 0.02}" stroke-dasharray="${size * 0.03} ${size * 0.03}"/>
  </svg>`;
  await write(file, splash, width, height);
}

console.log('Android icons and splash screens generated.');

// iOS app icon: full-bleed lime square (iOS applies its own rounded mask and
// does not allow transparency) with the mascot centered.
const iosAssets = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets');
const iosIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#D7F25C"/>
  ${mascot(640, 192, 192)}
</svg>`;
await sharp(Buffer.from(iosIcon))
  .flatten({ background: '#D7F25C' })
  .removeAlpha()
  .resize(1024, 1024)
  .png()
  .toFile(path.join(iosAssets, 'AppIcon.appiconset', 'AppIcon-512@2x.png'));

// iOS launch screen (same artwork as the Android splash).
const SPLASH_SIZE = 2732;
const splashSize = Math.round(SPLASH_SIZE * 0.3);
const iosSplash = `<svg xmlns="http://www.w3.org/2000/svg" width="${SPLASH_SIZE}" height="${SPLASH_SIZE}" viewBox="0 0 ${SPLASH_SIZE} ${SPLASH_SIZE}">
  <rect width="${SPLASH_SIZE}" height="${SPLASH_SIZE}" fill="#D7F25C"/>
  ${mascot(splashSize, (SPLASH_SIZE - splashSize) / 2, (SPLASH_SIZE - splashSize) / 2)}
  <circle cx="${SPLASH_SIZE / 2}" cy="${SPLASH_SIZE / 2}" r="${splashSize * 0.68}" fill="none" stroke="#0E0E10" stroke-opacity=".12" stroke-width="${splashSize * 0.02}" stroke-dasharray="${splashSize * 0.03} ${splashSize * 0.03}"/>
</svg>`;
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  await write(path.join(iosAssets, 'Splash.imageset', name), iosSplash, SPLASH_SIZE);
}
console.log('iOS icons and splash screens generated.');

// Desktop app icon (window/taskbar + shortcut)
const png256 = await sharp(Buffer.from(icon)).resize(256, 256).png().toBuffer();
fs.mkdirSync(path.join(root, 'desktop'), { recursive: true });
fs.writeFileSync(path.join(root, 'desktop', 'icon.png'), png256);
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico.writeUInt8(0, 6);
ico.writeUInt8(0, 7);
ico.writeUInt8(0, 8);
ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png256.length, 14);
ico.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, 'desktop', 'icon.ico'), Buffer.concat([ico, png256]));
console.log('Desktop icon (png + ico) generated.');
