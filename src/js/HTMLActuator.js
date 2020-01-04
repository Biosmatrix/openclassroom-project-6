import {
  appendElementToDOM,
  createElement,
  getCellPosition,
  $,
  getCellValue
} from './Utils';

export default class HTMLActuator {
  constructor() {
    this.gridContainer = $('.grid');
    this.messageContainer = $('.game-message');
    this.fightContainer = $('.game-fight');
  }

  // creates a grid row
  gridRow() {
    const classNames = { boxes: 'grid__row' };
    return createElement('div', classNames);
  }

  // create a grid cell
  gridCell(row, col) {
    const classNames = { box: 'grid__cell', available: 'available' };
    const attributes = {
      id: `cell-${row}${col}`,
      'data-row': `${row}`,
      'data-col': `${col}`
    };
    return createElement('div', classNames, attributes);
  }

  // draws the grid on the UI
  drawGrid(grid) {
    // eslint-disable-next-line no-plusplus
    for (let row = 0; row < grid.size; row++) {
      const gridRow = this.gridRow();
      for (let col = 0; col < grid.size; col++) {
        appendElementToDOM(this.gridCell(row, col), gridRow);
      }
      appendElementToDOM(gridRow, this.gridContainer);
    }
  }

  // add obstacles on the UI
  addObstacles(grid) {
    grid.cells.forEach(row => {
      row.forEach(column => {
        if (column) {
          const cell = getCellValue(column);
          const position = getCellPosition(cell.position);

          if (cell.type === 'obstacle') {
            if (position) {
              position.classList.remove('available');
              position.classList.add('unavailable');
              position.classList.add(`${cell.name}`);
              position.classList.add(`${cell.type}`);
            }
          }
        }
      });
    });
  }

  // adds weapons on the UI
  addWeapons(grid) {
    grid.cells.forEach(row => {
      row.forEach(column => {
        if (column) {
          const cell = getCellValue(column);
          const position = getCellPosition(cell.position);

          if (cell.type === 'weapon') {
            if (position) {
              position.classList.remove('available');
              position.classList.add(`${cell.name}`);
              position.classList.add(`${cell.type}`);
            }
          }
        }
      });
    });
  }

  // add weapon on the UI
  addWeapon(weapon) {
    if (weapon) {
      const position = getCellPosition(weapon);

      if (position) {
        position.classList.remove('available');
        position.classList.add('weapon');
        position.classList.add(`${weapon.name}`);
      }
    }
  }

  // add players on the UI
  addPlayers(grid) {
    grid.cells.forEach(row => {
      row.forEach(column => {
        if (column && column.type === 'player') {
          const cell = getCellValue(column);

          const position = getCellPosition(cell.position);
          if (position.classList.contains('available')) {
            position.classList.remove('available');

            position.classList.add(`${cell.name}`);
            position.classList.add(`${cell.type}`);
          }
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  movePlayer(player) {
    if (player) {
      const cell = getCellValue(player);
      const position = getCellPosition(player);
      let previousPosition;

      if (player.previousPosition) {
        previousPosition = getCellPosition(player.previousPosition);
      }

      if (previousPosition.classList.contains(`${cell.name}`)) {
        previousPosition.classList.remove(`${cell.name}`);
        previousPosition.classList.add('available');
      }

      if (position.classList.contains('available')) {
        position.classList.remove('available');
        position.classList.add(`${cell.name}`);
        position.classList.add(`${cell.type}`);
      }
    }
  }

  // remove weapon on the UI
  removeWeapon(weapon) {
    if (weapon) {
      const position = getCellPosition(weapon);

      if (position.classList.contains('weapon')) {
        position.classList.remove('weapon');
        position.classList.remove(`${weapon.name}`);
        position.classList.add('available');
      }
    }
  }

  // update stats
  actuate(metadata) {
    const self = this;

    window.requestAnimationFrame(() => {
      self.updatePlayerWeapon(
        metadata.activePlayer,
        metadata.currentPlayer
      );

      if (metadata.fight) {
        self.fight(true); // Fight starts
        const nextActivePlayer = metadata.activePlayer === 0 ? 1 : 0;
        this.enableFight(metadata.activePlayer);
        this.disableFight(nextActivePlayer);
      }

      if (metadata.terminated) {
        self.fight(false); // Fight starts
        self.message(metadata.winner); // Winner!
      }
    });
  }

  // display game over message
  message(player) {
    const message =
      player.name === 'playerOne'
        ? 'Player 1 wins!'
        : 'Player 2 wins!';

    this.messageContainer.classList.add('game-won');
    this.messageContainer.querySelector(
      '.message'
    ).textContent = message;
    this.messageContainer
      .querySelector('#player')
      .classList.add(`${player.name}`);
  }

  // enable combat mode
  fight(start) {
    const type = start ? 'fight-start' : 'fight-ends';

    this.fightContainer.classList.add(type);
  }

  // update player score
  updateScore(player, score) {
    $(`#player__${player}--score`).textContent = `${score}%`;
  }

  // update player health
  updateHealth(player, score) {
    $(`#player__${player}--health`).style.width = `${score}%`;
  }

  // update player weapon
  updatePlayerWeapon(activePlayer, player) {
    const playerWeaponImg = $(
      `.player__${activePlayer} .weapon__image`
    );
    const playerWeapon = player.currentWeapon
      ? player.currentWeapon.name
      : 'defaultWeaponImg';
    const playerPreviousWeapon = player.previousWeapon
      ? player.previousWeapon.name
      : 'defaultWeaponImg';

    if (playerWeaponImg) {
      if (playerWeaponImg.classList.contains(playerPreviousWeapon)) {
        playerWeaponImg.classList.remove(playerPreviousWeapon);
        playerWeaponImg.classList.add(playerWeapon);
        $(
          `#player__${activePlayer}--power`
        ).textContent = `${player.currentWeapon.power}`;
      }
    }
  }

  // enable fighting buttons
  enableFight(activePlayer) {
    const attack = $(`#player-${activePlayer}-attack`);
    const defend = $(`#player-${activePlayer}-defend`);
    attack.classList.remove('disabled');
    defend.classList.remove('disabled');
  }

  // disable fighting buttons
  disableFight(nextPlayer) {
    const attack = $(`#player-${nextPlayer}-attack`);
    const defend = $(`#player-${nextPlayer}-defend`);
    attack.classList.add('disabled');
    defend.classList.add('disabled');
  }

  // update player panel
  updatePanel() {
    $('.player-0-panel > .player__0---img').classList.toggle(
      'active'
    );
    $('.player-1-panel > .player__1---img').classList.toggle(
      'active'
    );
  }
}
