import { interpolate, useCurrentFrame } from 'remotion';
import { C } from '../brand';

// Buddy, drawn exactly like components/Mascot.tsx in the app, but animated
// from the video frame instead of CSS so it renders deterministically.
export function Buddy({
  size = 400,
  wave = false,
  talk = false,
  bg = C.lime,
  radius = 0.31,
  delay = 0,
}: {
  size?: number;
  wave?: boolean;
  talk?: boolean;
  bg?: string | null;
  radius?: number;
  delay?: number;
}) {
  const f = useCurrentFrame() - delay;
  const bob = Math.sin(f / 16) * 1.5;
  const blink = f % 110 > 104 ? 0.12 : 1;
  const armUp = wave ? interpolate(f, [0, 10], [42, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 42;
  const armRot = wave ? Math.sin(f / 4.3) * 15 : 0;
  const headTilt = wave ? Math.sin(f / 4.3) * 3.5 : 0;
  const mouth = talk ? 0.35 + Math.abs(Math.sin(f / 2.6)) * 0.8 : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * radius,
        overflow: 'hidden',
        background: bg ?? 'transparent',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible' }}>
        <g>
          <path d="M16 104 C16 82 31 73 50 73 C69 73 84 82 84 104 Z" fill="#fff" stroke={C.ink} strokeWidth="2.5" />
          <path d="M27 79 C24 88 23 96 23 104" fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
          <path d="M27 79 C24 88 23 96 23 104" fill="none" stroke={C.peach} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M37 75 L50 83 L43 90 Z M63 75 L50 83 L57 90 Z" fill={C.cobalt} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M41 82 L48 97 M59 82 L52 97" stroke={C.pink} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="44.5" y="94" width="11" height="9" rx="2" fill={C.ink} />
        </g>
        <g transform={`translate(0 ${armUp})`}>
          <g transform={`rotate(${armRot} 72 96)`}>
            <path d="M72 92 L80 66" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
            <path d="M72 92 L80 66" stroke={C.skin} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke={C.ink} strokeWidth="13" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke="#fff" strokeWidth="8.5" strokeLinecap="round" />
            <circle cx="81" cy="61" r="6.5" fill={C.skin} stroke={C.ink} strokeWidth="2.5" />
            <path d="M77 57 L76 53 M81 55 L81 51 M85 57 L86 53" stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
        <g transform={`translate(0 ${bob}) rotate(${headTilt} 50 75)`}>
          <rect x="45" y="60" width="10" height="15" fill={C.skin} stroke={C.ink} strokeWidth="2.5" />
          <circle cx="29" cy="47" r="4.5" fill={C.skin} stroke={C.ink} strokeWidth="2.5" />
          <circle cx="71" cy="47" r="4.5" fill={C.skin} stroke={C.ink} strokeWidth="2.5" />
          <circle cx="50" cy="45" r="21" fill={C.skin} stroke={C.ink} strokeWidth="2.5" />
          <path
            d="M28 45 C25 27 37 18 51 18 C66 18 76 28 72 45 C68 37 62 33 56 35 C51 30 42 34 38 31 C36 37 32 40 28 45 Z"
            fill="#1B1B22"
            stroke={C.ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <g transform={`translate(0 ${47 * (1 - blink)}) scale(1 ${blink})`}>
            <ellipse cx="42" cy="47" rx="2.5" ry="3.2" fill={C.ink} />
            <ellipse cx="58" cy="47" rx="2.5" ry="3.2" fill={C.ink} />
          </g>
          <circle cx="37" cy="53.5" r="3.4" fill={C.pink} opacity=".85" />
          <circle cx="63" cy="53.5" r="3.4" fill={C.pink} opacity=".85" />
          {talk ? (
            <ellipse cx="50" cy="57" rx="3.6" ry={3 * mouth} fill={C.ink} />
          ) : (
            <path d="M45 55 Q50 60.5 55 55" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
}
