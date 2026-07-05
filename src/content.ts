import { SOCIAL_LINKS } from "./store";

/**
 * All human-readable modal copy lives here so the components stay presentational.
 * Fields marked with a leading "[…]" are placeholders — replace them with your
 * real details.
 */

export const ABOUT = {
  name: "Mohammed El-Saeed",
  role: "Frontend Engineer & 3D Web Developer",
  paragraphs: [
    "I build web experiences that go beyond the screen — interactive 3D interfaces, cinematic scroll animations, and full-stack applications that are as technically solid as they are visually compelling. With a background in Biomedical Engineering and two years of production frontend experience, I bring an unconventional perspective to every project I work on.",
    "Currently focused on the intersection of Three.js, React Three Fiber, and real-time web — building things that push what a browser can render. I also model and rig 3D assets in Blender myself, which means I own the full pipeline from geometry to WebGL, not just the integration layer.",
  ],
  skills: [
    "React / Next.js / TypeScript",
    "Three.js / React Three Fiber",
    "Blender (3D Modeling & Rigging)",
    "GSAP / Scroll Animations",
    "Supabase / Full-Stack Development",
  ],
} as const;

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Live deployment — omit to hide the "Live site" button. */
  live?: string;
  /** Source repository — omit to hide the "GitHub" button. */
  github?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "YJTours",
    description:
      "A full-stack luxury tourism booking platform for private Egypt expeditions — featuring a cinematic Three.js particle system, GSAP scroll animations, a multi-step booking flow, and a protected admin dashboard for managing tours and bookings.",
    tags: ["Next.js", "Three.js", "GSAP", "Supabase", "TypeScript"],
    live: "https://yg-tours.vercel.app",
  },
  {
    title: "Cogniverse Dashboard",
    description:
      "A data dashboard built from scratch with a perfect Lighthouse score of 100 — covering authentication, real-time data handling, and a fully custom UI designed in Figma and implemented pixel-perfect in code.",
    tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
  },
  {
    title: "Audiophile",
    description:
      "A multi-page e-commerce site for a premium audio brand, built entirely in vanilla JavaScript with no frameworks — demonstrating solid fundamentals in DOM manipulation, responsive layout, and component structure.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    value: "mohammed.elsaeed1@gmail.com",
    href: "mailto:mohammed.elsaeed1@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "mohammed-el-saeed",
    href: SOCIAL_LINKS.Linkedin,
  },
  {
    label: "GitHub",
    value: "moSaeed15",
    href: SOCIAL_LINKS.GitHub,
  },
];
