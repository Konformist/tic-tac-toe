export default class Settings {
  private _sizeWin = 3;
  private _sizeX = 3;
  private _sizeY = 3;

  constructor() {}

  get sizeWin(): number {
    const minVal = Math.min(this._sizeX, this._sizeY);

    return this._sizeWin > minVal ? minVal : this._sizeWin;
  }

  set sizeWin(value: number) {
    this._sizeWin = value;
  }

  get sizeX(): number {
    return Math.min(this._sizeX, 100);
  }

  set sizeX(value: number) {
    this._sizeX = value;
  }

  get sizeY(): number {
    return Math.min(this._sizeY, 100);
  }

  set sizeY(value: number) {
    this._sizeY = value;
  }
}
