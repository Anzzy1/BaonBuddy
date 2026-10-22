import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeIn, mono } from '../brand';
import { Card, clamp, DotGrid, Eyebrow, Icon, Kinetic, useSpring } from '../components/ui';

const MODES = [
  { word: 'Type it.', label: 'Quick chat · English or Taglish', card: 'card-log-chat', icon: 'chat', at: 64 },
  { word: 'Say it.', label: 'Voice · works offline', card: 'card-log-voice', icon: 'mic', at: 88 },
  { word: 'Snap it.', label: 'Scan · reads the receipt total', card: 'card-log-scan', icon: 'scan', at: 127 },
];

// 14-24 s (300 frames). VO from local 6: "Logging takes seconds. (8-55) Type it. (64) Say it. (88)
// Or just snap the receipt. (127)" Then the four-way fan at 180.
export function Log() {
  const f = useCurrentFrame();
  const FAN = 180;
  const fanIn = interpolate(f, [FAN - 6, FAN + 6], [0, 1], { ...clamp, easing: easeIn });

  return (
    <AbsoluteFill style={{ background: C.lime, overflow: 'hidden' }}>
      <DotGrid color="rgba(14,14,16,.12)" />

      {f < FAN + 6 && (
        <AbsoluteFill style={{ opacity: 1 - fanIn }}>
          <Eyebrow color="rgba(14,14,16,.6)" style={{ position: 'absolute', left: 120, top: 240 }}>02 · Log gastos</Eyebrow>
          {f < 64 && (
            <div style={{ position: 'absolute', left: 110, top: 330, width: 1500, opacity: 1 - interpolate(f, [54, 62], [0, 1], clamp), transform: `translateY(${-interpolate(f, [54, 64], [0, 120], { ...clamp, easing: easeIn })}px)` }}>
              <Kinetic text="Logging takes seconds." at={8} size={170} highlight={{ word: 'seconds', bg: C.ink, fg: C.lime }} stagger={6} />
            </div>
          )}
          {MODES.map((m, i) => {
            const end = MODES[i + 1]?.at ?? FAN;
            const inP = interpolate(f, [m.at, m.at + 10], [0, 1], { ...clamp, easing: ease });
            const outP = interpolate(f, [end - 4, end + 6], [0, 1], { ...clamp, easing: easeIn });
            if (f < m.at || f > end + 8) return null;
            return (
              <div key={m.word} style={{ position: 'absolute', left: 110, top: 330 }}>
                <div
                  style={{
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: 250,
                    letterSpacing: '-0.06em',
                    lineHeight: 1,
                    color: C.ink,
                    transform: `translateY(${(1 - inP) * 120 - outP * 140}px) scale(${1 + (1 - inP) * 0.3})`,
                    opacity: inP * (1 - outP),
                    transformOrigin: 'left bottom',
                  }}
                >
                  {m.word}
                </div>
                <div
                  style={{
                    marginTop: 34,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    fontFamily: mono,
                    fontSize: 30,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: C.ink,
                    opacity: interpolate(f, [m.at + 6, m.at + 14], [0, 1], clamp) * (1 - outP),
                  }}
                >
                  <span style={{ width: 64, height: 64, borderRadius: 20, background: C.ink, display: 'grid', placeItems: 'center', transform: 'rotate(-6deg)' }}>
                    <Icon name={m.icon} size={34} color={C.lime} draw={interpolate(f, [m.at + 4, m.at + 20], [0, 1], clamp)} />
                  </span>
                  {m.label}
                </div>
              </div>
            );
          })}

          {/* Card deck: each new mode lands on top, older ones fall back */}
          {MODES.map((m, i) => {
            if (f < m.at) return null;
            const land = useSpringAt(f, m.at);
            const depth = MODES.filter(n => f >= n.at).length - 1 - i;
            const back = depth > 0 ? Math.min(1, (f - MODES[i + 1].at) / 12) : 0;
            return (
              <div
                key={m.card}
                style={{
                  position: 'absolute',
                  left: 1040 - depth * 60 * back,
                  top: 160 + depth * 20 * back,
                  transform: `translate(${(1 - land) * 700}px, ${(1 - land) * 300}px) rotate(${(1 - land) * 18 - 3 - depth * 6 * back}deg) scale(${1 - depth * 0.08 * back})`,
                  filter: `brightness(${1 - depth * 0.12 * back})`,
                  zIndex: i,
                }}
              >
                <Card name={m.card} width={700} />
                {m.card === 'card-log-voice' && <MicPulse f={f - m.at} />}
                {m.card === 'card-log-scan' && <ScanLine f={f - m.at} />}
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {f >= FAN - 6 && <Fan f={f - FAN} />}
    </AbsoluteFill>
  );
}

// Plain spring helper usable inside map callbacks
function useSpringAt(f: number, at: number) {
  const t = Math.max(0, f - at);
  return 1 - Math.exp(-t / 5) * Math.cos(t / 3.2);
}

function MicPulse({ f }: { f: number }) {
  return (
    <>
      {[0, 1, 2].map(i => {
        const t = ((f + i * 10) % 30) / 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 350 - 80,
              top: 404 - 80,
              width: 160,
              height: 160,
              borderRadius: 60,
              border: `4px solid ${C.cobalt}`,
              transform: `scale(${1 + t * 1.2}) rotate(-6deg)`,
              opacity: (1 - t) * 0.8,
            }}
          />
        );
      })}
      {/* live waveforms either side of the mic */}
      {[0, 1].map(side => (
        <div key={side} style={{ position: 'absolute', left: side ? 470 : 110, top: 376, display: 'flex', gap: 7, alignItems: 'center', height: 60, flexDirection: side ? 'row' : 'row-reverse' }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} style={{ width: 7, borderRadius: 9, background: C.cobalt, opacity: 1 - i * 0.07, height: 8 + Math.abs(Math.sin(f / 3 + i * 0.7) * Math.sin(i * 1.3 + side)) * 52 }} />
          ))}
        </div>
      ))}
    </>
  );
}

