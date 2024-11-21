import { Move } from 'domain/move';
import { PieceInfo } from 'domain/piece';
import { BoardInfo } from 'domain/board';

export class MoveCalculator {
  public static calculateMoves(
    board: BoardInfo,
    piece: PieceInfo,
  ): Move[] | null {
    return [new Move(piece.x, piece.y - 1)];
  }
}
