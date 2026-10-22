import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, display, ease, mono, sans } from '../brand';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Spring that starts at `at` (frames). damping ~ 12 bouncy, 200 smooth
export function useSpring(at: number, damping = 14, stiffness = 140, mass = 0.8) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass } });
}

export function useRamp(from: number, to: number, easing = ease) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing });
}

export const shot = (name: string) => staticFile(`shots/${name}.png`);

// Desktop browser window holding a real 1440x900 screenshot
export function BrowserFrame({ src, width = 1440, style }: { src: string; width?: number; style?: React.CSSProperties }) {
  const scale = width / 1440;
  const bar = 44 * scale;
  return (
    <div
      style={{
        width,
        borderRadius: 22 * scale,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 50px 120px -40px rgba(14,14,16,.45), 0 0 0 1px rgba(14,14,16,.06)',
        ...style,
      }}
    >
      <div style={{ height: bar, background: C.soft, display: 'flex', alignItems: 'center', gap: 8 * scale, padding: `0 ${18 * scale}px`, borderBottom: `1px solid ${C.hair}` }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
          <span key={c} style={{ width: 13 * scale, height: 13 * scale, borderRadius: 99, background: c }} />
        ))}
        <span
          style={{
            margin: '0 auto',
            height: 26 * scale,
            padding: `0 ${18 * scale}px`,
            borderRadius: 99,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 8 * scale,
            fontFamily: sans,
            fontSize: 14 * scale,
            fontWeight: 500,
            color: C.muted,
          }}
        >
          <LockIcon size={12 * scale} /> BaonBuddy
        </span>
      </div>
      <Img src={src} style={{ width, height: width * 900 / 1440, display: 'block' }} />
    </div>
  );
}

// Phone with a real 390x844 screenshot
export function PhoneFrame({ src, height = 760, style }: { src: string; height?: number; style?: React.CSSProperties }) {
  const w = height * 390 / 844;
  const pad = height * 0.018;
  return (
    <div
      style={{
        width: w + pad * 2,
        height: height + pad * 2,
        padding: pad,
        borderRadius: height * 0.085,
        background: C.ink,
        boxShadow: '0 60px 120px -40px rgba(14,14,16,.6), inset 0 0 0 2px #2a2a30',
        position: 'relative',
        ...style,
      }}
    >
      <div style={{ width: w, height, borderRadius: height * 0.07, overflow: 'hidden', position: 'relative', background: '#fff' }}>
        <Img src={src} style={{ width: w, display: 'block' }} />
        <div style={{ position: 'absolute', top: height * 0.012, left: '50%', transform: 'translateX(-50%)', width: w * 0.3, height: height * 0.036, borderRadius: 99, background: C.ink }} />
      </div>
    </div>
  );
}

// Transparent-cornered crop of a single card (2x screenshot)
export function Card({ name, width, style }: { name: string; width: number; style?: React.CSSProperties }) {
  return (
    <Img
      src={shot(name)}
      style={{ width, display: 'block', borderRadius: width * 0.045, boxShadow: '0 40px 90px -36px rgba(14,14,16,.45)', ...style }}
    />
  );
}

// Words rise out of a mask one after another
export function Kinetic({
  text,
  at,
  size = 120,
  color = C.ink,
  stagger = 3,
  weight = 800,
  font = display,
  align = 'left',
  highlight,
  style,
}: {
  text: string;
  at: number;
  size?: number;
  color?: string;
  stagger?: number;
  weight?: number;
  font?: string;
  align?: 'left' | 'center';
  highlight?: { word: string; bg: string; fg?: string };
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: '-0.045em',
        color,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.24,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame, [at + i * stagger, at + i * stagger + 14], [0, 1], { ...clamp, easing: ease });
        const hl = highlight && w.replace(/[.,!?]/g, '') === highlight.word;
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`,
                transformOrigin: 'left bottom',
                ...(hl
                  ? { background: highlight.bg, color: highlight.fg ?? C.ink, padding: `0 ${size * 0.12}px`, borderRadius: size * 0.18, transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6 - 2}deg)` }
                  : null),
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Eyebrow({ children, color = C.muted, style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: mono, fontWeight: 500, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color, ...style }}>{children}</div>
  );
}

