import '../styles/main.scss';
import Game from './models/Game';
import HTMLActuator from './models/HTMLActuator';
import Input from './models/Input';
// import Input from './models/Input';
// import HTMLActuator from './models/HTMLActuator';
// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(() => {
  // eslint-disable-next-line no-new
  new Game(10, HTMLActuator, Input);
});
