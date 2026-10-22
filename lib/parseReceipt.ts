// Reads OCR text from a Philippine store receipt and pulls out the store, date, items and total.
// OCR is noisy, so every step is defensive and the result carries a confidence the UI can show.

import { detectCategory } from '@/lib/parseExpense';

export interface ReceiptItem {
  name: string;
  amount: number;
  category: string;
}

export interface ParsedReceipt {
  store: string;
  date: string | null; // yyyy-mm-dd
  total: number;
  items: ReceiptItem[];
  category: string;
  confidence: 'high' | 'medium' | 'low';
  // What the total was cross-checked against, when it matched something
  check: 'items' | 'cash' | null;
}

const STORES: [RegExp, string, string][] = [
  [/7\s*[-–]?\s*(eleven|e1even|eleuen|elev)/i, '7-Eleven', 'food'],
  [/mini\s*stop/i, 'Ministop', 'food'],
  [/family\s*mart/i, 'FamilyMart', 'food'],
  [/lawson/i, 'Lawson', 'food'],
  [/alfamart/i, 'Alfamart', 'food'],
  [/jollibee/i, 'Jollibee', 'food'],
  [/mc\s*donald|mcdo/i, "McDonald's", 'food'],
  [/chowking/i, 'Chowking', 'food'],
  [/greenwich/i, 'Greenwich', 'food'],
  [/mang\s*inasal/i, 'Mang Inasal', 'food'],
  [/kfc/i, 'KFC', 'food'],
  [/starbucks/i, 'Starbucks', 'food'],
  [/puregold/i, 'Puregold', 'food'],
  [/savemore|save\s*more/i, 'SaveMore', 'food'],
  [/robinsons\s*(supermarket|easymart)/i, 'Robinsons', 'food'],
  [/sm\s*(supermarket|hypermarket|markets)/i, 'SM Supermarket', 'food'],
  [/national\s*book/i, 'National Book Store', 'school'],
  [/expressions/i, 'Expressions', 'school'],
  [/mercury\s*drug/i, 'Mercury Drug', 'other'],
  [/watsons/i, 'Watsons', 'other'],
  [/the\s*generics/i, 'The Generics Pharmacy', 'other'],
  [/petron|shell|caltex|seaoil|phoenix/i, 'Gas station', 'transpo'],
  [/sm\s*cinema|ayala\s*cinema|cinema/i, 'Cinema', 'gala'],
  [/timezone|tom'?s\s*world/i, 'Arcade', 'gala'],
];

// Lines that carry money but are not purchased items
const NOT_ITEM =
  /\b(sub\s*-?\s*total|total|amount\s*due|balance|cash|change|tender|tendered|payment|paid|gcash|maya|paymaya|card|visa|master|debit|credit|vat|vatable|vat-?able|exempt|zero[\s-]*rated|non[\s-]*vat|tax|discount|less|senior|pwd|points|rounding|qty|quantity|items?\s*sold|no\.?\s*of\s*items|tin|min|s\/?n|serial|permit|ptu|invoice|receipt|or\s*no|si\s*no|txn|trans|terminal|cashier|clerk|staff|date|time|tel|phone|thank|welcome|accred|bir|pos|store\s*#|branch|customer|name|address|signature|valid|official)\b/i;

const TOTAL_STRONG = /\b(grand\s*total|amount\s*due|total\s*due|total\s*amount|amount\s*payable|net\s*amount|total\s*sales|balance\s*due|total\s*payable)\b/i;
const TOTAL_WEAK = /\btota[l1i]\b|\btotai\b|\bt0tal\b/i;
const NOT_TOTAL = /\b(sub\s*-?\s*total|total\s*(qty|quantity|items?|disc|discount|vat|savings)|vatable|items?\s*sold)\b/i;

// OCR often reads "O" for 0, "l/I" for 1, "S" for 5 inside numbers
function fixDigits(s: string) {
  return s
    .replace(/(?<=\d)[oO](?=[\d.,])|(?<=[\d.,])[oO](?=\d|\b)/g, '0')
    .replace(/(?<=\d)[lI|](?=[\d.,])|(?<=[\d.,])[lI|](?=\d)/g, '1')
    .replace(/(?<=\d)[sS](?=\d)/g, '5');
}

// Money values on a line: "1,234.50", "45.00", "P 120.00", "₱99"
function moneyOn(line: string): number[] {
  const out: number[] = [];
  const re = /(?:₱|php|p)?\s?(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?!\d)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const v = parseFloat(m[1].replace(/,/g, '') + '.' + m[2]);
    if (v > 0 && v < 1_000_000) out.push(v);
  }
  return out;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const pad = (n: number) => String(n).padStart(2, '0');

function findDate(text: string, now = new Date()): string | null {
  const valid = (y: number, m: number, d: number) => {
    if (y < 100) y += 2000;
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2015 || y > now.getFullYear() + 1) return null;
    const iso = `${y}-${pad(m)}-${pad(d)}`;
    // A receipt from the future is an OCR mistake
    return new Date(y, m - 1, d) <= new Date(now.getTime() + 864e5) ? iso : null;
  };
  let m = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (m) { const r = valid(+m[1], +m[2], +m[3]); if (r) return r; }
  m = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/);
  if (m) {
    // Philippine receipts are usually mm/dd/yyyy; fall back to dd/mm when that is impossible
    const r = valid(+m[3], +m[1], +m[2]) || valid(+m[3], +m[2], +m[1]);
    if (r) return r;
  }
  m = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{2,4})\b/i);
  if (m) { const r = valid(+m[3], MONTHS.indexOf(m[1].toLowerCase()) + 1, +m[2]); if (r) return r; }
  return null;
}