export function Chip({ children, bg = '#fff', fg = C.ink, style }: { children: React.ReactNode; bg?: string; fg?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 64,
        padding: '0 28px',
        borderRadius: 99,
        background: bg,
        color: fg,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 28,
        whiteSpace: 'nowrap',
        boxShadow: '0 20px 40px -20px rgba(14,14,16,.35)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Dot grid backdrop that drifts slowly
export function DotGrid({ color = 'rgba(14,14,16,.09)', gap = 44, drift = 0.4 }: { color?: string; gap?: number; drift?: number }) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        inset: -gap,
        backgroundImage: `radial-gradient(${color} 2px, transparent 2.5px)`,
        backgroundSize: `${gap}px ${gap}px`,
        transform: `translate(${(frame * drift) % gap}px, ${(frame * drift * 0.6) % gap}px)`,
      }}
    />
  );
}

// Radial confetti of brand shapes
export function Burst({ at, count = 18, radius = 620, x = 960, y = 540, seed = 1 }: { at: number; count?: number; radius?: number; x?: number; y?: number; seed?: number }) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 40) return null;
  const colors = [C.lime, C.pink, C.sky, C.peach, C.lavender, C.mint, C.cobalt];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + seed;
        const r = interpolate(t, [0, 28], [0, radius * (0.7 + ((i * 37 + seed) % 10) / 25)], { ...clamp, easing: ease });
        const s = interpolate(t, [0, 6, 40], [0, 1, 0], clamp);
        const shape = i % 3;
        const sz = 22 + ((i * 13) % 26);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * r - sz / 2,
              top: y + Math.sin(a) * r - sz / 2,
              width: sz,
              height: sz,
              background: shape === 2 ? 'transparent' : colors[i % colors.length],
              border: shape === 2 ? `5px solid ${colors[i % colors.length]}` : undefined,
              borderRadius: shape === 1 ? 6 : 99,
              transform: `scale(${s}) rotate(${t * 9 + i * 20}deg)`,
            }}
          />
        );
      })}
    </>
  );
}

export function LockIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

// Lucide-style icons used in the video (paths from lucide, MIT)
export const ICONS: Record<string, string[]> = {
  cloud: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
  mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  scan: ['M3 7V5a2 2 0 0 1 2-2h2', 'M17 3h2a2 2 0 0 1 2 2v2', 'M21 17v2a2 2 0 0 1-2 2h-2', 'M7 21H5a2 2 0 0 1-2-2v-2', 'M7 12h10'],
  chat: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  pen: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
  wifiOff: ['M12 20h.01', 'M8.5 16.43a5 5 0 0 1 7 0', 'M2 8.82a15 15 0 0 1 4.17-2.65', 'M10.66 5c4.01-.36 8.14.9 11.34 3.76', 'M16.85 11.25a10 10 0 0 1 2.22 1.68', 'M5 13a10 10 0 0 1 5.24-2.76', 'M2 2l20 20'],
  cpu: ['M12 20v2', 'M12 2v2', 'M17 20v2', 'M17 2v2', 'M2 12h2', 'M2 17h2', 'M2 7h2', 'M20 12h2', 'M20 17h2', 'M20 7h2', 'M7 20v2', 'M7 2v2', 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z', 'M8 8h8v8H8z'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z'],
  search: ['M11 3a8 8 0 1 1 0 16 8 8 0 0 1 0-16z', 'm21 21-4.3-4.3'],
  split: ['M16 3h5v5', 'M8 3H3v5', 'M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3', 'm15 9 6-6'],
  sparkles: ['M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'],
};

export function Icon({ name, size = 32, color = 'currentColor', stroke = 2.3, draw = 1 }: { name: string; size?: number; color?: string; stroke?: number; draw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      ))}
    </svg>
  );
}

// Counts a number up between frames, formatted as pesos
export function Count({ to, from = 0, at, dur = 30, decimals = 0, style }: { to: number; from?: number; at: number; dur?: number; decimals?: number; style?: React.CSSProperties }) {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [from, to], { ...clamp, easing: ease });
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{v.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

// Full-frame wipe in a brand color, used between scenes
export function Wipe({ at, color = C.cobalt, dir = 1 }: { at: number; color?: string; dir?: 1 | -1 }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9, at + 18], [0, 1, 2], clamp);
  if (p <= 0 || p >= 2) return null;
  const x = p <= 1 ? (1 - easeOut(p)) * 100 : -easeIn2(p - 1) * 100;
  return <div style={{ position: 'absolute', inset: 0, background: color, transform: `translateX(${x * dir}%) skewX(${-8 * dir}deg) scaleX(1.2)`, zIndex: 50 }} />;
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn2 = (t: number) => t * t * t;
