'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import BuddyPop from '@/components/BuddyPop';
import Sidebar, { TABS, TabId } from '@/components/Sidebar';
import OverviewTab from '@/components/tabs/OverviewTab';
import LogTab from '@/components/tabs/LogTab';
import ManageTab from '@/components/tabs/ManageTab';
import CalculatorTab from '@/components/tabs/CalculatorTab';
import AdvisorTab, { AdvisorMsg } from '@/components/tabs/AdvisorTab';
import {
  AppState, Expense, KEY, catById, compute, loadState, monthRange, peso, sampleState, shortDate, weekRange,
} from '@/lib/budget';
import { buddyReact } from '@/lib/buddy';

const isTab = (s: string): s is TabId => TABS.some(t => t.id === s);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AppState>({ budget: 0, start: '', end: '', expenses: [] });
  const [tab, setTabState] = useState<TabId>('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });
  const [newId, setNewId] = useState<string | null>(null);
  const [advisorMsgs, setAdvisorMsgs] = useState<AdvisorMsg[]>([]);
  const [buddyMsg, setBuddyMsg] = useState<{ text: string; key: number } | null>(null);
  const closeBuddy = useCallback(() => setBuddyMsg(null), []);

  const [setBudget, setSetBudget] = useState('');
  const [setStart, setSetStart] = useState('');
  const [setEnd, setSetEnd] = useState('');
  const [setErr, setSetErr] = useState('');
  const [armClear, setArmClear] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoFn = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = loadState();
    if (loaded) {
      setState(loaded);
    } else {
      const s = sampleState();
      setState(s);
      localStorage.setItem(KEY, JSON.stringify(s));
    }
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (isTab(h)) setTabState(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const setTab = useCallback((t: TabId) => {
    setTabState(t);
    history.replaceState(null, '', `#${t}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Applies a change to state and persists it
  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = fn(prev);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const flashNew = useCallback((id: string) => {
    setNewId(id);
    setTimeout(() => setNewId(null), 700);
  }, []);

  const showToast = useCallback((text: string, onUndo?: () => void) => {
    undoFn.current = onUndo || null;
    setToast({ text, show: true });
    clearTimeout(toastTimer.current ?? undefined);
    toastTimer.current = setTimeout(() => {
      setToast(t => ({ ...t, show: false }));
      undoFn.current = null;
    }, 5000);
  }, []);

  const handleAdd = useCallback((input: Expense | Expense[]) => {
    const exps = Array.isArray(input) ? input : [input];
    if (!exps.length) return;
    const ids = new Set(exps.map(x => x.id));
    setBuddyMsg({ text: buddyReact(state, exps), key: Date.now() });
    update(prev => ({ ...prev, expenses: [...prev.expenses, ...exps] }));
    flashNew(exps[exps.length - 1].id);
    const text = exps.length === 1
      ? `Logged ${peso(exps[0].amount)} for ${catById(exps[0].cat).label}`
      : `Logged ${exps.length} expenses, ${peso(exps.reduce((s, x) => s + x.amount, 0))} total`;
    showToast(text, () => {
      update(prev => ({ ...prev, expenses: prev.expenses.filter(x => !ids.has(x.id)) }));
      setBuddyMsg(null);
    });
  }, [state, update, flashNew, showToast]);

  const handleUpdate = useCallback((exp: Expense) => {
    const before = state.expenses.find(x => x.id === exp.id);
    update(prev => ({ ...prev, expenses: prev.expenses.map(x => (x.id === exp.id ? exp : x)) }));
    flashNew(exp.id);
    showToast('Expense updated', before && (() => {
      update(prev => ({ ...prev, expenses: prev.expenses.map(x => (x.id === before.id ? before : x)) }));
    }));
  }, [state.expenses, update, flashNew, showToast]);

  const handleDelete = useCallback((id: string) => {
    const removed = state.expenses.find(x => x.id === id);
    if (!removed) return;
    update(prev => ({ ...prev, expenses: prev.expenses.filter(x => x.id !== id) }));
    showToast(`Deleted ${peso(removed.amount)} for ${catById(removed.cat).label}`, () => {
      update(prev => ({ ...prev, expenses: [...prev.expenses, removed] }));
      flashNew(removed.id);
    });
  }, [state.expenses, update, flashNew, showToast]);

  const openSettings = useCallback(() => {
    setSetBudget(String(state.budget));
    setSetStart(state.start);
    setSetEnd(state.end);
    setSetErr('');
    setArmClear(false);
    setSettingsOpen(true);
  }, [state]);

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(setBudget);
    if (!(budget > 0)) { setSetErr('Enter an allowance amount greater than ₱0.'); return; }
    if (!setStart || !setEnd) { setSetErr('Pick both a start and an end date.'); return; }
    if (setEnd < setStart) { setSetErr('The end date has to come after the start date.'); return; }
    update(prev => ({ ...prev, budget: Math.round(budget * 100) / 100, start: setStart, end: setEnd }));
    setSettingsOpen(false);
    showToast('Allowance settings saved');
  };

  // "N" jumps to the logger from anywhere
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'n' || e.metaKey || e.ctrlKey || e.altKey || settingsOpen) return;
      if (/^(input|textarea|select)$/i.test((document.activeElement as HTMLElement)?.tagName)) return;
      e.preventDefault();
      setTab('log');
      setTimeout(() => document.getElementById('amount')?.focus({ preventScroll: true }), 50);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [settingsOpen, setTab]);

  if (!mounted) return null;

  const c = compute(state);
  const current = TABS.find(t => t.id === tab)!;

  return (
    <div style={{ '--status': c.st.color } as React.CSSProperties}>
      <Sidebar
        tab={tab}
        onTab={setTab}
        start={state.start}
        end={state.end}
        remaining={c.remaining}
        statusColor={c.st.color}
        onSettings={openSettings}
      />

      <div className="md:pl-[280px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-32 md:pb-16">
          <header className="flex items-center justify-between gap-3 py-6">
            <div className="flex items-center gap-3 min-w-0">
              <Logo className="md:hidden" />
              <div className="min-w-0">
                <p className="eyebrow md:hidden">BaonBuddy</p>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-[-.04em] leading-tight truncate">{current.label}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openSettings} className="pill hidden sm:inline-flex md:hidden">
                <Icon name="calendar" className="w-3.5 h-3.5 text-muted" />
                <span className="tnum">{shortDate(state.start)} – {shortDate(state.end)}</span>
              </button>
              {tab !== 'log' && (
                <button type="button" className="pill plus hidden sm:inline-flex" onClick={() => setTab('log')}>
                  <Icon name="plus" className="w-3.5 h-3.5" />Log expense <span className="kbd">N</span>
                </button>
              )}
              <button onClick={openSettings} className="icon-btn" aria-label="Allowance settings">
                <Icon name="settings-2" />
              </button>
            </div>
          </header>

          <main key={tab}>
            {tab === 'overview' && <OverviewTab state={state} c={c} newId={newId} onTab={setTab} onSettings={openSettings} />}
            {tab === 'log' && <LogTab state={state} c={c} newId={newId} onAdd={handleAdd} onDelete={handleDelete} showToast={showToast} />}
            {tab === 'manage' && <ManageTab state={state} newId={newId} onUpdate={handleUpdate} onDelete={handleDelete} />}
            {tab === 'calculator' && <CalculatorTab state={state} c={c} onAdd={handleAdd} />}
            {tab === 'advisor' && <AdvisorTab state={state} c={c} messages={advisorMsgs} setMessages={setAdvisorMsgs} />}
          </main>

          <p className="text-center eyebrow mt-12">Prototype v0.2 · Your data stays in this browser</p>
        </div>
      </div>

      <BuddyPop msg={buddyMsg} onClose={closeBuddy} onChat={() => { setBuddyMsg(null); setTab('advisor'); }} />

      {/* Toast */}
      <div className={`toast above-tabbar ${toast.show ? 'show' : ''}`} role="status" aria-live="polite">
        <span>{toast.text}</span>
        {undoFn.current && (
          <button
            type="button"
            onClick={() => {
              undoFn.current?.();
              undoFn.current = null;
              setToast(t => ({ ...t, show: false }));
            }}
          >
            Undo
          </button>
        )}
        <span className="tbar" />
      </div>

      {/* Settings dialog */}
      {settingsOpen && (
        <dialog open className="fixed inset-0 z-50" aria-label="Allowance settings" onKeyDown={e => e.key === 'Escape' && setSettingsOpen(false)}>
          <form onSubmit={handleSettingsSave} className="sheet" noValidate>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="card-title">Allowance settings</h3>
                <p className="text-sm text-muted mt-1">Set your budget and the dates it should last.</p>
              </div>
              <button type="button" className="icon-btn shrink-0" onClick={() => setSettingsOpen(false)} aria-label="Close">
                <Icon name="x" />
              </button>
            </div>

            <label className="block mt-5" htmlFor="setBudget"><span className="field-label">Allowance amount</span></label>
            <div className="amount-field sm">
              <span className="peso">₱</span>
              <input
                id="setBudget"
                inputMode="decimal"
                placeholder="5000"
                value={setBudget}
                onChange={e => { setSetBudget(e.target.value.replace(/[^\d.]/g, '').slice(0, 9)); }}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button type="button" className="pill sm" onClick={() => { const [s, e] = weekRange(); setSetStart(s); setSetEnd(e); }}>This week</button>
              <button type="button" className="pill sm" onClick={() => { const [s, e] = monthRange(); setSetStart(s); setSetEnd(e); }}>This month</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <label>
                <span className="field-label">Starts</span>
                <input type="date" className="input" value={setStart} onChange={e => setSetStart(e.target.value)} />
              </label>
              <label>
                <span className="field-label">Ends</span>
                <input type="date" className="input" value={setEnd} onChange={e => setSetEnd(e.target.value)} />
              </label>
            </div>
            {setErr && <p className="text-sm text-[var(--danger)] mt-3">{setErr}</p>}

            <button type="submit" className="submit mt-5">
              <span className="badge"><Icon name="check" /></span>
              Save changes
            </button>

            <div className="mt-6 pt-5 border-t border-[var(--hair)]">
              <p className="field-label">Your data</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="pill sm"
                  onClick={() => {
                    update(() => sampleState());
                    setSettingsOpen(false);
                    showToast('Sample data loaded');
                  }}
                >
                  Load sample data
                </button>
                <button
                  type="button"
                  className="pill sm danger"
                  onClick={() => {
                    if (armClear) {
                      update(prev => ({ ...prev, expenses: [] }));
                      setSettingsOpen(false);
                      showToast('Cleared all expenses');
                    } else {
                      setArmClear(true);
                      setTimeout(() => setArmClear(false), 3000);
                    }
                  }}
                >
                  {armClear ? 'Tap again to confirm' : 'Clear all expenses'}
                </button>
              </div>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
