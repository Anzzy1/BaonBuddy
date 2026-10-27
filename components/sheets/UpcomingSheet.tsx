'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import { AppState, Upcoming, activeCats, catName, cleanAmount, compute, langOf, pesoR, settingsOf, today, uid } from '@/lib/budget';
import { translator } from '@/lib/i18n';
import { parseUpcoming } from '@/lib/upcoming';
import { askPermission, remindersSupported, syncReminders } from '@/lib/reminders';

interface Props {
  state: AppState;
  item: Upcoming | null; // null = new
  update: (fn: (prev: AppState) => AppState) => void;
  onClose: () => void;
  onPay: (u: Upcoming) => void;
  showToast: (text: string) => void;
}

export default function UpcomingSheet({ state, item, update, onClose, onPay, showToast }: Props) {
  const lang = langOf(state);
  const t = translator(lang);
  const [quick, setQuick] = useState('');
  const [name, setName] = useState(item?.name || '');
  const [amount, setAmount] = useState(item ? String(item.amount) : '');
  const [due, setDue] = useState(item?.due || '');
  const [cat, setCat] = useState(item?.cat || 'other');
  const [armDelete, setArmDelete] = useState(false);
  const [err, setErr] = useState('');

  // One line like "Renta ₱3,500, katapusan" fills in the fields below
  const typeQuick = (v: string) => {
    setQuick(v);
    const p = parseUpcoming(v);
    if (p.name) { setName(p.name); setCat(p.cat || 'other'); }
    if (p.amount) setAmount(String(p.amount));
    if (p.due) setDue(p.due);
  };

  const amt = parseFloat(amount) || 0;
  const draft: Upcoming = { id: item?.id || uid(), name: name.trim(), amount: Math.round(amt * 100) / 100, cat, due, ts: item?.ts || Date.now() };
  const nextList = item ? (state.upcoming || []).map(x => (x.id === item.id ? draft : x)) : [...(state.upcoming || []), draft];

  // What saving this does to the safe/day
  const before = compute(state).perDay;
  const after = compute({ ...state, upcoming: nextList }).perDay;
  const inPeriod = due && due <= state.end;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr(t('What is it for?', 'Para saan ito?', 'Para saan ito?')); return; }
    if (!(amt > 0)) { setErr(t('Enter an amount greater than ₱0.', 'Maglagay ng halagang higit sa ₱0.', 'Mag-enter ng amount na higit sa ₱0.')); return; }
    if (!due) { setErr(t('When is it due?', 'Kailan ang takdang araw?', 'Kailan ang due date?')); return; }
    if (!item && due < today()) { setErr(t('Pick today or a later date.', 'Pumili ng ngayon o mas huling petsa.', 'Pumili ng today or later na date.')); return; }
    update(prev => ({ ...prev, upcoming: item ? (prev.upcoming || []).map(x => (x.id === item.id ? draft : x)) : [...(prev.upcoming || []), draft] }));
    // First reminder needs notification permission; schedule right away once it's granted
    if (remindersSupported() && settingsOf(state).remindUpcoming) {
      askPermission().then(ok => { if (ok) syncReminders({ ...state, upcoming: nextList }); }).catch(() => {});
    }
    onClose();
    showToast(inPeriod
      ? t(`${pesoR(draft.amount)} set aside for ${draft.name}`, `Itinabi ang ${pesoR(draft.amount)} para sa ${draft.name}`, `Naitabi ang ${pesoR(draft.amount)} for ${draft.name}`)
      : t(`${draft.name} added`, `Naidagdag ang ${draft.name}`, `Na-add ang ${draft.name}`));
  };

  return (
    <Sheet
      title={item ? item.name : t('Coming up', 'Parating na gastos', 'Parating na gastos')}
      sub={item ? undefined : t('The money is set aside now, so you can’t spend it by accident.',
                                 'Itatabi agad ang pera para hindi mo ito magastos nang hindi sinasadya.',
                                 'Itatabi agad ang pera para hindi mo siya magastos by accident.')}
      onClose={onClose}
      onSubmit={save}
    >
      {!item && (
        <label className="block mt-5"><span className="field-label">{t('Type it in one line', 'I-type sa isang linya', 'I-type in one line')}</span>
          <input
            className="input"
            maxLength={80}
            placeholder={t('e.g. Rent ₱3,500, end of month', 'hal. Renta ₱3,500, katapusan', 'e.g. Renta ₱3,500, katapusan')}
            value={quick}
            onChange={e => typeQuick(e.target.value)}
            autoFocus
          />
        </label>
      )}

      <label className="block mt-4"><span className="field-label">{t('What for', 'Para saan', 'Para saan')}</span>
        <input className="input" maxLength={40} placeholder={t('e.g. Thesis printing', 'hal. Pagpapa-print ng thesis', 'e.g. Thesis printing')} value={name} onChange={e => setName(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <label><span className="field-label">{t('Amount', 'Halaga', 'Amount')}</span>
          <input className="input tnum" inputMode="decimal" placeholder="₱0" value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} />
        </label>
        <label><span className="field-label">{t('Due', 'Takdang araw', 'Due date')}</span>
          <input type="date" className="input" value={due} min={item ? undefined : today()} onChange={e => setDue(e.target.value)} />
        </label>
      </div>
      <label className="block mt-3"><span className="field-label">{t('Category', 'Kategorya', 'Category')}</span>
        <select className="input" value={cat} onChange={e => setCat(e.target.value)}>
          {activeCats(state).map(c => <option key={c.id} value={c.id}>{catName(c.id, lang)}</option>)}
        </select>
      </label>

      {amt > 0 && due && (
        <p className="onb-note !justify-start mt-4 text-left">
          <Icon name="lock" className="w-4 h-4 shrink-0" />
          <span>
            {inPeriod
              ? t(`${pesoR(amt)} is set aside now. Safe/day goes from ${pesoR(before)} to ${pesoR(after)}.`,
                  `Itatabi ngayon ang ${pesoR(amt)}. Ang ligtas mong gastos kada araw ay magiging ${pesoR(after)} mula ${pesoR(before)}.`,
                  `Itatabi ngayon ang ${pesoR(amt)}. Ang safe/day mo ay from ${pesoR(before)} to ${pesoR(after)}.`)
              : t('It’s due after this period, so it gets set aside when the next period starts.',
                  'Lampas ito sa kasalukuyang period, kaya itatabi ito pagsimula ng susunod na period.',
                  'Due siya after this period, kaya itatabi siya pag nagsimula na ang next period.')}
          </span>
        </p>
      )}
      {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}

      <button type="submit" className="submit mt-5">
        <span className="badge"><Icon name="check" /></span>
        {item ? t('Save changes', 'I-save', 'Save changes') : t('Set it aside', 'Itabi', 'Itabi na')}
      </button>

      {item && (
        <div className="flex gap-2 justify-center flex-wrap mt-4">
          <button type="button" className="pill sm plus" onClick={() => { onPay(item); onClose(); }}>
            <Icon name="check" className="w-3.5 h-3.5" />{t('Mark as paid', 'Bayad na', 'Mark as paid')}
          </button>
          <button
            type="button"
            className="pill sm danger"
            onClick={() => {
              if (!armDelete) { setArmDelete(true); setTimeout(() => setArmDelete(false), 3000); return; }
              update(prev => ({ ...prev, upcoming: (prev.upcoming || []).filter(x => x.id !== item.id) }));
              onClose();
              showToast(t(`Removed ${item.name}, its money is free again`, `Tinanggal ang ${item.name}, puwede nang gastusin ang pera`, `Tinanggal ang ${item.name}, free na ulit ang pera`));
            }}
          >
            <Icon name="trash-2" className="w-3.5 h-3.5" />{armDelete ? t('Tap again to remove', 'I-tap ulit para tanggalin', 'Tap ulit para i-remove') : t('Remove', 'Tanggalin', 'Remove')}
          </button>
        </div>
      )}
    </Sheet>
  );
}
