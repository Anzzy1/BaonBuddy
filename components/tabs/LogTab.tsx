'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import CatIcon from '@/components/CatIcon';
import ExpenseRow from '@/components/ExpenseRow';
import { AppState, Computed, activeCats, Expense, addDays, catById, catName, cleanAmount, dayLabel, iso, langOf, newestFirst, peso, pesoR, today, uid } from '@/lib/budget';
import { perDayText, translator } from '@/lib/i18n';
import { parseExpense } from '@/lib/engine';
import { SPEECH_ERRORS, useSpeech } from '@/components/useSpeech';
import ReceiptScanner from '@/components/ReceiptScanner';

interface LogTabProps {
  state: AppState;
  c: Computed;
  newId: string | null;
  onAdd: (e: Expense | Expense[]) => void;
  onDelete: (id: string) => void;
  showToast: (text: string) => void;
  update: (fn: (prev: AppState) => AppState) => void;
}

type ChatMsg = { role: 'user' | 'assistant'; text: string; voice?: boolean };
type Item = { amount: number; category: string; note: string; daysAgo: number };

const VOICE_LANGS = [
  { id: 'en-PH', label: 'English' },
  { id: 'fil-PH', label: 'Filipino' },
] as const;

const readPref = (key: string, fallback: string) => {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};
const writePref = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch {}
};

