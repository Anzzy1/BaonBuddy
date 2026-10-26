'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import Mascot from '@/components/Mascot';
import { ChatInput, TypingDots } from '@/components/tabs/LogTab';
import { AppState, Computed, pesoR } from '@/lib/budget';
import { ruleReply } from '@/lib/advisor';
import { adviceReply } from '@/lib/engine';

export type AdvisorMsg = { role: 'user' | 'assistant'; text: string };

interface AdvisorTabProps {
  state: AppState;
  c: Computed;
  messages: AdvisorMsg[];
  setMessages: React.Dispatch<React.SetStateAction<AdvisorMsg[]>>;
}

const SUGGESTIONS = [
  'How is my budget doing?',
  'Where does my money go?',
  'How can I save more?',
  'Can I afford 800 pesos shoes?',
  'Paano ako makakatipid sa food?',
];

export default function AdvisorTab({ state, c, messages, setMessages }: AdvisorTabProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'rules' | null>(null);
  const [talking, setTalking] = useState(false);
  const [hello, setHello] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

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
          <h2 className="card-title flex items-center gap-3"><span className="title-ic bg-[var(--sky)]"><Icon name="bot" /></span>Tanong kay Buddy</h2>
          {messages.length > 0 && (
            <button type="button" className="pill sm" onClick={() => setMessages([])}>Clear chat</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar mt-4 px-2 sm:px-0" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="mx-auto w-fit mb-4 -rotate-3">
                <Mascot size={96} waving={hello} />
              </div>
              <p className="font-display font-bold text-xl tracking-tight">Hi! I'm Buddy.</p>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">Ask me anything about your budget: whether you can afford something, how to save, or where to cut back. English or Taglish, sasagot ako sa language mo.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mt-2 flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <Mascot size={36} talking={i === messages.length - 1 && talking} />}
              <div className={`bubble ${m.role === 'user' ? 'me' : 'bot'}`}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="mt-2 flex items-end gap-2">
              <Mascot size={36} waving />
              <TypingDots />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 px-2 sm:px-0">
          {SUGGESTIONS.map(s => (
            <button key={s} type="button" className="pill sm plus" onClick={() => ask(s)} disabled={loading}>{s}</button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); ask(input); }} className="mt-3 px-2 sm:px-0" autoComplete="off">
          <ChatInput value={input} onChange={setInput} disabled={loading} placeholder="Ask about your budget… / Magtanong…" />
        </form>
      </section>

      <aside className="glass reveal p-6 lg:col-span-4 self-start" style={{ '--d': '.08s' } as React.CSSProperties} aria-label="What Buddy sees">
        <p className="eyebrow">Ito ang nakikita ni Buddy</p>
        <div className="mt-3 space-y-1 text-sm">
          {[
            ['Budget', pesoR(state.budget)],
            ['Spent', `${pesoR(c.spent)} (${Math.round(c.pct)}%)`],
            ['Natitira', (c.remaining < 0 ? '−' : '') + pesoR(c.remaining)],
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
              : 'Number questions get instant answers. Open-ended English questions use your local AI (Ollama) when it is running.'}
        </p>
      </aside>
    </div>
  );
}
