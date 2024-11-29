import { GameConstants } from 'domain/gameConstants';

export interface PieceInfo {
  readonly x: number;
  readonly y: number;
  readonly isPromoted: boolean;
  readonly isWhite: boolean;
}

export type Wall = -1;
export const WallCell: Wall = -1;

export class Piece implements PieceInfo {
  private readonly _isWhite: boolean;
  private _isPromoted: boolean;
  private _x: number;
  private _y: number;

  private static checkCoordinate(coord: number, coordName: 'X' | 'Y') {
    if (coord !== (coord | 0)) {
      throw new Error(`${coordName} value ${coord} is not an integer`);
    }

    if (coord < 0 || coord >= GameConstants.CellsPerSide) {
      throw new Error(
        `${coordName} coordinate must be in range [0, ${GameConstants.CellsPerSide - 1}]`,
      );
    }
  }

  public constructor(isWhite: boolean, x: number, y: number) {
    Piece.checkCoordinate(x, 'X');
    Piece.checkCoordinate(y, 'Y');

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
    Piece.checkCoordinate(x, 'X');
    Piece.checkCoordinate(y, 'Y');

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
