'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { AppState, Computed, Debt, activeCats, Expense, addDays, catById, cleanAmount, dayLabel, peso, pesoR, shortDate, iso, today, uid } from '@/lib/budget';

interface CalculatorTabProps {
  state: AppState;
  c: Computed;
  onAdd: (e: Expense | Expense[]) => void;
  update: (fn: (prev: AppState) => AppState) => void;
  showToast: (text: string, onUndo?: () => void) => void;
}

const num = (s: string) => parseFloat(s) || 0;

export default function CalculatorTab({ state, c, onAdd, update, showToast }: CalculatorTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Projection state={state} c={c} />
      <Afford c={c} />
      <SavingsGoal c={c} />
      <BillSplit state={state} onAdd={onAdd} update={update} showToast={showToast} />
      <Debts state={state} update={update} showToast={showToast} />
    </div>
  );
}

function Debts({ state, update, showToast }: { state: AppState; update: CalculatorTabProps['update']; showToast: CalculatorTabProps['showToast'] }) {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [dir, setDir] = useState<Debt['dir']>('owed');
  const [note, setNote] = useState('');
  const [showSettled, setShowSettled] = useState(false);
  const [err, setErr] = useState('');
  const all = [...(state.debts || [])].sort((a, b) => b.ts - a.ts);
  const open = all.filter(d => !d.settled);
  const owed = open.filter(d => d.dir === 'owed').reduce((s, d) => s + d.amount, 0);
  const owe = open.filter(d => d.dir === 'owe').reduce((s, d) => s + d.amount, 0);
  const list = showSettled ? all : open;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const v = num(amount);
    if (!person.trim()) { setErr('Who is it with?'); return; }
    if (!(v > 0)) { setErr('Enter an amount greater than ₱0.'); return; }
    const d: Debt = { id: uid(), person: person.trim(), amount: Math.round(v * 100) / 100, dir, note: note.trim(), date: today(), ts: Date.now() };
    update(prev => ({ ...prev, debts: [...(prev.debts || []), d] }));
    setPerson(''); setAmount(''); setNote(''); setErr('');
  };
  const settle = (d: Debt) => {
    update(prev => ({ ...prev, debts: (prev.debts || []).map(x => (x.id === d.id ? { ...x, settled: !x.settled } : x)) }));
    if (!d.settled) showToast(d.dir === 'owed' ? `${d.person} paid you back ${pesoR(d.amount)}` : `You paid ${d.person} ${pesoR(d.amount)}`,
      () => update(prev => ({ ...prev, debts: (prev.debts || []).map(x => (x.id === d.id ? { ...x, settled: false } : x)) })));
  };

  return (
    <Card title="Debts" icon="wallet" color="var(--lavender)" sub="Keep track of who owes you, and who you owe." delay=".18s">
      <div className="grid grid-cols-2 gap-2">
        <div className="debt-sum"><p className="eyebrow">Owed to you</p><p className="tnum text-[#15803D]">{pesoR(owed)}</p></div>
        <div className="debt-sum"><p className="eyebrow">You owe</p><p className="tnum text-[#C2410C]">{pesoR(owe)}</p></div>
      </div>

      <form onSubmit={add} className="mt-4" noValidate>
        <div className="seg w-full !grid grid-cols-2" role="group" aria-label="Direction">
          <button type="button" className="pill sm justify-center" aria-pressed={dir === 'owed'} onClick={() => setDir('owed')}>They owe me</button>
          <button type="button" className="pill sm justify-center" aria-pressed={dir === 'owe'} onClick={() => setDir('owe')}>I owe them</button>
        </div>
        <div className="grid grid-cols-[1fr_7rem] gap-2 mt-3">
          <input className="input" placeholder="Name" maxLength={30} value={person} onChange={e => setPerson(e.target.value)} aria-label="Name" />
          <input className="input tnum" inputMode="decimal" placeholder="₱0" value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} aria-label="Amount" />
        </div>
        <div className="flex gap-2 mt-2">
          <input className="input flex-1" placeholder="What for? (optional)" maxLength={40} value={note} onChange={e => setNote(e.target.value)} aria-label="Note" />
          <button type="submit" className="icon-btn debt-add" aria-label="Add debt"><Icon name="plus" /></button>
        </div>
        {err && <p className="text-sm text-[var(--danger)] mt-2">{err}</p>}
      </form>

      {list.length > 0 && (
        <ul className="mt-4 divide-y divide-[var(--hair)]">
          {list.map(d => (
            <li key={d.id} className={`flex items-center gap-3 py-2.5 ${d.settled ? 'opacity-50' : ''}`}>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium truncate">{d.dir === 'owed' ? `${d.person} owes you` : `You owe ${d.person}`}</span>
                <span className="block text-[12px] text-muted truncate">{d.note ? `${d.note} · ` : ''}{dayLabel(d.date)}</span>
              </span>
              <span className={`text-sm font-semibold tnum ${d.dir === 'owed' ? 'text-[#15803D]' : 'text-[#C2410C]'}`}>{pesoR(d.amount)}</span>
              <button type="button" className="pill sm" onClick={() => settle(d)}>{d.settled ? 'Undo' : 'Settle'}</button>
            </li>
          ))}
        </ul>
      )}
      {all.some(d => d.settled) && (
        <button type="button" className="text-[13px] text-muted mt-3 underline underline-offset-2" onClick={() => setShowSettled(v => !v)}>
          {showSettled ? 'Hide settled' : 'Show settled'}
        </button>
      )}
    </Card>
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
  const leftover = c.spendable - c.projected;
  const lastsDays = c.avgPerDay > 0 ? Math.floor(Math.max(0, c.remaining) / c.avgPerDay) : Infinity;
  const runOut = isFinite(lastsDays) ? iso(addDays(new Date(), lastsDays)) : null;
  const short = runOut && runOut < state.end;
  return (
    <Card title="Pace projection" icon="trending-up" color="var(--mint)" sub="Where your money ends up if you keep spending at this rate." delay=".02s">
      <Line label="Average spent per day" value={peso(c.avgPerDay)} />
      <Line label="Safe to spend per day" value={peso(c.perDay)} />
      <Line label="Projected total by end" value={peso(c.projected)} />
      <Line label={leftover >= 0 ? 'Projected leftover' : 'Projected kulang'} value={peso(leftover)} strong />
      <div className={`result mt-4 ${c.remaining < 0 ? 'bad' : short ? 'warn' : 'good'}`}>
        <p className="text-sm font-medium">
          {c.remaining < 0
            ? `Your budget is used up. You’re ${peso(-c.remaining)} over.`
            : !runOut
              ? 'No spending yet this period, so your money will last.'
              : short
                ? `At this pace you’ll run out around ${shortDate(runOut)}, before ${shortDate(state.end)}. Cut back to ${pesoR(c.perDay)}/day.`
                : `At this pace your money lasts until ${shortDate(state.end)}. Keep it up!`}
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
    <Card title="Can I afford it?" icon="shopping-bag" color="var(--lime)" sub="Thinking of buying something? See how it affects your budget." delay=".06s">
      <Money id="afford" value={price} onChange={setPrice} />
      {verdict && (
        <>
          <div className="mt-4">
            <Line label="Left after" value={(after < 0 ? '−' : '') + peso(after)} />
            <Line label="Safe per day now" value={peso(c.perDay)} />
            <Line label="Safe per day after" value={peso(perDayAfter)} strong />
          </div>
          <div className={`result mt-4 ${verdict}`}>
            <p className="text-sm font-medium">
              {verdict === 'bad'
                ? `Not right now. You’d be ${peso(-after)} short. Wait for your next allowance.`
                : verdict === 'warn'
                  ? `You can, but your daily budget drops by ${Math.round(drop)}%. Think it over.`
                  : `Go for it! It barely affects your daily budget.`}
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
    <Card title="Savings goal" icon="piggy-bank" color="var(--pink)" sub="How much do you want left at the end of the period?" delay=".1s">
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
            <Line label="Your usual per day" value={peso(c.avgPerDay)} />
            <Line label="Max spend per day" value={peso(perDay)} strong />
          </div>
          <div className={`result mt-4 ${verdict}`}>
            <p className="text-sm font-medium">
              {verdict === 'bad'
                ? `That’s more than your remaining ${peso(c.remaining)}. Try a smaller goal.`
                : verdict === 'warn'
                  ? `Doable but tight: you’d need to cut your usual spending by ${Math.round((1 - perDay / c.avgPerDay) * 100)}%.`
                  : `Looks good! Stay under ${pesoR(perDay)}/day and you’ll save ${pesoR(g)}.`}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

function BillSplit({ state, onAdd, update, showToast }: { state: AppState; onAdd: (e: Expense | Expense[]) => void; update: CalculatorTabProps['update']; showToast: CalculatorTabProps['showToast'] }) {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState(2);
  const [extra, setExtra] = useState('');
  const [cat, setCat] = useState(() => activeCats(state)[0].id);
  const t = num(total) + num(extra);
  const share = people > 0 ? Math.ceil((t / people) * 100) / 100 : 0;
  return (
    <Card title="Split the bill" icon="split" color="var(--sky)" sub="Split a bill with friends, then log your share." delay=".14s">
      <Money id="split" value={total} onChange={setTotal} />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="field-label">People</p>
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
              <p className="eyebrow">Your share</p>
              <p className="font-display font-extrabold text-3xl tracking-[-.04em] tnum mt-1">{peso(share)}</p>
            </div>
            <p className="text-[13px] text-muted text-right">{peso(t)} ÷ {people}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4" role="group" aria-label="Category">
            {activeCats(state).map(x => (
              <button key={x.id} type="button" className="pill sm" aria-pressed={cat === x.id} onClick={() => setCat(x.id)}>{x.label}</button>
            ))}
          </div>
          <button
            type="button"
            className="submit mt-4"
            onClick={() => {
              onAdd({ id: uid(), amount: share, cat, date: today(), note: `Split bill (${people} people)`, ts: Date.now() });
              setTotal('');
              setExtra('');
            }}
          >
            <span className="badge"><Icon name="plus" /></span>
            Log {peso(share)} as {catById(cat).label}
          </button>
          {people > 1 && (
            <button
              type="button"
              className="pill sm mt-3 mx-auto flex"
              onClick={() => {
                // You paid the whole bill: everyone else's share becomes money owed to you
                const d: Debt = { id: uid(), person: `${people - 1} friend${people > 2 ? 's' : ''}`, amount: Math.round(share * (people - 1) * 100) / 100, dir: 'owed', note: 'Split bill', date: today(), ts: Date.now() };
                update(prev => ({ ...prev, debts: [...(prev.debts || []), d] }));
                showToast(`Tracking ${pesoR(d.amount)} owed to you`);
              }}
            >
              I paid the whole bill: track {pesoR(share * (people - 1))} owed to me
            </button>
          )}
        </>
      )}
    </Card>
  );
}
