import { createContext, useContext } from 'react';

export type ModalName = 'work' | 'about' | 'contact' | null;

export interface AppStore {
  /** Which modal is currently open (null = none). */
  modal: ModalName;
  openModal: (name: Exclude<ModalName, null>) => void;
  closeModal: () => void;

  /** True once all assets have finished loading. */
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Bumped when the user clicks "Enter!" to trigger the intro animation. */
  revealed: boolean;
  reveal: () => void;

  /** True while the camera is flown into the monitor showing the projects. */
  focusScreen: boolean;
  enterScreen: () => void;
  exitScreen: () => void;

  /** True once the user has clicked anything in the room (first interaction). */
  explored: boolean;
  markExplored: () => void;

  /** Room light state, toggled by clicking the lamp. */
  lightsOn: boolean;
  toggleLights: () => void;

  /** Index of the greeting BMO is currently showing (-1 = none). */
  bmoGreeting: number;
  nextBmoGreeting: () => void;

  /** Bumped each time the coffee mug is clicked (-1 = never). */
  mugQuip: number;
  nextMugQuip: () => void;
}

export const AppContext = createContext<AppStore | null>(null);

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppContext.Provider>');
  return ctx;
}

export const SOCIAL_LINKS: Record<string, string> = {
  Linkedin: 'https://www.linkedin.com/in/mohammed-el-saeed/',
  GitHub: 'https://github.com/moSaeed15',
};
