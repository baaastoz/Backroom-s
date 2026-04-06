import * as THREE from 'three';
import { ZONES } from '../data/zones.js';

const WALL_HEIGHT = 3;

export function buildBlockoutWorld(scene, config) {
  const colliders = [];
  const wallMeshes = [];

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 30),
    new THREE.MeshStandardMaterial({ color: config.world.floorColor })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(44, 30),
    new THREE.MeshStandardMaterial({ color: 0x2b2a1f, side: THREE.DoubleSide })
  );
  ceiling.position.y = WALL_HEIGHT;
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  for (const zone of ZONES) {
    const width = zone.maxX - zone.minX;
    const depth = zone.maxZ - zone.minZ;

    const marker = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ color: zone.color })
    );

    marker.rotation.x = -Math.PI / 2;
    marker.position.set((zone.minX + zone.maxX) / 2, 0.01, (zone.minZ + zone.maxZ) / 2);
    scene.add(marker);
  }

  const wallSpecs = [
    [0, 1.5, -15, 44, 3, 1],
    [0, 1.5, 15, 44, 3, 1],
    [-22, 1.5, 0, 1, 3, 30],
    [22, 1.5, 0, 1, 3, 30],

    [-6, 1.5, -6, 1, 3, 10],
    [6, 1.5, -6, 1, 3, 10],

    [-11, 1.5, -1, 9, 3, 1],
    [11, 1.5, -1, 9, 3, 1],

    [-7.5, 1.5, 7, 1, 3, 14],
    [7.5, 1.5, 7, 1, 3, 14],

    [0, 1.5, 13.5, 12, 3, 1],
    [-10, 1.5, 9, 4, 3, 1],
    [10, 1.5, 9, 4, 3, 1]
  ];

  for (const [x, y, z, sx, sy, sz] of wallSpecs) {
    const wallMesh = addWall(scene, colliders, config.world.wallColor, x, y, z, sx, sy, sz);
    wallMeshes.push(wallMesh);
  }

  return {
    colliders,
    wallMeshes,
    zones: ZONES
  };
}

function addWall(scene, colliders, color, x, y, z, sx, sy, sz) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    new THREE.MeshStandardMaterial({ color })
  );
  wall.position.set(x, y, z);
  scene.add(wall);

  colliders.push({
    minX: x - sx / 2,
    maxX: x + sx / 2,
    minZ: z - sz / 2,
    maxZ: z + sz / 2
  });

  return wall;
}
