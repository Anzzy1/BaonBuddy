'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import ExpenseRow from '@/components/ExpenseRow';
import { AppState, CATS, Expense, catById, cleanAmount, dayLabel, groupByDay, newestFirst, peso, today, weekRange } from '@/lib/budget';

interface ManageTabProps {
  state: AppState;
  newId: string | null;
  onUpdate: (e: Expense) => void;
  onDelete: (id: string) => void;
}

const RANGES = [
  { id: 'period', label: 'This period' },
  { id: 'week', label: 'This week' },
  { id: 'today', label: 'Today' },
  { id: 'all', label: 'All time' },
] as const;

const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'highest', label: 'Highest' },
  { id: 'lowest', label: 'Lowest' },
] as const;

type RangeId = (typeof RANGES)[number]['id'];
type SortId = (typeof SORTS)[number]['id'];

export default function ManageTab({ state, newId, onUpdate, onDelete }: ManageTabProps) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [range, setRange] = useState<RangeId>('period');
  const [sort, setSort] = useState<SortId>('newest');
  const [editing, setEditing] = useState<Expense | null>(null);

  const inRange = useMemo(() => {
    const [ws, we] = weekRange();
    const t = today();
    return state.expenses.filter(e => {
      if (range === 'period') return e.date >= state.start && e.date <= state.end;
      if (range === 'week') return e.date >= ws && e.date <= we;
      if (range === 'today') return e.date === t;
      return true;
    });
  }, [state, range]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = inRange.filter(
      e => (cat === 'all' || e.cat === cat) && (!q || e.note.toLowerCase().includes(q) || catById(e.cat).label.toLowerCase().includes(q)),
    );
    const sorter: Record<SortId, (a: Expense, b: Expense) => number> = {
      newest: newestFirst,
      oldest: (a, b) => -newestFirst(a, b),
      highest: (a, b) => b.amount - a.amount,
      lowest: (a, b) => a.amount - b.amount,
    };
    return filtered.sort(sorter[sort]);
  }, [inRange, query, cat, sort]);

  const total = list.reduce((s, e) => s + e.amount, 0);
  const biggest = list.reduce<Expense | null>((m, e) => (!m || e.amount > m.amount ? e : m), null);
  const days = new Set(list.map(e => e.date)).size;
  const byDate = sort === 'newest' || sort === 'oldest';

  const exportCsv = () => {
    const rows = [['Date', 'Category', 'Note', 'Amount'], ...list.map(e => [e.date, catById(e.cat).label, e.note, e.amount.toFixed(2)])];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `gastos-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 reveal">
        <Stat label="Total shown" value={peso(total)} sub={`${list.length} ${list.length === 1 ? 'entry' : 'entries'}`} color="var(--lavender)" />
        <Stat label="Avg per entry" value={peso(list.length ? total / list.length : 0)} sub="per gastos" color="var(--peach)" />
        <Stat label="Avg per day" value={peso(days ? total / days : 0)} sub={`${days} active ${days === 1 ? 'day' : 'days'}`} color="var(--sky)" />
        <Stat label="Biggest" value={biggest ? peso(biggest.amount) : '—'} sub={biggest ? biggest.note || catById(biggest.cat).label : 'Nothing yet'} color="var(--pink)" />
      </section>

      <section className="glass reveal p-4 sm:p-6" style={{ '--d': '.05s' } as React.CSSProperties} aria-label="Manage expenses">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 sm:px-0">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--pink)]"><Icon name="list-checks" /></span>Manage gastos</h2>
          <button type="button" className="pill sm plus" onClick={exportCsv} disabled={!list.length}>
            <Icon name="download" className="w-3.5 h-3.5" />Export CSV
          </button>
        </div>

        <div className="mt-4 px-2 sm:px-0 space-y-3">
          <div className="relative">
            <Icon name="search" className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input className="input !pl-11" placeholder="Search notes or category…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search expenses" />
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="seg overflow-x-auto no-scrollbar max-w-full" role="group" aria-label="Date range">
              {RANGES.map(r => (
                <button key={r.id} type="button" className="pill sm" aria-pressed={range === r.id} onClick={() => setRange(r.id)}>{r.label}</button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-[13px] text-muted">
              Sort
              <select className="pill sm !pr-2 cursor-pointer" value={sort} onChange={e => setSort(e.target.value as SortId)}>
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="Filter by category">
            {[{ id: 'all', label: 'All' }, ...CATS].map(f => {
              const n = f.id === 'all' ? inRange.length : inRange.filter(e => e.cat === f.id).length;
              return (
                <button key={f.id} type="button" className="pill sm" aria-pressed={cat === f.id} onClick={() => setCat(f.id)}>
                  {f.label} <span className="opacity-60 tnum">{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2">
          {list.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-[var(--lime)] text-[#0E0E10] mb-4 rotate-6">
                <Icon name="search" />
              </div>
              <p className="font-display font-bold text-xl tracking-tight">Walang nahanap</p>
              <p className="text-sm text-muted mt-1">Try another filter or date range.</p>
            </div>
          ) : byDate ? (
            groupByDay(list).map(g => (
              <div key={g.date}>
                <div className="day-head">
                  <span className="eyebrow">{dayLabel(g.date)}</span>
                  <span className="eyebrow tnum">{peso(g.items.reduce((s, e) => s + e.amount, 0))}</span>
                </div>
                {g.items.map(e => (
                  <ExpenseRow key={e.id} e={e} isNew={e.id === newId} out={e.date < state.start || e.date > state.end} onEdit={setEditing} onDelete={onDelete} />
                ))}
              </div>
            ))
          ) : (
            <div className="pt-3">
              {list.map(e => (
                <ExpenseRow key={e.id} e={e} isNew={e.id === newId} out={e.date < state.start || e.date > state.end} onEdit={setEditing} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </section>

      {editing && <EditDialog expense={editing} onClose={() => setEditing(null)} onSave={e => { onUpdate(e); setEditing(null); }} />}
    </div>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="tile" style={{ '--t': color } as React.CSSProperties}>
      <span className="eyebrow">{label}</span>
      <span className="tile-val tnum">{value}</span>
      <span className="tile-sub">{sub}</span>
    </div>
  );
}

function EditDialog({ expense, onClose, onSave }: { expense: Expense; onClose: () => void; onSave: (e: Expense) => void }) {
  const [amount, setAmount] = useState(String(expense.amount));
  const [cat, setCat] = useState(expense.cat);
  const [date, setDate] = useState(expense.date);
  const [note, setNote] = useState(expense.note);
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!(amt > 0)) return setErr('Enter an amount greater than ₱0.');
    if (!date) return setErr('Pick a date.');
    onSave({ ...expense, amount: Math.round(amt * 100) / 100, cat, date, note: note.trim() });
  };

  return (
    <dialog open className="fixed inset-0 z-50" aria-label="Edit expense" onKeyDown={e => e.key === 'Escape' && onClose()}>
      <form onSubmit={submit} className="sheet" noValidate>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="card-title">Edit gastos</h3>
            <p className="text-sm text-muted mt-1">Ayusin ang amount, category, date o note.</p>
          </div>
          <button type="button" className="icon-btn shrink-0" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>

        <div className="amount-field sm mt-5">
          <span className="peso">₱</span>
          <input inputMode="decimal" aria-label="Amount in pesos" value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} autoFocus />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4" role="group" aria-label="Category">
          {CATS.map(c => (
            <button key={c.id} type="button" className="cat !gap-2 !p-2.5" style={{ '--c': c.color, '--g': c.grad } as React.CSSProperties} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              <span className="ic !w-8 !h-8"><Icon name={c.icon} /></span>
              <span className="text-[12px]">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <label>
            <span className="field-label">Date</span>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <label>
            <span className="field-label">Note</span>
            <input className="input" maxLength={60} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional" />
          </label>
        </div>
        {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}

        <button type="submit" className="submit mt-5">
          <span className="badge"><Icon name="check" /></span>
          Save changes
        </button>
      </form>
    </dialog>
  );
}
