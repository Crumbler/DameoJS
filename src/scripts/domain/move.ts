import { Piece, PieceInfo } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

export class Move {
  public constructor(public readonly path: ReadonlyArray<Vector2>) {
    if (path.length < 2) {
      throw new Error('Path must contain at least 2 points');
    }

    for (const point of path) {
      Piece.checkCoordinate(point.x, 'X');
      Piece.checkCoordinate(point.y, 'Y');
    }
  }

  public get length() {
    let length = 0;
    for (let i = 0; i < this.path.length - 1; ++i) {
      length += this.path[i].distanceTo(this.path[i + 1]);
    }

    return length;
  }
}

export interface PieceMovesInfo {
  readonly piece: PieceInfo;
  readonly moves: ReadonlyArray<Move>;
}

export class PieceMoves implements PieceMovesInfo {
  public constructor(
    public readonly piece: Piece,
    public readonly moves: ReadonlyArray<Move>,
  ) {
    if (moves.length === 0) {
      throw new Error('Moves may not be empty');
    }
  }
}
