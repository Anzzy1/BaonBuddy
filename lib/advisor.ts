// Buddy's offline brain: figures out what the student is asking and answers with exact numbers.
// Pure functions only, so the API route and the browser (when the server is unreachable) share it.
import { AppState, CATS, catById, compute, pesoR, shortDate, today } from '@/lib/budget';
import { Lang, detectCategory, detectLang, extractAmount } from '@/lib/parseExpense';

export type Intent =
  | 'greet' | 'thanks' | 'off_topic' | 'afford' | 'save_goal' | 'days_left' | 'spend_today'
  | 'category_spend' | 'spent_total' | 'remaining' | 'breakdown' | 'why_high' | 'event'
  | 'save_tips' | 'category_tips' | 'cut_tips' | 'status' | 'unknown';

// Intents whose answer is pure math: the rule reply is always used, no AI rewrite
export const EXACT_INTENTS = new Set<Intent>([
  'greet', 'thanks', 'off_topic', 'afford', 'save_goal', 'days_left', 'spend_today',
  'category_spend', 'spent_total', 'remaining', 'breakdown', 'why_high', 'status', 'event',
]);

export const CAT_TIPS: Record<string, { en: string; tl: string }> = {
  food: {
    en: 'Pack lunch 2-3 times a week, share viands with friends, and skip the daily milk tea.',
    tl: 'Magbaon ng lunch 2-3x a week, mag-share ng ulam sa tropa, at iwas muna sa daily milk tea.',
  },
  transpo: {
    en: 'Ride home with classmates, walk short distances, and take the jeep instead of Grab/Angkas when you can.',
    tl: 'Sumabay sa classmates pauwi, maglakad kung malapit lang, at jeep muna imbes na Grab o Angkas.',
  },
  school: {
    en: 'Photocopy borrowed books, print only what you really need, and buy supplies in bulk.',
    tl: 'Mag-photocopy na lang ng hiram na libro, i-print lang ang kailangan, at bumili ng supplies nang maramihan.',
  },
  load: {
    en: 'Use school or piso WiFi, and pick longer promos instead of daily load.',
    tl: 'Gamitin ang school WiFi o piso WiFi, at kumuha ng mas mahabang promo imbes na daily load.',
  },
  gala: {
    en: 'Set a weekly gala budget and look for free hangouts like parks or movie nights at home.',
    tl: 'Mag-set ng gala budget per week, at subukan ang libreng tambayan tulad ng park o movie night sa bahay.',
  },
  other: {
    en: 'Review your "Others" entries. Small leaks add up fast.',
    tl: 'I-check ang "Others" mo. Ang maliliit na gastos, mabilis lumaki pag pinagsama.',
  },
};

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const has = (m: string, re: RegExp) => re.test(m);

const MONEY = /\b(budget|baon|allowance|pera|money|peso|pesos|piso|gastos|gastusin|gumastos|nagastos|ginastos|spend|spent|spending|expense|expenses|ipon|save|saving|savings|tipid|afford|bili|bilhin|bumili|buy|bayad|cost|presyo|price|natitira|remaining|balance|left)\b|₱/;
const OFF_TOPIC = /\b(homework|assignment|math|algebra|calculus|capital of|president|weather|panahon ngayon|recipe|lyrics|essay|thesis|code|coding|program|python|javascript|translate|joke|biro|movie recommendation|song|who is|sino si|history of|science|physics|chemistry|biology|crush|jowa|love life)\b/;

function amountIn(message: string) {
  // Ignore numbers that describe time or percent, e.g. "3 days left" or "20%"
  const cleaned = message.replace(/\b\d+\s*(days?|araw|weeks?|linggo|months?|buwan|hours?|oras|mins?|minutes?|%|percent)\b/gi, ' ');
  return extractAmount(cleaned);
}

