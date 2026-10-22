import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeInOut } from '../brand';
import { BrowserFrame, Card, Chip, clamp, DotGrid, Eyebrow, Kinetic, shot, useSpring } from '../components/ui';

const K = 1100 / 1440;

// 6-14 s (240 frames). VO from local 10; lines land on her words: 12, 49, 109, 198.
export function Overview() {
  const f = useCurrentFrame();
  const enter = useSpring(0, 18, 120);
  const hero = useSpring(49, 13, 150);
  const meter = useSpring(109, 13, 150);
  const settle = interpolate(f, [198, 230], [0, 1], { ...clamp, easing: easeInOut });
  const sticker = useSpring(70, 9, 200);

  const tiltY = interpolate(enter, [0, 1], [-38, -16]) * (1 - settle) ;
  const tiltX = interpolate(enter, [0, 1], [18, 7]) * (1 - settle);
  const bx = interpolate(enter, [0, 1], [900, 0]);

  return (
    <AbsoluteFill style={{ background: C.soft, overflow: 'hidden' }}>
      <DotGrid />
      <div style={{ position: 'absolute', left: 110, top: 270, width: 700 }}>
        <Eyebrow style={{ opacity: interpolate(f, [4, 14], [0, 1], clamp), marginBottom: 34 }}>01 · Overview</Eyebrow>
        <Kinetic text="Your balance," at={12} size={90} />
        <Kinetic text="safe-to-spend," at={49} size={90} highlight={{ word: 'safe-to-spend', bg: C.lime }} style={{ marginTop: 10 }} />
        <Kinetic text="and every peso." at={109} size={90} highlight={{ word: 'peso', bg: C.pink }} style={{ marginTop: 10 }} />
        <Kinetic text="All at a glance." at={198} size={56} weight={700} color={C.muted} style={{ marginTop: 40 }} />
      </div>

      <div style={{ position: 'absolute', left: 860, top: 170, perspective: 2400 }}>
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(${bx + settle * -40}px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(${0.84 + settle * 0.06})`,
            transformOrigin: 'left center',
          }}
        >
          <BrowserFrame src={shot('overview')} width={1100} />
          {/* Cards lift off the screen */}
          <div
            style={{
              position: 'absolute',
              left: 308 * K,
              top: 44 * K + 88 * K,
              transform: `translateZ(${hero * 160 - meter * 60}px) translateY(${(1 - hero) * 30}px) scale(${0.92 + hero * 0.1})`,
              opacity: Math.min(1, hero * 1.5),
            }}
          >
            <Card name="card-hero" width={637 * K} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 962 * K,
              top: 44 * K + 88 * K,
              transform: `translateZ(${meter * 200}px) translateY(${(1 - meter) * 40}px) scale(${0.9 + meter * 0.12})`,
              opacity: Math.min(1, meter * 1.5),
            }}
          >
            <Card name="card-meter" width={449 * K} />
          </div>
        </div>
      </div>

      {/* Real number from the screenshot: safe per day */}
      <div style={{ position: 'absolute', left: 1120, top: 720, transform: `scale(${sticker}) rotate(${-8 + (1 - sticker) * 20}deg)` }}>
        <Chip bg={C.ink} fg="#fff" style={{ height: 84, fontSize: 34, padding: '0 34px' }}>
          <span style={{ width: 14, height: 14, borderRadius: 99, background: C.lime }} />
          Safe today <span style={{ fontFamily: display, fontWeight: 800, color: C.lime }}>₱369</span>
        </Chip>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1500,
          top: 120,
          opacity: interpolate(f, [140, 150], [0, 1], clamp),
          transform: `translateY(${interpolate(f, [140, 152], [24, 0], { ...clamp, easing: ease })}px) rotate(6deg)`,
        }}
      >
        <Chip bg={C.lime} style={{ fontSize: 30 }}>26% used · Day 22 of 31</Chip>
      </div>
    </AbsoluteFill>
  );
}
