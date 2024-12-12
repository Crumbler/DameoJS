import { Piece, PieceInfo } from '@/domain/piece';

export class Move {
  public constructor(public readonly x: number, public readonly y: number) { }
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
