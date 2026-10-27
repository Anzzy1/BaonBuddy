'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import BuddyPop from '@/components/BuddyPop';
import Avatar from '@/components/Avatar';
import Onboarding from '@/components/Onboarding';
import CalendarSheet from '@/components/CalendarSheet';
import SettingsSheet from '@/components/SettingsSheet';
import AddMoneySheet from '@/components/sheets/AddMoneySheet';
import GoalSheet from '@/components/sheets/GoalSheet';
import PeriodSummarySheet from '@/components/sheets/PeriodSummarySheet';
import UpcomingSheet from '@/components/sheets/UpcomingSheet';
import Sidebar, { TABS, TabId } from '@/components/Sidebar';
import OverviewTab from '@/components/tabs/OverviewTab';
import LogTab from '@/components/tabs/LogTab';
import ManageTab from '@/components/tabs/ManageTab';
import CalculatorTab from '@/components/tabs/CalculatorTab';
import AdvisorTab, { AdvisorMsg } from '@/components/tabs/AdvisorTab';
import { IOSNavBar, IOSTabBar } from '@/components/ios/IOSChrome';
import { isIOSUI } from '@/lib/platform';
import {
  AppState, Expense, Goal, KEY, Upcoming, catById, compute, langOf, loadState, peso, rollPeriod, settingsOf, shortDate, today, uid,
} from '@/lib/budget';
import { translator } from '@/lib/i18n';
import { askPermission, onReminderTap, remindersSupported, syncReminders } from '@/lib/reminders';
import { buddyReact } from '@/lib/buddy';

