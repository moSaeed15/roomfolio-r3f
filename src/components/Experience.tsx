import { useLayoutEffect, useRef, type ElementRef } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useApp } from "../store";
import Room from "./Room";
import Roses from "./Roses";
import CameraRig from "./CameraRig";
import ScreenHtml from "./ScreenHtml";
import BmoBubble from "./BmoBubble";
import MugBubble from "./MugBubble";
import CoffeeSteam from "./CoffeeSteam";

export default function Experience() {
  const { modal, focusScreen } = useApp();
  const store = useThree((s) => s.get);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const screenRef = useRef<THREE.Object3D | null>(null);

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
