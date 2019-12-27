import { getRandomCellPosition } from './Utils';

export default class Grid {
  constructor(size) {
    this.size = size;
    this.cells = this.empty();
  }

  empty() {
    const cells = [];

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < this.size; x++) {
      // eslint-disable-next-line no-multi-assign
      const row = cells[x] = [];

      // eslint-disable-next-line no-plusplus
      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  eachCell(callback) {
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < this.size; x++) {
      // eslint-disable-next-line no-plusplus
      for (let y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  availableCells() {
    const cells = [];

    this.eachCell((x, y, cell) => {
      if (!cell) {
        cells.push({ x, y });
      }
    });
    return cells;
  }

  // eslint-disable-next-line consistent-return
  randomAvailableCell() {
    const cells = this.availableCells();

    if (cells.length) {
      return cells[getRandomCellPosition(cells.length)];
    }
  }

  // Check if there are any cells available
  cellsAvailable() {
    return !!this.availableCells().length;
  }

  // Check if the specified cell is taken
  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    }
    return null;
  }

  // Inserts a obstacle at its position
  insertObstacle(obstacle) {
    this.cells[obstacle.x][obstacle.y] = obstacle;
  }

  // Inserts a obstacle at its position
  insertWeapon(weapon) {
    this.cells[weapon.x][weapon.y] = weapon;
  }

  removeWeapon(weapon) {
    this.cells[weapon.x][weapon.y] = null;
  }

  // Inserts a player at its position
  insertPlayer(player) {
    this.cells[player.x][player.y] = player;
  }

  withinBounds(position) {
    return position.x >= 0 && position.x < this.size
      && position.y >= 0 && position.y < this.size;
  }

  serialize() {
    const cellState = [];

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < this.size; x++) {
      // eslint-disable-next-line no-multi-assign
      const row = cellState[x] = [];

      // eslint-disable-next-line no-plusplus
      for (let y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }

    return {
      size: this.size,
      cells: cellState,
    };
  }
}
