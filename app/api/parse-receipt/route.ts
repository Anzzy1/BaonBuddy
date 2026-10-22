import { NextRequest, NextResponse } from 'next/server';
import { CATS } from '@/lib/budget';
import { detectCategory } from '@/lib/parseExpense';
import { ParsedReceipt, parseReceiptText } from '@/lib/parseReceipt';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const CAT_IDS = CATS.map(c => c.id);

// Every amount printed on the receipt, so the model can't invent one
const amountsIn = (text: string) =>
  new Set([...text.matchAll(/(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?!\d)/g)].map(m => parseFloat(m[1].replace(/,/g, '') + '.' + m[2])));

async function askOllama(text: string): Promise<Partial<ParsedReceipt> | null> {
  if (!OLLAMA_MODEL) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
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
              'You read OCR text from a Philippine store receipt (it may have OCR mistakes). ' +
              'Return JSON: {"store":string,"total":number,"items":[{"name":string,"amount":number}]}. ' +
              'total is the final amount paid (TOTAL / AMOUNT DUE), not cash or change. Copy numbers exactly as printed. ' +
              'If you cannot find a total, use 0.',
          },
          { role: 'user', content: text.slice(0, 4000) },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(data?.message?.content || 'null');
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') return NextResponse.json({ error: 'no text' }, { status: 400 });

    const parsed = parseReceiptText(text);
    if (parsed.total > 0 && parsed.confidence !== 'low') return NextResponse.json({ ...parsed, source: 'rules' });

    const ai = await askOllama(text);
    const printed = amountsIn(text);
    const aiTotal = Math.round(Number(ai?.total) * 100) / 100;
    if (ai && aiTotal > 0 && printed.has(aiTotal)) {
      const items = (Array.isArray(ai.items) ? ai.items : [])
        .map(it => ({ name: String(it?.name || '').slice(0, 32), amount: Math.round(Number(it?.amount) * 100) / 100 }))
        .filter(it => it.name && printed.has(it.amount))
        .map(it => ({ ...it, category: detectCategory(it.name) }));
      const category = CAT_IDS.includes(parsed.category) ? parsed.category : 'other';
      return NextResponse.json({
        ...parsed,
        store: parsed.store !== 'Receipt' ? parsed.store : String(ai.store || 'Receipt').slice(0, 32),
        total: aiTotal,
        items: items.length ? items.map(it => ({ ...it, category: it.category === 'other' ? category : it.category })) : parsed.items,
        confidence: 'medium',
        check: null,
        source: 'ai',
      });
    }

    return NextResponse.json({ ...parsed, source: 'rules' });
  } catch {
    return NextResponse.json({ error: 'fail' }, { status: 500 });
  }
}