export function classify(message: string, history: { role: 'user' | 'assistant'; text: string }[] = []): { intent: Intent; amount: number; cat: string } {
  const m = message.toLowerCase().trim();
  const words = m.split(/\s+/).filter(Boolean);
  const amount = amountIn(m);
  const catRaw = detectCategory(m);
  const cat = catRaw !== 'other' || /\b(others?|misc)\b/.test(m) ? catRaw : '';
  const money = has(m, MONEY) || amount > 0 || !!cat;

  const r = (intent: Intent) => ({ intent, amount, cat });

  if (words.length <= 5 && !amount && has(m, /\b(salamat|thank|thanks|thank you|ty|tnx|thx|tysm|arigato)\b/)) return r('thanks');
  if (words.length <= 4 && !money && has(m, /^(hi+|hello|hey|yo|uy|kumusta|kamusta|musta|good (morning|afternoon|evening)|magandang (umaga|hapon|gabi)|sup|hoy)\b/)) return r('greet');
  if (has(m, OFF_TOPIC) && !money) return r('off_topic');

  if (amount > 0 && has(m, /\b(ipon|mag-?ipon|save|saving|savings|itabi|matira|maitabi|target|goal)\b/)) return r('save_goal');
  if (amount > 0 && has(m, /\b(bili|bilhin|bumili|mabili|buy|afford|kaya|kakayanin|pwede|puwede|purchase|get|worth|order|mag-?order|bayaran|gastusin|treat|sulit)\b/)) return r('afford');

  if (has(m, /(ilang araw|how many days|kailan (matatapos|ang end)|bago matapos|when does (my|the) (period|budget) end|matatapos ba)/)) return r('days_left');
  if (has(m, /(today|ngayon|ngayong araw|per day|a day|daily|araw-araw|kada araw)/) && has(m, /(spend|gastos|gastusin|gumastos|budget|pwede|puwede|can i|how much|magkano|safe)/)) return r('spend_today');

  if (has(m, /(how much (did|have) i|magkano (na )?(ang |yung |ung )?(nagastos|ginastos|gastos)|nagastos ko|ginastos ko|total (spent|gastos)|spent so far|spent on|gastos ko sa|gastos sa)/)) {
    return r(cat ? 'category_spend' : 'spent_total');
  }
  if (cat && has(m, /(how much|magkano)/)) return r('category_spend');
  if (has(m, /(natitira|natira|matitira|remaining|balance|how much (do i have|is left|left|money)|pera ko|money left|left in my)/)) return r('remaining');
  if (has(m, /(bakit|why)/) && has(m, /(laki|malaki|high|much|mabilis|fast|ubos|naubos|kulang|short)/)) return r('why_high');
  if (has(m, /(saan|where|categor|breakdown|napupunta|going|pinakamalaki|biggest|top spend|most)/)) return r('breakdown');
  const asking = has(m, /(should i|dapat ba|pwede ba|puwede ba|okay lang ba|ok lang ba|g ba|sasama ba|pupunta ba|can i)/);
  const outing = has(m, /\b(go|join|attend|sumama|sasama|sama|pumunta|pupunta|gala|lakad|event|party|concert|outing|hangout|swimming|beach|movie|sine|samgyup|inuman|night out|trip|date)\b/) || cat === 'gala';
  if (asking && outing && !amount) return r('event');
  if (cat) return r('category_tips');
  if (has(m, /(ipon|mag-?ipon|save|saving|savings|tipid|makatipid|magtipid|matira)/)) return r('save_tips');
  if (has(m, /(tip|bawas|bawasan|cut|reduce|paano|how can|how do|advice|payo|help|what should i do|ano(ng)? gagawin|ano dapat|suggest)/)) return r('cut_tips');
  if (has(m, /(budget|how am i|how's|hows|kumusta|kamusta|okay pa|ok pa|on track|doing|lagay|status|update)/)) return r('status');

  // Follow-ups like "eh kung 500 lang?" reuse what the previous question was about
  if (amount > 0) {
    const lastUser = [...history].reverse().find(h => h.role === 'user');
    if (lastUser) {
      const prev = classify(lastUser.text).intent;
      if (prev === 'afford' || prev === 'save_goal') return r(prev);
    }
    return r('afford');
  }
  return r(money ? 'status' : 'unknown');
}

export function ruleReply(state: AppState, message: string, history: { role: 'user' | 'assistant'; text: string }[] = [], forceLang?: Lang) {
  const lang = forceLang || (/\b(kumusta|kamusta|musta|salamat|magandang)\b/i.test(message) ? 'tl' : detectLang(message));
  const { intent, amount, cat } = classify(message, history);
  const c = compute(state);
  const t = (en: string, tl: string) => (lang === 'tl' ? tl : en);
  const top = c.byCat[0];
  const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`;
  const over = c.remaining < 0;
  const leftLine = over
    ? t(`You're ${pesoR(-c.remaining)} over budget.`, `Lampas ka na ng ${pesoR(-c.remaining)}.`)
    : t(`You have ${pesoR(c.remaining)} left for ${days(c.left)}, so about ${pesoR(c.perDay)} a day.`,
        `May ${pesoR(c.remaining)} ka pa for ${days(c.left)}, kaya mga ${pesoR(c.perDay)} a day.`);

  let reply: string;
  switch (intent) {
    case 'greet':
      reply = t(`Hi! Buddy here. Quick update: ${leftLine} What do you want to know?`,
                `Hi! Si Buddy 'to. Quick update: ${leftLine} Ano gusto mong malaman?`);
      break;
    case 'thanks':
      reply = pick([t("Anytime! I'm here whenever you need a budget check.", 'Walang anuman! Nandito lang ako pag kailangan mo ng budget check.'),
                    t("You got it! Keep logging and I'll keep an eye on things.", 'Sige lang! Tuloy mo lang mag-log, ako na bahala magbantay.')]);
      break;
    case 'off_topic':
      reply = t(`Haha, I'm just your budget buddy, so I can't really help with that. But if it's about your baon, I'm all in! Try "Can I afford a ₱150 milk tea?" or "How much can I spend today?"`,
                `Haha, budget buddy lang ako kaya hindi ko 'yan masasagot nang maayos. Pero kung tungkol sa baon mo, game ako! Try mo: "Kaya ko ba bumili ng ₱150 na milk tea?" o "Magkano pwede ko gastusin today?"`);
      break;
    case 'afford': {
      const after = c.remaining - amount;
      const perDayAfter = after > 0 && c.left > 0 ? after / c.left : 0;
      const share = c.remaining > 0 ? amount / c.remaining : 1;
      if (after < 0) {
        reply = t(`Not right now. ${pesoR(amount)} is more than what you have left (${pesoR(Math.max(0, c.remaining))}), so you'd be short by ${pesoR(-after)}. Better wait for your next allowance.`,
                  `Hindi pa kaya ngayon. Mas malaki ang ${pesoR(amount)} sa natitira mo (${pesoR(Math.max(0, c.remaining))}), kulang ka ng ${pesoR(-after)}. Hintayin muna natin ang next allowance.`);
      } else if (perDayAfter < c.perDay * 0.6 || share > 0.4) {
        reply = t(`You can, but it'll be tight. After ${pesoR(amount)}, you'll have ${pesoR(after)} left and your safe spend drops from ${pesoR(c.perDay)} to ${pesoR(perDayAfter)} a day. If it can wait, maybe hold off.`,
                  `Kaya, pero hihigpit tayo. Pag binili mo ang ${pesoR(amount)}, ${pesoR(after)} na lang ang matitira at bababa ang safe gastos mo from ${pesoR(c.perDay)} to ${pesoR(perDayAfter)} a day. Kung pwede pang ipagpaliban, mas okay.`);
      } else {
        reply = t(`Yes, you can! After ${pesoR(amount)}, you'll still have ${pesoR(after)} left, and your safe spend goes from ${pesoR(c.perDay)} to ${pesoR(perDayAfter)} a day. Go for it.`,
                  `Oo, kaya! Pag binili mo ang ${pesoR(amount)}, may ${pesoR(after)} ka pa, at ang safe gastos mo ay from ${pesoR(c.perDay)} to ${pesoR(perDayAfter)} a day. Go lang!`);
      }
      break;
    }
    case 'save_goal': {
      const spendable = c.remaining - amount;
      const perDay = c.left > 0 ? spendable / c.left : 0;
      if (over || spendable < 0) {
        reply = t(`Saving ${pesoR(amount)} won't fit this period, since you only have ${pesoR(Math.max(0, c.remaining))} left. Try a smaller target like ${pesoR(Math.max(0, Math.round(c.remaining * 0.2)))}, or aim for it next allowance.`,
                  `Hindi kakasya ang ${pesoR(amount)} na ipon this period, ${pesoR(Math.max(0, c.remaining))} na lang kasi natitira. Try muna ng mas maliit, mga ${pesoR(Math.max(0, Math.round(c.remaining * 0.2)))}, o sa next allowance na lang.`);
      } else {
        reply = t(`To save ${pesoR(amount)}, keep your spending to ${pesoR(perDay)} a day for the next ${days(c.left)} (you're averaging ${pesoR(c.avgPerDay)} now).${top ? ` Easiest place to cut: ${top.label}.` : ''}`,
                  `Para makaipon ng ${pesoR(amount)}, gastos ka lang ng ${pesoR(perDay)} a day sa susunod na ${days(c.left)} (${pesoR(c.avgPerDay)} a day ang average mo ngayon).${top ? ` Pinakamadaling bawasan: ${top.label}.` : ''}`);
      }
      break;
    }
    case 'days_left':
      reply = c.left > 0
        ? t(`${days(c.left)} left, until ${shortDate(state.end)}. ${over ? leftLine : `That's ${pesoR(c.perDay)} a day if you want your ${pesoR(c.remaining)} to last.`}`,
            `${days(c.left)} pa, hanggang ${shortDate(state.end)}. ${over ? leftLine : `${pesoR(c.perDay)} a day para umabot ang ${pesoR(c.remaining)} mo.`}`)
        : t(`Your period already ended on ${shortDate(state.end)}. Set a new one in settings when your next allowance comes in.`,
            `Tapos na ang period mo noong ${shortDate(state.end)}. Mag-set ka ng bago sa settings pag dumating na ang next allowance.`);
      break;
    case 'spend_today': {
      const td = today();
      const todaySpent = c.inPeriod.filter(e => e.date === td).reduce((s, e) => s + e.amount, 0);
      const forToday = c.left > 0 ? Math.max(0, c.remaining + todaySpent) / c.left : 0;
      const leftToday = forToday - todaySpent;
      if (over || c.left === 0) reply = t(`Honestly, nothing extra today. ${leftLine} Essentials only for now.`, `Sa totoo lang, wala munang extra today. ${leftLine} Essentials lang muna.`);
      else if (todaySpent === 0) reply = t(`You can spend about ${pesoR(forToday)} today and still be on track.`, `Pwede kang gumastos ng mga ${pesoR(forToday)} today at on track ka pa rin.`);
      else if (leftToday > 0) reply = t(`Your budget for today is about ${pesoR(forToday)}. You've spent ${pesoR(todaySpent)}, so ${pesoR(leftToday)} more is still okay.`,
                                        `Mga ${pesoR(forToday)} ang budget mo today. Nakagastos ka na ng ${pesoR(todaySpent)}, kaya may ${pesoR(leftToday)} ka pang pwedeng gastusin.`);
      else reply = t(`You've already spent ${pesoR(todaySpent)} today, which is past your ${pesoR(forToday)} for the day. Best to stop here and let tomorrow balance it out.`,
                     `${pesoR(todaySpent)} na ang nagastos mo today, lampas na sa ${pesoR(forToday)} na budget for the day. Stop muna tayo dito, bawi bukas.`);
      break;
    }
    case 'category_spend': {
      const row = c.byCat.find(x => x.id === cat);
      const label = catById(cat).label;
      if (!row) reply = t(`You haven't spent anything on ${label} this period. Nice!`, `Wala ka pang gastos sa ${label} this period. Nice!`);
      else {
        const n = c.inPeriod.filter(e => e.cat === cat).length;
        const share = Math.round((row.sum / Math.max(1, c.spent)) * 100);
        reply = t(`You've spent ${pesoR(row.sum)} on ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), which is ${share}% of your spending.${share >= 40 ? ` That's your big one. ${CAT_TIPS[cat].en}` : ''}`,
                  `${pesoR(row.sum)} na ang nagastos mo sa ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), ${share}% ng total gastos mo.${share >= 40 ? ` 'Yan ang pinakamalaki. ${CAT_TIPS[cat].tl}` : ''}`);
      }
      break;
    }
    case 'spent_total':
      reply = t(`You've spent ${pesoR(c.spent)} so far, ${Math.round(c.pct)}% of your ${pesoR(state.budget)} allowance. ${leftLine}`,
                `${pesoR(c.spent)} na ang nagastos mo, ${Math.round(c.pct)}% ng ${pesoR(state.budget)} na allowance mo. ${leftLine}`);
      break;
    case 'remaining':
      reply = leftLine + (over ? t(' Essentials only until your next allowance.', ' Essentials muna hanggang next allowance.') : '');
      break;
    case 'breakdown':
      reply = !c.byCat.length
        ? t('No spending this period yet, so there is nothing to break down.', 'Wala ka pang gastos this period, kaya wala pang breakdown.')
        : t('Here is where your money goes:\n', 'Dito napupunta ang pera mo:\n') +
          c.byCat.map(x => `• ${x.label}: ${pesoR(x.sum)} (${Math.round((x.sum / c.spent) * 100)}%)`).join('\n');
      break;
    case 'why_high': {
      if (!top) { reply = t("You haven't spent anything yet this period, so you're good!", 'Wala ka pang gastos this period, kaya okay ka pa!'); break; }
      const ideal = state.budget / c.total;
      const biggest = [...c.inPeriod].sort((a, b) => b.amount - a.amount)[0];
      const share = Math.round((top.sum / c.spent) * 100);
      if (c.avgPerDay <= ideal && !over) {
        reply = t(`Good news: you're actually doing fine. You average ${pesoR(c.avgPerDay)} a day, below the ideal ${pesoR(ideal)}. ${top.label} is your biggest at ${pesoR(top.sum)} (${share}%), so that's the one to watch.`,
                  `Good news: okay ka pa actually. ${pesoR(c.avgPerDay)} a day ang average mo, mas mababa sa ideal na ${pesoR(ideal)}. Pinakamalaki ang ${top.label} sa ${pesoR(top.sum)} (${share}%), kaya 'yan ang bantayan natin.`);
        break;
      }
      reply = t(`Mostly ${top.label}: ${pesoR(top.sum)}, or ${share}% of your spending. You're averaging ${pesoR(c.avgPerDay)} a day versus an ideal ${pesoR(ideal)}.${biggest ? ` Your biggest single expense was ${biggest.note || catById(biggest.cat).label} at ${pesoR(biggest.amount)}.` : ''} ${CAT_TIPS[top.id].en}`,
                `Kadalasan sa ${top.label}: ${pesoR(top.sum)}, ${share}% ng gastos mo. ${pesoR(c.avgPerDay)} a day ang average mo, pero ${pesoR(ideal)} ang ideal.${biggest ? ` Pinakamalaking isang gastos mo: ${biggest.note || catById(biggest.cat).label}, ${pesoR(biggest.amount)}.` : ''} ${CAT_TIPS[top.id].tl}`);
      break;
    }
    case 'event': {
      const cap = Math.round(Math.min(c.remaining * 0.25, c.perDay * 2));
      reply = over || cap <= 0
        ? t(`I'd skip this one for now. ${leftLine} Maybe suggest a free hangout instead?`, `Pass muna siguro tayo dito. ${leftLine} Baka pwede kayong mag-libreng tambay na lang?`)
        : t(`You can go, just set a limit. Try to keep it under ${pesoR(cap)}, about two days of your safe budget, so the rest of the period stays okay. ${leftLine}`,
            `Pwede ka sumama, basta may limit. Try mong i-cap sa ${pesoR(cap)}, mga dalawang araw ng safe budget mo, para okay pa rin ang natitirang araw. ${leftLine}`);
      break;
    }
    case 'save_tips': {
      const target = Math.max(0, Math.round(c.remaining * 0.2));
      const perDay = c.left > 0 ? (c.remaining - target) / c.left : 0;
      reply = over
        ? t(`First let's get back on track: ${leftLine} Once your next allowance comes, set aside 10-20% right away before spending.`,
            `Balik muna tayo sa track: ${leftLine} Pag dumating ang next allowance, itabi agad ang 10-20% bago gumastos.`)
        : t(`Try saving ${pesoR(target)}, that's 20% of what's left. To get there, keep spending to ${pesoR(perDay)} a day.${top ? ` Easiest to cut: ${top.label}. ${CAT_TIPS[top.id].en}` : ''}`,
            `Try mong mag-target ng ${pesoR(target)} na ipon, 20% ng natitira. Para makuha 'yan, gastos ka lang ng ${pesoR(perDay)} a day.${top ? ` Pinakamadaling bawasan: ${top.label}. ${CAT_TIPS[top.id].tl}` : ''}`);
      break;
    }
    case 'category_tips': {
      const row = c.byCat.find(x => x.id === cat);
      reply = t(`For ${catById(cat).label}${row ? ` (${pesoR(row.sum)} so far)` : ''}: ${CAT_TIPS[cat].en}`,
                `Para sa ${catById(cat).label}${row ? ` (${pesoR(row.sum)} na so far)` : ''}: ${CAT_TIPS[cat].tl}`);
      break;
    }
    case 'cut_tips':
      reply = !top
        ? t('No data yet. Log a few expenses first so I can give you tips that fit you.', 'Wala pang data. Mag-log ka muna ng ilang gastos para personalized ang tips ko.')
        : t(`Your biggest spending is ${top.label} at ${pesoR(top.sum)}. ${CAT_TIPS[top.id].en} Cutting it by 30% saves you ${pesoR(top.sum * 0.3)}.`,
            `Pinakamalaki mong gastos ay ${top.label}, ${pesoR(top.sum)}. ${CAT_TIPS[top.id].tl} Pag nabawasan mo ito ng 30%, makakatipid ka ng ${pesoR(top.sum * 0.3)}.`);
      break;
    case 'status':
      reply = t(`You've used ${Math.round(c.pct)}% of your allowance with ${Math.round(c.timePct)}% of the period done. ${leftLine}${top ? ` Keep an eye on ${top.label}.` : ''}`,
                `${c.st.title}${/[.!?]$/.test(c.st.title) ? '' : '.'} ${Math.round(c.pct)}% na ang nagamit mo, ${Math.round(c.timePct)}% ng period ang lumipas. ${leftLine}${top ? ` Bantayan natin ang ${top.label}.` : ''}`);
      break;
    default:
      reply = t(`Hmm, I'm not sure I got that. I can help with things like "Can I afford ₱300 shoes?", "How much can I spend today?", or "Where does my money go?" Quick update: ${leftLine}`,
                `Hmm, parang hindi ko na-gets. Kaya kong sagutin ang mga tulad ng "Kaya ko ba ang ₱300 na sapatos?", "Magkano pwede ko gastusin today?", o "Saan napupunta pera ko?" Quick update: ${leftLine}`);
  }
  return { reply, intent, lang };
}

// Plain-text snapshot of the budget, used to ground the AI model
export function budgetSummary(state: AppState) {
  const c = compute(state);
  const cats = c.byCat.map(x => `${x.label} ${pesoR(x.sum)} (${Math.round((x.sum / Math.max(1, c.spent)) * 100)}%)`).join(', ');
  return [
    `Allowance: ${pesoR(state.budget)} from ${shortDate(state.start)} to ${shortDate(state.end)} (${c.total} days).`,
    `Day ${c.elapsed} of ${c.total}, ${c.left} days left.`,
    `Spent: ${pesoR(c.spent)} (${Math.round(c.pct)}%). Remaining: ${c.remaining < 0 ? '-' : ''}${pesoR(c.remaining)}.`,
    `Average spend per day: ${pesoR(c.avgPerDay)}. Safe spend per day from now: ${pesoR(c.perDay)}.`,
    `By category: ${cats || 'none yet'}.`,
    `Categories that exist: ${CATS.map(x => x.label).join(', ')}.`,
  ].join('\n');
}
