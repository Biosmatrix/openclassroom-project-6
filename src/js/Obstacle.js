export default class Obstacle {
  constructor(position, name) {
    this.x = position.x;
    this.y = position.y;
    this.type = 'Obstacle';
    this.name = name;
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
