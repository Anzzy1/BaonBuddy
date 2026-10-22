module.exports = [
"[project]/.next-internal/server/app/api/parse-receipt/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/budget.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATS",
    ()=>CATS,
    "KEY",
    ()=>KEY,
    "addDays",
    ()=>addDays,
    "catById",
    ()=>catById,
    "cleanAmount",
    ()=>cleanAmount,
    "compute",
    ()=>compute,
    "dayLabel",
    ()=>dayLabel,
    "diffDays",
    ()=>diffDays,
    "groupByDay",
    ()=>groupByDay,
    "iso",
    ()=>iso,
    "loadState",
    ()=>loadState,
    "monthRange",
    ()=>monthRange,
    "newestFirst",
    ()=>newestFirst,
    "parse",
    ()=>parse,
    "peso",
    ()=>peso,
    "pesoR",
    ()=>pesoR,
    "sampleState",
    ()=>sampleState,
    "shortDate",
    ()=>shortDate,
    "today",
    ()=>today,
    "uid",
    ()=>uid,
    "weekRange",
    ()=>weekRange
]);
const KEY = 'estudyante-balanse.v1';
const CATS = [
    {
        id: 'food',
        label: 'Food',
        icon: 'utensils',
        color: '#FFB98F'
    },
    {
        id: 'transpo',
        label: 'Transpo',
        icon: 'bus',
        color: '#9FD8FF'
    },
    {
        id: 'school',
        label: 'School Supplies',
        icon: 'pencil-ruler',
        color: '#C9B8FF'
    },
    {
        id: 'load',
        label: 'Load & Data',
        icon: 'smartphone',
        color: '#A9ECC8'
    },
    {
        id: 'gala',
        label: 'Gala',
        icon: 'party-popper',
        color: '#FFA3CB'
    },
    {
        id: 'other',
        label: 'Others',
        icon: 'shapes',
        color: '#E8E4D8'
    }
];
const catById = (id)=>CATS.find((c)=>c.id === id) || CATS[CATS.length - 1];
const pad = (n)=>String(n).padStart(2, '0');
const iso = (d)=>`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s)=>{
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
};
const addDays = (d, n)=>{
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};
const diffDays = (a, b)=>Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);
const today = ()=>iso(new Date());
const monthRange = ()=>{
    const t = new Date();
    return [
        iso(new Date(t.getFullYear(), t.getMonth(), 1)),
        iso(new Date(t.getFullYear(), t.getMonth() + 1, 0))
    ];
};
const weekRange = ()=>{
    const t = new Date();
    const s = addDays(t, -((t.getDay() + 6) % 7));
    return [
        iso(s),
        iso(addDays(s, 6))
    ];
};
const shortDate = (s)=>parse(s).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric'
    });
const peso = (v)=>'₱' + Math.abs(v).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
const pesoR = (v)=>'₱' + Math.round(Math.abs(v)).toLocaleString('en-PH');
const uid = ()=>Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function dayLabel(s) {
    const d = diffDays(s, today());
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return parse(s).toLocaleDateString('en-PH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}
function cleanAmount(raw) {
    let v = raw.replace(/[^\d.]/g, '');
    const firstDot = v.indexOf('.');
    if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
    const [a, b] = v.split('.');
    return b !== undefined ? a.slice(0, 7) + '.' + b.slice(0, 2) : a.slice(0, 7);
}
function sampleState() {
    const [start, end] = monthRange();
    const t = new Date();
    const d = (n)=>{
        const x = iso(addDays(t, -n));
        return x < start ? start : x;
    };
    const raw = [
        [
            0,
            'food',
            85,
            'Siomai rice + gulaman'
        ],
        [
            0,
            'transpo',
            26,
            'Jeep papunta at pauwi'
        ],
        [
            1,
            'school',
            150,
            'Yellow pad + ballpen'
        ],
        [
            1,
            'load',
            99,
            'Data promo'
        ],
        [
            1,
            'food',
            65,
            'Fishball break'
        ],
        [
            2,
            'gala',
            220,
            'Milk tea with the tropa'
        ],
        [
            2,
            'transpo',
            26,
            ''
        ],
        [
            3,
            'school',
            45,
            'Printing ng reviewer'
        ],
        [
            4,
            'food',
            120,
            'Tapsilog'
        ],
        [
            5,
            'other',
            350,
            'Ambag sa group project'
        ],
        [
            6,
            'transpo',
            26,
            ''
        ],
        [
            6,
            'food',
            95,
            'Lunch sa karinderya'
        ]
    ];
    const ts = Date.now();
    return {
        budget: 5000,
        start,
        end,
        expenses: raw.map(([n, cat, amount, note], i)=>({
                id: uid(),
                cat,
                amount,
                note,
                date: d(n),
                ts: ts - i * 1000
            }))
    };
}
function loadState() {
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '');
        if (s && Array.isArray(s.expenses) && s.start && s.end) {
            // Drop broken entries (e.g. ₱NaN from an older chat parser) so totals stay correct
            s.expenses = s.expenses.filter((e)=>e && Number.isFinite(Number(e.amount)) && Number(e.amount) > 0);
            return s;
        }
    } catch  {}
    return null;
}
function compute(state) {
    const { budget, start, end, expenses } = state;
    const inPeriod = expenses.filter((e)=>e.date >= start && e.date <= end);
    const spent = inPeriod.reduce((s, e)=>s + e.amount, 0);
    const remaining = budget - spent;
    const pct = budget > 0 ? spent / budget * 100 : 0;
    const total = diffDays(start, end) + 1;
    const t = today();
    const elapsed = Math.min(total, Math.max(0, diffDays(start, t) + 1));
    const left = Math.min(total, Math.max(0, diffDays(t, end) + 1));
    const timePct = elapsed / total * 100;
    const perDay = remaining > 0 && left > 0 ? remaining / left : 0;
    const avgPerDay = elapsed > 0 ? spent / elapsed : 0;
    const projected = avgPerDay * total;
    const byCat = CATS.map((c)=>({
            ...c,
            sum: inPeriod.filter((e)=>e.cat === c.id).reduce((s, e)=>s + e.amount, 0)
        })).filter((c)=>c.sum > 0).sort((a, b)=>b.sum - a.sum);
    let st;
    if (pct > 100) st = {
        color: '#E5484D',
        chip: 'Lagpas na',
        title: 'Over budget ka na',
        msg: `Uy, lampas ka ng ${peso(-remaining)}. Tiis muna ha, darating din next allowance.`
    };
    else if (pct >= 85) st = {
        color: '#EA580C',
        chip: 'Ingat',
        title: 'Malapit na sa limit',
        msg: `${peso(remaining)} na lang yan for ${left} day${left === 1 ? '' : 's'}. Essentials muna, okay lang yan.`
    };
    else if (pct > timePct + 10 && left > 0) st = {
        color: '#D97706',
        chip: 'Medyo mabilis',
        title: 'Medyo mabilis ang gastos',
        msg: `Nagastos ka na ng ${Math.round(pct)}%, pero ${Math.round(timePct)}% lang ng panahon ang lumipas. Bawasan mo ha.`
    };
    else st = {
        color: '#16A34A',
        chip: 'Sakto pa',
        title: 'Chill ka pa',
        msg: left > 0 ? `Okay lang pace mo. Subukan mong bumaba sa ${pesoR(perDay)} per day para safe ka.` : 'Tapos na period, nakaabot ka within budget. Nice.'
    };
    return {
        inPeriod,
        spent,
        remaining,
        pct,
        total,
        elapsed,
        left,
        timePct,
        perDay,
        avgPerDay,
        projected,
        byCat,
        st
    };
}
function groupByDay(list) {
    const groups = [];
    list.forEach((e)=>{
        const g = groups[groups.length - 1];
        if (g && g.date === e.date) g.items.push(e);
        else groups.push({
            date: e.date,
            items: [
                e
            ]
        });
    });
    return groups;
}
const newestFirst = (a, b)=>a.date < b.date ? 1 : a.date > b.date ? -1 : b.ts - a.ts;
}),
"[project]/lib/parseExpense.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Natural-language expense parser for English, Tagalog and Taglish messages.
// Pure functions only, so the API route and any client code can share them.
__turbopack_context__.s([
    "detectCategory",
    ()=>detectCategory,
    "detectLang",
    ()=>detectLang,
    "extractAmount",
    ()=>extractAmount,
    "parseExpenseMessage",
    ()=>parseExpenseMessage
]);
/* ---------- Language ---------- */ const TL_WORDS = new Set(('ako ko mo ng nang sa yung ung ang na lang naman po kumain bumili binili nagbayad bayad pamasahe kahapon kanina ' + 'ngayon kagabi magkano natitira gastos ginastos gumastos tig bawat kada piso isang mga para ba kasi din rin pa nga ' + 'ito yan iyan dito wala meron may siya kami tayo pero tapos saka pati hindi oo nung noong sakay nagpaload nagload ' + 'pambili ulam kanin almusal tanghalian hapunan meryenda merienda lumabas nag binayaran pang').split(' '));
const EN_WORDS = new Set(('i the for my bought buy spent spend paid pay on and with today yesterday a an to of how much what is was had got ' + 'just some me it this that ate eat purchased worth left remaining total did have bucks').split(' '));
function detectLang(text) {
    const words = text.toLowerCase().match(/[a-z']+/g) || [];
    let tl = 0;
    let en = 0;
    for (const w of words){
        if (TL_WORDS.has(w)) tl++;
        else if (EN_WORDS.has(w)) en++;
    }
    // Any real Tagalog in the message means the person is comfortable in Taglish
    return tl > 0 && tl >= en * 0.5 ? 'tl' : 'en';
}
/* ---------- Number words ---------- */ const UNITS = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fourty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
    isa: 1,
    isang: 1,
    dalawa: 2,
    dalawang: 2,
    tatlo: 3,
    tatlong: 3,
    apat: 4,
    lima: 5,
    limang: 5,
    anim: 6,
    pito: 7,
    pitong: 7,
    walo: 8,
    walong: 8,
    siyam: 9,
    sampu: 10,
    sampung: 10,
    labing: 10,
    labin: 10,
    dalawampu: 20,
    dalawampung: 20,
    tatlumpu: 30,
    tatlumpung: 30,
    apatnapu: 40,
    apatnapung: 40,
    limampu: 50,
    limampung: 50,
    animnapu: 60,
    animnapung: 60,
    pitumpu: 70,
    pitumpung: 70,
    walumpu: 80,
    walumpung: 80,
    siyamnapu: 90,
    siyamnapung: 90,
    uno: 1,
    dos: 2,
    tres: 3,
    kwatro: 4,
    kuwatro: 4,
    singko: 5,
    sinko: 5,
    sais: 6,
    siyete: 7,
    syete: 7,
    otso: 8,
    nuwebe: 9,
    nueve: 9,
    diyes: 10,
    dyes: 10,
    onse: 11,
    dose: 12,
    trese: 13,
    katorse: 14,
    kinse: 15,
    disisais: 16,
    disisyete: 17,
    disiotso: 18,
    disinuwebe: 19,
    beinte: 20,
    bente: 20,
    trenta: 30,
    treinta: 30,
    kwarenta: 40,
    kuwarenta: 40,
    singkwenta: 50,
    singkuwenta: 50,
    sisenta: 60,
    setenta: 70,
    otsenta: 80,
    nobenta: 90
};
const HUNDREDS = new Set([
    'hundred',
    'daan',
    'raan',
    'siyento',
    'syento',
    'sientos'
]);
const THOUSANDS = new Set([
    'thousand',
    'libo',
    'libong',
    'mil'
]);
const LINKERS = new Set([
    'na',
    'at',
    'and',
    'y',
    'ng'
]);
const isNumWord = (w)=>w in UNITS || HUNDREDS.has(w) || THOUSANDS.has(w);
// Rewrites runs of number words as digits: "isang daan at limampu" -> "150", "fifty five" -> "55"
function wordsToDigits(text) {
    const tokens = text.split(/(\s+|-)/);
    const out = [];
    let i = 0;
    while(i < tokens.length){
        const w = tokens[i].trim();
        const startsNumber = isNumWord(w) || w === 'a' && HUNDREDS.has((tokens[i + 2] || '').trim()) || w === 'a' && THOUSANDS.has((tokens[i + 2] || '').trim());
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
        while(j < tokens.length){
            const t = tokens[j].trim();
            if (!t) {
                j++;
                continue;
            }
            if (t === 'a' && j === i) {
                current = 1;
                last = j;
                j++;
                continue;
            }
            if (t in UNITS) {
                const v = UNITS[t];
                if (t.startsWith('labi')) labing = true;
                else if (labing) {
                    current += 10 + v;
                    labing = false;
                } else current += v;
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
/* ---------- Normalising ---------- */ function normalize(raw) {
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
    s = s.replace(/\b(\d+(?:\.\d+)?)\s?k\b/g, (_, n)=>String(Math.round(parseFloat(n) * 1000)));
    // Split currency glued to numbers: 50pesos, php50, p50, 50php, 50p
    s = s.replace(/\b(php|p)(\d)/g, '$1 $2');
    s = s.replace(/(\d)(pesos?|piso|php|bucks|p)\b/g, '$1 $2');
    return s.replace(/\s+/g, ' ');
}
/* ---------- Amounts ---------- */ const CURRENCY_AFTER = /^\s*(pesos?|piso|php|bucks|p)\b/;
const CURRENCY_BEFORE = /\b(php|p|pesos?)\s*$/;
const NOT_MONEY_AFTER = /^\s*(dollars?|usd|\$|euros?|yen|am|pm|:|mins?|minutes?|hrs?|hours?|km|kms|kg|kgs|days?|araw|oras|beses|times|%|percent|gb|mb|th|st|nd|rd)\b/;
const QTY_AFTER = /^\s*(x|pcs?|pieces?|piraso|orders?|cups?|baso|sticks?|plato|plates?|bottles?|bote|packs?|balot|slices?|servings?)\b/;
const EACH_AFTER = /^\s*(pesos?|piso|php|p)?\s*(each|apiece|per\s+(piece|pc|order|item|cup|stick|isa)|isa|kada\s+isa|bawat\s+isa)\b/;
const EACH_BEFORE = /\b(tig|kada|bawat|@)\s*(php|p)?\s*$/;
const QTY_BEFORE = /\bx\s*$/;
function candidates(seg) {
    const list = [];
    const re = /\d+(?:\.\d+)?/g;
    let m;
    while(m = re.exec(seg)){
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
            each: EACH_AFTER.test(after) || EACH_BEFORE.test(before)
        });
    }
    return list;
}
function amountOf(seg) {
    const c = candidates(seg);
    if (!c.length) return 0;
    const each = c.find((x)=>x.each);
    if (each) {
        const qty = c.find((x)=>x !== each && (x.qty || !x.currency && Number.isInteger(x.value) && x.value <= 50));
        return round2(each.value * (qty ? qty.value : 1));
    }
    const money = c.filter((x)=>!x.qty);
    const marked = money.find((x)=>x.currency);
    if (marked) return marked.value;
    if (!money.length) return 0;
    // "3 siomai 45": a small leading count followed by a price - the price wins
    return Math.max(...money.map((x)=>x.value));
}
const round2 = (n)=>Math.round(n * 100) / 100;
/* ---------- Categories ---------- */ const CAT_WORDS = {
    food: [
        'food',
        'foods',
        'eat',
        'ate',
        'eating',
        'kain',
        'kumain',
        'kinain',
        'kakain',
        'lunch',
        'dinner',
        'breakfast',
        'brunch',
        'almusal',
        'tanghalian',
        'hapunan',
        'merienda',
        'meryenda',
        'snack',
        'snacks',
        'ulam',
        'kanin',
        'rice',
        'silog',
        'tapsilog',
        'longsilog',
        'tocilog',
        'hotsilog',
        'siomai',
        'siopao',
        'fishball',
        'kwek',
        'kwekkwek',
        'kikiam',
        'isaw',
        'bbq',
        'barbecue',
        'burger',
        'burgers',
        'fries',
        'pizza',
        'pasta',
        'spaghetti',
        'chicken',
        'manok',
        'pork',
        'baboy',
        'beef',
        'fish',
        'isda',
        'noodles',
        'pancit',
        'mami',
        'lomi',
        'ramen',
        'shawarma',
        'sandwich',
        'bread',
        'tinapay',
        'pandesal',
        'coffee',
        'kape',
        'starbucks',
        'milktea',
        'milk tea',
        'tea',
        'boba',
        'drink',
        'drinks',
        'inumin',
        'juice',
        'softdrinks',
        'soda',
        'coke',
        'water',
        'tubig',
        'gulaman',
        'buko',
        'halo-halo',
        'halohalo',
        'ice cream',
        'dessert',
        'cake',
        'donut',
        'donuts',
        'chocolate',
        'candy',
        'chips',
        'biscuit',
        'biscuits',
        'biskwit',
        'cookies',
        'canteen',
        'karinderya',
        'carinderia',
        'fastfood',
        'jollibee',
        'jolibee',
        'mcdo',
        'mcdonalds',
        'kfc',
        'chowking',
        'greenwich',
        'mang inasal',
        'inasal',
        'grabfood',
        'foodpanda',
        'takeout',
        'meal',
        'meals',
        'ulam',
        'egg',
        'itlog',
        'fruit',
        'fruits',
        'prutas',
        'gulay',
        'palengke',
        'grocery',
        'groceries',
        'turon',
        'banana cue',
        'lugaw',
        'goto',
        'arroz caldo',
        'siopao',
        'hotdog',
        'footlong',
        'taho',
        'mais',
        'corn',
        'kakanin',
        'puto',
        'pagkain',
        'chibog',
        'kwekwek',
        'yakult',
        'samgyup',
        'samgyupsal',
        'buffet',
        'unli',
        'kfc'
    ],
    transpo: [
        'jeep',
        'jeepney',
        'dyip',
        'bus',
        'tricycle',
        'trike',
        'traysikel',
        'pedicab',
        'padyak',
        'fare',
        'fares',
        'pamasahe',
        'sakay',
        'sumakay',
        'commute',
        'taxi',
        'grab',
        'grabcar',
        'angkas',
        'joyride',
        'move it',
        'moveit',
        'mrt',
        'lrt',
        'train',
        'tren',
        'uv',
        'uv express',
        'fx',
        'van',
        'ferry',
        'boat',
        'bangka',
        'gas',
        'gasoline',
        'diesel',
        'parking',
        'toll',
        'beep card',
        'beep',
        'ride',
        'rides',
        'byahe',
        'biyahe',
        'transpo',
        'transport',
        'transportation',
        'uber',
        'habal',
        'habal-habal',
        'p2p',
        'balikan',
        'pauwi',
        'papunta'
    ],
    school: [
        'school',
        'print',
        'printing',
        'printed',
        'photocopy',
        'xerox',
        'book',
        'books',
        'libro',
        'notebook',
        'notebooks',
        'kwaderno',
        'ballpen',
        'pen',
        'pens',
        'pencil',
        'lapis',
        'paper',
        'papel',
        'bond paper',
        'yellow pad',
        'pad paper',
        'folder',
        'envelope',
        'sobre',
        'ruler',
        'eraser',
        'pambura',
        'highlighter',
        'marker',
        'crayons',
        'supplies',
        'project',
        'proyekto',
        'thesis',
        'research',
        'tuition',
        'matrikula',
        'school fee',
        'fees',
        'uniform',
        'lab',
        'laboratory',
        'module',
        'modules',
        'handout',
        'handouts',
        'reviewer',
        'binding',
        'laminate',
        'calculator',
        'cartolina',
        'manila paper',
        'glue',
        'scissors',
        'gunting',
        'art materials',
        'assignment',
        'requirements',
        'org fee',
        'membership fee'
    ],
    load: [
        'load',
        'loads',
        'nagpaload',
        'nagload',
        'pa-load',
        'regular load',
        'promo',
        'data',
        'mobile data',
        'gigasurf',
        'giga',
        'gomo',
        'smart',
        'globe',
        'tnt',
        'tm',
        'dito',
        'sim',
        'wifi',
        'piso wifi',
        'pisonet',
        'internet',
        'subscription',
        'netflix',
        'spotify',
        'youtube premium',
        'vpn',
        'cellphone',
        'cp',
        'phone',
        'unli data'
    ],
    gala: [
        'gala',
        'lakad',
        'outing',
        'movie',
        'movies',
        'sine',
        'cinema',
        'mall',
        'party',
        'inuman',
        'inom',
        'beer',
        'alak',
        'bar',
        'club',
        'concert',
        'gig',
        'games',
        'game',
        'gaming',
        'arcade',
        'timezone',
        'diamonds',
        'robux',
        'steam',
        'valorant',
        'skin',
        'skins',
        'karaoke',
        'videoke',
        'ktv',
        'bowling',
        'date',
        'hangout',
        'tambay',
        'resort',
        'swimming',
        'beach',
        'trip',
        'travel',
        'staycation',
        'tropa',
        'barkada',
        'friends',
        'night out',
        'computer shop',
        'comshop',
        'billiards'
    ],
    other: [
        'gift',
        'gifts',
        'regalo',
        'ambag',
        'contribution',
        'donation',
        'abuloy',
        'laundry',
        'laba',
        'haircut',
        'gupit',
        'medicine',
        'gamot',
        'hospital',
        'doctor',
        'clinic',
        'toiletries',
        'shampoo',
        'soap',
        'sabon',
        'toothpaste',
        'rent',
        'upa',
        'renta',
        'bills',
        'kuryente',
        'electricity',
        'clothes',
        'damit',
        'shoes',
        'sapatos',
        'shirt',
        'tshirt',
        'pants',
        'bag',
        'shopping',
        'others',
        'other',
        'misc',
        'savings',
        'utang',
        'bayad utang',
        'lent'
    ]
};
const escapeRe = (s)=>s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const CAT_RES = Object.entries(CAT_WORDS).map(([cat, words])=>({
        cat,
        words: words.map((w)=>({
                w,
                re: new RegExp(`(?:^|[^a-z])${escapeRe(w)}(?:s|es)?(?![a-z])`)
            }))
    }));
function detectCategory(text) {
    const s = ' ' + text.toLowerCase() + ' ';
    let best = 'other';
    let bestScore = 0;
    for (const { cat, words } of CAT_RES){
        // Longer matches are more specific ("grabfood" beats "grab")
        const score = words.reduce((sum, { w, re })=>re.test(s) ? sum + w.length : sum, 0);
        if (score > bestScore) {
            best = cat;
            bestScore = score;
        }
    }
    return best;
}
/* ---------- Dates ---------- */ const WEEKDAYS = [
    [
        /\b(sunday|linggo)\b/,
        0
    ],
    [
        /\b(monday|lunes)\b/,
        1
    ],
    [
        /\b(tuesday|martes)\b/,
        2
    ],
    [
        /\b(wednesday|miyerkules|miyerkoles)\b/,
        3
    ],
    [
        /\b(thursday|huwebes)\b/,
        4
    ],
    [
        /\b(friday|biyernes|byernes)\b/,
        5
    ],
    [
        /\b(saturday|sabado)\b/,
        6
    ]
];
function daysAgoOf(text, now = new Date()) {
    if (/\b(day before yesterday|noong isang araw|nung isang araw|kamakalawa)\b/.test(text)) return 2;
    if (/\b(yesterday|kahapon|kagabi|last night)\b/.test(text)) return 1;
    if (/\b(today|ngayon|kanina|this morning|kaninang umaga|tonight|mamaya)\b/.test(text)) return 0;
    const m = text.match(/\b(\d+)\s*(days?|araw)\s*(ago|na ang nakalipas|nakaraan)\b/);
    if (m) return Math.min(60, Number(m[1]));
    for (const [re, dow] of WEEKDAYS){
        // "linggo" alone usually means "week", so only treat it as Sunday with a time marker
        if (dow === 0 && !/\b(sunday|noong linggo|nung linggo|last linggo)\b/.test(text)) continue;
        if (re.test(text)) return (now.getDay() - dow + 7) % 7 || 7;
    }
    return null;
}
/* ---------- Notes ---------- */ const FILLER_START = /^(?:(?:i|ako|we|kami|just|lang|po|so|uhm|um|ok|okay|ay)\s+)*(?:(?:have|had|did|ve|'ve)\s+)?(?:bought|buy|buying|purchased|purchase|paid for|paid|pay|spent on|spent|spend|got|get|ordered|order|ate|eat|had|nagbayad ng|nagbayad|bayad sa|bayad|binayaran|bumili ng|bumili|binili|bili ng|bili|gumastos ng|gumastos sa|gumastos|ginastos ko sa|ginastos|kumain ng|kumain sa|kumain|nag|pambili ng|pang)?\s*(?:ako\s+)?(?:ng|sa|some|a|an|the|my)?\s+/;
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
    /^\s*(cups?|pcs?|pieces?|orders?|bottles?|packs?|plates?|sticks?)\s+of\s+/g
];
function noteOf(seg) {
    let s = seg.trim().replace(FILLER_START, '');
    for(let pass = 0; pass < 2; pass++)for (const re of STRIP)s = s.replace(re, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/^[^a-z0-9]+|[^a-z0-9)]+$/gi, '');
    if (!s) return '';
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return s.length > 40 ? s.slice(0, 39).trimEnd() + '…' : s;
}
/* ---------- Main ---------- */ const REMOVE_RE = /\b(undo|delete|remove|cancel|bura|burahin|i-bura|tanggal|tanggalin|alisin|mali yun|mali|wrong|hindi tama|nevermind|never mind)\b/;
const QUERY_RE = /\b(how much|magkano na|magkano|ilan na|total|remaining|left|natitira|balance|natira|summary|status)\b/;
const SPLIT_RE = /\s*(?:,|;|\n|&|\+|\band then\b|\bthen\b|\band also\b|\band\b|\bplus\b|\bat saka\b|\bsaka\b|\btapos\b|\bpati\b|\bat\b|\balso\b)\s*/;
function parseExpenseMessage(raw, now = new Date()) {
    const lang = detectLang(raw);
    const text = normalize(raw);
    // Numbers that could be money (times, dollars and "5 days" are already excluded)
    const hasNumber = candidates(text).length > 0;
    if (REMOVE_RE.test(text) && (!hasNumber || text.trim().split(' ').length <= 6)) return {
        action: 'remove',
        lang
    };
    if (QUERY_RE.test(text) && !candidates(text).some((c)=>c.currency) && (/\?\s*$/.test(raw) || !hasNumber)) return {
        action: 'query',
        lang
    };
    // Break into pieces, then glue pieces without a price onto their neighbours
    // Split keeps the connectors so merged pieces still read naturally ("lunch at jollibee")
    const pieces = text.split(new RegExp(`(${SPLIT_RE.source})`));
    const parts = [];
    for(let k = 0; k < pieces.length; k += 2){
        const p = pieces[k].trim();
        if (p) parts.push({
            p,
            sep: /[a-z]/.test(pieces[k + 1] || '') ? pieces[k + 1].trim() + ' ' : ''
        });
    }
    const segs = [];
    let pending = '';
    for (const { p, sep } of parts){
        const c = candidates(p);
        const priced = c.some((x)=>!x.qty);
        const onlyEach = c.length > 0 && c.every((x)=>x.each || x.currency) && c.some((x)=>x.each);
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
        else return {
            action: 'none',
            hasNumber,
            lang
        };
    }
    const msgDays = daysAgoOf(text, now);
    const items = [];
    for (const seg of segs){
        const amount = amountOf(seg);
        if (!(amount > 0) || amount > 1_000_000) continue;
        items.push({
            amount,
            category: detectCategory(seg),
            note: noteOf(seg),
            daysAgo: daysAgoOf(seg, now) ?? msgDays ?? 0
        });
    }
    // A category word in its own piece ("food" in "for food, 50") should still apply
    if (items.length === 1 && items[0].category === 'other') items[0].category = detectCategory(text);
    return items.length ? {
        action: 'add',
        items,
        lang
    } : {
        action: 'none',
        hasNumber,
        lang
    };
}
const extractAmount = (raw)=>amountOf(normalize(raw));
}),
"[project]/lib/parseReceipt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Reads OCR text from a Philippine store receipt and pulls out the store, date, items and total.
// OCR is noisy, so every step is defensive and the result carries a confidence the UI can show.
__turbopack_context__.s([
    "parseReceiptText",
    ()=>parseReceiptText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parseExpense.ts [app-route] (ecmascript)");
;
const STORES = [
    [
        /7\s*[-–]?\s*(eleven|e1even|eleuen|elev)/i,
        '7-Eleven',
        'food'
    ],
    [
        /mini\s*stop/i,
        'Ministop',
        'food'
    ],
    [
        /family\s*mart/i,
        'FamilyMart',
        'food'
    ],
    [
        /lawson/i,
        'Lawson',
        'food'
    ],
    [
        /alfamart/i,
        'Alfamart',
        'food'
    ],
    [
        /jollibee/i,
        'Jollibee',
        'food'
    ],
    [
        /mc\s*donald|mcdo/i,
        "McDonald's",
        'food'
    ],
    [
        /chowking/i,
        'Chowking',
        'food'
    ],
    [
        /greenwich/i,
        'Greenwich',
        'food'
    ],
    [
        /mang\s*inasal/i,
        'Mang Inasal',
        'food'
    ],
    [
        /kfc/i,
        'KFC',
        'food'
    ],
    [
        /starbucks/i,
        'Starbucks',
        'food'
    ],
    [
        /puregold/i,
        'Puregold',
        'food'
    ],
    [
        /savemore|save\s*more/i,
        'SaveMore',
        'food'
    ],
    [
        /robinsons\s*(supermarket|easymart)/i,
        'Robinsons',
        'food'
    ],
    [
        /sm\s*(supermarket|hypermarket|markets)/i,
        'SM Supermarket',
        'food'
    ],
    [
        /national\s*book/i,
        'National Book Store',
        'school'
    ],
    [
        /expressions/i,
        'Expressions',
        'school'
    ],
    [
        /mercury\s*drug/i,
        'Mercury Drug',
        'other'
    ],
    [
        /watsons/i,
        'Watsons',
        'other'
    ],
    [
        /the\s*generics/i,
        'The Generics Pharmacy',
        'other'
    ],
    [
        /petron|shell|caltex|seaoil|phoenix/i,
        'Gas station',
        'transpo'
    ],
    [
        /sm\s*cinema|ayala\s*cinema|cinema/i,
        'Cinema',
        'gala'
    ],
    [
        /timezone|tom'?s\s*world/i,
        'Arcade',
        'gala'
    ]
];
// Lines that carry money but are not purchased items
const NOT_ITEM = /\b(sub\s*-?\s*total|total|amount\s*due|balance|cash|change|tender|tendered|payment|paid|gcash|maya|paymaya|card|visa|master|debit|credit|vat|vatable|vat-?able|exempt|zero[\s-]*rated|non[\s-]*vat|tax|discount|less|senior|pwd|points|rounding|qty|quantity|items?\s*sold|no\.?\s*of\s*items|tin|min|s\/?n|serial|permit|ptu|invoice|receipt|or\s*no|si\s*no|txn|trans|terminal|cashier|clerk|staff|date|time|tel|phone|thank|welcome|accred|bir|pos|store\s*#|branch|customer|name|address|signature|valid|official)\b/i;
const TOTAL_STRONG = /\b(grand\s*total|amount\s*due|total\s*due|total\s*amount|amount\s*payable|net\s*amount|total\s*sales|balance\s*due|total\s*payable)\b/i;
const TOTAL_WEAK = /\btota[l1i]\b|\btotai\b|\bt0tal\b/i;
const NOT_TOTAL = /\b(sub\s*-?\s*total|total\s*(qty|quantity|items?|disc|discount|vat|savings)|vatable|items?\s*sold)\b/i;
// OCR often reads "O" for 0, "l/I" for 1, "S" for 5 inside numbers
function fixDigits(s) {
    return s.replace(/(?<=\d)[oO](?=[\d.,])|(?<=[\d.,])[oO](?=\d|\b)/g, '0').replace(/(?<=\d)[lI|](?=[\d.,])|(?<=[\d.,])[lI|](?=\d)/g, '1').replace(/(?<=\d)[sS](?=\d)/g, '5');
}
// Money values on a line: "1,234.50", "45.00", "P 120.00", "₱99"
function moneyOn(line) {
    const out = [];
    const re = /(?:₱|php|p)?\s?(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?!\d)/gi;
    let m;
    while(m = re.exec(line)){
        const v = parseFloat(m[1].replace(/,/g, '') + '.' + m[2]);
        if (v > 0 && v < 1_000_000) out.push(v);
    }
    return out;
}
const MONTHS = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec'
];
const pad = (n)=>String(n).padStart(2, '0');
function findDate(text, now = new Date()) {
    const valid = (y, m, d)=>{
        if (y < 100) y += 2000;
        if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2015 || y > now.getFullYear() + 1) return null;
        const iso = `${y}-${pad(m)}-${pad(d)}`;
        // A receipt from the future is an OCR mistake
        return new Date(y, m - 1, d) <= new Date(now.getTime() + 864e5) ? iso : null;
    };
    let m = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (m) {
        const r = valid(+m[1], +m[2], +m[3]);
        if (r) return r;
    }
    m = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/);
    if (m) {
        // Philippine receipts are usually mm/dd/yyyy; fall back to dd/mm when that is impossible
        const r = valid(+m[3], +m[1], +m[2]) || valid(+m[3], +m[2], +m[1]);
        if (r) return r;
    }
    m = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{2,4})\b/i);
    if (m) {
        const r = valid(+m[3], MONTHS.indexOf(m[1].toLowerCase()) + 1, +m[2]);
        if (r) return r;
    }
    return null;
}
function cleanName(raw) {
    return raw.replace(/(?:₱|\bphp|\bp)?\s?\d{1,3}(?:,\d{3})*[.,]\d{2}.*$/i, '') // price and anything after it
    .replace(/^\s*\d+\s*(?:x|@|pc|pcs)?\s+/i, '') // leading qty
    .replace(/\b\d+\s*@\s*/g, '').replace(/[^a-z0-9ñ&'()./ -]/gi, ' ').replace(/\s{2,}/g, ' ').trim().replace(/^[-./ ]+|[-./ ]+$/g, '').slice(0, 32);
}
const titleCase = (s)=>s.toLowerCase().replace(/\b[a-z]/g, (c)=>c.toUpperCase());
function parseReceiptText(raw, now = new Date()) {
    const lines = fixDigits(raw).split(/\r?\n/).map((l)=>l.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const text = lines.join('\n');
    const storeHit = STORES.find(([re])=>re.test(text));
    const firstWords = lines.find((l)=>/[a-z]{3,}/i.test(l) && !/\d{4,}/.test(l)) || '';
    const store = storeHit ? storeHit[1] : titleCase(cleanName(firstWords)) || 'Receipt';
    // Total: prefer explicit "amount due" style lines, then plain "total"
    let total = 0;
    let totalIdx = -1;
    for (const strong of [
        true,
        false
    ]){
        for(let i = lines.length - 1; i >= 0; i--){
            const l = lines[i];
            if (NOT_TOTAL.test(l) && !TOTAL_STRONG.test(l)) continue;
            if (!(strong ? TOTAL_STRONG : TOTAL_WEAK).test(l)) continue;
            // The amount is usually on the same line, sometimes on the next one
            const vals = moneyOn(l).length ? moneyOn(l) : moneyOn(lines[i + 1] || '');
            if (vals.length) {
                const v = vals[vals.length - 1];
                // Keep the earliest strong total, but a larger plain total later means a receipt with a subtotal
                if (!total || v >= total) {
                    total = v;
                    totalIdx = i;
                }
            }
        }
        if (total) break;
    }
    // Cash minus change is a good cross-check (or fallback)
    const cashLine = lines.find((l)=>/\b(cash|tendered|amount\s*tendered|amount\s*paid)\b/i.test(l) && !/change/i.test(l));
    const changeLine = lines.find((l)=>/\bchange\b/i.test(l));
    const cash = cashLine ? moneyOn(cashLine).pop() || 0 : 0;
    const change = changeLine ? moneyOn(changeLine).pop() || 0 : 0;
    const paid = cash && change >= 0 && cash - change > 0 ? Math.round((cash - change) * 100) / 100 : 0;
    // Items: lines above the total with a price and a readable name
    const items = [];
    const end = totalIdx >= 0 ? totalIdx : lines.length;
    for(let i = 0; i < end; i++){
        const l = lines[i];
        if (NOT_ITEM.test(l)) continue;
        const vals = moneyOn(l);
        if (!vals.length) continue;
        let name = cleanName(l);
        // Name sometimes sits on the line above ("COKE 1.5L" then "2 @ 45.00   90.00")
        if (!/[a-z]{2,}/i.test(name) && i > 0 && !moneyOn(lines[i - 1]).length && !NOT_ITEM.test(lines[i - 1])) name = cleanName(lines[i - 1]);
        if (!/[a-z]{2,}/i.test(name)) continue;
        const amount = vals[vals.length - 1];
        items.push({
            name: titleCase(name),
            amount,
            category: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(name)
        });
    }
    const itemsSum = Math.round(items.reduce((s, x)=>s + x.amount, 0) * 100) / 100;
    if (!total) total = paid || itemsSum;
    // When the item list disagrees with the total, the total line is the one to trust
    const near = (a, b)=>Math.abs(a - b) <= Math.max(1, b * 0.02);
    const check = total && near(itemsSum, total) ? 'items' : total && paid && near(paid, total) ? 'cash' : null;
    const confidence = check ? 'high' : total && totalIdx >= 0 ? 'medium' : 'low';
    // Overall category: store type first, else whichever category has the most money
    const byCat = {};
    items.forEach((it)=>{
        if (it.category !== 'other') byCat[it.category] = (byCat[it.category] || 0) + it.amount;
    });
    const topItemCat = Object.entries(byCat).sort((a, b)=>b[1] - a[1])[0]?.[0];
    const category = storeHit ? storeHit[2] : topItemCat || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(text);
    // Items without a clear category inherit the receipt's
    items.forEach((it)=>{
        if (it.category === 'other') it.category = category;
    });
    return {
        store,
        date: findDate(text, now),
        total: Math.round(total * 100) / 100,
        items,
        category,
        confidence,
        check
    };
}
}),
"[project]/app/api/parse-receipt/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/budget.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parseExpense.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseReceipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parseReceipt.ts [app-route] (ecmascript)");
;
;
;
;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const CAT_IDS = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CATS"].map((c)=>c.id);
// Every amount printed on the receipt, so the model can't invent one
const amountsIn = (text)=>new Set([
        ...text.matchAll(/(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?!\d)/g)
    ].map((m)=>parseFloat(m[1].replace(/,/g, '') + '.' + m[2])));
async function askOllama(text) {
    if (!OLLAMA_MODEL) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 45000);
    try {
        const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                stream: false,
                format: 'json',
                options: {
                    temperature: 0
                },
                messages: [
                    {
                        role: 'system',
                        content: 'You read OCR text from a Philippine store receipt (it may have OCR mistakes). ' + 'Return JSON: {"store":string,"total":number,"items":[{"name":string,"amount":number}]}. ' + 'total is the final amount paid (TOTAL / AMOUNT DUE), not cash or change. Copy numbers exactly as printed. ' + 'If you cannot find a total, use 0.'
                    },
                    {
                        role: 'user',
                        content: text.slice(0, 4000)
                    }
                ]
            })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return JSON.parse(data?.message?.content || 'null');
    } catch  {
        return null;
    } finally{
        clearTimeout(timer);
    }
}
async function POST(req) {
    try {
        const { text } = await req.json();
        if (!text || typeof text !== 'string') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'no text'
        }, {
            status: 400
        });
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseReceipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseReceiptText"])(text);
        if (parsed.total > 0 && parsed.confidence !== 'low') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...parsed,
            source: 'rules'
        });
        const ai = await askOllama(text);
        const printed = amountsIn(text);
        const aiTotal = Math.round(Number(ai?.total) * 100) / 100;
        if (ai && aiTotal > 0 && printed.has(aiTotal)) {
            const items = (Array.isArray(ai.items) ? ai.items : []).map((it)=>({
                    name: String(it?.name || '').slice(0, 32),
                    amount: Math.round(Number(it?.amount) * 100) / 100
                })).filter((it)=>it.name && printed.has(it.amount)).map((it)=>({
                    ...it,
                    category: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(it.name)
                }));
            const category = CAT_IDS.includes(parsed.category) ? parsed.category : 'other';
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ...parsed,
                store: parsed.store !== 'Receipt' ? parsed.store : String(ai.store || 'Receipt').slice(0, 32),
                total: aiTotal,
                items: items.length ? items.map((it)=>({
                        ...it,
                        category: it.category === 'other' ? category : it.category
                    })) : parsed.items,
                confidence: 'medium',
                check: null,
                source: 'ai'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...parsed,
            source: 'rules'
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'fail'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5c039636._.js.map