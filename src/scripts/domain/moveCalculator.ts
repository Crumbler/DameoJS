import { Move } from 'domain/move';
import { PieceInfo, WallCell } from 'domain/piece';
import { BoardInfo } from 'domain/board';
import { RVector2, Vector2 } from 'math/Vector2';

export class MoveCalculator {
  private static readonly cardinalDirections: ReadonlyArray<RVector2> = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0)
  ];

  private static readonly allDirections: ReadonlyArray<RVector2> = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0),
    new Vector2(-1, 1),
    new Vector2(1, 1),
    new Vector2(1, -1),
    new Vector2(-1, -1)
  ];

  /**
   * Find a non-capturing move for a pawn in a certain direction
   */
  private static getPawnMoveInDirection(
    board: BoardInfo,
    piece: PieceInfo,
    dV: RVector2,
  ): Move | null {
    const pos = piece.pos;

    pos.add(dV);

    let cell = board.getCell(pos);

    while (
      cell !== null &&
      cell !== WallCell &&
      cell.isWhite === piece.isWhite &&
      !cell.isPromoted
    ) {
      pos.add(dV);
      cell = board.getCell(pos);
    }

    if (cell === null) {
      return new Move([piece.pos, pos]);
    }

    return null;
  }

  /**
   * Adds the moves for a pawn
   */
  private static addPawnMoves(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
  ) {
    const dY = piece.isWhite ? -1 : 1;
    const dV = new Vector2(0, dY);

    for (let dX = -1; dX <= 1; ++dX) {
      dV.x = dX;
      const move = this.getPawnMoveInDirection(board, piece, dV);
      if (move !== null) {
        moves.push(move);
      }
    }
  }

  private static addKingMovesInDirection(
    board: BoardInfo,
    piece: PieceInfo,
    moves: Move[],
    dV: RVector2
  ) {
    const piecePos = piece.pos;
    const pos = piecePos.clone();

    pos.add(dV);

    let cell = board.getCell(pos.x, pos.y);

    while (cell === null) {
      moves.push(new Move([piecePos, pos.clone()]));
      pos.add(dV);

      cell = board.getCell(pos);
    }
  }

  private static addKingMoves(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo
  ) {
    for (const direction of this.allDirections) {
      this.addKingMovesInDirection(board, piece, moves, direction);
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
      this.addKingMoves(board, moves, piece);
    } else {
      this.addPawnMoves(board, moves, piece);
    }

    if (moves.length === 0) {
      return null;
    }

    return moves;
  }
}
