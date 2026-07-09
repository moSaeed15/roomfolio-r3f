# RoomFolio (R3F)

An interactive 3D portfolio built as a clickable, explorable room — walk around a desk setup, click objects to trigger animations, open project/about/contact info, and fly the camera into the monitor to browse a slideshow of projects.

This is a **migration of [moSaeed15/RoomFolio](https://github.com/moSaeed15/RoomFolio)** (the original vanilla Three.js version) to **React Three Fiber**, rebuilt with a component-driven scene graph, GSAP-driven animations, and a Tailwind UI layer.

Live at [mosaeed15.com](https://www.mosaeed15.com/).

## Stack

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) for the R3F scene
- [Three.js](https://threejs.org/) with DRACO-compressed GLTF loading
- [GSAP](https://gsap.com/) for intro, hover, and camera-flight animations
- [Tailwind CSS v4](https://tailwindcss.com/) for the UI layer
- [Vite](https://vite.dev/) + TypeScript
- React Compiler (via `babel-plugin-react-compiler`)

## Features

- Baked-texture 3D room scene with intro reveal and hover animations
- Clickable props: lamp (lights toggle), BMO and coffee mug (rotating speech bubbles), wall/desk quote signs (cycling quotes), social links, resume PDF
- Clicking the monitor or the Portfolio icon flies the camera into a framed view of the screen and pins a project slideshow onto the monitor glass
- About / Work / Contact modals

## Getting started

```bash
pnpm install
pnpm dev
```

Other scripts:

```bash
pnpm build     # type-check and build for production
pnpm lint      # run ESLint
pnpm preview   # preview the production build locally
```

## Project structure

- `src/components/` — scene and UI components (`Room`, `CameraRig`, `ScreenHtml`, `Slideshow`, modals, speech bubbles, etc.)
- `src/room/` — non-visual room logic: scene setup/material assignment (`setup.ts`), click/hover interactions (`interactions.ts`), textures, lights, and animations
- `src/store.ts` — app state (modals, camera focus, lights, quote/greeting indices)
- `public/models/` — DRACO-compressed GLTF room model
- `public/textures/` — baked textures and quote images
