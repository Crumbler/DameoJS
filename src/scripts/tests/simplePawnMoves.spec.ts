import { Board } from 'domain/board';
import { MoveCalculator } from 'domain/moveCalculator';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

describe('Simple pawn moves', () => {
  test('No moves', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0));
    board.addPiece(piece);
    board.addPiece(new Piece(true, new Vector2(1, 1)));
    board.addPiece(new Piece(true, new Vector2(0, 1)));

    const moves = MoveCalculator.calculateMoves(board, piece);

    assert.isNull(moves);
  });

  test('Jump over', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0));
    board.addPiece(piece);
    board.addPiece(new Piece(false, new Vector2(1, 1)));
    board.addPiece(new Piece(false, new Vector2(0, 1)));

    const moves = MoveCalculator.calculateMoves(board, piece);

    assert.lengthOf(moves!, 2);
  });

  test('No jump over king', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0));
    board.addPiece(piece);
    board.addPiece(new Piece(false, new Vector2(1, 1), true));
    board.addPiece(new Piece(false, new Vector2(0, 1), true));

    const moves = MoveCalculator.calculateMoves(board, piece);

    assert.isNull(moves);
  });
});