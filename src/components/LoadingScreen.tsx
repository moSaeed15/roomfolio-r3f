import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '../store';
import { cn } from '../cn';

/** Which visual state the loading screen is in. */
type Phase = 'loading' | 'ready' | 'entering';

const BUTTON_LABEL: Record<Phase, string> = {
  loading: 'Loading...',
  ready: 'Enter!',
  entering: '! أهلاً',
};

const BUTTON_BASE =
  'rounded-2xl px-10 py-4 text-[42px] leading-none outline-none transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-md:px-10 max-md:py-3.5 max-md:text-[30px]';

const BUTTON_VARIANT: Record<Phase, string> = {
  loading: 'cursor-default border-none bg-transparent text-[#e6dede]',
  ready:
    'cursor-pointer border-8 border-[#604485] bg-[#a06cad] text-[#e6dede] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] hover:scale-[1.3]',
  entering:
    'cursor-default border-8 border-base-purple bg-[#ead7ef] text-base-purple',
};

export default function LoadingScreen() {
  const { loaded, reveal } = useApp();
  const screenRef = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(false);
  const [gone, setGone] = useState(false);

  const phase: Phase = entering ? 'entering' : loaded ? 'ready' : 'loading';

  const handleEnter = () => {
    if (phase !== 'ready') return;
    setEntering(true);

    const screen = screenRef.current!;
    gsap
      .timeline()
      .to(screen, {
        scale: 0.5,
        duration: 1.2,
        delay: 0.25,
        ease: 'back.in(1.8)',
      })
      .to(
        screen,
        {
          yPercent: 200,
          rotateX: 45,
          rotateY: -35,
          duration: 1.2,
          ease: 'back.in(1.8)',
          onComplete: () => {
            reveal();
            setGone(true);
          },
        },
        '-=0.1',
      );
  };

  if (gone) return null;

  return (
    <div
      ref={screenRef}
      className={cn(
        'fixed -inset-3 z-999999 flex items-center justify-center overflow-hidden rounded-3xl bg-modal-bg',
        loaded ? 'border-8 border-base-purple' : 'border-0',
      )}
      style={{
        perspective: '1000px',
        backgroundColor: entering ? 'hsl(31, 32%, 80%)' : undefined,
      }}
    >
      <button
        onClick={handleEnter}
        disabled={phase !== 'ready'}
        className={cn(BUTTON_BASE, BUTTON_VARIANT[phase])}
      >
        {BUTTON_LABEL[phase]}
      </button>
    </div>
  );
}
