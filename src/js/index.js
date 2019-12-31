import '../styles/main.scss';
import Game from './Game';
import HTMLActuator from './HTMLActuator';
import Input from './Input';
// import Input from './models/Input';
// import HTMLActuator from './models/HTMLActuator';
// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(() => {
  // eslint-disable-next-line no-new
  new Game(10, HTMLActuator, Input);
});
