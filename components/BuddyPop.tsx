'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import Mascot from '@/components/Mascot';

// Buddy pops in after every new log and reacts to it, typing the message out
export default function BuddyPop({ msg, avatar, onClose, onChat }: { msg: { text: string; key: number } | null; avatar?: string; onClose: () => void; onChat: () => void }) {
  const [shown, setShown] = useState('');
  const [hover, setHover] = useState(false);
  const text = msg?.text ?? '';
  const typing = shown.length < text.length;

  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text, msg?.key]);

  // Auto-hide a while after typing finishes, unless the pointer is on it
  useEffect(() => {
    if (!msg || typing || hover) return;
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [msg, typing, hover, onClose]);

  return (
    <div
      className={`buddy-pop ${msg ? 'show' : ''}`}
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Mascot size={56} waving={!!msg && typing && shown.length < 12} talking={typing} avatar={avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-extrabold text-[15px] tracking-tight leading-none">Buddy</p>
          <button type="button" className="buddy-pop-x" onClick={onClose} aria-label="Dismiss">
            <Icon name="x" />
          </button>
        </div>
        <p className="buddy-pop-msg">
          {shown}
          {typing && <span className="inline-block w-[2px] h-[14px] ml-0.5 align-middle animate-pulse bg-[var(--lime)]" />}
        </p>
        <button type="button" className="buddy-cta !mt-3 !h-9 !text-[13px]" onClick={onChat}>
          <Icon name="send" />
          Chat with Buddy
        </button>
      </div>
    </div>
  );
}
