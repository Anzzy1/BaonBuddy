import { Language, catLabel, dateLocale, daysText, translator } from '@/lib/i18n';

export interface Expense {
  id: string;
  cat: string;
  amount: number;
  note: string;
  date: string;
  ts: number;
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'custom';

// Set up once during onboarding. Lives on the device with the rest of the data.
export interface Profile {
  name: string;
  avatar: string;
  period: Period;
  cats: string[];
  savings: number;
  // Where the per-period savings go (a goal id)
  savingsGoalId?: string;
  createdAt: number;
}

// Extra money added during a period (gift, part-time pay, leftover carried over)
export interface Income {
  id: string;
  amount: number;
  note: string;
  date: string;
  ts: number;
  carry?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline?: string;
  createdAt: number;
}

// "owed": someone owes the student. "owe": the student owes someone.
export interface Debt {
  id: string;
  person: string;
  amount: number;
  dir: 'owed' | 'owe';
  note: string;
  date: string;
  settled?: boolean;
  ts: number;
}

// One-tap repeat expenses (daily fare, weekly load...)
export interface Favorite {
  id: string;
  amount: number;
  cat: string;
  note: string;
}

export type LeftoverChoice = 'goal' | 'carry' | 'keep';

// Snapshot of a finished period, kept so students can look back
export interface PeriodRecord {
  id: string;
  start: string;
  end: string;
  budget: number;
  added: number;
  spent: number;
  saved: number;
  leftover: number;
  leftoverTo?: LeftoverChoice;
  goalId?: string;
  closedAt: number;
}

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  remindDaily: boolean;
  remindTime: string;
  remindAllowance: boolean;
  // Upcoming expenses: a heads-up before, on and after the due date
  remindUpcoming: boolean;
  // How many days before the due date the first heads-up comes
  upcomingLead: 1 | 3 | 7;
  // Unsettled utang, once a week
  remindDebts: boolean;
  // Savings goals with a deadline: a week and a day before
  remindGoals: boolean;
  // Two days before the period ends (and the morning after a custom one ends)
  remindPeriodEnd: boolean;
  // Sunday evening recap of the week
  remindWeekly: boolean;
  // Each morning: how much is safe to spend today
  remindMorning: boolean;
  // A nudge after 3 days with nothing logged
  remindInactive: boolean;
  // Language Buddy talks in
  lang: Language;
}

// Money-due and check-in reminders start on; the chattier daily ones are opt-in
export const DEFAULT_SETTINGS: Settings = {
  theme: 'system', remindDaily: false, remindTime: '20:00', remindAllowance: false,
  remindUpcoming: true, upcomingLead: 1, remindDebts: true, remindGoals: true, remindPeriodEnd: true,
  remindWeekly: true, remindMorning: false, remindInactive: true, lang: 'en',
};

export interface AppState {
  budget: number;
  start: string;
  end: string;
  expenses: Expense[];
  profile?: Profile;
  incomes?: Income[];
  goals?: Goal[];
  debts?: Debt[];
  favorites?: Favorite[];
  // Spending cap per category for each period, in pesos
  limits?: Record<string, number>;
  history?: PeriodRecord[];
  // Id of a finished period whose leftover the student hasn't decided on yet
  pendingClose?: string;
  settings?: Settings;
  // Bills and expenses coming up; their money is set aside until they're paid
  upcoming?: Upcoming[];
}

export interface Upcoming {
  id: string;
  name: string;
  amount: number;
  cat: string;
  due: string;
  ts: number;
}

// Total set aside this period: everything due by the period's end, overdue ones included
export const reservedIn = (state: AppState) =>
  (state.upcoming || []).filter(u => u.due <= state.end).reduce((s, u) => s + u.amount, 0);

export const KEY = 'estudyante-balanse.v1';

