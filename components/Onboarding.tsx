'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import CatIcon from '@/components/CatIcon';
import Mascot from '@/components/Mascot';
import Logo from '@/components/Logo';
import Avatar, { AVATARS, SKINS, avatarId, parseAvatar } from '@/components/Avatar';
import {
  AppState, CATS, DEFAULT_CATS, Period, REQUIRED_CAT, cleanAmount, diffDays, periodRange, pesoR, shortDate, uid,
} from '@/lib/budget';

const STEPS = ['name', 'allowance', 'cats', 'savings', 'done'] as const;
type Step = 'welcome' | (typeof STEPS)[number];

const PERIODS: { id: Period; label: string; per: string; quick: number[] }[] = [
  { id: 'daily', label: 'Daily', per: 'a day', quick: [100, 150, 200, 300] },
  { id: 'weekly', label: 'Weekly', per: 'a week', quick: [500, 1000, 1500, 2000] },
  { id: 'monthly', label: 'Monthly', per: 'a month', quick: [3000, 5000, 8000, 10000] },
  { id: 'custom', label: 'Custom', per: 'for this period', quick: [1000, 3000, 5000] },
];

interface OnboardingProps {
  // Data already on the device (from before onboarding existed). Kept as is.
  existing: AppState | null;
  onDone: (state: AppState) => void;
}

