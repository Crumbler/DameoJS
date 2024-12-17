import { Move } from 'domain/move';
import { PieceInfo, WallCell } from 'domain/piece';
import { BoardInfo } from 'domain/board';
import { MathUtil } from 'math/mathUtil';

export class MoveCalculator {
  private static getSimpleMove(
    board: BoardInfo,
    piece: PieceInfo,
    dX: number,
    dY: number,
  ): Move | null {
    let x = piece.x;
    let y = piece.y;

    let cell = board.getCell(x + dX, y + dY);

    while (
      cell !== null &&
      cell !== WallCell &&
      cell.isWhite === piece.isWhite
    ) {
      x += dX;
      y += dY;

      cell = board.getCell(x + dX, y + dY);
    }

    if (cell === null) {
      return new Move(x + dX, y + dY);
    }

    return null;
  }

  private static addSimpleMoves(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
  ) {
    const dY = piece.isWhite ? -1 : 1;

    for (let dX = -1; dX <= 1; ++dX) {
      const move = this.getSimpleMove(board, piece, dX, dY);
      if (move !== null) {
        moves.push(move);
      }
    }
  }

  /**
   * Calculates all the possible moves for a given piece
   * @returns Move array if there are any available moves, otherwise null
   */
  public static calculateMoves(
    board: BoardInfo,
    piece: PieceInfo,
  ): Move[] | null {
    const moves: Move[] = [];

    this.addSimpleMoves(board, moves, piece);

    if (moves.length === 0) {
      return null;
    }

    return moves;
  }

  public static calculateMoveLength(piece: PieceInfo, move: Move): number {
    return MathUtil.calculateLength(piece.x, piece.y, move.x, move.y);
  }
}
