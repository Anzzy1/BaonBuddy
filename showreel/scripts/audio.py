"""Synthesizes the showreel music bed and sound effects.

120 BPM, one bar = 2 s, 30 bars = 60 s. Section map (bars):
  0-1   intro (pad + filtered arp, riser into bar 2)
  2-9   groove A          10-17  groove B (busier hats, bell hook)
  18    transition         19-22  breakdown (privacy scene)
  23    build              24-27  drop        28-29  final chord + tail
Run: python scripts/audio.py  ->  public/audio/music.wav, public/audio/sfx/*.wav
"""
import os
import numpy as np
import scipy.signal as sg
from scipy.io import wavfile

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = 61.0
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(7)


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lp(x, cutoff, order=2):
    b, a = sg.butter(order, min(cutoff, SR / 2 - 100) / (SR / 2), 'low')
    return sg.lfilter(b, a, x)


def hp(x, cutoff, order=2):
    b, a = sg.butter(order, cutoff / (SR / 2), 'high')
    return sg.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = sg.butter(order, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], 'band')
    return sg.lfilter(b, a, x)


class Bus:
    def __init__(self, n):
        self.l = np.zeros(n)
        self.r = np.zeros(n)

    def add(self, sig, start, gain=1.0, pan=0.0):
        i = int(round(start * SR))
        n = min(len(sig), len(self.l) - i)
        if n <= 0:
            return
        g = gain * np.sqrt(2)
        self.l[i:i + n] += sig[:n] * g * np.cos((pan + 1) * np.pi / 4)
        self.r[i:i + n] += sig[:n] * g * np.sin((pan + 1) * np.pi / 4)


def reverb_ir(seconds=2.2, seed=1):
    r = np.random.default_rng(seed)
    t = t_(seconds)
    ir = r.standard_normal(len(t)) * np.exp(-t * 3.2)
    ir = lp(ir, 6000)
    ir[:int(0.012 * SR)] = 0
    return ir / np.sqrt(np.sum(ir ** 2))


IR_L, IR_R = reverb_ir(seed=1), reverb_ir(seed=2)


def reverb(bus, wet=0.25):
    bus.l += sg.fftconvolve(bus.l, IR_L)[:len(bus.l)] * wet
    bus.r += sg.fftconvolve(bus.r, IR_R)[:len(bus.r)] * wet


# ---------- instruments ----------

def kick(punch=1.0):
    t = t_(0.5)
    f = 46 + 110 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 300) * 0.3
    return np.tanh((body + click) * 1.6 * punch)


def clap():
    t = t_(0.35)
    n = rng.standard_normal(len(t))
    env = np.zeros(len(t))
    for k, off in enumerate([0, 0.011, 0.022]):
        i = int(off * SR)
        env[i:] += np.exp(-(t[i:] - off) * (90 if k < 2 else 16))
    return bp(n, 900, 3200) * env * 0.9


def snare():
    t = t_(0.22)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    noise = bp(rng.standard_normal(len(t)), 1500, 8000) * np.exp(-t * 22)
    return tone + noise * 0.8


def hat(open_=False):
    t = t_(0.3 if open_ else 0.06)
    n = hp(rng.standard_normal(len(t)), 7500, 4)
    return n * np.exp(-t * (12 if open_ else 70)) * 0.5


def pluck(midi, dur=0.6, bright=1.0):
    t = t_(dur)
    f = hz(midi)
    x = np.zeros(len(t))
    for k in range(1, 14):
        if f * k > 15000:
            break
        x += np.sin(2 * np.pi * f * k * t + k) / k * np.exp(-t * (4 + k * 2.2 / bright))
    return x * np.minimum(1, t * 400) * 0.5


def bell(midi, dur=1.2):
    t = t_(dur)
    f = hz(midi)
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
         + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12))
    return x * np.exp(-t * 3.2) * np.minimum(1, t * 600) * 0.35


def saw_pad(midis, dur, cutoff=1400):
    t = t_(dur)
    x = np.zeros(len(t))
    for m in midis:
        for det in (-0.08, 0.0, 0.08):
            x += sg.sawtooth(2 * np.pi * hz(m + det) * t + rng.uniform(0, 6))
    x = lp(x / (len(midis) * 3), cutoff)
    env = np.minimum(1, t / 0.25) * np.minimum(1, (dur - t) / 0.3)
    return x * env * 0.6


def bass(midi, dur):
    t = t_(dur)
    f = hz(midi)
    x = sg.sawtooth(2 * np.pi * f * t) * 0.5 + np.sin(2 * np.pi * f * t)
    x = lp(x, 420)
    return np.tanh(x * 1.4) * np.minimum(1, t * 300) * np.exp(-t * 2.5) * 0.55


