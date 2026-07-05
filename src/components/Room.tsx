import { useLayoutEffect, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "../store";
import { useDracoGLTF } from "../useDracoGLTF";
import { useHoverHandlers } from "../useHover";
import { useRoomTextures, useGlassMaterial } from "../room/textures";
import { setupRoomScene } from "../room/setup";
import {
  useIntroAnimation,
  useChairWobble,
  type IntroRefs,
} from "../room/animations";
import { handleRoomClick } from "../room/interactions";

export default function Room({
  envMap,
  screenRef,
}: {
  envMap: THREE.Texture;
  /** Populated with the monitor mesh so the camera rig can frame it. */
  screenRef?: React.RefObject<THREE.Object3D | null>;
}) {
  const { openModal, revealed, enterScreen } = useApp();
  const gltf = useDracoGLTF("/models/Room-v1.glb");
  const { onPointerMove, onPointerOut } = useHoverHandlers();

  const textures = useRoomTextures();
  const glassMaterial = useGlassMaterial(envMap);

  const introRefs = useRef<IntroRefs>({});
  const chairTopRef = useRef<THREE.Object3D | null>(null);

  useLayoutEffect(() => {
    setupRoomScene({
      scene: gltf.scene,
      textures,
      glassMaterial,
      introRefs: introRefs.current,
      onChairTop: (mesh) => (chairTopRef.current = mesh),
      onScreen: (mesh) => {
        if (screenRef) screenRef.current = mesh;
      },
    });
  }, [gltf.scene, textures, glassMaterial, screenRef]);

  useChairWobble(chairTopRef);
  useIntroAnimation(introRefs, revealed);

  return (
    <primitive
      object={gltf.scene}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onPointerMove(e.object);
      }}
      onPointerOut={onPointerOut}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        handleRoomClick(e.object, { openModal, enterScreen });
      }}
    />
  );
}
