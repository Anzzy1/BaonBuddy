'use client';

import Icon from '@/components/Icon';
import CatIcon from '@/components/CatIcon';
import { AppState, Computed, parse, pesoR, shortDate } from '@/lib/budget';
import { trends } from '@/lib/insights';

export default function TrendsCard({ state, c }: { state: AppState; c: Computed }) {
  const t = trends(state);
  const max = Math.max(1, ...t.days.map(d => d.sum));
  const up = t.weekChange !== null && t.weekChange > 0;
  return (
    <section className="glass reveal p-5 sm:p-6 lg:col-span-5" style={{ '--d': '.14s' } as React.CSSProperties} aria-label="Trends">
      <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--sky)]"><Icon name="trending-up" /></span>Trends</h2>

      <div className="flex items-end justify-between gap-4 mt-4">
        <div>
          <p className="eyebrow">Last 7 days</p>
          <p className="font-display font-extrabold text-3xl tracking-[-.04em] tnum mt-1">{pesoR(t.thisWeek)}</p>
          <p className="text-[13px] mt-1">
            {t.weekChange === null
              ? <span className="text-muted">No data from the week before yet</span>
              : <span className={up ? 'text-[#C2410C]' : 'text-[#15803D]'}>{up ? '▲' : '▼'} {Math.abs(Math.round(t.weekChange))}% vs previous 7 days ({pesoR(t.lastWeek)})</span>}
          </p>
        </div>
        <div className="week-bars" aria-hidden="true">
          {t.days.map(d => (
            <span key={d.date} title={`${shortDate(d.date)}: ${pesoR(d.sum)}`}>
              <i style={{ height: `${Math.max(4, (d.sum / max) * 100)}%` }} />
              <b>{parse(d.date).toLocaleDateString('en-PH', { weekday: 'narrow' })}</b>
            </span>
          ))}
        </div>
      </div>

      {(t.rising.length > 0 || t.falling.length > 0) && (
        <div className="mt-5">
          <p className="eyebrow mb-2">This month vs last month</p>
          <ul className="space-y-1.5">
            {[...t.rising, ...t.falling].map(x => (
              <li key={x.id} className="flex items-center gap-3 text-sm" style={{ '--c': x.color } as React.CSSProperties}>
                <span className="ic mini-ic"><CatIcon id={x.id} /></span>
                <span className="flex-1 min-w-0 truncate">{x.label}</span>
                <span className={`tnum font-medium ${x.diff > 0 ? 'text-[#C2410C]' : 'text-[#15803D]'}`}>{x.diff > 0 ? '+' : '−'}{pesoR(x.diff)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.limits.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow mb-2">Category limits</p>
          <ul className="space-y-2.5">
            {c.limits.map(l => (
              <li key={l.id}>
                <div className="flex justify-between text-sm mb-1"><span>{l.label}</span><span className="tnum text-muted">{pesoR(l.sum)} / {pesoR(l.max)}</span></div>
                <div className="bar !h-1.5"><i style={{ width: `${Math.min(100, l.pct)}%`, background: l.pct >= 100 ? '#E5484D' : l.pct >= 80 ? '#EA580C' : l.color }} /></div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {t.history.length > 0 && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="eyebrow">Past periods</p>
            <p className="text-[12px] text-muted tnum">{pesoR(t.savedAllTime)} saved so far</p>
          </div>
          <ul className="divide-y divide-[var(--hair)]">
            {t.history.slice(0, 5).map(r => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-muted tnum">{shortDate(r.start)}{r.start !== r.end && ` – ${shortDate(r.end)}`}</span>
                <span className="tnum">Spent {pesoR(r.spent)} · <b className="font-semibold text-[#15803D]">saved {pesoR(r.saved + (r.leftoverTo === 'goal' ? r.leftover : 0))}</b></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
