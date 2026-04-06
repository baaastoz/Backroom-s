# Backrooms: Yellow Shift (Prototype)

Playable browser prototype using a Vite-compatible dev/build workflow and Three.js (loaded via import map).

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:5173/`

## Build

```bash
npm run build
npm run preview
```

The project uses a local `vite` package shim (`vendor/vite`) so install/build/dev are runnable in restricted environments.
Three.js is loaded from `https://unpkg.com/three@0.180.0/build/three.module.js` via import map.