def sweep_noise(dur, lo, hi, rise=True):
    """Filtered noise whose band moves from lo to hi (or hi to lo)."""
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunk = 512
    for i in range(0, n, chunk):
        p = i / n if rise else 1 - i / n
        c = lo * (hi / lo) ** p
        seg = noise[max(0, i - 2048):i + chunk]
        y = bp(seg, c * 0.7, c * 1.4)
        out[i:i + chunk] = y[-len(out[i:i + chunk]):]
    return out


def riser(dur=2.0):
    t = t_(dur)
    x = sweep_noise(dur, 300, 9000) * (t / dur) ** 2
    x += np.sin(2 * np.pi * np.cumsum(200 + 1200 * (t / dur) ** 2) / SR) * (t / dur) ** 3 * 0.25
    return x * 0.55


def impact(dur=2.5):
    t = t_(dur)
    boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t * 8)) / SR) * np.exp(-t * 2.2)
    crack = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 9) * 0.6
    return np.tanh((boom + crack) * 1.5) * 0.9


def reverse_cymbal(dur=1.5):
    t = t_(dur)
    x = hp(rng.standard_normal(len(t)), 5000) * (t / dur) ** 3
    return x * 0.35


# ---------- arrangement ----------

CHORDS = [  # pad voicing, bass root, arp tones   (F - C - Dm - Bb)
    ([53, 57, 60, 65], 41, [65, 69, 72, 77]),
    ([52, 55, 60, 64], 36, [64, 67, 72, 76]),
    ([50, 57, 62, 65], 38, [62, 65, 69, 74]),
    ([50, 53, 58, 62], 34, [62, 65, 70, 74]),
]
HOOK = [(0, 77), (0.75, 76), (1.5, 72), (2.5, 74), (3.0, 72), (3.5, 69)]  # beats, midi (2-bar motif)


def section(bar):
    if bar < 2: return 'intro'
    if bar < 10: return 'A'
    if bar < 18: return 'B'
    if bar == 18: return 'trans'
    if bar < 23: return 'break'
    if bar == 23: return 'build'
    if bar < 28: return 'drop'
    return 'end'


def build_music():
    n = int(LENGTH * SR)
    drums, music, fx, send = Bus(n), Bus(n), Bus(n), Bus(n)
    side = np.ones(n)  # sidechain gain applied to pad + bass

    def duck(at):
        i = int(at * SR)
        t = t_(0.28)
        g = 1 - 0.62 * np.exp(-t * 14)
        side[i:i + len(g)] = np.minimum(side[i:i + len(g)], g[:max(0, min(len(g), n - i))])

    for bar in range(30):
        s = section(bar)
        b0 = bar * BAR
        pad_v, root, arp = CHORDS[bar % 4]

        # Pad
        if s != 'end':
            cutoff = {'intro': 700, 'break': 900, 'build': 1200}.get(s, 1600)
            music.add(saw_pad(pad_v, BAR + 0.3, cutoff), b0, 0.32 if s in ('A', 'B', 'drop') else 0.42)
            send.add(saw_pad(pad_v, BAR, cutoff), b0, 0.12)

        # Drums
        if s in ('A', 'B', 'trans', 'drop'):
            for b in range(4):
                drums.add(kick(), b0 + b * BEAT, 0.95)
                duck(b0 + b * BEAT)
            for b in (1, 3):
                drums.add(clap(), b0 + b * BEAT, 0.55, 0.05)
                send.add(clap(), b0 + b * BEAT, 0.18)
            steps = 16 if s in ('B', 'drop') else 8
            for k in range(steps):
                pos = b0 + k * BAR / steps
                open_ = s in ('B', 'drop') and k % 4 == 2
                drums.add(hat(open_), pos, (0.22 if k % 2 else 0.3) * (1.3 if open_ else 1), 0.25 if k % 2 else -0.2)
        if s == 'break':
            drums.add(kick(0.6), b0, 0.5)
        if s == 'build':
            for k in range(16):  # snare roll accelerating in volume
                drums.add(snare(), b0 + k * BAR / 16, 0.15 + 0.5 * k / 16)
            for b in range(4):
                drums.add(kick(), b0 + b * BEAT, 0.8)

        # Bass (8ths with octave bounce)
        if s in ('A', 'B', 'drop', 'trans'):
            for k in range(8):
                m = root + (12 if k % 2 else 0)
                music.add(bass(m, BEAT / 2 + 0.05), b0 + k * BEAT / 2, 0.75)
        if s in ('break', 'build'):
            music.add(bass(root, BAR), b0, 0.5)

        # Arp (16ths)
        if s != 'end':
            pattern = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 1, 2]
            bright = {'intro': 0.4, 'break': 0.6}.get(s, 1.0)
            for k, idx in enumerate(pattern):
                note = arp[idx] + (12 if s == 'drop' and k % 8 == 7 else 0)
                g = 0.16 if s in ('A', 'B', 'drop') else 0.13
                pan = -0.4 if k % 2 else 0.4
                music.add(pluck(note, 0.5, bright), b0 + k * BAR / 16, g, pan)
                send.add(pluck(note, 0.5, bright), b0 + k * BAR / 16, 0.05)

        # Bell hook on B, drop, and the breakdown (softer)
        if s in ('B', 'drop', 'break') and bar % 2 == 0:
            for beat, m in HOOK:
                g = 0.5 if s != 'break' else 0.35
                music.add(bell(m), b0 + beat * BEAT, g, 0.1)
                send.add(bell(m), b0 + beat * BEAT, 0.3)

    # Structural FX
    fx.add(riser(2.0), 2 * BAR - 2.0, 0.6)          # into the logo drop at 4 s
    fx.add(impact(), 2 * BAR, 0.8)
    fx.add(reverse_cymbal(1.5), 7 * BAR - 1.5, 0.5)  # into logging scene
    fx.add(reverse_cymbal(1.5), 12 * BAR - 1.5, 0.5)
    fx.add(reverse_cymbal(1.5), 16 * BAR - 1.5, 0.5)
    fx.add(riser(2.0), 19 * BAR - 2.0, 0.35)
    fx.add(impact(3.0), 19 * BAR, 0.45)              # soft hit into privacy breakdown
    fx.add(riser(2.0), 24 * BAR - 2.0, 0.8)          # build into the final drop
    fx.add(impact(3.0), 24 * BAR, 0.95)
    send.add(impact(3.0), 24 * BAR, 0.3)

    # Final chord: big pluck stab + pad ringing out
    end = 28 * BAR
    for m in [53, 57, 60, 65, 69, 72]:
        music.add(pluck(m, 3.5, 1.2), end, 0.22)
        send.add(pluck(m, 3.5, 1.2), end, 0.2)
    music.add(saw_pad([53, 57, 60, 65], 4.5, 1800), end, 0.4)
    fx.add(impact(3.0), end, 0.7)
    drums.add(kick(), end, 1.0)

    reverb(send, wet=1.0)
    music.l *= side
    music.r *= side

    L = drums.l + music.l + fx.l + send.l * 0.6
    R = drums.r + music.r + fx.r + send.r * 0.6
    mix = np.stack([L, R], axis=1)
    mix = hp(mix.T, 28).T
    # Gentle bus compression + soft clip, then normalize to -1 dBFS
    mix = np.tanh(mix / np.max(np.abs(mix)) * 1.6)
    fade = np.ones(len(mix))
    fo = int(1.2 * SR)
    fade[-fo:] = np.linspace(1, 0, fo)
    mix *= fade[:, None]
    return mix / np.max(np.abs(mix)) * 0.89


