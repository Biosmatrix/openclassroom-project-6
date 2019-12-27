export default class Player {
  constructor(position, name, active) {
    this.x = position.x;
    this.y = position.y;
    this.type = 'Player';
    this.name = name;
    this.previousPosition = null;
    this.currentWeapon = null;
    this.previousWeapon = null;
    this.turn = active || false;
    this.fightingOption = null;
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  saveWeapon() {
    this.previousWeapon = this.currentWeapon;
  }

  updateWeapon() {
    this.previousWeapon = null;
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y,
      },
    };
  }
}
