import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/** Load a DRACO-compressed .glb, decoders served from /public/draco. */
export function useDracoGLTF(url: string) {
  return useLoader(GLTFLoader, url, (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    (loader as GLTFLoader).setDRACOLoader(draco);
  });
}
