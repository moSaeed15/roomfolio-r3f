import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '../store';
import { PROJECTS } from '../content';

export default function Slideshow() {
  const { focusScreen } = useApp();
  if (!focusScreen) return null;
  return <Deck />;
}

function Deck() {
  const { exitScreen } = useApp();
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const count = PROJECTS.length;
  const next = () => setIndex(i => (i + 1) % count);
  const prev = () => setIndex(i => (i - 1 + count) % count);

  useEffect(() => {
    if (!cardRef.current) return;
    const tween = gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') exitScreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const project = PROJECTS[index];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-modal-bg p-9.5 text-base-black">
      <div ref={cardRef} className="flex h-full w-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[22px] text-base-purple">
            Project {index + 1} / {count}
          </span>
          <span className="flex gap-2.5">
            {PROJECTS.map((p, i) => (
              <button
                key={p.title}
                aria-label={`Go to ${p.title}`}
                onClick={() => setIndex(i)}
                className={
                  'h-4 w-4 cursor-pointer rounded-full transition-colors ' +
                  (i === index ? 'bg-base-purple' : 'bg-base-purple/30')
                }
              />
            ))}
          </span>
        </div>

        <h1 className="text-[52px] leading-tight text-base-black">
          {project.title}
        </h1>

        <div className="mt-2 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="rounded-md bg-base-purple/10 px-3 py-1 text-[19px] text-base-purple"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[24px] leading-relaxed text-base-black/80">
          {project.description}
        </p>

        {(project.live || project.github) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-lg bg-base-purple px-5 py-2.5 text-[22px] text-base-white transition-opacity hover:opacity-85"
              >
                Live site →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-lg border border-base-purple px-5 py-2.5 text-[22px] text-base-purple transition-colors hover:bg-base-purple/5"
              >
                GitHub
              </a>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <button
            onClick={prev}
            className="cursor-pointer rounded-lg px-4 py-2 text-[24px] text-base-purple transition-colors hover:bg-base-purple/10"
          >
            ‹ Prev
          </button>
          <button
            onClick={exitScreen}
            className="cursor-pointer rounded-lg border border-base-purple px-5 py-2.5 text-[22px] text-base-purple transition-colors hover:bg-base-purple/5"
          >
            Back to room
          </button>
          <button
            onClick={next}
            className="cursor-pointer rounded-lg px-4 py-2 text-[24px] text-base-purple transition-colors hover:bg-base-purple/10"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
