import * as THREE from 'three';

export class Fuse {
  constructor(position, interactionRange) {
    this.position = position.clone();
    this.collected = false;
    this.interactionRange = interactionRange;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.22, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xff9f1c, emissive: 0x552200 })
    );
    this.mesh.position.copy(position);
  }

  addToScene(scene) {
    scene.add(this.mesh);
  }

  update(time) {
    if (this.collected) {
      return;
    }
    this.mesh.position.y = this.position.y + Math.sin(time * 2.2 + this.position.x) * 0.05;
    this.mesh.rotation.y += 0.015;
  }

  tryCollect(playerPosition, interactionPressed) {
    if (this.collected || !interactionPressed) {
      return false;
    }

    const distance = playerPosition.distanceTo(this.mesh.position);
    if (distance < this.interactionRange) {
      this.collected = true;
      this.mesh.visible = false;
      return true;
    }

    return false;
  }
}
