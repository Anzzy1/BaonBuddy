'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import { AppState, cleanAmount, dayLabel, peso, today, uid } from '@/lib/budget';

const SOURCES = ['Extra allowance', 'Gift', 'Part-time pay', 'Scholarship', 'Other'];

interface Props {
  state: AppState;
  update: (fn: (prev: AppState) => AppState) => void;
  onClose: () => void;
  showToast: (text: string, onUndo?: () => void) => void;
}

export default function AddMoneySheet({ state, update, onClose, showToast }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState(SOURCES[0]);
  const [date, setDate] = useState(today());
  const [err, setErr] = useState('');
  const inPeriod = (state.incomes || []).filter(x => x.date >= state.start && x.date <= state.end).sort((a, b) => b.ts - a.ts);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(amount);
    if (!(v > 0)) { setErr('Enter an amount greater than ₱0.'); return; }
    const inc = { id: uid(), amount: Math.round(v * 100) / 100, note: note.trim() || 'Extra money', date, ts: Date.now() };
    update(prev => ({ ...prev, incomes: [...(prev.incomes || []), inc] }));
    onClose();
    showToast(`Added ${peso(inc.amount)} to your budget`, () => update(prev => ({ ...prev, incomes: (prev.incomes || []).filter(x => x.id !== inc.id) })));
  };

  return (
    <Sheet title="Add money" sub="Got extra this period? It adds to what you can spend." onClose={onClose} onSubmit={submit}>
      <label className="block mt-5" htmlFor="incAmount"><span className="field-label">Amount</span></label>
      <div className="amount-field sm">
        <span className="peso">₱</span>
        <input id="incAmount" inputMode="decimal" placeholder="0" value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} autoFocus />
      </div>

      <p className="field-label mt-4">Source</p>
      <div className="flex gap-2 flex-wrap">
        {SOURCES.map(s => (
          <button key={s} type="button" className="pill sm" aria-pressed={note === s} onClick={() => setNote(s)}>{s}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <label>
          <span className="field-label">Note</span>
          <input className="input" maxLength={40} value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <label>
          <span className="field-label">Date</span>
          <input type="date" className="input" value={date} min={state.start} max={state.end} onChange={e => setDate(e.target.value)} />
        </label>
      </div>
      {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}

      <button type="submit" className="submit mt-5">
        <span className="badge"><Icon name="plus" /></span>
        Add to budget
      </button>

      {inPeriod.length > 0 && (
        <div className="mt-6 pt-5 border-t border-[var(--hair)]">
          <p className="field-label">Added this period</p>
          <ul className="space-y-1">
            {inPeriod.map(x => (
              <li key={x.id} className="flex items-center gap-3 py-1.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">{x.note}</span>
                  <span className="block text-[12px] text-muted">{dayLabel(x.date)}</span>
                </span>
                <span className="text-sm font-semibold tnum text-[#16A34A]">+{peso(x.amount)}</span>
                <button
                  type="button"
                  className="del !opacity-70"
                  aria-label={`Remove ${x.note}`}
                  onClick={() => update(prev => ({ ...prev, incomes: (prev.incomes || []).filter(i => i.id !== x.id) }))}
                >
                  <Icon name="trash-2" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
