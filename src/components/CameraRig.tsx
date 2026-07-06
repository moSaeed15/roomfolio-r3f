import { useEffect, useRef, type ComponentRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useApp } from '../store';
import { fitFactor } from '../useResponsiveView';

export type OrbitControlsRef = NonNullable<ComponentRef<typeof OrbitControls>>;

const VIEW_DISTANCE = 0.62;
const FLY_DURATION = 1.4;
const EASE = 'power3.inOut';

interface Props {
  controlsRef: React.RefObject<OrbitControlsRef | null>;
  screenRef: React.RefObject<THREE.Object3D | null>;
}

export default function CameraRig({ controlsRef, screenRef }: Props) {
  const { focusScreen } = useApp();
  const camera = useThree(s => s.camera);
  const getState = useThree(s => s.get);
  const home = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(
    null,
  );

  useEffect(() => {
    const controls = controlsRef.current;
    const screen = screenRef.current;
    if (!controls || !screen) return;

    if (focusScreen) {
      home.current = {
        pos: camera.position.clone(),
        target: controls.target.clone(),
      };

      const box = new THREE.Box3().setFromObject(screen);
      const center = box.getCenter(new THREE.Vector3());

      // Screen is a flat plane spanning local Y/Z, so it faces local ±X.
      const normal = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()))
        .normalize();
      if (normal.dot(camera.position.clone().sub(center)) < 0) normal.negate();

      // Pull further back on narrow / portrait screens so the pinned card
      // isn't cropped by the viewport. Dampened slightly so the card lands a
      // touch closer than a full fit.
      const { width, height } = getState().size;
      const portraitPullback = 1 + (fitFactor(width / height) - 1) * 0.82;
      const distance = VIEW_DISTANCE * portraitPullback;
      const camPos = center.clone().addScaledVector(normal, distance);
      flyTo(camera, controls, camPos, center);
    } else if (home.current) {
      flyTo(camera, controls, home.current.pos, home.current.target, () => {
        controls.enabled = true;
      });
    }
  }, [focusScreen, camera, getState, controlsRef, screenRef]);

  return null;
}

function flyTo(
  camera: THREE.Camera,
  controls: OrbitControlsRef,
  pos: THREE.Vector3,
  target: THREE.Vector3,
  onComplete?: () => void,
) {
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(controls.target);
  controls.enabled = false;

  const tl = gsap.timeline({
    defaults: { duration: FLY_DURATION, ease: EASE },
    onUpdate: () => camera.lookAt(controls.target),
    onComplete,
  });
  tl.to(camera.position, { x: pos.x, y: pos.y, z: pos.z }, 0);
  tl.to(controls.target, { x: target.x, y: target.y, z: target.z }, 0);
}
