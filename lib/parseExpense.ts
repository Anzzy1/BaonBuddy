// Natural-language expense parser for English, Tagalog and Taglish messages.
// Pure functions only, so the API route and any client code can share them.

export type Lang = 'en' | 'tl';

export interface ParsedItem {
  amount: number;
  category: string;
  note: string;
  daysAgo: number;
}

export type ParseResult =
  | { action: 'add'; items: ParsedItem[]; lang: Lang }
  | { action: 'remove'; lang: Lang }
  | { action: 'query'; lang: Lang }
  | { action: 'none'; hasNumber: boolean; lang: Lang };

/* ---------- Language ---------- */

const TL_WORDS = new Set(
  ('ako ko mo ng nang sa yung ung ang na lang naman po kumain bumili binili nagbayad bayad pamasahe kahapon kanina ' +
    'ngayon kagabi magkano natitira gastos ginastos gumastos tig bawat kada piso isang mga para ba kasi din rin pa nga ' +
    'ito yan iyan dito wala meron may siya kami tayo pero tapos saka pati hindi oo nung noong sakay nagpaload nagload ' +
    'pambili ulam kanin almusal tanghalian hapunan meryenda merienda lumabas nag binayaran pang ' +
    'ka kung kaya pag kapag muna ikaw iyon yun huwag wag puwede pwede sige talaga hanggang dahil ay si ni natin atin mas ' +
    'lahat bukas araw gumastos natira matitira ipon makaipon bawasan tipid').split(' '),
);
const EN_WORDS = new Set(
  ('i the for my bought buy spent spend paid pay on and with today yesterday a an to of how much what is was had got ' +
    'just some me it this that ate eat purchased worth left remaining total did have bucks').split(' '),
);

export function detectLang(text: string): Lang {
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  let tl = 0;
  let en = 0;
  for (const w of words) {
    if (TL_WORDS.has(w)) tl++;
    else if (EN_WORDS.has(w)) en++;
  }
  // Any real Tagalog in the message means the person is comfortable in Taglish
  return tl > 0 && tl >= en * 0.5 ? 'tl' : 'en';
}

/* ---------- Number words ---------- */

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  isa: 1, isang: 1, dalawa: 2, dalawang: 2, tatlo: 3, tatlong: 3, apat: 4, lima: 5, limang: 5, anim: 6,
  pito: 7, pitong: 7, walo: 8, walong: 8, siyam: 9, sampu: 10, sampung: 10,
  labing: 10, labin: 10,
  dalawampu: 20, dalawampung: 20, tatlumpu: 30, tatlumpung: 30, apatnapu: 40, apatnapung: 40, limampu: 50, limampung: 50,
  animnapu: 60, animnapung: 60, pitumpu: 70, pitumpung: 70, walumpu: 80, walumpung: 80, siyamnapu: 90, siyamnapung: 90,
  uno: 1, dos: 2, tres: 3, kwatro: 4, kuwatro: 4, singko: 5, sinko: 5, sais: 6, siyete: 7, syete: 7, otso: 8,
  nuwebe: 9, nueve: 9, diyes: 10, dyes: 10, onse: 11, dose: 12, trese: 13, katorse: 14, kinse: 15,
  disisais: 16, disisyete: 17, disiotso: 18, disinuwebe: 19,
  beinte: 20, bente: 20, trenta: 30, treinta: 30, kwarenta: 40, kuwarenta: 40, singkwenta: 50, singkuwenta: 50,
  sisenta: 60, setenta: 70, otsenta: 80, nobenta: 90,
};
const HUNDREDS = new Set(['hundred', 'daan', 'raan', 'siyento', 'syento', 'sientos']);
const THOUSANDS = new Set(['thousand', 'libo', 'libong', 'mil']);
const LINKERS = new Set(['na', 'at', 'and', 'y', 'ng']);

const isNumWord = (w: string) => w in UNITS || HUNDREDS.has(w) || THOUSANDS.has(w);

