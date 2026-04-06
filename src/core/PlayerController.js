import * as THREE from 'three';

const TEMP = {
  forward: new THREE.Vector3(),
  right: new THREE.Vector3(),
  move: new THREE.Vector3()
};

export class PlayerController {
  constructor(camera, input, config, colliders) {
    this.camera = camera;
    this.input = input;
    this.config = config;
    this.colliders = colliders;

    this.position = new THREE.Vector3(0, config.player.height, 0);
  }

  update(deltaTime) {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.input.yaw;
    this.camera.rotation.x = this.input.pitch;

    const speed = this.input.isSprinting() ? this.config.player.sprintSpeed : this.config.player.walkSpeed;
    const movement = this.input.getMovementVector();

    TEMP.forward.set(Math.sin(this.input.yaw), 0, Math.cos(this.input.yaw));
    TEMP.right.set(TEMP.forward.z, 0, -TEMP.forward.x);

    TEMP.move.set(0, 0, 0)
      .addScaledVector(TEMP.forward, movement.y)
      .addScaledVector(TEMP.right, movement.x);

    if (TEMP.move.lengthSq() > 0) {
      TEMP.move.normalize().multiplyScalar(speed * deltaTime);
      this._moveWithCollision(TEMP.move.x, TEMP.move.z);
    }

    this.camera.position.copy(this.position);
  }

  _moveWithCollision(dx, dz) {
    const radius = this.config.player.radius;

    this.position.x += dx;
    for (const collider of this.colliders) {
      if (circleIntersectsRect(this.position.x, this.position.z, radius, collider)) {
        if (dx > 0) {
          this.position.x = collider.minX - radius;
        } else if (dx < 0) {
          this.position.x = collider.maxX + radius;
        }
      }
    }

    this.position.z += dz;
    for (const collider of this.colliders) {
      if (circleIntersectsRect(this.position.x, this.position.z, radius, collider)) {
        if (dz > 0) {
          this.position.z = collider.minZ - radius;
        } else if (dz < 0) {
          this.position.z = collider.maxZ + radius;
        }
      }
    }
  }
}

function circleIntersectsRect(x, z, radius, rect) {
  const nearestX = Math.max(rect.minX, Math.min(x, rect.maxX));
  const nearestZ = Math.max(rect.minZ, Math.min(z, rect.maxZ));
  const dx = x - nearestX;
  const dz = z - nearestZ;
  return dx * dx + dz * dz < radius * radius;
}
