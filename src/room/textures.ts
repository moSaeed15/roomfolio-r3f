import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

/** Texture set -> file. Mirrors the vanilla `textureMap`. */
export const TEXTURE_MAP = {
  One: "/textures/room/TextureSetOneDenoised.webp",
  Two: "/textures/room/TextureSetTwoDenoised.webp",
  Three: "/textures/room/TextureSetThreeDenoised.webp",
  Chair: "/textures/images/Chair.webp",
  Carpet: "/textures/room/TestCarpet.webp",
  Screen: "/textures/images/screen.webp",
  Quote: "/textures/images/quote.webp",
  BMO: "/textures/images/BMO.webp",
  Wood: "/textures/room/WoodFinalDenoised.webp",
  Flower: "/textures/images/Flowers.webp",
} as const;

export type TextureKey = keyof typeof TEXTURE_MAP;
export const TEXTURE_KEYS = Object.keys(TEXTURE_MAP) as TextureKey[];

/** Match a mesh name to its texture key, or `undefined` if none applies. */
export function textureKeyFor(name: string): TextureKey | undefined {
  return TEXTURE_KEYS.find((key) => name.includes(key));
}

/**
 * Load every room texture and configure it to match the baked-lighting
 * workflow: no flip, sRGB, linear filtering. Textures are cloned so the
 * mutations don't touch the (memoized) loader cache.
 */
export function useRoomTextures(): Record<TextureKey, THREE.Texture> {
  const loaded = useLoader(
    THREE.TextureLoader,
    TEXTURE_KEYS.map((key) => TEXTURE_MAP[key]),
  );

  return useMemo(() => {
    const map = {} as Record<TextureKey, THREE.Texture>;
    TEXTURE_KEYS.forEach((key, i) => {
      const tex = loaded[i].clone();
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      map[key] = tex;
    });
    return map;
  }, [loaded]);
}

/** Glass material shared by all `Glass*` meshes; reflects the skybox env map. */
export function useGlassMaterial(envMap: THREE.Texture) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        opacity: 1,
        color: 0xfbfbfb,
        metalness: 0,
        roughness: 0,
        ior: 3,
        thickness: 0.01,
        specularIntensity: 1,
        envMap,
        envMapIntensity: 1,
        depthWrite: false,
        specularColor: 0xfbfbfb,
      }),
    [envMap],
  );
}
