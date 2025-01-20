import { GameConstants } from 'domain/gameConstants';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

describe('Piece tests', () => {
  test('Piece normal creation', () => {
    const x = 2;
    const y = 3;
    const piece = new Piece(false, x, y);

    assert.strictEqual(piece.x, x);
    assert.strictEqual(piece.y, y);
  });

  test.for([
    true,
    false
  ])('Test whiteness: %o', (isWhite) => {
    const piece = new Piece(isWhite, 0, 0);
    assert.strictEqual(piece.isWhite, isWhite);
  });

  const invalidCoordSet = [
    [-1, 0],
    [GameConstants.CellsPerSide, 0],
    [0, -1],
    [0, GameConstants.CellsPerSide]
  ];

  test.for(invalidCoordSet)('Creating with invalid coords: %i %i', ([x, y]) => {
    assert.throws(() => new Piece(false, x, y));
  });

  test('Moving', () => {
    const piece = new Piece(false, 0, 0);

    piece.moveTo(Vector2.fromScalar(1));
  });

  test.for(invalidCoordSet)('Moving to invalid coords: %i %i', ([x, y]) => {
    const piece = new Piece(false, 0, 0);

    assert.throws(() => piece.moveTo(new Vector2(x, y)));
  });

  test('Initially not promoted', () => {
    const piece = new Piece(false, 0, 0);
    assert.isFalse(piece.isPromoted);
  });

  test('Promotion successful', () => {
    const piece = new Piece(false, 0, 0);

    piece.promote();

    assert.isTrue(piece.isPromoted);
  });

  test('Double promotion forbidden', () => {
    const piece = new Piece(false, 0, 0);

    piece.promote();

    assert.throws(() => {
      piece.promote();
    });
  });
});