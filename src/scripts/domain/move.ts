import { RVector2, Vector2 } from 'math/Vector2';
import { PieceInfo } from 'domain/piece';

export type MovesArray = ReadonlyArray<Move>;

export class Move {
  public readonly endCell: RVector2;

  public constructor(x: number, y: number) {
    this.endCell = new Vector2(x, y);
  }
}

export class PieceMoveInfo {
  public constructor(
    public readonly pieceInfo: PieceInfo,
    public readonly moves: MovesArray,
  ) {}
}
