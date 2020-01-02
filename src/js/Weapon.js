export default class Weapon {
  constructor(position, name, power) {
    this.x = position.x;
    this.y = position.y;
    this.type = 'weapon';
    this.name = name;
    this.power = power || null;
  }
}
