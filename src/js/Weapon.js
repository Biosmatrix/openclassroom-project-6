export default class Weapon {
  constructor(position, name, power) {
    this.x = position.x;
    this.y = position.y;
    this.type = 'Weapon';
    this.name = name;
    this.power = power || null;
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
