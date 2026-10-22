import { AppState, Expense, catById, compute, pesoR, today } from '@/lib/budget';

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Friendly one-liners per category, so each log feels noticed
const CAT_LINES: Record<string, string[]> = {
  food: ['Busog ka na ba? Sana masarap ’yan.', 'Kain well! Basta wag lang araw-araw milk tea ha.', 'Food is life talaga.'],
  transpo: ['Ingat sa byahe!', 'Commute life, laban lang.', 'Sana hindi traffic today.'],
  school: ['Investment sa pag-aaral ’yan, okay lang.', 'Para sa grades! Sulit ’yan.', 'School needs muna, tama ’yan.'],
  load: ['Para connected ka pa rin, gets ko.', 'Load muna para sa GC updates.', 'Sana promo ang kinuha mo.'],
  gala: ['Uy, may lakad! Enjoy ka.', 'Deserve mo rin mag-unwind.', 'Saya naman, basta within budget tayo.'],
  other: ['Okay, nadagdag na sa list.', 'Sige, ako na bahala mag-track.', 'Gets, kasama na sa budget.'],
};

// Buddy's reaction to freshly logged expenses: what Buddy noticed, then how it affects the budget
export function buddyReact(prev: AppState, added: Expense[]): string {
  const before = compute(prev);
  const after = compute({ ...prev, expenses: [...prev.expenses, ...added] });
  const inPeriod = added.filter(e => e.date >= prev.start && e.date <= prev.end);
  const total = added.reduce((s, e) => s + e.amount, 0);

  if (!inPeriod.length) {
    return `Na-log ko na ang ${pesoR(total)}, pero labas ’yan sa current period mo kaya hindi siya kasama sa budget ngayon.`;
  }

  // 1) Reaction to the log itself
  let first: string;
  if (added.length > 1) {
    const top = [...added].sort((a, b) => b.amount - a.amount)[0];
    first = `${added.length} items, ${pesoR(total)} lahat. Pinakamalaki ang ${top.note || catById(top.cat).label} (${pesoR(top.amount)}).`;
  } else {
    const e = added[0];
    const what = e.note ? `${e.note} for ${pesoR(e.amount)}` : `${pesoR(e.amount)} sa ${catById(e.cat).label}`;
    const safe = before.perDay;
    let size = '';
    if (safe > 0 && e.amount > safe * 1.5) size = ` Medyo malaki ’to, mas mataas sa safe ${pesoR(safe)}/day mo.`;
    else if (safe > 0 && e.amount <= safe * 0.3) size = ' Maliit lang, nice!';
    first = `${what}, noted!${size} ${pick(CAT_LINES[e.cat] || CAT_LINES.other)}`;
  }

  // 2) What it did to the budget
  const t = today();
  const todaySpent = after.inPeriod.filter(e => e.date === t).reduce((s, e) => s + e.amount, 0);
  const crossed = (n: number) => before.pct < n && after.pct >= n;
  let second: string;
  if (after.remaining < 0 && before.remaining >= 0) second = `Uh oh, lumampas na tayo ng ${pesoR(-after.remaining)}. Essentials muna hanggang next allowance ha.`;
  else if (after.remaining < 0) second = `Lampas na tayo ng ${pesoR(-after.remaining)} total. Hinay-hinay muna tayo.`;
  else if (crossed(85)) second = `${Math.round(after.pct)}% na ang nagamit natin. ${pesoR(after.remaining)} na lang for ${after.left} day${after.left === 1 ? '' : 's'}, ingat na tayo.`;
  else if (crossed(50)) second = `Kalahati na ng baon ang nagamit (${Math.round(after.pct)}%). Safe per day mo ngayon: ${pesoR(after.perDay)}.`;
  else if (before.perDay > 0 && todaySpent > before.perDay && inPeriod.some(e => e.date === t)) second = `Lagpas ka na sa safe budget today (${pesoR(todaySpent)} vs ${pesoR(before.perDay)}). Bawi tayo bukas, okay?`;
  else if (after.perDay < before.perDay) second = `Safe per day mo ngayon ay ${pesoR(after.perDay)} (dati ${pesoR(before.perDay)}). Kaya pa ’yan!`;
  else second = `May ${pesoR(after.remaining)} ka pa for ${after.left} day${after.left === 1 ? '' : 's'}. Ayos tayo!`;

  return `${first} ${second}`;
}