export default function LogTab({ state, c, newId, onAdd, onDelete, showToast, update }: LogTabProps) {
  const [mode, setMode] = useState<'manual' | 'chat' | 'voice' | 'scan'>('manual');
  const [selectedCat, setSelectedCat] = useState(() => activeCats(state)[0].id);
  const [amount, setAmount] = useState('');
  const [dateIn, setDateIn] = useState(today());
  const [note, setNote] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [voiceLang, setVoiceLang] = useState('en-PH');
  const [editFavs, setEditFavs] = useState(false);
  const favorites = state.favorites || [];

  const amountRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tagalog and Taglish speakers get the Filipino recognizer unless they picked one
    setVoiceLang(readPref('balanse.voiceLang', langOf(state) === 'en' ? 'en-PH' : 'fil-PH'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the newest message in view inside the thread box, without scrolling the page
  useEffect(() => {
    const box = chatEndRef.current?.parentElement;
    if (box) box.scrollTop = box.scrollHeight;
  }, [chatMessages, chatLoading, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!(amt > 0)) {
      amountRef.current?.classList.add('shake');
      setTimeout(() => amountRef.current?.classList.remove('shake'), 420);
      showToast('Enter an amount first.');
      return;
    }
    onAdd({
      id: uid(),
      amount: Math.round(amt * 100) / 100,
      cat: selectedCat,
      date: dateIn || today(),
      note: note.trim(),
      ts: Date.now(),
    });
    setAmount('');
    setNote('');
    document.getElementById('amount')?.focus();
  };

  // One tap logs a saved expense for today
  const logFavorite = (f: (typeof favorites)[number]) => {
    onAdd({ id: uid(), amount: f.amount, cat: f.cat, date: today(), note: f.note, ts: Date.now() });
  };
  const saveFavorite = () => {
    const amt = parseFloat(amount);
    if (!(amt > 0)) { showToast('Enter an amount first, then save it as a quick add.'); return; }
    if (favorites.length >= 8) { showToast('You can keep up to 8 quick adds. Remove one first.'); return; }
    const f = { id: uid(), amount: Math.round(amt * 100) / 100, cat: selectedCat, note: note.trim() || catById(selectedCat).label };
    update(prev => ({ ...prev, favorites: [...(prev.favorites || []), f] }));
    showToast(`Saved “${f.note}” as a quick add`);
  };

  // Turns a parser result into actions plus a reply
  const respond = (data: { action?: string; items?: Item[] }): string => {
    const lang = langOf(state);
    const t = translator(lang);

    if (data.action === 'remove') {
      const last = [...state.expenses].sort((a, b) => b.ts - a.ts)[0];
      if (!last) return t("There's nothing logged yet.", 'Wala ka pang naitalang gastos.', 'Wala ka pang na-log.');
      onDelete(last.id);
      const what = `${peso(last.amount)} ${last.note || catName(last.cat, lang)}`;
      return t(`Removed ${what}.`, `Tinanggal ang ${what}.`, `Tinanggal ang ${what}.`);
    }

    if (data.action === 'query') {
      const spentToday = state.expenses.filter(x => x.date === today()).reduce((s, x) => s + x.amount, 0);
      const pd = perDayText(pesoR(c.perDay), lang);
      if (c.remaining < 0) {
        return t(`You've spent ${peso(spentToday)} today and ${pesoR(c.spent)} this period. You're ${pesoR(-c.remaining)} over budget.`,
                 `Nakagastos ka ng ${peso(spentToday)} ngayon at ${pesoR(c.spent)} ngayong period. Lampas ka na ng ${pesoR(-c.remaining)} sa badyet.`,
                 `Naka-${peso(spentToday)} ka today at ${pesoR(c.spent)} this period. Over budget ka na ng ${pesoR(-c.remaining)}.`);
      }
      return t(`You've spent ${peso(spentToday)} today and ${pesoR(c.spent)} this period. You have ${pesoR(c.remaining)} left, about ${pd}.`,
               `Nakagastos ka ng ${peso(spentToday)} ngayon at ${pesoR(c.spent)} ngayong period. May natitira ka pang ${pesoR(c.remaining)}, mga ${pd}.`,
               `Naka-${peso(spentToday)} ka today at ${pesoR(c.spent)} this period. May ${pesoR(c.remaining)} ka pa, mga ${pd}.`);
    }

    const items: Item[] = (data.action === 'add' && Array.isArray(data.items) ? data.items : [])
      .map(it => ({ ...it, amount: Math.round(Number(it.amount) * 100) / 100 }))
      .filter(it => Number.isFinite(it.amount) && it.amount > 0);
    if (!items.length) {
      return t('I couldn\'t find an amount there. Try something like "lunch 85", "I paid 26 pesos for the bus" or "2 sandwiches at 45 each".',
               'Wala akong nakitang halaga riyan. Subukan ang "tanghalian 85", "nagbayad ako ng 26 sa jeep" o "2 tinapay tig-15".',
               'Wala akong nakitang amount diyan. Try mo ang "lunch 85", "nagbayad ako ng 26 sa jeep" or "2 sandwich tig-45".');
    }

    const exps: Expense[] = items.map((it, i) => ({
      id: uid(),
      amount: it.amount,
      cat: it.category,
      date: iso(addDays(new Date(), -(it.daysAgo || 0))),
      note: it.note || '',
      ts: Date.now() + i,
    }));
    onAdd(exps);

    const added = exps.filter(x => x.date >= state.start && x.date <= state.end).reduce((s, x) => s + x.amount, 0);
    const remaining = c.remaining - added;
    const when = (x: Expense) => (x.date === today() ? '' : ` (${dayLabel(x.date, lang).toLowerCase()})`);
    const lines = exps.map(x => `• ${peso(x.amount)} ${x.note || catName(x.cat, lang)} → ${catName(x.cat, lang)}${when(x)}`).join('\n');
    const total = exps.length > 1 ? peso(exps.reduce((s, x) => s + x.amount, 0)) : '';
    const leftLine = remaining < 0
      ? t(`You're ${pesoR(-remaining)} over budget.`, `Lampas ka na ng ${pesoR(-remaining)} sa badyet.`, `Over budget ka na ng ${pesoR(-remaining)}.`)
      : t(`${pesoR(remaining)} left.`, `${pesoR(remaining)} pa ang natitira.`, `${pesoR(remaining)} pa ang natitira.`);
    const head = exps.length > 1
      ? t(`Got it! Logged ${exps.length} items (${total}):`, `Sige! Naitala ang ${exps.length} na gastos (${total}):`, `Got it! Na-log ang ${exps.length} items (${total}):`)
      : t('Got it! Logged it:', 'Sige! Naitala na:', 'Got it! Na-log na:');
    return `${head}\n${lines}\n${leftLine}`;
  };

  // Sends one message (or several speech guesses, best first) and logs whatever it understood
  const sendMessage = async (guesses: string[], voice = false) => {
    const first = guesses[0]?.trim();
    if (!first || chatLoading) return null;
    setChatMessages(prev => [...prev, { role: 'user', text: first, voice }]);
    setChatLoading(true);
    let reply: string;
    try {
      let data = null;
      for (const g of guesses) {
        const d = await parseExpense(g);
        data ??= d;
        // Speech can mishear; use the first guess the parser actually understands
        if (d.action && d.action !== 'none') {
          data = d;
          if (g !== first) setChatMessages(prev => prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: g } : m)));
          break;
        }
      }
      reply = respond(data || {});
    } catch {
      reply = translator(langOf(state))('Something went wrong. Please try again.', 'May nagkaproblema. Pakisubukang muli.', 'May error. Try ulit.');
    }
    setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setChatLoading(false);
    return reply;
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput('');
    sendMessage([text]);
  };

  const speech = useSpeech({
    lang: voiceLang,
    onFinal: async alts => {
      // Speech engines sometimes write "$50" for "50 pesos"; this app is all pesos
      const guesses = [...new Set(alts.map(a => a.replace(/\$\s?(\d)/g, '₱$1')))];
      await sendMessage(guesses, true);
    },
  });

  const { prepare: prepareVoice } = speech;
  useEffect(() => {
    if (mode === 'voice') prepareVoice();
  }, [mode, prepareVoice]);

  const todays = state.expenses.filter(e => e.date === today()).sort(newestFirst);
  const todayTotal = todays.reduce((s, e) => s + e.amount, 0);
  // Daily allowance measured from the balance before today's spending
  const todayInPeriod = today() >= state.start && today() <= state.end ? todayTotal : 0;
  const safeToday = c.left > 0 ? Math.max(0, (c.remaining + todayInPeriod) / c.left) : 0;
  const overToday = safeToday > 0 && todayTotal > safeToday;

  const thread = (
    <>
      {chatMessages.map((m, i) => (
        <div key={i} className={`mt-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`bubble ${m.role === 'user' ? 'me' : 'bot'}`}>
            {m.voice && <Icon name="mic" className="w-3.5 h-3.5 inline -mt-0.5 mr-1.5 opacity-80" />}
            {m.text}
          </div>
        </div>
      ))}
      {chatLoading && <TypingDots />}
      <div ref={chatEndRef} />
    </>
  );

  const voiceErr = speech.error ? SPEECH_ERRORS[speech.error]?.en ?? 'Voice stopped working. Please try again.' : null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <section id="logger" className="glass reveal p-6 lg:col-span-7 self-start" aria-label="Log an expense">
        <div className="flex items-center justify-between gap-3">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--lime)]"><Icon name="pen-line" /></span>Log expense</h2>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted">Press <span className="kbd">N</span> anywhere</span>
        </div>
        <div className="mt-4 seg max-w-full overflow-x-auto no-scrollbar">
          <button type="button" className="pill sm" aria-pressed={mode === 'manual'} onClick={() => setMode('manual')}>Manual</button>
          <button type="button" className="pill sm" aria-pressed={mode === 'chat'} onClick={() => setMode('chat')}>
            <Icon name="sparkles" className="w-3.5 h-3.5" />
            Quick chat
          </button>
          <button type="button" className="pill sm" aria-pressed={mode === 'voice'} onClick={() => setMode('voice')}>
            <Icon name="mic" className="w-3.5 h-3.5" />
            Voice
          </button>
          <button type="button" className="pill sm" aria-pressed={mode === 'scan'} onClick={() => setMode('scan')}>
            <Icon name="scan" className="w-3.5 h-3.5" />
            Scan
          </button>
        </div>

        {mode === 'scan' && <ReceiptScanner onAdd={onAdd} cats={activeCats(state)} />}

        {mode === 'chat' && (
          <div className="mt-4 flex flex-col" style={{ maxHeight: 460 }}>
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 -mr-1" style={{ minHeight: 160 }}>
              {chatMessages.length === 0 && (
                <div className="rounded-xl p-4 bg-[var(--soft)] border border-[var(--hair)]">
                  <p className="text-sm font-medium">Just tell me what you spent</p>
                  <p className="text-[13px] mt-1 leading-relaxed text-muted">
                    &quot;I bought food for 50 pesos&quot;, &quot;bus 26 and lunch 120&quot;, &quot;3 sandwiches at 45 each yesterday&quot;.
                    Ask &quot;how much did I spend?&quot; or say &quot;undo&quot; to remove the last one.
                  </p>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {['I bought food for 50 pesos', 'bus 26 and lunch 120', 'mobile load 50 yesterday'].map(s => (
                      <button key={s} type="button" className="pill sm plus" onClick={() => setChatInput(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {thread}
            </div>

            <form onSubmit={handleChatSubmit} className="mt-3" autoComplete="off">
              <ChatInput value={chatInput} onChange={setChatInput} disabled={chatLoading} placeholder="What did you spend on?" />
            </form>
          </div>
        )}

        {mode === 'voice' && (
          <div className="mt-4">
            {!speech.supported ? (
              <div className="result warn">
                <p className="text-sm font-medium">This browser can&apos;t use voice logging.</p>
                <p className="text-[13px] text-muted mt-1">Open the app in an up-to-date Chrome, Edge or Firefox, or use Quick chat.</p>
              </div>
            ) : (
              <>
                {chatMessages.length > 0 && (
                  <div className="overflow-y-auto no-scrollbar pr-1 -mr-1 mb-2" style={{ maxHeight: 260 }}>{thread}</div>
                )}

                <div className="flex flex-col items-center text-center py-6">
                  <button
                    type="button"
                    className={`mic ${speech.listening ? 'is-on' : ''}`}
                    onClick={() => (speech.listening ? speech.stop() : speech.start())}
                    disabled={chatLoading || speech.phase === 'transcribing'}
                    aria-label={speech.listening ? 'Stop listening' : 'Start voice log'}
                  >
                    <Icon name={speech.listening ? 'square' : 'mic'} />
                  </button>
                  <p className="font-display font-bold text-lg tracking-tight mt-5">
                    {speech.listening
                      ? 'Listening… / Nakikinig…'
                      : speech.phase === 'transcribing'
                        ? 'Writing it down… / Isinusulat…'
                        : chatLoading ? 'Logging it…' : 'Tap and say what you spent'}
                  </p>
                  <p className="text-sm mt-1 min-h-[20px] max-w-md text-muted" aria-live="polite">
                    {speech.listening
                      ? 'Speak now. It stops by itself when you pause.'
                      : speech.phase === 'loading'
                        ? `Getting voice ready${speech.loadPct !== null ? ` · ${speech.loadPct}%` : ''}… (first time only)`
                        : '“I bought bread for 10 pesos” · “bus 26 and lunch 120”'}
                  </p>
                  <span className="chip mt-3 !bg-[var(--soft)] !h-6 !text-[11px]">
                    <Icon name="wifi-off" className="w-3 h-3" /> Works offline
                  </span>
                  {voiceErr && <p className="text-sm text-[var(--danger)] mt-3 max-w-md">{voiceErr}</p>}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--hair)]">
                  <div className="seg" role="group" aria-label="Language you will speak">
                    {VOICE_LANGS.map(l => (
                      <button
                        key={l.id}
                        type="button"
                        className="pill sm"
                        aria-pressed={voiceLang === l.id}
                        disabled={speech.listening || speech.busy}
                        onClick={() => { setVoiceLang(l.id); writePref('balanse.voiceLang', l.id); }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {mode === 'manual' && (
          <form onSubmit={handleSubmit} className="mt-4" noValidate autoComplete="off">
            {favorites.length > 0 && (
              <div className="mb-4">
                <div className="field-label">
                  <span>Quick add</span>
                  <button type="button" className="text-[12px] font-medium text-muted" onClick={() => setEditFavs(v => !v)}>{editFavs ? 'Done' : 'Edit'}</button>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
                  {favorites.map(f => (
                    <span key={f.id} className="fav" style={{ '--c': catById(f.cat).color } as React.CSSProperties}>
                      <button type="button" className="fav-main" onClick={() => (editFavs ? null : logFavorite(f))} disabled={editFavs} aria-label={`Log ${f.note} for ${peso(f.amount)}`}>
                        <span className="ic"><CatIcon id={f.cat} /></span>
                        <span className="text-left">
                          <span className="block text-[13px] font-semibold leading-tight max-w-[9rem] truncate">{f.note}</span>
                          <span className="block text-[12px] text-muted tnum">{pesoR(f.amount)}</span>
                        </span>
                      </button>
                      {editFavs && (
                        <button type="button" className="fav-x" aria-label={`Remove ${f.note}`} onClick={() => update(prev => ({ ...prev, favorites: (prev.favorites || []).filter(x => x.id !== f.id) }))}>
                          <Icon name="x" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div ref={amountRef} className="amount-field" onClick={() => document.getElementById('amount')?.focus()}>
              <span className="peso">₱</span>
              <input id="amount" inputMode="decimal" placeholder="0" aria-label="Amount in pesos" value={amount} onChange={e => setAmount(cleanAmount(e.target.value))} />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[20, 50, 100, 500].map(n => (
                <button key={n} type="button" className="pill sm plus" onClick={() => setAmount(String(Math.round(((parseFloat(amount) || 0) + n) * 100) / 100))}>
                  +{n}
                </button>
              ))}
            </div>

            <p className="field-label mt-5">Category</p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Category">
              {activeCats(state).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className="cat"
                  style={{ '--c': cat.color, '--g': cat.grad } as React.CSSProperties}
                  aria-pressed={selectedCat === cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  <span className="ic"><CatIcon id={cat.id} /></span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div>
                <div className="field-label">
                  <label htmlFor="date">Date</label>
                  <span className="flex gap-1.5">
                    <button type="button" className="pill sm" onClick={() => setDateIn(today())}>Today</button>
                    <button type="button" className="pill sm" onClick={() => setDateIn(iso(addDays(new Date(), -1)))}>Yesterday</button>
                  </span>
                </div>
                <input id="date" type="date" className="input" value={dateIn} onChange={e => setDateIn(e.target.value)} />
              </div>
              <div>
                <label className="field-label" htmlFor="note"><span>Note</span><span className="opacity-70 h-[30px] inline-flex items-center">Optional</span></label>
                <input id="note" className="input" maxLength={60} placeholder="Lunch at the canteen" value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="submit mt-5">
              <span className="badge"><Icon name="plus" /></span>
              <span>Log expense</span>
            </button>
            <button type="button" className="pill sm mt-3 mx-auto flex" onClick={saveFavorite}>
              <Icon name="sparkles" className="w-3.5 h-3.5" />Save as quick add
            </button>
          </form>
        )}
      </section>

      <section className="glass reveal p-4 sm:p-6 lg:col-span-5 self-start" style={{ '--d': '.08s' } as React.CSSProperties} aria-label="Logged today">
        <div className="px-2 sm:px-0">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--pink)]"><Icon name="receipt" /></span>Today</h2>
          <p className="text-sm text-muted mt-2">{todays.length} {todays.length === 1 ? 'entry' : 'entries'} today, {peso(todayTotal)} spent</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 px-2 sm:px-0">
          <div className="result">
            <p className="eyebrow">Safe today</p>
            <p className="font-display font-extrabold text-xl tracking-tight tnum mt-1">{pesoR(safeToday)}</p>
          </div>
          <div className={`result ${overToday ? 'bad' : 'good'}`}>
            <p className="eyebrow">{overToday ? 'Over today' : 'Left today'}</p>
            <p className="font-display font-extrabold text-xl tracking-tight tnum mt-1">{pesoR(safeToday - todayTotal)}</p>
          </div>
        </div>
        <div className="mt-2">
          {todays.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">No expenses today. Nice!</p>
          ) : (
            todays.map(e => <ExpenseRow key={e.id} e={e} isNew={e.id === newId} onDelete={onDelete} />)
          )}
        </div>
      </section>
    </div>
  );
}

export function TypingDots() {
  return (
    <div className="mt-2 flex justify-start">
      <div className="rounded-2xl px-3.5 py-2.5 inline-flex items-center gap-1 bg-[var(--soft)] border border-[var(--hair)]">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgb(var(--muted))', animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}

export function ChatInput({ value, onChange, disabled, placeholder }: { value: string; onChange: (v: string) => void; disabled: boolean; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl p-1.5 bg-[var(--soft)] border-[1.5px] border-transparent focus-within:border-[var(--cobalt)] focus-within:bg-white transition-colors">
      <input
        className="flex-1 min-w-0 bg-transparent outline-none text-sm px-2"
        style={{ color: 'rgb(var(--ink))' }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-[var(--cobalt)] text-white disabled:opacity-30 transition-opacity"
        disabled={disabled || !value.trim()}
        aria-label="Send"
      >
        <Icon name="send" className="w-4 h-4" />
      </button>
    </div>
  );
}