// Icons are 3D images in public/cats/<id>.png. `color` tints tiles and dots; `grad` fills bars (kept flat).
export const CATS = [
  { id: 'food', label: 'Food', color: '#E8743B', grad: '#E8743B' },
  { id: 'snacks', label: 'Snacks & Drinks', color: '#D9668C', grad: '#D9668C' },
  { id: 'transpo', label: 'Transport', color: '#4C7BE0', grad: '#4C7BE0' },
  { id: 'school', label: 'School Supplies', color: '#7C6CD9', grad: '#7C6CD9' },
  { id: 'load', label: 'Load & Data', color: '#2E9E8F', grad: '#2E9E8F' },
  { id: 'gala', label: 'Hangouts', color: '#B565B0', grad: '#B565B0' },
  { id: 'shopping', label: 'Shopping', color: '#D19A2E', grad: '#D19A2E' },
  { id: 'personal', label: 'Personal Care', color: '#4A9FB0', grad: '#4A9FB0' },
  { id: 'health', label: 'Health', color: '#D2554F', grad: '#D2554F' },
  { id: 'bills', label: 'Bills & Rent', color: '#5C6BC0', grad: '#5C6BC0' },
  { id: 'subs', label: 'Subscriptions', color: '#3B95D1', grad: '#3B95D1' },
  { id: 'gifts', label: 'Gifts', color: '#DB6A7C', grad: '#DB6A7C' },
  { id: 'games', label: 'Games', color: '#4FA05A', grad: '#4FA05A' },
  { id: 'other', label: 'Others', color: '#8A8A96', grad: '#8A8A96' },
];

// What a new profile starts with; the rest can be switched on during setup
export const DEFAULT_CATS = ['food', 'snacks', 'transpo', 'school', 'load', 'gala', 'other'];

// "Others" stays on so anything the parsers can't place still has a home
export const REQUIRED_CAT = 'other';

// Categories the user picked during setup (all of them if they never chose)
export function activeCats(state: AppState) {
  const ids = state.profile?.cats;
  if (!ids?.length) return CATS;
  return CATS.filter(c => ids.includes(c.id) || c.id === REQUIRED_CAT);
}

export const catById = (id: string) => CATS.find(c => c.id === id) || CATS[CATS.length - 1];
// Category name in Buddy's language
export const catName = (id: string, lang: Language) => {
  const c = catById(id);
  return catLabel(c.id, c.label, lang);
};

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const diffDays = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);
export const today = () => iso(new Date());
export const monthRange = () => {
  const t = new Date();
  return [iso(new Date(t.getFullYear(), t.getMonth(), 1)), iso(new Date(t.getFullYear(), t.getMonth() + 1, 0))];
};
export const weekRange = () => {
  const t = new Date();
  const s = addDays(t, -((t.getDay() + 6) % 7));
  return [iso(s), iso(addDays(s, 6))];
};
export const dayRange = () => [today(), today()];

export function periodRange(period: Period): [string, string] {
  if (period === 'daily') return dayRange() as [string, string];
  if (period === 'weekly') return weekRange() as [string, string];
  return monthRange() as [string, string];
}

export const settingsOf = (state: AppState): Settings => ({ ...DEFAULT_SETTINGS, ...state.settings });
export const langOf = (state: AppState): Language => settingsOf(state).lang;

// The goal per-period savings land in; a "General savings" goal is created on first use
function savingsGoal(state: AppState): { goals: Goal[]; id: string } {
  const goals = [...(state.goals || [])];
  let g = goals.find(x => x.id === state.profile?.savingsGoalId) || goals[0];
  if (!g) {
    g = { id: uid(), name: 'General savings', target: 0, saved: 0, createdAt: Date.now() };
    goals.push(g);
  }
  return { goals, id: g.id };
}

// Ends the current period: records how it went, moves the set-aside into savings and
// starts the next one. The leftover waits for the student to decide (see settleLeftover).
export function closePeriod(state: AppState, next: { start: string; end: string; budget?: number }): AppState {
  const c = compute(state);
  // If spending ate into the set-aside, only what's left of it is actually saved
  const saved = Math.max(0, Math.round((c.savings + Math.min(0, c.remaining)) * 100) / 100);
  const leftover = Math.max(0, Math.round(c.remaining * 100) / 100);
  const { goals, id: goalId } = savingsGoal(state);
  const record: PeriodRecord = {
    id: uid(), start: state.start, end: state.end, budget: state.budget, added: c.added,
    spent: c.spent, saved, leftover, goalId, closedAt: Date.now(),
  };
  // Money set aside for upcoming expenses that weren't paid yet moves with them into the next period
  // (overspending eats the savings set-aside first, then this)
  const reserve = Math.max(0, Math.round((c.reserved + Math.min(0, c.remaining + c.savings)) * 100) / 100);
  const incomes = reserve > 0
    ? [...(state.incomes || []), { id: uid(), amount: reserve, note: 'Set aside for upcoming expenses', date: next.start, ts: Date.now(), carry: true }]
    : state.incomes;
  return {
    ...state,
    start: next.start,
    end: next.end,
    budget: next.budget ?? state.budget,
    incomes,
    goals: saved > 0 ? goals.map(g => (g.id === goalId ? { ...g, saved: g.saved + saved } : g)) : state.goals,
    profile: state.profile && { ...state.profile, savingsGoalId: goalId },
    history: [...(state.history || []), record],
    pendingClose: record.id,
  };
}

