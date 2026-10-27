'use client';

import { AvatarArt, parseAvatar } from '@/components/Avatar';

// Buddy, the student budget buddy. Waves while a reply is being generated
// and moves the mouth while the reply types out. With `avatar`, Buddy takes the
// look of the student's chosen profile avatar.
export default function Mascot({ waving = false, talking = false, size = 64, avatar }: { waving?: boolean; talking?: boolean; size?: number; avatar?: string }) {
  if (avatar) {
    return (
      <span
        className={`mascot is-avatar ${waving ? 'is-waving' : ''} ${talking ? 'is-talking' : ''}`}
        style={{ width: size, height: size, borderRadius: size * 0.31, background: parseAvatar(avatar).preset.bg }}
        aria-hidden="true"
      >
        <AvatarArt id={avatar} animated />
      </span>
    );
  }
  return (
    <span
      className={`mascot ${waving ? 'is-waving' : ''} ${talking ? 'is-talking' : ''}`}
      style={{ width: size, height: size, borderRadius: size * 0.31 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        {/* Body: white school polo with cobalt collar and ID lace */}
        <g className="m-body">
          <path d="M16 104 C16 82 31 73 50 73 C69 73 84 82 84 104 Z" fill="#fff" stroke="#0E0E10" strokeWidth="2.5" />
          <path d="M37 75 L50 83 L43 90 Z M63 75 L50 83 L57 90 Z" fill="var(--cobalt)" stroke="#0E0E10" strokeWidth="2" strokeLinejoin="round" />
          <path d="M41 82 L48 97 M59 82 L52 97" stroke="var(--pink)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="44.5" y="94" width="11" height="9" rx="2" fill="#0E0E10" />
        </g>

        {/* Waving arm: hidden below the frame until waving */}
        <g className="m-arm-wrap">
          <g className="m-arm">
            <path d="M72 92 L80 66" stroke="#0E0E10" strokeWidth="10" strokeLinecap="round" />
            <path d="M72 92 L80 66" stroke="#E9B48C" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke="#0E0E10" strokeWidth="13" strokeLinecap="round" />
            <path d="M70 99 L76 86" stroke="#fff" strokeWidth="8.5" strokeLinecap="round" />
            <circle cx="81" cy="61" r="6.5" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
            <path d="M77 57 L76 53 M81 55 L81 51 M85 57 L86 53" stroke="#0E0E10" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* Head */}
        <g className="m-head">
          <rect x="45" y="60" width="10" height="15" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
          <circle cx="29" cy="47" r="4.5" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
          <circle cx="71" cy="47" r="4.5" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
          <circle cx="50" cy="45" r="21" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
          <path
            d="M28 45 C25 27 37 18 51 18 C66 18 76 28 72 45 C68 37 62 33 56 35 C51 30 42 34 38 31 C36 37 32 40 28 45 Z"
            fill="#1B1B22" stroke="#0E0E10" strokeWidth="2.5" strokeLinejoin="round"
          />
          <g className="m-eyes">
            <ellipse cx="42" cy="47" rx="2.5" ry="3.2" fill="#0E0E10" />
            <ellipse cx="58" cy="47" rx="2.5" ry="3.2" fill="#0E0E10" />
          </g>
          <circle cx="37" cy="53.5" r="3.4" fill="var(--pink)" opacity=".85" />
          <circle cx="63" cy="53.5" r="3.4" fill="var(--pink)" opacity=".85" />
          <path className="m-smile" d="M45 55 Q50 60.5 55 55" fill="none" stroke="#0E0E10" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse className="m-talk" cx="50" cy="57" rx="3.6" ry="3" fill="#0E0E10" />
        </g>
      </svg>
    </span>
  );
}
