// Offline speech-to-text. Runs Whisper in a Web Worker using only files
// served from /public, so voice logging works without internet.
import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

const MODEL = 'onnx-community/whisper-base';

// The worker may be loaded from a blob: URL, so relative paths are resolved
// against the site origin. Model paths must stay relative: transformers.js
// only treats relative paths as local files.
const ORIGIN = self.location.origin;

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = '/models/';
// The Cache API needs absolute URLs; the files are local anyway
env.useBrowserCache = false;
env.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(typeof input === 'string' && input.startsWith('/') ? ORIGIN + input : input, init);
env.backends.onnx.wasm!.wasmPaths = {
  mjs: `${ORIGIN}/ort/ort-wasm-simd-threaded.asyncify.mjs`,
  wasm: `${ORIGIN}/ort/ort-wasm-simd-threaded.asyncify.wasm`,
};

export type WhisperIn =
  | { type: 'load' }
  | { type: 'transcribe'; id: number; audio: Float32Array; language: 'english' | 'tagalog' };

export type WhisperOut =
  | { type: 'progress'; pct: number }
  | { type: 'ready' }
  | { type: 'result'; id: number; text: string }
  | { type: 'error'; id?: number; message: string };

let loading: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

function load() {
  loading ??= pipeline('automatic-speech-recognition', MODEL, {
    dtype: 'q8',
    device: 'wasm',
    progress_callback: (p: { status: string; progress?: number }) => {
      if (p.status === 'progress_total' && typeof p.progress === 'number') post({ type: 'progress', pct: Math.round(p.progress) });
    },
  }) as Promise<AutomaticSpeechRecognitionPipeline>;
  return loading;
}

const post = (m: WhisperOut) => self.postMessage(m);

self.onmessage = async (e: MessageEvent<WhisperIn>) => {
  const msg = e.data;
  try {
    const asr = await load();
    if (msg.type === 'load') return post({ type: 'ready' });
    const out = await asr(msg.audio, { language: msg.language, task: 'transcribe' });
    const text = (Array.isArray(out) ? out[0]?.text : out.text) ?? '';
    post({ type: 'result', id: msg.id, text: text.trim() });
  } catch (err) {
    loading = null;
    post({ type: 'error', id: msg.type === 'transcribe' ? msg.id : undefined, message: String(err) });
  }
};
