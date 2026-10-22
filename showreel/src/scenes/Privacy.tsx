import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, display, ease, easeIn, mono, sans } from '../brand';
import { clamp, DotGrid, Eyebrow, Icon, Kinetic, PhoneFrame, shot, useSpring } from '../components/ui';

// 38-48 s (300 frames). VO from local 15:
// "And here's the best part. (16-61) It all runs on your device. (73-137) No cloud. (146-169)
//  No sign-up. (173-198) Your data never leaves your hands. (210-272)"
export function Privacy() {
  const f = useCurrentFrame();
  const intro = interpolate(f, [60, 72], [0, 1], { ...clamp, easing: easeIn });
  const phone = useSpring(70, 16, 110);
  const zoom = interpolate(f, [282, 300], [1, 7], { ...clamp, easing: easeIn });
  const flash = interpolate(f, [292, 300], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: 'hidden' }}>
      <DotGrid color="rgba(255,255,255,.07)" drift={0.25} />

      {/* "The best part" title card */}
      {f < 74 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - intro, transform: `scale(${1 + intro * 0.2})` }}>
          <Eyebrow color={C.lime} style={{ marginBottom: 30, opacity: interpolate(f, [12, 20], [0, 1], clamp) }}>06 · Private by design</Eyebrow>
          <Kinetic text="And the best part?" at={16} size={150} color="#fff" align="center" stagger={6} />
        </AbsoluteFill>
      )}

      {f >= 66 && (
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '960px 520px' }}>
          {/* Glow + rotating ring behind the phone */}
          <div style={{ position: 'absolute', left: 960 - 420, top: 520 - 420, width: 840, height: 840, borderRadius: 999, background: `radial-gradient(circle, ${C.cobalt}88 0%, transparent 65%)`, opacity: phone }} />
          <div style={{ position: 'absolute', left: 960 - 380, top: 520 - 380, width: 760, height: 760, borderRadius: 999, border: `3px dashed ${C.lime}`, opacity: 0.5 * phone, transform: `rotate(${f * 0.6}deg)` }} />

          <div style={{ position: 'absolute', left: 960 - 176, top: 120, transform: `translateY(${(1 - phone) * 900}px)` }}>
            <PhoneFrame src={shot('m-overview')} height={740} />
            <LockBadge f={f - 258} />
          </div>

          {/* Left column statements */}
          <div style={{ position: 'absolute', left: 110, top: 220, width: 620, display: 'flex', flexDirection: 'column', gap: 54 }}>
            <Statement f={f} at={73} icon="cpu" color={C.lime} text="Runs on your device." />
            <Statement f={f} at={146} icon="cloud" color={C.danger} text="No cloud." strike />
            <Statement f={f} at={173} icon="user" color={C.danger} text="No sign-up." strike />
          </div>

          {/* Right column: what stays local */}
          <div style={{ position: 'absolute', right: 110, top: 230, display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'flex-end' }}>
            {[
              { t: 'Offline voice', s: 'Whisper, in your browser', bg: C.pink },
              { t: 'Local AI', s: 'Ollama on your machine', bg: C.sky },
              { t: 'Data stays here', s: 'Saved in this browser only', bg: C.lime },
              { t: 'No account', s: 'Open it and go', bg: C.lavender },
            ].map((c, i) => {
              const p = Math.min(1, Math.max(0, (f - 210 - i * 7) / 9));
              return (
                <div
                  key={c.t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '20px 30px',
                    borderRadius: 30,
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.12)',
                    transform: `translateX(${(1 - ease(p)) * 260}px)`,
                    opacity: p,
                  }}
                >
                  <span style={{ width: 18, height: 18, borderRadius: 99, background: c.bg }} />
                  <div>
                    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: '-0.03em' }}>{c.t}</div>
                    <div style={{ fontFamily: sans, fontSize: 24, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{c.s}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, top: 940 }}>
            <Kinetic text="Your data never leaves your hands." at={210} size={76} color="#fff" align="center" highlight={{ word: 'hands', bg: C.lime }} stagger={4} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
    </AbsoluteFill>
  );
}

function Statement({ f, at, icon, color, text, strike }: { f: number; at: number; icon: string; color: string; text: string; strike?: boolean }) {
  const p = interpolate(f, [at, at + 12], [0, 1], { ...clamp, easing: ease });
  const cross = interpolate(f, [at + 4, at + 14], [0, 1], { ...clamp, easing: ease });
  if (f < at) return <div style={{ height: 120 }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateX(${(1 - p) * -120}px)` }}>
      <div style={{ position: 'relative', width: 120, height: 120, borderRadius: 38, background: 'rgba(255,255,255,.08)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={62} color="#fff" draw={p} />
        {strike && (
          <div style={{ position: 'absolute', width: 120, height: 8, borderRadius: 9, background: color, transform: `rotate(-40deg) scaleX(${cross})`, boxShadow: `0 0 20px ${color}` }} />
        )}
      </div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 76, letterSpacing: '-0.045em', color: strike ? '#fff' : C.lime, lineHeight: 1 }}>{text}</div>
    </div>
  );
}

function LockBadge({ f }: { f: number }) {
  if (f < 0) return null;
  const p = Math.min(1, 1 - Math.exp(-f / 4) * Math.cos(f / 2.5));
  return (
    <div style={{ position: 'absolute', left: '50%', top: '42%', transform: `translate(-50%, -50%) scale(${p})` }}>
      <div style={{ width: 200, height: 200, borderRadius: 64, background: C.lime, display: 'grid', placeItems: 'center', boxShadow: '0 30px 80px -20px rgba(215,242,92,.7)', transform: 'rotate(-6deg)' }}>
        <Icon name="shield" size={110} color={C.ink} stroke={2.2} draw={Math.min(1, f / 14)} />
      </div>
      <div style={{ marginTop: 18, textAlign: 'center', fontFamily: mono, fontSize: 24, letterSpacing: '0.16em', color: '#fff' }}>ON-DEVICE</div>
    </div>
  );
}
