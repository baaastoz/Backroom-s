# AGENTS.md

## Project
This repository is for a browser-based first-person horror game prototype:
"Backrooms: Yellow Shift".

## Tech direction
- Use Three.js
- Use plain modular JavaScript (ES modules)
- Use Vite for local development
- Do not use React for the game
- Keep the game easy to run locally in browser

## Gameplay priorities
- First-person movement
- Mouse look with pointer lock
- WASD movement
- Shift sprint
- E interaction
- Atmosphere first
- No combat
- Safe spawn zone
- Enemies must never spawn beside the player
- Player must walk through the map and explore

## Scope rules
Build only what is needed for a playable V2 prototype:
- 1 floor
- 5 zones
- 3 fuses
- 1 main hostile (Smiler)
- 1 secondary hostile (Carpet Worm)
- 1 strange helpful entity (Sir Lamp)
- 1 final exit/elevator

## Code rules
- Keep code modular
- Use clear file structure
- Centralize tunable values in config
- Prefer placeholder geometry first, but keep asset loading ready
- After changes, run the project checks/build and fix errors
- Keep performance reasonable
- Do not overcomplicate systems