// What happens to a finished period's leftover: into a goal, carried into this period, or just kept
export function settleLeftover(state: AppState, recordId: string, choice: LeftoverChoice, goalId?: string): AppState {
  const rec = state.history?.find(r => r.id === recordId);
  if (!rec) return { ...state, pendingClose: undefined };
  let next: AppState = {
    ...state,
    pendingClose: undefined,
    history: state.history!.map(r => (r.id === recordId ? { ...r, leftoverTo: choice, goalId: choice === 'goal' ? goalId : r.goalId } : r)),
  };
  if (choice === 'goal' && goalId) {
    next = { ...next, goals: (next.goals || []).map(g => (g.id === goalId ? { ...g, saved: g.saved + rec.leftover } : g)) };
  }
  if (choice === 'carry') {
    const inc: Income = { id: uid(), amount: rec.leftover, note: 'Carried over from last period', date: state.start, ts: Date.now(), carry: true };
    next = { ...next, incomes: [...(next.incomes || []), inc] };
  }
  return next;
}

// Repeating allowances close the finished period and move on to the current day/week/month
export function rollPeriod(state: AppState): AppState {
  const period = state.profile?.period;
  if (!period || period === 'custom' || today() <= state.end) return state;
  const [start, end] = periodRange(period);
  return closePeriod(state, { start, end });
}

// Suggested next range for a custom period: same length, starting the day after
export function nextCustomRange(state: AppState): [string, string] {
  const len = diffDays(state.start, state.end);
  const start = iso(addDays(parse(state.end), 1));
  const s = start > today() ? start : today();
  return [s, iso(addDays(parse(s), len))];
}

export const totalSaved = (state: AppState) => (state.goals || []).reduce((s, g) => s + g.saved, 0);

export const shortDate = (s: string, lang: Language = 'en') => parse(s).toLocaleDateString(dateLocale(lang), { month: 'short', day: 'numeric' });
export const peso = (v: number) => '₱' + Math.abs(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pesoR = (v: number) => '₱' + Math.round(Math.abs(v)).toLocaleString('en-PH');
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function dayLabel(s: string, lang: Language = 'en') {
  const d = diffDays(s, today());
  const t = translator(lang);
  if (d === 0) return t('Today', 'Ngayon', 'Today');
  if (d === 1) return t('Yesterday', 'Kahapon', 'Kahapon');
  return parse(s).toLocaleDateString(dateLocale(lang), { weekday: 'short', month: 'short', day: 'numeric' });
}

// Keeps a typed amount to digits, one dot, 7 whole digits and 2 decimals
export function cleanAmount(raw: string) {
  let v = raw.replace(/[^\d.]/g, '');
  const firstDot = v.indexOf('.');
  if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  const [a, b] = v.split('.');
  return b !== undefined ? a.slice(0, 7) + '.' + b.slice(0, 2) : a.slice(0, 7);
}

export function loadState(): AppState | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || '');
    if (s && Array.isArray(s.expenses) && s.start && s.end) {
      // Drop broken entries (e.g. ₱NaN from an older chat parser) so totals stay correct
      s.expenses = s.expenses.filter((e: Expense) => e && Number.isFinite(Number(e.amount)) && Number(e.amount) > 0);
      return s as AppState;
    }
  } catch {}
  return null;
}

