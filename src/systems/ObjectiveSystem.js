export class ObjectiveSystem {
  constructor(totalFuses, uiElements) {
    this.totalFuses = totalFuses;
    this.collectedFuses = 0;
    this.ui = uiElements;
  }

  collectFuse() {
    this.collectedFuses += 1;
  }

  update(zoneName, safeProtectionRemaining, spawnDebug) {
    this.ui.fuseElement.textContent = `Fuses: ${this.collectedFuses} / ${this.totalFuses}`;
    this.ui.zoneElement.textContent = `Zone: ${zoneName}`;

    if (this.collectedFuses >= this.totalFuses) {
      this.ui.objectiveElement.textContent = 'Objective: Power restored. Reach the Exit Room elevator.';
    } else {
      this.ui.objectiveElement.textContent = 'Objective: Find and collect all 3 fuses (press E near a fuse).';
    }

    this.ui.protectionElement.textContent =
      safeProtectionRemaining > 0
        ? `Safe Spawn Protection: ${safeProtectionRemaining.toFixed(1)}s`
        : 'Safe Spawn Protection: offline';

    this.ui.spawnRuleElement.textContent = `Spawn Validator: ${spawnDebug.lastRejectedReason}`;
  }
}
