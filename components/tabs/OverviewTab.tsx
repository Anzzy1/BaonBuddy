'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import ExpenseRow from '@/components/ExpenseRow';
import Mascot from '@/components/Mascot';
import { AppState, Computed, dayLabel, groupByDay, newestFirst, pesoR, shortDate } from '@/lib/budget';
import type { TabId } from '@/components/Sidebar';

interface OverviewTabProps {
  state: AppState;
  c: Computed;
  newId: string | null;
  onTab: (t: TabId) => void;
  onSettings: () => void;
}

export default function OverviewTab({ state, c, newId, onTab, onSettings }: OverviewTabProps) {
  const [aiMsg, setAiMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState('');

  // Fetch Buddy feedback on state change
  useEffect(() => {
    const ctrl = new AbortController();
    setAiLoading(true);
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget: state.budget, start: state.start, end: state.end, expenses: state.expenses, prev: aiMsg }),
      signal: ctrl.signal,
    })
      .then(r => r.json())
      .then(d => setAiMsg(d.msg))
      .catch(() => {})
      .finally(() => setAiLoading(false));
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.budget, state.start, state.end, state.expenses]);

  // Typing effect
  useEffect(() => {
    if (aiLoading || !aiMsg) {
      setDisplayedMsg('');
      return;
    }
    let i = 0;
    setDisplayedMsg('');
    const interval = setInterval(() => {
      i++;
      setDisplayedMsg(aiMsg.slice(0, i));
      if (i >= aiMsg.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [aiMsg, aiLoading]);

  const over = c.remaining < 0;
  const [remWhole, remCents] = Math.abs(c.remaining).toFixed(2).split('.');
  const recent = groupByDay([...state.expenses].sort(newestFirst).slice(0, 6));
  const C = 2 * Math.PI * 76;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Hero */}
      <section
        className={`hero reveal lg:col-span-7 flex flex-col justify-between ${over ? 'is-over' : ''}`}
        style={{ '--d': '.05s' } as React.CSSProperties}
        aria-label="Balance summary"
      >
        <svg className="hero-art" viewBox="0 0 340 340" aria-hidden="true">
          <circle cx="170" cy="170" r="118" fill="var(--lime)" />
          <g className="orbit">
            <circle cx="170" cy="170" r="152" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" strokeDasharray="4 8" />
            <circle cx="18" cy="170" r="7" fill="var(--pink)" />
            <circle cx="300" cy="245" r="5" fill="#fff" />
          </g>
        </svg>
        <div className="coin hidden sm:grid" aria-hidden="true">₱</div>

        <div className="p-6 sm:p-8 sm:pr-40">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="chip">
              <span className="status-dot live" />
              <span>{c.st.chip}</span>
            </span>
            <span className="eyebrow">{over ? 'Over budget by' : 'Remaining balance'}</span>
          </div>
          <h1 className="hero-num tnum mt-5" aria-live="polite">
            <span className="peso">₱</span>
            {Number(remWhole).toLocaleString('en-PH')}
            <span className="cents">.{remCents}</span>
          </h1>

          {/* Buddy: friendly real-time feedback on how the baon is going */}
          <div className="buddy mt-7">
            <Mascot
              size={84}
              waving={aiLoading || displayedMsg.length < aiMsg.length}
              talking={!aiLoading && displayedMsg.length < aiMsg.length}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display font-extrabold text-[17px] tracking-tight leading-none">Buddy</p>
                <span className="buddy-live"><span className="status-dot live" />{aiLoading ? 'nag-iisip…' : 'kaibigan mo sa baon'}</span>
              </div>
              <p className="buddy-msg">
                {aiLoading && !displayedMsg ? (
                  <span className="inline-flex items-center gap-1 h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                ) : (
                  <>
                    {displayedMsg}
                    {displayedMsg.length < aiMsg.length && (
                      <span className="inline-block w-[2px] h-[15px] ml-0.5 align-middle animate-pulse bg-[var(--lime)]" />
                    )}
                  </>
                )}
              </p>
              <button type="button" className="buddy-cta" onClick={() => onTab('advisor')}>
                <Icon name="send" />
                Chat with Buddy
              </button>
            </div>
          </div>
        </div>

        <div className="tiles">
          <button className="tile" onClick={onSettings} aria-label="Edit total budget">
            <span className="tile-label eyebrow">Budget <Icon name="pencil" /></span>
            <span className="tile-val tnum">{pesoR(state.budget)}</span>
            <span className="tile-sub">{shortDate(state.start)} – {shortDate(state.end)}</span>
          </button>
          <button className="tile" style={{ '--t': 'var(--lavender)' } as React.CSSProperties} onClick={() => onTab('manage')} aria-label="Manage expenses">
            <span className="tile-label eyebrow">Spent</span>
            <span className="tile-val tnum">{pesoR(c.spent)}</span>
            <span className="tile-sub">{c.inPeriod.length} {c.inPeriod.length === 1 ? 'entry' : 'entries'}</span>
          </button>
          <button className="tile" style={{ '--t': 'var(--peach)' } as React.CSSProperties} onClick={() => onTab('calculator')} aria-label="Open calculator">
            <span className="tile-label eyebrow">Safe / day</span>
            <span className="tile-val tnum">{pesoR(c.perDay)}</span>
            <span className="tile-sub">{c.left > 0 ? `${c.left} day${c.left === 1 ? '' : 's'} left` : 'Period ended'}</span>
          </button>
        </div>
      </section>

      {/* Budget meter */}
      <section className="glass reveal p-6 lg:col-span-5 flex flex-col" style={{ '--d': '.1s' } as React.CSSProperties} aria-label="Budget meter">
        <div className="flex items-center justify-between">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--mint)]"><Icon name="gauge" /></span>Budget meter</h2>
          <span className="text-[13px] text-muted tnum">{pesoR(c.spent)} / {pesoR(state.budget)}</span>
        </div>

        <div className="flex items-center gap-5 sm:gap-6 mt-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              <circle cx="90" cy="90" r="76" className="ring-track" />
              <circle
                cx="90"
                cy="90"
                r="76"
                className="ring-bar"
                style={{
                  strokeDasharray: C,
                  strokeDashoffset: C * (1 - Math.min(c.pct, 100) / 100),
                  opacity: c.pct > 0 ? 1 : 0,
                }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display font-extrabold text-4xl tracking-[-.05em] tnum leading-none">{Math.round(c.pct)}%</p>
                <p className="eyebrow !text-[10px] mt-1.5">used</p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2">
              <span className="status-dot" />
              <span className="font-display font-bold text-xl tracking-tight leading-tight">{c.st.title}</span>
            </p>
            <p className="text-sm text-muted mt-2 leading-relaxed">{c.st.msg}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-muted">Time passed</span><span className="font-medium tnum">Day {c.elapsed} of {c.total}</span></div>
            <div className="bar"><i style={{ width: `${c.timePct}%`, background: 'var(--cobalt)' }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-muted">Money used</span><span className="font-medium tnum">{Math.round(c.pct)}%</span></div>
            <div className="bar"><i style={{ width: `${Math.min(100, c.pct)}%`, background: 'var(--status)' }} /></div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <p className="eyebrow mb-3">Where it&apos;s going</p>
          <div className="split">
            {c.byCat.length > 0
              ? c.byCat.map(x => <i key={x.id} style={{ flexGrow: x.sum, background: x.grad }} title={x.label} />)
              : <i style={{ flexGrow: 1, background: 'var(--soft)' }} />}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[13px]">
            {c.byCat.length > 0
              ? c.byCat.map(x => (
                  <span key={x.id} className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: x.grad }} />
                    {x.label} <span className="text-muted tnum">{pesoR(x.sum)}</span>
                  </span>
                ))
              : <span className="text-muted">Nothing logged in this period yet.</span>}
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="glass reveal p-4 sm:p-6 lg:col-span-12" style={{ '--d': '.15s' } as React.CSSProperties} aria-label="Recent expenses">
        <div className="flex items-center justify-between gap-3 px-2 sm:px-0">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--pink)]"><Icon name="receipt" /></span>Recent gastos</h2>
          <div className="flex gap-2">
            <button type="button" className="pill sm plus" onClick={() => onTab('log')}><Icon name="plus" className="w-3.5 h-3.5" />Log</button>
            <button type="button" className="pill sm" onClick={() => onTab('manage')}>See all</button>
          </div>
        </div>
        <div className="mt-2">
          {recent.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">Wala pang gastos. Log your first one.</p>
          ) : (
            recent.map(g => (
              <div key={g.date}>
                <div className="day-head"><span className="eyebrow">{dayLabel(g.date)}</span></div>
                {g.items.map(e => <ExpenseRow key={e.id} e={e} isNew={e.id === newId} out={e.date < state.start || e.date > state.end} />)}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
