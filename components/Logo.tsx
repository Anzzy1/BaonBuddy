// BaonBuddy mark: Buddy from the chest up in school uniform (same drawing as the Mascot)
export function BuddyBust({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="8 19 84 84" className={className} aria-hidden="true">
      {/* School polo, backpack straps and ID lace so Buddy reads as a student */}
      <path d="M16 104 C16 82 31 73 50 73 C69 73 84 82 84 104 Z" fill="#fff" stroke="#0E0E10" strokeWidth="2.5" />
      <path d="M27 79 C24 88 23 96 23 104" fill="none" stroke="#0E0E10" strokeWidth="7" strokeLinecap="round" />
      <path d="M27 79 C24 88 23 96 23 104" fill="none" stroke="#FFB98F" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M73 79 C76 88 77 96 77 104" fill="none" stroke="#0E0E10" strokeWidth="7" strokeLinecap="round" />
      <path d="M73 79 C76 88 77 96 77 104" fill="none" stroke="#FFB98F" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M37 75 L50 83 L43 90 Z M63 75 L50 83 L57 90 Z" fill="#3A4BFF" stroke="#0E0E10" strokeWidth="2" strokeLinejoin="round" />
      <path d="M41 82 L48 95 M59 82 L52 95" stroke="#FFA3CB" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="43.5" y="93" width="13" height="10" rx="2" fill="#0E0E10" />
      <rect x="46" y="96" width="8" height="2" rx="1" fill="#fff" />
      <rect x="45" y="60" width="10" height="15" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
      <circle cx="29" cy="47" r="4.5" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
      <circle cx="71" cy="47" r="4.5" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
      <circle cx="50" cy="45" r="21" fill="#E9B48C" stroke="#0E0E10" strokeWidth="2.5" />
      <path
        d="M28 45 C25 27 37 18 51 18 C66 18 76 28 72 45 C68 37 62 33 56 35 C51 30 42 34 38 31 C36 37 32 40 28 45 Z"
        fill="#1B1B22" stroke="#0E0E10" strokeWidth="2.5" strokeLinejoin="round"
      />
      <ellipse cx="42" cy="47" rx="2.5" ry="3.2" fill="#0E0E10" />
      <ellipse cx="58" cy="47" rx="2.5" ry="3.2" fill="#0E0E10" />
      <circle cx="37" cy="53.5" r="3.4" fill="#FFA3CB" opacity=".85" />
      <circle cx="63" cy="53.5" r="3.4" fill="#FFA3CB" opacity=".85" />
      <path d="M45 55 Q50 60.5 55 55" fill="none" stroke="#0E0E10" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-10 h-10 rounded-[14px] bg-[var(--lime)] overflow-hidden -rotate-6 shrink-0 ${className}`}
      role="img"
      aria-label="BaonBuddy"
    >
      <BuddyBust className="block w-full h-full" />
    </div>
  );
}
