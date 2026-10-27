// Local reminders (no server, work offline). Only the Android/iOS apps can schedule them.
//
// Everything is rebuilt from the current data on every launch and every change, so the numbers
// in a notification (₱ left, safe/day) are always as of the last thing the student logged.
// Alerts that only change when the student logs something (crossing 80%, over today's limit)
// stay in-app as Buddy's reaction instead of becoming push notifications.
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppState, addDays, catName, compute, iso, langOf, parse, pesoR, settingsOf, shortDate, today } from '@/lib/budget';
import { translator } from '@/lib/i18n';

// iOS keeps only the 64 soonest pending notifications per app; stay under it
const MAX_PENDING = 60;

// Android channels, so each kind can be muted from the phone's settings
const CHANNELS = [
  { id: 'bills', name: 'Bills & utang', description: 'Upcoming expenses and unsettled utang', importance: 4 as const },
  { id: 'budget', name: 'Budget check-ins', description: 'Period ending, new period, morning safe-to-spend', importance: 3 as const },
  { id: 'goals', name: 'Savings goals', description: 'Goal deadlines', importance: 3 as const },
  { id: 'logging', name: 'Logging reminders', description: 'Daily log reminder and missed-log nudges', importance: 3 as const },
  { id: 'summary', name: 'Weekly summary', description: 'Sunday recap of your spending', importance: 2 as const },
];
type Channel = (typeof CHANNELS)[number]['id'];

// The tab a tap on the notification opens
type Tab = 'overview' | 'log' | 'calculator' | 'advisor';

interface Planned { title: string; body: string; at: Date; channel: Channel; tab: Tab }

export const remindersSupported = () => Capacitor.isNativePlatform();

export async function askPermission(): Promise<boolean> {
  if (!remindersSupported()) return false;
  const now = await LocalNotifications.checkPermissions();
  if (now.display === 'granted') return true;
  return (await LocalNotifications.requestPermissions()).display === 'granted';
}

export async function permissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
  if (!remindersSupported()) return 'unsupported';
  const { display } = await LocalNotifications.checkPermissions();
  return display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt';
}

// Opens the right tab when a notification is tapped. Returns a cleanup function.
export function onReminderTap(open: (tab: string) => void) {
  if (!remindersSupported()) return () => {};
  const handle = LocalNotifications.addListener('localNotificationActionPerformed', e => {
    const tab = e.notification.extra?.tab;
    if (typeof tab === 'string') open(tab);
  });
  return () => { handle.then(h => h.remove()).catch(() => {}); };
}

const at = (day: string, hour: number, minute = 0) => {
  const d = parse(day);
  d.setHours(hour, minute, 0, 0);
  return d;
};
// Next date on this weekday (0 = Sunday) at the given hour, today included if it's still ahead
function nextWeekday(wd: number, hour: number) {
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const d = at(iso(addDays(now, i)), hour);
    if (d.getDay() === wd && d > now) return d;
  }
  return at(iso(addDays(now, 7)), hour);
}

