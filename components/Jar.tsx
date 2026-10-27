// Savings jar that fills to `pct`. Coins stack inside once it's past a third.
export default function Jar({ pct, size = 56 }: { pct: number; size?: number }) {
  const p = Math.max(0, Math.min(100, pct));
  // Inner jar body spans y=22..74 in the viewBox
  const top = 74 - (52 * p) / 100;
  const id = `jar${Math.round(p)}-${size}`;
  return (
    <svg viewBox="0 0 64 80" width={size} height={size * 1.25} className="jar" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d="M14 22 C10 26 9 32 9 40 L9 66 C9 72 13 76 19 76 L45 76 C51 76 55 72 55 66 L55 40 C55 32 54 26 50 22 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y={top} width="64" height="80" className="jar-fill" />
        {p > 33 && (
          <g className="jar-coins">
            <ellipse cx="24" cy="70" rx="7" ry="2.6" />
            <ellipse cx="38" cy="71" rx="7" ry="2.6" />
            <ellipse cx="31" cy="66" rx="7" ry="2.6" />
          </g>
        )}
        <path d={`M0 ${top} Q16 ${top - 3} 32 ${top} T64 ${top}`} className="jar-wave" />
      </g>
      <path d="M14 22 C10 26 9 32 9 40 L9 66 C9 72 13 76 19 76 L45 76 C51 76 55 72 55 66 L55 40 C55 32 54 26 50 22 Z" className="jar-glass" />
      <rect x="16" y="12" width="32" height="10" rx="3" className="jar-lid" />
      <path d="M17 34 L17 58" className="jar-shine" />
    </svg>
  );
}
