import { NextRequest, NextResponse } from 'next/server';
import { AppState } from '@/lib/budget';
import { Lang } from '@/lib/parseExpense';
import { EXACT_INTENTS, budgetSummary, ruleReply } from '@/lib/advisor';

interface AdviceRequest {
  state: AppState;
  history: { role: 'user' | 'assistant'; text: string }[];
  message: string;
}

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

// Few-shot examples teach the small model Buddy's tone, length and focus
const EXAMPLES = `Examples of good replies:
Student: should I join my friends for samgyup this weekend?
Buddy: You can go, just set a limit. Keep it under ₱400 so the rest of the week stays okay. Maybe skip one milk tea run to make up for it.
Student: any tips para makatipid sa transpo?
Buddy: Sumabay sa classmates pauwi, at jeep muna imbes na Grab. Kung malapit lang, lakad na lang. Maliit pero malaking tulong pag pinagsama.
Student: what's the weather tomorrow?
Buddy: Haha, budget buddy lang ako, so I can't help with that. But if it's about your baon, I'm all in!`;

async function askOllama(summary: string, analysis: string, history: AdviceRequest['history'], message: string, lang: Lang) {
  if (!OLLAMA_MODEL) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  const langRule =
    lang === 'tl'
      ? 'Reply in simple, casual Taglish: mostly short English sentences mixed with everyday Filipino words (ka, mo, na, lang, pa, tayo, kaya, sige). Never use deep or formal Tagalog words.'
      : 'Reply in clear, friendly English only. Do not use Tagalog.';
  const system = [
    "You are Buddy, a Filipino college student's friend who helps them handle their baon (allowance). Warm, casual, encouraging, like a kaibigan, never preachy.",
    langRule,
    'Rules:',
    '- Only talk about this student\'s allowance, spending, saving and money habits. If the question is about anything else, say in one sentence that you can only help with their budget.',
    '- Answer the question directly in the first sentence.',
    '- 2 to 4 short sentences. No headings, no lists unless asked.',
    '- Only use peso amounts that appear in the data or analysis below. Do not do new math and never invent expenses.',
    '',
    EXAMPLES,
    '',
    'Student budget data:',
    summary,
    '',
    'Correct analysis for this question (reuse these numbers):',
    analysis,
  ].join('\n');
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        options: { temperature: 0.3, num_predict: 180 },
        messages: [
          { role: 'system', content: system },
          ...history.slice(-6).map(m => ({ role: m.role, content: m.text })),
          { role: 'user', content: message },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.message?.content as string)?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Reject AI replies that mention peso amounts not found in the grounding text
const amounts = (s: string) => (s.match(/₱\s?[\d,]+(\.\d+)?/g) || []).map(x => Math.round(parseFloat(x.replace(/[₱,\s]/g, ''))));
function grounded(reply: string, source: string) {
  const known = new Set(amounts(source));
  return reply.length >= 15 && amounts(reply).every(n => known.has(n));
}

export async function POST(req: NextRequest) {
  try {
    const { state, history = [], message }: AdviceRequest = await req.json();
    if (!message || !state) return NextResponse.json({ error: 'missing input' }, { status: 400 });

    const { reply: fallback, intent, lang } = ruleReply(state, message, history);

    // Exact questions (math, greetings, off-topic) and Tagalog answers stay rule-based:
    // they are instant, always correct, and the small local model's Tagalog is unreliable
    if (EXACT_INTENTS.has(intent) || lang === 'tl') {
      return NextResponse.json({ reply: fallback, source: 'rules', lang, intent });
    }

    const summary = budgetSummary(state);
    const ai = await askOllama(summary, fallback, history, message, lang);
    if (ai && grounded(ai, `${summary}\n${fallback}`)) return NextResponse.json({ reply: ai, source: 'ai', lang, intent });

    return NextResponse.json({ reply: fallback, source: 'rules', lang, intent });
  } catch {
    return NextResponse.json({ reply: 'Oops, something went wrong on my side. Try asking again?', source: 'rules', lang: 'en' });
  }
}
