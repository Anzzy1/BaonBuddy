import type React from 'react';
import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile } from 'remotion';
import { SCENES, sec } from './brand';
import { Wipe } from './components/ui';
import { Advisor } from './scenes/Advisor';
import { Intro } from './scenes/Intro';
import { Log } from './scenes/Log';
import { Manage } from './scenes/Manage';
import { Outro } from './scenes/Outro';
import { Overview } from './scenes/Overview';
import { Privacy } from './scenes/Privacy';

// Voiceover (Belle B, ElevenLabs). `at` is the global frame where the clip starts.
const VO: { file: string; at: number; dur: number }[] = [
  { file: '1-hook', at: 24, dur: sec(4.16) },
  { file: '2-overview', at: 190, dur: sec(7.52) },
  { file: '3-log', at: 426, dur: sec(5.36) },
  { file: '4-manage', at: 732, dur: sec(5.12) },
  { file: '5-advisor', at: 969, dur: sec(4.8) },
  { file: '6-privacy', at: 1155, dur: sec(8.72) },
  { file: '7-outro', at: 1500, dur: sec(4.08) },
];

// Sound effects cue sheet: [file, global frame, volume]
const SFX: [string, number, number][] = [
  ['tick', 40, 0.5], ['tick', 46, 0.5], ['tick', 52, 0.5],
  ['sparkle', 124, 0.5],
  ['whoosh', 170, 0.7],
  ['swish', 192, 0.45], ['pop', 229, 0.5], ['pop', 250, 0.35], ['swish', 289, 0.45], ['pop', 320, 0.3], ['swish', 378, 0.4],
  ['whoosh', 410, 0.8],
  ['swish', 428, 0.35], ['thump', 484, 0.55], ['whoosh-down', 484, 0.2],
  ['thump', 508, 0.55], ['whoosh-down', 508, 0.2],
  ['thump', 547, 0.55], ['whoosh-down', 547, 0.2],
  ['whoosh', 594, 0.6],
  ['pop', 606, 0.45], ['pop', 612, 0.45], ['pop', 618, 0.45], ['pop', 624, 0.45],
  ['whoosh', 708, 0.7],
  ['pop', 742, 0.4], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ['click', 750 + i * 3, 0.35] as [string, number, number]),
  ['whoosh', 818, 0.75],
  ['pop', 868, 0.4], ['pop', 872, 0.4], ['pop', 876, 0.4], ['pop', 880, 0.4], ['pop', 884, 0.4],
  ['ding', 888, 0.5],
  ['whoosh', 950, 0.7],
  ['pop', 982, 0.5], ['pop', 1024, 0.45], ['pop', 1052, 0.45], ['pop', 1080, 0.45],
  ['whoosh-down', 1134, 0.6],
  ['swish', 1213, 0.4], ['thump', 1286, 0.55], ['swish', 1290, 0.45], ['thump', 1313, 0.55], ['swish', 1317, 0.45],
  ['pop', 1350, 0.35], ['pop', 1357, 0.35], ['pop', 1364, 0.35], ['pop', 1371, 0.35],
  ['lock', 1398, 0.6],
  ['sparkle', 1501, 0.5], ['swish', 1545, 0.35], ['ding', 1585, 0.45],
  ['whoosh', 1640, 0.6], ['pop', 1674, 0.35], ['pop', 1679, 0.35], ['pop', 1684, 0.35],
];

// Music ducks under the voice
function musicVolume(f: number) {
  let duck = 0;
  for (const v of VO) {
    duck = Math.max(duck, interpolate(f, [v.at - 6, v.at + 4, v.at + v.dur, v.at + v.dur + 10], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  return 0.62 - duck * 0.4;
}

export function Showreel() {
  const scene = (key: keyof typeof SCENES, El: React.FC) => (
    <Sequence from={SCENES[key][0]} durationInFrames={SCENES[key][1] - SCENES[key][0]} name={key}>
      <El />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {scene('intro', Intro)}
      {scene('overview', Overview)}
      {scene('log', Log)}
      {scene('manage', Manage)}
      {scene('advisor', Advisor)}
      {scene('privacy', Privacy)}
      {scene('outro', Outro)}

      {/* Scene-to-scene wipes, timed so the cut lands under the wipe */}
      <Wipe at={SCENES.overview[0] - 9} color="#3A4BFF" />
      <Wipe at={SCENES.log[0] - 9} color="#0E0E10" />
      <Wipe at={SCENES.manage[0] - 9} color="#FFA3CB" dir={-1} />
      <Wipe at={SCENES.advisor[0] - 9} color="#D7F25C" />
      <Wipe at={SCENES.privacy[0] - 9} color="#3A4BFF" dir={-1} />

      <Html5Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
      {VO.map(v => (
        <Sequence key={v.file} from={v.at} durationInFrames={v.dur + 10} name={`vo ${v.file}`}>
          <Html5Audio src={staticFile(`vo/${v.file}.wav`)} volume={1} />
        </Sequence>
      ))}
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={75} name={`sfx ${name}`}>
          <Html5Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
