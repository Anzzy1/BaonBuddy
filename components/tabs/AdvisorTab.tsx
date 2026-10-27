'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import Mascot from '@/components/Mascot';
import { ChatInput, TypingDots } from '@/components/tabs/LogTab';
import { AppState, Computed, langOf, pesoR } from '@/lib/budget';
import { Language, translator } from '@/lib/i18n';
import { ruleReply } from '@/lib/advisor';
import { adviceReply } from '@/lib/engine';

export type AdvisorMsg = { role: 'user' | 'assistant'; text: string };

interface AdvisorTabProps {
  state: AppState;
  c: Computed;
  messages: AdvisorMsg[];
  setMessages: React.Dispatch<React.SetStateAction<AdvisorMsg[]>>;
}

const SUGGESTIONS: Record<Language, string[]> = {
  en: [
    'How is my budget doing?',
    'Where does my money go?',
    'How can I save more?',
    'Can I afford 800 pesos shoes?',
    'How can I spend less on food?',
  ],
  tl: [
    'Kumusta ang badyet ko?',
    'Saan napupunta ang pera ko?',
    'Paano ako makakaipon pa?',
    'Kaya ko bang bumili ng sapatos na 800?',
    'Paano ako makakatipid sa pagkain?',
  ],
  taglish: [
    'Kumusta ang budget ko?',
    'Saan napupunta ang pera ko?',
    'Paano ako makaka-save more?',
    'Kaya ko ba ang 800 na shoes?',
    'Tips para makatipid sa food?',
  ],
};

export default function AdvisorTab({ state, c, messages, setMessages }: AdvisorTabProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'rules' | null>(null);
  const [talking, setTalking] = useState(false);
  const [hello, setHello] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const lang = langOf(state);
  const t = translator(lang);

  // Buddy waves hello when the chat opens
  useEffect(() => {
    const t = setTimeout(() => setHello(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const ask = async (text: string) => {
    text = text.trim();
    if (!text || loading) return;
    setInput('');
    const history = messages;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      // Runs in the browser: rule-based math instantly, local AI when available
      const data = await adviceReply(state, history, text);
      setSource(data.source);
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setSource('rules');
      setMessages(prev => [...prev, { role: 'assistant', text: ruleReply(state, text, history).reply }]);
    } finally {
      setTalking(true);
      setTimeout(() => setTalking(false), 1600);
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <section className="glass reveal p-4 sm:p-6 lg:col-span-8 flex flex-col" style={{ minHeight: 'min(640px, calc(100vh - 160px))' }} aria-label="AI Advisor chat">
        <div className="flex items-center justify-between gap-3 px-2 sm:px-0">
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--sky)]"><Icon name="bot" /></span>{t('Ask Buddy', 'Tanungin si Buddy', 'Ask Buddy')}</h2>
          {messages.length > 0 && (
            <button type="button" className="pill sm" onClick={() => setMessages([])}>{t('Clear chat', 'Burahin ang usapan', 'Clear chat')}</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar mt-4 px-2 sm:px-0" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="mx-auto w-fit mb-4 -rotate-3">
                <Mascot size={96} waving={hello} avatar={state.profile?.avatar} />
              </div>
              <p className="font-display font-bold text-xl tracking-tight">{t("Hi! I'm Buddy.", 'Kumusta! Ako si Buddy.', "Hi! Ako si Buddy.")}</p>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">{t(
                'Ask me anything about your budget: whether you can afford something, how to save, or where to cut back. Just type your question below.',
                'Magtanong ka tungkol sa badyet mo: kung kaya mong bilhin ang isang bagay, paano mag-ipon, o saan puwedeng magbawas. I-type lang ang tanong mo sa ibaba.',
                'Ask me anything about your budget: kung kaya mo bang bilhin ang isang bagay, paano mag-ipon, or saan pwedeng magbawas. I-type lang ang tanong mo sa baba.',
              )}</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mt-2 flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <Mascot size={36} talking={i === messages.length - 1 && talking} avatar={state.profile?.avatar} />}
              <div className={`bubble ${m.role === 'user' ? 'me' : 'bot'}`}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="mt-2 flex items-end gap-2">
              <Mascot size={36} waving avatar={state.profile?.avatar} />
              <TypingDots />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 px-2 sm:px-0">
          {SUGGESTIONS[lang].map(s => (
            <button key={s} type="button" className="pill sm plus" onClick={() => ask(s)} disabled={loading}>{s}</button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); ask(input); }} className="mt-3 px-2 sm:px-0" autoComplete="off">
          <ChatInput value={input} onChange={setInput} disabled={loading} placeholder={t('Ask about your budget…', 'Magtanong tungkol sa badyet mo…', 'Ask about your budget…')} />
        </form>
      </section>

      <aside className="glass reveal p-6 lg:col-span-4 self-start" style={{ '--d': '.08s' } as React.CSSProperties} aria-label="What Buddy sees">
        <p className="eyebrow">What Buddy sees</p>
        <div className="mt-3 space-y-1 text-sm">
          {[
            ['Budget', pesoR(state.budget)],
            ['Spent', `${pesoR(c.spent)} (${Math.round(c.pct)}%)`],
            ['Remaining', (c.remaining < 0 ? '−' : '') + pesoR(c.remaining)],
            ['Safe / day', pesoR(c.perDay)],
            ['Days left', String(c.left)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1"><span className="text-muted">{k}</span><span className="font-medium tnum">{v}</span></div>
          ))}
        </div>
        <p className="text-[12px] text-muted mt-4 leading-relaxed">
          {source === 'rules'
            ? "Instant answer from Buddy's built-in budget math. Works offline."
            : source === 'ai'
              ? 'Answer written by your local AI model (Ollama), checked against your numbers.'
              : 'Number questions get instant answers. Open-ended questions use your local AI (Ollama) when it is running.'}
        </p>
      </aside>
    </div>
  );
}
