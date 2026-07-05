import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useApp } from "../store";
import type { ModalName } from "../store";
import { ABOUT, PROJECTS, CONTACT_LINKS } from "../content";

const TITLES: Record<Exclude<ModalName, null>, string> = {
  about: "About Me",
  work: "My Work",
  contact: "Get in Touch",
};

export default function Modals() {
  const { modal, closeModal } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Fade + pop the modal in whenever one opens.
  useEffect(() => {
    if (!modal) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    const tl = gsap.timeline();
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo(
      panel,
      { opacity: 0, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
      "-=0.15",
    );
    return () => {
      tl.kill();
    };
  }, [modal]);

  // Close on Escape.
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  if (!modal) return null;

  return (
    <div
      ref={backdropRef}
      onClick={closeModal}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[modal]}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-160 overflow-y-auto rounded-2xl border-4 border-base-purple bg-modal-bg p-8 text-base-black shadow-[0_12px_40px_rgba(0,0,0,0.25)] max-md:p-6"
      >
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl leading-none text-base-purple transition-colors hover:bg-base-purple/10"
        >
          ×
        </button>

        <h1 className="mb-6 text-3xl text-base-purple max-md:text-2xl">
          {TITLES[modal]}
        </h1>

        {modal === "about" && <AboutBody />}
        {modal === "work" && <WorkBody />}
        {modal === "contact" && <ContactBody />}
      </div>
    </div>
  );
}

function AboutBody() {
  return (
    <div>
      <p className="text-xl text-base-black">{ABOUT.name}</p>
      <p className="mb-5 text-base text-base-purple">{ABOUT.role}</p>

      {ABOUT.paragraphs.map((text, i) => (
        <p key={i} className="mb-4 text-[17px] leading-relaxed text-base-black/80">
          {text}
        </p>
      ))}

      <h2 className="mb-2 mt-6 text-lg text-base-purple">Skills</h2>
      <ul className="flex flex-wrap gap-2">
        {ABOUT.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full bg-base-purple/10 px-3 py-1 text-sm text-base-purple"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkBody() {
  return (
    <div className="flex flex-col gap-4">
      {PROJECTS.map((project) => (
        <article
          key={project.title}
          className="rounded-xl border border-base-purple/20 bg-base-white/60 p-5"
        >
          <h2 className="text-xl text-base-black">{project.title}</h2>
          <p className="mt-1 text-[15px] leading-relaxed text-base-black/80">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-base-purple/10 px-2 py-0.5 text-xs text-base-purple"
              >
                {tag}
              </span>
            ))}
          </div>

          {(project.live || project.github) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-lg bg-base-purple px-4 py-2 text-sm text-base-white transition-opacity hover:opacity-85"
                >
                  Live site →
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-lg border border-base-purple px-4 py-2 text-sm text-base-purple transition-colors hover:bg-base-purple/5"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ContactBody() {
  return (
    <div>
      <p className="mb-5 text-[17px] leading-relaxed text-base-black/80">
        Feel free to reach out — I'm always happy to connect.
      </p>
      <ul className="flex flex-col gap-3">
        {CONTACT_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="flex items-center justify-between rounded-xl border border-base-purple/20 bg-base-white/60 px-5 py-4 transition-colors hover:border-base-purple hover:bg-base-purple/5"
            >
              <span className="text-base text-base-purple">{link.label}</span>
              <span className="text-[15px] text-base-black/80">{link.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