const isTab = (s: string): s is TabId => TABS.some(t => t.id === s);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [ios, setIOS] = useState(false);
  const [state, setState] = useState<AppState>({ budget: 0, start: '', end: '', expenses: [] });
  // First launch (or after a reset): show onboarding. `legacy` is data saved before profiles existed.
  const [needsSetup, setNeedsSetup] = useState(false);
  const [legacy, setLegacy] = useState<AppState | null>(null);
  const [tab, setTabState] = useState<TabId>('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = useCallback(() => setCalendarOpen(true), []);
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });
  const [newId, setNewId] = useState<string | null>(null);
  const [advisorMsgs, setAdvisorMsgs] = useState<AdvisorMsg[]>([]);
  const [buddyMsg, setBuddyMsg] = useState<{ text: string; key: number } | null>(null);
  const closeBuddy = useCallback(() => setBuddyMsg(null), []);

  const [moneyOpen, setMoneyOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  // undefined = closed, null = new goal
  const [goalOpen, setGoalOpen] = useState<Goal | null | undefined>(undefined);
  const [upcomingOpen, setUpcomingOpen] = useState<Upcoming | null | undefined>(undefined);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoFn = useRef<(() => void) | null>(null);

  useEffect(() => {
    const iosUI = isIOSUI();
    setIOS(iosUI);
    if (iosUI) document.documentElement.dataset.ui = 'ios';
    setMounted(true);
    const loaded = loadState();
    if (loaded?.profile) {
      const s = rollPeriod(loaded);
      setState(s);
      if (s !== loaded) localStorage.setItem(KEY, JSON.stringify(s));
      // A period finished while the app was closed: show the recap
      if (s.pendingClose) setPeriodOpen(true);
    } else {
      setLegacy(loaded);
      setNeedsSetup(true);
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

  // Paying an upcoming expense logs it and releases the money that was set aside for it
  const handlePay = useCallback((u: Upcoming) => {
    const t = translator(langOf(state));
    const exp: Expense = { id: uid(), amount: u.amount, cat: u.cat, note: u.name, date: today(), ts: Date.now() };
    update(prev => ({ ...prev, upcoming: (prev.upcoming || []).filter(x => x.id !== u.id), expenses: [...prev.expenses, exp] }));
    flashNew(exp.id);
    showToast(t(`Paid ${u.name}, ${peso(u.amount)} logged`, `Bayad na ang ${u.name}, naitala ang ${peso(u.amount)}`, `Paid na ang ${u.name}, na-log ang ${peso(u.amount)}`), () => {
      update(prev => ({ ...prev, expenses: prev.expenses.filter(x => x.id !== exp.id), upcoming: [...(prev.upcoming || []), u] }));
    });
  }, [state, update, flashNew, showToast]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  // Repeating periods close on their own; custom ones (or an app left open past midnight) close here
  const openPeriodEnd = useCallback(() => {
    update(prev => rollPeriod(prev));
    setPeriodOpen(true);
  }, [update]);

  const resetApp = () => {
    localStorage.removeItem(KEY);
    setSettingsOpen(false);
    setState({ budget: 0, start: '', end: '', expenses: [] });
    setAdvisorMsgs([]);
    setLegacy(null);
    setNeedsSetup(true);
  };

  const restore = (data: AppState) => {
    update(() => data);
    setAdvisorMsgs([]);
    if (!data.profile) { setLegacy(data); setNeedsSetup(true); }
    showToast('Backup restored');
  };

  // Theme: follow the setting, and the OS when it's "system"
  const theme = settingsOf(state).theme;
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme; };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  // Reminders carry live numbers (₱ left, safe/day), so rebuild them after any change, debounced
  useEffect(() => {
    if (!mounted || !state.profile) return;
    const t = setTimeout(() => syncReminders(state), 1200);
    return () => clearTimeout(t);
  }, [mounted, state]);

  // Tapping a notification opens the tab it's about
  useEffect(() => onReminderTap(tab => { if (isTab(tab)) setTab(tab); }), [setTab]);

  const finishSetup = (s: AppState) => {
    update(() => s);
    setLegacy(null);
    setNeedsSetup(false);
    setTab('overview');
    // Right after setup is when the student expects reminders; the bill and check-in ones are on by default
    if (remindersSupported()) askPermission().then(ok => { if (ok) syncReminders(s); }).catch(() => {});
  };

  // "N" jumps to the logger from anywhere
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Some Android/WebView keyboards emit keydown with no `key`.
      const key = typeof e.key === 'string' ? e.key.toLowerCase() : '';
      if (key !== 'n' || e.metaKey || e.ctrlKey || e.altKey || settingsOpen || calendarOpen || moneyOpen || periodOpen || goalOpen !== undefined || upcomingOpen !== undefined) return;
      if (/^(input|textarea|select)$/i.test((document.activeElement as HTMLElement)?.tagName)) return;
      e.preventDefault();
      setTab('log');
      setTimeout(() => document.getElementById('amount')?.focus({ preventScroll: true }), 50);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [settingsOpen, calendarOpen, moneyOpen, periodOpen, goalOpen, upcomingOpen, setTab]);

  if (!mounted) return null;
  if (needsSetup) return <Onboarding existing={legacy} onDone={finishSetup} />;

  const c = compute(state);
  const current = TABS.find(t => t.id === tab)!;
  const firstName = state.profile?.name.split(/\s+/)[0];
  const title = tab === 'overview' && firstName ? `Hi, ${firstName}!` : current.label;

  return (
    <div style={{ '--status': c.st.color } as React.CSSProperties}>
      {ios ? (
        <IOSTabBar tab={tab} onTab={setTab} />
      ) : (
        <Sidebar
          tab={tab}
          onTab={setTab}
          start={state.start}
          end={state.end}
          remaining={c.remaining}
          statusColor={c.st.color}
          onSettings={openSettings}
          onCalendar={openCalendar}
          profile={state.profile}
        />
      )}

      <div className={ios ? '' : 'md:pl-[280px]'}>
        <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${ios ? 'pb-36' : 'pb-32 md:pb-16'}`}>
          {ios ? (
            <IOSNavBar title={title} start={state.start} end={state.end} onSettings={openSettings} onCalendar={openCalendar} />
          ) : (
          <header className="flex items-center justify-between gap-3 py-6">
            <div className="flex items-center gap-3 min-w-0">
              <Logo className="md:hidden" />
              <div className="min-w-0">
                <p className="eyebrow md:hidden">BaonBuddy</p>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-[-.04em] leading-tight truncate">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={openCalendar} className="pill md:hidden" aria-label="Spending calendar">
                <Icon name="calendar" className="w-3.5 h-3.5 text-muted" />
                <span className="tnum hidden sm:inline">{shortDate(state.start)} – {shortDate(state.end)}</span>
              </button>
              {tab !== 'log' && (
                <button type="button" className="pill plus hidden sm:inline-flex" onClick={() => setTab('log')}>
                  <Icon name="plus" className="w-3.5 h-3.5" />Log expense <span className="kbd">N</span>
                </button>
              )}
              <button onClick={openSettings} className="icon-btn hidden md:grid" aria-label="Settings">
                <Icon name="settings-2" />
              </button>
              <button onClick={openSettings} className="md:hidden rounded-full" aria-label="Profile and settings">
                <Avatar id={state.profile?.avatar} size={40} />
              </button>
            </div>
          </header>
          )}

          <main key={tab}>
            {tab === 'overview' && <OverviewTab state={state} c={c} newId={newId} onTab={setTab} onSettings={openSettings} onAddMoney={() => setMoneyOpen(true)} onGoal={g => setGoalOpen(g)} onUpcoming={u => setUpcomingOpen(u)} onPay={handlePay} onPeriodEnd={openPeriodEnd} />}
            {tab === 'log' && <LogTab state={state} c={c} newId={newId} onAdd={handleAdd} onDelete={handleDelete} showToast={showToast} update={update} />}
            {tab === 'manage' && <ManageTab state={state} newId={newId} onUpdate={handleUpdate} onDelete={handleDelete} />}
            {tab === 'calculator' && <CalculatorTab state={state} c={c} onAdd={handleAdd} update={update} showToast={showToast} />}
            {tab === 'advisor' && <AdvisorTab state={state} c={c} messages={advisorMsgs} setMessages={setAdvisorMsgs} />}
          </main>

          <p className="text-center eyebrow mt-12">BaonBuddy · Your data stays on this {ios ? 'iPhone' : 'device'}</p>
        </div>
      </div>

      <BuddyPop msg={buddyMsg} avatar={state.profile?.avatar} onClose={closeBuddy} onChat={() => { setBuddyMsg(null); setTab('advisor'); }} />

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

      {calendarOpen && <CalendarSheet state={state} c={c} ios={ios} onClose={() => setCalendarOpen(false)} />}

      {settingsOpen && (
        <SettingsSheet state={state} update={update} onClose={() => setSettingsOpen(false)} showToast={showToast} onRestore={restore} onReset={resetApp} />
      )}
      {moneyOpen && <AddMoneySheet state={state} update={update} onClose={() => setMoneyOpen(false)} showToast={showToast} />}
      {upcomingOpen !== undefined && <UpcomingSheet state={state} item={upcomingOpen} update={update} onClose={() => setUpcomingOpen(undefined)} onPay={handlePay} showToast={showToast} />}
      {goalOpen !== undefined && <GoalSheet state={state} goal={goalOpen} update={update} onClose={() => setGoalOpen(undefined)} showToast={showToast} />}
      {periodOpen && (state.pendingClose || today() > state.end) && (
        <PeriodSummarySheet state={state} update={update} onClose={() => setPeriodOpen(false)} showToast={showToast} />
      )}
    </div>
  );
}