// Rewrites runs of number words as digits: "isang daan at limampu" -> "150", "fifty five" -> "55"
function wordsToDigits(text: string) {
  const tokens = text.split(/(\s+|-)/);
  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const w = tokens[i].trim();
    const startsNumber = isNumWord(w) || (w === 'a' && HUNDREDS.has((tokens[i + 2] || '').trim())) || (w === 'a' && THOUSANDS.has((tokens[i + 2] || '').trim()));
    if (!startsNumber) {
      out.push(tokens[i]);
      i++;
      continue;
    }
    let total = 0;
    let current = 0;
    let labing = false;
    let j = i;
    let last = i;
    while (j < tokens.length) {
      const t = tokens[j].trim();
      if (!t) { j++; continue; }
      if (t === 'a' && j === i) { current = 1; last = j; j++; continue; }
      if (t in UNITS) {
        const v = UNITS[t];
        if (t.startsWith('labi')) labing = true;
        else if (labing) { current += 10 + v; labing = false; }
        else current += v;
        last = j;
      } else if (HUNDREDS.has(t)) {
        current = (current || 1) * 100;
        last = j;
      } else if (THOUSANDS.has(t)) {
        total += (current || 1) * 1000;
        current = 0;
        last = j;
      } else if (LINKERS.has(t) && isNumWord((tokens[j + 2] || '').trim())) {
        // "apat na raan", "isang daan at lima" - only bridge when another number word follows
      } else break;
      j++;
    }
    if (labing) current += 10;
    out.push(String(total + current));
    i = last + 1;
  }
  return out.join('');
}

/* ---------- Normalising ---------- */

function normalize(raw: string) {
  let s = ' ' + raw.toLowerCase() + ' ';
  s = s.replace(/[₱]/g, ' php ');
  s = s.replace(/(\d),(\d{3})\b/g, '$1$2');
  // Tagalog compound numbers written as one word: labindalawa, labing-isa
  s = s.replace(/\blabin[g]?-?(isa|dalawa|tatlo|apat|lima|anim|pito|walo|siyam)\b/g, 'labing $1');
  s = s.replace(/\b(tig|kada|bawat)-/g, '$1 ');
  s = s.replace(/([,;!?])/g, ' $1 ');
  // "bawat isa" / "20 isa" mean "each" - protect them before "isa" becomes the number 1
  s = s.replace(/\b(kada|bawat|per)\s+isa\b/g, ' each ');
  s = s.replace(/(\d|\b(?:pesos?|piso|php))\s+(?:ang\s+)?isa\b/g, '$1 each');
  s = wordsToDigits(s);
  // 1.5k / 2k -> 1500 / 2000
  s = s.replace(/\b(\d+(?:\.\d+)?)\s?k\b/g, (_, n) => String(Math.round(parseFloat(n) * 1000)));
  // Split currency glued to numbers: 50pesos, php50, p50, 50php, 50p
  s = s.replace(/\b(php|p)(\d)/g, '$1 $2');
  s = s.replace(/(\d)(pesos?|piso|php|bucks|p)\b/g, '$1 $2');
  return s.replace(/\s+/g, ' ');
}

/* ---------- Amounts ---------- */

const CURRENCY_AFTER = /^\s*(pesos?|piso|php|bucks|p)\b/;
const CURRENCY_BEFORE = /\b(php|p|pesos?)\s*$/;
const NOT_MONEY_AFTER = /^\s*(dollars?|usd|\$|euros?|yen|am|pm|:|mins?|minutes?|hrs?|hours?|km|kms|kg|kgs|days?|araw|oras|beses|times|%|percent|gb|mb|th|st|nd|rd)\b/;
const QTY_AFTER = /^\s*(x|pcs?|pieces?|piraso|orders?|cups?|baso|sticks?|plato|plates?|bottles?|bote|packs?|balot|slices?|servings?)\b/;
const EACH_AFTER = /^\s*(pesos?|piso|php|p)?\s*(each|apiece|per\s+(piece|pc|order|item|cup|stick|isa)|isa|kada\s+isa|bawat\s+isa)\b/;
const EACH_BEFORE = /\b(tig|kada|bawat|@)\s*(php|p)?\s*$/;
const QTY_BEFORE = /\bx\s*$/;

interface Candidate { value: number; index: number; currency: boolean; qty: boolean; each: boolean }

