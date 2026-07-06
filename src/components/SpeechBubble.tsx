import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { useApp } from '../store';

const VISIBLE_MS = 3200;

interface SpeechBubbleProps {
  message: string;
  position: [number, number, number];
}

/**
 * A pointer-following speech bubble that pops in and auto-dismisses. Mount it
 * with a `key` that changes on each trigger so the timer and animation reset.
 */
export default function SpeechBubble({ message, position }: SpeechBubbleProps) {
  const { lightsOn } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDismissed(true), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.6, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)' },
    );
    return () => {
      tween.kill();
    };
  }, []);

  if (dismissed) return null;

  return (
    <Html position={position} center distanceFactor={2} occlude={false}>
      <div
        ref={ref}
        style={{ filter: lightsOn ? undefined : 'brightness(0.5)' }}
        className="pointer-events-none relative whitespace-nowrap rounded-2xl border-2 border-base-purple bg-base-white px-3 py-1.5 text-sm text-base-black shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-[filter] duration-500"
      >
        {message}
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-base-purple bg-base-white" />
      </div>
    </Html>
  );
}
