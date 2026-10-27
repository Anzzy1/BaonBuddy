'use client';

import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import Avatar from '@/components/Avatar';
import { Profile, shortDate } from '@/lib/budget';

export const TABS = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: 'layout-dashboard', color: 'var(--mint)' },
  { id: 'log', label: 'Log expense', short: 'Log', icon: 'pen-line', color: 'var(--lime)' },
  { id: 'manage', label: 'Manage expenses', short: 'Manage', icon: 'list-checks', color: 'var(--pink)' },
  { id: 'calculator', label: 'Calculator', short: 'Calc', icon: 'calculator', color: 'var(--peach)' },
  { id: 'advisor', label: 'AI Advisor', short: 'Advisor', icon: 'bot', color: 'var(--sky)' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

interface SidebarProps {
  tab: TabId;
  onTab: (t: TabId) => void;
  start: string;
  end: string;
  remaining: number;
  statusColor: string;
  onSettings: () => void;
  onCalendar: () => void;
  profile?: Profile;
}

export default function Sidebar({ tab, onTab, start, end, remaining, statusColor, onSettings, onCalendar, profile }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet rail */}
      <aside className="side hidden md:flex" aria-label="Main navigation">
        <div className="flex items-center gap-3 px-2">
          <Logo />
          <div className="min-w-0">
            <p className="font-display font-extrabold text-[17px] leading-none tracking-tight">BaonBuddy</p>
            <p className="text-xs text-muted mt-1">Smart allowance tracker</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              className="nav-item"
              aria-current={tab === t.id ? 'page' : undefined}
              style={{ '--c': t.color } as React.CSSProperties}
              onClick={() => onTab(t.id)}
            >
              <span className="nav-ic"><Icon name={t.icon} /></span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto side-card">
          {profile && (
            <button type="button" className="flex items-center gap-2.5 w-full text-left mb-4" onClick={onSettings} aria-label="Profile and settings">
              <Avatar id={profile.avatar} size={36} />
              <span className="min-w-0">
                <span className="block font-semibold text-[14px] truncate">{profile.name}</span>
                <span className="block text-[12px] text-muted capitalize">{profile.period} allowance</span>
              </span>
            </button>
          )}
          <p className="eyebrow">{remaining < 0 ? 'Over by' : 'Remaining'}</p>
          <p className="font-display font-extrabold text-2xl tracking-[-.04em] tnum mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor }} />
            ₱{Math.round(Math.abs(remaining)).toLocaleString('en-PH')}
          </p>
          <button type="button" className="pill sm mt-3 w-full justify-center" onClick={onCalendar} aria-label="Spending calendar">
            <Icon name="calendar" className="w-3.5 h-3.5 text-muted" />
            <span className="tnum">{shortDate(start)} – {shortDate(end)}</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="tabbar md:hidden" aria-label="Main navigation">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? 'page' : undefined}
            style={{ '--c': t.color } as React.CSSProperties}
            onClick={() => onTab(t.id)}
          >
            <span className="nav-ic"><Icon name={t.icon} /></span>
            <span>{t.short}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
