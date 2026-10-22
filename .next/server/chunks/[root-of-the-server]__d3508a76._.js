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
        if (s && Array.isArray(s.expenses) && s.start && s.end) return s;
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
"[project]/app/api/advice/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/budget.ts [app-route] (ecmascript)");
;
;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const CAT_TIPS = {
    food: 'Magbaon ng lunch 2-3x a week, o mag-share ng ulam sa tropa. Iwas milk tea araw-araw.',
    transpo: 'Sumabay sa classmates pauwi, maglakad kung malapit lang, at iwas Grab/Angkas kung may jeep.',
    school: 'Mag-photocopy na lang ng hiram na libro, i-print lang ang talagang kailangan, at bumili ng supplies nang maramihan.',
    load: 'Mag-piso WiFi o school WiFi, at pumili ng mas mahabang promo kaysa daily na load.',
    gala: 'Mag-set ng gala budget per week, at hanapin ang libreng gala tulad ng park o tambay sa bahay.',
    other: 'I-review ang "Others" mo. Baka may maliliit na gastos na pwedeng iwasan.'
};
function summarize(state) {
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compute"])(state);
    const cats = c.byCat.map((x)=>`${x.label} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(x.sum)} (${Math.round(x.sum / Math.max(1, c.spent) * 100)}%)`).join(', ');
    return {
        c,
        text: [
            `Allowance: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(state.budget)} from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.start)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shortDate"])(state.end)} (${c.total} days).`,
            `Day ${c.elapsed} of ${c.total}, ${c.left} days left.`,
            `Spent: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.spent)} (${Math.round(c.pct)}%). Remaining: ${c.remaining < 0 ? '-' : ''}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)}.`,
            `Average spend per day: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.avgPerDay)}. Safe spend per day from now: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)}.`,
            `By category: ${cats || 'none yet'}.`
        ].join('\n')
    };
}
async function askOllama(context, history, message) {
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
                messages: [
                    {
                        role: 'system',
                        content: 'You are Tats, a friendly budget buddy for a Filipino college student. Reply in casual Taglish, ' + 'short (2-5 sentences or a few bullet points), practical, and grounded in the numbers below. ' + 'Use ₱ for money. Answer the question directly first. Never invent expenses or numbers that are not listed.\n\nStudent budget data:\n' + context
                    },
                    ...history.slice(-8).map((m)=>({
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
function ruleReply(state, message) {
    const { c } = summarize(state);
    const m = message.toLowerCase();
    const top = c.byCat[0];
    const amount = Number((m.match(/\d+(\.\d+)?/) || [])[0]) || 0;
    if (amount > 0 && /(bili|bilhin|buy|afford|kaya|gastos ng|worth)/.test(m)) {
        const after = c.remaining - amount;
        const perDayAfter = after > 0 && c.left > 0 ? after / c.left : 0;
        if (after < 0) return `Hindi kaya ngayon. Kulang ka ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["peso"])(-after)}. Hintayin muna ang next allowance o mag-ipon nang paunti-unti.`;
        return `Kung bibilhin mo yan (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["peso"])(amount)}), matitira ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["peso"])(after)}. Bababa ang safe gastos mo from ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)} to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDayAfter)} per day. ${perDayAfter < c.avgPerDay * 0.7 ? 'Medyo hihigpit, pag-isipan muna.' : 'Kaya pa naman!'}`;
    }
    if (/(ipon|save|savings|tipid|matira)/.test(m)) {
        const target = Math.max(0, Math.round(c.remaining * 0.2));
        const perDay = c.left > 0 ? (c.remaining - target) / c.left : 0;
        return `Try mo mag-target ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(target)} ipon (20% ng natitira). Para makuha yan, gastos ka lang ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(perDay)}/day.${top ? ` Pinakamadaling bawasan: ${top.label}. ${CAT_TIPS[top.id]}` : ''}`;
    }
    if (/(saan|where|category|pinakamalaki|top|breakdown)/.test(m)) {
        if (!c.byCat.length) return 'Wala ka pang gastos this period, kaya wala pang breakdown.';
        return 'Breakdown ng gastos mo:\n' + c.byCat.map((x)=>`• ${x.label}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(x.sum)} (${Math.round(x.sum / c.spent * 100)}%)`).join('\n');
    }
    for (const [id, tip] of Object.entries(CAT_TIPS)){
        const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(id).label.toLowerCase();
        if (m.includes(id) || m.includes(label.split(' ')[0])) return `Tips para sa ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catById"])(id).label}: ${tip}`;
    }
    if (/(tip|bawas|cut|paano|how|advice|payo)/.test(m)) {
        if (!top) return 'Wala pang data. Mag-log ka muna ng ilang gastos para makapagbigay ako ng specific na tips.';
        return `Pinakamalaki mong gastos ay ${top.label} (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum)}). ${CAT_TIPS[top.id]} Kung mabawasan mo ito ng 30%, makakatipid ka ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(top.sum * 0.3)}.`;
    }
    return `${c.st.title}. Nagastos ka na ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.spent)} (${Math.round(c.pct)}%) at ${c.remaining < 0 ? `lampas ka ng ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(-c.remaining)}` : `may ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.remaining)} pa for ${c.left} days`}. Safe gastos: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$budget$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pesoR"])(c.perDay)}/day.${top ? ` Bantayan ang ${top.label}.` : ''}`;
}
async function POST(req) {
    try {
        const { state, history = [], message } = await req.json();
        if (!message || !state) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'missing input'
        }, {
            status: 400
        });
        const { text } = summarize(state);
        const fallback = ruleReply(state, message);
        // The rule-based answer gives the model correct math to build on
        const ai = await askOllama(`${text}

Computed analysis for this question (numbers are correct, reuse them):
${fallback}`, history, message);
        if (ai) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: ai,
            source: 'ai'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: fallback,
            source: 'rules'
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reply: 'May error, try mo ulit mamaya.',
            source: 'rules'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d3508a76._.js.map