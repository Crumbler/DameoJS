import { RVector2, Vector2 } from 'math/Vector2';
import { Piece, PieceInfo } from 'domain/piece';

export class Move {
  public readonly endCell: RVector2;

  public constructor(x: number, y: number) {
    this.endCell = new Vector2(x, y);
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
  ) { }
}
