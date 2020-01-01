import Grid from './Grid';
import Obstacle from './Obstacle';
import Weapon from './Weapon';
import Player from './Player';
import { getCellPosition, getCellValue } from './Utils';

export default class Game {
  constructor(size, Actuator, InputManager) {
    this.state = {};
    this.size = size; // Size of the grid
    this.actuator = new Actuator();
    this.inputManager = new InputManager();
    this.directions = 12;
    this.moves = 3;
    this.obstacles = [
      { name: 'boat' }, { name: 'boat' },
      { name: 'ship' }, { name: 'ship' },
      { name: 'wheel' }, { name: 'wheel' },
      { name: 'drum' }, { name: 'drum' },
      { name: 'box' }, { name: 'box' },
    ];
    this.weapons = [
      { name: 'hook', power: 20 },
      { name: 'sword', power: 30 },
      { name: 'bomb', power: 40 },
      { name: 'cannon', power: 50 },
    ];
    this.players = [
      { name: 'playerOne' },
      { name: 'playerTwo' },
    ];

    this.inputManager.on('movePlayer', this.move.bind(this));
    this.inputManager.on('restart', this.restart.bind(this));
    this.inputManager.on('fight', this.fight.bind(this));
    this.inputManager.on('defend', this.defend.bind(this));

    this.setup();
  }

  // Return true if the game is lost, or has won
  isGameTerminated() {
    return this.over;
  }

  // Set up the game
  setup() {
    this.grid = new Grid(this.size);
    this.activePlayer = 0;
    this.score = [100, 100];
    this.health = [100, 100];
    this.fight = false;
    this.over = false;
    this.winner = null;

    // Set up the initial grid to start the game with
    this.actuator.drawGrid(this.grid);

    // adds obstacles to the grid cells
    this.addObstacles();
    this.addWeapons();
    this.addPlayers();

    // renders obstacles to the UI
    this.actuator.addObstacles(this.grid);

    // renders weapons to the UI
    this.actuator.addWeapons(this.grid);

    // renders players to the UI
    this.actuator.addPlayers(this.grid);

    this.highlightPath(this.state.players[this.activePlayer]);

    // Update the actuator
    this.actuate();
  }

  // Restart the game
  restart() {
    this.setup();
  }

  // Set up the Obstacles to start the game with
  addObstacles() {
    const obstacles = [];
    // eslint-disable-next-line no-plusplus
    this.obstacles.forEach((obstacle) => {
      // Adds an Obstacle in a random position
      if (this.grid.cellsAvailable()) {
        const newObstacle = new Obstacle(this.grid.randomAvailableCell(), obstacle.name);

        this.grid.insertObstacle(newObstacle);
        obstacles.push(newObstacle);
      }
    });
    this.state.obstacles = obstacles;
  }

  // Set up the weapons to start the game with
  addWeapons() {
    const weapons = [];
    // eslint-disable-next-line no-plusplus
    this.weapons.forEach((weapon) => {
      // Adds an Obstacle in a random position
      if (this.grid.cellsAvailable()) {
        const newWeapon = new Weapon(this.grid.randomAvailableCell(), weapon.name, weapon.power);

        this.grid.insertWeapon(newWeapon);
        weapons.push(newWeapon);
      }
    });
    this.state.weapons = weapons;
  }

  // Set up the weapons to start the game with
  addPlayers() {
    const players = [];
    // eslint-disable-next-line no-plusplus
    this.players.forEach((player) => {
      // Adds an Obstacle in a random position
      if (this.grid.cellsAvailable()) {
        const newPlayer = new Player(this.grid.randomAvailableCell(), player.name);

        this.grid.insertPlayer(newPlayer);
        players.push(newPlayer);
      }
    });

    if (this.isPlayersClose()) {
      this.addPlayers();
    }

    this.state.players = players;
  }

