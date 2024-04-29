import Player from './Player';

export default class AreaCell {
  private _player?: Player;
  private _axesX: number;
  private _axesY: number;

  constructor(x: number, y: number) {
    this._axesX = x;
    this._axesY = y;
  }

  get player() {
    return this._player;
  }

  set player(value: Player|undefined) {
    this._player = value;
  }

  get axesX() {
    return this._axesX;
  }

  get axesY() {
    return this._axesY;
  }
}
