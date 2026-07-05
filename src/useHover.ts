import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export type HoverMesh = THREE.Object3D & {
  userData: {
    initialScale?: THREE.Vector3;
    initialRotation?: THREE.Euler;
  };
};

/** Store the base scale/rotation needed to run (and reset) hover tweens. */
export function initHoverUserData(mesh: THREE.Object3D) {
  mesh.userData.initialScale = new THREE.Vector3().copy(mesh.scale);
  mesh.userData.initialRotation = new THREE.Euler().copy(mesh.rotation);
}

export function playHover(object: HoverMesh, hovering: boolean) {
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  const initScale = object.userData.initialScale!;
  const initRot = object.userData.initialRotation!;

  if (hovering) {
    const scale = object.name.includes("Rose") ? 1.25 : 1.12;
    gsap.to(object.scale, {
      x: initScale.x * scale,
      y: initScale.y * scale,
      z: initScale.z * scale,
      duration: 0.4,
      ease: "back.out(1.4)",
    });
    if (!object.name.includes("Quote")) {
      gsap.to(object.rotation, {
        x: initRot.x + Math.PI / 24,
        duration: 0.4,
        ease: "back.out(1.4)",
      });
    }
  } else {
    gsap.to(object.scale, {
      x: initScale.x,
      y: initScale.y,
      z: initScale.z,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(object.rotation, {
      x: initRot.x,
      duration: 0.3,
      ease: "power2.out",
    });
  }
}

/**
 * Shared per-object-3D hover handlers. Tracks the currently-hovered mesh and
 * animates it in/out, plus swaps the cursor for `Pointer`-tagged meshes.
 */
export function useHoverHandlers() {
  const hoveredRef = useRef<HoverMesh | null>(null);

  const onPointerMove = (obj: THREE.Object3D) => {
    if (obj.name.includes("Hover") && hoveredRef.current !== obj) {
      if (hoveredRef.current) playHover(hoveredRef.current, false);
      playHover(obj as HoverMesh, true);
      hoveredRef.current = obj as HoverMesh;
    }
    // "Pointer"-tagged meshes and the clickable monitor get a pointer cursor.
    const clickable = obj.name.includes("Pointer") || obj.name === "Screen";
    document.body.style.cursor = clickable ? "pointer" : "default";
  };

  const onPointerOut = () => {
    if (hoveredRef.current) {
      playHover(hoveredRef.current, false);
      hoveredRef.current = null;
    }
    document.body.style.cursor = "default";
  };

  return { onPointerMove, onPointerOut };
}
