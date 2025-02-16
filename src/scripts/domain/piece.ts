import { GameConstants } from 'domain/gameConstants';
import { RVector2, Vector2 } from 'math/Vector2';

export interface PieceInfo {
  readonly pos: Vector2;
  readonly isPromoted: boolean;
  readonly isWhite: boolean;
  readonly shouldBePromoted: boolean;

  toJson(): object;
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
  private _isPromoted: boolean;
  private _pos: Vector2;

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
    return new Piece(info.isWhite, Vector2.fromJson(info.pos), info.isPromoted);
  }

  public toJson(): object {
    return {
      isWhite: this.isWhite,
      isPromoted: this.isPromoted,
      pos: this._pos.toJson(),
    };
  }

  public constructor(
    public readonly isWhite: boolean,
    pos: RVector2,
    isPromoted = false,
  ) {
    Piece.checkCoordinate(pos.x, 'X');
    Piece.checkCoordinate(pos.y, 'Y');

    this._isPromoted = isPromoted;

    this._pos = pos.clone();
  }

  public get isPromoted() {
    return this._isPromoted;
  }

  public get pos(): Vector2 {
    return this._pos.clone();
  }

  public moveTo(to: RVector2) {
    Piece.checkCoordinate(to.x, 'X');
    Piece.checkCoordinate(to.y, 'Y');

    this._pos = to.clone();
  }

  public promote() {
    if (this._isPromoted) {
      throw new Error('Piece already promoted');
    }

    this._isPromoted = true;
  }

  public demote() {
    if (!this._isPromoted) {
      throw new Error('Piece cannot be demoted further');
    }

    this._isPromoted = false;
  }

  public get shouldBePromoted(): boolean {
    const backRowY = this.isWhite ? 0 : GameConstants.CellsPerSide - 1;

    return this._pos.y === backRowY && !this._isPromoted;
  }
}
