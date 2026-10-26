// Client-side engine: the same parsing + advice logic the API routes used to run,
// moved into the browser so the app works as a standalone APK / desktop app.

import { AppState, CATS } from '@/lib/budget';
import { Lang, ParsedItem, detectCategory, parseExpenseMessage } from '@/lib/parseExpense';
import { ParsedReceipt, parseReceiptText } from '@/lib/parseReceipt';
import { EXACT_INTENTS, budgetSummary, ruleReply } from '@/lib/advisor';
import { askOllama } from '@/lib/ollama';

const CAT_IDS = CATS.map(c => c.id);

/* ------------------------------------------------------------------ */
/* Buddy advice                                                        */
/* ------------------------------------------------------------------ */

const ADVICE_EXAMPLES = `Examples of good replies:
Student: should I join my friends for samgyup this weekend?
Buddy: You can go, just set a limit. Keep it under ₱400 so the rest of the week stays okay. Maybe skip one milk tea run to make up for it.
Student: any tips para makatipid sa transpo?
Buddy: Sumabay sa classmates pauwi, at jeep muna imbes na Grab. Kung malapit lang, lakad na lang. Maliit pero malaking tulong pag pinagsama.
Student: what's the weather tomorrow?
Buddy: Haha, budget buddy lang ako, so I can't help with that. But if it's about your baon, I'm all in!`;

// Reject AI replies that mention peso amounts not found in the grounding text
const amounts = (s: string) =>
  (s.match(/₱\s?[\d,]+(\.\d+)?/g) || []).map(x => Math.round(parseFloat(x.replace(/[₱,\s]/g, ''))));

function grounded(reply: string, source: string) {
  const known = new Set(amounts(source));
  return reply.length >= 15 && amounts(reply).every(n => known.has(n));
}

export interface AdviceResult {
  reply: string;
  source: 'ai' | 'rules';
  lang: Lang;
  intent: string;
}

export async function adviceReply(
  state: AppState,
  history: { role: 'user' | 'assistant'; text: string }[],
  message: string,
): Promise<AdviceResult> {
  const { reply: fallback, intent, lang } = ruleReply(state, message, history);

  // Exact questions (math, greetings, off-topic) and Tagalog answers stay rule-based:
  // they are instant, always correct, and the small local model's Tagalog is unreliable
  if (EXACT_INTENTS.has(intent) || lang === 'tl') {
    return { reply: fallback, source: 'rules', lang, intent };
  }

  const summary = budgetSummary(state);
  const langRule =
    'Reply in clear, friendly English only. Do not use Tagalog.';
  const system = [
    "You are Buddy, a Filipino college student's friend who helps them handle their baon (allowance). Warm, casual, encouraging, like a kaibigan, never preachy.",
    langRule,
    'Rules:',
    "- Only talk about this student's allowance, spending, saving and money habits. If the question is about anything else, say in one sentence that you can only help with their budget.",
    '- Answer the question directly in the first sentence.',
    '- 2 to 4 short sentences. No headings, no lists unless asked.',
    '- Only use peso amounts that appear in the data or analysis below. Do not do new math and never invent expenses.',
    '',
    ADVICE_EXAMPLES,
    '',
    'Student budget data:',
    summary,
    '',
    'Correct analysis for this question (reuse these numbers):',
    fallback,
  ].join('\n');

  const ai = await askOllama({
    system,
    user: message,
    history: history.slice(-6).map(m => ({ role: m.role, content: m.text })),
    temperature: 0.3,
    numPredict: 180,
    timeout: 8000,
  });

  if (ai && grounded(ai, `${summary}\n${fallback}`)) {
    return { reply: ai, source: 'ai', lang, intent };
  }
  return { reply: fallback, source: 'rules', lang, intent };
}

/* ------------------------------------------------------------------ */
/* Quick chat expense parser                                           */
/* ------------------------------------------------------------------ */

export type ClientParseResult =
  | { action: 'add'; items: ParsedItem[]; lang: Lang; source: 'ai' | 'rules'; amount: number; category: string; note: string }
  | { action: 'remove'; lang: Lang; source: 'rules' }
  | { action: 'query'; lang: Lang; source: 'rules' }
  | { action: 'none'; hasNumber: boolean; lang: Lang; source: 'rules' };

// Also expose the first item flat, so older callers that read data.amount keep working
function withLegacy(items: ParsedItem[], lang: Lang, source: 'ai' | 'rules'): ClientParseResult {
  const first = items[0];
  return {
    action: 'add',
    items,
    lang,
    source,
    amount: first.amount,
    category: first.category,
    note: first.note,
  };
}

