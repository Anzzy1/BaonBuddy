// Student avatars, drawn in the same flat, outlined style as Buddy.
// An avatar id is a preset ("migs") with an optional skin tone override ("migs~2").

const INK = '#0E0E10';
export const SKINS = ['#F7D7BC', '#E9B48C', '#C98E63', '#8A5A3C'];

type Hair = 'short' | 'spiky' | 'buzz' | 'curly' | 'long' | 'ponytail' | 'bob' | 'hijab';
type Body = 'polo' | 'blouse' | 'hoodie';

interface Preset {
  id: string;
  name: string;
  skin: number;
  hair: Hair;
  hc: string;
  body: Body;
  accent: string;
  bg: string;
  glasses?: boolean;
  lashes?: boolean;
}

export const AVATARS: Preset[] = [
  { id: 'migs', name: 'Migs', skin: 1, hair: 'short', hc: '#1B1B22', body: 'polo', accent: '#3A4BFF', bg: '#D7F25C' },
  { id: 'andeng', name: 'Andeng', skin: 0, hair: 'long', hc: '#1B1B22', body: 'blouse', accent: '#E5484D', bg: '#FFC2DC', lashes: true },
  { id: 'jun', name: 'Jun', skin: 2, hair: 'spiky', hc: '#1B1B22', body: 'hoodie', accent: '#FF8A3D', bg: '#B8E2FF' },
  { id: 'bea', name: 'Bea', skin: 1, hair: 'ponytail', hc: '#4A2C1D', body: 'blouse', accent: '#3A4BFF', bg: '#FFCFB0', lashes: true },
  { id: 'paolo', name: 'Paolo', skin: 3, hair: 'curly', hc: '#1B1B22', body: 'polo', accent: '#16A34A', bg: '#BDF0D4' },
  { id: 'kat', name: 'Kat', skin: 0, hair: 'bob', hc: '#2A1A12', body: 'hoodie', accent: '#7C55FA', bg: '#DCD0FF', glasses: true, lashes: true },
  { id: 'amira', name: 'Amira', skin: 1, hair: 'hijab', hc: '#1FA39A', body: 'blouse', accent: '#1FA39A', bg: '#FFE7A0', lashes: true },
  { id: 'rafa', name: 'Rafa', skin: 2, hair: 'buzz', hc: '#1B1B22', body: 'polo', accent: '#E14AD6', bg: '#D5F1FF', glasses: true },
];

export function parseAvatar(id?: string) {
  const [base, tone] = (id || '').split('~');
  const preset = AVATARS.find(a => a.id === base) || AVATARS[0];
  const t = Number(tone);
  return { preset, tone: Number.isInteger(t) && SKINS[t] ? t : preset.skin };
}

export const avatarId = (base: string, tone: number) => {
  const p = AVATARS.find(a => a.id === base) || AVATARS[0];
  return tone === p.skin ? p.id : `${p.id}~${tone}`;
};

const s = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const };

// Hair drawn behind the head (long styles) and in front of it (fringe, top)
const HAIR: Record<Hair, { back?: string; front?: string }> = {
  short: { front: 'M28 45 C25 27 37 18 51 18 C66 18 76 28 72 45 C68 37 62 33 56 35 C51 30 42 34 38 31 C36 37 32 40 28 45 Z' },
  spiky: { front: 'M28 44 C27 33 31 26 36 23 L35 15 L43 20 L47 11 L53 19 L60 13 L61 21 L68 19 C73 26 74 35 72 44 C68 36 62 32 56 33 C50 30 42 33 38 31 C35 36 31 40 28 44 Z' },
  buzz: { front: 'M29 41 C29 28 38 22 50 22 C62 22 71 28 71 41 C67 34 59 31 50 31 C41 31 33 34 29 41 Z' },
  curly: {},
  long: {
    back: 'M27 46 C23 28 36 19 50 19 C64 19 77 28 73 46 L77 82 C70 86 62 84 60 80 L40 80 C38 84 30 86 23 82 Z',
    front: 'M29 45 C27 30 37 21 50 21 C63 21 73 30 71 45 C69 38 66 33 62 30 C56 36 44 38 33 36 C31 39 30 42 29 45 Z',
  },
  ponytail: {
    back: 'M66 28 C82 26 88 46 82 66 C79 57 74 50 69 46 Z',
    front: 'M29 44 C27 29 37 21 50 21 C63 21 73 29 71 44 C66 36 58 31 48 31 C40 31 33 36 29 44 Z',
  },
  bob: {
    back: 'M26 50 C23 30 36 20 50 20 C64 20 77 30 74 50 L75 64 C70 67 64 66 62 62 L38 62 C36 66 30 67 25 64 Z',
    front: 'M29 42 C29 29 38 22 50 22 C62 22 71 29 71 42 C67 39 63 38 60 39 C56 37 52 38 50 39 C47 37 42 37 39 39 C36 38 32 39 29 42 Z',
  },
  hijab: {
    back: 'M23 52 C21 28 35 17 50 17 C65 17 79 28 77 52 C77 72 66 86 50 87 C34 86 23 72 23 52 Z',
    front: 'M28 47 C28 31 37 23 50 23 C63 23 72 31 72 47 C70 35 62 28 50 28 C38 28 30 35 28 47 Z',
  },
};

