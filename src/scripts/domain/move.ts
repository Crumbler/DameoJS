import { Piece, PieceInfo } from 'domain/piece';
import { RVector2 } from 'math/Vector2';

export class Move {
  public constructor(
    public readonly path: ReadonlyArray<RVector2>,
    public readonly toRemove: ReadonlyArray<PieceInfo> | null = null) {
    if (path.length < 2) {
      throw new Error('Path must contain at least 2 points');
    }

    if (toRemove !== null && toRemove.length === 0) {
      throw new Error('toRemove array must have at least 1 piece if not null');
    }

    for (const point of path) {
      Piece.checkCoordinate(point.x, 'X');
      Piece.checkCoordinate(point.y, 'Y');
    }
  }

  public get firstPoint(): RVector2 {
    return this.path[0];
  }

  public get lastPoint(): RVector2 {
    return this.path[this.path.length - 1];
  }

  public get isAttackMove(): boolean {
    return this.toRemove !== null;
  }

  public get length() {
    let length = 0;
    for (let i = 0; i < this.path.length - 1; ++i) {
      length += this.path[i].distanceTo(this.path[i + 1]);
    }

    return length;
  }
}

export class PieceMovesInfo {
  public constructor(
    public readonly piece: Piece,
    public readonly moves: ReadonlyArray<Move>,
  ) {
    if (moves.length === 0) {
      throw new Error('Moves may not be empty');
    }
  }
}
