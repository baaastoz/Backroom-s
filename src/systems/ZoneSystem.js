import { ZONES } from '../data/zones.js';

export class ZoneSystem {
  constructor() {
    this.zones = ZONES;
    this.currentZone = null;
  }

  update(playerPosition) {
    this.currentZone = this.getZoneAtPosition(playerPosition);
    return this.currentZone;
  }

  getZoneAtPosition(position) {
    return this.zones.find((zone) => inZone(position.x, position.z, zone)) ?? null;
  }

  isPlayerInSafeZone(position) {
    const zone = this.getZoneAtPosition(position);
    return zone?.isSafe ?? false;
  }

  getCurrentZoneName() {
    return this.currentZone?.name ?? 'Uncharted Area';
  }
}

function inZone(x, z, zone) {
  return x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ;
}
