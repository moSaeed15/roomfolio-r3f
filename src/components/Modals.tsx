import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useApp } from "../store";
import type { ModalName } from "../store";

const CONTENT: Record<Exclude<ModalName, null>, string> = {
  work: "work content",
  about: "about content",
  contact: "contact content",
};

export default function Modals() {
  const { modal, closeModal } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modal || !ref.current) return;
    gsap.set(ref.current, { opacity: 0 });
    gsap.to(ref.current, { opacity: 1, duration: 0.5 });
  }, [modal]);

  if (!modal) return null;

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 z-[9999] w-full max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-modal-bg p-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
    >
      <h1 className="modal-title text-2xl">{CONTENT[modal]}</h1>
      <button
        className="mt-4 cursor-pointer rounded-md border border-base-purple px-4 py-2"
        onClick={closeModal}
      >
        EXIT MODAL
      </button>
    </div>
  );
}