const CURLS: [number, number, number][] = [[31, 39, 7], [36, 29, 8], [45, 23, 8.5], [56, 23, 8.5], [64, 29, 8], [69, 39, 7]];

// `animated` adds Buddy's moving parts (bobbing head, blink, waving arm, talking mouth).
// They only move inside a `.mascot` wrapper, which is how <Mascot avatar=...> uses it.
export function AvatarArt({ id, animated = false }: { id?: string; animated?: boolean }) {
  const { preset: p, tone } = parseAvatar(id);
  const skin = SKINS[tone];
  const hair = HAIR[p.hair];
  const hijab = p.hair === 'hijab';
  const shirt = p.body === 'hoodie' ? p.accent : '#fff';
  return (
    <svg viewBox="7 10 86 86" aria-hidden="true">
      {hair.back && <g className="m-head"><path d={hair.back} fill={p.hc} {...s} /></g>}

      {/* Uniform */}
      <path d="M14 104 C14 82 30 72 50 72 C70 72 86 82 86 104 Z" fill={shirt} {...s} />
      {p.body === 'polo' && (
        <>
          <path d="M37 74 L50 82 L43 89 Z M63 74 L50 82 L57 89 Z" fill={p.accent} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M41 82 L48 95 M59 82 L52 95" stroke="#FFA3CB" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="43.5" y="93" width="13" height="10" rx="2" fill={INK} />
        </>
      )}
      {p.body === 'blouse' && (
        <>
          <path d="M38 74 C42 80 46 82 50 82 C54 82 58 80 62 74" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M50 83 L40 78 L41 89 Z M50 83 L60 78 L59 89 Z" fill={p.accent} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="83" r="3" fill={p.accent} stroke={INK} strokeWidth="2" />
        </>
      )}
      {p.body === 'hoodie' && (
        <>
          <path d="M33 76 C38 86 62 86 67 76" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M44 84 L43 96 M56 84 L57 96" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Waving arm, tucked below the frame until the wrapper is .is-waving */}
      {animated && (
        <g className="m-arm-wrap">
          <g className="m-arm">
            <path d="M72 92 L80 66" stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <path d="M72 92 L80 66" stroke={skin} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke={INK} strokeWidth="13" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke={shirt} strokeWidth="8.5" strokeLinecap="round" />
            <circle cx="81" cy="61" r="6.5" fill={skin} stroke={INK} strokeWidth="2.5" />
            <path d="M77 57 L76 53 M81 55 L81 51 M85 57 L86 53" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}

      <g className="m-head">
      {/* Neck and ears (a hijab covers both) */}
      {!hijab && (
        <>
          <rect x="45" y="60" width="10" height="15" fill={skin} {...s} />
          <circle cx="29" cy="47" r="4.5" fill={skin} {...s} />
          <circle cx="71" cy="47" r="4.5" fill={skin} {...s} />
        </>
      )}

      <circle cx="50" cy="45" r="21" fill={skin} {...s} />

      {/* Curly hair: outline pass, then a fill pass that hides the inner strokes */}
      {p.hair === 'curly' && (
        <>
          {CURLS.map(([x, y, r], i) => <circle key={`o${i}`} cx={x} cy={y} r={r} fill={p.hc} stroke={INK} strokeWidth="5" />)}
          {CURLS.map(([x, y, r], i) => <circle key={`f${i}`} cx={x} cy={y} r={r} fill={p.hc} />)}
        </>
      )}
      {hair.front && <path d={hair.front} fill={p.hc} {...s} />}

      {/* Face */}
      <g className="m-eyes">
        <ellipse cx="42" cy="47.5" rx="2.5" ry="3.2" fill={INK} />
        <ellipse cx="58" cy="47.5" rx="2.5" ry="3.2" fill={INK} />
        {p.lashes && <path d="M39.6 45 L37.4 43.4 M60.4 45 L62.6 43.4" stroke={INK} strokeWidth="2" strokeLinecap="round" />}
      </g>
      {p.glasses && (
        <g fill="rgba(255,255,255,.28)" stroke={INK} strokeWidth="2">
          <circle cx="42" cy="47.5" r="6" />
          <circle cx="58" cy="47.5" r="6" />
          <path d="M48 47 L52 47" />
        </g>
      )}
      <circle cx="36.5" cy="54" r="3.4" fill="#FF8FB8" opacity=".6" />
      <circle cx="63.5" cy="54" r="3.4" fill="#FF8FB8" opacity=".6" />
      <path className="m-smile" d="M45 55.5 Q50 61 55 55.5" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      {animated && <ellipse className="m-talk" cx="50" cy="57.5" rx="3.6" ry="3" fill={INK} />}
      </g>
    </svg>
  );
}

export default function Avatar({ id, size = 40, className = '' }: { id?: string; size?: number; className?: string }) {
  const { preset } = parseAvatar(id);
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size, background: preset.bg }} aria-hidden="true">
      <AvatarArt id={id} />
    </span>
  );
}