function ScanLine({ f }: { f: number }) {
  const y = interpolate(f % 40, [0, 20, 40], [160, 440, 160]);
  return (
    <div style={{ position: 'absolute', left: 30, right: 30, top: 0, height: '100%', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: y, height: 6, borderRadius: 9, background: C.cobalt, boxShadow: `0 0 30px 8px ${C.cobalt}55` }} />
      {[[0, 140], [1, 140], [0, 430], [1, 430]].map(([right, top], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            [right ? 'right' : 'left']: 0,
            top,
            width: 50,
            height: 50,
            borderTop: top < 200 ? `6px solid ${C.cobalt}` : undefined,
            borderBottom: top > 200 ? `6px solid ${C.cobalt}` : undefined,
            borderLeft: !right ? `6px solid ${C.cobalt}` : undefined,
            borderRight: right ? `6px solid ${C.cobalt}` : undefined,
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}

// Four ways to log, fanned out
function Fan({ f }: { f: number }) {
  const cards = [
    { card: 'card-log-manual', label: 'Manual', icon: 'pen', bg: C.peach },
    { card: 'card-log-chat', label: 'Quick chat', icon: 'chat', bg: C.sky },
    { card: 'card-log-voice', label: 'Voice', icon: 'mic', bg: C.pink },
    { card: 'card-log-scan', label: 'Scan', icon: 'scan', bg: C.lavender },
  ];
  const title = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [106, 120], [0, 1], { ...clamp, easing: easeIn });
  return (
    <AbsoluteFill style={{ transform: `translateY(${-out * 1100}px)` }}>
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 116,
          letterSpacing: '-0.05em',
          color: C.ink,
          opacity: title,
          transform: `translateY(${(1 - title) * 60}px)`,
        }}
      >
        Four ways. Seconds each.
      </div>
      {cards.map((c, i) => {
        const p = useSpringAt(f, 6 + i * 6);
        const rot = (i - 1.5) * 5;
        const x = 960 + (i - 1.5) * 420 - 200;
        return (
          <div
            key={c.card}
            style={{
              position: 'absolute',
              left: x,
              top: 330 + Math.abs(i - 1.5) * 26,
              transform: `translateY(${(1 - p) * 700}px) rotate(${rot * p}deg) translateY(${Math.sin((f + i * 10) / 14) * 8}px)`,
            }}
          >
            <Card name={c.card} width={400} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -40,
                transform: `translateX(-50%) rotate(${-rot}deg) scale(${Math.min(1, Math.max(0, (f - 14 - i * 6) / 8))})`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 70,
                padding: '0 28px',
                borderRadius: 99,
                background: c.bg,
                fontFamily: display,
                fontWeight: 800,
                fontSize: 32,
                color: C.ink,
                boxShadow: '0 20px 40px -18px rgba(14,14,16,.4)',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name={c.icon} size={28} color={C.ink} /> {c.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
