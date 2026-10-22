import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeIn, mono } from '../brand';
import { Buddy } from '../components/Buddy';
import { BrowserFrame, Burst, clamp, PhoneFrame, shot, useSpring } from '../components/ui';

// 48-60 s (360 frames). Drop at 0. VO from local 60: "BaonBuddy. (61-89) Budget mo... (105-131) kontrolado mo. (145-176)"
// Final chord at local 240.
const ROWS = [
  ['overview', 'log-chat', 'manage', 'calculator', 'advisor', 'log-scan'],
  ['advisor', 'log-voice', 'overview', 'log-manual', 'manage', 'log-chat'],
  ['calculator', 'log-scan', 'advisor', 'overview', 'log-voice', 'manage'],
];

export function Outro() {
  const f = useCurrentFrame();
  const dim = interpolate(f, [48, 62], [0, 1], { ...clamp, easing: ease });
  const logo = useSpring(61, 11, 170);
  const END = 200;
  const reveal = interpolate(f, [END, END + 18], [0, 1], { ...clamp, easing: easeIn });
  const endLogo = useSpring(END + 8, 13, 150);
  const chord = f >= 240 ? 1 + 0.04 * Math.exp(-(f - 240) / 5) * Math.cos((f - 240) / 2) : 1;
  const fadeOut = interpolate(f, [338, 358], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.lime, overflow: 'hidden' }}>
      {/* Screen wall */}
      <AbsoluteFill style={{ transform: `rotate(-10deg) scale(${1.35 + dim * 0.1})`, filter: `blur(${dim * 6}px)` }}>
        {ROWS.map((row, r) => {
          const dir = r % 2 ? 1 : -1;
          const x = dir * (f * 9) - 1400 + r * 220;
          return (
            <div key={r} style={{ position: 'absolute', top: -120 + r * 470, left: x, display: 'flex', gap: 44 }}>
              {[...row, ...row].map((s, i) =>
                i % 4 === 1 ? (
                  <PhoneFrame key={i} src={shot(`m-${['overview', 'log', 'manage', 'advisor'][(i + r) % 4]}`)} height={420} />
                ) : (
                  <BrowserFrame key={i} src={shot(s)} width={680} />
                ),
              )}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.ink, opacity: dim * 0.72 }} />

      {/* Center lockup over the wall */}
      {f >= 58 && f < END + 20 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - reveal }}>
          <Burst at={61} count={20} radius={700} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 44, transform: `scale(${interpolate(logo, [0, 1], [1.8, 1])})`, opacity: Math.min(1, logo * 2) }}>
            <div style={{ transform: 'rotate(-6deg)' }}>
              <Buddy size={220} />
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 170, letterSpacing: '-0.06em', color: '#fff' }}>
              Baon<span style={{ color: C.lime }}>Buddy</span>
            </div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 26, fontFamily: display, fontWeight: 800, fontSize: 80, letterSpacing: '-0.04em', color: '#fff' }}>
            <span style={{ opacity: interpolate(f, [105, 113], [0, 1], clamp), transform: `translateY(${interpolate(f, [105, 115], [40, 0], { ...clamp, easing: ease })}px)` }}>Budget mo,</span>
            <span
              style={{
                opacity: interpolate(f, [145, 153], [0, 1], clamp),
                transform: `translateY(${interpolate(f, [145, 155], [40, 0], { ...clamp, easing: ease })}px) rotate(-2deg)`,
                background: C.lime,
                color: C.ink,
                padding: '0 22px',
                borderRadius: 22,
              }}
            >
              kontrolado mo.
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* End card: white circle reveal */}
      {f >= END && (
        <AbsoluteFill style={{ background: '#fff', clipPath: `circle(${reveal * 1200}px at 960px 540px)` }}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${chord})` }}>
            <div style={{ transform: `scale(${endLogo}) rotate(-6deg)`, boxShadow: '0 40px 90px -30px rgba(58,75,255,.5)', borderRadius: 200 * 0.31 }}>
              <Buddy size={200} wave={f > END + 20 && f < END + 80} />
            </div>
            <div style={{ marginTop: 40, fontFamily: display, fontWeight: 800, fontSize: 150, letterSpacing: '-0.06em', color: C.ink, lineHeight: 1, opacity: Math.min(1, endLogo * 1.4) }}>
              Baon<span style={{ color: C.cobalt }}>Buddy</span>
            </div>
            <div style={{ marginTop: 24, fontFamily: mono, fontSize: 28, letterSpacing: '0.22em', color: C.muted, opacity: interpolate(f, [END + 22, END + 32], [0, 1], clamp) }}>
              BUDGET MO, KONTROLADO MO.
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 56 }}>
              {[
                ['Offline-first', C.lime],
                ['Private by design', C.sky],
                ['Made for estudyantes', C.pink],
              ].map(([t, bg], i) => {
                const p = Math.min(1, Math.max(0, (f - END - 34 - i * 5) / 8));
                return (
                  <div key={t} style={{ padding: '16px 28px', borderRadius: 99, background: bg, fontFamily: mono, fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.ink, transform: `scale(${p})` }}>
                    {t}
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: '#fff', opacity: fadeOut }} />
    </AbsoluteFill>
  );
}
