'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import CameraCapture from '@/components/CameraCapture';
import { CATS, Expense, catById, cleanAmount, peso, today, uid } from '@/lib/budget';
import type { ParsedReceipt } from '@/lib/parseReceipt';

interface ReceiptScannerProps {
  onAdd: (e: Expense | Expense[]) => void;
}

type Stage = 'idle' | 'camera' | 'reading' | 'review';
type EditItem = { name: string; amount: string; category: string; keep: boolean };

// Grayscale + contrast stretch + sensible size: Tesseract reads receipts much better this way
async function prepareImage(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const longest = Math.max(img.width, img.height);
    const scale = longest > 2200 ? 2200 / longest : longest < 1000 ? 1000 / longest : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    let min = 255;
    let max = 0;
    for (let i = 0; i < px.length; i += 4) {
      const g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      px[i] = g;
      if (g < min) min = g;
      if (g > max) max = g;
    }
    const range = Math.max(1, max - min);
    for (let i = 0; i < px.length; i += 4) {
      const v = ((px[i] - min) / range) * 255;
      px[i] = px[i + 1] = px[i + 2] = v;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function ReceiptScanner({ onAdd }: ReceiptScannerProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [receipt, setReceipt] = useState<(ParsedReceipt & { source?: string }) | null>(null);
  const [store, setStore] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState(today());
  const [cat, setCat] = useState('food');
  const [split, setSplit] = useState(false);
  const [items, setItems] = useState<EditItem[]>([]);
  const [done, setDone] = useState<string | null>(null);

  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // Lets people paste a screenshot of a receipt (e.g. a GCash receipt) with Ctrl+V
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files || [])].find(f => f.type.startsWith('image/'));
      if (file && stage !== 'reading' && stage !== 'camera') scan(file);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  const reset = () => {
    setStage('idle');
    setReceipt(null);
    setError(null);
    setProgress(0);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const scan = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('That file is not a photo. Pick a JPG or PNG of the receipt.'); return; }
    setDone(null);
    setError(null);
    setPreview(URL.createObjectURL(file));
    setStage('reading');
    setProgress(0);
    setStatus('Preparing photo…');

    try {
      const canvas = await prepareImage(file);
      const { createWorker } = await import('tesseract.js');
      setStatus('Loading reader… (first time takes a few seconds)');
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setStatus('Reading receipt…');
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data } = await worker.recognize(canvas);
      await worker.terminate();
      setOcrText(data.text);

      setStatus('Adding it up…');
      const res = await fetch('/api/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });
      const r = await res.json();
      if (!res.ok || r.error) throw new Error('parse');

      if (!(r.total > 0)) {
        setError("I couldn't find a total on this receipt. Try a sharper photo with the TOTAL line visible, or log it by hand.");
        setStage('idle');
        return;
      }
      setReceipt(r);
      setStore(r.store);
      setTotal(String(r.total));
      setDate(r.date && r.date <= today() ? r.date : today());
      setCat(r.category);
      setItems((r.items as ParsedReceipt['items']).map(it => ({ name: it.name, amount: String(it.amount), category: it.category, keep: true })));
      setSplit(false);
      setStage('review');
    } catch {
      setError('Something went wrong reading the photo. Check your internet (the reader downloads once) and try again.');
      setStage('idle');
    }
  };

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (f) scan(f);
  };

  const kept = items.filter(it => it.keep && parseFloat(it.amount) > 0);
  const keptSum = kept.reduce((s, it) => s + parseFloat(it.amount), 0);
  const logAmount = split ? keptSum : parseFloat(total) || 0;

  const log = () => {
    if (!(logAmount > 0)) return;
    const ts = Date.now();
    const exps: Expense[] = split
      ? kept.map((it, i) => ({ id: uid(), amount: Math.round(parseFloat(it.amount) * 100) / 100, cat: it.category, date, note: `${it.name} (${store})`.slice(0, 60), ts: ts + i }))
      : [{ id: uid(), amount: Math.round(logAmount * 100) / 100, cat, date, note: items.length ? `${store}: ${items.slice(0, 3).map(i => i.name).join(', ')}`.slice(0, 60) : store, ts }];
    onAdd(exps);
    setDone(`Logged ${peso(exps.reduce((s, x) => s + x.amount, 0))} from ${store}${exps.length > 1 ? ` as ${exps.length} items` : ''}.`);
    reset();
  };

  const conf = receipt?.confidence;

  return (
    <div className="mt-4">
      <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={pick} data-testid="receipt-upload" />

      {stage === 'idle' && (
        <div
          className="dropzone"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) scan(f); }}
        >
          <div className="mx-auto w-16 h-16 rounded-[22px] grid place-items-center bg-[var(--peach)] text-[#0E0E10] -rotate-6">
            <Icon name="scan" className="w-8 h-8" />
          </div>
          <p className="font-display font-bold text-lg tracking-tight mt-4">Scan a receipt</p>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            Point your camera at a 7-Eleven, grocery or fast food receipt. I&apos;ll read the total and log it for you.
          </p>
          <div className="flex gap-2 justify-center flex-wrap mt-5">
            <button type="button" className="pill !bg-[#0E0E10] !text-white" onClick={() => { setError(null); setDone(null); setStage('camera'); }}>
              <Icon name="camera" className="w-4 h-4" />Open camera
            </button>
            <button type="button" className="pill plus" onClick={() => uploadRef.current?.click()}>
              <Icon name="image" className="w-4 h-4" />Upload photo
            </button>
          </div>
          <p className="text-[12px] text-muted mt-4">Tip: flat receipt, good light, whole receipt in frame. You can also drag a photo here or paste one.</p>
        </div>
      )}

      {stage === 'camera' && (
        <CameraCapture
          onCapture={scan}
          onCancel={() => setStage('idle')}
          onUpload={() => { setStage('idle'); uploadRef.current?.click(); }}
        />
      )}

      {done && stage === 'idle' && <div className="result good mt-3"><p className="text-sm font-medium">{done}</p></div>}
      {error && <div className="result bad mt-3"><p className="text-sm font-medium">{error}</p></div>}

      {stage === 'reading' && (
        <div className="flex gap-4 items-center">
          {preview && <img src={preview} alt="Receipt being read" className="receipt-thumb" />}
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-lg tracking-tight">{status}</p>
            <div className="bar mt-3"><i style={{ width: `${Math.max(5, progress)}%`, background: 'var(--cobalt)' }} /></div>
            <p className="text-[13px] text-muted mt-2 tnum">{progress}%</p>
          </div>
        </div>
      )}

      {stage === 'review' && receipt && (
        <div>
          <div className="flex gap-4 items-start">
            {preview && (
              <a href={preview} target="_blank" rel="noreferrer" className="shrink-0" aria-label="Open receipt photo">
                <img src={preview} alt="Scanned receipt" className="receipt-thumb" />
              </a>
            )}
            <div className="flex-1 min-w-0">
              <label className="field-label" htmlFor="r-store">Store</label>
              <input id="r-store" className="input" value={store} maxLength={32} onChange={e => setStore(e.target.value)} />
              <div className={`result mt-3 !py-2.5 ${conf === 'high' ? 'good' : conf === 'medium' ? 'warn' : 'bad'}`}>
                <p className="text-[13px] font-medium">
                  {conf === 'high'
                    ? receipt.check === 'items' ? 'Total matches the items on the receipt.' : 'Total matches cash minus change on the receipt.'
                    : conf === 'medium'
                      ? 'Found the total. Give it a quick check before logging.'
                      : "The photo was hard to read. Please check the amount."}
                </p>
              </div>
            </div>
          </div>

          {items.length > 1 && (
            <div className="seg mt-5" role="group" aria-label="How to log">
              <button type="button" className="pill sm" aria-pressed={!split} onClick={() => setSplit(false)}>One expense</button>
              <button type="button" className="pill sm" aria-pressed={split} onClick={() => setSplit(true)}>Each item separately</button>
            </div>
          )}

          {!split ? (
            <>
              <p className="field-label mt-5">Total paid</p>
              <div className="amount-field sm">
                <span className="peso">₱</span>
                <input inputMode="decimal" aria-label="Total paid" value={total} onChange={e => setTotal(cleanAmount(e.target.value))} />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3" role="group" aria-label="Category">
                {CATS.map(x => (
                  <button key={x.id} type="button" className="pill sm" aria-pressed={cat === x.id} onClick={() => setCat(x.id)}>{x.label}</button>
                ))}
              </div>
              {items.length > 0 && (
                <p className="text-[13px] text-muted mt-3">
                  Items read: {items.map(i => `${i.name} ${peso(parseFloat(i.amount) || 0)}`).join(' · ')}
                </p>
              )}
            </>
          ) : (
            <div className="mt-4 space-y-2">
              {items.map((it, i) => {
                const update = (patch: Partial<EditItem>) => setItems(prev => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                return (
                  <div key={i} className={`receipt-item ${it.keep ? '' : 'opacity-40'}`}>
                    <input type="checkbox" className="w-4 h-4 accent-[var(--cobalt)] shrink-0" checked={it.keep} onChange={e => update({ keep: e.target.checked })} aria-label={`Include ${it.name}`} />
                    <input className="input !h-10 flex-1 min-w-0" value={it.name} onChange={e => update({ name: e.target.value })} aria-label="Item name" />
                    <select className="input !h-10 !w-auto !px-2 text-[13px]" value={it.category} onChange={e => update({ category: e.target.value })} aria-label="Item category">
                      {CATS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                    </select>
                    <input className="input !h-10 !w-24 text-right tnum" inputMode="decimal" value={it.amount} onChange={e => update({ amount: cleanAmount(e.target.value) })} aria-label="Item amount" />
                  </div>
                );
              })}
              {receipt.total > 0 && Math.abs(keptSum - receipt.total) > 0.5 && (
                <p className="text-[13px] text-muted">Items add up to {peso(keptSum)}; the receipt total says {peso(receipt.total)}.</p>
              )}
            </div>
          )}

          <div className="mt-4">
            <label className="field-label" htmlFor="r-date">Date on receipt</label>
            <input id="r-date" type="date" className="input" value={date} max={today()} onChange={e => setDate(e.target.value)} />
          </div>

          <details className="mt-4 text-[13px]">
            <summary className="cursor-pointer text-muted">Show what I read</summary>
            <pre className="mt-2 p-3 rounded-xl bg-[var(--soft)] whitespace-pre-wrap font-mono text-[12px] max-h-56 overflow-y-auto">{ocrText}</pre>
          </details>

          <div className="flex gap-2 mt-5">
            <button type="button" className="pill" onClick={reset}>Cancel</button>
            <button type="button" className="submit !h-12 flex-1" onClick={log} disabled={!(logAmount > 0)}>
              <span className="badge"><Icon name="check" /></span>
              Log {peso(logAmount)}{split ? ` (${kept.length} items)` : ` as ${catById(cat).label}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
