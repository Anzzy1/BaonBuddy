import { loadFont as loadDisplay } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadSans } from '@remotion/google-fonts/Geist';
import { loadFont as loadMono } from '@remotion/google-fonts/GeistMono';
import { Easing } from 'remotion';

// Same tokens as app/globals.css
export const C = {
  ink: '#0E0E10',
  white: '#FFFFFF',
  soft: '#F5F5F7',
  hair: '#EDEDF0',
  muted: '#70707A',
  cobalt: '#3A4BFF',
  lime: '#D7F25C',
  lavender: '#C9B8FF',
  peach: '#FFB98F',
  pink: '#FFA3CB',
  sky: '#9FD8FF',
  mint: '#A9ECC8',
  green: '#16A34A',
  danger: '#FF4D4D',
  skin: '#E9B48C',
};

export const display = loadDisplay('normal', { weights: ['700', '800'], subsets: ['latin'] }).fontFamily;
export const sans = loadSans('normal', { weights: ['400', '500', '600'], subsets: ['latin'] }).fontFamily;
export const mono = loadMono('normal', { weights: ['500'], subsets: ['latin'] }).fontFamily;

// Timing: 120 BPM at 30 fps -> one beat is 15 frames, one bar is 60
export const FPS = 30;
export const BEAT = 15;
export const BAR = 60;
export const sec = (s: number) => Math.round(s * FPS);

export const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

// Scene boundaries in frames (all on bar lines)
export const SCENES = {
  intro: [0, 180],
  overview: [180, 420],
  log: [420, 720],
  manage: [720, 960],
  advisor: [960, 1140],
  privacy: [1140, 1440],
  outro: [1440, 1800],
} as const;

export const TOTAL = 1800;
