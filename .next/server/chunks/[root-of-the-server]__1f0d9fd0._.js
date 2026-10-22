module.exports = [
"[project]/.next-internal/server/app/api/feedback/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/app/api/feedback/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const CAT_LABELS = {
    food: 'Food',
    transpo: 'Transpo',
    school: 'School',
    load: 'Load',
    gala: 'Gala',
    other: 'Others'
};
const peso = (v)=>'₱' + Math.abs(Math.round(v)).toLocaleString('en-PH');
async function POST(req) {
    try {
        const body = await req.json();
        const { budget, start, end, expenses, prev } = body;
        const inPeriod = expenses.filter((e)=>e.date >= start && e.date <= end);
        const spent = inPeriod.reduce((s, e)=>s + e.amount, 0);
        const remaining = budget - spent;
        const pct = budget > 0 ? Math.round(spent / budget * 100) : 0;
        const total = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1);
        const elapsed = Math.min(total, Math.max(1, Math.round((Date.now() - new Date(start).getTime()) / 864e5) + 1));
        const timePct = Math.round(elapsed / total * 100);
        const daysLeft = Math.max(0, Math.round((new Date(end).getTime() - Date.now()) / 864e5) + 1);
        const perDay = remaining > 0 && daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;
        const byCat = {};
        inPeriod.forEach((e)=>{
            byCat[e.cat] = (byCat[e.cat] || 0) + e.amount;
        });
        const sortedCats = Object.entries(byCat).sort((a, b)=>b[1] - a[1]);
        const topCatId = sortedCats[0]?.[0] || 'food';
        const topSum = sortedCats[0]?.[1] || 0;
        const topPct = spent > 0 ? Math.round(topSum / spent * 100) : 0;
        const topLabel = CAT_LABELS[topCatId] || 'Others';
        const pool = [];
        // Each line: how they're doing, then what Buddy suggests, said like a friend would
        // Scenario: no spending yet
        if (spent === 0) {
            pool.push(`Uy, wala ka pang gastos! Buo pa ang ${peso(budget)} mo. Kaya mo ang ${peso(perDay)} a day, chill lang tayo.`);
            pool.push(`Fresh start tayo ngayon. Tip ko: i-log mo agad ang unang gastos para makita natin ang pace mo.`);
        } else if (pct > 100) {
            pool.push(`Uy, lagpas na tayo ng ${peso(-remaining)}. Okay lang, nangyayari talaga 'yan. Essentials muna hanggang next allowance, iwas muna sa ${topLabel} ha?`);
            pool.push(`Medyo sumobra tayo ng ${peso(-remaining)} this time. Wag ka ma-stress, babawi tayo. Baon na lang muna galing bahay, kaya natin 'to.`);
            pool.push(`${pct}% na ng allowance mo ang nagastos. Hinga muna. Tipid mode tayo hanggang dumating ang next baon, ako bahala magpaalala.`);
        } else if (pct >= 85) {
            pool.push(`Konti na lang natitira: ${peso(remaining)} for ${daysLeft} days. Suggest ko, ${peso(perDay)} a day lang muna tayo, at pahinga muna sa ${topLabel}.`);
            pool.push(`${pct}% na ang nagamit natin, kaya ingat-ingat muna. Kung may gala invite, okay lang mag-pass muna this week.`);
            pool.push(`Malapit na tayo sa limit. Try natin ang ${peso(perDay)} a day. Mag-baon ng tubig at snacks, malaking tipid 'yan.`);
        } else if (daysLeft <= 3 && perDay > 0) {
            pool.push(`Last ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} na lang! May ${peso(remaining)} ka pa, so ${peso(perDay)} a day. Konting tiis na lang, malapit na tayo.`);
            pool.push(`Final stretch na tayo. ${peso(remaining)} pa natitira mo. Kapag umabot tayo nang ganito, ang galing mo talaga.`);
        } else if (pct > timePct + 8) {
            pool.push(`Napapansin ko medyo mabilis tayo: ${pct}% na ang gastos pero ${timePct}% pa lang ng period. Bawas muna sa ${topLabel}, mga ${peso(perDay)} a day lang.`);
            pool.push(`Medyo napaaga ang gastos natin ah. Okay lang, i-adjust lang natin. ${peso(perDay)} a day muna para umabot ang ${peso(remaining)}.`);
            pool.push(`Heads up lang: mas mabilis ang gastos kaysa sa araw. Try natin mag-skip ng isang ${topLabel} this week, malaking tulong 'yan.`);
        } else if (topPct >= 55) {
            pool.push(`Okay pace mo! Pero ${topPct}% ng gastos mo ay ${topLabel}. Kung babawasan natin ng kalahati, may ${peso(topSum / 2)} ka pang extra.`);
            pool.push(`Ayos naman tayo overall. Napansin ko lang, ${topLabel} ang pinakamalaki (${peso(topSum)}). Try natin i-limit, dagdag ipon din 'yan.`);
        } else if (pct < timePct - 15) {
            pool.push(`Ang tipid mo ah! ${pct}% pa lang nagagastos pero ${timePct}% na ng period. Deserve mo ang maliit na treat, o itabi mo na ang sobra.`);
            pool.push(`Proud ako sa'yo, ang ganda ng pace mo. Kung tuloy 'to, may matitira ka pang ipon sa dulo.`);
        } else {
            pool.push(`Sakto ang pace mo: ${pct}% gastos, ${timePct}% ng period. Keep mo lang ang ${peso(perDay)} a day, kayang-kaya mo 'to.`);
            pool.push(`Ayos tayo ngayon! Puwede ka pa mag-treat minsan, basta around ${peso(perDay)} a day lang tayo.`);
            pool.push(`Steady lang tayo, may ${peso(remaining)} ka pa for ${daysLeft} days. Tip: i-log agad ang gastos para hindi tayo malito.`);
        }
        // Extra situational cut suggestion
        if (topSum > 0 && pct >= 60 && pool.length < 5) {
            pool.push(`Napansin ko, ${topLabel} ang pinakamalaki mong gastos (${peso(topSum)}). Kung babawasan natin ng 30%, may ${peso(topSum * 0.3)} ka pang extra.`);
        }
        let msg = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1 && msg === prev) {
            msg = pool[(pool.indexOf(msg) + 1) % pool.length];
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            msg
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            msg: 'Check mo ang gastos mo, baka kailangan na mag-adjust ng spending.'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1f0d9fd0._.js.map