import { GameConstants } from 'domain/gameConstants';
import { RVector2 } from 'math/Vector2';

export interface PieceInfo {
  readonly x: number;
  readonly y: number;
  readonly isPromoted: boolean;
  readonly isWhite: boolean;
}

/**
 * Indicates a cell that is not on the field
 */
export type Wall = -1;
/**
 * Indicates a cell that is not on the field
 */
export const WallCell: Wall = -1;

export class Piece implements PieceInfo {
  public readonly isWhite: boolean;
  private _isPromoted: boolean;
  private _x: number;
  private _y: number;

  public static checkCoordinate(coord: number, coordName: string) {
    if (coord !== (coord | 0)) {
      throw new Error(`${coordName} value ${coord} is not an integer`);
    }

    if (coord < 0 || coord >= GameConstants.CellsPerSide) {
      throw new Error(
        `${coordName} coordinate must be in range [0, ${GameConstants.CellsPerSide - 1}]`,
      );
    }
  }

  public static fromJson(info: PieceInfo): Piece {
    return new Piece(info.isWhite, info.x, info.y, info.isPromoted);
  }

  public toJson(): PieceInfo {
    return {
      x: this._x,
      y: this._y,
      isWhite: this.isWhite,
      isPromoted: this._isPromoted
    }
  }

  public constructor(isWhite: boolean, x: number, y: number, isPromoted: boolean = false) {
    Piece.checkCoordinate(x, 'X');
    Piece.checkCoordinate(y, 'Y');

    this.isWhite = isWhite;
    this._isPromoted = isPromoted;

    this._x = x;
    this._y = y;
  }

  public get isPromoted() {
    return this._isPromoted;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public moveTo(to: RVector2) {
    Piece.checkCoordinate(to.x, 'X');
    Piece.checkCoordinate(to.y, 'Y');

    this._x = to.x;
    this._y = to.y;
  }

  public promote() {
    if (this._isPromoted) {
      throw new Error('Piece already promoted');
    }

    this._isPromoted = true;
  }
}
