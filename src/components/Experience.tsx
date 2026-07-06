import { useLayoutEffect, useRef, type ElementRef } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "../store";
import { fitFactor } from "../useResponsiveView";
import Room from "./Room";
import Roses from "./Roses";
import CameraRig from "./CameraRig";
import ScreenHtml from "./ScreenHtml";
import BmoBubble from "./BmoBubble";
import MugBubble from "./MugBubble";
import CoffeeSteam from "./CoffeeSteam";

// The camera position authored for a wide desktop viewport, and the orbit
// target it looks at. On narrow / portrait screens we push the camera out
// along this offset so the whole diorama stays in frame.
const HOME_TARGET = new THREE.Vector3(-0.19, 1.1, 0.0173);
const HOME_POSITION = new THREE.Vector3(2.8, 4.3, 2);

// The My Work / About / Contact signs live high on the +z side of the room
// (world ~z 1.39, y up to 1.95). On a narrow / portrait viewport the tighter
// horizontal frame clips them, so we pan the look-at toward them a touch.
const SIGN_ANCHOR = new THREE.Vector3(-0.19, 1.45, 0.9);

export default function Experience() {
  const { modal, focusScreen } = useApp();
  const store = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const screenRef = useRef<THREE.Object3D | null>(null);

  // Fit the initial room framing to the viewport aspect. Runs on mount and on
  // resize/orientation change, but only while the user is at the home view
  // (not flown into the monitor and not orbiting a modal open).
  useLayoutEffect(() => {
    if (focusScreen) return;
    const factor = fitFactor(size.width / size.height);
    // How portrait we are, 0 (wide) .. 1 (very tall). Reuses fitFactor's ramp.
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
  }, [store, size, focusScreen]);

  // Skybox cube map, also used as the scene environment.
  const envMap = useLoader(THREE.CubeTextureLoader, [
    [
      "/textures/skybox/px.webp",
      "/textures/skybox/nx.webp",
      "/textures/skybox/py.webp",
      "/textures/skybox/ny.webp",
      "/textures/skybox/pz.webp",
      "/textures/skybox/nz.webp",
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
        minDistance={2}
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
