// Upcoming expenses (bills, ambag, rent): money is set aside the moment they're added,
// so the safe-per-day already leaves room for them.
import { addDays, diffDays, iso, today } from '@/lib/budget';
import { detectCategory, extractAmount } from '@/lib/parseExpense';

const MONTHS: [RegExp, number][] = [
  [/^(jan(uary)?|ene(ro)?)$/, 0],
  [/^(feb(ruary)?|peb(rero)?)$/, 1],
  [/^(mar(ch)?|marso)$/, 2],
  [/^(apr(il)?|abr(il)?)$/, 3],
  [/^(may|mayo)$/, 4],
  [/^(jun(e)?|hun(yo)?)$/, 5],
  [/^(jul(y)?|hul(yo)?)$/, 6],
  [/^(aug(ust)?|ago(sto)?)$/, 7],
  [/^(sep(t)?(ember)?|set(yembre)?|setiyembre)$/, 8],
  [/^(oct(ober)?|okt(ubre)?)$/, 9],
  [/^(nov(ember)?|nob(yembre)?)$/, 10],
  [/^(dec(ember)?|dis(yembre)?)$/, 11],
];
const MONTH_WORD = '(?:jan(?:uary)?|ene(?:ro)?|feb(?:ruary)?|peb(?:rero)?|mar(?:ch|so)?|apr(?:il)?|abr(?:il)?|may|mayo|jun(?:e)?|hun(?:yo)?|jul(?:y)?|hul(?:yo)?|aug(?:ust)?|ago(?:sto)?|sept?(?:ember)?|set(?:yembre)?|setiyembre|oct(?:ober)?|okt(?:ubre)?|nov(?:ember)?|nob(?:yembre)?|dec(?:ember)?|dis(?:yembre)?)';
const monthOf = (w: string) => MONTHS.find(([re]) => re.test(w.replace('.', '')))?.[1] ?? -1;

const WEEKDAYS: [RegExp, number][] = [
  [/^(sunday|sun|linggo)$/, 0],
  [/^(monday|mon|lunes)$/, 1],
  [/^(tuesday|tue|tues|martes)$/, 2],
  [/^(wednesday|wed|miyerkules|miyerkoles|myerkules)$/, 3],
  [/^(thursday|thu|thurs|huwebes)$/, 4],
  [/^(friday|fri|biyernes|byernes)$/, 5],
  [/^(saturday|sat|sabado)$/, 6],
];
const WEEKDAY_WORD = '(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|lunes|martes|miyerkules|miyerkoles|myerkules|huwebes|biyernes|byernes|sabado|linggo)';

// Next date (today or later) that falls on this day of the month, clamped to short months
function nextDayOfMonth(day: number, now: Date) {
  for (let m = 0; m < 3; m++) {
    const y = now.getFullYear();
    const mo = now.getMonth() + m;
    const last = new Date(y, mo + 1, 0).getDate();
    const d = new Date(y, mo, Math.min(day, last));
    if (iso(d) >= iso(now)) return d;
  }
  return now;
}

// A month/day with no year: this year, or next year if it already passed
function monthDay(month: number, day: number, now: Date) {
  const d = new Date(now.getFullYear(), month, Math.min(day, new Date(now.getFullYear(), month + 1, 0).getDate()));
  return iso(d) < iso(now) ? new Date(now.getFullYear() + 1, month, day) : d;
}

type DateHit = { date: Date; match: string };

