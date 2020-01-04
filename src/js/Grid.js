import { getRandomCellPosition } from './Utils';

export default class Grid {
  constructor(size) {
    this.size = size;
    this.cells = this.empty();
  }

  // empty all cells
  empty() {
    const cells = [];

    for (let x = 0; x < this.size; x++) {
      const row = (cells[x] = []);

      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  eachCell(callback) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  // gets all cells that are available
  availableCells() {
    const cells = [];

    this.eachCell((x, y, cell) => {
      if (!cell) {
        cells.push({ x, y });
      }
    });
    return cells;
  }

  // gets a cell randomly
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

  // Check if the specified cell is occupied
  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  // get cell content
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

  // Inserts a weapon at its position
  insertWeapon(weapon) {
    this.cells[weapon.x][weapon.y] = weapon;
  }

  // Remove a weapon at its position
  removeWeapon(weapon) {
    this.cells[weapon.x][weapon.y] = null;
  }

  // Inserts a player at its position
  insertPlayer(player) {
    this.cells[player.x][player.y] = player;
  }

  // checks if position is within the grid
  withinBounds(position) {
    return (
      position.x >= 0 &&
      position.x < this.size &&
      position.y >= 0 &&
      position.y < this.size
    );
  }
}
