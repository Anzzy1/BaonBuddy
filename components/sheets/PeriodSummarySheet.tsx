'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import {
  AppState, LeftoverChoice, cleanAmount, closePeriod, compute, nextCustomRange, pesoR, settleLeftover, shortDate, uid,
} from '@/lib/budget';

interface Props {
  state: AppState;
  update: (fn: (prev: AppState) => AppState) => void;
  onClose: () => void;
  showToast: (text: string) => void;
}

// Shown when a period ends: a recap, then what to do with the leftover.
// For custom periods it also starts the next one.
export default function PeriodSummarySheet({ state, update, onClose, showToast }: Props) {
  const rec = state.history?.find(r => r.id === state.pendingClose);
  const goals = state.goals || [];
  const [choice, setChoice] = useState<LeftoverChoice>('goal');
  const [goalId, setGoalId] = useState(rec?.goalId || goals[0]?.id || '');
  const [range, setRange] = useState(() => nextCustomRange(state));
  const [budget, setBudget] = useState(String(state.budget));
  const [err, setErr] = useState('');

  // Custom period that ended: recap the live numbers and pick the next dates
  if (!rec) {
    const c = compute(state);
    const start = (e: React.FormEvent) => {
      e.preventDefault();
      const b = parseFloat(budget);
      if (!(b > 0)) { setErr('Enter an allowance greater than ₱0.'); return; }
      if (!range[0] || !range[1] || range[1] < range[0]) { setErr('Pick a valid start and end date.'); return; }
      update(prev => closePeriod(prev, { start: range[0], end: range[1], budget: Math.round(b * 100) / 100 }));
    };
    return (
      <Sheet title="Your period has ended" sub={`${shortDate(state.start)} – ${shortDate(state.end)}`} onClose={onClose} onSubmit={start}>
        <Recap rows={[['Spent', pesoR(c.spent)], ['Saved', pesoR(Math.max(0, c.savings + Math.min(0, c.remaining)))], ['Left over', pesoR(Math.max(0, c.remaining))]]} />
        <p className="field-label mt-6">Next period</p>
        <div className="grid grid-cols-2 gap-2">
          <label><span className="field-label !font-normal text-muted">Starts</span><input type="date" className="input" value={range[0]} onChange={e => setRange([e.target.value, range[1]])} /></label>
          <label><span className="field-label !font-normal text-muted">Ends</span><input type="date" className="input" value={range[1]} onChange={e => setRange([range[0], e.target.value])} /></label>
        </div>
        <label className="block mt-3" htmlFor="nextBudget"><span className="field-label">Allowance</span></label>
        <div className="amount-field sm">
          <span className="peso">₱</span>
          <input id="nextBudget" inputMode="decimal" value={budget} onChange={e => setBudget(cleanAmount(e.target.value))} />
        </div>
        {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}
        <button type="submit" className="submit mt-5"><span className="badge"><Icon name="arrow-right" /></span>Start new period</button>
      </Sheet>
    );
  }

  const done = (e: React.FormEvent) => {
    e.preventDefault();
    update(prev => {
      // No goals yet: the leftover starts a General savings goal
      if (rec.leftover > 0 && choice === 'goal' && !goalId) {
        const g = { id: uid(), name: 'General savings', target: 0, saved: 0, createdAt: Date.now() };
        return settleLeftover({ ...prev, goals: [...(prev.goals || []), g] }, rec.id, 'goal', g.id);
      }
      return settleLeftover(prev, rec.id, rec.leftover > 0 ? choice : 'keep', goalId);
    });
    onClose();
    if (rec.leftover > 0) {
      showToast(choice === 'goal' ? `${pesoR(rec.leftover)} moved to savings` : choice === 'carry' ? `${pesoR(rec.leftover)} carried over` : 'Period closed');
    }
  };

  const goalName = goals.find(g => g.id === rec.goalId)?.name || 'savings';
  return (
    <Sheet title="Period recap" sub={`${shortDate(rec.start)} – ${shortDate(rec.end)}`} onClose={onClose} onSubmit={done}>
      <Recap rows={[
        ['Allowance', pesoR(rec.budget) + (rec.added ? ` + ${pesoR(rec.added)}` : '')],
        ['Spent', pesoR(rec.spent)],
        ['Saved', rec.saved ? `${pesoR(rec.saved)} → ${goalName}` : '₱0'],
        ['Left over', pesoR(rec.leftover)],
      ]} />

      {rec.leftover > 0 ? (
        <>
          <p className="field-label mt-6">What should happen to the {pesoR(rec.leftover)} left over?</p>
          <div className="space-y-2" role="radiogroup" aria-label="Leftover">
            <Choice on={choice === 'goal'} onClick={() => setChoice('goal')} icon="piggy-bank" title="Add to a savings goal" sub="Grow your savings with it." />
            {choice === 'goal' && (
              goals.length ? (
                <select className="input" value={goalId} onChange={e => setGoalId(e.target.value)} aria-label="Goal">
                  {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              ) : <p className="text-[13px] text-muted px-1">No goals yet. It will go to General savings.</p>
            )}
            <Choice on={choice === 'carry'} onClick={() => setChoice('carry')} icon="arrow-right" title="Carry over" sub="Add it to this period’s budget." />
            <Choice on={choice === 'keep'} onClick={() => setChoice('keep')} icon="wallet" title="Keep it, don’t track" sub="It stays in your pocket." />
          </div>
        </>
      ) : (
        <p className="text-sm text-muted mt-5">Nothing left over this time. A new period has started, good luck!</p>
      )}
      {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}
      <button type="submit" className="submit mt-5"><span className="badge"><Icon name="check" /></span>Done</button>
    </Sheet>
  );
}

function Recap({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="onb-recap mt-5">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

function Choice({ on, onClick, icon, title, sub }: { on: boolean; onClick: () => void; icon: string; title: string; sub: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} className="choice" onClick={onClick}>
      <span className="choice-ic"><Icon name={icon} /></span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-semibold text-[14px]">{title}</span>
        <span className="block text-[12.5px] text-muted">{sub}</span>
      </span>
      <span className="choice-dot" />
    </button>
  );
}
