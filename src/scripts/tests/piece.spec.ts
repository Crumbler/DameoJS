import { GameConstants } from 'domain/gameConstants';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

describe('Piece tests', () => {
  test('Piece normal creation', () => {
    const x = 2;
    const y = 3;
    const piece = new Piece(false, new Vector2(x, y));

    assert.strictEqual(piece.pos.x, x);
    assert.strictEqual(piece.pos.y, y);
  });

  test.for([
    true,
    false
  ])('Test whiteness: %o', (isWhite) => {
    const piece = new Piece(isWhite, new Vector2());
    assert.strictEqual(piece.isWhite, isWhite);
  });

  test.for([
    true,
    false
  ])('Test promotion: %o', (isPromoted) => {
    const piece = new Piece(false, new Vector2(), isPromoted);
    assert.strictEqual(piece.isPromoted, isPromoted);
  });

  const invalidCoordSet = [
    [-1, 0],
    [GameConstants.CellsPerSide, 0],
    [0, -1],
    [0, GameConstants.CellsPerSide]
  ];

  test.for(invalidCoordSet)('Creating with invalid coords: %i %i', ([x, y]) => {
    assert.throws(() => new Piece(false, new Vector2(x, y)));
  });

  test('Moving', () => {
    const piece = new Piece(false, new Vector2());

    piece.moveTo(Vector2.fromScalar(1));
  });

  test.for(invalidCoordSet)('Moving to invalid coords: %i %i', ([x, y]) => {
    const piece = new Piece(false, new Vector2());

    assert.throws(() => piece.moveTo(new Vector2(x, y)));
  });

  test('Initially not promoted', () => {
    const piece = new Piece(false, new Vector2());
    assert.isFalse(piece.isPromoted);
  });

  test('Promotion successful', () => {
    const piece = new Piece(false, new Vector2());

    piece.promote();

    assert.isTrue(piece.isPromoted);
  });

  test('Double promotion forbidden', () => {
    const piece = new Piece(false, new Vector2());

    piece.promote();

    assert.throws(() => {
      piece.promote();
    });
  });
});