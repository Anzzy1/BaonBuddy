// Buddy's voice in the language the student picked in Settings.
// Tagalog stays in Tagalog (only money/app words like "load" keep their English form);
// Taglish mixes the way students actually text: Tagalog grammar, English nouns and numbers.

export type Language = 'en' | 'tl' | 'taglish';

export const LANGUAGES: { id: Language; label: string; sample: string }[] = [
  { id: 'en', label: 'English', sample: 'You have ₱500 left for 5 days.' },
  { id: 'tl', label: 'Tagalog', sample: 'May natitira ka pang ₱500 para sa 5 araw.' },
  { id: 'taglish', label: 'Taglish', sample: 'May ₱500 ka pa for 5 days.' },
];

export type Lines = Record<Language, string>;

// t('en', 'tl', 'taglish') picks the line for the current language
export const translator = (lang: Language) => (en: string, tl: string, taglish: string) =>
  lang === 'tl' ? tl : lang === 'taglish' ? taglish : en;

export const daysText = (n: number, lang: Language) =>
  lang === 'tl' ? `${n} araw` : `${n} day${n === 1 ? '' : 's'}`;

// "₱100 a day" / "₱100 kada araw"
export const perDayText = (amount: string, lang: Language) =>
  lang === 'tl' ? `${amount} kada araw` : `${amount} a day`;

const CAT_TL: Record<string, string> = {
  food: 'Pagkain',
  snacks: 'Meryenda at Inumin',
  transpo: 'Pamasahe',
  school: 'Gamit sa Eskwela',
  load: 'Load at Data',
  gala: 'Gala',
  shopping: 'Pamimili',
  personal: 'Pansariling Gamit',
  health: 'Kalusugan',
  bills: 'Bayarin at Upa',
  subs: 'Subscriptions',
  gifts: 'Regalo',
  games: 'Laro',
  other: 'Iba pa',
};

// Taglish keeps the English labels, except where students say it in Tagalog anyway
const CAT_TAGLISH: Record<string, string> = {
  transpo: 'Pamasahe',
  gala: 'Gala',
  other: 'Others',
};

export function catLabel(id: string, english: string, lang: Language) {
  if (lang === 'tl') return CAT_TL[id] || english;
  if (lang === 'taglish') return CAT_TAGLISH[id] || english;
  return english;
}

export const dateLocale = (lang: Language) => (lang === 'tl' ? 'fil-PH' : 'en-PH');
