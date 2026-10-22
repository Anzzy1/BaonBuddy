// Captures real BaonBuddy screens from the running dev server for the showreel.
// Usage: node scripts/capture.mjs   (app must be running on localhost:3000)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const APP = 'http://localhost:3000';
const OUT = fileURLToPath(new URL('../public/shots/', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });

async function newPage(width, height, mobile = false) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  return page;
}

async function go(page, tab) {
  await page.goto(`${APP}/#${tab}`, { waitUntil: 'networkidle2' });
  // Hide the Next.js dev indicator
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await sleep(1500);
}

const clickText = async (page, text) => {
  await page.locator(`::-p-text(${text})`).click();
  await sleep(700);
};

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log('shot', name);
}

// Element crop with transparent page background, so rounded corners stay clean
async function crop(page, selector, name) {
  await page.addStyleTag({ content: 'html,body{background:transparent!important}' });
  const el = await page.waitForSelector(selector, { timeout: 5000 });
  await el.screenshot({ path: `${OUT}${name}.png`, omitBackground: true });
  console.log('crop', name);
}

// Desktop screens
const d = await newPage(1440, 900);
await go(d, 'overview');
await shot(d, 'overview');
await crop(d, 'section[aria-label="Balance summary"]', 'card-hero');
await crop(d, 'section[aria-label="Budget meter"]', 'card-meter');
await crop(d, 'section[aria-label="Recent expenses"]', 'card-recent');
await crop(d, 'aside, nav', 'sidebar');

await go(d, 'log');
await clickText(d, 'Manual');
await d.type('input[aria-label="Amount in pesos"]', '85');
await sleep(300);
await shot(d, 'log-manual');
await crop(d, 'section[aria-label="Log an expense"]', 'card-log-manual');

await go(d, 'log');
await clickText(d, 'Quick chat');
await d.type('input[placeholder^="What did you spent"], input[placeholder^="What did you spend"]', 'jeep 26 tapos lunch 120');
await d.keyboard.press('Enter');
await sleep(6000);
await shot(d, 'log-chat');
await crop(d, 'section[aria-label="Log an expense"]', 'card-log-chat');

await go(d, 'log');
await clickText(d, 'Voice');
// Wait for the offline Whisper model to finish loading
await d.waitForFunction(() => !document.body.innerText.includes('Getting voice ready'), { timeout: 60000 }).catch(() => console.log('voice still loading'));
await sleep(800);
await shot(d, 'log-voice');
await crop(d, 'section[aria-label="Log an expense"]', 'card-log-voice');

await go(d, 'log');
await clickText(d, 'Scan');
await shot(d, 'log-scan');
await crop(d, 'section[aria-label="Log an expense"]', 'card-log-scan');

await go(d, 'manage');
await shot(d, 'manage');
await crop(d, 'section[aria-label="Manage expenses"]', 'card-manage');

await go(d, 'calculator');
for (let i = 0; i < 3; i++) await d.click('button[aria-label="More people"]');
await sleep(500);
await shot(d, 'calculator');

await go(d, 'advisor');
await clickText(d, 'How can I save more?');
await d.waitForFunction(() => !document.querySelector('.typing, [aria-label="Buddy is typing"]') && document.querySelectorAll('.bubble.bot').length > 0, { timeout: 120000 }).catch(() => console.log('advisor reply timed out'));
await sleep(2500);
await shot(d, 'advisor');
await crop(d, 'section[aria-label="AI Advisor chat"]', 'card-advisor');

// Phone screens for the device mockup
const m = await newPage(390, 844, true);
for (const tab of ['overview', 'log', 'manage', 'advisor']) {
  await go(m, tab);
  await shot(m, `m-${tab}`);
}

await browser.close();
