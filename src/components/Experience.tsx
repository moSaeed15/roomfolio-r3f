import { useLayoutEffect, useRef, type ComponentRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../store';
import { fitFactor } from '../useResponsiveView';
import Room from './Room';
import Roses from './Roses';
import CameraRig from './CameraRig';
import ScreenHtml from './ScreenHtml';
import BmoBubble from './BmoBubble';
import MugBubble from './MugBubble';
import CoffeeSteam from './CoffeeSteam';

// The camera position authored for a wide desktop viewport, and the orbit
// target it looks at. On narrow / portrait screens we push the camera out
// along this offset so the whole diorama stays in frame.
const HOME_TARGET = new THREE.Vector3(-0.19, 1.1, 0.0173);
const HOME_POSITION = new THREE.Vector3(2.8, 4.3, 2);

// On a narrow / portrait viewport the tighter
// horizontal frame clips them, so we pan the look-at toward them a touch.
const SIGN_ANCHOR = new THREE.Vector3(-0.19, 1.45, 0.9);

export default function Experience() {
  const { modal, focusScreen } = useApp();
  const store = useThree(s => s.get);
  const width = useThree(s => s.size.width);
  const height = useThree(s => s.size.height);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const screenRef = useRef<THREE.Object3D | null>(null);

  // Fit the initial room framing to the viewport aspect. Depends on the
  // primitive width/height (not the `size` object) so it only reruns on an
  // actual dimension change — otherwise any unrelated re-render that hands
  // back a new `size` reference (e.g. a drei <Html> mounting) would stomp on
  // wherever the user has orbited the camera.
  useLayoutEffect(() => {
    if (focusScreen) return;
    const factor = fitFactor(width / height);
    const portrait = THREE.MathUtils.clamp((factor - 1) / 0.55, 0, 1);

    // Pan the look-at toward the wall signs as the screen gets more portrait,
    // so they don't fall outside the narrower horizontal frame.
    const target = HOME_TARGET.clone().lerp(SIGN_ANCHOR, portrait);

    const offset = HOME_POSITION.clone().sub(HOME_TARGET);
    // Pull back mostly in the horizontal plane so the camera doesn't climb
    // and start looking straight down on narrow screens.
    offset.x *= factor;
    offset.z *= factor;
    offset.y *= 1 + (factor - 1) * 0.25;
    const cam = store().camera;
    cam.position.copy(target).add(offset);
    cam.lookAt(target);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(target);
      controls.update();
    }
  }, [store, width, height, focusScreen]);

  // Skybox cube map, also used as the scene environment.
  const envMap = useLoader(THREE.CubeTextureLoader, [
    [
      '/textures/skybox/px.webp',
      '/textures/skybox/nx.webp',
      '/textures/skybox/py.webp',
      '/textures/skybox/ny.webp',
      '/textures/skybox/pz.webp',
      '/textures/skybox/nz.webp',
    ],
  ])[0];

  // Use the skybox cube map as the scene environment (drives glass reflections).
  // The scene is read imperatively so we aren't mutating a hook return value.
  useLayoutEffect(() => {
    store().scene.environment = envMap;
  }, [store, envMap]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enabled={!modal && !focusScreen}
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        target={[-0.19, 1.1, 0.0173]}
      />
      <CameraRig controlsRef={controlsRef} screenRef={screenRef} />
      <Room envMap={envMap} screenRef={screenRef} />
      <Roses />
      <ScreenHtml />
      <BmoBubble />
      <MugBubble />
      <CoffeeSteam />
    </>
  );
}
