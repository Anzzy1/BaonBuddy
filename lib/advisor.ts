// Buddy's offline brain: figures out what the student is asking and answers with exact numbers.
// Pure functions only, so the API route and the browser (when the server is unreachable) share it.
import { AppState, CATS, catName, compute, langOf, pesoR, shortDate, today } from '@/lib/budget';
import { Lang, detectCategory, extractAmount } from '@/lib/parseExpense';
import { Language, Lines, daysText, perDayText, translator } from '@/lib/i18n';

export type Intent =
  | 'greet' | 'thanks' | 'off_topic' | 'afford' | 'save_goal' | 'days_left' | 'spend_today'
  | 'category_spend' | 'spent_total' | 'remaining' | 'breakdown' | 'why_high' | 'event'
  | 'save_tips' | 'category_tips' | 'cut_tips' | 'status' | 'unknown';

// Intents whose answer is pure math: the rule reply is always used, no AI rewrite
export const EXACT_INTENTS = new Set<Intent>([
  'greet', 'thanks', 'off_topic', 'afford', 'save_goal', 'days_left', 'spend_today',
  'category_spend', 'spent_total', 'remaining', 'breakdown', 'why_high', 'status', 'event',
]);

export const CAT_TIPS: Record<string, Lines> = {
  food: {
    en: 'Pack lunch 2-3 times a week and share meals with friends to split the cost.',
    tl: 'Magbaon ng tanghalian 2-3 beses kada linggo, at makihati sa pagkain ng mga kaibigan para hati rin kayo sa gastos.',
    taglish: 'Magbaon ng lunch 2-3 times a week, at mag-share ng food with friends para hati kayo sa gastos.',
  },
  snacks: {
    en: 'Skip the daily milk tea or coffee run. Bringing water and snacks from home adds up fast.',
    tl: 'Iwasan muna ang araw-araw na milk tea o kape. Malaki ang matitipid mo kung magdadala ka ng tubig at meryenda mula sa bahay.',
    taglish: 'Skip muna ang daily milk tea or coffee. Magdala ng tubig at snacks from home, malaki ang matitipid mo.',
  },
  transpo: {
    en: 'Ride home with classmates, walk short distances, and take public transport instead of ride-hailing when you can.',
    tl: 'Sumabay sa mga kaklase pauwi, maglakad kung malapit lang, at mag-jeep o bus sa halip na mag-Grab kung kaya.',
    taglish: 'Sumabay sa classmates pauwi, maglakad kung malapit lang, at mag-jeep or bus instead of Grab kung kaya.',
  },
  school: {
    en: 'Photocopy borrowed books, print only what you really need, and buy supplies in bulk.',
    tl: 'Magpa-photocopy ng hiniram na libro, i-print lang ang talagang kailangan, at bumili ng gamit nang maramihan.',
    taglish: 'Mag-photocopy ng hiniram na books, i-print lang ang talagang kailangan, at bumili ng supplies in bulk.',
  },
  load: {
    en: 'Use school or public WiFi, and pick longer promos instead of daily load.',
    tl: 'Gumamit ng WiFi sa eskwela o sa pampublikong lugar, at pumili ng mas mahabang promo kaysa sa pang-araw-araw na load.',
    taglish: 'Gamitin ang school or public WiFi, at pumili ng mas mahabang promo instead of daily load.',
  },
  gala: {
    en: 'Set a weekly hangout budget and look for free plans like parks or movie nights at home.',
    tl: 'Magtakda ng lingguhang badyet para sa gala, at maghanap ng libreng lakad gaya ng parke o panonood ng pelikula sa bahay.',
    taglish: 'Mag-set ng weekly budget for gala, at maghanap ng free plans like park or movie night sa bahay.',
  },
  shopping: {
    en: 'Wait 24 hours before buying anything non-essential, and compare prices online first.',
    tl: 'Maghintay ng 24 oras bago bumili ng hindi naman kailangan, at ikumpara muna ang presyo online.',
    taglish: 'Wait ka muna ng 24 hours bago bumili ng non-essentials, at i-compare muna ang prices online.',
  },
  personal: {
    en: 'Buy toiletries in larger sizes or refill packs. They cost less per use.',
    tl: 'Bumili ng toiletries na malaki ang sukat o refill pack. Mas mura ito kada gamit.',
    taglish: 'Bumili ng toiletries na malaking size or refill packs. Mas mura siya per use.',
  },
  health: {
    en: 'Generic medicines work the same and cost less. Ask the pharmacist.',
    tl: 'Pareho lang ang bisa ng generic na gamot pero mas mura. Magtanong sa pharmacist.',
    taglish: 'Same lang ang effect ng generic na gamot pero mas mura. Ask the pharmacist.',
  },
  bills: {
    en: 'Split shared bills fairly and switch off appliances when not in use.',
    tl: 'Hatiin nang patas ang mga pinagsasaluhang bayarin, at patayin ang mga appliance kapag hindi ginagamit.',
    taglish: 'Hatiin nang fair ang shared bills, at i-off ang appliances kapag hindi ginagamit.',
  },
  subs: {
    en: 'List your subscriptions and cancel the ones you haven’t used this month.',
    tl: 'Ilista ang mga subscription mo at ihinto ang mga hindi mo nagamit ngayong buwan.',
    taglish: 'I-list ang subscriptions mo at i-cancel ang hindi mo nagamit this month.',
  },
  gifts: {
    en: 'Set a gift budget ahead of time. Thoughtful beats expensive.',
    tl: 'Magtakda ng badyet para sa regalo bago pa bumili. Mas mahalaga ang may malasakit kaysa sa mahal.',
    taglish: 'Mag-set ng gift budget ahead of time. Mas okay ang thoughtful kaysa expensive.',
  },
  games: {
    en: 'Set a monthly top-up limit and wait for in-game sales.',
    tl: 'Magtakda ng buwanang limit sa top-up at hintayin ang mga sale sa laro.',
    taglish: 'Mag-set ng monthly top-up limit at hintayin ang in-game sales.',
  },
  other: {
    en: 'Review your "Others" entries. Small leaks add up fast.',
    tl: 'Silipin ang mga gastos mo sa "Iba pa". Mabilis lumaki ang maliliit na gastos.',
    taglish: 'I-check ang "Others" entries mo. Mabilis mag-add up ang maliliit na gastos.',
  },
};
export const tipFor = (id: string, lang: Language = 'en') => (CAT_TIPS[id] || CAT_TIPS.other)[lang];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const has = (m: string, re: RegExp) => re.test(m);