// Finds a due date in English, Tagalog or Taglish: "Nov 15", "Biyernes", "katapusan", "bukas", "sa 30"...
export function findDueDate(text: string, now = new Date()): DateHit | null {
  const s = text.toLowerCase();
  const hit = (re: RegExp, toDate: (m: RegExpMatchArray) => Date | null): DateHit | null => {
    const m = s.match(re);
    if (!m) return null;
    const date = toDate(m);
    return date ? { date, match: m[0] } : null;
  };
  return (
    // 2026-11-15
    hit(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/, m => new Date(+m[1], +m[2] - 1, +m[3])) ||
    // Nov 15 / Nobyembre 15 / Nov. 15, 2026
    // ("may 20 pesos" is Tagalog "has 20 pesos", not May 20)
    hit(new RegExp(`\\b(${MONTH_WORD})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?\\b(?!\\s*(?:pesos?|piso|php|k\\b))`), m => {
      const mo = monthOf(m[1]);
      if (mo < 0 || +m[2] < 1 || +m[2] > 31) return null;
      return m[3] ? new Date(+m[3], mo, +m[2]) : monthDay(mo, +m[2], now);
    }) ||
    // 15 Nov / 15 ng Nobyembre
    hit(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:ng\\s+|of\\s+)?(${MONTH_WORD})\\b`), m => {
      const mo = monthOf(m[2]);
      if (mo < 0 || +m[1] < 1 || +m[1] > 31) return null;
      return monthDay(mo, +m[1], now);
    }) ||
    // 11/15
    hit(/\b(\d{1,2})\/(\d{1,2})\b/, m => (+m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31 ? monthDay(+m[1] - 1, +m[2], now) : null)) ||
    // katapusan / end of the month
    hit(/\b(katapusan(?: ng buwan)?|end of (?:the )?month|month[- ]end|month end)\b/, () => new Date(now.getFullYear(), now.getMonth() + 1, 0)) ||
    // kinsenas = the 15th
    hit(/\bkinsenas?\b/, () => nextDayOfMonth(15, now)) ||
    hit(/\b(day after tomorrow|makalawa|sa makalawa)\b/, () => addDays(now, 2)) ||
    hit(/\b(tomorrow|bukas)\b/, () => addDays(now, 1)) ||
    hit(/\b(today|ngayon(?:g araw)?|mamaya)\b/, () => now) ||
    // in 3 days / sa loob ng 3 araw / after 3 days
    hit(/\b(?:in|after|sa loob ng|pagkalipas ng)\s+(\d{1,2})\s*(?:days?|araw)\b/, m => addDays(now, +m[1])) ||
    hit(/\b(?:in|after|sa loob ng|pagkalipas ng)\s+(\d)\s*(?:weeks?|linggo)\b/, m => addDays(now, +m[1] * 7)) ||
    hit(/\b(next week|sa susunod na linggo|susunod na linggo)\b/, () => addDays(now, 7)) ||
    // (next) Friday / (sa susunod na) Biyernes
    hit(new RegExp(`\\b(next\\s+|sa susunod na\\s+|susunod na\\s+|this\\s+|ngayong\\s+|sa\\s+)?(${WEEKDAY_WORD})\\b`), m => {
      const wd = WEEKDAYS.find(([re]) => re.test(m[2]))?.[1];
      if (wd === undefined) return null;
      let ahead = (wd - now.getDay() + 7) % 7;
      if (m[1] && /next|susunod/.test(m[1])) ahead = ahead === 0 ? 7 : ahead + (ahead < 3 ? 7 : 0);
      return addDays(now, ahead);
    }) ||
    // a-30 / sa 15 / on the 15th / 15th
    hit(/\b(?:a-|sa\s+|on the\s+|every\s+)(\d{1,2})(?:st|nd|rd|th)?\b(?!\s*(?:pesos?|piso|php|k\b))/, m => (+m[1] >= 1 && +m[1] <= 31 ? nextDayOfMonth(+m[1], now) : null)) ||
    hit(/\b(\d{1,2})(st|nd|rd|th)\b/, m => (+m[1] >= 1 && +m[1] <= 31 ? nextDayOfMonth(+m[1], now) : null))
  );
}

export interface ParsedUpcoming {
  name: string;
  amount: number;
  due: string;
  cat: string;
}

// "Renta ₱3,500, katapusan" -> { name: 'Renta', amount: 3500, due: <last day of month>, cat: 'bills' }
export function parseUpcoming(text: string, now = new Date()): Partial<ParsedUpcoming> {
  const out: Partial<ParsedUpcoming> = {};
  let rest = text;
  const d = findDueDate(text, now);
  if (d) {
    out.due = iso(d.date);
    // Drop the date words (and "due"/"on"/"sa" before them) so their numbers aren't read as money
    const at = rest.toLowerCase().indexOf(d.match);
    if (at >= 0) rest = rest.slice(0, at) + ' ' + rest.slice(at + d.match.length);
  }
  const amount = extractAmount(rest);
  if (amount > 0) out.amount = Math.round(amount * 100) / 100;
  const name = rest
    .replace(/(₱\s?|\bphp\s?|\bp(?=\d))?\d[\d,]*(\.\d+)?\s*(k\b|pesos?\b|piso\b)?/gi, ' ')
    .replace(/\b(due|on|by|sa|ng|bago|until|hanggang|para sa|for)\s*$/i, ' ')
    .replace(/[,;:|–—-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b(due|on|by|sa|ng|bago|until|hanggang)$/i, '')
    .trim();
  if (name) {
    out.name = (name[0].toUpperCase() + name.slice(1)).slice(0, 40);
    out.cat = detectCategory(name);
  }
  return out;
}

// Days from today until the due date (negative = overdue)
export const daysUntil = (due: string) => diffDays(today(), due);
