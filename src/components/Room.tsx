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

export default function Room({ envMap }: { envMap: THREE.Texture }) {
  const { openModal, revealed } = useApp();
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
    });
  }, [gltf.scene, textures, glassMaterial]);

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
        handleRoomClick(e.object, openModal);
      }}
    />
  );
}
