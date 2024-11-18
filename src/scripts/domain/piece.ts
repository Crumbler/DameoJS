export interface PieceInfo {
  readonly x: number;
  readonly y: number;
  readonly isPromoted: boolean;
  readonly isWhite: boolean;
}

export class Piece implements PieceInfo {
  private readonly _isWhite: boolean;
  private _isPromoted: boolean;
  private _x: number;
  private _y: number;

  public constructor(isWhite: boolean, x: number, y: number) {
    if (x !== (x | 0)) {
      throw new Error(`X value ${x} is not an integer`);
    }

    if (x < 0 || x > 7) {
      throw new Error('Piece X coordinate must be in range [0, 7]');
    }

    if (y !== (y | 0)) {
      throw new Error(`Y value ${y} is not an integer`);
    }

    if (y < 0 || y > 7) {
      throw new Error('Piece Y coordinate must be in range [0, 7]');
    }

    this._isWhite = isWhite;
    this._isPromoted = false;

    this._x = x;
    this._y = y;
  }

  public get isPromoted() {
    return this._isPromoted;
  }

  public get isWhite() {
    return this._isWhite;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public moveTo(x: number, y: number) {
    if (x !== (x | 0)) {
      throw new Error(`X value ${x} is not an integer`);
    }

    if (x < 0 || x > 7) {
      throw new Error('Piece X coordinate must be in range [0, 7]');
    }

    if (y !== (y | 0)) {
      throw new Error(`Y value ${y} is not an integer`);
    }

    if (y < 0 || y > 7) {
      throw new Error('Piece Y coordinate must be in range [0, 7]');
    }

    this._x = x;
    this._y = y;
  }

  public promote() {
    if (this._isPromoted) {
      throw new Error('Piece already promoted');
    }

    this._isPromoted = true;
  }
}
