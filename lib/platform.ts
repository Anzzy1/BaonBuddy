import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const UI_KEY = 'baonbuddy-ui';

// The iOS app gets its own iOS 26 style shell (Liquid Glass tab bar, large
// titles, sheets). Android, Windows and the browser keep the original UI.
// In a browser, open with ?ui=ios to preview it (?ui=default switches back).
export function isIOSUI(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_UI === 'ios') return true;
  try {
    const q = new URLSearchParams(location.search).get('ui');
    if (q === 'ios') localStorage.setItem(UI_KEY, 'ios');
    if (q === 'default') localStorage.removeItem(UI_KEY);
    if (localStorage.getItem(UI_KEY) === 'ios') return true;
  } catch {}
  return Capacitor.getPlatform() === 'ios';
}

// Light tap feedback, like native tab bars and switches. No-op off-device.
export function tick(style: 'light' | 'medium' = 'light') {
  if (!Capacitor.isNativePlatform()) return;
  Haptics.impact({ style: style === 'light' ? ImpactStyle.Light : ImpactStyle.Medium }).catch(() => {});
}

// Detents while dragging across the tab bar. iOS needs selectionStart first.
export const selection = {
  start: () => { if (Capacitor.isNativePlatform()) Haptics.selectionStart().catch(() => {}); },
  changed: () => { if (Capacitor.isNativePlatform()) Haptics.selectionChanged().catch(() => {}); },
  end: () => { if (Capacitor.isNativePlatform()) Haptics.selectionEnd().catch(() => {}); },
};
