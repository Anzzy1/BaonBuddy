module.exports = [
"[project]/.next-internal/server/app/api/parse-expense/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
        color: '#FF6B5E',
        grad: 'linear-gradient(135deg, #FF9A3D, #FF4D8D)'
    },
    {
        id: 'transpo',
        label: 'Transpo',
        icon: 'bus',
        color: '#34A3FF',
        grad: 'linear-gradient(135deg, #2FD3FF, #3A6BFF)'
    },
    {
        id: 'school',
        label: 'School Supplies',
        icon: 'pencil-ruler',
        color: '#7C55FA',
        grad: 'linear-gradient(135deg, #B07BFF, #5B3DF5)'
    },
    {
        id: 'load',
        label: 'Load & Data',
        icon: 'smartphone',
        color: '#1FC2A9',
        grad: 'linear-gradient(135deg, #3BE6A4, #0E9FB5)'
    },
    {
        id: 'gala',
        label: 'Gala',
        icon: 'party-popper',
        color: '#E14AD6',
        grad: 'linear-gradient(135deg, #FF72D2, #B522E0)'
    },
    {
        id: 'other',
        label: 'Others',
        icon: 'shapes',
        color: '#FFA41F',
        grad: 'linear-gradient(135deg, #FFD23D, #FF8A00)'
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
    // Status reacts to both how much is used (pct) and how fast vs. time (pace = pct - timePct)
    const p = Math.round(pct);
    const tp = Math.round(timePct);
    const pace = pct - timePct;
    const days = `${left} day${left === 1 ? '' : 's'}`;
    let st;
    if (pct > 100) st = {
        color: '#E5484D',
        chip: 'Lagpas na',
        title: 'Over budget ka na',
        msg: `${p}% na ng allowance ang nagastos mo, lampas ka ng ${peso(-remaining)}. Tiis muna ha, darating din next allowance.`
    };
    else if (pct >= 95) st = {
        color: '#E5484D',
        chip: 'Halos ubos',
        title: 'Halos ubos na',
        msg: `${p}% na ang nagamit, ${peso(remaining)} na lang for ${days}. Bawal na muna ang hindi kailangan.`
    };
    else if (pct >= 85) st = {
        color: '#EA580C',
        chip: 'Ingat',
        title: 'Malapit na sa limit',
        msg: `${p}% na ang nagamit. ${peso(remaining)} na lang yan for ${days}. Essentials muna, okay lang yan.`
    };
    else if (left === 0) st = {
        color: '#16A34A',
        chip: 'Nakaabot',
        title: 'Nakaabot ka!',
        msg: `Tapos na period at ${p}% lang ang nagastos mo. May ${peso(remaining)} kang natira. Nice.`
    };
    else if (pace > 25) st = {
        color: '#EA580C',
        chip: 'Sobrang bilis',
        title: 'Sobrang bilis ng gastos',
        msg: `${p}% na ang nagastos pero ${tp}% pa lang ng panahon ang lumipas. Kung ganito tuloy, mauubos bago matapos ang period. Max ${pesoR(perDay)} per day muna.`
    };
    else if (pace > 10) st = {
        color: '#D97706',
        chip: 'Medyo mabilis',
        title: 'Medyo mabilis ang gastos',
        msg: `Nagastos ka na ng ${p}%, pero ${tp}% lang ng panahon ang lumipas. Bawasan mo ha, ${pesoR(perDay)} per day para umabot.`
    };
    else if (pct >= 70) st = {
        color: '#CA8A04',
        chip: 'Bantayan',
        title: 'Bantayan na',
        msg: `${p}% na ang nagamit at sakto pa sa oras, pero kaunti na lang ang cushion. Stick sa ${pesoR(perDay)} per day.`
    };
    else if (pct >= 50) st = {
        color: '#65A30D',
        chip: 'Kalahati na',
        title: 'Kalahati na',
        msg: `${p}% na ang nagastos, ${tp}% ng panahon ang lumipas. Sakto ang pace mo, ituloy lang sa ${pesoR(perDay)} per day.`
    };
    else if (pace < -15 && elapsed > 1) st = {
        color: '#16A34A',
        chip: 'Ang tipid',
        title: 'Ang tipid mo!',
        msg: `${p}% pa lang ang nagastos pero ${tp}% na ng panahon ang lumipas. Pwede ka mag-treat minsan, o itabi ang sobra.`
    };
    else if (pct > 0) st = {
        color: '#16A34A',
        chip: 'Sakto pa',
        title: 'Chill ka pa',
        msg: `${p}% pa lang ang nagamit. Okay lang pace mo, subukan mong bumaba sa ${pesoR(perDay)} per day para safe ka.`
    };
    else st = {
        color: '#16A34A',
        chip: 'Fresh start',
        title: 'Buo pa ang baon',
        msg: `Wala ka pang gastos ngayong period. ${pesoR(perDay)} per day ang safe mong budget.`
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
"[project]/app/api/parse-expense/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/budget.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parseExpense.ts [app-route] (ecmascript)");
;
;
;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const CAT_IDS = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CATS"].map((c)=>c.id);
// Last resort for phrasing the rules miss: ask the local model for structured JSON
async function askOllama(message) {
    if (!OLLAMA_MODEL) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 30000);
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
                        content: 'Extract expenses from a Filipino student\'s message (English, Tagalog or Taglish). ' + 'Return JSON: {"items":[{"amount":number,"category":"food|transpo|school|load|gala|other","note":"short item name","daysAgo":number}]}. ' + 'amount is the total in pesos for that item (multiply quantity by price each). daysAgo is 0 for today, 1 for yesterday/kahapon. ' + 'If no money amount is stated, return {"items":[]}. Never guess an amount.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const parsed = JSON.parse(data?.message?.content || '{}');
        const items = (Array.isArray(parsed.items) ? parsed.items : []).map((x)=>({
                amount: Math.round(Number(x.amount) * 100) / 100,
                category: CAT_IDS.includes(String(x.category)) ? String(x.category) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(String(x.note || message)),
                note: String(x.note || '').slice(0, 40),
                daysAgo: Math.min(60, Math.max(0, Math.round(Number(x.daysAgo) || 0)))
            })).filter((x)=>x.amount > 0 && x.amount < 1_000_000);
        return items.length ? items : null;
    } catch  {
        return null;
    } finally{
        clearTimeout(timer);
    }
}
// Also send the first item as flat fields, so a browser tab still running older code
// (which read data.amount) logs the right number instead of NaN
function withLegacy(res) {
    const first = res.items[0];
    return {
        ...res,
        amount: first.amount,
        category: first.category,
        note: first.note
    };
}
async function POST(req) {
    try {
        const { message } = await req.json();
        if (!message || typeof message !== 'string') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'no message'
            }, {
                status: 400
            });
        }
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseExpenseMessage"])(message.slice(0, 300));
        if (result.action === 'add') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(withLegacy({
            ...result,
            source: 'rules'
        }));
        if (result.action !== 'none') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...result,
            source: 'rules'
        });
        // Only ask the model when there is some number to find, so it can't invent one
        if (result.hasNumber) {
            const items = await askOllama(message.slice(0, 300));
            if (items) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(withLegacy({
                action: 'add',
                items,
                lang: result.lang,
                source: 'ai'
            }));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            action: 'none',
            lang: result.lang
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            action: 'none',
            lang: 'en',
            error: 'fail'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4674c5cd._.js.map