export function planReminders(state: AppState): Planned[] {
  const s = settingsOf(state);
  const lang = langOf(state);
  const t = translator(lang);
  const c = compute(state);
  const td = today();
  const out: Planned[] = [];
  const add = (p: Planned) => out.push(p);
  const date = (d: string) => shortDate(d, lang);

  // Upcoming expenses: a few days before (lead), the morning it's due, and the morning after if still unpaid
  if (s.remindUpcoming) {
    for (const u of state.upcoming || []) {
      const what = `${u.name} (${pesoR(u.amount)})`;
      const lead = s.upcomingLead;
      add({
        at: at(iso(addDays(parse(u.due), -lead)), 9),
        channel: 'bills', tab: 'overview',
        title: lead === 1
          ? t(`Due tomorrow: ${what}`, `Bukas na ang bayad: ${what}`, `Due bukas: ${what}`)
          : t(`Due in ${lead} days: ${what}`, `${lead} araw na lang bago ang bayad: ${what}`, `Due in ${lead} days: ${what}`),
        body: t(`The money is already set aside, due ${date(u.due)}.`,
                `Nakatabi na ang pera. Takdang araw: ${date(u.due)}.`,
                `Nakatabi na ang pera, due sa ${date(u.due)}.`),
      });
      add({
        at: at(u.due, 8),
        channel: 'bills', tab: 'overview',
        title: t(`Due today: ${what}`, `Ngayon ang bayad: ${what}`, `Due today: ${what}`),
        body: t('Mark it as paid in BaonBuddy once it’s done.',
                'Markahan itong bayad na sa BaonBuddy kapag tapos na.',
                'I-mark as paid sa BaonBuddy pag bayad na.'),
      });
      add({
        at: at(iso(addDays(parse(u.due), 1)), 9),
        channel: 'bills', tab: 'overview',
        title: t(`Overdue: ${what}`, `Lampas na sa takdang araw: ${what}`, `Overdue na: ${what}`),
        body: t('Already paid? Mark it as paid so the money set aside is counted. Not yet? Its money is still kept for it.',
                'Bayad na ba? Markahan para maitala. Hindi pa? Nakatabi pa rin ang pera para rito.',
                'Bayad na ba? I-mark as paid para ma-log. Hindi pa? Nakatabi pa rin ang pera para dito.'),
      });
    }
  }

  // Utang: one weekly roundup (Sunday 10 AM) instead of one per person
  if (s.remindDebts) {
    const open = (state.debts || []).filter(d => !d.settled);
    const owe = open.filter(d => d.dir === 'owe');
    const owed = open.filter(d => d.dir === 'owed');
    if (open.length) {
      const sum = (l: typeof open) => pesoR(l.reduce((x, d) => x + d.amount, 0));
      const names = (l: typeof open) => l.slice(0, 3).map(d => d.person).join(', ') + (l.length > 3 ? '…' : '');
      const parts: string[] = [];
      if (owe.length) parts.push(t(`You owe ${sum(owe)} (${names(owe)}).`, `May utang ka pang ${sum(owe)} (${names(owe)}).`, `May utang ka pang ${sum(owe)} (${names(owe)}).`));
      if (owed.length) parts.push(t(`Still owed to you: ${sum(owed)} (${names(owed)}).`, `May utang pa sa iyo na ${sum(owed)} (${names(owed)}).`, `May utang pa sa'yo na ${sum(owed)} (${names(owed)}).`));
      add({
        at: nextWeekday(0, 10),
        channel: 'bills', tab: 'calculator',
        title: t('Utang check', 'Paalala sa utang', 'Utang check'),
        body: parts.join(' '),
      });
    }
  }

  // Savings goals with a deadline: a week before and the day before, while short of target
  if (s.remindGoals) {
    for (const g of state.goals || []) {
      if (!g.deadline || !(g.target > g.saved)) continue;
      const short = pesoR(g.target - g.saved);
      add({
        at: at(iso(addDays(parse(g.deadline), -7)), 10),
        channel: 'goals', tab: 'overview',
        title: t(`1 week left for ${g.name}`, `Isang linggo na lang para sa ${g.name}`, `1 week na lang for ${g.name}`),
        body: t(`${short} to go to reach ${pesoR(g.target)} by ${date(g.deadline)}.`,
                `Kulang pa ng ${short} para maabot ang ${pesoR(g.target)} bago mag-${date(g.deadline)}.`,
                `Kulang pa ng ${short} para ma-reach ang ${pesoR(g.target)} by ${date(g.deadline)}.`),
      });
      add({
        at: at(iso(addDays(parse(g.deadline), -1)), 10),
        channel: 'goals', tab: 'overview',
        title: t(`${g.name} is due tomorrow`, `Bukas na ang target mo sa ${g.name}`, `Bukas na ang deadline ng ${g.name}`),
        body: t(`${short} short of ${pesoR(g.target)}. Move the deadline or add what you can.`,
                `Kulang pa ng ${short} sa ${pesoR(g.target)}. Iurong ang petsa o magdagdag ng makakaya mo.`,
                `Kulang pa ng ${short} sa ${pesoR(g.target)}. I-move ang deadline or mag-add ng kaya mo.`),
      });
    }
  }

  // Period ending: the morning two days out, with the real numbers
  if (s.remindPeriodEnd && state.end >= td) {
    const left2 = c.remaining > 0 ? c.remaining / 2 : 0;
    add({
      at: at(iso(addDays(parse(state.end), -1)), 8),
      channel: 'budget', tab: 'overview',
      title: t('2 days left in your period', '2 araw na lang ang period mo', '2 days na lang ang period mo'),
      body: c.remaining > 0
        ? t(`You have ${pesoR(c.remaining)} left, about ${pesoR(left2)} a day to make it.`,
            `May ${pesoR(c.remaining)} ka pa, mga ${pesoR(left2)} kada araw para umabot.`,
            `May ${pesoR(c.remaining)} ka pa, mga ${pesoR(left2)} a day para umabot.`)
        : t(`You're ${pesoR(-c.remaining)} over. Essentials only until your next allowance.`,
            `Lampas ka na ng ${pesoR(-c.remaining)}. Mga kailangan lang muna hanggang sa susunod mong baon.`,
            `Over ka na ng ${pesoR(-c.remaining)}. Essentials lang muna hanggang next allowance.`),
    });
    // Custom periods don't roll over on their own
    if (state.profile?.period === 'custom') {
      add({
        at: at(iso(addDays(parse(state.end), 1)), 8),
        channel: 'budget', tab: 'overview',
        title: t('Your period has ended', 'Tapos na ang period mo', 'Tapos na ang period mo'),
        body: t('See how it went and start the next one when your allowance comes in.',
                'Tingnan kung kumusta ito at magsimula ng bago pagdating ng baon mo.',
                'I-check kung kumusta at mag-start ng bago pag dumating na ang allowance mo.'),
      });
    }
  }

  // Repeating allowances: a heads-up on the morning the next period starts
  const period = state.profile?.period;
  if (s.remindAllowance && period && period !== 'custom') {
    add({
      at: at(iso(addDays(parse(state.end), 1)), 8),
      channel: 'budget', tab: 'overview',
      title: t('New allowance period starts today', 'Magsisimula ngayon ang bagong period ng baon', 'New allowance period starts today'),
      body: t('Your budget has reset. Check how last period went and plan this one.',
              'Bago na ulit ang badyet mo. Silipin kung kumusta ang nakaraang period at planuhin ang ngayon.',
              'Reset na ang budget mo. I-check kung kumusta ang last period at i-plan ang bago.'),
    });
  }

  // Morning safe-to-spend, for tomorrow (assumes nothing more is spent today; rebuilt on every log)
  if (s.remindMorning) {
    const tomorrow = iso(addDays(new Date(), 1));
    if (tomorrow >= state.start && tomorrow <= state.end && c.left > 1) {
      const safe = Math.max(0, c.remaining) / (c.left - 1);
      add({
        at: at(tomorrow, 7),
        channel: 'budget', tab: 'log',
        title: t(`Safe to spend today: ${pesoR(safe)}`, `Ligtas na gastos ngayon: ${pesoR(safe)}`, `Safe to spend today: ${pesoR(safe)}`),
        body: c.remaining > 0
          ? t(`${pesoR(c.remaining)} left for ${c.left - 1} days.`, `${pesoR(c.remaining)} pa para sa ${c.left - 1} araw.`, `${pesoR(c.remaining)} pa for ${c.left - 1} days.`)
          : t('You’re over budget, so essentials only today.', 'Lampas ka na sa badyet, kaya mga kailangan lang ngayon.', 'Over budget ka na, kaya essentials lang today.'),
      });
    }
  }

  // Weekly recap, Sunday 7 PM: Monday to Sunday of that week, as logged so far
  if (s.remindWeekly) {
    const when = nextWeekday(0, 19);
    const from = iso(addDays(when, -6));
    const to = iso(when);
    const week = state.expenses.filter(e => e.date >= from && e.date <= to);
    const spent = week.reduce((x, e) => x + e.amount, 0);
    const byCat: Record<string, number> = {};
    week.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    add({
      at: when,
      channel: 'summary', tab: 'overview',
      title: t('Your week in BaonBuddy', 'Ang linggo mo sa BaonBuddy', 'Your week sa BaonBuddy'),
      body: spent > 0
        ? t(`You spent ${pesoR(spent)} this week, mostly on ${catName(top[0], lang)} (${pesoR(top[1])}). ${pesoR(Math.max(0, c.remaining))} left this period.`,
            `Gumastos ka ng ${pesoR(spent)} ngayong linggo, karamihan sa ${catName(top[0], lang)} (${pesoR(top[1])}). ${pesoR(Math.max(0, c.remaining))} pa ang natitira ngayong period.`,
            `Naka-${pesoR(spent)} ka this week, halos sa ${catName(top[0], lang)} (${pesoR(top[1])}). ${pesoR(Math.max(0, c.remaining))} pa ang natitira this period.`)
        : t('Nothing logged this week. Add what you spent so your budget stays accurate.',
            'Wala kang naitala ngayong linggo. Ilista ang mga ginastos mo para tama ang badyet mo.',
            'Wala kang na-log this week. I-add ang mga ginastos mo para accurate ang budget mo.'),
    });
  }

  // Daily log reminder: one per day for the next week, skipping today once something is logged
  if (s.remindDaily) {
    const [hour, minute] = s.remindTime.split(':').map(Number);
    const loggedToday = state.expenses.some(e => e.date === td);
    for (let i = loggedToday ? 1 : 0; i < 7; i++) {
      add({
        at: at(iso(addDays(new Date(), i)), hour, minute),
        channel: 'logging', tab: 'log',
        title: t('Did you log today’s expenses?', 'Nailista mo na ba ang gastos mo ngayon?', 'Na-log mo na ba ang gastos mo today?'),
        body: t('Take 10 seconds to log what you spent so your budget stays accurate.',
                'Maglaan ng 10 segundo para ilista ang ginastos mo, para tama ang badyet mo.',
                'Mag-10 seconds ka lang para i-log ang ginastos mo, para accurate ang budget mo.'),
      });
    }
  }

  // Missed logs: 3 days after the last entry (the daily reminder already covers this when it's on)
  if (s.remindInactive && !s.remindDaily) {
    const last = Math.max(state.profile?.createdAt || 0, ...state.expenses.map(e => e.ts));
    // Three days after the last entry; if that already passed, three days from now (they just opened the app)
    const base = new Date(at(iso(addDays(new Date(last), 3)), 19) > new Date() ? last : Date.now());
    add({
      at: at(iso(addDays(base, 3)), 19),
      channel: 'logging', tab: 'log',
      title: t('Haven’t seen you in a while', 'Matagal ka nang hindi naglilista', 'Matagal ka nang hindi nagla-log'),
      body: t('Nothing logged for 3 days. Spent anything? Logging keeps your safe/day accurate.',
              '3 araw nang walang naitala. May nagastos ka ba? Para tama ang ligtas mong gastos kada araw.',
              '3 days nang walang na-log. May nagastos ka ba? Para accurate ang safe/day mo.'),
    });
  }

  // Only the future ones, soonest first, within the iOS cap
  const now = Date.now();
  return out.filter(p => p.at.getTime() > now).sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, MAX_PENDING);
}

let channelsReady = false;

// Clears and re-creates every reminder from the current data. Safe to call on every launch.
export async function syncReminders(state: AppState) {
  if (!remindersSupported()) return;
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) });
    if ((await LocalNotifications.checkPermissions()).display !== 'granted') return;

    if (!channelsReady && Capacitor.getPlatform() === 'android') {
      await Promise.all(CHANNELS.map(ch => LocalNotifications.createChannel({ ...ch, visibility: 1 })));
      channelsReady = true;
    }

    const list = planReminders(state).map((p, i) => ({
      id: i + 1,
      title: p.title,
      body: p.body,
      largeBody: p.body,
      channelId: p.channel,
      extra: { tab: p.tab },
      // Minute-exact timing isn't needed for budget reminders, and asking for exact alarms
      // would open Android's "Alarms & reminders" settings screen on every sync
      isExactNotification: false,
      schedule: { at: p.at, allowWhileIdle: true },
    }));
    if (list.length) await LocalNotifications.schedule({ notifications: list });
  } catch {
    // Reminders are a nice-to-have; never let them break the app
  }
}
