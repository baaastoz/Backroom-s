# Backrooms: Yellow Shift (Prototype V2 Foundation)

Playable browser prototype built with **Vite + Three.js** using plain modular JavaScript.

## Included in this prototype

- First-person camera with pointer lock
- WASD movement + Shift sprint
- Basic wall collision
- 5 zone blockout map:
  - Safe Spawn / Yellow Lobby
  - Central Corridor
  - Office Wing
  - Maintenance Wing
  - Exit Room
- 3 fuse pickups (press **E** near fuse)
- Safe spawn protection timer (25 seconds)
- ZoneSystem (tracks current player zone)
- Spawn points data + SpawnSystem validation rules for future hostiles
  - reject if player is in safe zone
  - reject if spawn is closer than 22m
  - reject if spawn is inside player FOV
  - reject if spawn is in direct visible space
- Hostile spawning currently disabled intentionally, with full validation flow active
- UI for objective, fuse count, zone, protection timer, and spawn validator status

## Project structure

```text
src/
  core/
  world/
  entities/
  systems/
  data/
assets/
  audio/
  textures/
  models/
```

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```
