import * as THREE from 'three';

export const HOSTILE_SPAWN_POINTS = [
  { id: 'sp_office_deep', hostileType: 'smiler', zoneId: 'office_wing', position: new THREE.Vector3(-15, 1.0, 7) },
  { id: 'sp_office_entry', hostileType: 'smiler', zoneId: 'office_wing', position: new THREE.Vector3(-9, 1.0, 2) },
  { id: 'sp_maint_deep', hostileType: 'carpet_worm', zoneId: 'maintenance_wing', position: new THREE.Vector3(15, 1.0, 7) },
  { id: 'sp_maint_entry', hostileType: 'carpet_worm', zoneId: 'maintenance_wing', position: new THREE.Vector3(9, 1.0, 2) },
  { id: 'sp_exit_back', hostileType: 'smiler', zoneId: 'exit_room', position: new THREE.Vector3(0, 1.0, 12.5) },
  { id: 'sp_corridor_north', hostileType: 'smiler', zoneId: 'central_corridor', position: new THREE.Vector3(0, 1.0, 8) }
];
