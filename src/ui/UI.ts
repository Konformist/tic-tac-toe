import AreaCell from '../core/AreaCell';
import Game from '../core/Game';

interface IUIOptions {
  game: Game
  canvas: string
}

export default class UI {
  private _width: number = window.innerWidth;
  private _height: number = window.innerHeight;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _game: Game;

  private _fontFamily = 'sans-serif';

  constructor(options: IUIOptions) {
    const canvas = document.querySelector<HTMLCanvasElement>(options.canvas);

    if (!canvas) {
      throw new Error('Not canvas elem');
    }

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Not canvas context');
    }

    this._canvas = canvas;

    this._canvas.width = this._width;
    this._canvas.height = this._height;

    this._context = context;
    this._game = options.game;

    this._canvas.addEventListener('click', (e) => this.clickEvent(e));
  }

  resize() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this.render();
  }

  private _captionTop = 40;
  private _captionHeight = 40;

  private _renderCaption() {
    const caption = this._game.playerWinner
      ? `Winner player ${this._game.playerWinner.name}!`
      : this._game.activePlayer.name;

    this._context.fillStyle = 'white';
    this._context.font = `${this._captionHeight}px ${this._fontFamily}`;
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText(caption, this._width / 2, this._captionTop + this._captionHeight / 2);
  }

  private _fieldPadding = 40;

  private get cellSize() {
    const width = (this._width - this._resetButtonLeft - this._resetButtonWidth - this._fieldPadding * 2) / this._game.settings.sizeX;
    const height = (this._height - this._captionTop - this._captionHeight - this._fieldPadding * 2) / this._game.settings.sizeY;

    return Math.min(width, height);
  }

  private get cellOffsetTop() {
    const top = this._captionTop + this._captionHeight + this._fieldPadding;
    const bottom = this._fieldPadding;
    const field = this.cellSize * this._game.settings.sizeY;
    const offset = (this._height - field - top - bottom) / 2;

    return offset + top;
  }

  private get cellOffsetLeft() {
    const left = this._fieldPadding + this._resetButtonLeft + this._resetButtonWidth;
    const right = this._fieldPadding;
    const field = this.cellSize * this._game.settings.sizeX;
    const offset = (this._width - field - left - right) / 2;

    return offset + left;
  }

  private _renderCell(cell: AreaCell) {
    this._context.fillStyle = this._game.lineWinner.includes(cell) ? '#00C482' : 'white';
    this._context.strokeStyle = 'black';
    this._context.fillRect(
      cell.axesX * this.cellSize + this.cellOffsetLeft,
      cell.axesY * this.cellSize + this.cellOffsetTop,
      this.cellSize,
      this.cellSize,
    );
    this._context.strokeRect(
      cell.axesX * this.cellSize + this.cellOffsetLeft,
      cell.axesY * this.cellSize + this.cellOffsetTop,
      this.cellSize,
      this.cellSize,
    );
    this._context.fillStyle = 'black';
    this._context.font = `${this.cellSize / 2}px ${this._fontFamily}`;
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText(
      cell.player?.symbol || '',
      (cell.axesX * this.cellSize + this.cellSize / 2) + this.cellOffsetLeft,
      (cell.axesY * this.cellSize + this.cellSize / 2) + this.cellOffsetTop,
    );
  }

  private _resetButtonHeight = 40;
  private _resetButtonWidth = 160;

  private get _resetButtonTop() {
    return this._height - this._fieldPadding - this._resetButtonHeight;
  }

  private get _resetButtonLeft() {
    return this._fieldPadding;
  }

  private _renderResetButton() {
    this._context.fillStyle = 'white';
    this._context.font = `40px ${this._fontFamily}`;
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText(
      'Reset',
      this._resetButtonLeft + this._resetButtonWidth / 2,
      this._resetButtonTop + this._resetButtonHeight / 2,
    );
  }

  private _clear() {
    this._context.clearRect(0, 0, this._width, this._height);
  }

  render() {
    this._clear();
    this._renderCaption();
    this._renderResetButton();
    this._game.field.forEach((row) => {
      row.forEach((cell) => {
        this._renderCell(cell);
      })
    })
  }

  clickEvent(ev: MouseEvent) {
    if (
      ev.x >= this._resetButtonLeft
      && ev.x <= this._resetButtonLeft + this._resetButtonWidth
      && ev.y >= this._resetButtonTop
      && ev.x <= this._resetButtonTop + this._resetButtonHeight
    ) {
      this._game.start();
    }

    const axesX = Math.ceil((ev.x - this.cellOffsetLeft) / this.cellSize) - 1;
    const axesY = Math.ceil((ev.y - this.cellOffsetTop) / this.cellSize) - 1;

    if (axesX >= 0 && axesX < this._game.settings.sizeX && axesY >= 0 && axesY < this._game.settings.sizeY) {
      this._game.clickCell(axesX, axesY);
    }

    this.render();
  }
}
