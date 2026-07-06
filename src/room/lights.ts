import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

const DIM = 0.5;

type Colored = THREE.Material & { color?: THREE.Color };

function roomMaterials(scene: THREE.Object3D): Colored[] {
  const out: Colored[] = [];
  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || mesh.name.includes("Glass")) return;
    const mat = mesh.material as Colored;
    if (mat?.color) out.push(mat);
  });
  return out;
}

export function useRoomLights(scene: THREE.Object3D, lightsOn: boolean) {
  useEffect(() => {
    const target = lightsOn ? 1 : DIM;
    const tweens = roomMaterials(scene).map((mat) =>
      gsap.to(mat.color!, {
        r: target,
        g: target,
        b: target,
        duration: 0.6,
        ease: "power2.out",
      }),
    );
    return () => tweens.forEach((t) => t.kill());
  }, [scene, lightsOn]);
}
