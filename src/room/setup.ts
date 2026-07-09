import * as THREE from 'three';
import { initHoverUserData } from '../useHover';
import { textureKeyFor, type TextureKey } from './textures';
import { introKeyFor, type IntroRefs } from './animations';

const BACKGROUND_COLOR = 'hsl(274, 17%, 92%)';

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
  /** Called for each of the two quote-display meshes (desk + wall) so their
   * textures can be cycled together on click. */
  onQuote?: (mesh: THREE.Mesh) => void;
}

/**
 * Walk the loaded GLTF once: assign baked textures / glass / background
 * materials, apply the small scale tweaks, tag hover meshes, and collect the
 * refs the animations need.

 */
export function setupRoomScene({
  scene,
  textures,
  glassMaterial,
  introRefs,
  onChairTop,
  onScreen,
  onQuote,
}: SetupArgs) {
  if (scene.userData.roomSetupDone) return;
  scene.userData.roomSetupDone = true;

  scene.traverse(child => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const { name } = mesh;

    if (name === 'Screen') onScreen?.(mesh);

    if (name.includes('Glass')) {
      mesh.material = glassMaterial;
      return;
    }

    // The desk quote card and the wall quote plane (the latter doubles as its
    // own raycaster mesh — there's no separate visible mesh for it) both get
    // their material set reactively (see QuoteTextures) so it can be cycled on
    // click. They start out on a plain placeholder material so the quote
    // images — only ever seen after a click — don't have to load before the
    // rest of the room does.
    if (name === 'Quote' || name.includes('Quote_Raycaster_Hover')) {
      mesh.material = new THREE.MeshBasicMaterial({ color: BACKGROUND_COLOR });
      onQuote?.(mesh);
    } else if (name.includes('Background')) {
      mesh.material = new THREE.MeshBasicMaterial({ color: BACKGROUND_COLOR });
    } else {
      const key = textureKeyFor(name);
      if (key)
        mesh.material = new THREE.MeshBasicMaterial({ map: textures[key] });
    }

    if (name.includes('Carpet')) mesh.scale.x *= 1.1;

    if (name.includes('ChairTop')) {
      mesh.userData.initialRotation = new THREE.Euler().copy(mesh.rotation);
      onChairTop(mesh);
    } else if (name.includes('Chair')) {
      mesh.scale.x *= 1.1;
      mesh.scale.z *= 1.1;
    }

    if (name.includes('Hover')) initHoverUserData(mesh);

    const introKey = introKeyFor(name);
    if (introKey) {
      introRefs[introKey] = mesh;
      mesh.scale.set(0, 0, 0);
    }
  });

  scene.scale.set(0.5, 0.5, 0.5);
}
