import { Move } from 'domain/move';
import { PieceInfo, Wall, WallCell } from 'domain/piece';
import { BoardInfo } from 'domain/board';
import { RVector2, Vector2 } from 'math/Vector2';

export class MoveCalculator {
  private static readonly cardinalDirections: ReadonlyArray<RVector2> = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0),
  ];

  private static readonly allDirections: ReadonlyArray<RVector2> = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0),
    new Vector2(-1, 1),
    new Vector2(1, 1),
    new Vector2(1, -1),
    new Vector2(-1, -1),
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
    dV: RVector2,
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
    piece: PieceInfo,
  ) {
    for (const direction of this.allDirections) {
      this.addKingMovesInDirection(board, piece, moves, direction);
    }
  }

  private static areOpposite(a: RVector2, b: RVector2): boolean {
    return a.x === -b.x && a.y === -b.y;
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

  private static addPawnAttackMovesRec(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
    path: Vector2[],
    toRemove: PieceInfo[],
    pos: Vector2,
  ) {
    let hasFurtherMoves = false;

    for (const direction of this.cardinalDirections) {
      pos.add(direction);

      const cell1 = board.getCell(pos);

      // If not enemy piece or removed piece skip direction
      // Due to the way pawns attack we cannot encounter
      // our own piece here
      if (
        cell1 === null ||
        cell1 === WallCell ||
        cell1.isWhite === piece.isWhite ||
        toRemove.includes(cell1)
      ) {
        pos.sub(direction);
        continue;
      }

      pos.add(direction);

      const cell2 = board.getCell(pos);

      // If not empty cell or self
      if (cell2 !== null && cell2 !== piece) {
        pos.sub(direction).sub(direction);
        continue;
      }

      hasFurtherMoves = true;

      toRemove.push(cell1);
      path.push(pos.clone());

      this.addPawnAttackMovesRec(board, moves, piece, path, toRemove, pos);

      path.pop();
      toRemove.pop();

      pos.sub(direction).sub(direction);
    }

    if (!hasFurtherMoves) {
      moves.push(new Move(path.slice(), toRemove.slice()));
    }
  }

  private static addPawnAttackMoves(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
  ) {
    const toRemove: PieceInfo[] = [];
    const pos = piece.pos;
    const path: Vector2[] = [pos.clone()];

    for (const direction of this.cardinalDirections) {
      pos.add(direction);
      const cell1 = board.getCell(pos);

      // If not enemy piece
      if (
        cell1 === null ||
        cell1 === WallCell ||
        cell1.isWhite === piece.isWhite
      ) {
        pos.sub(direction);
        continue;
      }

      pos.add(direction);
      const cell2 = board.getCell(pos);

      // If not empty cell
      if (cell2 !== null) {
        pos.sub(direction).sub(direction);
        continue;
      }

      toRemove.push(cell1);
      path.push(pos.clone());

      this.addPawnAttackMovesRec(board, moves, piece, path, toRemove, pos);

      path.pop();
      toRemove.pop();

      pos.sub(direction).sub(direction);
    }
  }

  private static addKingAttackMovesRec(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
    path: Vector2[],
    toRemove: PieceInfo[],
    pos: Vector2,
    direction: RVector2,
  ) {
    if (!this.kingHasAttacksAlongLine(board, toRemove, piece, pos, direction)) {
      this.kingAddStopsAlongLine(
        board,
        moves,
        piece,
        path,
        toRemove,
        pos,
        direction,
      );

      return;
    }

    let cellsAdvanced = 0;

    let cell1: Wall | PieceInfo | null = null;

    do {
      for (const dir of this.cardinalDirections) {
        if (dir === direction || this.areOpposite(dir, direction)) {
          continue;
        }

        this.tryAddKingAttackInDirection(
          board,
          moves,
          piece,
          path,
          toRemove,
          pos,
          dir,
        );
      }

      pos.add(direction);
      ++cellsAdvanced;

      cell1 = board.getCell(pos);

      // Advance while empty cell or
      // own piece
    } while (cell1 === null || cell1 === piece);

    // Wall or friendly piece or removed piece
    if (
      cell1 === WallCell ||
      cell1.isWhite === piece.isWhite ||
      toRemove.includes(cell1)
    ) {
      pos.x -= direction.x * cellsAdvanced;
      pos.y -= direction.y * cellsAdvanced;
      return;
    }

    pos.add(direction);
    ++cellsAdvanced;

    const cell2 = board.getCell(pos);

    // Free cell
    const hasAttack = cell2 === null || cell2 === piece;

    if (hasAttack) {
      toRemove.push(cell1);

      this.addKingAttackMovesRec(
        board,
        moves,
        piece,
        path,
        toRemove,
        pos,
        direction,
      );

      toRemove.pop();
    }

    pos.x -= direction.x * cellsAdvanced;
    pos.y -= direction.y * cellsAdvanced;
  }

  private static kingHasAttacksAlongLine(
    board: BoardInfo,
    toRemove: ReadonlyArray<PieceInfo>,
    piece: PieceInfo,
    pos: Vector2,
    mainDir: RVector2,
  ): boolean {
    if (this.kingHasAttackInDirection(
      board,
      toRemove,
      piece,
      pos,
      mainDir
    )) {
      return true;
    }

    let cell: Wall | PieceInfo | null = null;

    let cellsAdvanced = 0;

    // While empty cell
    while (cell === null || cell === piece) {
      for (const dir of this.cardinalDirections) {
        if (dir === mainDir || this.areOpposite(dir, mainDir)) {
          continue;
        }

        if (this.kingHasAttackInDirection(board, toRemove, piece, pos, dir)) {
          pos.x -= mainDir.x * cellsAdvanced;
          pos.y -= mainDir.y * cellsAdvanced;

          return true;
        }
      }

      pos.add(mainDir);
      ++cellsAdvanced;
      cell = board.getCell(pos);
    }

    pos.x -= mainDir.x * cellsAdvanced;
    pos.y -= mainDir.y * cellsAdvanced;

    return false;
  }

  private static kingHasAttackInDirection(
    board: BoardInfo,
    toRemove: ReadonlyArray<PieceInfo>,
    piece: PieceInfo,
    pos: Vector2,
    direction: RVector2,
  ): boolean {
    let hasAttack = false;
    let cellsAdvanced = 0;

    let cell1: Wall | PieceInfo | null = null;

    do {
      pos.add(direction);
      ++cellsAdvanced;
      cell1 = board.getCell(pos);

      // Advance while empty cell or
      // own piece
    } while (cell1 === null || cell1 === piece);

    // Wall or friendly piece or removed piece
    if (
      cell1 === WallCell ||
      cell1.isWhite === piece.isWhite ||
      toRemove.includes(cell1)
    ) {
      pos.x -= direction.x * cellsAdvanced;
      pos.y -= direction.y * cellsAdvanced;
      return false;
    }

    pos.add(direction);
    ++cellsAdvanced;
    const cell2 = board.getCell(pos);

    // Free cell
    hasAttack = cell2 === null || cell2 === piece;

    pos.x -= direction.x * cellsAdvanced;
    pos.y -= direction.y * cellsAdvanced;

    return hasAttack;
  }

  private static kingAddStopsAlongLine(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
    path: Vector2[],
    toRemove: ReadonlyArray<PieceInfo>,
    pos: Vector2,
    direction: RVector2,
  ) {
    let cellsAdvanced = 0;

    let cell = board.getCell(pos);

    do {
      path.push(pos.clone());

      moves.push(new Move(path.slice(), toRemove.slice()));

      path.pop();

      ++cellsAdvanced;
      pos.add(direction);

      cell = board.getCell(pos);
    } while (cell === null || cell === piece);

    pos.x -= direction.x * cellsAdvanced;
    pos.y -= direction.y * cellsAdvanced;
  }

  private static tryAddKingAttackInDirection(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
    path: Vector2[],
    toRemove: PieceInfo[],
    pos: Vector2,
    direction: RVector2,
  ) {
    let cellsAdvanced = 0;

    let cell1: Wall | PieceInfo | null = null;

    do {
      pos.add(direction);
      ++cellsAdvanced;

      cell1 = board.getCell(pos);

      // Advance while empty cell or
      // own piece
    } while (cell1 === null || cell1 === piece);

    // Wall or friendly piece
    // or removed piece
    if (
      cell1 === WallCell ||
      cell1.isWhite === piece.isWhite ||
      toRemove.includes(cell1)
    ) {
      pos.x -= direction.x * cellsAdvanced;
      pos.y -= direction.y * cellsAdvanced;
      return;
    }

    pos.add(direction);
    ++cellsAdvanced;

    const cell2 = board.getCell(pos);

    // Free cell
    const hasAttack = cell2 === null || cell2 === piece;

    if (hasAttack) {
      toRemove.push(cell1);

      const partPos = pos.clone();
      partPos.x -= direction.x * cellsAdvanced;
      partPos.y -= direction.y * cellsAdvanced;

      path.push(partPos);

      this.addKingAttackMovesRec(
        board,
        moves,
        piece,
        path,
        toRemove,
        pos,
        direction,
      );

      path.pop();
      toRemove.pop();
    }

    pos.x -= direction.x * cellsAdvanced;
    pos.y -= direction.y * cellsAdvanced;
  }

  private static addKingAttackMoves(
    board: BoardInfo,
    moves: Move[],
    piece: PieceInfo,
  ) {
    const toRemove: PieceInfo[] = [];
    const pos = piece.pos;
    const path: Vector2[] = [pos.clone()];

    for (const direction of this.cardinalDirections) {
      let cell1: Wall | null | PieceInfo = null;

      let cellsAdvanced = 0;

      do {
        ++cellsAdvanced;

        pos.add(direction);

        cell1 = board.getCell(pos);
      } while (cell1 === null);

      // If not enemy piece
      if (cell1 === WallCell || cell1.isWhite === piece.isWhite) {
        pos.x -= direction.x * cellsAdvanced;
        pos.y -= direction.y * cellsAdvanced;
        continue;
      }

      ++cellsAdvanced;

      pos.add(direction);

      const cell2 = board.getCell(pos);

      // If not empty cell
      if (cell2 !== null) {
        pos.x -= direction.x * cellsAdvanced;
        pos.y -= direction.y * cellsAdvanced;
        continue;
      }

      toRemove.push(cell1);

      this.addKingAttackMovesRec(
        board,
        moves,
        piece,
        path,
        toRemove,
        pos,
        direction,
      );

      toRemove.pop();

      pos.x -= direction.x * cellsAdvanced;
      pos.y -= direction.y * cellsAdvanced;
    }
  }

  /**
   * Calculates all the possible attack moves for a given piece
   * @returns Move array if there are any available moves, otherwise null
   */
  public static calculateAttackMoves(
    board: BoardInfo,
    piece: PieceInfo,
  ): Move[] | null {
    const moves: Move[] = [];

    if (piece.isPromoted) {
      this.addKingAttackMoves(board, moves, piece);
    } else {
      this.addPawnAttackMoves(board, moves, piece);
    }

    if (moves.length === 0) {
      return null;
    }

    return moves;
  }

  private static pawnHasAttackMoves(
    board: BoardInfo,
    piece: PieceInfo,
  ): boolean {
    for (const direction of this.cardinalDirections) {
      const pos = piece.pos.clone();

      pos.add(direction);

      const cell1 = board.getCell(pos);

      pos.add(direction);

      const cell2 = board.getCell(pos);

      if (
        cell1 !== WallCell &&
        cell1 !== null &&
        cell1.isWhite !== piece.isWhite &&
        cell2 === null
      ) {
        return true;
      }
    }

    return false;
  }

  private static kingHasAttackMoves(
    board: BoardInfo,
    piece: PieceInfo,
  ): boolean {
    for (const direction of this.cardinalDirections) {
      const pos = piece.pos.clone();

      let cell1: PieceInfo | null | Wall = null;

      do {
        pos.add(direction);
        cell1 = board.getCell(pos);
      } while (cell1 === null);

      pos.add(direction);

      const cell2 = board.getCell(pos);

      if (
        cell1 !== WallCell &&
        cell1 !== null &&
        cell1.isWhite !== piece.isWhite &&
        cell2 === null
      ) {
        return true;
      }
    }

    return false;
  }

  public static hasAttackMoves(board: BoardInfo, piece: PieceInfo): boolean {
    if (piece.isPromoted) {
      return this.kingHasAttackMoves(board, piece);
    }

    return this.pawnHasAttackMoves(board, piece);
  }
}
