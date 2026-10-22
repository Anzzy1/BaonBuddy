'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { AppState, CATS, Computed, Expense, addDays, catById, cleanAmount, peso, pesoR, shortDate, iso, today, uid } from '@/lib/budget';

interface CalculatorTabProps {
  state: AppState;
  c: Computed;
  onAdd: (e: Expense | Expense[]) => void;
}

const num = (s: string) => parseFloat(s) || 0;

export default function CalculatorTab({ state, c, onAdd }: CalculatorTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Projection state={state} c={c} />
      <Afford c={c} />
      <SavingsGoal c={c} />
      <BillSplit onAdd={onAdd} />
    </div>
  );
}

function Card({ title, icon, color, sub, delay, children }: { title: string; icon: string; color: string; sub: string; delay: string; children: React.ReactNode }) {
  return (
    <section className="glass reveal p-6 self-start" style={{ '--d': delay } as React.CSSProperties} aria-label={title}>
      <h2 className="card-title flex items-center gap-3"><span className="title-ic" style={{ background: color }}><Icon name={icon} /></span>{title}</h2>
      <p className="text-sm text-muted mt-2">{sub}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Money({ id, value, onChange, placeholder = '0' }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="amount-field sm" onClick={() => document.getElementById(id)?.focus()}>
      <span className="peso">₱</span>
      <input id={id} inputMode="decimal" placeholder={placeholder} value={value} onChange={e => onChange(cleanAmount(e.target.value))} />
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-sm py-1">
      <span className="text-muted">{label}</span>
      <span className={`tnum ${strong ? 'font-display font-extrabold text-base tracking-tight' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

function Projection({ state, c }: { state: AppState; c: Computed }) {
  const leftover = state.budget - c.projected;
  const lastsDays = c.avgPerDay > 0 ? Math.floor(Math.max(0, c.remaining) / c.avgPerDay) : Infinity;
  const runOut = isFinite(lastsDays) ? iso(addDays(new Date(), lastsDays)) : null;
  const short = runOut && runOut < state.end;
  return (
    <Card title="Pace projection" icon="trending-up" color="var(--mint)" sub="Kung ganito pa rin ang gastos mo araw-araw, ito ang mangyayari." delay=".02s">
      <Line label="Average gastos per day" value={peso(c.avgPerDay)} />
      <Line label="Safe gastos per day" value={peso(c.perDay)} />
      <Line label="Projected total by end" value={peso(c.projected)} />
      <Line label={leftover >= 0 ? 'Projected leftover' : 'Projected kulang'} value={peso(leftover)} strong />
      <div className={`result mt-4 ${c.remaining < 0 ? 'bad' : short ? 'warn' : 'good'}`}>
        <p className="text-sm font-medium">
          {c.remaining < 0
            ? `Ubos na ang budget. Lampas ka ng ${peso(-c.remaining)}.`
            : !runOut
              ? 'Wala ka pang gastos this period, so tatagal pa ang pera mo.'
              : short
                ? `Sa current pace, mauubos ang pera mo around ${shortDate(runOut)}, bago pa ang ${shortDate(state.end)}. Bawasan sa ${pesoR(c.perDay)}/day.`
                : `Sa current pace, aabot ang pera mo hanggang ${shortDate(state.end)}. Keep it up!`}
        </p>
      </div>
    </Card>
  );
}

function Afford({ c }: { c: Computed }) {
  const [price, setPrice] = useState('');
  const p = num(price);
  const after = c.remaining - p;
  const perDayAfter = after > 0 && c.left > 0 ? after / c.left : 0;
  const drop = c.perDay > 0 ? ((c.perDay - perDayAfter) / c.perDay) * 100 : 100;
  const verdict = !p ? null : after < 0 ? 'bad' : drop > 25 ? 'warn' : 'good';
  return (
    <Card title="Kaya ko ba?" icon="shopping-bag" color="var(--lime)" sub="May gusto kang bilhin? Tingnan kung kakayanin ng budget mo." delay=".06s">
      <Money id="afford" value={price} onChange={setPrice} />
      {verdict && (
        <>
          <div className="mt-4">
            <Line label="Natitira after" value={(after < 0 ? '−' : '') + peso(after)} />
            <Line label="Safe per day ngayon" value={peso(c.perDay)} />
            <Line label="Safe per day after" value={peso(perDayAfter)} strong />
          </div>
          <div className={`result mt-4 ${verdict}`}>
            <p className="text-sm font-medium">
              {verdict === 'bad'
                ? `Hindi kaya. Kulang ka ng ${peso(-after)}. Hintayin muna ang next allowance.`
                : verdict === 'warn'
                  ? `Kaya, pero bababa ng ${Math.round(drop)}% ang daily budget mo. Pag-isipan muna.`
                  : `Kaya mo yan! Maliit lang ang epekto sa daily budget mo.`}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

function SavingsGoal({ c }: { c: Computed }) {
  const [goal, setGoal] = useState('');
  const g = num(goal);
  const spendable = c.remaining - g;
  const perDay = c.left > 0 && spendable > 0 ? spendable / c.left : 0;
  const verdict = !g ? null : spendable <= 0 ? 'bad' : perDay < c.avgPerDay * 0.7 ? 'warn' : 'good';
  return (
    <Card title="Ipon goal" icon="piggy-bank" color="var(--pink)" sub="Magkano gusto mong matira sa dulo ng period?" delay=".1s">
      <Money id="goal" value={goal} onChange={setGoal} placeholder="500" />
      <div className="flex gap-2 mt-3 flex-wrap">
        {[10, 20, 30].map(pct => (
          <button key={pct} type="button" className="pill sm plus" onClick={() => setGoal(String(Math.round(Math.max(0, c.remaining) * pct / 100)))}>
            {pct}% of remaining
          </button>
        ))}
      </div>
      {verdict && (
        <>
          <div className="mt-4">
            <Line label="Pwede mong gastusin" value={peso(Math.max(0, spendable))} />
            <Line label="Usual mo per day" value={peso(c.avgPerDay)} />
            <Line label="Max gastos per day" value={peso(perDay)} strong />
          </div>
          <div className={`result mt-4 ${verdict}`}>
            <p className="text-sm font-medium">
              {verdict === 'bad'
                ? `Mas malaki ang goal kaysa natitira mong ${peso(c.remaining)}. Babaan muna ang goal.`
                : verdict === 'warn'
                  ? `Kaya pero mahigpit: kailangan bawasan ng ${Math.round((1 - perDay / c.avgPerDay) * 100)}% ang usual gastos mo.`
                  : `Sakto! Stay under ${pesoR(perDay)}/day at maiipon mo ang ${pesoR(g)}.`}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

function BillSplit({ onAdd }: { onAdd: (e: Expense | Expense[]) => void }) {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState(2);
  const [extra, setExtra] = useState('');
  const [cat, setCat] = useState('food');
  const t = num(total) + num(extra);
  const share = people > 0 ? Math.ceil((t / people) * 100) / 100 : 0;
  return (
    <Card title="Hatian" icon="split" color="var(--sky)" sub="Split the bill with the tropa, then log your share." delay=".14s">
      <Money id="split" value={total} onChange={setTotal} />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="field-label">Ilang tao</p>
          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn" onClick={() => setPeople(p => Math.max(1, p - 1))} aria-label="Fewer people">−</button>
            <span className="font-display font-extrabold text-2xl tnum w-8 text-center">{people}</span>
            <button type="button" className="icon-btn" onClick={() => setPeople(p => Math.min(50, p + 1))} aria-label="More people"><Icon name="plus" /></button>
          </div>
        </div>
        <label>
          <span className="field-label">Tip / extra</span>
          <input className="input" inputMode="decimal" placeholder="0" value={extra} onChange={e => setExtra(cleanAmount(e.target.value))} />
        </label>
      </div>
      {t > 0 && (
        <>
          <div className="result mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Share mo</p>
              <p className="font-display font-extrabold text-3xl tracking-[-.04em] tnum mt-1">{peso(share)}</p>
            </div>
            <p className="text-[13px] text-muted text-right">{peso(t)} ÷ {people}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4" role="group" aria-label="Category">
            {CATS.map(x => (
              <button key={x.id} type="button" className="pill sm" aria-pressed={cat === x.id} onClick={() => setCat(x.id)}>{x.label}</button>
            ))}
          </div>
          <button
            type="button"
            className="submit mt-4"
            onClick={() => {
              onAdd({ id: uid(), amount: share, cat, date: today(), note: `Hatian (${people} tao)`, ts: Date.now() });
              setTotal('');
              setExtra('');
            }}
          >
            <span className="badge"><Icon name="plus" /></span>
            Log {peso(share)} as {catById(cat).label}
          </button>
        </>
      )}
    </Card>
  );
}
