'use client';

import Icon from '@/components/Icon';
import Jar from '@/components/Jar';
import { AppState, Goal, pesoR, shortDate, totalSaved } from '@/lib/budget';

export default function GoalsCard({ state, onGoal }: { state: AppState; onGoal: (g: Goal | null) => void }) {
  const goals = state.goals || [];
  const mainId = state.profile?.savingsGoalId || goals[0]?.id;
  return (
    <section className="glass reveal p-5 sm:p-6 lg:col-span-7" style={{ '--d': '.12s' } as React.CSSProperties} aria-label="Savings goals">
      <div className="flex items-center justify-between gap-3">
        <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--mint)]"><Icon name="piggy-bank" /></span>Savings goals</h2>
        <button type="button" className="pill sm plus" onClick={() => onGoal(null)}><Icon name="plus" className="w-3.5 h-3.5" />New</button>
      </div>
      {goals.length ? (
        <>
          <p className="text-sm text-muted mt-1 tnum">{pesoR(totalSaved(state))} saved in total</p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
            {goals.map(g => {
              const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0;
              return (
                <li key={g.id}>
                  <button type="button" className="goal-row" onClick={() => onGoal(g)}>
                    <Jar pct={g.target > 0 ? pct : Math.min(100, g.saved > 0 ? 40 : 0)} size={40} />
                    <span className="min-w-0 flex-1 text-left">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold truncate">{g.name}</span>
                        {g.id === mainId && <span className="goal-tag">Auto</span>}
                      </span>
                      <span className="block text-[13px] text-muted tnum">
                        {pesoR(g.saved)}{g.target > 0 && ` of ${pesoR(g.target)}`}{g.deadline && ` · by ${shortDate(g.deadline)}`}
                      </span>
                      {g.target > 0 && <span className="bar !h-1.5 mt-2 block"><i style={{ width: `${Math.min(100, pct)}%`, background: pct >= 100 ? '#16A34A' : 'var(--cobalt)' }} /></span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <button type="button" className="goal-empty mt-4" onClick={() => onGoal(null)}>
          <Jar pct={0} size={44} />
          <span className="text-left">
            <span className="block font-semibold">Start a savings goal</span>
            <span className="block text-[13px] text-muted">A laptop, a trip, a concert ticket. Watch the jar fill up.</span>
          </span>
        </button>
      )}
    </section>
  );
}
