import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { cn } from '../cn';

/** How long after reveal the hint waits before fading in. */
const APPEAR_DELAY_MS = 1500;
/** How long the hint stays if the user never clicks anything. */
const AUTO_HIDE_MS = 8000;

/**
 * A one-time onboarding nudge so visitors realise the room is interactive.
 * Fades in shortly after the intro finishes and disappears on the first room
 * click (see `markExplored`) or after a timeout, whichever comes first.
 */
export default function ExploreHint() {
  const { revealed, focusScreen, explored } = useApp();
  const [shown, setShown] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const appear = window.setTimeout(() => setShown(true), APPEAR_DELAY_MS);
    const hide = window.setTimeout(
      () => setExpired(true),
      APPEAR_DELAY_MS + AUTO_HIDE_MS,
    );
    return () => {
      window.clearTimeout(appear);
      window.clearTimeout(hide);
    };
  }, [revealed]);

  const visible = shown && !expired && !explored && !focusScreen;

  // Keep the node mounted through its fade so the exit transition can play.
  if (!shown) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="flex items-center gap-2 rounded-full border border-base-purple/40 bg-modal-bg/90 px-4 py-2 text-sm text-base-black shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur max-md:text-xs">
        <span className="animate-pulse">👆</span>
        <span>
          Click around to explore — try the{' '}
          <span className="font-semibold text-base-purple">lamp</span>,{' '}
          <span className="font-semibold text-base-purple">computer</span>, or{' '}
          <span className="font-semibold text-base-purple">BMO</span>
        </span>
      </div>
    </div>
  );
}
