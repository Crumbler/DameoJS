import { Board } from 'domain/board';
import { GameConstants } from 'domain/gameConstants';
import { MoveCalculator } from 'domain/moveCalculator';
import { Piece } from 'domain/piece';
import { RVector2, Vector2 } from 'math/Vector2';

describe('King attack scenarios', () => {
  test('Case 1', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0), true);
    board.addPiece(piece);
    board.addPiece(new Piece(true, new Vector2(1, 0)));

    const moves = MoveCalculator.calculateAttackMoves(board, piece);

    assert.lengthOf(moves!, GameConstants.CellsPerSide - 2);
  });

  test('Case 2', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0), true);
    board.addPiece(piece);
    board.addPiece(new Piece(true, new Vector2(1, 0)));
    board.addPiece(new Piece(true, new Vector2(7, 6)));

    const moves = MoveCalculator.calculateAttackMoves(board, piece);

    assert.lengthOf(moves!, 1);
  });

  test('Case 3', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(7, 1), true);
    board.addPiece(piece);

    board.addPiece(new Piece(true, new Vector2(6, 4)));
    board.addPiece(new Piece(true, new Vector2(7, 2)));

    const friendlyPositions: ReadonlyArray<RVector2> = [
      new Vector2(5, 3),
      new Vector2(3, 4),
      new Vector2(0, 5),
      new Vector2(2, 5),
      new Vector2(4, 5),
      new Vector2(0, 6),
      new Vector2(1, 6),
      new Vector2(2, 6),
      new Vector2(3, 6),
      new Vector2(4, 6),
      new Vector2(5, 6),
      new Vector2(6, 6),
      new Vector2(1, 7),
      new Vector2(4, 7),
      new Vector2(5, 7),
      new Vector2(6, 7),
      new Vector2(7, 7),
    ];

    const enemyPositions: ReadonlyArray<RVector2> = [
      new Vector2(1, 0),
      new Vector2(2, 0),
      new Vector2(4, 0),
      new Vector2(5, 0),
      new Vector2(6, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
    ];

    for (const pos of friendlyPositions) {
      board.addPiece(new Piece(false, pos));
    }

    for (const pos of enemyPositions) {
      board.addPiece(new Piece(true, pos));
    }

    const moves = MoveCalculator.calculateAttackMoves(board, piece);

    assert.isNotNull(moves);
    assert.lengthOf(moves!, 2);
  });

  test('Case 4', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(5, 0), true);
    board.addPiece(piece);

    const friendlyPositions: ReadonlyArray<RVector2> = [
      new Vector2(7, 4),
      new Vector2(1, 5),
      new Vector2(2, 3),
      new Vector2(3, 5),
      new Vector2(7, 5),
      new Vector2(0, 6),
      new Vector2(1, 6),
      new Vector2(3, 6),
      new Vector2(2, 7),
      new Vector2(7, 7),
    ];

    const enemyPositions: ReadonlyArray<RVector2> = [
      new Vector2(5, 2),
      new Vector2(7, 2),
      new Vector2(3, 3),
      new Vector2(4, 3),
      new Vector2(7, 3),
      new Vector2(5, 5)
    ];

    for (const pos of friendlyPositions) {
      board.addPiece(new Piece(false, pos));
    }

    for (const pos of enemyPositions) {
      board.addPiece(new Piece(true, pos));
    }

    const moves = MoveCalculator.calculateAttackMoves(board, piece);

    assert.isNotNull(moves);
    assert.lengthOf(moves!, 2);
    assert.strictEqual(moves![0].lastPoint.y, 6);
    assert.strictEqual(moves![1].lastPoint.y, 7);
  });
});