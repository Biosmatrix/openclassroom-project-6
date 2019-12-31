export default class Input {
  constructor() {
    this.events = {};
    this.listen();
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
  }

  listen() {
    const self = this;

    const map = {
      38: 0, // Up
      39: 1, // Right
      40: 2, // Down
      37: 3, // Left
      75: 0, // Vim up
      76: 1, // Vim right
      74: 2, // Vim down
      72: 3, // Vim left
      87: 0, // W
      68: 1, // D
      83: 2, // S
      65: 3, // A
    };

    // Respond to direction keys
    document.addEventListener('keydown', (event) => {
      const modifiers = event.altKey || event.ctrlKey || event.metaKey
        || event.shiftKey;

      const key = event.keyCode || event.which;

      const mapped = map[key];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          self.emit('moveKeyboard', mapped);
        }
      }
    });

    // Respond to button presses
    this.bindButtonPress('.btn__retry', this.restart);
    this.bindButtonPress('.btn__fight', this.fight);
    this.bindButtonPress('.btn__defend', this.defend);
    this.bindCellClicked('.grid', this.movePlayer);
  }

  restart(event) {
    event.preventDefault();
    this.emit('restart');
  }

  keepPlaying(event) {
    event.preventDefault();
    this.emit('keepPlaying');
  }

  fight(event) {
    event.preventDefault();
    this.emit('fight');
  }

  defend(event) {
    event.preventDefault();
    this.emit('defend');
  }

  movePlayer(event) {
    event.preventDefault();

    if (event.target.matches('.highlighted, .highlighted *')) {
      const { row, col } = event.target.closest('.highlighted').dataset;

      const data = { x: parseInt(row, 10), y: parseInt(col, 10) };

      this.emit('movePlayer', data);
    }
  }

  bindButtonPress(selector, fn) {
    const buttons = [...document.querySelectorAll(selector)];
    buttons.forEach((button) => {
      button.addEventListener('click', fn.bind(this));
    });
  }

  bindCellClicked(selector, fn) {
    const cell = document.querySelector(selector);
    cell.addEventListener('click', fn.bind(this));
  }
}
