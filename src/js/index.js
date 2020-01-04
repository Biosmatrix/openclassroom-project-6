import '../styles/main.scss';
import Game from './Game';
import HTMLActuator from './HTMLActuator';
import Input from './Input';
// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(() => {
  new Game(10, HTMLActuator, Input);
});
