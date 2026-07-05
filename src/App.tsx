import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import Modals from "./components/Modals";
import { AppContext, type ModalName, type AppStore } from "./store";

/** Rendered inside <Suspense>; flips `loaded` true once assets have resolved. */
function AssetsReady({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function App() {
  const [modal, setModal] = useState<ModalName>(null);
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const store = useMemo<AppStore>(
    () => ({
      modal,
      openModal: (name) => setModal(name),
      closeModal: () => setModal(null),
      loaded,
      setLoaded,
      revealed,
      reveal: () => setRevealed(true),
    }),
    [modal, loaded, revealed],
  );

  const handleReady = useCallback(() => setLoaded(true), []);

  return (
    <AppContext.Provider value={store}>
      <div id="experience" className="fixed inset-0 h-full w-full overflow-hidden">
        <Canvas
          id="experience-canvas"
          className="h-full w-full"
          // `flat` sets NoToneMapping to match the original raw WebGLRenderer.
          // R3F otherwise defaults to ACESFilmicToneMapping, which remaps the
          // baked lighting/shadow colors and makes the scene look different.
          flat
          dpr={[1, 2]}
          gl={{ antialias: true }}
          camera={{ fov: 35, near: 0.1, far: 1000, position: [2.8, 4.3, 2] }}
        >
          <Suspense fallback={null}>
            <Experience />
            <AssetsReady onReady={handleReady} />
          </Suspense>
        </Canvas>
      </div>

      <Modals />
      <LoadingScreen />
    </AppContext.Provider>
  );
}
