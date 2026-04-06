export const ZONES = [
  {
    id: 'safe_spawn',
    name: 'Safe Spawn / Yellow Lobby',
    isSafe: true,
    minX: -6,
    maxX: 6,
    minZ: -14,
    maxZ: -6,
    color: 0x6f824a
  },
  {
    id: 'central_corridor',
    name: 'Central Corridor',
    isSafe: false,
    minX: -4,
    maxX: 4,
    minZ: -9,
    maxZ: 9,
    color: 0x5b5a35
  },
  {
    id: 'office_wing',
    name: 'Office Wing',
    isSafe: false,
    minX: -18,
    maxX: -6,
    minZ: -1,
    maxZ: 9,
    color: 0x77684f
  },
  {
    id: 'maintenance_wing',
    name: 'Maintenance Wing',
    isSafe: false,
    minX: 6,
    maxX: 18,
    minZ: -1,
    maxZ: 9,
    color: 0x5a5f45
  },
  {
    id: 'exit_room',
    name: 'Exit Room',
    isSafe: false,
    minX: -5,
    maxX: 5,
    minZ: 9,
    maxZ: 14,
    color: 0x4c6d7a
  }
];
