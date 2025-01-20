import { GameConstants } from 'domain/gameConstants';
import { Move, PieceMoves } from 'domain/move';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

describe('Move tests', () => {
  test('Normal creation', () => {
    new Move([Vector2.fromScalar(1), Vector2.fromScalar(1)]);
  });

  test('Creation - not enough points', () => {
    assert.throws(() => new Move([]));
  });

  test('Creating - invalid coords', () => {
    assert.throws(() => new Move([Vector2.fromScalar(1), Vector2.fromScalar(-6)]))
  });

  const invalidCoordSet = [
    [-1, 0],
    [GameConstants.CellsPerSide, 0],
    [0, -1],
    [0, GameConstants.CellsPerSide]
  ];

  test.for(invalidCoordSet)('Creating with invalid coords: %i %i', ([x, y]) => {
    assert.throws(() => new Move([Vector2.fromScalar(1), new Vector2(x, y)]));
  });

  test('Empty moves', () => {
    const piece = new Piece(false, 0, 0);

    assert.throws(() => {
      new PieceMoves(piece, []);
    });
  });
});