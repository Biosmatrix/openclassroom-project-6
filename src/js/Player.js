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
}
