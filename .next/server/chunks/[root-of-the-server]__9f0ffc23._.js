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
"[project]/app/api/parse-expense/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const NUM_WORDS = {
    isa: 1,
    isang: 1,
    dalawa: 2,
    dalawang: 2,
    tatlo: 3,
    tatlong: 3,
    apat: 4,
    apatna: 4,
    lima: 5,
    limang: 5,
    anim: 6,
    animna: 6,
    pito: 7,
    pitong: 7,
    walo: 8,
    walong: 8,
    siyam: 9,
    siyamna: 9,
    sampu: 10,
    sampung: 10,
    labing: 11,
    dose: 12,
    labindalawa: 12
};
const CAT_KEYWORDS = {
    food: [
        'kain',
        'food',
        'biskwit',
        'biscuit',
        'siomai',
        'rice',
        'kanin',
        'lunch',
        'dinner',
        'breakfast',
        'merienda',
        'canteen',
        'karinderya',
        'milk',
        'tea',
        'kape',
        'coffee',
        'snack',
        'tapsilog',
        'burger',
        'jollibee',
        'mcdo',
        'pizza'
    ],
    transpo: [
        'jeep',
        'bus',
        'tricycle',
        'trike',
        'gas',
        'pamasahe',
        'fare',
        'grab',
        'taxi',
        'angkas',
        'mrt',
        'lrt',
        'sakay'
    ],
    school: [
        'print',
        'printing',
        'book',
        'libro',
        'notebook',
        'ballpen',
        'papel',
        'yellow',
        'supplies',
        'project',
        'school',
        'tuition',
        'bond'
    ],
    load: [
        'load',
        'data',
        'wifi',
        'internet',
        'promo',
        'sim',
        'cellphone',
        'cp',
        'vpn'
    ],
    gala: [
        'movie',
        'cinema',
        'mall',
        'gala',
        'outing',
        'inom',
        'party',
        'concert',
        'game',
        'ticket'
    ]
};
function extractNumbers(msg) {
    const tokens = msg.toLowerCase().split(/[\s,\-]+/);
    const nums = [];
    for (const t of tokens){
        const clean = t.replace(/[^a-z0-9.]/g, '');
        if (!clean) continue;
        if (/^\d+(\.\d+)?$/.test(clean)) nums.push(Number(clean));
        else if (NUM_WORDS[clean] != null) nums.push(NUM_WORDS[clean]);
    }
    return nums;
}
function detectCategory(msg) {
    const lower = msg.toLowerCase();
    for (const [cat, words] of Object.entries(CAT_KEYWORDS)){
        if (words.some((w)=>lower.includes(w))) return cat;
    }
    return 'other';
}
function isRemoveIntent(msg) {
    return /\b(delete|remove|bura|tanggal|alis|iban|palitan|mali|wrong|hindi tama)\b/i.test(msg);
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
        const lower = String(message).toLowerCase();
        if (isRemoveIntent(lower)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                action: 'remove'
            });
        }
        const nums = extractNumbers(lower);
        const hasEach = /\b(tig|bawat|each|kada)\b/.test(lower);
        let amount = 0;
        if (hasEach && nums.length >= 2) {
            amount = nums[0] * nums[1];
        } else if (nums.length === 1) {
            amount = nums[0];
        } else if (nums.length >= 2) {
            amount = Math.max(...nums);
        }
        if (!amount || amount <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'no amount'
            });
        }
        const category = detectCategory(lower);
        const note = String(message).slice(0, 40);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            action: 'add',
            amount,
            category,
            note
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'fail'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9f0ffc23._.js.map