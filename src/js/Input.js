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
