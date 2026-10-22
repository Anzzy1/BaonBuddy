import { Composition } from 'remotion';
import { FPS, TOTAL } from './brand';
import { Showreel } from './Showreel';

export function Root() {
  return <Composition id="Showreel" component={Showreel} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />;
}
