// Buddy's short, friendly feedback line on the Overview tab.
// Pure functions, so it runs in the browser / WebView without a server.

import { AppState, catName, compute, langOf } from '@/lib/budget';
import { daysText, perDayText, translator } from '@/lib/i18n';

const peso = (v: number) => '₱' + Math.abs(Math.round(v)).toLocaleString('en-PH');

export function feedbackMessage(state: AppState, prev?: string): string {
  const { start, end, expenses } = state;
  const lang = langOf(state);
  const t = translator(lang);
  const inPeriod = expenses.filter(e => e.date >= start && e.date <= end);
  const spent = inPeriod.reduce((s, e) => s + e.amount, 0);
  // Same spendable figure as compute(): allowance + money added - savings set aside
  const { spendable } = compute(state);
  const remaining = spendable - spent;
  const pct = spendable > 0 ? Math.round((spent / spendable) * 100) : 0;

  const total = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1);
  const elapsed = Math.min(total, Math.max(1, Math.round((Date.now() - new Date(start).getTime()) / 864e5) + 1));
  const timePct = Math.round((elapsed / total) * 100);
  const daysLeft = Math.max(0, Math.round((new Date(end).getTime() - Date.now()) / 864e5) + 1);
  const perDay = remaining > 0 && daysLeft > 0 ? Math.round(remaining / daysLeft) : 0;

  const byCat: Record<string, number> = {};
  inPeriod.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const topCatId = sortedCats[0]?.[0] || 'food';
  const topSum = sortedCats[0]?.[1] || 0;
  const topPct = spent > 0 ? Math.round((topSum / spent) * 100) : 0;
  const topLabel = catName(topCatId, lang);

  const pool: string[] = [];
  const dl = daysText(daysLeft, lang);
  const aDay = perDayText(peso(perDay), lang);

  // Each line: how they're doing, then what Buddy suggests
  // Scenario: no spending yet
  if (spent === 0) {
    pool.push(t(`No spending yet. Your full ${peso(spendable)} is still there, which works out to ${aDay}.`,
                `Wala ka pang gastos. Buo pa ang ${peso(spendable)} mo, kaya mga ${aDay} ang puwede mong gastusin.`,
                `Wala ka pang gastos. Buo pa ang ${peso(spendable)} mo, so mga ${aDay} ka.`));
    pool.push(t(`A fresh start. Log your first expense as soon as it happens so we can track your pace.`,
                `Bagong simula. Ilista agad ang una mong gastos para masubaybayan natin ang takbo mo.`,
                `Fresh start! I-log agad ang first expense mo para ma-track natin ang pace mo.`));
  }
  // Scenario: over budget
  else if (pct > 100) {
    pool.push(t(`You’re ${peso(-remaining)} over budget. It happens. Stick to essentials until your next allowance and go easy on ${topLabel}.`,
                `Lampas ka na ng ${peso(-remaining)} sa badyet. Nangyayari talaga iyan. Mga kailangan lang muna hanggang sa susunod mong baon, at bawasan ang ${topLabel}.`,
                `Over budget ka na ng ${peso(-remaining)}. Okay lang, nangyayari 'yan. Essentials lang muna hanggang next allowance, at hinay-hinay sa ${topLabel}.`));
    pool.push(t(`You went ${peso(-remaining)} over this time. Don’t stress, we’ll get back on track. Bringing food from home helps a lot.`,
                `Lumampas ka ng ${peso(-remaining)} ngayon. Huwag kang mag-alala, makakabawi tayo. Malaking tulong ang pagbabaon ng pagkain mula sa bahay.`,
                `Lumampas ka ng ${peso(-remaining)} this time. Don’t stress, babawi tayo. Malaking tulong ang magbaon ng food from home.`));
    pool.push(t(`${pct}% of your budget is used. Let’s switch to saving mode until your next allowance. I’ll keep reminding you.`,
                `${pct}% na ng badyet mo ang nagamit. Magtipid muna tayo hanggang sa susunod mong baon. Paaalalahanan kita.`,
                `${pct}% na ng budget mo ang nagamit. Tipid mode muna tayo hanggang next allowance. I-re-remind kita.`));
  }
  // Scenario: critical
  else if (pct >= 85) {
    pool.push(t(`Only ${peso(remaining)} left for ${dl}. Try to keep it to ${aDay} and take a break from ${topLabel}.`,
                `${peso(remaining)} na lang ang natitira para sa ${dl}. Subukang gumastos lang ng ${aDay}, at iwasan muna ang ${topLabel}.`,
                `${peso(remaining)} na lang for ${dl}. Try mong i-keep sa ${aDay}, at break ka muna sa ${topLabel}.`));
    pool.push(t(`${pct}% used, so let’s be careful. It’s okay to skip a hangout this week.`,
                `${pct}% na ang nagamit, kaya mag-ingat tayo. Ayos lang na hindi muna sumama sa gala ngayong linggo.`,
                `${pct}% na ang nagamit, kaya ingat tayo. Okay lang mag-skip ng isang gala this week.`));
    pool.push(t(`You’re close to your limit. Aim for ${aDay}. Bringing water and snacks from home saves a lot.`,
                `Malapit ka na sa limit. Gumastos lang ng ${aDay}. Malaki ang matitipid kung magdadala ka ng tubig at meryenda mula sa bahay.`,
                `Malapit ka na sa limit. Aim for ${aDay}. Malaki ang tipid pag nagdala ka ng tubig at snacks from home.`));
  }
  // Scenario: near end, tight
  else if (daysLeft <= 3 && perDay > 0) {
    pool.push(t(`Just ${dl} to go! You have ${peso(remaining)} left, about ${aDay}. Almost there.`,
                `${dl} na lang! May ${peso(remaining)} ka pa, mga ${aDay}. Malapit na.`,
                `${dl} na lang! May ${peso(remaining)} ka pa, mga ${aDay}. Konti na lang!`));
    pool.push(t(`Final stretch. ${peso(remaining)} left. Making it this far is a real win.`,
                `Huling bahagi na. ${peso(remaining)} pa ang natitira. Panalo ka na sa pag-abot dito.`,
                `Final stretch na! ${peso(remaining)} pa ang natitira. Panalo ka na sa pag-abot dito.`));
  }
  // Scenario: spending too fast
  else if (pct > timePct + 8) {
    pool.push(t(`You’re spending a bit fast: ${pct}% used with only ${timePct}% of the period gone. Cut back on ${topLabel} and aim for ${aDay}.`,
                `Medyo mabilis ang gastos mo: ${pct}% na ang nagamit pero ${timePct}% pa lang ng period ang lumilipas. Bawasan ang ${topLabel} at gumastos lang ng ${aDay}.`,
                `Medyo mabilis ang gastos mo: ${pct}% na ang nagamit pero ${timePct}% pa lang ng period. Bawasan ang ${topLabel} at aim for ${aDay}.`));
    pool.push(t(`Spending is running ahead of schedule. Just adjust: ${aDay} keeps your ${peso(remaining)} going.`,
                `Nauuna ang gastos mo sa takbo ng araw. Mag-adjust lang: sa ${aDay}, aabot ang ${peso(remaining)} mo.`,
                `Nauuna ang gastos mo sa schedule. Adjust lang: sa ${aDay}, aabot ang ${peso(remaining)} mo.`));
    pool.push(t(`Heads up: you’re spending faster than the days are passing. Skipping one ${topLabel} purchase this week would help a lot.`,
                `Paalala: mas mabilis ang gastos mo kaysa sa paglipas ng araw. Malaking tulong kung lalaktawan mo ang isang gastos sa ${topLabel} ngayong linggo.`,
                `Heads up: mas mabilis ang gastos mo kaysa sa days. Malaking tulong kung mag-skip ka ng isang ${topLabel} this week.`));
  }
  // Scenario: one category heavy
  else if (topPct >= 55) {
    pool.push(t(`Good pace! But ${topPct}% of your spending is ${topLabel}. Cutting that in half would free up ${peso(topSum / 2)}.`,
                `Maayos ang takbo mo! Pero ${topPct}% ng gastos mo ay sa ${topLabel}. Kung hahatiin mo iyon, makakatipid ka ng ${peso(topSum / 2)}.`,
                `Okay ang pace mo! Pero ${topPct}% ng gastos mo ay sa ${topLabel}. Pag hinati mo 'yan, maka-save ka ng ${peso(topSum / 2)}.`));
    pool.push(t(`You’re doing fine overall. ${topLabel} is your biggest expense (${peso(topSum)}). Setting a limit there adds to your savings.`,
                `Maayos ka sa kabuuan. ${topLabel} ang pinakamalaki mong gastos (${peso(topSum)}). Kung lalagyan mo ito ng limit, dadagdag ito sa ipon mo.`,
                `Overall, okay ka. ${topLabel} ang pinakamalaki mong gastos (${peso(topSum)}). Pag nag-set ka ng limit diyan, dagdag ipon 'yan.`));
  }
  // Scenario: way under pace
  else if (pct < timePct - 15) {
    pool.push(t(`Great saving! Only ${pct}% spent with ${timePct}% of the period gone. Treat yourself a little, or save the extra.`,
                `Ang galing mong magtipid! ${pct}% pa lang ang nagastos kahit ${timePct}% na ng period ang lumipas. Puwede kang mag-treat nang kaunti, o itabi mo ang sobra.`,
                `Ang tipid mo! ${pct}% pa lang ang nagastos kahit ${timePct}% na ng period. Treat yourself nang konti, or ipunin mo ang extra.`));
    pool.push(t(`Your pace is excellent. Keep this up and you’ll have money left over at the end.`,
                `Napakahusay ng takbo mo. Ituloy mo lang at may matitira kang pera sa dulo.`,
                `Ang ganda ng pace mo. Keep it up at may matitira kang pera sa dulo.`));
  }
  // Scenario: on track
  else {
    pool.push(t(`Right on pace: ${pct}% spent, ${timePct}% of the period gone. Keep it around ${aDay}.`,
                `Tama ang takbo mo: ${pct}% na ang nagastos, ${timePct}% na ng period ang lumipas. Panatilihin sa mga ${aDay}.`,
                `Sakto ang pace mo: ${pct}% na ang nagastos, ${timePct}% na ng period. Keep it around ${aDay}.`));
    pool.push(t(`You’re doing well! A small treat is fine, as long as you stay around ${aDay}.`,
                `Ang galing mo! Ayos lang ang maliit na treat, basta manatili ka sa mga ${aDay}.`,
                `Ang galing mo! Okay lang ang small treat, basta stay ka around ${aDay}.`));
    pool.push(t(`Steady progress, with ${peso(remaining)} left for ${dl}. Tip: log expenses right away so nothing slips through.`,
                `Tuloy-tuloy ang takbo, may ${peso(remaining)} ka pa para sa ${dl}. Payo: ilista agad ang gastos para walang makaligtaan.`,
                `Steady lang, may ${peso(remaining)} ka pa for ${dl}. Tip: i-log agad ang gastos para walang makalimutan.`));
  }

  // Extra situational cut suggestion
  if (topSum > 0 && pct >= 60 && pool.length < 5) {
    pool.push(t(`${topLabel} is your biggest expense (${peso(topSum)}). Cutting it by 30% would free up ${peso(topSum * 0.3)}.`,
                `${topLabel} ang pinakamalaki mong gastos (${peso(topSum)}). Kung babawasan mo ito ng 30%, makakatipid ka ng ${peso(topSum * 0.3)}.`,
                `${topLabel} ang pinakamalaki mong gastos (${peso(topSum)}). Pag binawasan mo ng 30%, maka-save ka ng ${peso(topSum * 0.3)}.`));
  }

  let msg = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && msg === prev) {
    msg = pool[(pool.indexOf(msg) + 1) % pool.length];
  }
  return msg;
}
