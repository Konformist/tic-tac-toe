export default class Player {
  private _name: string;
  private _symbol: string;

  constructor(name: string = '', symbol = '') {
    this._name = name;
    this._symbol = symbol;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }
}
