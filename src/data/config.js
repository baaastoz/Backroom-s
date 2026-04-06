export const GAME_CONFIG = {
  player: {
    height: 1.7,
    radius: 0.35,
    walkSpeed: 3.1,
    sprintSpeed: 5.4,
    mouseSensitivity: 0.0022,
    interactionRange: 1.6
  },
  world: {
    totalFuses: 3,
    ambientColor: 0x4c4b36,
    floorColor: 0x6f6543,
    wallColor: 0xe0cc72,
    fogColor: 0x0f0f0a
  },
  systems: {
    safeSpawnSeconds: 25,
    minSpawnDistance: 22,
    hostilesEnabled: false,
    spawnCheckInterval: 1.5
  }
};
