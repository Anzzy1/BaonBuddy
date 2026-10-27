import { AppState, Expense, catName, compute, langOf, pesoR, today } from '@/lib/budget';
import { Language, daysText, translator } from '@/lib/i18n';

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Friendly one-liners per category, so each log feels noticed
const CAT_LINES: Record<string, Record<Language, string[]>> = {
  food: {
    en: ['Hope it was a good meal.', 'Enjoy your food!', 'Fuel for the day.'],
    tl: ['Sana masarap ang kinain mo.', 'Kain nang mabuti!', 'Lakas para sa buong araw.'],
    taglish: ['Sana masarap ang kinain mo.', 'Enjoy your food!', 'Fuel for the day.'],
  },
  snacks: {
    en: ['A little treat goes a long way.', 'Enjoy, just keep an eye on the small stuff.', 'Snack break, noted.'],
    tl: ['Malaking saya ang maliit na treat.', 'Sige, pero bantayan ang maliliit na gastos.', 'Meryenda, naitala na.'],
    taglish: ['Deserve mo ang konting treat.', 'Enjoy, pero bantayan ang maliliit na gastos.', 'Snack break, noted.'],
  },
  transpo: {
    en: ['Safe travels!', 'Commute logged.', 'Hope the ride was smooth.'],
    tl: ['Ingat sa biyahe!', 'Naitala ang pamasahe.', 'Sana maayos ang biyahe mo.'],
    taglish: ['Ingat sa biyahe!', 'Commute logged.', 'Sana smooth ang biyahe mo.'],
  },
  school: {
    en: ['A good investment in your studies.', 'For the grades. Worth it.', 'School needs come first.'],
    tl: ['Magandang puhunan para sa pag-aaral mo.', 'Para sa grades. Sulit iyan.', 'Una ang pangangailangan sa eskwela.'],
    taglish: ['Good investment para sa studies mo.', 'Para sa grades. Worth it!', 'School needs muna, tama.'],
  },
  load: {
    en: ['Staying connected, got it.', 'Data topped up.', 'Hope you caught a good promo.'],
    tl: ['Para konektado ka, sige.', 'Nakapag-load ka na.', 'Sana nakakuha ka ng magandang promo.'],
    taglish: ['Stay connected, got it.', 'Data topped up.', 'Sana naka-sulit na promo ka.'],
  },
  gala: {
    en: ['Enjoy your time out!', 'You deserve a break.', 'Have fun, and stay within budget.'],
    tl: ['Mag-enjoy ka sa lakad!', 'Karapat-dapat kang magpahinga.', 'Magsaya ka, pero huwag lumampas sa badyet.'],
    taglish: ['Enjoy sa gala!', 'Deserve mo ang break.', 'Have fun, pero stay within budget.'],
  },
  shopping: {
    en: ['Nice pick.', 'Shopping logged.', 'Hope it’s something you’ll use a lot.'],
    tl: ['Magandang pili.', 'Naitala ang pinamili mo.', 'Sana madalas mo itong magamit.'],
    taglish: ['Nice pick!', 'Shopping logged.', 'Sana madalas mo siyang magamit.'],
  },
  personal: {
    en: ['Self-care counts.', 'Personal care, noted.', 'Taking care of yourself, good.'],
    tl: ['Mahalaga ang pag-aalaga sa sarili.', 'Pansariling gamit, naitala na.', 'Mabuti at inaalagaan mo ang sarili mo.'],
    taglish: ['Self-care counts!', 'Personal care, noted.', 'Good, inaalagaan mo ang sarili mo.'],
  },
  health: {
    en: ['Health comes first.', 'Take care of yourself.', 'Get well soon if you’re under the weather.'],
    tl: ['Kalusugan ang una.', 'Ingatan mo ang sarili mo.', 'Pagaling ka kung masama ang pakiramdam mo.'],
    taglish: ['Health first talaga.', 'Take care of yourself.', 'Get well soon kung may sakit ka.'],
  },
  bills: {
    en: ['Bills paid, one less thing to worry about.', 'Rent and bills, logged.', 'Good to stay on top of these.'],
    tl: ['Bayad na, isang alalahanin ang nabawas.', 'Naitala ang upa at bayarin.', 'Mabuti at nasusubaybayan mo ang mga ito.'],
    taglish: ['Bayad na, isang worry ang nabawas.', 'Rent and bills, logged.', 'Good na updated ka sa bills.'],
  },
  subs: {
    en: ['Subscription logged. Worth reviewing these now and then.', 'Make sure you use it enough.', 'Subscriptions add up, noted.'],
    tl: ['Naitala ang subscription. Mainam itong silipin paminsan-minsan.', 'Siguraduhing nagagamit mo ito nang sapat.', 'Lumalaki rin ang mga subscription, naitala na.'],
    taglish: ['Subscription logged. I-review mo ‘to paminsan-minsan.', 'Make sure nagagamit mo siya enough.', 'Nag-a-add up ang subscriptions, noted.'],
  },
  gifts: {
    en: ['That’s thoughtful of you.', 'Someone’s lucky.', 'Gift logged.'],
    tl: ['Ang maalalahanin mo.', 'Ang suwerte naman ng makakatanggap.', 'Naitala ang regalo.'],
    taglish: ['Ang thoughtful mo.', 'Swerte ng makakatanggap!', 'Gift logged.'],
  },
  games: {
    en: ['Have fun playing!', 'Game time, noted.', 'Enjoy, just set a limit.'],
    tl: ['Mag-enjoy sa paglalaro!', 'Oras ng laro, naitala na.', 'Sige, basta may limit.'],
    taglish: ['Have fun playing!', 'Game time, noted.', 'Enjoy, basta may limit.'],
  },
  other: {
    en: ['Added to your list.', 'Logged and tracked.', 'Got it, it’s in your budget.'],
    tl: ['Naidagdag na sa listahan mo.', 'Naitala at nasusubaybayan na.', 'Sige, kasama na sa badyet mo.'],
    taglish: ['Added na sa list mo.', 'Logged and tracked.', 'Got it, kasama na sa budget mo.'],
  },
};

