import { Html } from '@react-three/drei';
import { AppContext, useApp } from '../store';
import Slideshow from './Slideshow';

const SCREEN = {
  position: [-0.6773, 1.601, 0.1715] as [number, number, number],
  rotation: [0, Math.PI / 2, 0] as [number, number, number],
  width: 0.5127 * 0.5,
  height: 0.3051 * 0.5,
};

const CARD_PX_WIDTH = 900;
const SCREEN_SCALE = 0.012;

const LABEL_POSITION: [number, number, number] = [
  SCREEN.position[0],
  SCREEN.position[1] + SCREEN.height / 2 + 0.1,
  SCREEN.position[2],
];

export default function ScreenHtml() {
  const store = useApp();
  const { focusScreen, revealed, enterScreen } = store;

  const cardPxHeight = (SCREEN.height / SCREEN.width) * CARD_PX_WIDTH;

  return (
    <>
      {revealed && !focusScreen && (
        <Html
          position={LABEL_POSITION}
          center
          distanceFactor={2}
          occlude={false}
        >
          <button
            onClick={enterScreen}
            className="animate-bounce cursor-pointer whitespace-nowrap rounded-full border-2 border-base-purple bg-modal-bg/90 px-3 py-1.5 text-sm text-base-purple shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur transition-transform hover:scale-105"
          >
            Projects ↓
          </button>
        </Html>
      )}

      {focusScreen && (
        <Html
          transform
          position={SCREEN.position}
          rotation={SCREEN.rotation}
          scale={SCREEN_SCALE}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <AppContext.Provider value={store}>
            <div
              style={{
                width: `${CARD_PX_WIDTH}px`,
                height: `${cardPxHeight}px`,
                pointerEvents: 'auto',
              }}
            >
              <Slideshow />
            </div>
          </AppContext.Provider>
        </Html>
      )}
    </>
  );
}
