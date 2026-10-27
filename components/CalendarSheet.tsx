'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import ExpenseRow from '@/components/ExpenseRow';
import { AppState, Computed, addDays, iso, newestFirst, parse, peso, pesoR, shortDate, today } from '@/lib/budget';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarSheetProps {
  state: AppState;
  c: Computed;
  ios: boolean;
  onClose: () => void;
}

// Spending calendar: each day of the period is shaded by how it went against the daily limit
export default function CalendarSheet({ state, c, ios, onClose }: CalendarSheetProps) {
  const t = today();
  const initial = t < state.start ? state.start : t > state.end ? state.end : t;
  const [selected, setSelected] = useState(initial);
  const [month, setMonth] = useState(() => { const d = parse(initial); return new Date(d.getFullYear(), d.getMonth(), 1); });

  // Even split of what's spendable across the period, so past days are judged fairly
  const limit = c.total > 0 ? c.spendable / c.total : 0;
  const byDay = new Map<string, number>();
  state.expenses.forEach(e => byDay.set(e.date, (byDay.get(e.date) || 0) + e.amount));

  const lead = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => iso(addDays(month, i)))];
  const shift = (n: number) => setMonth(m => new Date(m.getFullYear(), m.getMonth() + n, 1));

  const level = (d: string) => {
    const spent = byDay.get(d) || 0;
    if (d < state.start || d > state.end) return 'out';
    if (d > t) return 'future';
    if (!spent) return 'zero';
    if (spent <= limit) return 'ok';
    if (spent <= limit * 1.5) return 'warn';
    return 'over';
  };

  const dayItems = state.expenses.filter(e => e.date === selected).sort(newestFirst);
  const daySpent = byDay.get(selected) || 0;
  const inPeriod = selected >= state.start && selected <= state.end;
  const elapsedDays = Array.from({ length: c.elapsed }, (_, i) => iso(addDays(parse(state.start), i)));
  const underDays = elapsedDays.filter(d => (byDay.get(d) || 0) <= limit).length;
  const noSpendDays = elapsedDays.filter(d => !byDay.get(d)).length;

  return (
    <dialog open className="fixed inset-0 z-50" aria-label="Spending calendar" onKeyDown={e => e.key === 'Escape' && onClose()}>
      {ios && <div className="ios-scrim" onClick={onClose} aria-hidden />}
      <div className="sheet">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="card-title">Spending calendar</h3>
            <p className="text-sm text-muted mt-1 tnum">
              {shortDate(state.start)} – {shortDate(state.end)} · {c.left > 0 ? `${c.left} day${c.left === 1 ? '' : 's'} left` : 'Period ended'}
            </p>
          </div>
          <button type="button" className="icon-btn shrink-0" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>

        <div className="cal-stats mt-4">
          <div><p className="eyebrow">Per day</p><p className="tnum">{pesoR(limit)}</p></div>
          <div><p className="eyebrow">On target</p><p className="tnum">{underDays}/{c.elapsed}</p></div>
          <div><p className="eyebrow">No-spend</p><p className="tnum">{noSpendDays} day{noSpendDays === 1 ? '' : 's'}</p></div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <button type="button" className="icon-btn !w-9 !h-9" onClick={() => shift(-1)} aria-label="Previous month"><Icon name="arrow-left" /></button>
          <p className="font-semibold">{month.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</p>
          <button type="button" className="icon-btn !w-9 !h-9" onClick={() => shift(1)} aria-label="Next month"><Icon name="arrow-right" /></button>
        </div>

        <div className="cal-grid mt-3" role="grid" aria-label="Days">
          {WEEKDAYS.map((w, i) => <span key={i} className="cal-wd">{w}</span>)}
          {cells.map((d, i) => d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              className={`cal-day is-${level(d)} ${d === t ? 'is-today' : ''}`}
              aria-pressed={d === selected}
              aria-label={`${shortDate(d)}, ${peso(byDay.get(d) || 0)} spent`}
              onClick={() => setSelected(d)}
            >
              <span className="n">{parse(d).getDate()}</span>
              {(byDay.get(d) || 0) > 0 && <span className="v">{pesoR(byDay.get(d)!)}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-3 text-[11px] text-muted flex-wrap">
          <span className="cal-key is-ok" />Within limit
          <span className="cal-key is-warn" />A bit over
          <span className="cal-key is-over" />Way over
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--hair)]">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold">{parse(selected).toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p className="text-sm tnum">
              <span className="font-semibold">{peso(daySpent)}</span>
              {inPeriod && <span className="text-muted"> / {pesoR(limit)}</span>}
            </p>
          </div>
          {dayItems.length ? (
            <div className="mt-2 -mx-2">{dayItems.map(e => <ExpenseRow key={e.id} e={e} />)}</div>
          ) : (
            <p className="text-sm text-muted mt-2">{selected > t ? 'This day hasn’t happened yet.' : 'No spending on this day. Nice!'}</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
