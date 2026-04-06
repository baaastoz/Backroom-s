import * as THREE from 'three';

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const toSpawn = new THREE.Vector3();
const cameraForward = new THREE.Vector3();

export class SpawnSystem {
  constructor(config, zoneSystem, spawnPoints, wallMeshes) {
    this.config = config;
    this.zoneSystem = zoneSystem;
    this.spawnPoints = spawnPoints;
    this.wallMeshes = wallMeshes;

    this.raycaster = new THREE.Raycaster();

    this.safeSpawnProtectionExpiresAt = config.systems.safeSpawnSeconds;
    this.timeSinceLastCheck = 0;

    this.debugState = {
      safeProtectionRemaining: config.systems.safeSpawnSeconds,
      lastRejectedReason: 'Awaiting first spawn validation check',
      lastCandidateId: null,
      validatedSpawnPoint: null
    };
  }

  update(deltaTime, elapsedTime, playerPosition, camera) {
    this.timeSinceLastCheck += deltaTime;
    this.debugState.safeProtectionRemaining = Math.max(0, this.safeSpawnProtectionExpiresAt - elapsedTime);

    if (this.timeSinceLastCheck < this.config.systems.spawnCheckInterval) {
      return;
    }

    this.timeSinceLastCheck = 0;

    const inSafeZone = this.zoneSystem.isPlayerInSafeZone(playerPosition);
    const hasTimeProtection = elapsedTime < this.safeSpawnProtectionExpiresAt;

    if (inSafeZone || hasTimeProtection) {
      this.debugState.lastRejectedReason = inSafeZone
        ? 'Rejected: player is inside safe zone'
        : 'Rejected: safe spawn protection timer active';
      this.debugState.validatedSpawnPoint = null;
      return;
    }

    const result = this.findValidSpawnPoint(playerPosition, camera);
    if (!result) {
      this.debugState.lastRejectedReason = 'Rejected: no spawn points passed validation rules';
      this.debugState.validatedSpawnPoint = null;
      return;
    }

    this.debugState.validatedSpawnPoint = result;
    this.debugState.lastCandidateId = result.id;

    if (this.config.systems.hostilesEnabled) {
      this.debugState.lastRejectedReason = `Spawn validated (${result.id})`; // future spawn hook
    } else {
      this.debugState.lastRejectedReason = `Spawn validated (${result.id}) but hostiles disabled`;
    }
  }

  findValidSpawnPoint(playerPosition, camera) {
    for (const point of this.spawnPoints) {
      const rejectionReason = this.getRejectionReason(point, playerPosition, camera);
      if (!rejectionReason) {
        return point;
      }

      this.debugState.lastCandidateId = point.id;
      this.debugState.lastRejectedReason = `Rejected ${point.id}: ${rejectionReason}`;
    }

    return null;
  }

  getRejectionReason(spawnPoint, playerPosition, camera) {
    if (this.zoneSystem.isPlayerInSafeZone(playerPosition)) {
      return 'player is in safe zone';
    }

    const distance = playerPosition.distanceTo(spawnPoint.position);
    if (distance < this.config.systems.minSpawnDistance) {
      return `too close (${distance.toFixed(1)}m < ${this.config.systems.minSpawnDistance}m)`;
    }

    if (isInPlayerFov(spawnPoint.position, camera)) {
      return 'inside player FOV';
    }

    if (hasDirectVisibility(spawnPoint.position, camera, this.raycaster, this.wallMeshes)) {
      return 'in direct visible space';
    }

    return null;
  }
}

function isInPlayerFov(spawnPosition, camera) {
  camera.getWorldDirection(cameraForward).setY(0).normalize();

  toSpawn.copy(spawnPosition).sub(camera.position).setY(0);
  if (toSpawn.lengthSq() < 0.0001) {
    return true;
  }
  toSpawn.normalize();

  const dot = cameraForward.dot(toSpawn);
  const halfFovRadians = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const threshold = Math.cos(halfFovRadians);
  return dot >= threshold;
}

function hasDirectVisibility(spawnPosition, camera, raycaster, occluders) {
  toSpawn.copy(spawnPosition).sub(camera.position);
  const distance = toSpawn.length();
  if (distance <= 0.001) {
    return true;
  }

  const direction = toSpawn.normalize();
  raycaster.set(camera.position, direction);
  raycaster.near = 0;
  raycaster.far = distance;
  raycaster.layers.enableAll();
  raycaster.ray.direction.normalize();
  raycaster.ray.origin.addScaledVector(WORLD_UP, 0.02);

  const hits = raycaster.intersectObjects(occluders, false);
  return hits.length === 0;
}
