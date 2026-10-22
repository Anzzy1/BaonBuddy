module.exports = [
"[project]/.next-internal/server/app/api/advice/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/lib/advisor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Buddy's offline brain: figures out what the student is asking and answers with exact numbers.
// Pure functions only, so the API route and the browser (when the server is unreachable) share it.
__turbopack_context__.s([
    "CAT_TIPS",
    ()=>CAT_TIPS,
    "EXACT_INTENTS",
    ()=>EXACT_INTENTS,
    "budgetSummary",
    ()=>budgetSummary,
    "classify",
    ()=>classify,
    "ruleReply",
    ()=>ruleReply
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/budget.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parseExpense.ts [app-route] (ecmascript)");
;
;
const EXACT_INTENTS = new Set([
    'greet',
    'thanks',
    'off_topic',
    'afford',
    'save_goal',
    'days_left',
    'spend_today',
    'category_spend',
    'spent_total',
    'remaining',
    'breakdown',
    'why_high',
    'status',
    'event'
]);
const CAT_TIPS = {
    food: {
        en: 'Pack lunch 2-3 times a week, share viands with friends, and skip the daily milk tea.',
        tl: 'Magbaon ng lunch 2-3x a week, mag-share ng ulam sa tropa, at iwas muna sa daily milk tea.'
    },
    transpo: {
        en: 'Ride home with classmates, walk short distances, and take the jeep instead of Grab/Angkas when you can.',
        tl: 'Sumabay sa classmates pauwi, maglakad kung malapit lang, at jeep muna imbes na Grab o Angkas.'
    },
    school: {
        en: 'Photocopy borrowed books, print only what you really need, and buy supplies in bulk.',
        tl: 'Mag-photocopy na lang ng hiram na libro, i-print lang ang kailangan, at bumili ng supplies nang maramihan.'
    },
    load: {
        en: 'Use school or piso WiFi, and pick longer promos instead of daily load.',
        tl: 'Gamitin ang school WiFi o piso WiFi, at kumuha ng mas mahabang promo imbes na daily load.'
    },
    gala: {
        en: 'Set a weekly gala budget and look for free hangouts like parks or movie nights at home.',
        tl: 'Mag-set ng gala budget per week, at subukan ang libreng tambayan tulad ng park o movie night sa bahay.'
    },
    other: {
        en: 'Review your "Others" entries. Small leaks add up fast.',
        tl: 'I-check ang "Others" mo. Ang maliliit na gastos, mabilis lumaki pag pinagsama.'
    }
};
const pick = (arr)=>arr[Math.floor(Math.random() * arr.length)];
const has = (m, re)=>re.test(m);
const MONEY = /\b(budget|baon|allowance|pera|money|peso|pesos|piso|gastos|gastusin|gumastos|nagastos|ginastos|spend|spent|spending|expense|expenses|ipon|save|saving|savings|tipid|afford|bili|bilhin|bumili|buy|bayad|cost|presyo|price|natitira|remaining|balance|left)\b|₱/;
const OFF_TOPIC = /\b(homework|assignment|math|algebra|calculus|capital of|president|weather|panahon ngayon|recipe|lyrics|essay|thesis|code|coding|program|python|javascript|translate|joke|biro|movie recommendation|song|who is|sino si|history of|science|physics|chemistry|biology|crush|jowa|love life)\b/;
function amountIn(message) {
    // Ignore numbers that describe time or percent, e.g. "3 days left" or "20%"
    const cleaned = message.replace(/\b\d+\s*(days?|araw|weeks?|linggo|months?|buwan|hours?|oras|mins?|minutes?|%|percent)\b/gi, ' ');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractAmount"])(cleaned);
}
function classify(message, history = []) {
    const m = message.toLowerCase().trim();
    const words = m.split(/\s+/).filter(Boolean);
    const amount = amountIn(m);
    const catRaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(m);
    const cat = catRaw !== 'other' || /\b(others?|misc)\b/.test(m) ? catRaw : '';
    const money = has(m, MONEY) || amount > 0 || !!cat;
    const r = (intent)=>({
            intent,
            amount,
            cat
        });
    if (words.length <= 5 && !amount && has(m, /\b(salamat|thank|thanks|thank you|ty|tnx|thx|tysm|arigato)\b/)) return r('thanks');
    if (words.length <= 4 && !money && has(m, /^(hi+|hello|hey|yo|uy|kumusta|kamusta|musta|good (morning|afternoon|evening)|magandang (umaga|hapon|gabi)|sup|hoy)\b/)) return r('greet');
    if (has(m, OFF_TOPIC) && !money) return r('off_topic');
    if (amount > 0 && has(m, /\b(ipon|mag-?ipon|save|saving|savings|itabi|matira|maitabi|target|goal)\b/)) return r('save_goal');
    if (amount > 0 && has(m, /\b(bili|bilhin|bumili|mabili|buy|afford|kaya|kakayanin|pwede|puwede|purchase|get|worth|order|mag-?order|bayaran|gastusin|treat|sulit)\b/)) return r('afford');
    if (has(m, /(ilang araw|how many days|kailan (matatapos|ang end)|bago matapos|when does (my|the) (period|budget) end|matatapos ba)/)) return r('days_left');
    if (has(m, /(today|ngayon|ngayong araw|per day|a day|daily|araw-araw|kada araw)/) && has(m, /(spend|gastos|gastusin|gumastos|budget|pwede|puwede|can i|how much|magkano|safe)/)) return r('spend_today');
    if (has(m, /(how much (did|have) i|magkano (na )?(ang |yung |ung )?(nagastos|ginastos|gastos)|nagastos ko|ginastos ko|total (spent|gastos)|spent so far|spent on|gastos ko sa|gastos sa)/)) {
        return r(cat ? 'category_spend' : 'spent_total');
    }
    if (cat && has(m, /(how much|magkano)/)) return r('category_spend');
    if (has(m, /(natitira|natira|matitira|remaining|balance|how much (do i have|is left|left|money)|pera ko|money left|left in my)/)) return r('remaining');
    if (has(m, /(bakit|why)/) && has(m, /(laki|malaki|high|much|mabilis|fast|ubos|naubos|kulang|short)/)) return r('why_high');
    if (has(m, /(saan|where|categor|breakdown|napupunta|going|pinakamalaki|biggest|top spend|most)/)) return r('breakdown');
    const asking = has(m, /(should i|dapat ba|pwede ba|puwede ba|okay lang ba|ok lang ba|g ba|sasama ba|pupunta ba|can i)/);
    const outing = has(m, /\b(go|join|attend|sumama|sasama|sama|pumunta|pupunta|gala|lakad|event|party|concert|outing|hangout|swimming|beach|movie|sine|samgyup|inuman|night out|trip|date)\b/) || cat === 'gala';
    if (asking && outing && !amount) return r('event');
    if (cat) return r('category_tips');
    if (has(m, /(ipon|mag-?ipon|save|saving|savings|tipid|makatipid|magtipid|matira)/)) return r('save_tips');
    if (has(m, /(tip|bawas|bawasan|cut|reduce|paano|how can|how do|advice|payo|help|what should i do|ano(ng)? gagawin|ano dapat|suggest)/)) return r('cut_tips');
    if (has(m, /(budget|how am i|how's|hows|kumusta|kamusta|okay pa|ok pa|on track|doing|lagay|status|update)/)) return r('status');
    // Follow-ups like "eh kung 500 lang?" reuse what the previous question was about
    if (amount > 0) {
        const lastUser = [
            ...history
        ].reverse().find((h)=>h.role === 'user');
        if (lastUser) {
            const prev = classify(lastUser.text).intent;
            if (prev === 'afford' || prev === 'save_goal') return r(prev);
        }
        return r('afford');
    }
    return r(money ? 'status' : 'unknown');
}
function ruleReply(state, message, history = [], forceLang) {
    const lang = forceLang || (/\b(kumusta|kamusta|musta|salamat|magandang)\b/i.test(message) ? 'tl' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parseExpense$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectLang"])(message));
    const { intent, amount, cat } = classify(message, history);
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compute"])(state);
    const t = (en, tl)=>lang === 'tl' ? tl : en;
    const top = c.byCat[0];
    const days = (n)=>`${n} day${n === 1 ? '' : 's'}`;
    const over = c.remaining < 0;
    const leftLine = over ? t(`You're ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(-c.remaining)} over budget.`, `Lampas ka na ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(-c.remaining)}.`) : t(`You have ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)} left for ${days(c.left)}, so about ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} a day.`, `May ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)} ka pa for ${days(c.left)}, kaya mga ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} a day.`);
    let reply;
    switch(intent){
        case 'greet':
            reply = t(`Hi! Buddy here. Quick update: ${leftLine} What do you want to know?`, `Hi! Si Buddy 'to. Quick update: ${leftLine} Ano gusto mong malaman?`);
            break;
        case 'thanks':
            reply = pick([
                t("Anytime! I'm here whenever you need a budget check.", 'Walang anuman! Nandito lang ako pag kailangan mo ng budget check.'),
                t("You got it! Keep logging and I'll keep an eye on things.", 'Sige lang! Tuloy mo lang mag-log, ako na bahala magbantay.')
            ]);
            break;
        case 'off_topic':
            reply = t(`Haha, I'm just your budget buddy, so I can't really help with that. But if it's about your baon, I'm all in! Try "Can I afford a ₱150 milk tea?" or "How much can I spend today?"`, `Haha, budget buddy lang ako kaya hindi ko 'yan masasagot nang maayos. Pero kung tungkol sa baon mo, game ako! Try mo: "Kaya ko ba bumili ng ₱150 na milk tea?" o "Magkano pwede ko gastusin today?"`);
            break;
        case 'afford':
            {
                const after = c.remaining - amount;
                const perDayAfter = after > 0 && c.left > 0 ? after / c.left : 0;
                const share = c.remaining > 0 ? amount / c.remaining : 1;
                if (after < 0) {
                    reply = t(`Not right now. ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)} is more than what you have left (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, c.remaining))}), so you'd be short by ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(-after)}. Better wait for your next allowance.`, `Hindi pa kaya ngayon. Mas malaki ang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)} sa natitira mo (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, c.remaining))}), kulang ka ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(-after)}. Hintayin muna natin ang next allowance.`);
                } else if (perDayAfter < c.perDay * 0.6 || share > 0.4) {
                    reply = t(`You can, but it'll be tight. After ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, you'll have ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(after)} left and your safe spend drops from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDayAfter)} a day. If it can wait, maybe hold off.`, `Kaya, pero hihigpit tayo. Pag binili mo ang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(after)} na lang ang matitira at bababa ang safe gastos mo from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDayAfter)} a day. Kung pwede pang ipagpaliban, mas okay.`);
                } else {
                    reply = t(`Yes, you can! After ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, you'll still have ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(after)} left, and your safe spend goes from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDayAfter)} a day. Go for it.`, `Oo, kaya! Pag binili mo ang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, may ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(after)} ka pa, at ang safe gastos mo ay from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDayAfter)} a day. Go lang!`);
                }
                break;
            }
        case 'save_goal':
            {
                const spendable = c.remaining - amount;
                const perDay = c.left > 0 ? spendable / c.left : 0;
                if (over || spendable < 0) {
                    reply = t(`Saving ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)} won't fit this period, since you only have ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, c.remaining))} left. Try a smaller target like ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, Math.round(c.remaining * 0.2)))}, or aim for it next allowance.`, `Hindi kakasya ang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)} na ipon this period, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, c.remaining))} na lang kasi natitira. Try muna ng mas maliit, mga ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(Math.max(0, Math.round(c.remaining * 0.2)))}, o sa next allowance na lang.`);
                } else {
                    reply = t(`To save ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, keep your spending to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDay)} a day for the next ${days(c.left)} (you're averaging ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} now).${top ? ` Easiest place to cut: ${top.label}.` : ''}`, `Para makaipon ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(amount)}, gastos ka lang ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDay)} a day sa susunod na ${days(c.left)} (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} a day ang average mo ngayon).${top ? ` Pinakamadaling bawasan: ${top.label}.` : ''}`);
                }
                break;
            }
        case 'days_left':
            reply = c.left > 0 ? t(`${days(c.left)} left, until ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)}. ${over ? leftLine : `That's ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} a day if you want your ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)} to last.`}`, `${days(c.left)} pa, hanggang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)}. ${over ? leftLine : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} a day para umabot ang ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)} mo.`}`) : t(`Your period already ended on ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)}. Set a new one in settings when your next allowance comes in.`, `Tapos na ang period mo noong ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)}. Mag-set ka ng bago sa settings pag dumating na ang next allowance.`);
            break;
        case 'spend_today':
            {
                const td = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["today"])();
                const todaySpent = c.inPeriod.filter((e)=>e.date === td).reduce((s, e)=>s + e.amount, 0);
                const forToday = c.left > 0 ? Math.max(0, c.remaining + todaySpent) / c.left : 0;
                const leftToday = forToday - todaySpent;
                if (over || c.left === 0) reply = t(`Honestly, nothing extra today. ${leftLine} Essentials only for now.`, `Sa totoo lang, wala munang extra today. ${leftLine} Essentials lang muna.`);
                else if (todaySpent === 0) reply = t(`You can spend about ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)} today and still be on track.`, `Pwede kang gumastos ng mga ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)} today at on track ka pa rin.`);
                else if (leftToday > 0) reply = t(`Your budget for today is about ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)}. You've spent ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(todaySpent)}, so ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(leftToday)} more is still okay.`, `Mga ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)} ang budget mo today. Nakagastos ka na ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(todaySpent)}, kaya may ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(leftToday)} ka pang pwedeng gastusin.`);
                else reply = t(`You've already spent ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(todaySpent)} today, which is past your ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)} for the day. Best to stop here and let tomorrow balance it out.`, `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(todaySpent)} na ang nagastos mo today, lampas na sa ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(forToday)} na budget for the day. Stop muna tayo dito, bawi bukas.`);
                break;
            }
        case 'category_spend':
            {
                const row = c.byCat.find((x)=>x.id === cat);
                const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(cat).label;
                if (!row) reply = t(`You haven't spent anything on ${label} this period. Nice!`, `Wala ka pang gastos sa ${label} this period. Nice!`);
                else {
                    const n = c.inPeriod.filter((e)=>e.cat === cat).length;
                    const share = Math.round(row.sum / Math.max(1, c.spent) * 100);
                    reply = t(`You've spent ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(row.sum)} on ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), which is ${share}% of your spending.${share >= 40 ? ` That's your big one. ${CAT_TIPS[cat].en}` : ''}`, `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(row.sum)} na ang nagastos mo sa ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), ${share}% ng total gastos mo.${share >= 40 ? ` 'Yan ang pinakamalaki. ${CAT_TIPS[cat].tl}` : ''}`);
                }
                break;
            }
        case 'spent_total':
            reply = t(`You've spent ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.spent)} so far, ${Math.round(c.pct)}% of your ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(state.budget)} allowance. ${leftLine}`, `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.spent)} na ang nagastos mo, ${Math.round(c.pct)}% ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(state.budget)} na allowance mo. ${leftLine}`);
            break;
        case 'remaining':
            reply = leftLine + (over ? t(' Essentials only until your next allowance.', ' Essentials muna hanggang next allowance.') : '');
            break;
        case 'breakdown':
            reply = !c.byCat.length ? t('No spending this period yet, so there is nothing to break down.', 'Wala ka pang gastos this period, kaya wala pang breakdown.') : t('Here is where your money goes:\n', 'Dito napupunta ang pera mo:\n') + c.byCat.map((x)=>`• ${x.label}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(x.sum)} (${Math.round(x.sum / c.spent * 100)}%)`).join('\n');
            break;
        case 'why_high':
            {
                if (!top) {
                    reply = t("You haven't spent anything yet this period, so you're good!", 'Wala ka pang gastos this period, kaya okay ka pa!');
                    break;
                }
                const ideal = state.budget / c.total;
                const biggest = [
                    ...c.inPeriod
                ].sort((a, b)=>b.amount - a.amount)[0];
                const share = Math.round(top.sum / c.spent * 100);
                if (c.avgPerDay <= ideal && !over) {
                    reply = t(`Good news: you're actually doing fine. You average ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} a day, below the ideal ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(ideal)}. ${top.label} is your biggest at ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)} (${share}%), so that's the one to watch.`, `Good news: okay ka pa actually. ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} a day ang average mo, mas mababa sa ideal na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(ideal)}. Pinakamalaki ang ${top.label} sa ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)} (${share}%), kaya 'yan ang bantayan natin.`);
                    break;
                }
                reply = t(`Mostly ${top.label}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)}, or ${share}% of your spending. You're averaging ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} a day versus an ideal ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(ideal)}.${biggest ? ` Your biggest single expense was ${biggest.note || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(biggest.cat).label} at ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(biggest.amount)}.` : ''} ${CAT_TIPS[top.id].en}`, `Kadalasan sa ${top.label}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)}, ${share}% ng gastos mo. ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)} a day ang average mo, pero ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(ideal)} ang ideal.${biggest ? ` Pinakamalaking isang gastos mo: ${biggest.note || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(biggest.cat).label}, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(biggest.amount)}.` : ''} ${CAT_TIPS[top.id].tl}`);
                break;
            }
        case 'event':
            {
                const cap = Math.round(Math.min(c.remaining * 0.25, c.perDay * 2));
                reply = over || cap <= 0 ? t(`I'd skip this one for now. ${leftLine} Maybe suggest a free hangout instead?`, `Pass muna siguro tayo dito. ${leftLine} Baka pwede kayong mag-libreng tambay na lang?`) : t(`You can go, just set a limit. Try to keep it under ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(cap)}, about two days of your safe budget, so the rest of the period stays okay. ${leftLine}`, `Pwede ka sumama, basta may limit. Try mong i-cap sa ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(cap)}, mga dalawang araw ng safe budget mo, para okay pa rin ang natitirang araw. ${leftLine}`);
                break;
            }
        case 'save_tips':
            {
                const target = Math.max(0, Math.round(c.remaining * 0.2));
                const perDay = c.left > 0 ? (c.remaining - target) / c.left : 0;
                reply = over ? t(`First let's get back on track: ${leftLine} Once your next allowance comes, set aside 10-20% right away before spending.`, `Balik muna tayo sa track: ${leftLine} Pag dumating ang next allowance, itabi agad ang 10-20% bago gumastos.`) : t(`Try saving ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(target)}, that's 20% of what's left. To get there, keep spending to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDay)} a day.${top ? ` Easiest to cut: ${top.label}. ${CAT_TIPS[top.id].en}` : ''}`, `Try mong mag-target ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(target)} na ipon, 20% ng natitira. Para makuha 'yan, gastos ka lang ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDay)} a day.${top ? ` Pinakamadaling bawasan: ${top.label}. ${CAT_TIPS[top.id].tl}` : ''}`);
                break;
            }
        case 'category_tips':
            {
                const row = c.byCat.find((x)=>x.id === cat);
                reply = t(`For ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(cat).label}${row ? ` (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(row.sum)} so far)` : ''}: ${CAT_TIPS[cat].en}`, `Para sa ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(cat).label}${row ? ` (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(row.sum)} na so far)` : ''}: ${CAT_TIPS[cat].tl}`);
                break;
            }
        case 'cut_tips':
            reply = !top ? t('No data yet. Log a few expenses first so I can give you tips that fit you.', 'Wala pang data. Mag-log ka muna ng ilang gastos para personalized ang tips ko.') : t(`Your biggest spending is ${top.label} at ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)}. ${CAT_TIPS[top.id].en} Cutting it by 30% saves you ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum * 0.3)}.`, `Pinakamalaki mong gastos ay ${top.label}, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)}. ${CAT_TIPS[top.id].tl} Pag nabawasan mo ito ng 30%, makakatipid ka ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum * 0.3)}.`);
            break;
        case 'status':
            reply = t(`You've used ${Math.round(c.pct)}% of your allowance with ${Math.round(c.timePct)}% of the period done. ${leftLine}${top ? ` Keep an eye on ${top.label}.` : ''}`, `${c.st.title}${/[.!?]$/.test(c.st.title) ? '' : '.'} ${Math.round(c.pct)}% na ang nagamit mo, ${Math.round(c.timePct)}% ng period ang lumipas. ${leftLine}${top ? ` Bantayan natin ang ${top.label}.` : ''}`);
            break;
        default:
            reply = t(`Hmm, I'm not sure I got that. I can help with things like "Can I afford ₱300 shoes?", "How much can I spend today?", or "Where does my money go?" Quick update: ${leftLine}`, `Hmm, parang hindi ko na-gets. Kaya kong sagutin ang mga tulad ng "Kaya ko ba ang ₱300 na sapatos?", "Magkano pwede ko gastusin today?", o "Saan napupunta pera ko?" Quick update: ${leftLine}`);
    }
    return {
        reply,
        intent,
        lang
    };
}
function budgetSummary(state) {
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compute"])(state);
    const cats = c.byCat.map((x)=>`${x.label} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(x.sum)} (${Math.round(x.sum / Math.max(1, c.spent) * 100)}%)`).join(', ');
    return [
        `Allowance: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(state.budget)} from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.start)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)} (${c.total} days).`,
        `Day ${c.elapsed} of ${c.total}, ${c.left} days left.`,
        `Spent: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.spent)} (${Math.round(c.pct)}%). Remaining: ${c.remaining < 0 ? '-' : ''}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)}.`,
        `Average spend per day: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)}. Safe spend per day from now: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)}.`,
        `By category: ${cats || 'none yet'}.`,
        `Categories that exist: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CATS"].map((x)=>x.label).join(', ')}.`
    ].join('\n');
}
}),
"[project]/app/api/advice/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advisor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/advisor.ts [app-route] (ecmascript)");
;
;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
// Few-shot examples teach the small model Buddy's tone, length and focus
const EXAMPLES = `Examples of good replies:
Student: should I join my friends for samgyup this weekend?
Buddy: You can go, just set a limit. Keep it under ₱400 so the rest of the week stays okay. Maybe skip one milk tea run to make up for it.
Student: any tips para makatipid sa transpo?
Buddy: Sumabay sa classmates pauwi, at jeep muna imbes na Grab. Kung malapit lang, lakad na lang. Maliit pero malaking tulong pag pinagsama.
Student: what's the weather tomorrow?
Buddy: Haha, budget buddy lang ako, so I can't help with that. But if it's about your baon, I'm all in!`;
async function askOllama(summary, analysis, history, message, lang) {
    if (!OLLAMA_MODEL) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 30000);
    const langRule = lang === 'tl' ? 'Reply in simple, casual Taglish: mostly short English sentences mixed with everyday Filipino words (ka, mo, na, lang, pa, tayo, kaya, sige). Never use deep or formal Tagalog words.' : 'Reply in clear, friendly English only. Do not use Tagalog.';
    const system = [
        "You are Buddy, a Filipino college student's friend who helps them handle their baon (allowance). Warm, casual, encouraging, like a kaibigan, never preachy.",
        langRule,
        'Rules:',
        '- Only talk about this student\'s allowance, spending, saving and money habits. If the question is about anything else, say in one sentence that you can only help with their budget.',
        '- Answer the question directly in the first sentence.',
        '- 2 to 4 short sentences. No headings, no lists unless asked.',
        '- Only use peso amounts that appear in the data or analysis below. Do not do new math and never invent expenses.',
        '',
        EXAMPLES,
        '',
        'Student budget data:',
        summary,
        '',
        'Correct analysis for this question (reuse these numbers):',
        analysis
    ].join('\n');
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
                options: {
                    temperature: 0.3,
                    num_predict: 180
                },
                messages: [
                    {
                        role: 'system',
                        content: system
                    },
                    ...history.slice(-6).map((m)=>({
                            role: m.role,
                            content: m.text
                        })),
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.message?.content?.trim() || null;
    } catch  {
        return null;
    } finally{
        clearTimeout(timer);
    }
}
// Reject AI replies that mention peso amounts not found in the grounding text
const amounts = (s)=>(s.match(/₱\s?[\d,]+(\.\d+)?/g) || []).map((x)=>Math.round(parseFloat(x.replace(/[₱,\s]/g, ''))));
function grounded(reply, source) {
    const known = new Set(amounts(source));
    return reply.length >= 15 && amounts(reply).every((n)=>known.has(n));
}
async function POST(req) {
    try {
        const { state, history = [], message } = await req.json();
        if (!message || !state) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'missing input'
        }, {
            status: 400
        });
        const { reply: fallback, intent, lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advisor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ruleReply"])(state, message, history);
        // Exact questions (math, greetings, off-topic) and Tagalog answers stay rule-based:
        // they are instant, always correct, and the small local model's Tagalog is unreliable
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advisor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EXACT_INTENTS"].has(intent) || lang === 'tl') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                reply: fallback,
                source: 'rules',
                lang,
                intent
            });
        }
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$advisor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["budgetSummary"])(state);
        const ai = await askOllama(summary, fallback, history, message, lang);
        if (ai && grounded(ai, `${summary}\n${fallback}`)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: ai,
            source: 'ai',
            lang,
            intent
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: fallback,
            source: 'rules',
            lang,
            intent
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: 'Oops, something went wrong on my side. Try asking again?',
            source: 'rules',
            lang: 'en'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__827bceb1._.js.map