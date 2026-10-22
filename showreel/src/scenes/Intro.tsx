import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeIn, mono } from '../brand';
import { Buddy } from '../components/Buddy';
import { Burst, clamp, Kinetic, useSpring } from '../components/ui';

// 0-6 s. VO: "This is your baon. (24-66) And this... (80-105) is BaonBuddy. (113-143)"
// Beat drop and logo slam at frame 120.
export function Intro() {
  const f = useCurrentFrame();
  const DROP = 120;

  // Part 1: dark cold open
  const textOut = interpolate(f, [72, 84], [0, 1], { ...clamp, easing: easeIn });
  const coins = [0, 1, 2].map(i => {
    const at = 40 + i * 6;
    const y = interpolate(f, [at, at + 12], [-500, 0], { ...clamp, easing: ease });
    const bounce = f > at + 12 ? Math.sin((f - at - 12) / 3) * Math.exp(-(f - at - 12) / 6) * 18 : 0;
    return { y: y - bounce, x: (i - 1) * 150, r: (i - 1) * 14 };
  });

  // Tunnel rings converge into the drop
  const rings = [0, 1, 2, 3, 4, 5].map(i => {
    const s = interpolate(f, [86 + i * 3, DROP], [3.2, 0], { ...clamp, easing: easeIn });
    return { s, color: [C.cobalt, C.lime, C.pink, C.sky, C.lavender, C.peach][i] };
  });

  // Part 2: logo
  const flash = interpolate(f, [DROP, DROP + 8], [1, 0], clamp);
  const logo = useSpring(DROP, 11, 170);
  const word = 'BaonBuddy'.split('');
  const exit = interpolate(f, [164, 180], [0, 1], { ...clamp, easing: easeIn });

  return (
    <AbsoluteFill style={{ background: f < DROP ? C.ink : '#fff', overflow: 'hidden' }}>
      {f < DROP && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* pulse dot on the beat before the VO starts */}
          {f < 24 && (
            <div style={{ width: 22, height: 22, borderRadius: 99, background: C.lime, transform: `scale(${1 + 0.6 * Math.exp(-(f % 15) / 3)})` }} />
          )}
          <div style={{ position: 'absolute', top: 330, opacity: 1 - textOut, transform: `translateY(${-textOut * 80}px)` }}>
            <Kinetic text="This is your baon." at={24} size={150} color="#fff" align="center" highlight={{ word: 'baon', bg: C.lime }} stagger={5} />
          </div>
          {coins.map((c, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 600,
                left: 960 - 60 + c.x,
                width: 120,
                height: 120,
                borderRadius: 99,
                background: C.lime,
                color: C.ink,
                display: 'grid',
                placeItems: 'center',
                fontFamily: display,
                fontWeight: 800,
                fontSize: 66,
                transform: `translateY(${c.y}px) rotate(${c.r}deg) scale(${1 - textOut})`,
                boxShadow: 'inset 0 -8px 0 rgba(14,14,16,.18)',
              }}
            >
              ₱
            </div>
          ))}
          {f >= 80 && (
            <div
              style={{
                position: 'absolute',
                fontFamily: mono,
                fontSize: 34,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,.75)',
                opacity: interpolate(f, [80, 88, 108, 116], [0, 1, 1, 0], clamp),
              }}
            >
              AND THIS…
            </div>
          )}
          {rings.map((r, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 900,
                height: 900,
                borderRadius: 999,
                border: `${18 - i * 2}px solid ${r.color}`,
                transform: `scale(${r.s})`,
                opacity: r.s > 0 ? 0.9 : 0,
              }}
            />
          ))}
        </AbsoluteFill>
      )}

      {f >= DROP && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + exit * 0.25}) translateX(${-exit * 300}px)`, opacity: 1 - exit }}>
          <Burst at={DROP} count={22} radius={760} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
            <div style={{ transform: `scale(${interpolate(logo, [0, 1], [2.6, 1])}) rotate(${interpolate(logo, [0, 1], [-30, -6])}deg)`, filter: `blur(${(1 - Math.min(1, logo)) * 10}px)` }}>
              <div style={{ boxShadow: '0 40px 80px -30px rgba(58,75,255,.55)', borderRadius: 300 * 0.31 }}>
                <Buddy size={300} wave={f > DROP + 14} />
              </div>
            </div>
            <div style={{ display: 'flex', fontFamily: display, fontWeight: 800, fontSize: 210, letterSpacing: '-0.06em', color: C.ink, lineHeight: 1 }}>
              {word.map((ch, i) => {
                const p = interpolate(f, [DROP + 4 + i * 2, DROP + 16 + i * 2], [0, 1], { ...clamp, easing: ease });
                return (
                  <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 140}px) rotate(${(1 - p) * 20}deg)`, opacity: p, color: i >= 4 ? C.cobalt : C.ink }}>
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 760,
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: '0.22em',
              color: C.muted,
              opacity: interpolate(f, [146, 158], [0, 1], clamp),
              transform: `translateY(${interpolate(f, [146, 158], [20, 0], { ...clamp, easing: ease })}px)`,
            }}
          >
            BUDGET MO, KONTROLADO MO.
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: '#fff', opacity: f >= DROP ? flash : 0, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
}