# ---------- sound effects ----------

def sfx():
    out = {}
    t = t_(0.5)
    out['whoosh'] = sweep_noise(0.5, 400, 6000) * np.sin(np.pi * t / 0.5) ** 2 * 0.9
    out['whoosh-down'] = sweep_noise(0.5, 6000, 300) * np.sin(np.pi * t / 0.5) ** 2 * 0.9
    tp = t_(0.18)
    out['pop'] = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tp * 18) + 300) / SR) * np.exp(-tp * 25)
    tc = t_(0.04)
    out['click'] = hp(rng.standard_normal(len(tc)), 2000) * np.exp(-tc * 160) * 0.7 + np.sin(2 * np.pi * 2400 * tc) * np.exp(-tc * 120) * 0.4
    tt = t_(0.06)
    out['tick'] = np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 90) * 0.5
    td = t_(1.2)
    out['ding'] = (bell(84, 1.2) + bell(91, 1.2) * 0.6) * 1.6
    sp = np.zeros(int(0.9 * SR))
    for k, m in enumerate([84, 88, 91, 96]):
        b = bell(m, 0.6) * 1.2
        i = int(k * 0.06 * SR)
        sp[i:i + len(b)] += b[:len(sp) - i]
    out['sparkle'] = sp
    out['swish'] = sweep_noise(0.25, 2000, 9000) * np.sin(np.pi * t_(0.25) / 0.25) * 0.7
    out['impact'] = impact(2.0)
    out['riser'] = riser(1.5)
    tm = t_(0.3)
    out['thump'] = np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-tm * 25)) / SR) * np.exp(-tm * 12)
    tl = t_(0.25)
    out['lock'] = (np.sin(2 * np.pi * 1300 * tl) * np.exp(-tl * 40) + hp(rng.standard_normal(len(tl)), 3000) * np.exp(-tl * 120) * 0.5)
    return {k: v / np.max(np.abs(v)) * 0.9 for k, v in out.items()}


def write(path, x):
    x = np.asarray(x)
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


if __name__ == '__main__':
    os.makedirs(os.path.join(OUT, 'sfx'), exist_ok=True)
    write(os.path.join(OUT, 'music.wav'), build_music())
    for name, sig in sfx().items():
        write(os.path.join(OUT, 'sfx', f'{name}.wav'), sig)
    print('ok')
