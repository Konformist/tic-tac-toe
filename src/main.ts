import Game from './core/Game';
import UI from './ui/UI';

const game = new Game();

game.settings.sizeX = 3;
game.settings.sizeY = 3;
game.settings.sizeWin = 3;
game.start();

const ui = new UI({ canvas: '#game', game });

ui.render();

window.addEventListener('resize', () => {
  ui.resize();
});