function cleanName(raw: string) {
  return raw
    .replace(/(?:₱|\bphp|\bp)?\s?\d{1,3}(?:,\d{3})*[.,]\d{2}.*$/i, '') // price and anything after it
    .replace(/^\s*\d+\s*(?:x|@|pc|pcs)?\s+/i, '') // leading qty
    .replace(/\b\d+\s*@\s*/g, '')
    .replace(/[^a-z0-9ñ&'()./ -]/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/^[-./ ]+|[-./ ]+$/g, '')
    .slice(0, 32);
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());

export function parseReceiptText(raw: string, now = new Date()): ParsedReceipt {
  const lines = fixDigits(raw)
    .split(/\r?\n/)
    .map(l => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const text = lines.join('\n');

  const storeHit = STORES.find(([re]) => re.test(text));
  const firstWords = lines.find(l => /[a-z]{3,}/i.test(l) && !/\d{4,}/.test(l)) || '';
  const store = storeHit ? storeHit[1] : titleCase(cleanName(firstWords)) || 'Receipt';

  // Total: prefer explicit "amount due" style lines, then plain "total"
  let total = 0;
  let totalIdx = -1;
  for (const strong of [true, false]) {
    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i];
      if (NOT_TOTAL.test(l) && !TOTAL_STRONG.test(l)) continue;
      if (!(strong ? TOTAL_STRONG : TOTAL_WEAK).test(l)) continue;
      // The amount is usually on the same line, sometimes on the next one
      const vals = moneyOn(l).length ? moneyOn(l) : moneyOn(lines[i + 1] || '');
      if (vals.length) {
        const v = vals[vals.length - 1];
        // Keep the earliest strong total, but a larger plain total later means a receipt with a subtotal
        if (!total || v >= total) { total = v; totalIdx = i; }
      }
    }
    if (total) break;
  }

  // Cash minus change is a good cross-check (or fallback)
  const cashLine = lines.find(l => /\b(cash|tendered|amount\s*tendered|amount\s*paid)\b/i.test(l) && !/change/i.test(l));
  const changeLine = lines.find(l => /\bchange\b/i.test(l));
  const cash = cashLine ? moneyOn(cashLine).pop() || 0 : 0;
  const change = changeLine ? moneyOn(changeLine).pop() || 0 : 0;
  const paid = cash && change >= 0 && cash - change > 0 ? Math.round((cash - change) * 100) / 100 : 0;

  // Items: lines above the total with a price and a readable name
  const items: ReceiptItem[] = [];
  const end = totalIdx >= 0 ? totalIdx : lines.length;
  for (let i = 0; i < end; i++) {
    const l = lines[i];
    if (NOT_ITEM.test(l)) continue;
    const vals = moneyOn(l);
    if (!vals.length) continue;
    let name = cleanName(l);
    // Name sometimes sits on the line above ("COKE 1.5L" then "2 @ 45.00   90.00")
    if (!/[a-z]{2,}/i.test(name) && i > 0 && !moneyOn(lines[i - 1]).length && !NOT_ITEM.test(lines[i - 1])) name = cleanName(lines[i - 1]);
    if (!/[a-z]{2,}/i.test(name)) continue;
    const amount = vals[vals.length - 1];
    items.push({ name: titleCase(name), amount, category: detectCategory(name) });
  }

  const itemsSum = Math.round(items.reduce((s, x) => s + x.amount, 0) * 100) / 100;
  if (!total) total = paid || itemsSum;
  // When the item list disagrees with the total, the total line is the one to trust
  const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(1, b * 0.02);

  const check: ParsedReceipt['check'] = total && near(itemsSum, total) ? 'items' : total && paid && near(paid, total) ? 'cash' : null;
  const confidence: ParsedReceipt['confidence'] = check ? 'high' : total && totalIdx >= 0 ? 'medium' : 'low';

  // Overall category: store type first, else whichever category has the most money
  const byCat: Record<string, number> = {};
  items.forEach(it => { if (it.category !== 'other') byCat[it.category] = (byCat[it.category] || 0) + it.amount; });
  const topItemCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0];
  const category = storeHit ? storeHit[2] : topItemCat || detectCategory(text);

  // Items without a clear category inherit the receipt's
  items.forEach(it => { if (it.category === 'other') it.category = category; });

  return { store, date: findDate(text, now), total: Math.round(total * 100) / 100, items, category, confidence, check };
}
