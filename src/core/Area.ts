import AreaCell from './AreaCell';

export default class Area {
  private _field: Array<Array<AreaCell>> = [];

  constructor(sizeX: number = 0, sizeY: number = 0) {
    for (let y = 0; y < sizeX; y++) {
      this._field.push([])
      for (let x = 0; x < sizeY; x++) {
        this._field[y].push(new AreaCell(x, y));
      }
    }
  }

  get field() {
    return this._field;
  }

  getCell(x: number, y: number) {
    // @ts-ignore
    return this._field[y][x] as AreaCell;
  }
}