function candidates(seg: string): Candidate[] {
  const list: Candidate[] = [];
  const re = /\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seg))) {
    const before = seg.slice(Math.max(0, m.index - 12), m.index);
    const after = seg.slice(m.index + m[0].length, m.index + m[0].length + 24);
    if (NOT_MONEY_AFTER.test(after) || /:\s*$/.test(before)) continue;
    const value = parseFloat(m[0]);
    if (!(value > 0)) continue;
    list.push({
      value,
      index: m.index,
      currency: CURRENCY_AFTER.test(after) || CURRENCY_BEFORE.test(before),
      qty: QTY_AFTER.test(after) || QTY_BEFORE.test(before),
      each: EACH_AFTER.test(after) || EACH_BEFORE.test(before),
    });
  }
  return list;
}

function amountOf(seg: string): number {
  const c = candidates(seg);
  if (!c.length) return 0;
  const each = c.find(x => x.each);
  if (each) {
    const qty = c.find(x => x !== each && (x.qty || (!x.currency && Number.isInteger(x.value) && x.value <= 50)));
    return round2(each.value * (qty ? qty.value : 1));
  }
  const money = c.filter(x => !x.qty);
  const marked = money.find(x => x.currency);
  if (marked) return marked.value;
  if (!money.length) return 0;
  // "3 siomai 45": a small leading count followed by a price - the price wins
  return Math.max(...money.map(x => x.value));
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ---------- Categories ---------- */

const CAT_WORDS: Record<string, string[]> = {
  food: [
    'food', 'foods', 'eat', 'ate', 'eating', 'kain', 'kumain', 'kinain', 'kakain', 'lunch', 'dinner', 'breakfast', 'brunch',
    'almusal', 'tanghalian', 'hapunan', 'ulam', 'kanin', 'rice', 'silog', 'tapsilog', 'longsilog', 'tocilog', 'hotsilog',
    'siomai', 'siopao', 'bbq', 'barbecue', 'burger', 'burgers', 'fries', 'pizza', 'pasta', 'spaghetti', 'chicken', 'manok',
    'pork', 'baboy', 'beef', 'fish', 'isda', 'noodles', 'pancit', 'mami', 'lomi', 'ramen', 'shawarma', 'sandwich', 'bread',
    'tinapay', 'pandesal', 'canteen', 'karinderya', 'carinderia', 'fastfood', 'jollibee', 'jolibee', 'mcdo', 'mcdonalds', 'kfc',
    'chowking', 'greenwich', 'mang inasal', 'inasal', 'grabfood', 'foodpanda', 'takeout', 'meal', 'meals', 'egg', 'itlog',
    'fruit', 'fruits', 'prutas', 'gulay', 'palengke', 'grocery', 'groceries', 'lugaw', 'goto', 'arroz caldo', 'hotdog',
    'footlong', 'pagkain', 'chibog', 'samgyup', 'samgyupsal', 'buffet', 'unli',
  ],
  snacks: [
    'snack', 'snacks', 'merienda', 'meryenda', 'coffee', 'kape', 'starbucks', 'milktea', 'milk tea', 'tea', 'boba', 'drink',
    'drinks', 'inumin', 'juice', 'softdrinks', 'soda', 'coke', 'water', 'tubig', 'gulaman', 'buko', 'halo-halo', 'halohalo',
    'ice cream', 'dessert', 'cake', 'donut', 'donuts', 'chocolate', 'candy', 'chips', 'biscuit', 'biscuits', 'biskwit', 'cookies',
    'fishball', 'kwek', 'kwekkwek', 'kwekwek', 'kikiam', 'isaw', 'turon', 'banana cue', 'taho', 'mais', 'corn', 'kakanin',
    'puto', 'yakult', 'frappe', 'latte', 'shake', 'smoothie',
  ],
  transpo: [
    'jeep', 'jeepney', 'dyip', 'bus', 'tricycle', 'trike', 'traysikel', 'pedicab', 'padyak', 'fare', 'fares', 'pamasahe',
    'sakay', 'sumakay', 'commute', 'taxi', 'grab', 'grabcar', 'angkas', 'joyride', 'move it', 'moveit', 'mrt', 'lrt', 'train',
    'tren', 'uv', 'uv express', 'fx', 'van', 'ferry', 'boat', 'bangka', 'gas', 'gasoline', 'diesel', 'parking', 'toll',
    'beep card', 'beep', 'ride', 'rides', 'byahe', 'biyahe', 'transpo', 'transport', 'transportation', 'uber', 'habal',
    'habal-habal', 'p2p', 'balikan', 'pauwi', 'papunta',
  ],
  school: [
    'school', 'print', 'printing', 'printed', 'photocopy', 'xerox', 'book', 'books', 'libro', 'notebook', 'notebooks', 'kwaderno',
    'ballpen', 'pen', 'pens', 'pencil', 'lapis', 'paper', 'papel', 'bond paper', 'yellow pad', 'pad paper', 'folder', 'envelope',
    'sobre', 'ruler', 'eraser', 'pambura', 'highlighter', 'marker', 'crayons', 'supplies', 'project', 'proyekto', 'thesis',
    'research', 'tuition', 'matrikula', 'school fee', 'fees', 'uniform', 'lab', 'laboratory', 'module', 'modules', 'handout',
    'handouts', 'reviewer', 'binding', 'laminate', 'calculator', 'cartolina', 'manila paper', 'glue', 'scissors', 'gunting',
    'art materials', 'assignment', 'requirements', 'org fee', 'membership fee',
  ],
  load: [
    'load', 'loads', 'nagpaload', 'nagload', 'pa-load', 'regular load', 'promo', 'data', 'mobile data', 'gigasurf', 'giga',
    'gomo', 'smart', 'globe', 'tnt', 'tm', 'dito', 'sim', 'wifi', 'piso wifi', 'pisonet', 'internet', 'vpn', 'cellphone', 'cp',
    'phone', 'unli data',
  ],
  gala: [
    'gala', 'lakad', 'outing', 'movie', 'movies', 'sine', 'cinema', 'mall', 'party', 'inuman', 'inom', 'beer', 'alak', 'bar',
    'club', 'concert', 'gig', 'karaoke', 'videoke', 'ktv', 'bowling', 'date', 'hangout', 'tambay', 'resort', 'swimming',
    'beach', 'trip', 'travel', 'staycation', 'tropa', 'barkada', 'friends', 'night out', 'billiards',
  ],
  shopping: [
    'shopping', 'clothes', 'damit', 'shoes', 'sapatos', 'shirt', 'tshirt', 't-shirt', 'pants', 'jeans', 'shorts', 'dress',
    'bag', 'jacket', 'hoodie', 'cap', 'socks', 'medyas', 'accessories', 'earrings', 'watch', 'shopee', 'lazada', 'tiktok shop',
    'ukay', 'ukay-ukay', 'online order', 'case', 'phone case', 'earphones', 'headphones', 'charger',
  ],
  personal: [
    'haircut', 'gupit', 'salon', 'barber', 'toiletries', 'shampoo', 'conditioner', 'soap', 'sabon', 'toothpaste', 'toothbrush',
    'lotion', 'deodorant', 'deo', 'skincare', 'sunscreen', 'makeup', 'lipstick', 'perfume', 'pabango', 'cologne', 'sanitary',
    'napkin', 'pads', 'tissue', 'alcohol', 'laundry', 'laba', 'watsons',
  ],
  health: [
    'medicine', 'gamot', 'hospital', 'doctor', 'clinic', 'checkup', 'check-up', 'consultation', 'vitamins', 'vitamin',
    'pharmacy', 'botika', 'mercury', 'biogesic', 'neozep', 'paracetamol', 'dentist', 'pills', 'vaccine', 'eyeglasses',
    'salamin', 'gym', 'fitness',
  ],
  bills: [
    'rent', 'upa', 'renta', 'bills', 'bill', 'kuryente', 'electricity', 'meralco', 'water bill', 'dorm', 'boarding',
    'boarding house', 'bedspace', 'apartment', 'condo', 'utilities', 'postpaid',
  ],
  subs: [
    'subscription', 'subscriptions', 'netflix', 'spotify', 'youtube premium', 'disney', 'disney+', 'hbo', 'viu', 'icloud',
    'google one', 'canva', 'chatgpt', 'premium', 'apple music', 'prime video',
  ],
  gifts: [
    'gift', 'gifts', 'regalo', 'birthday', 'bday', 'donation', 'abuloy', 'pasalubong', 'flowers', 'bulaklak', 'anniversary',
    'christmas', 'monthsary',
  ],
  games: [
    'games', 'game', 'gaming', 'arcade', 'timezone', 'diamonds', 'robux', 'steam', 'valorant', 'skin', 'skins', 'computer shop',
    'comshop', 'mobile legends', 'mlbb', 'genshin', 'codm', 'top up', 'topup', 'playstation', 'nintendo', 'roblox',
  ],
  other: [
    'ambag', 'contribution', 'others', 'other', 'misc', 'savings', 'utang', 'bayad utang', 'lent',
  ],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const CAT_RES = Object.entries(CAT_WORDS).map(([cat, words]) => ({
  cat,
  words: words.map(w => ({ w, re: new RegExp(`(?:^|[^a-z])${escapeRe(w)}(?:s|es)?(?![a-z])`) })),
}));

export function detectCategory(text: string): string {
  const s = ' ' + text.toLowerCase() + ' ';
  let best = 'other';
  let bestScore = 0;
  for (const { cat, words } of CAT_RES) {
    // Longer matches are more specific ("grabfood" beats "grab")
    const score = words.reduce((sum, { w, re }) => (re.test(s) ? sum + w.length : sum), 0);
    if (score > bestScore) { best = cat; bestScore = score; }
  }
  return best;
}

/* ---------- Dates ---------- */

const WEEKDAYS: [RegExp, number][] = [
  [/\b(sunday|linggo)\b/, 0], [/\b(monday|lunes)\b/, 1], [/\b(tuesday|martes)\b/, 2], [/\b(wednesday|miyerkules|miyerkoles)\b/, 3],
  [/\b(thursday|huwebes)\b/, 4], [/\b(friday|biyernes|byernes)\b/, 5], [/\b(saturday|sabado)\b/, 6],
];

function daysAgoOf(text: string, now = new Date()): number | null {
  if (/\b(day before yesterday|noong isang araw|nung isang araw|kamakalawa)\b/.test(text)) return 2;
  if (/\b(yesterday|kahapon|kagabi|last night)\b/.test(text)) return 1;
  if (/\b(today|ngayon|kanina|this morning|kaninang umaga|tonight|mamaya)\b/.test(text)) return 0;
  const m = text.match(/\b(\d+)\s*(days?|araw)\s*(ago|na ang nakalipas|nakaraan)\b/);
  if (m) return Math.min(60, Number(m[1]));
  for (const [re, dow] of WEEKDAYS) {
    // "linggo" alone usually means "week", so only treat it as Sunday with a time marker
    if (dow === 0 && !/\b(sunday|noong linggo|nung linggo|last linggo)\b/.test(text)) continue;
    if (re.test(text)) return (now.getDay() - dow + 7) % 7 || 7;
  }
  return null;
}

/* ---------- Notes ---------- */

const FILLER_START =
  /^(?:(?:i|ako|we|kami|just|lang|po|so|uhm|um|ok|okay|ay)\s+)*(?:(?:have|had|did|ve|'ve)\s+)?(?:bought|buy|buying|purchased|purchase|paid for|paid|pay|spent on|spent|spend|got|get|ordered|order|ate|eat|had|nagbayad ng|nagbayad|bayad sa|bayad|binayaran|bumili ng|bumili|binili|bili ng|bili|gumastos ng|gumastos sa|gumastos|ginastos ko sa|ginastos|kumain ng|kumain sa|kumain|nag|pambili ng|pang)?\s*(?:ako\s+)?(?:ng|sa|some|a|an|the|my)?\s+/;
const STRIP = [
  /\b(php|pesos?|piso|bucks)\b/g,
  /\b\d+(?:\.\d+)?\s*(x|pcs?|pieces?|piraso|orders?)?\b/g,
  /\b(each|apiece|tig|kada isa|bawat isa|kada|bawat)\b/g,
  /\b(today|yesterday|kahapon|kagabi|kanina|ngayon|last night|this morning|day before yesterday|kamakalawa)\b/g,
  /\b(for|worth|amounting to|that cost|cost|costs|sa halagang|na nagkakahalaga ng|halaga)\s*$/g,
  /\s+(for|worth|ng|na|sa|at|and|para sa|cost)\s*$/g,
  /^\s*(ng|sa|for|on|the|a|an|yung|ung|ang|para sa|para|pang|at|and)\s+/g,
  /\b(?:(?:last|noong|nung|on|this|sa)\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|lunes|martes|miyerkules|miyerkoles|huwebes|biyernes|byernes|sabado)\b/g,
  /\b(nagpaload|nagload|ako|po|lang|around|about|mga|halos)\b/g,
  /^\s*(cups?|pcs?|pieces?|orders?|bottles?|packs?|plates?|sticks?)\s+of\s+/g,
];

function noteOf(seg: string) {
  let s = seg.trim().replace(FILLER_START, '');
  for (let pass = 0; pass < 2; pass++) for (const re of STRIP) s = s.replace(re, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/^[^a-z0-9]+|[^a-z0-9)]+$/gi, '');
  if (!s) return '';
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s.length > 40 ? s.slice(0, 39).trimEnd() + '…' : s;
}

/* ---------- Main ---------- */

const REMOVE_RE = /\b(undo|delete|remove|cancel|bura|burahin|i-bura|tanggal|tanggalin|alisin|mali yun|mali|wrong|hindi tama|nevermind|never mind)\b/;
const QUERY_RE = /\b(how much|magkano na|magkano|ilan na|total|remaining|left|natitira|balance|natira|summary|status)\b/;
const SPLIT_RE = /\s*(?:,|;|\n|&|\+|\band then\b|\bthen\b|\band also\b|\band\b|\bplus\b|\bat saka\b|\bsaka\b|\btapos\b|\bpati\b|\bat\b|\balso\b)\s*/;

export function parseExpenseMessage(raw: string, now = new Date()): ParseResult {
  const lang = detectLang(raw);
  const text = normalize(raw);
  // Numbers that could be money (times, dollars and "5 days" are already excluded)
  const hasNumber = candidates(text).length > 0;

  if (REMOVE_RE.test(text) && (!hasNumber || text.trim().split(' ').length <= 6)) return { action: 'remove', lang };
  if (QUERY_RE.test(text) && !candidates(text).some(c => c.currency) && (/\?\s*$/.test(raw) || !hasNumber)) return { action: 'query', lang };

  // Break into pieces, then glue pieces without a price onto their neighbours
  // Split keeps the connectors so merged pieces still read naturally ("lunch at jollibee")
  const pieces = text.split(new RegExp(`(${SPLIT_RE.source})`));
  const parts: { p: string; sep: string }[] = [];
  for (let k = 0; k < pieces.length; k += 2) {
    const p = pieces[k].trim();
    if (p) parts.push({ p, sep: /[a-z]/.test(pieces[k + 1] || '') ? pieces[k + 1].trim() + ' ' : '' });
  }
  const segs: string[] = [];
  let pending = '';
  for (const { p, sep } of parts) {
    const c = candidates(p);
    const priced = c.some(x => !x.qty);
    const onlyEach = c.length > 0 && c.every(x => x.each || x.currency) && c.some(x => x.each);
    if (onlyEach && segs.length) {
      // "2 burgers at 50 each": the unit price belongs to the previous piece
      segs[segs.length - 1] += ' ' + pending + p;
      pending = '';
    } else if (priced) {
      segs.push((pending + p).trim());
      pending = '';
    } else {
      pending += p + ' ' + sep;
    }
  }
  if (pending.trim()) {
    if (segs.length) segs[segs.length - 1] += ' ' + pending.trim();
    else return { action: 'none', hasNumber, lang };
  }

  const msgDays = daysAgoOf(text, now);
  const items: ParsedItem[] = [];
  for (const seg of segs) {
    const amount = amountOf(seg);
    if (!(amount > 0) || amount > 1_000_000) continue;
    items.push({
      amount,
      category: detectCategory(seg),
      note: noteOf(seg),
      daysAgo: daysAgoOf(seg, now) ?? msgDays ?? 0,
    });
  }

  // A category word in its own piece ("food" in "for food, 50") should still apply
  if (items.length === 1 && items[0].category === 'other') items[0].category = detectCategory(text);

  return items.length ? { action: 'add', items, lang } : { action: 'none', hasNumber, lang };
}

// Finds the peso amount in free text, e.g. "can I afford a 1.5k jacket?" -> 1500
export const extractAmount = (raw: string) => amountOf(normalize(raw));
