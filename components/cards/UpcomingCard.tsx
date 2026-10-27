'use client';

import Icon from '@/components/Icon';
import CatIcon from '@/components/CatIcon';
import { AppState, Computed, Upcoming, catById, langOf, pesoR, shortDate } from '@/lib/budget';
import { Language, translator } from '@/lib/i18n';
import { daysUntil } from '@/lib/upcoming';

interface Props {
  state: AppState;
  c: Computed;
  onOpen: (u: Upcoming | null) => void;
  onPay: (u: Upcoming) => void;
}

// "Nov 15 · in 18 days", "Due tomorrow", "Overdue · Nov 1"
export function dueLabel(u: Upcoming, end: string, lang: Language) {
  const t = translator(lang);
  const d = daysUntil(u.due);
  const date = shortDate(u.due, lang);
  const when = d < 0 ? t(`Overdue · ${date}`, `Lampas na sa takdang araw · ${date}`, `Overdue · ${date}`)
    : d === 0 ? t('Due today', 'Ngayon ang bayad', 'Due today')
    : d === 1 ? t('Due tomorrow', 'Bukas ang bayad', 'Due bukas')
    : t(`${date} · in ${d} days`, `${date} · ${d} araw pa`, `${date} · in ${d} days`);
  // Due after this period: set aside once the next period starts
  return u.due > end ? `${when} · ${t('next period', 'susunod na period', 'next period')}` : when;
}

export default function UpcomingCard({ state, c, onOpen, onPay }: Props) {
  const lang = langOf(state);
  const t = translator(lang);
  const list = [...(state.upcoming || [])].sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.ts - b.ts));

  return (
    <section className="glass reveal p-5 sm:p-6 lg:col-span-12" style={{ '--d': '.11s' } as React.CSSProperties} aria-label="Upcoming expenses">
      <div className="flex items-center justify-between gap-3">
        <h2 className="card-title flex items-center gap-3">
          <span className="title-ic bg-[var(--peach)]"><Icon name="calendar-clock" /></span>
          {t('Coming up', 'Parating na gastos', 'Parating na gastos')}
        </h2>
        <button type="button" className="pill sm plus" onClick={() => onOpen(null)}><Icon name="plus" className="w-3.5 h-3.5" />{t('Add', 'Dagdag', 'Add')}</button>
      </div>

      {list.length ? (
        <>
          {c.reserved > 0 && (
            <p className="text-sm text-muted mt-1 tnum">
              {t(`${pesoR(c.reserved)} set aside, already taken out of your safe/day.`,
                 `${pesoR(c.reserved)} nakatabi na, bawas na sa ligtas mong gastos kada araw.`,
                 `${pesoR(c.reserved)} nakatabi na, bawas na sa safe/day mo.`)}
            </p>
          )}
          <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
            {list.map(u => {
              const d = daysUntil(u.due);
              const urgent = d <= 1;
              return (
                <li key={u.id} className="goal-row !p-2.5 !pr-2.5 min-w-0" style={{ '--c': catById(u.cat).color } as React.CSSProperties}>
                  <button type="button" className="flex items-center gap-3 min-w-0 flex-1 text-left" onClick={() => onOpen(u)}>
                    <span className="ic mini-ic shrink-0"><CatIcon id={u.cat} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold truncate">{u.name}</span>
                      <span className={`block text-[12.5px] truncate ${urgent ? 'text-[var(--danger)] font-medium' : 'text-muted'}`}>{dueLabel(u, state.end, lang)}</span>
                    </span>
                    <span className="font-display font-bold tnum shrink-0 text-[15px]">{pesoR(u.amount)}</span>
                  </button>
                  <button type="button" className="pill sm shrink-0 !px-2.5" onClick={() => onPay(u)} aria-label={t(`Mark ${u.name} as paid`, `Markahang bayad na ang ${u.name}`, `I-mark as paid ang ${u.name}`)}>
                    <Icon name="check" className="w-3.5 h-3.5" />{t('Paid', 'Bayad na', 'Paid')}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <button type="button" className="goal-empty mt-4" onClick={() => onOpen(null)}>
          <span className="title-ic bg-[var(--peach)] shrink-0"><Icon name="calendar-clock" /></span>
          <span className="text-left">
            <span className="block font-semibold">{t('Add something that’s coming up', 'Maglista ng parating na gastos', 'Mag-add ng parating na gastos')}</span>
            <span className="block text-[13px] text-muted">
              {t('Rent, ambag, thesis printing. Buddy sets the money aside now and reminds you before it’s due.',
                 'Renta, ambag, pagpapa-print ng thesis. Itatabi agad ni Buddy ang pera at magpapaalala bago ang takdang araw.',
                 'Renta, ambag, thesis printing. Itatabi agad ni Buddy ang pera at ire-remind ka bago mag-due.')}
            </span>
          </span>
        </button>
      )}
    </section>
  );
}
