import { Move } from 'domain/move';
import { PieceInfo, WallCell } from 'domain/piece';
import { BoardInfo } from 'domain/board';
import { RVector2, Vector2 } from 'math/Vector2';

export class MoveCalculator {
  private static getSimpleMove(
    board: BoardInfo,
    piece: PieceInfo,
    dV: RVector2,
  ): Move | null {
    const pos = piece.pos;

    let cell = board.getCell(pos.x + dV.x, pos.y + dV.y);

    while (
      cell !== null &&
      cell !== WallCell &&
      cell.isWhite === piece.isWhite
    ) {
      pos.add(dV);

      cell = board.getCell(pos.x + dV.x, pos.y + dV.y);
    }

    if (cell === null) {
      return new Move([piece.pos, pos.add(dV)]);
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
      const move = this.getSimpleMove(board, piece, new Vector2(dX, dY));
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

    if (piece.isPromoted) {
      // TBD
    } else {
      this.addSimpleMoves(board, moves, piece);
    }

    if (moves.length === 0) {
      return null;
    }

    return moves;
  }
}
