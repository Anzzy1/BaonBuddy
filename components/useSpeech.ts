'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { WhisperIn, WhisperOut } from './whisper.worker';

// Voice input runs fully offline: the mic is recorded in the browser and
// transcribed by Whisper in a Web Worker (see whisper.worker.ts).

export const SPEECH_ERRORS: Record<string, { en: string; tl: string }> = {
  'not-allowed': { en: 'Microphone access is blocked. Allow it in the address bar, then try again.', tl: 'Naka-block ang mic. I-allow sa address bar tapos try ulit.' },
  'no-speech': { en: "I didn't hear anything. Tap the mic and speak a bit louder.", tl: 'Wala akong narinig. Pindutin ulit ang mic at lakasan ng konti.' },
  'audio-capture': { en: 'No microphone found. Plug one in or check your settings.', tl: 'Walang nakitang mic. I-check ang settings mo.' },
  insecure: { en: 'The mic only works on localhost or an https address. Open the app at http://localhost:3000.', tl: 'Gumagana lang ang mic sa localhost o https.' },
  model: { en: "The offline voice model couldn't load. Refresh the page and try again.", tl: 'Hindi na-load ang voice model. I-refresh at try ulit.' },
};

export type SpeechPhase = 'idle' | 'loading' | 'listening' | 'transcribing';

const SAMPLE_RATE = 16000; // what Whisper expects
const SILENCE_MS = 1400; // stop after this much quiet once speech was heard
const NO_SPEECH_MS = 7000;
const MAX_MS = 20000;

// One worker shared by every hook instance, so the model loads once per page
let worker: Worker | null = null;
let modelReady = false;
const listeners = new Set<(m: WhisperOut) => void>();

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<WhisperOut>) => {
      if (e.data.type === 'ready') modelReady = true;
      listeners.forEach(l => l(e.data));
    };
  }
  return worker;
}

const send = (m: WhisperIn, transfer: Transferable[] = []) => getWorker().postMessage(m, transfer);

async function resample(chunks: Float32Array<ArrayBuffer>[], rate: number) {
  const length = chunks.reduce((n, c) => n + c.length, 0);
  const buf = new AudioBuffer({ length, sampleRate: rate, numberOfChannels: 1 });
  let offset = 0;
  for (const c of chunks) { buf.copyToChannel(c, 0, offset); offset += c.length; }
  if (rate === SAMPLE_RATE) return buf.getChannelData(0);
  const off = new OfflineAudioContext(1, Math.ceil((length * SAMPLE_RATE) / rate), SAMPLE_RATE);
  const node = off.createBufferSource();
  node.buffer = buf;
  node.connect(off.destination);
  node.start();
  return (await off.startRendering()).getChannelData(0);
}

// Whisper writes things like "[BLANK_AUDIO]" or "(music)" when nobody spoke
const isNoise = (t: string) => !t || /^[\[(].*[\])]$/.test(t);

interface Options {
  lang: string;
  // Called once speech ends, with the best transcript first and other guesses after it
  onFinal: (alternatives: string[]) => void;
}

export function useSpeech({ lang, onFinal }: Options) {
  const [supported, setSupported] = useState(true);
  const [phase, setPhase] = useState<SpeechPhase>('idle');
  const [loadPct, setLoadPct] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<{ finish: (send: boolean) => void } | null>(null);
  const reqId = useRef(0);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    setSupported('Worker' in window && typeof WebAssembly === 'object' && !!navigator.mediaDevices?.getUserMedia);
    const onMsg = (m: WhisperOut) => {
      if (m.type === 'progress') setLoadPct(m.pct);
      else if (m.type === 'ready') { setLoadPct(null); setPhase(p => (p === 'loading' ? 'idle' : p)); }
      else if (m.type === 'result' && m.id === reqId.current) {
        setPhase('idle');
        if (isNoise(m.text)) setError('no-speech');
        else onFinalRef.current([m.text]);
      } else if (m.type === 'error') {
        console.error('[voice]', m.message);
        setPhase('idle');
        setLoadPct(null);
        setError('model');
      }
    };
    listeners.add(onMsg);
    return () => {
      listeners.delete(onMsg);
      recRef.current?.finish(false);
    };
  }, []);

  // Loads the model ahead of time so the first recording isn't slow
  const prepare = useCallback(() => {
    if (modelReady) return;
    setPhase(p => (p === 'idle' ? 'loading' : p));
    send({ type: 'load' });
  }, []);

  const start = useCallback(async () => {
    if (!window.isSecureContext) { setError('insecure'); return; }
    setError(null);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    } catch (err) {
      setError((err as DOMException)?.name === 'NotFoundError' ? 'audio-capture' : 'not-allowed');
      return;
    }
    if (!modelReady) send({ type: 'load' });

    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array<ArrayBuffer>[] = [];
    const t0 = performance.now();
    let heard = false;
    let lastLoud = t0;
    let floor = 0;
    let frames = 0;
    let done = false;

    const finish = async (keep: boolean) => {
      if (done) return;
      done = true;
      recRef.current = null;
      proc.disconnect();
      src.disconnect();
      stream.getTracks().forEach(t => t.stop());
      const rate = ctx.sampleRate;
      ctx.close();
      if (!keep) { setPhase('idle'); return; }
      if (!heard) { setPhase('idle'); setError('no-speech'); return; }
      setPhase('transcribing');
      const audio = await resample(chunks, rate);
      const id = ++reqId.current;
      const copy = new Float32Array(audio);
      send({ type: 'transcribe', id, audio: copy, language: lang.startsWith('fil') ? 'tagalog' : 'english' }, [copy.buffer]);
    };

    proc.onaudioprocess = e => {
      const data = new Float32Array(e.inputBuffer.getChannelData(0));
      chunks.push(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
      const rms = Math.sqrt(sum / data.length);
      // Measure background noise from the first moment, capped so early speech doesn't count as noise
      if (frames++ < 3) floor = Math.max(floor, Math.min(rms, 0.02));
      const now = performance.now();
      if (rms > Math.max(0.015, floor * 2.5)) { heard = true; lastLoud = now; }
      if ((heard && now - lastLoud > SILENCE_MS) || (!heard && now - t0 > NO_SPEECH_MS) || now - t0 > MAX_MS) finish(true);
    };
    src.connect(proc);
    proc.connect(ctx.destination);
    recRef.current = { finish };
    setPhase('listening');
  }, [lang]);

  const stop = useCallback(() => recRef.current?.finish(true), []);

  return {
    supported,
    phase,
    loadPct,
    listening: phase === 'listening',
    busy: phase === 'loading' || phase === 'transcribing',
    interim: '',
    error,
    prepare,
    start,
    stop,
    clearError: () => setError(null),
  };
}