export async function parseExpense(message: string): Promise<ClientParseResult> {
  const text = message.slice(0, 300);
  const result = parseExpenseMessage(text);
  if (result.action === 'add') return withLegacy(result.items, result.lang, 'rules');
  if (result.action !== 'none') return { ...result, source: 'rules' };

  // Only ask the model when there is some number to find, so it can't invent one
  if (result.hasNumber) {
    const items = await askOllamaJson(text);
    if (items) return withLegacy(items, result.lang, 'ai');
  }
  return { action: 'none', hasNumber: result.hasNumber, lang: result.lang, source: 'rules' };
}

async function askOllamaJson(message: string): Promise<ParsedItem[] | null> {
  const raw = await askOllama({
    system:
      'Extract expenses from a Filipino student\'s message (English, Tagalog or Taglish). ' +
      'Return JSON: {"items":[{"amount":number,"category":"food|transpo|school|load|gala|other","note":"short item name","daysAgo":number}]}. ' +
      'amount is the total in pesos for that item (multiply quantity by price each). daysAgo is 0 for today, 1 for yesterday/kahapon. ' +
      'If no money amount is stated, return {"items":[]}. Never guess an amount.',
    user: message,
    format: 'json',
    temperature: 0,
    timeout: 6000,
  });
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw || '{}');
    const items: ParsedItem[] = (Array.isArray(parsed.items) ? parsed.items : [])
      .map((x: Record<string, unknown>) => ({
        amount: Math.round(Number(x.amount) * 100) / 100,
        category: CAT_IDS.includes(String(x.category)) ? String(x.category) : detectCategory(String(x.note || message)),
        note: String(x.note || '').slice(0, 40),
        daysAgo: Math.min(60, Math.max(0, Math.round(Number(x.daysAgo) || 0))),
      }))
      .filter((x: ParsedItem) => x.amount > 0 && x.amount < 1_000_000);
    return items.length ? items : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Receipt parser                                                      */
/* ------------------------------------------------------------------ */

export type ClientReceipt = ParsedReceipt & { source: 'ai' | 'rules' };

// Every amount printed on the receipt, so the model can't invent one
const amountsIn = (text: string) =>
  new Set([...text.matchAll(/(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?!\d)/g)].map(m => parseFloat(m[1].replace(/,/g, '') + '.' + m[2])));

async function askOllamaReceipt(text: string): Promise<Partial<ParsedReceipt> | null> {
  const raw = await askOllama({
    system:
      'You read OCR text from a Philippine store receipt (it may have OCR mistakes). ' +
      'Return JSON: {"store":string,"total":number,"items":[{"name":string,"amount":number}]}. ' +
      'total is the final amount paid (TOTAL / AMOUNT DUE), not cash or change. Copy numbers exactly as printed. ' +
      'If you cannot find a total, use 0.',
    user: text.slice(0, 4000),
    format: 'json',
    temperature: 0,
    timeout: 12000,
  });
  if (!raw) return null;
  try {
    return JSON.parse(raw || 'null');
  } catch {
    return null;
  }
}

export async function parseReceipt(text: string): Promise<ClientReceipt> {
  const parsed = parseReceiptText(text);
  if (parsed.total > 0 && parsed.confidence !== 'low') return { ...parsed, source: 'rules' };

  const ai = await askOllamaReceipt(text);
  const printed = amountsIn(text);
  const aiTotal = Math.round(Number(ai?.total) * 100) / 100;
  if (ai && aiTotal > 0 && printed.has(aiTotal)) {
    const items = (Array.isArray(ai.items) ? ai.items : [])
      .map(it => ({ name: String(it?.name || '').slice(0, 32), amount: Math.round(Number(it?.amount) * 100) / 100 }))
      .filter(it => it.name && printed.has(it.amount))
      .map(it => ({ ...it, category: detectCategory(it.name) }));
    const category = CAT_IDS.includes(parsed.category) ? parsed.category : 'other';
    return {
      ...parsed,
      store: parsed.store !== 'Receipt' ? parsed.store : String(ai.store || 'Receipt').slice(0, 32),
      total: aiTotal,
      items: items.length ? items.map(it => ({ ...it, category: it.category === 'other' ? category : it.category })) : parsed.items,
      confidence: 'medium',
      check: null,
      source: 'ai',
    };
  }

  return { ...parsed, source: 'rules' };
}
