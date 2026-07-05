import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/** Meshes that start scaled to zero and pop in during the intro animation. */
export const INTRO_KEYS = [
  'Hanging_Plank_1',
  'Hanging_Plank_2',
  'My_Work_Button',
  'About_Button',
  'Contact_Button',
  'GitHub',
  'Linkedin',
  'Portfolio',
  'Lamp',
  'Slipper_1',
  'Slipper_2',
] as const;

export type IntroKey = (typeof INTRO_KEYS)[number];
export type IntroRefs = Partial<Record<IntroKey, THREE.Object3D>>;

/** Match a mesh name to its intro key, or `undefined` if it isn't animated. */
export function introKeyFor(name: string): IntroKey | undefined {
  return INTRO_KEYS.find(key => name.includes(key));
}

/** One mesh popping into view, optionally overlapping the previous step. */
interface PopStep {
  key: IntroKey;
  /** GSAP position param — e.g. `"-=0.5"` to overlap, or a `delay`. */
  position?: gsap.Position;
  delay?: number;
}

/** A group of pops that share a timeline, played on its own track. */
interface Track {
  timeScale?: number;
  delay?: number;
  steps: PopStep[];
}

const EASE = 'back.out(1.8)';
const DURATION = 0.5;

/** Declarative choreography: each track pops its meshes in with the given overlap. */
const TRACKS: Track[] = [
  {
    steps: [
      { key: 'Hanging_Plank_1' },
      { key: 'Hanging_Plank_2', position: '-=0.5' },
      { key: 'My_Work_Button', position: '-=0.5' },
      { key: 'About_Button', position: '-=0.5' },
      { key: 'Contact_Button', position: '-=0.5' },
    ],
  },
  {
    timeScale: 0.8,
    steps: [
      { key: 'GitHub', delay: 0.4 },
      { key: 'Linkedin', position: '-=0.6' },
      { key: 'Portfolio', position: '-=0.6' },
    ],
  },
  {
    timeScale: 0.8,
    delay: 0.2,
    steps: [{ key: 'Lamp' }],
  },
  {
    timeScale: 0.8,
    steps: [
      { key: 'Slipper_1', delay: 0.5 },
      { key: 'Slipper_2', position: '-=0.5' },
    ],
  },
];

/**
 * Play the staggered "pop in" reveal once `revealed` flips true. The
 * choreography lives in `TRACKS`; this just builds a GSAP timeline per track.
 */
export function useIntroAnimation(
  refs: RefObject<IntroRefs>,
  revealed: boolean,
) {
  useEffect(() => {
    if (!revealed) return;

    const timelines = TRACKS.map(({ timeScale = 1, delay, steps }) => {
      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE, delay },
      });
      tl.timeScale(timeScale);
      for (const { key, position, delay: stepDelay } of steps) {
        const scale = refs.current[key]?.scale;
        if (scale)
          tl.to(scale, { x: 1, y: 1, z: 1, delay: stepDelay }, position);
      }
      return tl;
    });

    return () => timelines.forEach(tl => tl.kill());
  }, [refs, revealed]);
}

/**
 * Idle wobble for the chair's top. The original drove this off a millisecond
 * timestamp (`timestamp * 0.002`), i.e. elapsedSeconds * 2 — reproduced here.
 */
export function useChairWobble(chairRef: RefObject<THREE.Object3D | null>) {
  useFrame(({ clock }) => {
    const chair = chairRef.current;
    if (!chair) return;
    const time = clock.elapsedTime * 2;
    const amplitude = Math.PI / 8;
    const offset =
      amplitude *
      Math.sin(time * 0.5) *
      (1 - Math.abs(Math.sin(time * 0.5)) * 0.3);
    const init = chair.userData.initialRotation as THREE.Euler;
    chair.rotation.y = init.y + offset;
  });
}
