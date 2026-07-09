import { useLayoutEffect, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useApp } from "../store";
import { useDracoGLTF } from "../useDracoGLTF";
import { useHoverHandlers } from "../useHover";
import {
  useRoomTextures,
  useGlassMaterial,
  useQuoteTextures,
} from "../room/textures";
import { setupRoomScene } from "../room/setup";
import {
  useIntroAnimation,
  useChairWobble,
  type IntroRefs,
} from "../room/animations";
import { handleRoomClick } from "../room/interactions";
import { useRoomLights } from "../room/lights";

export default function Room({
  envMap,
  screenRef,
}: {
  envMap: THREE.Texture;
  /** Populated with the monitor mesh so the camera rig can frame it. */
  screenRef?: React.RefObject<THREE.Object3D | null>;
}) {
  const {
    openModal,
    revealed,
    enterScreen,
    toggleLights,
    nextBmoGreeting,
    nextMugQuip,
    nextQuote,
    quoteIndex,
    markExplored,
    lightsOn,
  } = useApp();
  const gltf = useDracoGLTF("/models/Room-v1.glb");
  const { onPointerMove, onPointerOut } = useHoverHandlers();

  const textures = useRoomTextures();
  const glassMaterial = useGlassMaterial(envMap);
  const quoteTextures = useQuoteTextures();

  const introRefs = useRef<IntroRefs>({});
  const chairTopRef = useRef<THREE.Object3D | null>(null);
  const quoteMeshesRef = useRef<THREE.Mesh[]>([]);

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
      onQuote: (mesh) => quoteMeshesRef.current.push(mesh),
    });
  }, [gltf.scene, textures, glassMaterial, screenRef]);

  useChairWobble(chairTopRef);
  useIntroAnimation(introRefs, revealed);
  useRoomLights(gltf.scene, lightsOn);

  // Swap both quote meshes' (desk card + wall plane) texture whenever either
  // is clicked (see `nextQuote`). Falls back to a name lookup on a
  // cached/reused GLTF scene (HMR, remount) since `setupRoomScene`'s
  // traversal is a one-time, non-idempotent pass guarded by `roomSetupDone`
  // and won't rerun to repopulate `quoteMeshesRef`.
  useLayoutEffect(() => {
    if (quoteMeshesRef.current.length === 0) {
      gltf.scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && (mesh.name === "Quote" || mesh.name.includes("Quote_Raycaster_Hover"))) {
          quoteMeshesRef.current.push(mesh);
        }
      });
    }
    const texture = quoteTextures[quoteIndex % quoteTextures.length];
    for (let i = 0; i < quoteMeshesRef.current.length; i++) {
      quoteMeshesRef.current[i].material = new THREE.MeshBasicMaterial({ map: texture });
    }
  }, [gltf.scene, quoteTextures, quoteIndex]);

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
        markExplored();
        handleRoomClick(e.object, {
          openModal,
          enterScreen,
          toggleLights,
          nextBmoGreeting,
          nextMugQuip,
          nextQuote,
        });
      }}
    />
  );
}