// Buddy's reaction to freshly logged expenses: what Buddy noticed, then how it affects the budget
export function buddyReact(prev: AppState, added: Expense[]): string {
  const lang = langOf(prev);
  const t = translator(lang);
  const days = (n: number) => daysText(n, lang);
  const before = compute(prev);
  const after = compute({ ...prev, expenses: [...prev.expenses, ...added] });
  const inPeriod = added.filter(e => e.date >= prev.start && e.date <= prev.end);
  const total = added.reduce((s, e) => s + e.amount, 0);

  if (!inPeriod.length) {
    return t(`Logged ${pesoR(total)}, but it falls outside your current period, so it doesn’t count toward this budget.`,
             `Naitala ang ${pesoR(total)}, pero wala ito sa kasalukuyang period, kaya hindi ito bibilangin sa badyet na ito.`,
             `Na-log ang ${pesoR(total)}, pero labas siya sa current period mo, kaya hindi siya counted sa budget na 'to.`);
  }

  // 1) Reaction to the log itself
  let first: string;
  if (added.length > 1) {
    const top = [...added].sort((a, b) => b.amount - a.amount)[0];
    const name = top.note || catName(top.cat, lang);
    first = t(`${added.length} items, ${pesoR(total)} in total. The biggest was ${name} (${pesoR(top.amount)}).`,
              `${added.length} na gastos, ${pesoR(total)} lahat. Pinakamalaki ang ${name} (${pesoR(top.amount)}).`,
              `${added.length} items, ${pesoR(total)} total. Pinakamalaki ang ${name} (${pesoR(top.amount)}).`);
  } else {
    const e = added[0];
    const cat = catName(e.cat, lang);
    const what = e.note
      ? t(`${e.note} for ${pesoR(e.amount)}`, `${e.note}, ${pesoR(e.amount)}`, `${e.note} for ${pesoR(e.amount)}`)
      : t(`${pesoR(e.amount)} on ${cat}`, `${pesoR(e.amount)} sa ${cat}`, `${pesoR(e.amount)} sa ${cat}`);
    const safe = before.perDay;
    let size = '';
    if (safe > 0 && e.amount > safe * 1.5) size = t(` That’s a big one, above your safe ${pesoR(safe)}/day.`,
                                                     ` Malaki iyan, lampas sa ligtas mong ${pesoR(safe)} kada araw.`,
                                                     ` Medyo malaki 'yan, lampas sa safe ${pesoR(safe)}/day mo.`);
    else if (safe > 0 && e.amount <= safe * 0.3) size = t(' Nice and small!', ' Maliit lang, ayos!', ' Small lang, nice!');
    const noted = t('noted!', 'naitala na!', 'noted!');
    const lines = (CAT_LINES[e.cat] || CAT_LINES.other)[lang];
    first = `${what}, ${noted}${size} ${pick(lines)}`;
  }

  // 2) What it did to the budget
  const td = today();
  const todaySpent = after.inPeriod.filter(e => e.date === td).reduce((s, e) => s + e.amount, 0);
  const crossed = (n: number) => before.pct < n && after.pct >= n;
  let second: string;
  if (after.remaining < 0 && before.remaining >= 0) second = t(
    `Heads up, you’re now ${pesoR(-after.remaining)} over budget. Stick to essentials until your next allowance.`,
    `Paalala, lampas ka na ng ${pesoR(-after.remaining)} sa badyet. Mga kailangan lang muna hanggang sa susunod mong baon.`,
    `Heads up, over budget ka na ng ${pesoR(-after.remaining)}. Essentials lang muna hanggang next allowance.`);
  else if (after.remaining < 0) second = t(
    `You’re ${pesoR(-after.remaining)} over budget in total. Let’s slow down for now.`,
    `Lampas ka na ng ${pesoR(-after.remaining)} sa kabuuan. Dahan-dahan muna tayo.`,
    `Over budget ka na ng ${pesoR(-after.remaining)} in total. Slow down muna tayo.`);
  else if (crossed(85)) second = t(
    `You’ve used ${Math.round(after.pct)}% of your budget. ${pesoR(after.remaining)} left for ${days(after.left)}, so go easy.`,
    `Nagamit mo na ang ${Math.round(after.pct)}% ng badyet mo. ${pesoR(after.remaining)} na lang para sa ${days(after.left)}, kaya hinay-hinay.`,
    `Nagamit mo na ang ${Math.round(after.pct)}% ng budget mo. ${pesoR(after.remaining)} na lang for ${days(after.left)}, kaya hinay-hinay.`);
  else if (crossed(50)) second = t(
    `You’re past the halfway mark (${Math.round(after.pct)}%). Your safe daily budget is now ${pesoR(after.perDay)}.`,
    `Lampas ka na sa kalahati (${Math.round(after.pct)}%). ${pesoR(after.perDay)} na ang ligtas mong gastos kada araw.`,
    `Lampas ka na sa halfway (${Math.round(after.pct)}%). ${pesoR(after.perDay)} na ang safe daily budget mo.`);
  else if (before.perDay > 0 && todaySpent > before.perDay && inPeriod.some(e => e.date === td)) second = t(
    `You’re over today’s safe budget (${pesoR(todaySpent)} vs ${pesoR(before.perDay)}). You can make it up tomorrow.`,
    `Lampas ka na sa ligtas na badyet ngayong araw (${pesoR(todaySpent)} laban sa ${pesoR(before.perDay)}). Puwede kang bumawi bukas.`,
    `Lampas ka na sa safe budget today (${pesoR(todaySpent)} vs ${pesoR(before.perDay)}). Bawi ka na lang bukas.`);
  else if (after.perDay < before.perDay) second = t(
    `Your safe daily budget is now ${pesoR(after.perDay)} (was ${pesoR(before.perDay)}). Still on track!`,
    `${pesoR(after.perDay)} na ang ligtas mong gastos kada araw (dati ${pesoR(before.perDay)}). Nasa tamang takbo ka pa rin!`,
    `${pesoR(after.perDay)} na ang safe daily budget mo (dati ${pesoR(before.perDay)}). On track ka pa rin!`);
  else second = t(
    `You have ${pesoR(after.remaining)} left for ${days(after.left)}. Looking good!`,
    `May ${pesoR(after.remaining)} ka pa para sa ${days(after.left)}. Ayos!`,
    `May ${pesoR(after.remaining)} ka pa for ${days(after.left)}. Looking good!`);

  // 3) Category limits the new expenses pushed past 80% or 100%
  const limitNote = after.limits
    .filter(l => added.some(e => e.cat === l.id))
    .map(l => {
      const was = before.limits.find(x => x.id === l.id)?.pct || 0;
      const label = catName(l.id, lang);
      if (was < 100 && l.pct >= 100) return t(`You’ve hit your ${label} limit (${pesoR(l.sum)} of ${pesoR(l.max)}).`,
                                              `Naabot mo na ang limit mo sa ${label} (${pesoR(l.sum)} sa ${pesoR(l.max)}).`,
                                              `Na-hit mo na ang ${label} limit mo (${pesoR(l.sum)} of ${pesoR(l.max)}).`);
      if (was < 80 && l.pct >= 80) return t(`Heads up: ${Math.round(l.pct)}% of your ${label} limit is used.`,
                                            `Paalala: ${Math.round(l.pct)}% na ng limit mo sa ${label} ang nagamit.`,
                                            `Heads up: ${Math.round(l.pct)}% na ng ${label} limit mo ang nagamit.`);
      return '';
    })
    .find(Boolean);

  return limitNote ? `${first} ${limitNote}` : `${first} ${second}`;
}
