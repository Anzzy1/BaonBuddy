import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, sans } from '../brand';
import { Buddy } from '../components/Buddy';
import { Chip, clamp, DotGrid, Eyebrow, Kinetic, useSpring } from '../components/ui';

// Real reply from the app's local AI (captured in shots/advisor.png)
const REPLY =
  'To save more, you could cut back on Food spending. Pack lunch 2-3 days a week, share meals with friends, and skip the daily milk tea.';

// 32-38 s (180 frames). VO from local 9: "Need advice? (9-36) Just ask Buddy. (47-79) In English, (92-115) or Taglish. (120-147)"
export function Advisor() {
  const f = useCurrentFrame();
  const buddy = useSpring(0, 12, 120);
  const q = useSpring(22, 12, 170);
  const thinking = f >= 40 && f < 64;
  const replyIn = useSpring(64, 14, 150);
  const chars = Math.floor(interpolate(f, [66, 150], [0, REPLY.length], clamp));
  const en = useSpring(92, 9, 200);
  const tl = useSpring(120, 9, 200);

  return (
    <AbsoluteFill style={{ background: C.cobalt, overflow: 'hidden' }}>
      <DotGrid color="rgba(255,255,255,.12)" />
      {/* lime planet like the app's hero card */}
      <div style={{ position: 'absolute', left: -260, bottom: -380, width: 1100, height: 1100, borderRadius: 999, background: C.lime, transform: `scale(${interpolate(f, [0, 20], [0.6, 1], { ...clamp, easing: ease })})` }} />
      <div
        style={{
          position: 'absolute',
          left: -360,
          bottom: -480,
          width: 1300,
          height: 1300,
          borderRadius: 999,
          border: '3px dashed rgba(255,255,255,.3)',
          transform: `rotate(${f * 0.4}deg)`,
        }}
      />

      <div style={{ position: 'absolute', left: 150, top: 300, transform: `translateY(${(1 - buddy) * 500}px) rotate(${-6 + Math.sin(f / 20) * 2}deg)` }}>
        <div style={{ borderRadius: 560 * 0.31, boxShadow: '0 60px 120px -40px rgba(14,14,16,.6)', border: '10px solid #fff' }}>
          <Buddy size={540} wave={f >= 44 && f < 100} talk={f >= 66 && f < 150} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 860, top: 110, width: 940 }}>
        <Eyebrow color="rgba(255,255,255,.7)" style={{ marginBottom: 22 }}>05 · AI Advisor</Eyebrow>
        <Kinetic text="Just ask Buddy." at={47} size={110} color="#fff" highlight={{ word: 'Buddy', bg: C.lime }} />

        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ alignSelf: 'flex-end', transform: `scale(${q})`, transformOrigin: 'right bottom' }}>
            <div style={{ background: C.lime, color: C.ink, fontFamily: sans, fontWeight: 600, fontSize: 36, padding: '20px 32px', borderRadius: 36, borderBottomRightRadius: 10 }}>
              How can I save more?
            </div>
          </div>
          {thinking && (
            <div style={{ display: 'flex', gap: 12, padding: '26px 30px', background: '#fff', borderRadius: 36, borderBottomLeftRadius: 10, alignSelf: 'flex-start' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 16, height: 16, borderRadius: 99, background: C.muted, transform: `translateY(${Math.sin((f - i * 4) / 3) * 6}px)` }} />
              ))}
            </div>
          )}
          {f >= 64 && (
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', transform: `scale(${replyIn})`, transformOrigin: 'left bottom' }}>
              <Buddy size={72} talk={f < 150} />
              <div style={{ background: '#fff', color: C.ink, fontFamily: sans, fontWeight: 500, fontSize: 32, lineHeight: 1.4, padding: '24px 32px', borderRadius: 36, borderBottomLeftRadius: 10, width: 780, minHeight: 180 }}>
                {REPLY.slice(0, chars)}
                {chars < REPLY.length && <span style={{ display: 'inline-block', width: 3, height: 34, background: C.cobalt, verticalAlign: 'middle', marginLeft: 3 }} />}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 18, marginTop: 40 }}>
          <div style={{ transform: `scale(${en}) rotate(-4deg)` }}>
            <Chip style={{ fontFamily: display, fontWeight: 800, fontSize: 34 }}>English</Chip>
          </div>
          <div style={{ transform: `scale(${tl}) rotate(5deg)` }}>
            <Chip bg={C.pink} style={{ fontFamily: display, fontWeight: 800, fontSize: 34 }}>Taglish</Chip>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
