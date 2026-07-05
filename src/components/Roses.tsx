import { useLayoutEffect } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useDracoGLTF } from "../useDracoGLTF";
import { initHoverUserData, useHoverHandlers } from "../useHover";

export default function Roses() {
  const gltf = useDracoGLTF("/models/Roses.glb");
  const { onPointerMove, onPointerOut } = useHoverHandlers();

  useLayoutEffect(() => {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.name.includes("Hover")) initHoverUserData(mesh);
    });
  }, [gltf.scene]);

  return (
    <primitive
      object={gltf.scene}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onPointerMove(e.object);
      }}
      onPointerOut={onPointerOut}
    />
  );
}
