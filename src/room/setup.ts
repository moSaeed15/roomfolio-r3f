import * as THREE from "three";
import { initHoverUserData } from "../useHover";
import { textureKeyFor, type TextureKey } from "./textures";
import { introKeyFor, type IntroRefs } from "./animations";

const BACKGROUND_COLOR = "hsl(274, 17%, 92%)";

interface SetupArgs {
  scene: THREE.Object3D;
  textures: Record<TextureKey, THREE.Texture>;
  glassMaterial: THREE.Material;
  /** Populated with the meshes that participate in the intro animation. */
  introRefs: IntroRefs;
  /** Set to the chair-top mesh so the wobble loop can drive it. */
  onChairTop: (mesh: THREE.Object3D) => void;
  /** Set to the monitor mesh so the camera rig can frame it. */
  onScreen?: (mesh: THREE.Object3D) => void;
}

/**
 * Walk the loaded GLTF once: assign baked textures / glass / background
 * materials, apply the small scale tweaks, tag hover meshes, and collect the
 * refs the animations need.
 *
 * This is destructive and NOT idempotent — the scale multipliers compound and
 * the intro zeroing would corrupt the captured hover scale on a second pass.
 * A flag on the scene makes re-runs (e.g. when a memoized dep changes identity)
 * a no-op, so hover always sees the true initial scale.
 */
export function setupRoomScene({
  scene,
  textures,
  glassMaterial,
  introRefs,
  onChairTop,
  onScreen,
}: SetupArgs) {
  if (scene.userData.roomSetupDone) return;
  scene.userData.roomSetupDone = true;

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const { name } = mesh;

    if (name === "Screen") onScreen?.(mesh);

    if (name.includes("Glass")) {
      mesh.material = glassMaterial;
      return;
    }

    if (name.includes("Background")) {
      mesh.material = new THREE.MeshBasicMaterial({ color: BACKGROUND_COLOR });
    } else {
      const key = textureKeyFor(name);
      if (key) mesh.material = new THREE.MeshBasicMaterial({ map: textures[key] });
    }

    if (name.includes("Carpet")) mesh.scale.x *= 1.1;

    if (name.includes("ChairTop")) {
      mesh.userData.initialRotation = new THREE.Euler().copy(mesh.rotation);
      onChairTop(mesh);
    } else if (name.includes("Chair")) {
      mesh.scale.x *= 1.1;
      mesh.scale.z *= 1.1;
    }

    if (name.includes("Hover")) initHoverUserData(mesh);

    const introKey = introKeyFor(name);
    if (introKey) {
      introRefs[introKey] = mesh;
      mesh.scale.set(0, 0, 0);
    }
  });

  scene.scale.set(0.5, 0.5, 0.5);
}
