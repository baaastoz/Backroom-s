import * as THREE from 'three';
import { GAME_CONFIG } from '../data/config.js';
import { HOSTILE_SPAWN_POINTS } from '../data/spawnPoints.js';
import { Input } from './Input.js';
import { PlayerController } from './PlayerController.js';
import { buildBlockoutWorld } from '../world/MapBuilder.js';
import { Fuse } from '../entities/Fuse.js';
import { ObjectiveSystem } from '../systems/ObjectiveSystem.js';
import { ZoneSystem } from '../systems/ZoneSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';

export class Game {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x272111);
    this.scene.fog = new THREE.Fog(GAME_CONFIG.world.fogColor, 8, 55);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.rootElement.appendChild(this.renderer.domElement);

    this.input = new Input(
      this.renderer.domElement,
      document.getElementById('start-button'),
      document.getElementById('lock-overlay'),
      GAME_CONFIG.player.mouseSensitivity
    );

    const { colliders, wallMeshes } = buildBlockoutWorld(this.scene, GAME_CONFIG);
    this.player = new PlayerController(this.camera, this.input, GAME_CONFIG, colliders);

    this.fuses = [
      new Fuse(new THREE.Vector3(-13, 1.05, 5), GAME_CONFIG.player.interactionRange),
      new Fuse(new THREE.Vector3(13, 1.05, 5), GAME_CONFIG.player.interactionRange),
      new Fuse(new THREE.Vector3(0, 1.05, 10.5), GAME_CONFIG.player.interactionRange)
    ];

    for (const fuse of this.fuses) {
      fuse.addToScene(this.scene);
    }

    this.zoneSystem = new ZoneSystem();
    this.spawnSystem = new SpawnSystem(GAME_CONFIG, this.zoneSystem, HOSTILE_SPAWN_POINTS, wallMeshes);

    this.objectiveSystem = new ObjectiveSystem(GAME_CONFIG.world.totalFuses, {
      objectiveElement: document.getElementById('objective'),
      fuseElement: document.getElementById('fuses'),
      zoneElement: document.getElementById('zone'),
      protectionElement: document.getElementById('protection'),
      spawnRuleElement: document.getElementById('spawn-rules')
    });

    this._setupLights();

    this.clock = new THREE.Clock();
    window.addEventListener('resize', () => this._onResize());
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(GAME_CONFIG.world.ambientColor, 0.55);
    this.scene.add(ambient);

    const ceilingLight = new THREE.PointLight(0xffeea0, 13, 65);
    ceilingLight.position.set(0, 2.5, 0);
    this.scene.add(ceilingLight);

    const fillLight = new THREE.DirectionalLight(0xb6c6ff, 0.35);
    fillLight.position.set(-8, 10, -2);
    this.scene.add(fillLight);
  }

  start() {
    this.renderer.setAnimationLoop(() => this._update());
  }

  _update() {
    const deltaTime = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    this.player.update(deltaTime);

    const interacted = this.input.consumeInteract();
    for (const fuse of this.fuses) {
      fuse.update(elapsed);
      if (fuse.tryCollect(this.player.position, interacted)) {
        this.objectiveSystem.collectFuse();
      }
    }

    const zone = this.zoneSystem.update(this.player.position);
    this.spawnSystem.update(deltaTime, elapsed, this.player.position, this.camera);

    this.objectiveSystem.update(
      zone?.name ?? 'Uncharted Area',
      this.spawnSystem.debugState.safeProtectionRemaining,
      this.spawnSystem.debugState
    );

    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
