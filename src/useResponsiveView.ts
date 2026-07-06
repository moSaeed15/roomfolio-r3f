import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Extra pull-back applied on narrow / portrait viewports so nothing gets
 * cropped. Desktop (wide) stays at 1; a tall phone screen gets a larger
 * factor roughly proportional to how portrait it is.
 */
export function fitFactor(aspect: number): number {
  if (aspect >= 1.2) return 1; // comfortably landscape — no change
  // Below ~1.2 the view is squarer/portrait; scale up toward ~1.55 at aspect 0.45.
  const t = THREE.MathUtils.clamp((1.2 - aspect) / (1.2 - 0.45), 0, 1);
  return 1 + t * 0.55;
}

/** Current viewport aspect ratio (width / height). */
export function useAspect(): number {
  return useThree(s => s.size.width / s.size.height);
}

/**
 * A drei `<Html distanceFactor>` adjusted for the current viewport. Because the
 * camera pulls back on narrow / portrait screens (see {@link fitFactor}), a
 * fixed distanceFactor would make world-anchored labels shrink and drift out of
 * frame. Scaling the factor by the same fit keeps labels a consistent on-screen
 * size and inside the viewport. Larger distanceFactor => smaller label, so we
 * multiply — the label appears "closer" to compensate for the pulled-back camera.
 */
export function useFitDistanceFactor(base: number): number {
  const aspect = useThree(s => s.size.width / s.size.height);
  return base * fitFactor(aspect);
}
