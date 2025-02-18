import { Board } from 'domain/board';
import { GameConstants } from 'domain/gameConstants';
import { MoveCalculator } from 'domain/moveCalculator';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

describe('Simple king moves', () => {
  test('Base', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0), true);
    board.addPiece(piece);
    board.addPiece(new Piece(false, new Vector2(1, 2)));
    board.addPiece(new Piece(false, new Vector2(0, 2)));
    board.addPiece(new Piece(false, new Vector2(2, 2)));
    board.addPiece(new Piece(false, new Vector2(2, 1)));
    board.addPiece(new Piece(false, new Vector2(2, 0)));

    const moves = MoveCalculator.calculateMoves(board, piece);

    assert.lengthOf(moves!, 3);
  });

  test('Long moves', () => {
    const board = new Board();
    const piece = new Piece(false, new Vector2(0, 0), true);
    board.addPiece(piece);

    const moves = MoveCalculator.calculateMoves(board, piece);

    assert.lengthOf(moves!, GameConstants.CellsPerSide * 3 - 3);
  });
});