export default function Onboarding({ existing, onDone }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [period, setPeriod] = useState<Period>(existing ? 'custom' : 'weekly');
  const [amount, setAmount] = useState(existing?.budget ? String(existing.budget) : '');
  const [start, setStart] = useState(existing?.start || periodRange('weekly')[0]);
  const [end, setEnd] = useState(existing?.end || periodRange('weekly')[1]);
  const [cats, setCats] = useState<string[]>(DEFAULT_CATS);
  const [savings, setSavings] = useState('');
  const [goalName, setGoalName] = useState('');
  const [err, setErr] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const idx = step === 'welcome' ? -1 : STEPS.indexOf(step);
  const budget = parseFloat(amount) || 0;
  const save = Math.min(parseFloat(savings) || 0, budget);
  const days = Math.max(1, diffDays(start, end) + 1);
  const p = PERIODS.find(x => x.id === period)!;
  const firstName = name.trim().split(/\s+/)[0];
  const { preset, tone } = parseAvatar(avatar);

  const fail = (msg: string) => { setErr(msg); setShakeKey(k => k + 1); };
  const go = (s: Step) => { setErr(''); setStep(s); window.scrollTo({ top: 0 }); };
  const back = () => go(idx <= 0 ? 'welcome' : STEPS[idx - 1]);

  const pickPeriod = (id: Period) => {
    setPeriod(id);
    if (id !== 'custom') { const [s, e] = periodRange(id); setStart(s); setEnd(e); }
  };

  const next = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step === 'name' && !name.trim()) return fail('What should Buddy call you?');
    if (step === 'allowance') {
      if (!(budget > 0)) return fail('Enter your allowance, greater than ₱0.');
      if (!start || !end) return fail('Pick both a start and an end date.');
      if (end < start) return fail('The end date has to come after the start date.');
    }
    if (step === 'savings' && save >= budget) return fail('Leave something to spend. Your goal has to be less than your allowance.');
    if (step === 'done') return finish();
    go(STEPS[idx + 1]);
  };

  const finish = () => {
    // Saving something: start their first goal so the per-period savings have somewhere to go
    const goal = save > 0 || goalName.trim()
      ? { id: uid(), name: goalName.trim() || 'General savings', target: 0, saved: 0, createdAt: Date.now() }
      : null;
    onDone({
      budget: Math.round(budget * 100) / 100,
      start,
      end,
      expenses: existing?.expenses || [],
      goals: goal ? [goal] : [],
      profile: {
        name: name.trim(),
        avatar,
        period,
        cats,
        savings: Math.round(save * 100) / 100,
        savingsGoalId: goal?.id,
        createdAt: Date.now(),
      },
    });
  };

  const toggleCat = (id: string) => {
    if (id === REQUIRED_CAT) return;
    setCats(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  if (step === 'welcome') {
    return (
      <div className="onb">
        <div className="onb-frame intro">
          <span className="intro-brand">
            <Logo className="!w-8 !h-8 !rounded-[10px]" />
            <span>Baon<b>Buddy</b></span>
          </span>

          <div className="intro-hero">
            <span className="intro-blob" aria-hidden="true" />
            <Mascot waving size={200} />
          </div>

          <h1 className="intro-title">Take control<br /><span className="hl">of your baon.</span></h1>
          <p className="intro-sub">Track your allowance and know what’s safe to spend each day.</p>

          <div className="onb-foot">
            <button type="button" className="cta" onClick={() => go('name')}>
              Get started <Icon name="arrow-right" />
            </button>
            <p className="intro-private"><Icon name="lock" />No sign-up. Your data stays on this device.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onb">
      <form className="onb-frame" onSubmit={next} noValidate>
        <div className="onb-top">
          <button type="button" className="onb-back" onClick={back} aria-label="Back">
            <Icon name="arrow-left" />
          </button>
          <div className="onb-steps" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={idx + 1}>
            {STEPS.map((s, i) => <i key={s} className={i <= idx ? 'on' : ''} />)}
          </div>
        </div>

        <div key={step} className="onb-body reveal">
          {step === 'name' && (
            <>
              <h2 className="onb-title">Let’s get<br />to know you.</h2>
              <p className="onb-sub">Pick a look, then tell Buddy your name.</p>

              <div className="avatar-stage">
                <span key={avatar} className="avatar-hero"><Avatar id={avatar} size={136} /></span>
              </div>

              <div className="avatar-rail no-scrollbar" role="radiogroup" aria-label="Avatar">
                {AVATARS.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    className="avatar-opt"
                    aria-checked={preset.id === a.id}
                    aria-label={a.name}
                    onClick={() => setAvatar(a.id)}
                  >
                    <Avatar id={a.id} size={56} />
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2.5 mt-4" role="radiogroup" aria-label="Skin tone">
                {SKINS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    className="tone"
                    style={{ background: c }}
                    aria-checked={tone === i}
                    aria-label={`Skin tone ${i + 1}`}
                    onClick={() => setAvatar(avatarId(preset.id, i))}
                  />
                ))}
              </div>

              <input
                className="onb-name"
                aria-label="Your name"
                placeholder="Your name"
                autoComplete="given-name"
                maxLength={24}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </>
          )}

          {step === 'allowance' && (
            <>
              <h2 className="onb-title">What’s your<br />allowance?</h2>
              <p className="onb-sub">How much you get and how often. You can change this anytime.</p>

              <div className="seg w-full !grid grid-cols-4 mt-7" role="group" aria-label="Allowance period">
                {PERIODS.map(x => (
                  <button key={x.id} type="button" className="pill sm justify-center" aria-pressed={period === x.id} onClick={() => pickPeriod(x.id)}>
                    {x.label}
                  </button>
                ))}
              </div>

              <label className="onb-amount" htmlFor="onbAmount">
                <span className="peso">₱</span>
                <input id="onbAmount" inputMode="decimal" placeholder="0" style={{ width: `${Math.max(1, amount.length) + 0.2}ch` }} value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} autoFocus />
              </label>
              <p className="text-center text-[13px] text-muted -mt-1">{p.per}</p>
              <div className="flex gap-2 mt-5 justify-center flex-wrap">
                {p.quick.map(n => (
                  <button key={n} type="button" className="pill sm" aria-pressed={budget === n} onClick={() => setAmount(String(n))}>{pesoR(n)}</button>
                ))}
              </div>

              {period === 'custom' ? (
                <div className="grid grid-cols-2 gap-2 mt-6">
                  <label>
                    <span className="field-label">Starts</span>
                    <input type="date" className="input" value={start} onChange={e => setStart(e.target.value)} />
                  </label>
                  <label>
                    <span className="field-label">Ends</span>
                    <input type="date" className="input" value={end} onChange={e => setEnd(e.target.value)} />
                  </label>
                </div>
              ) : (
                <p className="onb-note mt-6">
                  <Icon name="calendar" className="w-4 h-4 shrink-0" />
                  <span>{shortDate(start)}{start !== end && ` – ${shortDate(end)}`} · renews every {period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'}</span>
                </p>
              )}
            </>
          )}

          {step === 'cats' && (
            <>
              <h2 className="onb-title">Where does<br />your money go?</h2>
              <p className="onb-sub">Pick what you usually spend on. You can turn more on anytime.</p>
              <div className="grid grid-cols-2 gap-2.5 mt-7" role="group" aria-label="Categories">
                {CATS.map(c => {
                  const on = cats.includes(c.id) || c.id === REQUIRED_CAT;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className="onb-cat"
                      style={{ '--c': c.color, '--g': c.grad } as React.CSSProperties}
                      aria-pressed={on}
                      aria-disabled={c.id === REQUIRED_CAT}
                      onClick={() => toggleCat(c.id)}
                    >
                      <span className="ic"><CatIcon id={c.id} /></span>
                      <span className="flex-1 min-w-0">{c.label}</span>
                      <span className="tick"><Icon name="check" /></span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] text-muted mt-3 text-center">&ldquo;Others&rdquo; always stays on for everything else.</p>
            </>
          )}

          {step === 'savings' && (
            <>
              <h2 className="onb-title">Want to set<br />money aside?</h2>
              <p className="onb-sub">Set aside part of your {pesoR(budget)} allowance and Buddy will budget around it.</p>
              <label className="onb-amount mt-6" htmlFor="onbSave">
                <span className="peso">₱</span>
                <input id="onbSave" inputMode="decimal" placeholder="0" style={{ width: `${Math.max(1, savings.length) + 0.2}ch` }} value={savings} onChange={e => setSavings(cleanAmount(e.target.value))} />
              </label>
              <p className="text-center text-[13px] text-muted -mt-1">savings goal {p.per}</p>
              <div className="flex gap-2 mt-5 justify-center flex-wrap">
                {[10, 20, 30].map(pct => {
                  const v = Math.round((budget * pct) / 100);
                  return (
                    <button key={pct} type="button" className="pill sm" aria-pressed={save === v && v > 0} onClick={() => setSavings(String(v))}>
                      {pct}% · {pesoR(v)}
                    </button>
                  );
                })}
              </div>
              <input
                className="input mt-5 text-center"
                maxLength={30}
                placeholder="What are you saving for? (optional)"
                aria-label="What are you saving for?"
                value={goalName}
                onChange={e => setGoalName(e.target.value)}
              />
              <div className="onb-summary mt-5">
                <div style={{ background: 'var(--lime)' }}>
                  <p className="eyebrow !text-[rgba(14,14,16,.6)]">To spend</p>
                  <p className="onb-big">{pesoR(Math.max(0, budget - save))}</p>
                </div>
                <div style={{ background: 'var(--peach)' }}>
                  <p className="eyebrow !text-[rgba(14,14,16,.6)]">Safe / day</p>
                  <p className="onb-big">{pesoR(Math.max(0, budget - save) / days)}</p>
                </div>
              </div>
            </>
          )}

          {step === 'done' && (
            <div className="text-center">
              <div className="done-stage">
                <span className="confetti" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</span>
                <Mascot avatar={avatar} waving size={128} />
              </div>
              <h2 className="onb-title mt-6">You’re all set,<br />{firstName}!</h2>
              <p className="onb-sub">You can change any of this later in Settings.</p>
              <dl className="onb-recap mt-7 text-left">
                <div><dt>Allowance</dt><dd>{pesoR(budget)} <span>{p.label.toLowerCase()}</span></dd></div>
                <div><dt>Period</dt><dd>{shortDate(start)}{start !== end && ` – ${shortDate(end)}`}</dd></div>
                <div><dt>Savings goal</dt><dd>{save ? pesoR(save) : 'None'}</dd></div>
                <div><dt>Safe / day</dt><dd>{pesoR((budget - save) / days)}</dd></div>
              </dl>
            </div>
          )}

          {err && <p key={shakeKey} className="shake text-sm text-center text-[var(--danger)] mt-4" role="alert">{err}</p>}
        </div>

        <div className="onb-foot">
          <button type="submit" className="cta">
            {step === 'done' ? 'Let’s go' : step === 'savings' && !save ? 'Skip for now' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
