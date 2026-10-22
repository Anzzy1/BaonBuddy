import { NextRequest, NextResponse } from 'next/server';
import { CATS } from '@/lib/budget';
import { ParsedItem, detectCategory, parseExpenseMessage } from '@/lib/parseExpense';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const CAT_IDS = CATS.map(c => c.id);

// Last resort for phrasing the rules miss: ask the local model for structured JSON
async function askOllama(message: string): Promise<ParsedItem[] | null> {
  if (!OLLAMA_MODEL) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        format: 'json',
        options: { temperature: 0 },
        messages: [
          {
            role: 'system',
            content:
              'Extract expenses from a Filipino student\'s message (English, Tagalog or Taglish). ' +
              'Return JSON: {"items":[{"amount":number,"category":"food|transpo|school|load|gala|other","note":"short item name","daysAgo":number}]}. ' +
              'amount is the total in pesos for that item (multiply quantity by price each). daysAgo is 0 for today, 1 for yesterday/kahapon. ' +
              'If no money amount is stated, return {"items":[]}. Never guess an amount.',
          },
          { role: 'user', content: message },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = JSON.parse(data?.message?.content || '{}');
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
  } finally {
    clearTimeout(timer);
  }
}

// Also send the first item as flat fields, so a browser tab still running older code
// (which read data.amount) logs the right number instead of NaN
function withLegacy<T extends { items: ParsedItem[] }>(res: T) {
  const first = res.items[0];
  return { ...res, amount: first.amount, category: first.category, note: first.note };
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'no message' }, { status: 400 });
    }

    const result = parseExpenseMessage(message.slice(0, 300));
    if (result.action === 'add') return NextResponse.json(withLegacy({ ...result, source: 'rules' }));
    if (result.action !== 'none') return NextResponse.json({ ...result, source: 'rules' });

    // Only ask the model when there is some number to find, so it can't invent one
    if (result.hasNumber) {
      const items = await askOllama(message.slice(0, 300));
      if (items) return NextResponse.json(withLegacy({ action: 'add', items, lang: result.lang, source: 'ai' }));
    }

    return NextResponse.json({ action: 'none', lang: result.lang });
  } catch {
    return NextResponse.json({ action: 'none', lang: 'en', error: 'fail' });
  }
}
