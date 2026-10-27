// Trends: week over week, month over month by category, and how past periods went.
import { AppState, CATS, addDays, iso } from '@/lib/budget';

const sumBetween = (state: AppState, from: string, to: string, cat?: string) =>
  state.expenses.filter(e => e.date >= from && e.date <= to && (!cat || e.cat === cat)).reduce((s, e) => s + e.amount, 0);

export function trends(state: AppState) {
  const now = new Date();
  const thisWeek = sumBetween(state, iso(addDays(now, -6)), iso(now));
  const lastWeek = sumBetween(state, iso(addDays(now, -13)), iso(addDays(now, -7)));
  const weekChange = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : null;

  // Month to date vs the same days last month, so a half-finished month compares fairly
  const day = now.getDate();
  const mStart = iso(new Date(now.getFullYear(), now.getMonth(), 1));
  const pStart = iso(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const pEnd = iso(new Date(now.getFullYear(), now.getMonth() - 1, Math.min(day, new Date(now.getFullYear(), now.getMonth(), 0).getDate())));
  const cats = CATS.map(c => {
    const cur = sumBetween(state, mStart, iso(now), c.id);
    const prev = sumBetween(state, pStart, pEnd, c.id);
    return { ...c, cur, prev, diff: cur - prev };
  }).filter(c => c.cur > 0 || c.prev > 0);
  const rising = [...cats].filter(c => c.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, 3);
  const falling = [...cats].filter(c => c.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 2);

  // Last 7 days, oldest first, for the mini bar chart
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = iso(addDays(now, i - 6));
    return { date: d, sum: sumBetween(state, d, d) };
  });

  const history = [...(state.history || [])].reverse();
  const savedAllTime = (state.history || []).reduce((s, r) => s + r.saved + (r.leftoverTo === 'goal' ? r.leftover : 0), 0);

  return { thisWeek, lastWeek, weekChange, rising, falling, days, history, savedAllTime };
}
