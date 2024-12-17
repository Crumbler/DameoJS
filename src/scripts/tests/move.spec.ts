import { GameConstants } from 'domain/gameConstants';
import { Move, PieceMoves } from 'domain/move';
import { Piece } from 'domain/piece';

describe('Move tests', () => {
  test('Normal creation', () => {
    new Move(0, 0);
  });

  const invalidCoordSet = [
    [-1, 0],
    [GameConstants.CellsPerSide, 0],
    [0, -1],
    [0, GameConstants.CellsPerSide]
  ];

  test.for(invalidCoordSet)('Creating with invalid coords: %i %i', ([x, y]) => {
    assert.throws(() => new Move(x, y));
  });

  test('Empty moves', () => {
    const piece = new Piece(false, 0, 0);

    assert.throws(() => {
      new PieceMoves(piece, []);
    });
  });
});