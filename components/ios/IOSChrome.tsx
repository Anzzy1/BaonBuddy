'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { TABS, TabId } from '@/components/Sidebar';
import { selection, tick } from '@/lib/platform';
import { shortDate } from '@/lib/budget';

// iOS 26 style chrome: a floating Liquid Glass tab bar with a sliding lens,
// and a scroll-edge nav bar that picks up the title once the large one scrolls away.

// "Log" sits apart as its own round glass button, like Search in iOS 26 apps
const BAR_TABS = TABS.filter(t => t.id !== 'log');

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return y;
}

export function IOSTabBar({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) {
  const barRef = useRef<HTMLElement>(null);
  const [drag, setDrag] = useState<{ x: number; i: number } | null>(null);
  const [min, setMin] = useState(false);
  const active = BAR_TABS.findIndex(t => t.id === tab);

  // Shrink while scrolling down through content, grow back on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setMin(y > 120 && y > last);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMin(false), [tab]);

  const metrics = (clientX: number) => {
    const r = barRef.current!.getBoundingClientRect();
    const w = (r.width - 8) / BAR_TABS.length;
    const x = Math.min(Math.max(clientX - r.left - 4 - w / 2, 0), w * (BAR_TABS.length - 1));
    return { x, i: Math.round(x / w) };
  };

  const select = (id: TabId) => {
    if (id !== tab) tick();
    onTab(id);
  };

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    barRef.current!.setPointerCapture(e.pointerId);
    selection.start();
    setMin(false);
    setDrag(metrics(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const m = metrics(e.clientX);
    if (m.i !== drag.i) selection.changed();
    setDrag(m);
  };
  const onUp = () => {
    if (!drag) return;
    selection.end();
    select(BAR_TABS[drag.i].id);
    setDrag(null);
  };

  const lensStyle = drag
    ? { transform: `translateX(${drag.x}px) scale(1.18)`, transition: 'none' }
    : { transform: `translateX(calc(${Math.max(active, 0)} * 100%))` };

  return (
    <div className={`ios-tabs ${min ? 'is-min' : ''}`}>
      <nav
        ref={barRef}
        className={`lg lg-bar ${drag ? 'is-drag' : ''}`}
        aria-label="Main navigation"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => { selection.end(); setDrag(null); }}
      >
        <span className={`lg-lens ${active < 0 && !drag ? 'is-off' : ''}`} style={lensStyle} aria-hidden />
        {BAR_TABS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? 'page' : undefined}
            className={drag?.i === i ? 'is-hot' : ''}
            // Pointer taps select on pointerup; this only handles keyboard activation
            onClick={e => { if (e.detail === 0) select(t.id); }}
          >
            <Icon name={t.icon} />
            <span>{t.id === 'advisor' ? 'Buddy' : t.short}</span>
          </button>
        ))}
      </nav>
      <button
        type="button"
        className="lg lg-fab"
        aria-label="Log expense"
        aria-current={tab === 'log' ? 'page' : undefined}
        onClick={() => select('log')}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}

interface NavBarProps {
  title: string;
  start: string;
  end: string;
  onSettings: () => void;
  onCalendar: () => void;
}

export function IOSNavBar({ title, start, end, onSettings, onCalendar }: NavBarProps) {
  const y = useScrollY();
  const inline = y > 44;

  return (
    <>
      <div className={`ios-nav ${inline ? 'is-inline' : ''}`}>
        <span className="ios-nav-title" aria-hidden={!inline}>{title}</span>
        <div className="ios-nav-actions">
          <button type="button" className="lg lg-capsule" onClick={() => { tick(); onCalendar(); }} aria-label="Spending calendar">
            <Icon name="calendar" />
            <span className="tnum">{shortDate(start)} – {shortDate(end)}</span>
          </button>
          <button type="button" className="lg lg-circle" onClick={() => { tick(); onSettings(); }} aria-label="Settings">
            <Icon name="settings-2" />
          </button>
        </div>
      </div>
      <header className="ios-large">
        <p className="ios-kicker">BaonBuddy</p>
        <h1>{title}</h1>
      </header>
    </>
  );
}
