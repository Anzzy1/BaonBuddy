'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import Jar from '@/components/Jar';
import { AppState, Goal, cleanAmount, diffDays, peso, pesoR, shortDate, today, uid } from '@/lib/budget';

interface Props {
  state: AppState;
  goal: Goal | null; // null = new goal
  update: (fn: (prev: AppState) => AppState) => void;
  onClose: () => void;
  showToast: (text: string) => void;
}

export default function GoalSheet({ state, goal, update, onClose, showToast }: Props) {
  const [name, setName] = useState(goal?.name || '');
  const [target, setTarget] = useState(goal?.target ? String(goal.target) : '');
  const [deadline, setDeadline] = useState(goal?.deadline || '');
  const [move, setMove] = useState('');
  const [isMain, setIsMain] = useState(!goal ? !(state.goals || []).length : state.profile?.savingsGoalId === goal.id || (!state.profile?.savingsGoalId && state.goals?.[0]?.id === goal.id));
  const [armDelete, setArmDelete] = useState(false);
  const [err, setErr] = useState('');

  const t = parseFloat(target) || 0;
  const saved = goal?.saved || 0;
  const pct = t > 0 ? (saved / t) * 100 : 0;
  const daysLeft = deadline ? diffDays(today(), deadline) : null;
  // How much to save per week to hit the target by the deadline
  const perWeek = t > saved && daysLeft && daysLeft > 0 ? (t - saved) / Math.max(1, daysLeft / 7) : 0;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Give your goal a name.'); return; }
    const g: Goal = { id: goal?.id || uid(), name: name.trim(), target: Math.round(t * 100) / 100, saved, deadline: deadline || undefined, createdAt: goal?.createdAt || Date.now() };
    update(prev => ({
      ...prev,
      goals: goal ? (prev.goals || []).map(x => (x.id === g.id ? g : x)) : [...(prev.goals || []), g],
      profile: prev.profile && isMain ? { ...prev.profile, savingsGoalId: g.id } : prev.profile,
    }));
    onClose();
    showToast(goal ? 'Goal updated' : 'Goal created');
  };

  const adjust = (sign: 1 | -1) => {
    const v = parseFloat(move);
    if (!goal || !(v > 0)) { setErr('Enter an amount first.'); return; }
    if (sign < 0 && v > saved) { setErr(`You only have ${peso(saved)} in this goal.`); return; }
    update(prev => ({ ...prev, goals: (prev.goals || []).map(x => (x.id === goal.id ? { ...x, saved: Math.round((x.saved + sign * v) * 100) / 100 } : x)) }));
    setMove('');
    setErr('');
    showToast(sign > 0 ? `Added ${pesoR(v)} to ${goal.name}` : `Took ${pesoR(v)} from ${goal.name}`);
    onClose();
  };

  return (
    <Sheet title={goal ? goal.name : 'New savings goal'} sub={goal ? undefined : 'Save up for something that matters to you.'} onClose={onClose} onSubmit={save}>
      {goal && (
        <div className="goal-hero mt-5">
          <Jar pct={pct} size={64} />
          <div className="min-w-0">
            <p className="font-display font-extrabold text-3xl tracking-[-.04em] tnum">{pesoR(saved)}</p>
            <p className="text-sm text-muted">{t > 0 ? `of ${pesoR(t)} · ${Math.min(100, Math.round(pct))}%` : 'saved so far'}</p>
            {perWeek > 0 && <p className="text-[13px] mt-1">Save {pesoR(perWeek)}/week to make it by {shortDate(deadline)}.</p>}
          </div>
        </div>
      )}

      {goal && (
        <div className="mt-5">
          <p className="field-label">Add or take money</p>
          <div className="flex gap-2">
            <div className="amount-field sm !py-2.5 flex-1">
              <span className="peso !text-xl">₱</span>
              <input inputMode="decimal" aria-label="Amount" placeholder="0" value={move} onChange={e => setMove(cleanAmount(e.target.value))} className="!text-2xl" />
            </div>
            <button type="button" className="pill !h-auto px-4" onClick={() => adjust(1)}><Icon name="plus" className="w-4 h-4" />Add</button>
            <button type="button" className="pill !h-auto px-4" onClick={() => adjust(-1)}>Take</button>
          </div>
        </div>
      )}

      <label className="block mt-5"><span className="field-label">Name</span>
        <input className="input" maxLength={30} placeholder="e.g. Laptop, Concert ticket" value={name} onChange={e => setName(e.target.value)} autoFocus={!goal} />
      </label>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <label><span className="field-label">Target <span className="text-muted font-normal">optional</span></span>
          <input className="input tnum" inputMode="decimal" placeholder="₱0" value={target} onChange={e => setTarget(cleanAmount(e.target.value))} />
        </label>
        <label><span className="field-label">By <span className="text-muted font-normal">optional</span></span>
          <input type="date" className="input" value={deadline} min={today()} onChange={e => setDeadline(e.target.value)} />
        </label>
      </div>
      <label className="flex items-center gap-3 mt-4 text-sm cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-[var(--cobalt)]" checked={isMain} onChange={e => setIsMain(e.target.checked)} />
        Put my per-period savings here
      </label>
      {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}

      <button type="submit" className="submit mt-5"><span className="badge"><Icon name="check" /></span>{goal ? 'Save changes' : 'Create goal'}</button>

      {goal && (
        <button
          type="button"
          className="pill sm danger mt-4 mx-auto flex"
          onClick={() => {
            if (!armDelete) { setArmDelete(true); setTimeout(() => setArmDelete(false), 3000); return; }
            update(prev => ({ ...prev, goals: (prev.goals || []).filter(x => x.id !== goal.id) }));
            onClose();
            showToast('Goal deleted');
          }}
        >
          <Icon name="trash-2" className="w-3.5 h-3.5" />{armDelete ? `Delete it and its ${pesoR(saved)}? Tap again` : 'Delete goal'}
        </button>
      )}
    </Sheet>
  );
}
