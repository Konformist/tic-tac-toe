import Area from './Area';
import AreaCell from './AreaCell';
import Settings from './Settings';
import Player from './Player';

export default class Game {
  private _area: Area = new Area();
  private _players: Player[] = [new Player('Player 1', 'x'), new Player('Player 2', 'o')];
  private _activePlayer: Player = new Player();
  private _lineWinner: AreaCell[] = [];
  private _settings = new Settings();
  private _history: Player[] = [];

  constructor() {}

  get history() {
    return this._history;
  }

  get settings() {
    return this._settings;
  }

  get lineWinner() {
    return this._lineWinner;
  }

  get playerWinner() {
    return this._lineWinner[0]?.player;
  }

  get activePlayer() {
    return this._activePlayer;
  }

  get field() {
    return this._area.field;
  }

  get players() {
    return this._players;
  }

  start() {
    this._area = new Area(this._settings.sizeX, this._settings.sizeY);
    this._activePlayer = this._players[0];
    this._lineWinner = [];
  }

  private _nextPlayer() {
    if (!this._activePlayer) {
      return;
    }

    const indexCurrent = this._players.indexOf(this._activePlayer);
    const indexNext = indexCurrent + 1 > this._players.length - 1 ? 0 : indexCurrent + 1;

    this._activePlayer = this._players[indexNext];
  }

  private _checkCells(cells: Array<AreaCell>) {
    let line: AreaCell[] = [];

    for (let y = 0; y < cells.length; y++) {
      const cell = cells[y];

      if (line.length === this._settings.sizeWin) {
        break;
      } else if (cell.player === this._activePlayer) {
        line.push(cell);
      } else {
        line = [];
      }
    }

    return line.length === this._settings.sizeWin ? line : null;
  }

  private _checkAxesX(cell: AreaCell) {
    const minX = Math.max(cell.axesX - this._settings.sizeWin + 1, 0);
    const maxX = Math.min(cell.axesX + this._settings.sizeWin - 1, this._settings.sizeX - 1);
    const cells = [];

    for (let i = minX; i <= maxX; i++) {
      cells.push(this._area.getCell(i, cell.axesY));
    }

    return this._checkCells(cells);
  }

  private _checkAxesY(cell: AreaCell) {
    const minY = Math.max(cell.axesY - this._settings.sizeWin + 1, 0);
    const maxY = Math.min(cell.axesY + this._settings.sizeWin - 1, this._settings.sizeY - 1);
    const cells = [];

    for (let i = minY; i <= maxY; i++) {
      cells.push(this._area.getCell(cell.axesX, i));
    }

    return this._checkCells(cells);
  }

  private _checkAxesV(cell: AreaCell) {
    /** Line left from cell */
    const leftLine = Math.min(
      cell.axesX - Math.max(cell.axesX - this._settings.sizeWin + 1, 0),
      cell.axesY - Math.max(cell.axesY - this._settings.sizeWin + 1, 0),
    );
    /** Line left from cell */
    const rightLine = Math.min(
      Math.min(cell.axesX + this._settings.sizeWin - 1, this._settings.sizeX - 1) - cell.axesX,
      Math.min(cell.axesY + this._settings.sizeWin - 1, this._settings.sizeY - 1) - cell.axesY,
    );
    const minX = cell.axesX - leftLine;
    const minY = cell.axesY - leftLine;
    const cells = [];

    for (let i = 0; i <= leftLine + rightLine; i++) {
      cells.push(this._area.getCell(minX + i, minY + i));
    }

    return this._checkCells(cells);
  }

  private _checkAxesH(cell: AreaCell) {
    /** Line left from cell */
    const leftLine = Math.min(
      cell.axesX - Math.max(cell.axesX - this._settings.sizeWin + 1, 0),
      Math.min(cell.axesY + this._settings.sizeWin - 1, this._settings.sizeY - 1) - cell.axesY,
    );
    /** Line left from cell */
    const rightLine = Math.min(
      Math.min(cell.axesX + this._settings.sizeWin - 1, this._settings.sizeX - 1) - cell.axesX,
      cell.axesY - Math.max(cell.axesY - this._settings.sizeWin + 1, 0),
    );
    const minX = cell.axesX - leftLine;
    const maxY = cell.axesY + leftLine;
    const cells = [];

    for (let i = 0; i <= leftLine + rightLine; i++) {
      cells.push(this._area.getCell(minX + i, maxY - i));
    }

    return this._checkCells(cells);
  }

  private _checkGameOver(cell: AreaCell) {
    const line = this._checkAxesX(cell)
      || this._checkAxesY(cell)
      || this._checkAxesV(cell)
      || this._checkAxesH(cell);

    if (line) {
      this._lineWinner = line;
      this._history.push(this.playerWinner as Player);
    }
  }

  clickCell(x: number, y: number) {
    const cell = this._area.getCell(x, y);

    if (this._lineWinner.length || cell.player || !this._activePlayer) {
      return;
    }

    cell.player = this._activePlayer;
    this._checkGameOver(cell);
    this._nextPlayer();
  }
}