const MONEY = /\b(budget|badyet|baon|allowance|pera|money|peso|pesos|piso|gastos|gastusin|gumastos|nagastos|ginastos|spend|spent|spending|expense|expenses|ipon|save|saving|savings|tipid|afford|bili|bilhin|bumili|buy|bayad|cost|presyo|price|halaga|natitira|remaining|balance|left)\b|₱/;
const OFF_TOPIC = /\b(homework|assignment|takdang aralin|math|algebra|calculus|capital of|president|pangulo|weather|panahon ngayon|recipe|lyrics|essay|thesis|code|coding|program|python|javascript|translate|isalin|joke|biro|movie recommendation|song|kanta|who is|sino si|history of|science|physics|chemistry|biology|crush|jowa|love life)\b/;

function amountIn(message: string) {
  // Ignore numbers that describe time or percent, e.g. "3 days left" or "20%"
  const cleaned = message.replace(/\b\d+\s*(days?|araw|weeks?|linggo|months?|buwan|hours?|oras|mins?|minutes?|minuto|%|percent|porsyento)\b/gi, ' ');
  return extractAmount(cleaned);
}

export function classify(message: string, history: { role: 'user' | 'assistant'; text: string }[] = []): { intent: Intent; amount: number; cat: string } {
  const m = message.toLowerCase().trim();
  const words = m.split(/\s+/).filter(Boolean);
  const amount = amountIn(m);
  const catRaw = detectCategory(m);
  const cat = catRaw !== 'other' || /\b(others?|misc|iba pa)\b/.test(m) ? catRaw : '';
  const money = has(m, MONEY) || amount > 0 || !!cat;

  const r = (intent: Intent) => ({ intent, amount, cat });

  if (words.length <= 5 && !amount && has(m, /\b(salamat|thank|thanks|thank you|ty|tnx|thx|tysm|arigato)\b/)) return r('thanks');
  if (words.length <= 4 && !money && has(m, /^(hi+|hello|hey|yo|uy|kumusta|kamusta|musta|good (morning|afternoon|evening)|magandang (umaga|tanghali|hapon|gabi)|sup|hoy)\b/)) return r('greet');
  if (has(m, OFF_TOPIC) && !money) return r('off_topic');

  if (amount > 0 && has(m, /\b(ipon|mag-?ipon|makaipon|save|saving|savings|itabi|maitabi|matira|target|goal)\b/)) return r('save_goal');
  if (amount > 0 && has(m, /\b(bili|bilhin|bumili|mabili|makabili|buy|afford|kaya|kakayanin|keri|pwede|puwede|purchase|get|worth|order|mag-?order|bayaran|gastusin|treat|sulit)\b/)) return r('afford');

  if (has(m, /(ilang araw|ilan(g)? (araw|days?) pa|how many days|kailan (matatapos|ang end|ang katapusan)|bago matapos|when does (my|the) (period|budget) end|matatapos ba|hanggang kailan)/)) return r('days_left');
  if (has(m, /(today|ngayon|ngayong araw|per day|a day|daily|araw-araw|kada araw|bawat araw)/) && has(m, /(spend|gastos|gastusin|gumastos|budget|badyet|pwede|puwede|can i|how much|magkano|safe|ligtas)/)) return r('spend_today');

  if (has(m, /(how much (did|have) i|magkano (na )?(ang |yung |ung )?(nagastos|ginastos|gastos)|nagastos ko|ginastos ko|total (spent|gastos)|spent so far|spent on|gastos ko sa|gastos sa|nagastos sa)/)) {
    return r(cat ? 'category_spend' : 'spent_total');
  }
  if (cat && has(m, /(how much|magkano)/)) return r('category_spend');
  // "Saan napupunta ang pera ko?" mentions "pera ko" but asks for the breakdown
  if (has(m, /(napupunta|pumupunta|where (does|did|do) (my|the) money|breakdown)/)) return r('breakdown');
  if (has(m, /(natitira|natira|matitira|remaining|balance|how much (do i have|is left|left|money)|pera ko|money left|left in my|magkano pa|may pera pa)/)) return r('remaining');
  if (has(m, /(bakit|why)/) && has(m, /(laki|malaki|high|much|mabilis|fast|ubos|naubos|kulang|short)/)) return r('why_high');
  if (has(m, /(saan|where|categor|breakdown|napupunta|going|pinakamalaki|biggest|top spend|most)/)) return r('breakdown');
  const asking = has(m, /(should i|dapat ba|pwede ba|puwede ba|okay lang ba|ok lang ba|g ba|sasama ba|pupunta ba|sumama ba|can i)/);
  const outing = has(m, /\b(go|join|attend|sumama|sasama|sama|pumunta|pupunta|gala|lakad|event|party|concert|outing|hangout|swimming|beach|movie|sine|samgyup|inuman|night out|trip|date)\b/) || cat === 'gala';
  if (asking && outing && !amount) return r('event');
  if (cat) return r('category_tips');
  if (has(m, /(ipon|mag-?ipon|makaipon|save|saving|savings|tipid|makatipid|magtipid|matira)/)) return r('save_tips');
  if (has(m, /(tip|bawas|bawasan|cut|reduce|paano|how can|how do|advice|payo|help|tulong|what should i do|ano(ng)? gagawin|ano dapat|suggest)/)) return r('cut_tips');
  if (has(m, /(budget|badyet|how am i|how's|hows|kumusta|kamusta|okay pa|ok pa|on track|doing|lagay|status|update)/)) return r('status');

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

export function ruleReply(state: AppState, message: string, history: { role: 'user' | 'assistant'; text: string }[] = []) {
  const language = langOf(state);
  const lang: Lang = language === 'en' ? 'en' : 'tl';
  const t = translator(language);
  const { intent, amount, cat } = classify(message, history);
  const c = compute(state);
  const top = c.byCat[0];
  const topName = top ? catName(top.id, language) : '';
  const days = (n: number) => daysText(n, language);
  const aDay = (v: number) => perDayText(pesoR(v), language);
  const tip = (id: string) => tipFor(id, language);
  const over = c.remaining < 0;
  const leftLine = over
    ? t(`You're ${pesoR(-c.remaining)} over budget.`,
        `Lampas ka na ng ${pesoR(-c.remaining)} sa badyet.`,
        `Over budget ka na ng ${pesoR(-c.remaining)}.`)
    : t(`You have ${pesoR(c.remaining)} left for ${days(c.left)}, so about ${aDay(c.perDay)}.`,
        `May natitira ka pang ${pesoR(c.remaining)} para sa ${days(c.left)}, kaya mga ${aDay(c.perDay)}.`,
        `May ${pesoR(c.remaining)} ka pa for ${days(c.left)}, so mga ${aDay(c.perDay)}.`);

  let reply: string;
  switch (intent) {
    case 'greet':
      reply = t(`Hi! Buddy here. Quick update: ${leftLine} What do you want to know?`,
                `Kumusta! Si Buddy ito. Mabilis na balita: ${leftLine} Ano ang gusto mong malaman?`,
                `Hi! Si Buddy 'to. Quick update: ${leftLine} Ano gusto mong malaman?`);
      break;
    case 'thanks':
      reply = pick([
        t("Anytime! I'm here whenever you need a budget check.",
          'Walang anuman! Nandito lang ako kapag kailangan mong silipin ang badyet mo.',
          'Walang anuman! Nandito lang ako pag kailangan mo ng budget check.'),
        t("You got it! Keep logging and I'll keep an eye on things.",
          'Sige! Ituloy mo lang ang paglista, ako na ang magbabantay.',
          'Sige lang! Tuloy mo lang mag-log, ako na bahala magbantay.'),
      ]);
      break;
    case 'off_topic':
      reply = t(`I'm your budget assistant, so I can't help with that one. But if it's about your allowance, I'm all in! Try "Can I afford a ₱150 milk tea?" or "How much can I spend today?"`,
                `Pang-badyet lang ako, kaya hindi ko masasagot iyan. Pero kung tungkol sa baon mo, handa akong tumulong! Subukan mo: "Kaya ko bang bumili ng ₱150 na milk tea?" o "Magkano ang puwede kong gastusin ngayon?"`,
                `Budget buddy lang ako, kaya hindi ko 'yan masasagot. Pero kung about sa baon mo, game ako! Try mo: "Kaya ko ba ang ₱150 na milk tea?" or "Magkano pwede ko gastusin today?"`);
      break;
    case 'afford': {
      const after = c.remaining - amount;
      const perDayAfter = after > 0 && c.left > 0 ? after / c.left : 0;
      const share = c.remaining > 0 ? amount / c.remaining : 1;
      const a = pesoR(amount);
      if (after < 0) {
        const have = pesoR(Math.max(0, c.remaining));
        reply = t(`Not right now. ${a} is more than what you have left (${have}), so you'd be short by ${pesoR(-after)}. Better wait for your next allowance.`,
                  `Hindi pa kaya ngayon. Mas malaki ang ${a} sa natitira mo (${have}), kaya kukulangin ka ng ${pesoR(-after)}. Hintayin muna ang susunod mong baon.`,
                  `Hindi pa kaya ngayon. Mas malaki ang ${a} sa natitira mo (${have}), so kulang ka ng ${pesoR(-after)}. Wait muna sa next allowance.`);
      } else if (perDayAfter < c.perDay * 0.6 || share > 0.4) {
        reply = t(`You can, but it'll be tight. After ${a}, you'll have ${pesoR(after)} left and your safe spend drops from ${pesoR(c.perDay)} to ${aDay(perDayAfter)}. If it can wait, maybe hold off.`,
                  `Kaya, pero sisikip ang badyet mo. Pagkatapos ng ${a}, ${pesoR(after)} na lang ang matitira at bababa ang ligtas mong gastos mula ${pesoR(c.perDay)} hanggang ${aDay(perDayAfter)}. Kung puwede pang maghintay, ipagpaliban muna.`,
                  `Kaya, pero magiging tight. After ng ${a}, ${pesoR(after)} na lang ang matitira at bababa ang safe spend mo from ${pesoR(c.perDay)} to ${aDay(perDayAfter)}. Kung kaya pang i-wait, hold off muna.`);
      } else {
        reply = t(`Yes, you can! After ${a}, you'll still have ${pesoR(after)} left, and your safe spend goes from ${pesoR(c.perDay)} to ${aDay(perDayAfter)}. Go for it.`,
                  `Oo, kaya mo! Pagkatapos ng ${a}, may ${pesoR(after)} ka pa, at ang ligtas mong gastos ay magiging ${aDay(perDayAfter)} mula ${pesoR(c.perDay)}. Sige lang.`,
                  `Yes, kaya mo! After ng ${a}, may ${pesoR(after)} ka pa, at ang safe spend mo ay from ${pesoR(c.perDay)} to ${aDay(perDayAfter)}. Go lang!`);
      }
      break;
    }
    case 'save_goal': {
      const spendable = c.remaining - amount;
      const perDay = c.left > 0 ? spendable / c.left : 0;
      const a = pesoR(amount);
      if (over || spendable < 0) {
        const have = pesoR(Math.max(0, c.remaining));
        const smaller = pesoR(Math.max(0, Math.round(c.remaining * 0.2)));
        reply = t(`Saving ${a} won't fit this period, since you only have ${have} left. Try a smaller target like ${smaller}, or aim for it next allowance.`,
                  `Hindi aabot ang pag-ipon ng ${a} ngayong period, dahil ${have} na lang ang natitira sa iyo. Subukan ang mas maliit na target gaya ng ${smaller}, o gawin ito sa susunod na baon.`,
                  `Hindi kakayanin ang ${a} na ipon this period, kasi ${have} na lang ang natitira mo. Try mo ang mas maliit na target like ${smaller}, or sa next allowance na lang.`);
      } else {
        reply = t(`To save ${a}, keep your spending to ${aDay(perDay)} for the next ${days(c.left)} (you're averaging ${pesoR(c.avgPerDay)} now).${top ? ` Easiest place to cut: ${topName}.` : ''}`,
                  `Para makaipon ng ${a}, gumastos lang ng ${aDay(perDay)} sa susunod na ${days(c.left)} (${pesoR(c.avgPerDay)} ang karaniwan mong gastos ngayon).${top ? ` Pinakamadaling bawasan: ${topName}.` : ''}`,
                  `Para makaipon ng ${a}, keep your gastos at ${aDay(perDay)} for the next ${days(c.left)} (${pesoR(c.avgPerDay)} ang average mo ngayon).${top ? ` Pinakamadaling bawasan: ${topName}.` : ''}`);
      }
      break;
    }
    case 'days_left': {
      const end = shortDate(state.end, language);
      reply = c.left > 0
        ? t(`${days(c.left)} left, until ${end}. ${over ? leftLine : `That's ${aDay(c.perDay)} if you want your ${pesoR(c.remaining)} to last.`}`,
            `${days(c.left)} pa, hanggang ${end}. ${over ? leftLine : `Iyan ay ${aDay(c.perDay)} kung gusto mong umabot ang ${pesoR(c.remaining)} mo.`}`,
            `${days(c.left)} pa, until ${end}. ${over ? leftLine : `So ${aDay(c.perDay)} kung gusto mong umabot ang ${pesoR(c.remaining)} mo.`}`)
        : t(`Your period already ended on ${end}. Set a new one in settings when your next allowance comes in.`,
            `Natapos na ang period mo noong ${end}. Magtakda ng bago sa Settings kapag dumating na ang susunod mong baon.`,
            `Tapos na ang period mo noong ${end}. Mag-set ng bago sa Settings pag dumating na ang next allowance mo.`);
      break;
    }
    case 'spend_today': {
      const td = today();
      const todaySpent = c.inPeriod.filter(e => e.date === td).reduce((s, e) => s + e.amount, 0);
      const forToday = c.left > 0 ? Math.max(0, c.remaining + todaySpent) / c.left : 0;
      const leftToday = forToday - todaySpent;
      const f = pesoR(forToday);
      const s = pesoR(todaySpent);
      if (over || c.left === 0) reply = t(`Honestly, nothing extra today. ${leftLine} Essentials only for now.`,
                                          `Sa totoo lang, wala nang dagdag na gastos ngayon. ${leftLine} Mga kailangan lang muna.`,
                                          `Honestly, wala nang extra today. ${leftLine} Essentials lang muna.`);
      else if (todaySpent === 0) reply = t(`You can spend about ${f} today and still be on track.`,
                                           `Puwede kang gumastos ng mga ${f} ngayong araw at nasa tamang takbo ka pa rin.`,
                                           `Pwede kang gumastos ng mga ${f} today at on track ka pa rin.`);
      else if (leftToday > 0) reply = t(`Your budget for today is about ${f}. You've spent ${s}, so ${pesoR(leftToday)} more is still okay.`,
                                        `Mga ${f} ang badyet mo ngayong araw. Nakagastos ka na ng ${s}, kaya puwede pa ang ${pesoR(leftToday)}.`,
                                        `Mga ${f} ang budget mo today. Naka-${s} ka na, so okay pa ang ${pesoR(leftToday)}.`);
      else reply = t(`You've already spent ${s} today, which is past your ${f} for the day. Best to stop here and let tomorrow balance it out.`,
                     `Nakagastos ka na ng ${s} ngayon, lampas na sa ${f} mo para sa araw na ito. Tumigil na muna at bumawi bukas.`,
                     `Naka-${s} ka na today, lampas na sa ${f} mo for the day. Stop muna dito at bawi na lang bukas.`);
      break;
    }
    case 'category_spend': {
      const row = c.byCat.find(x => x.id === cat);
      const label = catName(cat, language);
      if (!row) reply = t(`You haven't spent anything on ${label} this period. Nice!`,
                          `Wala ka pang nagastos sa ${label} ngayong period. Ayos!`,
                          `Wala ka pang gastos sa ${label} this period. Nice!`);
      else {
        const n = c.inPeriod.filter(e => e.cat === cat).length;
        const share = Math.round((row.sum / Math.max(1, c.spent)) * 100);
        const big = share >= 40;
        reply = t(`You've spent ${pesoR(row.sum)} on ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), which is ${share}% of your spending.${big ? ` That's your big one. ${tip(cat)}` : ''}`,
                  `Nakagastos ka na ng ${pesoR(row.sum)} sa ${label} ngayong period (${n} na tala), ${share}% ng lahat ng gastos mo.${big ? ` Ito ang pinakamalaki mong gastos. ${tip(cat)}` : ''}`,
                  `Naka-${pesoR(row.sum)} ka na sa ${label} this period (${n} ${n === 1 ? 'entry' : 'entries'}), ${share}% ng gastos mo.${big ? ` Ito ang pinakamalaki. ${tip(cat)}` : ''}`);
      }
      break;
    }
    case 'spent_total':
      reply = t(`You've spent ${pesoR(c.spent)} so far, ${Math.round(c.pct)}% of your ${pesoR(c.spendable)} spending budget. ${leftLine}`,
                `Nakagastos ka na ng ${pesoR(c.spent)}, ${Math.round(c.pct)}% ng ${pesoR(c.spendable)} na puwede mong gastusin. ${leftLine}`,
                `Naka-${pesoR(c.spent)} ka na so far, ${Math.round(c.pct)}% ng ${pesoR(c.spendable)} na spending budget mo. ${leftLine}`);
      break;
    case 'remaining':
      reply = leftLine + (over ? t(' Essentials only until your next allowance.',
                                   ' Mga kailangan lang muna hanggang sa susunod mong baon.',
                                   ' Essentials lang muna hanggang next allowance.') : '')
        + (c.reserved > 0 ? t(` That's after the ${pesoR(c.reserved)} already set aside for upcoming expenses.`,
                              ` Hindi pa kasama riyan ang ${pesoR(c.reserved)} na nakatabi para sa mga parating na gastos.`,
                              ` Hindi pa kasama diyan ang ${pesoR(c.reserved)} na nakatabi for upcoming expenses.`) : '');
      break;
    case 'breakdown':
      reply = !c.byCat.length
        ? t('No spending this period yet, so there is nothing to break down.',
            'Wala ka pang gastos ngayong period, kaya wala pang mahahati.',
            'Wala ka pang gastos this period, kaya wala pang breakdown.')
        : t('Here is where your money goes:\n', 'Dito napupunta ang pera mo:\n', 'Dito napupunta ang pera mo:\n') +
          c.byCat.map(x => `• ${catName(x.id, language)}: ${pesoR(x.sum)} (${Math.round((x.sum / c.spent) * 100)}%)`).join('\n');
      break;
    case 'why_high': {
      if (!top) {
        reply = t("You haven't spent anything yet this period, so you're good!",
                  'Wala ka pang nagagastos ngayong period, kaya ayos ka!',
                  'Wala ka pang gastos this period, kaya okay ka!');
        break;
      }
      const ideal = pesoR(c.spendable / c.total);
      const biggest = [...c.inPeriod].sort((a, b) => b.amount - a.amount)[0];
      const share = Math.round((top.sum / c.spent) * 100);
      const avg = pesoR(c.avgPerDay);
      if (c.avgPerDay <= c.spendable / c.total && !over) {
        reply = t(`Good news: you're actually doing fine. You average ${avg} a day, below the ideal ${ideal}. ${topName} is your biggest at ${pesoR(top.sum)} (${share}%), so that's the one to watch.`,
                  `Magandang balita: maayos naman ang lagay mo. ${avg} ang karaniwan mong gastos kada araw, mas mababa sa tamang ${ideal}. ${topName} ang pinakamalaki mong gastos, ${pesoR(top.sum)} (${share}%), kaya iyon ang bantayan mo.`,
                  `Good news: okay ka naman talaga. ${avg} ang average mo a day, below sa ideal na ${ideal}. ${topName} ang pinakamalaki, ${pesoR(top.sum)} (${share}%), kaya 'yan ang bantayan mo.`);
        break;
      }
      const bigName = biggest ? biggest.note || catName(biggest.cat, language) : '';
      reply = t(`Mostly ${topName}: ${pesoR(top.sum)}, or ${share}% of your spending. You're averaging ${avg} a day versus an ideal ${ideal}.${biggest ? ` Your biggest single expense was ${bigName} at ${pesoR(biggest.amount)}.` : ''} ${tip(top.id)}`,
                `Kadalasan sa ${topName}: ${pesoR(top.sum)}, o ${share}% ng gastos mo. ${avg} ang karaniwan mong gastos kada araw, samantalang ${ideal} dapat.${biggest ? ` Ang pinakamalaki mong isang gastos ay ${bigName}, ${pesoR(biggest.amount)}.` : ''} ${tip(top.id)}`,
                `Halos sa ${topName}: ${pesoR(top.sum)}, or ${share}% ng gastos mo. ${avg} ang average mo a day, pero ${ideal} dapat.${biggest ? ` Ang pinakamalaking single expense mo ay ${bigName}, ${pesoR(biggest.amount)}.` : ''} ${tip(top.id)}`);
      break;
    }
    case 'event': {
      const cap = pesoR(Math.round(Math.min(c.remaining * 0.25, c.perDay * 2)));
      reply = over || Math.round(Math.min(c.remaining * 0.25, c.perDay * 2)) <= 0
        ? t(`I'd skip this one for now. ${leftLine} Maybe suggest a free hangout instead?`,
            `Laktawan mo muna ito. ${leftLine} Baka puwede kayong magkita sa libreng lakad na lang?`,
            `Skip mo muna 'to. ${leftLine} Baka pwede kayong mag-free hangout na lang?`)
        : t(`You can go, just set a limit. Try to keep it under ${cap}, about two days of your safe budget, so the rest of the period stays okay. ${leftLine}`,
            `Puwede kang sumama, basta may limit. Huwag lumampas sa ${cap}, mga dalawang araw ng ligtas mong badyet, para maayos pa rin ang natitirang period. ${leftLine}`,
            `Pwede kang sumama, basta mag-set ng limit. Keep it under ${cap}, mga two days ng safe budget mo, para okay pa rin ang rest ng period. ${leftLine}`);
      break;
    }
    case 'save_tips': {
      const target = Math.max(0, Math.round(c.remaining * 0.2));
      const perDay = c.left > 0 ? (c.remaining - target) / c.left : 0;
      reply = over
        ? t(`First let's get back on track: ${leftLine} Once your next allowance comes, set aside 10-20% right away before spending.`,
            `Bumawi muna tayo: ${leftLine} Pagdating ng susunod mong baon, itabi agad ang 10-20% bago gumastos.`,
            `Bawi muna tayo: ${leftLine} Pagdating ng next allowance mo, itabi agad ang 10-20% bago gumastos.`)
        : t(`Try saving ${pesoR(target)}, that's 20% of what's left. To get there, keep spending to ${aDay(perDay)}.${top ? ` Easiest to cut: ${topName}. ${tip(top.id)}` : ''}`,
            `Subukang mag-ipon ng ${pesoR(target)}, 20% iyan ng natitira mo. Para magawa ito, gumastos lang ng ${aDay(perDay)}.${top ? ` Pinakamadaling bawasan: ${topName}. ${tip(top.id)}` : ''}`,
            `Try mong mag-ipon ng ${pesoR(target)}, 20% 'yan ng natitira mo. Para ma-reach, keep your gastos at ${aDay(perDay)}.${top ? ` Pinakamadaling bawasan: ${topName}. ${tip(top.id)}` : ''}`);
      break;
    }
    case 'category_tips': {
      const row = c.byCat.find(x => x.id === cat);
      const so = row ? t(` (${pesoR(row.sum)} so far)`, ` (${pesoR(row.sum)} na ngayon)`, ` (${pesoR(row.sum)} so far)`) : '';
      reply = t(`For ${catName(cat, language)}${so}: ${tip(cat)}`,
                `Para sa ${catName(cat, language)}${so}: ${tip(cat)}`,
                `For ${catName(cat, language)}${so}: ${tip(cat)}`);
      break;
    }
    case 'cut_tips':
      reply = !top
        ? t('No data yet. Log a few expenses first so I can give you tips that fit you.',
            'Wala pang datos. Maglista muna ng ilang gastos para makapagbigay ako ng payong angkop sa iyo.',
            'Wala pang data. Mag-log ka muna ng ilang gastos para makapagbigay ako ng tips na swak sa\'yo.')
        : t(`Your biggest spending is ${topName} at ${pesoR(top.sum)}. ${tip(top.id)} Cutting it by 30% saves you ${pesoR(top.sum * 0.3)}.`,
            `Pinakamalaki ang gastos mo sa ${topName}, ${pesoR(top.sum)}. ${tip(top.id)} Kung babawasan mo ito ng 30%, makakatipid ka ng ${pesoR(top.sum * 0.3)}.`,
            `Pinakamalaki ang gastos mo sa ${topName}, ${pesoR(top.sum)}. ${tip(top.id)} Pag binawasan mo ng 30%, maka-save ka ng ${pesoR(top.sum * 0.3)}.`);
      break;
    case 'status':
      reply = t(`You've used ${Math.round(c.pct)}% of your allowance with ${Math.round(c.timePct)}% of the period done. ${leftLine}${top ? ` Keep an eye on ${topName}.` : ''}`,
                `Nagamit mo na ang ${Math.round(c.pct)}% ng baon mo, at ${Math.round(c.timePct)}% na ng period ang lumipas. ${leftLine}${top ? ` Bantayan ang ${topName}.` : ''}`,
                `Nagamit mo na ang ${Math.round(c.pct)}% ng allowance mo, at ${Math.round(c.timePct)}% na ng period ang tapos. ${leftLine}${top ? ` Bantayan mo ang ${topName}.` : ''}`);
      break;
    default:
      reply = t(`Hmm, I'm not sure I got that. I can help with things like "Can I afford ₱300 shoes?", "How much can I spend today?", or "Where does my money go?" Quick update: ${leftLine}`,
                `Hmm, hindi ko yata nakuha iyon. Matutulungan kita sa mga tanong gaya ng "Kaya ko bang bumili ng ₱300 na sapatos?", "Magkano ang puwede kong gastusin ngayon?", o "Saan napupunta ang pera ko?" Mabilis na balita: ${leftLine}`,
                `Hmm, parang hindi ko na-gets. Pwede mo akong tanungin ng "Kaya ko ba ang ₱300 na shoes?", "Magkano pwede ko gastusin today?", or "Saan napupunta ang pera ko?" Quick update: ${leftLine}`);
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
    `Set aside for upcoming expenses (already excluded from remaining): ${(state.upcoming || []).map(u => `${u.name} ${pesoR(u.amount)} due ${shortDate(u.due)}`).join(', ') || 'none'}.`,
    `Average spend per day: ${pesoR(c.avgPerDay)}. Safe spend per day from now: ${pesoR(c.perDay)}.`,
    `By category: ${cats || 'none yet'}.`,
    `Categories that exist: ${CATS.map(x => x.label).join(', ')}.`,
  ].join('\n');
}
