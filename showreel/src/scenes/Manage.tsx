import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeIn, easeInOut, mono, sans } from '../brand';
import { Buddy } from '../components/Buddy';
import { BrowserFrame, clamp, Count, DotGrid, Eyebrow, Icon, Kinetic, shot, useSpring } from '../components/ui';

// 24-32 s (240 frames). VO from local 12: "Search and edit every expense, and split the bill with your barkada in one tap."
export function Manage() {
  const f = useCurrentFrame();
  const SPLIT = 108;
  const enter = useSpring(0, 18, 110);
  const swap = interpolate(f, [SPLIT - 8, SPLIT + 10], [0, 1], { ...clamp, easing: easeInOut });
  const query = 'milk tea';
  const typed = query.slice(0, Math.max(0, Math.floor((f - 30) / 3)));

  return (
    <AbsoluteFill style={{ background: '#fff', overflow: 'hidden' }}>
      <DotGrid />

      {/* Part 1: Manage */}
      <AbsoluteFill style={{ transform: `translateX(${-swap * 1920}px)` }}>
        <div style={{ position: 'absolute', left: 120, top: 90 }}>
          <Eyebrow style={{ marginBottom: 24, opacity: interpolate(f, [4, 12], [0, 1], clamp) }}>03 · Manage</Eyebrow>
          <Kinetic text="Search & edit everything." at={12} size={92} highlight={{ word: 'everything', bg: C.pink }} />
        </div>
        <div style={{ position: 'absolute', left: 260, top: 330, perspective: 2200 }}>
          <div style={{ transform: `translateY(${(1 - enter) * 600}px) rotateX(${(1 - enter) * 30 + 8}deg)`, transformOrigin: 'center top' }}>
            <BrowserFrame src={shot('manage')} width={1400} />
          </div>
        </div>
        {/* Search pill typing on top of the real screen */}
        <div
          style={{
            position: 'absolute',
            left: 1080,
            top: 250,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            height: 96,
            width: 620,
            padding: '0 34px',
            borderRadius: 99,
            background: C.ink,
            color: '#fff',
            fontFamily: sans,
            fontSize: 38,
            fontWeight: 500,
            boxShadow: '0 30px 60px -24px rgba(14,14,16,.6)',
            transform: `scale(${interpolate(f, [22, 32], [0, 1], { ...clamp, easing: ease })}) rotate(-3deg)`,
          }}
        >
          <Icon name="search" size={40} color={C.lime} />
          <span>{typed}</span>
          <span style={{ width: 3, height: 42, background: C.lime, opacity: f % 16 < 8 ? 1 : 0 }} />
        </div>
      </AbsoluteFill>

      {/* Part 2: Hatian (split the bill) */}
      <AbsoluteFill style={{ transform: `translateX(${(1 - swap) * 1920}px)`, background: C.peach }}>
        <DotGrid color="rgba(14,14,16,.1)" />
        <div style={{ position: 'absolute', left: 120, top: 120 }}>
          <Eyebrow color="rgba(14,14,16,.6)" style={{ marginBottom: 24 }}>04 · Calculator</Eyebrow>
          <Kinetic text="Split the bill with the barkada." at={SPLIT + 6} size={92} highlight={{ word: 'barkada', bg: '#fff' }} style={{ width: 1000 }} />
        </div>
        <div style={{ position: 'absolute', right: -120, top: 120, perspective: 2000 }}>
          <div style={{ transform: `rotateY(-22deg) rotateX(6deg) translateX(${(1 - swap) * 400}px)`, transformOrigin: 'right center' }}>
            <BrowserFrame src={shot('calculator')} width={1000} />
          </div>
        </div>
        <SplitMath f={f - SPLIT - 30} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function SplitMath({ f }: { f: number }) {
  const people = [C.lime, C.sky, C.pink, C.lavender, C.mint];
  const show = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [92, 102], [0, 1], { ...clamp, easing: easeIn });
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 520,
        width: 1100,
        padding: 44,
        borderRadius: 44,
        background: '#fff',
        boxShadow: '0 50px 100px -40px rgba(14,14,16,.45)',
        opacity: show,
        transform: `translateY(${(1 - show) * 80 - out * 40}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: display, fontWeight: 800, fontSize: 110, letterSpacing: '-0.05em', color: C.ink }}>
        <span>₱<Count to={1000} at={4} dur={22} /></span>
        <span style={{ color: C.muted, fontSize: 80 }}>÷ 5</span>
        <span style={{ color: C.muted, fontSize: 80 }}>=</span>
        <span style={{ background: C.lime, padding: '0 22px', borderRadius: 26, transform: `scale(${interpolate(f, [30, 40], [0.6, 1], { ...clamp, easing: ease })})`, display: 'inline-block' }}>
          ₱<Count to={200} at={30} dur={14} />
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 30 }}>
        {people.map((bg, i) => {
          const p = Math.min(1, Math.max(0, (f - 10 - i * 4) / 8));
          return (
            <div key={i} style={{ transform: `scale(${p}) translateY(${Math.sin((f + i * 8) / 6) * 4}px)` }}>
              <Buddy size={112} bg={bg} radius={0.3} delay={i * 7} />
            </div>
          );
        })}
        <div style={{ marginLeft: 20, fontFamily: mono, fontSize: 28, letterSpacing: '0.08em', color: C.muted, opacity: interpolate(f, [44, 52], [0, 1], clamp) }}>
          EACH · LOGGED IN ONE TAP
        </div>
      </div>
    </div>
  );
}
