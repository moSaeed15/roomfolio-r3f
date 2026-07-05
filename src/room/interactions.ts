import type * as THREE from "three";
import { SOCIAL_LINKS, type ModalName } from "../store";

/** Mesh-name fragment -> modal it opens. */
const MODAL_TRIGGERS: Record<string, Exclude<ModalName, null>> = {
  Work_Button: "work",
  About_Button: "about",
  Contact_Button: "contact",
};

/** Open an external link in a new, opener-less tab. */
function openExternal(url: string) {
  const win = window.open();
  if (win) {
    win.opener = null;
    win.location.href = url;
  }
}

/**
 * Resolve a click on a scene object to its side effect: open a social link or
 * a modal, based on the mesh name. Returns without doing anything if the mesh
 * isn't interactive.
 */
export function handleRoomClick(
  object: THREE.Object3D,
  openModal: (name: Exclude<ModalName, null>) => void,
) {
  const { name } = object;

  for (const [key, url] of Object.entries(SOCIAL_LINKS)) {
    if (name.includes(key)) {
      openExternal(url);
      return;
    }
  }

  for (const [fragment, modal] of Object.entries(MODAL_TRIGGERS)) {
    if (name.includes(fragment)) {
      openModal(modal);
      return;
    }
  }
}
