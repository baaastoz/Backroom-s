import * as THREE from 'three';

export class Input {
  constructor(domElement, startButton, lockOverlay, mouseSensitivity) {
    this.domElement = domElement;
    this.startButton = startButton;
    this.lockOverlay = lockOverlay;

    this.keys = new Set();
    this.yaw = 0;
    this.pitch = 0;
    this.interactPressed = false;
    this.mouseSensitivity = mouseSensitivity;

    this._wireEvents();
  }

  _wireEvents() {
    this.startButton.addEventListener('click', () => {
      this.domElement.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      const locked = document.pointerLockElement === this.domElement;
      this.lockOverlay.style.display = locked ? 'none' : 'grid';
    });

    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyE') {
        this.interactPressed = true;
      }
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });

    window.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement !== this.domElement) {
        return;
      }

      this.yaw -= event.movementX * this.mouseSensitivity;
      this.pitch -= event.movementY * this.mouseSensitivity;
      this.pitch = THREE.MathUtils.clamp(this.pitch, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01);
    });
  }

  consumeInteract() {
    const pressed = this.interactPressed;
    this.interactPressed = false;
    return pressed;
  }

  getMovementVector() {
    const direction = new THREE.Vector2();
    if (this.keys.has('KeyW')) direction.y += 1;
    if (this.keys.has('KeyS')) direction.y -= 1;
    if (this.keys.has('KeyA')) direction.x -= 1;
    if (this.keys.has('KeyD')) direction.x += 1;
    return direction.lengthSq() > 0 ? direction.normalize() : direction;
  }

  isSprinting() {
    return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
  }
}
