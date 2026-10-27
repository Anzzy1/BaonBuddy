'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import ConfirmDialog from '@/components/ConfirmDialog';
import CatIcon from '@/components/CatIcon';
import Avatar, { AVATARS, SKINS, avatarId, parseAvatar } from '@/components/Avatar';
import { AppState, CATS, DEFAULT_CATS, Period, REQUIRED_CAT, Settings, cleanAmount, periodRange, settingsOf } from '@/lib/budget';
import { exportBackup, readBackup } from '@/lib/backup';
import { askPermission, permissionState, remindersSupported } from '@/lib/reminders';
import { LANGUAGES } from '@/lib/i18n';

interface Props {
  state: AppState;
  update: (fn: (prev: AppState) => AppState) => void;
  onClose: () => void;
  showToast: (text: string) => void;
  onRestore: (data: AppState) => void;
  onReset: () => void;
}

const PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'custom'];

export default function SettingsSheet({ state, update, onClose, showToast, onRestore, onReset }: Props) {
  const p = state.profile;
  const [name, setName] = useState(p?.name || '');
  const [avatar, setAvatar] = useState(p?.avatar || AVATARS[0].id);
  const [budget, setBudget] = useState(String(state.budget));
  const [period, setPeriod] = useState<Period>(p?.period || 'custom');
  const [start, setStart] = useState(state.start);
  const [end, setEnd] = useState(state.end);
  const [savings, setSavings] = useState(p?.savings ? String(p.savings) : '');
  const [cats, setCats] = useState<string[]>(p?.cats?.length ? p.cats : DEFAULT_CATS);
  const [limits, setLimits] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(state.limits || {}).map(([k, v]) => [k, String(v)])));
  const [err, setErr] = useState('');
  const [arm, setArm] = useState<'' | 'clear' | 'reset' | 'restore'>('');
  const [restoreData, setRestoreData] = useState<AppState | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [perm, setPerm] = useState<Awaited<ReturnType<typeof permissionState>>>('unsupported');
  useEffect(() => { permissionState().then(setPerm).catch(() => {}); }, []);
  const s = settingsOf(state);
  const { preset, tone } = parseAvatar(avatar);

  const armFor = (k: typeof arm) => { setArm(k); setTimeout(() => setArm(a => (a === k ? '' : a)), 3500); };
  const pickPeriod = (x: Period) => {
    setPeriod(x);
    if (x !== 'custom') { const [a, b] = periodRange(x); setStart(a); setEnd(b); }
  };
  // Reminders and theme apply right away; everything else waits for Save
  const setSetting = (patch: Partial<Settings>) => update(prev => ({ ...prev, settings: { ...settingsOf(prev), ...patch } }));

  type ReminderKey = 'remindDaily' | 'remindAllowance' | 'remindUpcoming' | 'remindDebts' | 'remindGoals' | 'remindPeriodEnd' | 'remindWeekly' | 'remindMorning' | 'remindInactive';
  const toggleReminder = async (key: ReminderKey, on: boolean) => {
    if (on && !(await askPermission())) {
      setPerm(await permissionState());
      showToast('Allow notifications for BaonBuddy in your phone settings first.');
      return;
    }
    if (on) setPerm('granted');
    setSetting({ [key]: on });
  };
  const turnOnNotifications = async () => {
    const ok = await askPermission();
    setPerm(await permissionState());
    if (!ok) showToast('Notifications are blocked. Turn them on for BaonBuddy in your phone settings.');
  };
  const native = remindersSupported();
  const reminderRow = (key: ReminderKey, label: string, sub: string, extra?: React.ReactNode, disabled = false) => (
    <Row label={label} sub={sub}>
      {extra}
      <Toggle on={s[key]} disabled={!native || disabled} label={label} onChange={v => toggleReminder(key, v)} />
    </Row>
  );

  const parsedLimits = () =>
    Object.fromEntries(Object.entries(limits).map(([k, v]) => [k, parseFloat(v) || 0]).filter(([, v]) => (v as number) > 0)) as Record<string, number>;

  // Has anything in the Save-able part of the form changed?
  const dirty = (() => {
    const same = (a: Record<string, number>, b: Record<string, number>) =>
      JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
    return name.trim() !== (p?.name || '')
      || avatar !== (p?.avatar || AVATARS[0].id)
      || (parseFloat(budget) || 0) !== state.budget
      || period !== (p?.period || 'custom')
      || start !== state.start
      || end !== state.end
      || (parseFloat(savings) || 0) !== (p?.savings || 0)
      || [...cats].sort().join() !== [...(p?.cats?.length ? p.cats : DEFAULT_CATS)].sort().join()
      || !same(parsedLimits(), state.limits || {});
  })();

  // ✕, Escape and tapping outside the sheet all come through here
  const requestClose = () => (dirty ? setConfirmClose(true) : onClose());

  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    setConfirmClose(false);
    const b = parseFloat(budget);
    const sv = parseFloat(savings) || 0;
    if (!name.trim()) { setErr('Enter your name.'); return; }
    if (!(b > 0)) { setErr('Enter an allowance amount greater than ₱0.'); return; }
    if (!start || !end) { setErr('Pick both a start and an end date.'); return; }
    if (end < start) { setErr('The end date has to come after the start date.'); return; }
    if (sv >= b) { setErr('Your savings amount has to be less than your allowance.'); return; }
    const lim = parsedLimits();
    update(prev => ({
      ...prev,
      budget: Math.round(b * 100) / 100,
      start,
      end,
      limits: lim,
      profile: { ...prev.profile!, name: name.trim(), avatar, period, cats, savings: Math.round(sv * 100) / 100 },
    }));
    onClose();
    showToast('Settings saved');
  };

  const pickFile = async (file?: File) => {
    if (!file) return;
    try {
      setRestoreData(await readBackup(file));
      armFor('restore');
    } catch (x) {
      showToast((x as Error).message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Sheet title="Settings" sub="Your profile, allowance and preferences." onClose={requestClose} onSubmit={save} overlay={confirmClose && (
        <ConfirmDialog
          icon="settings-2"
          title="Save your changes?"
          message="You changed some settings. Save them before closing?"
          onDismiss={() => setConfirmClose(false)}
          actions={[
            { label: 'Save', kind: 'primary', onClick: () => save() },
            { label: 'Discard', kind: 'danger', onClick: onClose },
            { label: 'Keep editing', kind: 'cancel', onClick: () => setConfirmClose(false) },
          ]}
        />
      )}>
      <Section title="Profile">
        <div className="flex items-center gap-3">
          <Avatar id={avatar} size={46} />
          <input className="input flex-1 min-w-0" aria-label="Your name" placeholder="Your name" maxLength={24} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex gap-1.5 mt-3 -mx-1 px-1 py-1 overflow-x-auto no-scrollbar" role="radiogroup" aria-label="Avatar">
          {AVATARS.map(a => (
            <button key={a.id} type="button" role="radio" className="avatar-opt" aria-checked={preset.id === a.id} aria-label={a.name} onClick={() => setAvatar(avatarId(a.id, tone))}>
              <Avatar id={avatarId(a.id, tone)} size={38} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5 mt-2" role="radiogroup" aria-label="Skin tone">
          {SKINS.map((c, i) => (
            <button key={c} type="button" role="radio" className="tone !w-6 !h-6" style={{ background: c }} aria-checked={tone === i} aria-label={`Skin tone ${i + 1}`} onClick={() => setAvatar(avatarId(preset.id, i))} />
          ))}
        </div>
      </Section>

      <Section title="Allowance">
        <div className="amount-field sm">
          <span className="peso">₱</span>
          <input inputMode="decimal" aria-label="Allowance amount" placeholder="5000" value={budget} onChange={e => setBudget(cleanAmount(e.target.value))} />
        </div>
        <div className="seg w-full !grid grid-cols-4 mt-3" role="group" aria-label="Allowance period">
          {PERIODS.map(x => (
            <button key={x} type="button" className="pill sm justify-center capitalize" aria-pressed={period === x} onClick={() => pickPeriod(x)}>{x}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <label><span className="field-label !font-normal text-muted">Starts</span>
            <input type="date" className="input disabled:opacity-60" value={start} disabled={period !== 'custom'} onChange={e => setStart(e.target.value)} />
          </label>
          <label><span className="field-label !font-normal text-muted">Ends</span>
            <input type="date" className="input disabled:opacity-60" value={end} disabled={period !== 'custom'} onChange={e => setEnd(e.target.value)} />
          </label>
        </div>
        <label className="block mt-3"><span className="field-label">Set aside for savings each period <span className="text-muted font-normal">optional</span></span>
          <input className="input tnum" inputMode="decimal" placeholder="₱0" value={savings} onChange={e => setSavings(cleanAmount(e.target.value))} />
        </label>
      </Section>

      <Section title="Categories & limits" sub="Turn categories on or off, and set an optional spending limit per period.">
        <ul className="divide-y divide-[var(--hair)]">
          {CATS.map(c => {
            const on = cats.includes(c.id) || c.id === REQUIRED_CAT;
            return (
              <li key={c.id} className="flex items-center gap-3 py-2" style={{ '--c': c.color } as React.CSSProperties}>
                <span className="ic mini-ic"><CatIcon id={c.id} /></span>
                <span className="flex-1 min-w-0 text-sm truncate">{c.label}</span>
                {on && (
                  <input
                    className="input !h-9 !w-24 !px-3 text-[13px] tnum text-right"
                    inputMode="decimal"
                    placeholder="No limit"
                    aria-label={`${c.label} limit`}
                    value={limits[c.id] || ''}
                    onChange={e => setLimits(l => ({ ...l, [c.id]: cleanAmount(e.target.value) }))}
                  />
                )}
                <Toggle on={on} disabled={c.id === REQUIRED_CAT} label={c.label} onChange={v => setCats(prev => (v ? [...prev, c.id] : prev.filter(x => x !== c.id)))} />
              </li>
            );
          })}
        </ul>
      </Section>

      {err && <p className="text-sm text-[var(--danger)] mt-4">{err}</p>}
      <button type="submit" className="submit mt-5"><span className="badge"><Icon name="check" /></span>Save changes</button>

      <Section title="Reminders" sub={native ? 'Local notifications, they work offline. Amounts update every time you log.' : 'Reminders work in the Android and iPhone apps.'}>
        {native && perm !== 'granted' && (
          <div className="notice !p-3 mb-3">
            <span className="notice-ic !w-9 !h-9"><Icon name="bell" /></span>
            <span className="min-w-0 flex-1 text-[13px]">
              <span className="block font-semibold text-sm">Notifications are off</span>
              {perm === 'denied' ? 'Turn them on for BaonBuddy in your phone settings.' : 'Allow them so Buddy can remind you before bills are due.'}
            </span>
            {perm !== 'denied' && <button type="button" className="pill sm plus shrink-0" onClick={turnOnNotifications}>Turn on</button>}
          </div>
        )}

        <p className="eyebrow mt-1">Money due</p>
        {reminderRow('remindUpcoming', 'Upcoming expenses', 'Before, on and after the due date.', s.remindUpcoming && (
          <select className="input !h-9 !w-auto !px-2 text-[13px]" aria-label="How early" value={s.upcomingLead} onChange={e => setSetting({ upcomingLead: Number(e.target.value) as Settings['upcomingLead'] })}>
            <option value={1}>1 day before</option>
            <option value={3}>3 days before</option>
            <option value={7}>1 week before</option>
          </select>
        ))}
        {reminderRow('remindDebts', 'Utang', 'One roundup on Sundays of what’s still unsettled.')}
        {reminderRow('remindGoals', 'Savings goal deadlines', 'A week and a day before, if you’re still short.')}

        <p className="eyebrow mt-4">Budget check-ins</p>
        {reminderRow('remindPeriodEnd', 'Period ending', 'Two days before, with what’s left and your safe/day.')}
        {reminderRow('remindAllowance', 'New period', p?.period === 'custom' ? 'Needs a daily, weekly or monthly period.' : 'The morning your next allowance period starts.', undefined, p?.period === 'custom')}
        {reminderRow('remindWeekly', 'Weekly summary', 'Sunday 7 PM: what you spent and where.')}
        {reminderRow('remindMorning', 'Morning safe-to-spend', '7 AM: how much is safe to spend today.')}

        <p className="eyebrow mt-4">Logging</p>
        {reminderRow('remindDaily', 'Daily log reminder', 'Skipped on days you already logged.', s.remindDaily && (
          <input type="time" className="input !h-9 !w-28 !px-2 text-[13px]" value={s.remindTime} aria-label="Reminder time" onChange={e => setSetting({ remindTime: e.target.value || '20:00' })} />
        ))}
        {reminderRow('remindInactive', 'Missed logs', 'A nudge after 3 days with nothing logged.', undefined, s.remindDaily)}
      </Section>

      <Section title="Buddy's language" sub="How Buddy talks to you in chat, tips, status messages and reminders.">
        <div className="seg w-full !grid grid-cols-3" role="group" aria-label="Buddy's language">
          {LANGUAGES.map(l => (
            <button key={l.id} type="button" className="pill sm justify-center" aria-pressed={s.lang === l.id} onClick={() => setSetting({ lang: l.id })}>{l.label}</button>
          ))}
        </div>
        <p className="text-[12.5px] text-muted mt-2">“{LANGUAGES.find(l => l.id === s.lang)?.sample}”</p>
      </Section>

      <Section title="Appearance">
        <div className="seg w-full !grid grid-cols-3" role="group" aria-label="Theme">
          {(['system', 'light', 'dark'] as const).map(t => (
            <button key={t} type="button" className="pill sm justify-center capitalize" aria-pressed={s.theme === t} onClick={() => setSetting({ theme: t })}>{t}</button>
          ))}
        </div>
      </Section>

      <Section title="Backup & data" sub="Your data lives only on this device. Back it up so you don’t lose it if you change phones.">
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="pill sm plus" onClick={() => exportBackup(state).then(() => showToast('Backup ready')).catch(() => showToast('Couldn’t create the backup.'))}>
            <Icon name="download" className="w-3.5 h-3.5" />Export backup
          </button>
          <button type="button" className="pill sm" onClick={() => fileRef.current?.click()}>
            <Icon name="rotate-ccw" className="w-3.5 h-3.5" />Restore from backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => pickFile(e.target.files?.[0])} />
        </div>
        {arm === 'restore' && restoreData && (
          <div className="mt-3 p-3 rounded-2xl bg-[var(--soft)] text-sm">
            <p>This replaces everything on this device with the backup ({restoreData.expenses.length} expenses{restoreData.profile ? ` for ${restoreData.profile.name}` : ''}).</p>
            <div className="flex gap-2 mt-2">
              <button type="button" className="pill sm danger" onClick={() => { onRestore(restoreData); onClose(); }}>Replace my data</button>
              <button type="button" className="pill sm" onClick={() => setArm('')}>Cancel</button>
            </div>
          </div>
        )}
        <div className="flex gap-2 flex-wrap mt-3">
          <button
            type="button"
            className="pill sm danger"
            onClick={() => {
              if (arm !== 'clear') return armFor('clear');
              update(prev => ({ ...prev, expenses: [] }));
              onClose();
              showToast('Cleared all expenses');
            }}
          >
            {arm === 'clear' ? 'Tap again to confirm' : 'Clear all expenses'}
          </button>
          <button type="button" className="pill sm danger" onClick={() => (arm === 'reset' ? onReset() : armFor('reset'))}>
            <Icon name="trash-2" className="w-3.5 h-3.5" />
            {arm === 'reset' ? 'Erases everything. Tap again' : 'Reset app'}
          </button>
        </div>
      </Section>
    </Sheet>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 pt-5 border-t border-[var(--hair)] first-of-type:border-0 first-of-type:pt-0">
      <p className="field-label !mb-1">{title}</p>
      {sub && <p className="text-[12.5px] text-muted mb-3">{sub}</p>}
      {!sub && <div className="h-2" />}
      {children}
    </section>
  );
}

function Row({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[12px] text-muted">{sub}</span>
      </span>
      {children}
    </div>
  );
}

function Toggle({ on, disabled, label, onChange }: { on: boolean; disabled?: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} className="switch" onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}
