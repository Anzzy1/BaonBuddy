export interface Expense {
  id: string;
  cat: string;
  amount: number;
  note: string;
  date: string;
  ts: number;
}

export interface AppState {
  budget: number;
  start: string;
  end: string;
  expenses: Expense[];
}

export const KEY = 'estudyante-balanse.v1';

export const CATS = [
  { id: 'food', label: 'Food', icon: 'utensils', color: '#FF6B5E', grad: 'linear-gradient(135deg, #FF9A3D, #FF4D8D)' },
  { id: 'transpo', label: 'Transpo', icon: 'bus', color: '#34A3FF', grad: 'linear-gradient(135deg, #2FD3FF, #3A6BFF)' },
  { id: 'school', label: 'School Supplies', icon: 'pencil-ruler', color: '#7C55FA', grad: 'linear-gradient(135deg, #B07BFF, #5B3DF5)' },
  { id: 'load', label: 'Load & Data', icon: 'smartphone', color: '#1FC2A9', grad: 'linear-gradient(135deg, #3BE6A4, #0E9FB5)' },
  { id: 'gala', label: 'Gala', icon: 'party-popper', color: '#E14AD6', grad: 'linear-gradient(135deg, #FF72D2, #B522E0)' },
  { id: 'other', label: 'Others', icon: 'shapes', color: '#FFA41F', grad: 'linear-gradient(135deg, #FFD23D, #FF8A00)' },
];

export const catById = (id: string) => CATS.find(c => c.id === id) || CATS[CATS.length - 1];

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
export const shortDate = (s: string) => parse(s).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
export const peso = (v: number) => '₱' + Math.abs(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pesoR = (v: number) => '₱' + Math.round(Math.abs(v)).toLocaleString('en-PH');
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function dayLabel(s: string) {
  const d = diffDays(s, today());
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return parse(s).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Keeps a typed amount to digits, one dot, 7 whole digits and 2 decimals
export function cleanAmount(raw: string) {
  let v = raw.replace(/[^\d.]/g, '');
  const firstDot = v.indexOf('.');
  if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
  const [a, b] = v.split('.');
  return b !== undefined ? a.slice(0, 7) + '.' + b.slice(0, 2) : a.slice(0, 7);
}

export function sampleState(): AppState {
  const [start, end] = monthRange();
  const t = new Date();
  const d = (n: number) => {
    const x = iso(addDays(t, -n));
    return x < start ? start : x;
  };
  const raw: [number, string, number, string][] = [
    [0, 'food', 85, 'Siomai rice + gulaman'],
    [0, 'transpo', 26, 'Jeep papunta at pauwi'],
    [1, 'school', 150, 'Yellow pad + ballpen'],
    [1, 'load', 99, 'Data promo'],
    [1, 'food', 65, 'Fishball break'],
    [2, 'gala', 220, 'Milk tea with the tropa'],
    [2, 'transpo', 26, ''],
    [3, 'school', 45, 'Printing ng reviewer'],
    [4, 'food', 120, 'Tapsilog'],
    [5, 'other', 350, 'Ambag sa group project'],
    [6, 'transpo', 26, ''],
    [6, 'food', 95, 'Lunch sa karinderya'],
  ];
  const ts = Date.now();
  return {
    budget: 5000,
    start,
    end,
    expenses: raw.map(([n, cat, amount, note], i) => ({
      id: uid(),
      cat,
      amount,
      note,
      date: d(n),
      ts: ts - i * 1000,
    })),
  };
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
  const inPeriod = expenses.filter(e => e.date >= start && e.date <= end);
  const spent = inPeriod.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - spent;
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
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

  // Status reacts to both how much is used (pct) and how fast vs. time (pace = pct - timePct)
  const p = Math.round(pct);
  const tp = Math.round(timePct);
  const pace = pct - timePct;
  const days = `${left} day${left === 1 ? '' : 's'}`;
  let st: { color: string; chip: string; title: string; msg: string };
  if (pct > 100) st = { color: '#E5484D', chip: 'Lagpas na', title: 'Over budget ka na', msg: `${p}% na ng allowance ang nagastos mo, lampas ka ng ${peso(-remaining)}. Tiis muna ha, darating din next allowance.` };
  else if (pct >= 95) st = { color: '#E5484D', chip: 'Halos ubos', title: 'Halos ubos na', msg: `${p}% na ang nagamit, ${peso(remaining)} na lang for ${days}. Bawal na muna ang hindi kailangan.` };
  else if (pct >= 85) st = { color: '#EA580C', chip: 'Ingat', title: 'Malapit na sa limit', msg: `${p}% na ang nagamit. ${peso(remaining)} na lang yan for ${days}. Essentials muna, okay lang yan.` };
  else if (left === 0) st = { color: '#16A34A', chip: 'Nakaabot', title: 'Nakaabot ka!', msg: `Tapos na period at ${p}% lang ang nagastos mo. May ${peso(remaining)} kang natira. Nice.` };
  else if (pace > 25) st = { color: '#EA580C', chip: 'Sobrang bilis', title: 'Sobrang bilis ng gastos', msg: `${p}% na ang nagastos pero ${tp}% pa lang ng panahon ang lumipas. Kung ganito tuloy, mauubos bago matapos ang period. Max ${pesoR(perDay)} per day muna.` };
  else if (pace > 10) st = { color: '#D97706', chip: 'Medyo mabilis', title: 'Medyo mabilis ang gastos', msg: `Nagastos ka na ng ${p}%, pero ${tp}% lang ng panahon ang lumipas. Bawasan mo ha, ${pesoR(perDay)} per day para umabot.` };
  else if (pct >= 70) st = { color: '#CA8A04', chip: 'Bantayan', title: 'Bantayan na', msg: `${p}% na ang nagamit at sakto pa sa oras, pero kaunti na lang ang cushion. Stick sa ${pesoR(perDay)} per day.` };
  else if (pct >= 50) st = { color: '#65A30D', chip: 'Kalahati na', title: 'Kalahati na', msg: `${p}% na ang nagastos, ${tp}% ng panahon ang lumipas. Sakto ang pace mo, ituloy lang sa ${pesoR(perDay)} per day.` };
  else if (pace < -15 && elapsed > 1) st = { color: '#16A34A', chip: 'Ang tipid', title: 'Ang tipid mo!', msg: `${p}% pa lang ang nagastos pero ${tp}% na ng panahon ang lumipas. Pwede ka mag-treat minsan, o itabi ang sobra.` };
  else if (pct > 0) st = { color: '#16A34A', chip: 'Sakto pa', title: 'Chill ka pa', msg: `${p}% pa lang ang nagamit. Okay lang pace mo, subukan mong bumaba sa ${pesoR(perDay)} per day para safe ka.` };
  else st = { color: '#16A34A', chip: 'Fresh start', title: 'Buo pa ang baon', msg: `Wala ka pang gastos ngayong period. ${pesoR(perDay)} per day ang safe mong budget.` };

  return { inPeriod, spent, remaining, pct, total, elapsed, left, timePct, perDay, avgPerDay, projected, byCat, st };
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