export function compute(state: AppState) {
  const { budget, start, end, expenses } = state;
  // Extra money added this period counts toward what can be spent
  const added = (state.incomes || []).filter(x => x.date >= start && x.date <= end).reduce((s, x) => s + x.amount, 0);
  // The savings goal is set aside first; everything else works off what's left to spend
  const savings = Math.min(budget + added, state.profile?.savings || 0);
  // Upcoming expenses due by the end of this period (or already overdue) are set aside right away
  const reserved = reservedIn(state);
  const spendable = budget + added - savings - reserved;
  const inPeriod = expenses.filter(e => e.date >= start && e.date <= end);
  const spent = inPeriod.reduce((s, e) => s + e.amount, 0);
  const remaining = spendable - spent;
  const pct = spendable > 0 ? (spent / spendable) * 100 : spent > 0 ? 101 : 0;
  const total = diffDays(start, end) + 1;
  const t = today();
  const elapsed = Math.min(total, Math.max(0, diffDays(start, t) + 1));
  const left = Math.min(total, Math.max(0, diffDays(t, end) + 1));
  const timePct = (elapsed / total) * 100;
  const perDay = remaining > 0 && left > 0 ? remaining / left : 0;
  const avgPerDay = elapsed > 0 ? spent / elapsed : 0;
  const projected = avgPerDay * total;
  const byCat = CATS.map(c => ({ ...c, sum: inPeriod.filter(e => e.cat === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter(c => c.sum > 0)
    .sort((a, b) => b.sum - a.sum);
  // Category caps: how much of each limit is used
  const limits = Object.entries(state.limits || {})
    .filter(([, max]) => max > 0)
    .map(([id, max]) => {
      const sum = inPeriod.filter(e => e.cat === id).reduce((s, e) => s + e.amount, 0);
      return { ...catById(id), max, sum, pct: (sum / max) * 100 };
    })
    .sort((a, b) => b.pct - a.pct);

  // Status reacts to both how much is used (pct) and how fast vs. time (pace = pct - timePct)
  const p = Math.round(pct);
  const tp = Math.round(timePct);
  const pace = pct - timePct;
  const lang = langOf(state);
  const tr = translator(lang);
  const days = daysText(left, lang);
  const pd = pesoR(perDay);
  const S = (color: string, chip: [string, string, string], title: [string, string, string], msg: [string, string, string]) =>
    ({ color, chip: tr(...chip), title: tr(...title), msg: tr(...msg) });
  let st: { color: string; chip: string; title: string; msg: string };
  if (pct > 100 || remaining < 0) st = S('#E5484D',
    ['Over budget', 'Lampas na', 'Over budget'],
    ['You’re over budget', 'Lampas ka na sa badyet', 'Over budget ka na'],
    [`You’ve used ${p}% of your budget and are ${peso(-remaining)} over. Stick to essentials until your next allowance.`,
     `Nagamit mo na ang ${p}% ng badyet mo at lampas ka na ng ${peso(-remaining)}. Mga kailangan lang muna ang bilhin hanggang sa susunod mong baon.`,
     `Nagamit mo na ang ${p}% ng budget mo, at over ka na ng ${peso(-remaining)}. Essentials lang muna hanggang next allowance.`]);
  else if (pct >= 95) st = S('#E5484D',
    ['Almost out', 'Paubos na', 'Paubos na'],
    ['Almost out of budget', 'Paubos na ang badyet mo', 'Paubos na ang budget mo'],
    [`${p}% used, with ${peso(remaining)} left for ${days}. Hold off on anything non-essential.`,
     `${p}% na ang nagamit, at ${peso(remaining)} na lang ang natitira para sa ${days}. Ipagpaliban muna ang hindi kailangan.`,
     `${p}% na ang nagamit, ${peso(remaining)} na lang for ${days}. Hold off muna sa non-essentials.`]);
  else if (pct >= 85) st = S('#EA580C',
    ['Careful', 'Mag-ingat', 'Careful'],
    ['Getting close to your limit', 'Malapit ka na sa limit', 'Malapit ka na sa limit'],
    [`${p}% used. You have ${peso(remaining)} left for ${days}, so focus on essentials.`,
     `${p}% na ang nagamit. May ${peso(remaining)} ka pa para sa ${days}, kaya unahin ang mga kailangan.`,
     `${p}% na ang nagamit. May ${peso(remaining)} ka pa for ${days}, kaya focus muna sa essentials.`]);
  else if (left === 0) st = S('#16A34A',
    ['Made it', 'Nakaraos', 'Made it'],
    ['You made it!', 'Nakaraos ka!', 'Nakaraos ka!'],
    [`The period is over and you only used ${p}% of your budget, with ${peso(remaining)} left over. Great job.`,
     `Tapos na ang period at ${p}% lang ng badyet mo ang nagamit, may sobra ka pang ${peso(remaining)}. Ang galing mo!`,
     `Tapos na ang period at ${p}% lang ng budget mo ang nagamit, may ${peso(remaining)} ka pang natira. Great job!`]);
  else if (pace > 25) st = S('#EA580C',
    ['Too fast', 'Masyadong mabilis', 'Too fast'],
    ['Spending too fast', 'Masyadong mabilis ang gastos', 'Masyadong mabilis ang gastos'],
    [`You’ve spent ${p}% of your budget but only ${tp}% of the period has passed. At this pace you’ll run out early. Keep it under ${pd} a day.`,
     `Nagastos mo na ang ${p}% ng badyet mo pero ${tp}% pa lang ng period ang lumilipas. Kung ganito ang takbo, mauubos ito nang maaga. Huwag lumampas sa ${pd} kada araw.`,
     `${p}% na ang nagastos mo pero ${tp}% pa lang ng period ang lumilipas. Sa ganitong pace, mauubos ka nang maaga. Keep it under ${pd} a day.`]);
  else if (pace > 10) st = S('#D97706',
    ['A bit fast', 'Medyo mabilis', 'Medyo mabilis'],
    ['Spending a bit fast', 'Medyo mabilis ang gastos', 'Medyo mabilis ang gastos'],
    [`You’ve spent ${p}% while ${tp}% of the period has passed. Aim for ${pd} a day to make it to the end.`,
     `Nagastos mo na ang ${p}% habang ${tp}% pa lang ng period ang lumilipas. Subukang gumastos ng ${pd} kada araw para umabot ka hanggang dulo.`,
     `${p}% na ang nagastos mo, ${tp}% pa lang ng period. Aim for ${pd} a day para umabot ka hanggang dulo.`]);
  else if (pct >= 70) st = S('#CA8A04',
    ['Watch it', 'Bantayan', 'Ingat'],
    ['Keep an eye on it', 'Bantayan ang gastos', 'Bantayan mo na'],
    [`${p}% used and still on pace, but your cushion is getting thin. Stick to ${pd} a day.`,
     `${p}% na ang nagamit at nasa tamang takbo ka pa, pero numinipis na ang reserba mo. Manatili sa ${pd} kada araw.`,
     `${p}% na ang nagamit at on pace ka pa, pero numinipis na ang cushion mo. Stick to ${pd} a day.`]);
  else if (pct >= 50) st = S('#65A30D',
    ['Halfway', 'Kalahati na', 'Halfway'],
    ['Halfway there', 'Kalahati na', 'Halfway na'],
    [`${p}% spent with ${tp}% of the period gone. You’re right on pace, so keep it around ${pd} a day.`,
     `${p}% na ang nagastos at ${tp}% na ng period ang lumipas. Tama ang takbo mo, kaya panatilihin sa mga ${pd} kada araw.`,
     `${p}% na ang nagastos, ${tp}% na ng period. Sakto ang pace mo, kaya keep it around ${pd} a day.`]);
  else if (pace < -15 && elapsed > 1) st = S('#16A34A',
    ['Great saving', 'Matipid', 'Ang tipid!'],
    ['You’re saving well!', 'Ang tipid mo!', 'Ang tipid mo!'],
    [`Only ${p}% spent with ${tp}% of the period gone. Treat yourself once in a while, or save the extra.`,
     `${p}% pa lang ang nagastos kahit ${tp}% na ng period ang lumipas. Puwede kang mag-treat paminsan-minsan, o itabi mo ang sobra.`,
     `${p}% pa lang ang nagastos kahit ${tp}% na ng period. Treat yourself paminsan-minsan, or ipunin mo ang sobra.`]);
  else if (pct > 0) st = S('#16A34A',
    ['On track', 'Maayos', 'On track'],
    ['You’re on track', 'Maayos ang takbo mo', 'On track ka'],
    [`Only ${p}% used so far. Your pace is fine, and staying under ${pd} a day keeps you safe.`,
     `${p}% pa lang ang nagamit. Maayos ang takbo mo, at ligtas ka kung hindi lalampas sa ${pd} kada araw.`,
     `${p}% pa lang ang nagamit. Okay ang pace mo, at safe ka basta under ${pd} a day.`]);
  else st = S('#16A34A',
    ['Fresh start', 'Bagong simula', 'Fresh start'],
    ['Your budget is untouched', 'Buo pa ang badyet mo', 'Buo pa ang budget mo'],
    [`No spending yet this period. Your safe daily budget is ${pd}.`,
     `Wala ka pang gastos ngayong period. Ang ligtas mong gastos kada araw ay ${pd}.`,
     `Wala ka pang gastos this period. Ang safe daily budget mo ay ${pd}.`]);

  return { added, savings, reserved, spendable, limits, inPeriod, spent, remaining, pct, total, elapsed, left, timePct, perDay, avgPerDay, projected, byCat, st };
}

export type Computed = ReturnType<typeof compute>;

export function groupByDay(list: Expense[]) {
  const groups: { date: string; items: Expense[] }[] = [];
  list.forEach(e => {
    const g = groups[groups.length - 1];
    if (g && g.date === e.date) g.items.push(e);
    else groups.push({ date: e.date, items: [e] });
  });
  return groups;
}

export const newestFirst = (a: Expense, b: Expense) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.ts - a.ts);
