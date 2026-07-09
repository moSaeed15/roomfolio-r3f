import type * as THREE from "three";
import { SOCIAL_LINKS, type ModalName } from "../store";

const MODAL_TRIGGERS: Record<string, Exclude<ModalName, null>> = {
  Work_Button: "work",
  About_Button: "about",
  Contact_Button: "contact",
};

function openExternal(url: string) {
  const win = window.open();
  if (win) {
    win.opener = null;
    win.location.href = url;
  }
}

interface ClickHandlers {
  openModal: (name: Exclude<ModalName, null>) => void;
  enterScreen: () => void;
  toggleLights: () => void;
  nextBmoGreeting: () => void;
  nextMugQuip: () => void;
  nextQuote: () => void;
}

export function handleRoomClick(
  object: THREE.Object3D,
  {
    openModal,
    enterScreen,
    toggleLights,
    nextBmoGreeting,
    nextMugQuip,
    nextQuote,
  }: ClickHandlers,
) {
  const { name } = object;

  for (const [key, url] of Object.entries(SOCIAL_LINKS)) {
    if (name.includes(key)) {
      openExternal(url);
      return;
    }
  }

  if (name === "Screen") {
    enterScreen();
    return;
  }

  // Portfolio icon opens the resume PDF in a new tab.
  if (name.includes("Portfolio")) {
    openExternal("/Mohammed_ElSaeed.pdf");
    return;
  }

  if (name.includes("Lamp")) {
    toggleLights();
    return;
  }

  if (name.includes("BMO")) {
    nextBmoGreeting();
    return;
  }

  if (name.includes("Coffee_Mug")) {
    nextMugQuip();
    return;
  }

  if (name.includes("Quote")) {
    nextQuote();
    return;
  }

  for (const [fragment, modal] of Object.entries(MODAL_TRIGGERS)) {
    if (name.includes(fragment)) {
      openModal(modal);
      return;
    }
  }
}
