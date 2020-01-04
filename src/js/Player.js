export default class Player {
  constructor(position, name, weapon) {
    this.x = position.x;
    this.y = position.y;
    this.type = 'player';
    this.name = name;
    this.previousPosition = null;
    this.currentWeapon = weapon || { name: 'fist', power: 10 };
    this.previousWeapon = null;
    this.fightingOption = null;
  }

  // save player position
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  // save player weapon
  saveWeapon() {
    this.previousWeapon = this.currentWeapon;
  }

  // updates player weapon
  updateWeapon() {
    this.previousWeapon = null;
  }

  // updates player position
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}