  // Sends the updated grid to the actuator
  // eslint-disable-next-line class-methods-use-this
  actuate(activePlayer) {
    this.actuator.actuate({
      score: this.score,
      health: this.health,
      over: this.over,
      fight: this.fight,
      winner: this.winner,
      activePlayer: activePlayer || this.activePlayer,
      currentPlayer: this.state.players[this.activePlayer],
      terminated: this.isGameTerminated(),
    });
  }

  // Get the vector representing the chosen direction
  // eslint-disable-next-line class-methods-use-this
  checkDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: -1, y: 0 }, // Up
      1: { x: 0, y: 1 }, // Right
      2: { x: 1, y: 0 }, // Down
      3: { x: 0, y: -1 }, // Left
    };

    return map[direction];
  }

  // eslint-disable-next-line class-methods-use-this
  getDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: -1, y: 0 }, // Up
      1: { x: 0, y: 1 }, // Right
      2: { x: 1, y: 0 }, // Down
      3: { x: 0, y: -1 }, // Left
      4: { x: -2, y: 0 }, // Up
      5: { x: 0, y: 2 }, // Right
      6: { x: 2, y: 0 }, // Down
      7: { x: 0, y: -2 }, // Left
      8: { x: -3, y: 0 }, // Up
      9: { x: 0, y: 3 }, // Right
      10: { x: 3, y: 0 }, // Down
      11: { x: 0, y: -3 }, // Left
    };

    return map[direction];
  }

  // eslint-disable-next-line class-methods-use-this
  getUpDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: -1, y: 0 }, // Up
      1: { x: -2, y: 0 }, // Up
      2: { x: -3, y: 0 }, // Up
    };

    return map[direction];
  }

  // eslint-disable-next-line class-methods-use-this
  getRightDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: 0, y: 1 }, // Right
      1: { x: 0, y: 2 }, // Right
      2: { x: 0, y: 3 }, // Right
    };

    return map[direction];
  }

  // eslint-disable-next-line class-methods-use-this
  getDownDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: 1, y: 0 }, // Down
      1: { x: 2, y: 0 }, // Down
      2: { x: 3, y: 0 }, // Down
    };

    return map[direction];
  }

  // eslint-disable-next-line class-methods-use-this
  getLeftDirectionVector(direction) {
    // Vectors representing player movement
    const map = {
      0: { x: 0, y: -1 }, // Left
      1: { x: 0, y: -2 }, // Left
      2: { x: 0, y: -3 }, // Left
    };

    return map[direction];
  }

  // Check if players are close to each other
  isPlayersClose() {
    const self = this;

    let cell;

    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < this.size; x++) {
      // eslint-disable-next-line no-plusplus
      for (let y = 0; y < this.size; y++) {
        cell = this.grid.cellContent({ x, y });

        if (cell) {
          if (getCellValue(cell).type === 'Player') {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 4; i++) {
              const direction = self.checkDirectionVector(i);
              const nextCell = { x: x + direction.x, y: y + direction.y };

              const other = self.grid.cellContent(nextCell);

              if (other && getCellValue(other).type === 'Player') {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

  // Move a Player and its representation
  movePlayer(player, cell) {
    if (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell)) {
      this.grid.cells[player.x][player.y] = null;
      this.grid.cells[cell.x][cell.y] = player;
      player.updatePosition(cell);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  move(position) {
    const self = this;

    // gets active player
    const player = this.state.players[this.activePlayer];

    // The player moved from its current cell!
    let moved = false;

    if (player) {
      const next = self.grid.cellContent(position);

      if (next && next.type === 'Weapon') {
        // check if player has any weapon
        if (player.currentWeapon) {
          // save current weapon
          player.saveWeapon();
        }

        // remove the current weapon from the grid
        self.grid.removeWeapon(next);
        // remove the current weapon from the UI
        self.actuator.removeWeapon(next);

        // sets player current weapon
        player.currentWeapon = next;
      }

      // update active player current position
      player.savePosition();

      // change active player position on the grid
      self.movePlayer(player, position);

      // renders player new position to the UI
      self.actuator.movePlayer(player);

      // The player moved from its current cell!
      moved = true;

      // remove highlighted path from active player
      self.removeHighlightedPath(player);

      // renders player weapon to the UI
      self.updatePlayerWeapon(player);

      // update player in state object
      self.state.players[self.activePlayer] = player;
    }

    if (moved) {
      if (self.isPlayersClose()) {
        this.activePlayer = 0;

        this.fight = true;

        // update stats
        self.actuate();
      } else {
        // update stats
        self.actuate();

        // switch to next player
        self.highlightNextPlayer();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  up(player) {
    const self = this;
    if (player) {
      // eslint-disable-next-line no-plusplus,no-shadow
      for (let direction = 0; direction < self.moves; direction++) {
        const vector = self.getUpDirectionVector(direction);
        const position = self.findNextPositions(player, vector);
        const currentCell = getCellPosition(position.current);
        const nextCell = getCellPosition(position.next);

        if (self.grid.withinBounds(position.next) && !nextCell.classList.contains('unavailable')) {
          if (nextCell && !nextCell.classList.contains('unavailable')) {
            nextCell.classList.add('highlighted');
            currentCell.classList.add('highlighted');
          }
        } else break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  right(player) {
    const self = this;

    if (player) {
      // eslint-disable-next-line no-plusplus,no-shadow
      for (let direction = 0; direction < self.moves; direction++) {
        const vector = self.getRightDirectionVector(direction);
        const position = self.findNextPositions(player, vector);
        const currentCell = getCellPosition(position.current);
        const nextCell = getCellPosition(position.next);

        if (self.grid.withinBounds(position.next) && !nextCell.classList.contains('unavailable')) {
          if (nextCell && !nextCell.classList.contains('unavailable')) {
            nextCell.classList.add('highlighted');
            currentCell.classList.add('highlighted');
          }
        } else break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  down(player) {
    const self = this;
    if (player) {
      // eslint-disable-next-line no-shadow,no-plusplus
      for (let direction = 0; direction < self.moves; direction++) {
        const vector = self.getDownDirectionVector(direction);
        const position = self.findNextPositions(player, vector);
        const currentCell = getCellPosition(position.current);
        const nextCell = getCellPosition(position.next);

        if (self.grid.withinBounds(position.next) && !nextCell.classList.contains('unavailable')) {
          if (nextCell && !nextCell.classList.contains('unavailable')) {
            nextCell.classList.add('highlighted');
            currentCell.classList.add('highlighted');
          }
        } else break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  left(player) {
    const self = this;

    if (player) {
      // eslint-disable-next-line no-shadow,no-plusplus
      for (let direction = 0; direction < self.moves; direction++) {
        const vector = self.getLeftDirectionVector(direction);
        const position = self.findNextPositions(player, vector);
        const currentCell = getCellPosition(position.current);
        const nextCell = getCellPosition(position.next);

        if (self.grid.withinBounds(position.next) && !nextCell.classList.contains('unavailable')) {
          if (nextCell && !nextCell.classList.contains('unavailable')) {
            nextCell.classList.add('highlighted');
            currentCell.classList.add('highlighted');
          }
        } else break;
      }
    }
  }

  highlightPath(player) {
    const self = this;

    if (player) {
      self.up(player);
      self.right(player);
      self.down(player);
      self.left(player);
    }
  }

  // remove highlight when player move
  removeHighlightedPath(player) {
    const self = this;
    let previousCell;
    let nextCell;

    if (player) {
      // eslint-disable-next-line no-plusplus
      for (let direction = 0; direction < self.directions; direction++) {
        const vector = self.getDirectionVector(direction);
        const position = self.findNextPositions(player, vector);
        const previousPosition = self.findPreviousPositions(position.previous, vector);

        if (self.grid.withinBounds(position.current)) {
          previousCell = getCellPosition(previousPosition.current);
          nextCell = getCellPosition(previousPosition.next);
        }

        if (previousCell && nextCell) {
          previousCell.classList.remove('highlighted');
          nextCell.classList.remove('highlighted');
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  findNextPositions(cell, position) {
    const current = cell;

    const next = { x: current.x + position.x, y: current.y + position.y };

    return {
      current,
      previous: current,
      next,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  findPreviousPositions(cell, position) {
    const previous = cell.previousPosition;

    const next = { x: previous.x + position.x, y: previous.y + position.y };

    return {
      current: cell.previousPosition,
      previous,
      next,
    };
  }

  // Next player
  // eslint-disable-next-line class-methods-use-this
  highlightNextPlayer() {
    // eslint-disable-next-line no-unused-expressions
    this.activePlayer === 0 ? this.activePlayer = 1 : this.activePlayer = 0;

    const player = this.state.players[this.activePlayer];

    this.highlightPath(player);
  }

  nextPlayer() {
    // eslint-disable-next-line no-unused-expressions
    this.activePlayer === 0 ? this.activePlayer = 1 : this.activePlayer = 0;

    return this.state.players[this.activePlayer];
  }

  // update current player weapon
  updatePlayerWeapon(player) {
    if (player) {
      // checks if current layer has any previous weapon
      if (player.previousWeapon) {
        // eslint-disable-next-line max-len
        // checks if the current player previous position is equal current player current weapon position
        if (this.positionsEqual(player.previousPosition, player.currentWeapon)) {
          // gets current player previous weapon and  previous position
          const { previousWeapon, previousPosition } = player;

          if (previousWeapon.name !== 'fist') {
            // sets the previous weapon to current weapon position
            // eslint-disable-next-line max-len
            const newWeapon = new Weapon(previousPosition, previousWeapon.name, previousWeapon.power);

            // inserts the previous weapon on the grid
            this.grid.insertWeapon(newWeapon);

            // renders previous weapon to the UI
            this.actuator.addWeapon(newWeapon);

            player.updateWeapon();
          }
        }
      }
    }
  }

  fight() {
    const nextActivePlayer = this.activePlayer === 0 ? 1 : 0;
    const currentPlayer = this.state.players[this.activePlayer];
    const currentPlayerWeapon = currentPlayer.currentWeapon;

    // const { activePlayer } = this;
    const nextPlayer = this.nextPlayer();

    let { power } = currentPlayerWeapon;
    // // eslint-disable-next-line no-param-reassign
    currentPlayer.fightingOption = 'attack';

    // // check next player fighting option
    // eslint-disable-next-line max-len
    if (nextPlayer.fightingOption === 'defend') power /= 2;// if the next player is defending, the damage is divided by 2

    // eslint-disable-next-line no-param-reassign
    if (this.score[nextActivePlayer] - power > 0) {
      // eslint-disable-next-line no-param-reassign
      this.score[nextActivePlayer] -= power;
      // if the the next player has no score left, he lose
      // eslint-disable-next-line no-console
      console.log(this.score);
    } else {
      // eslint-disable-next-line no-param-reassign
      this.score[nextActivePlayer] = 0;
      this.actuator.updateScore(nextActivePlayer, this.score[nextActivePlayer]);
      this.actuator.updateHealth(nextActivePlayer, this.score[nextActivePlayer]);
      // eslint-disable-next-line no-console
      console.log(this.score);
      this.fight = false;
      this.over = true;
      this.winner = currentPlayer;
      this.actuate();
    }

    this.actuator.updateScore(nextActivePlayer, this.score[nextActivePlayer]);
    this.actuator.updateHealth(nextActivePlayer, this.score[nextActivePlayer]);

    this.actuator.updatePanel();

    // update stats
    this.actuate();
  }

  defend() {
    const currentPlayer = this.state.players[this.activePlayer];
    const nextPlayer = this.nextPlayer();

    currentPlayer.fightingOption = 'defend';
    nextPlayer.fightingOption = 'attack';

    this.actuator.updatePanel();

    // update stats
    this.actuate();
  }

  // eslint-disable-next-line class-methods-use-this
  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
}
