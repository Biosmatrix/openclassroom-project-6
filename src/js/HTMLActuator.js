import {
  appendElementToDOM, createElement, getCellPosition, $, getCellValue,
} from './Utils';

export default class HTMLActuator {
  constructor() {
    this.gridContainer = $('.grid');
    this.messageContainer = $('.game-message');
    this.fightContainer = $('.game-fight');
  }

  // eslint-disable-next-line class-methods-use-this
  gridRow() {
    const classNames = { boxes: 'grid__row' };
    return createElement('div', classNames);
  }

  // eslint-disable-next-line class-methods-use-this
  gridCell(row, col) {
    const classNames = { box: 'grid__cell', available: 'available' };
    // eslint-disable-next-line no-dupe-keys
    const attributes = { id: `cell-${row}${col}`, 'data-row': `${row}`, 'data-col': `${col}` };
    return createElement('div', classNames, attributes);
  }

  drawGrid(grid) {
    // eslint-disable-next-line no-plusplus
    for (let row = 0; row < grid.size; row++) {
      const gridRow = this.gridRow();
      // eslint-disable-next-line no-plusplus
      for (let col = 0; col < grid.size; col++) {
        appendElementToDOM(this.gridCell(row, col), gridRow);
      }
      appendElementToDOM(gridRow, this.gridContainer);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addObstacles(grid) {
    grid.cells.forEach((row) => {
      row.forEach((column) => {
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

  // eslint-disable-next-line class-methods-use-this
  addWeapons(grid) {
    grid.cells.forEach((row) => {
      row.forEach((column) => {
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

  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
  addPlayers(grid) {
    grid.cells.forEach((row) => {
      row.forEach((column) => {
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

      // eslint-disable-next-line max-len
      if (player.previousPosition) previousPosition = getCellPosition(player.previousPosition);

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

  // eslint-disable-next-line class-methods-use-this
  removeWeapon(weapon) {
    if (weapon) {
      // const cell = getCellValue(weapon);
      const position = getCellPosition(weapon);

      if (position.classList.contains('weapon')) {
        position.classList.remove('weapon');
        position.classList.remove(`${weapon.name}`);
        position.classList.add('available');
      }
    }
  }

  actuate(metadata) {
    const self = this;

    window.requestAnimationFrame(() => {
      self.updatePlayerWeapon(metadata.activePlayer, metadata.currentPlayer);

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

  message(player) {
    const message = player.name === 'playerOne' ? 'Player 1 wins!' : 'Player 2 wins!';

    this.messageContainer.classList.add('game-won');
    this.messageContainer.querySelector('.message').textContent = message;
    this.messageContainer.querySelector('#player').classList.add(`${player.name}`);
  }

  fight(start) {
    const type = start ? 'fight-start' : 'fight-ends';

    this.fightContainer.classList.add(type);
  }

  // eslint-disable-next-line class-methods-use-this
  updateScore(player, score) {
    $(`#player__${player}--score`).textContent = `${score}%`;
  }

  // eslint-disable-next-line class-methods-use-this
  updateHealth(player, score) {
    $(`#player__${player}--health`).style.width = `${score}%`;
  }

  // eslint-disable-next-line class-methods-use-this
  updatePlayerWeapon(activePlayer, player) {
    const playerWeaponImg = $(`.player__${activePlayer} .weapon__image`);
    const playerWeapon = player.currentWeapon ? player.currentWeapon.name : 'defaultWeaponImg';
    const playerPreviousWeapon = player.previousWeapon ? player.previousWeapon.name : 'defaultWeaponImg';

    if (playerWeaponImg) {
      if (playerWeaponImg.classList.contains(playerPreviousWeapon)) {
        playerWeaponImg.classList.remove(playerPreviousWeapon);
        playerWeaponImg.classList.add(playerWeapon);
        $(`#player__${activePlayer}--power`).textContent = `${player.currentWeapon.power}`;
      }
    }
  }

  // enable fighting buttons
  // eslint-disable-next-line class-methods-use-this
  enableFight(activePlayer) {
    const attack = $(`#player-${activePlayer}-attack`);
    const defend = $(`#player-${activePlayer}-defend`);
    attack.classList.remove('disabled');
    defend.classList.remove('disabled');
  }

  // disable fighting buttons
  // eslint-disable-next-line class-methods-use-this
  disableFight(nextPlayer) {
    const attack = $(`#player-${nextPlayer}-attack`);
    const defend = $(`#player-${nextPlayer}-defend`);
    attack.classList.add('disabled');
    defend.classList.add('disabled');
  }

  // eslint-disable-next-line class-methods-use-this
  updatePanel() {
    $('.player-0-panel > .player__0---img').classList.toggle('active');
    $('.player-1-panel > .player__1---img').classList.toggle('active');
  }

  // eslint-disable-next-line class-methods-use-this
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setClasses(element, classes) {
    element.setAttribute('class', classes.join(' '));
  }

  // eslint-disable-next-line class-methods-use-this
  setDataset(element, key, value) {
    element.setAttribute(`data-${key}`, `${value}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getCellPositionClass(position) {
    return `cell-${position.x}${position.y}`;
  }

  // eslint-disable-next-line class-methods-use-this
  createElement(tag) {
    return document.createElement(tag);
  }
}
