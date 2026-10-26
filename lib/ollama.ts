// Optional local-AI helper. The app works fully offline with rule-based answers;
// when Ollama is reachable (same machine or LAN) we ask it for nicer phrasing.
// Runs in the browser / WebView, so every failure just returns null.

const DEFAULT_HOST = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:3b';

export const ollamaHost = () => {
  try {
    return localStorage.getItem('baonbuddy.ollamaHost') || process.env.NEXT_PUBLIC_OLLAMA_HOST || DEFAULT_HOST;
  } catch {
    return process.env.NEXT_PUBLIC_OLLAMA_HOST || DEFAULT_HOST;
  }
};

const ollamaModel = () => process.env.NEXT_PUBLIC_OLLAMA_MODEL || DEFAULT_MODEL;

interface AskOptions {
  system: string;
  user: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  format?: 'json';
  temperature?: number;
  numPredict?: number;
  timeout?: number;
}

export async function askOllama(opts: AskOptions): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeout ?? 8000);
  try {
    const res = await fetch(`${ollamaHost()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: ollamaModel(),
        stream: false,
        ...(opts.format ? { format: opts.format } : {}),
        options: { temperature: opts.temperature ?? 0.3, num_predict: opts.numPredict ?? 180 },
        messages: [
          { role: 'system', content: opts.system },
          ...(opts.history || []),
          { role: 'user', content: opts.user },
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
