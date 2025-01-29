import { Board, BoardInfo } from 'domain/board';
import { GameConstants } from 'domain/gameConstants';
import { Piece } from 'domain/piece';
import { Vector2 } from 'math/Vector2';

function testBoardClear(board: BoardInfo) {
  const data = board.dataView;
  for (let i = 0; i < data.length; ++i) {
    const row = data[i];
    for (let j = 0; j < row.length; ++j) {
      assert.strictEqual(row[j], null, `Cell (${i} ${j}) supposed to be null`);
    }
  }
}

function testBoardFilled(board: BoardInfo) {
  let whiteCount = 0;
  let redCount = 0;

  for (const row of board.dataView) {
    for (const cell of row) {
      if (cell === null) {
        continue;
      }

      if (cell.isWhite) {
        ++whiteCount;
      } else {
        ++redCount;
      }
    }
  }

  assert.strictEqual(whiteCount, GameConstants.TotalWhitePieces);
  assert.strictEqual(redCount, GameConstants.TotalRedPieces);
  assert.strictEqual(whiteCount + redCount, GameConstants.TotalPieces);
}

describe('Board tests', () => {
  test('Creation', () => {
    new Board();
  });

  test('Size', () => {
    const board = new Board();

    assert.strictEqual(board.dataView.length, GameConstants.CellsPerSide);

    for (const row of board.dataView) {
      assert.strictEqual(row.length, GameConstants.CellsPerSide);
    }
  });

  test('Initially clear', () => {
    const board = new Board();

    testBoardClear(board);
  });

  test('Fill standard', () => {
    const board = new Board();

    board.fillStandardBoard();

    testBoardFilled(board);
  });

  test('Fill from pieces', () => {
    const board = new Board();
    const piece = new Piece(false, 0, 0);

    board.fillBoard([piece]);

    assert.strictEqual(board.getCell(piece.x, piece.y), piece);
  });

  test('Fill with duplicate pieces throws error', () => {
    const board = new Board();
    const piece = new Piece(false, 0, 0);

    assert.throws(() => {
      board.fillBoard([piece, piece]);
    });
  });

  test('Repeated fill throws error', () => {
    const board = new Board();
    board.fillStandardBoard();

    assert.throws(() => {
      board.fillStandardBoard();
    });
  });

  test('Reset', () => {
    const board = new Board();

    board.fillStandardBoard();
    board.reset();

    testBoardFilled(board);
  });

  describe('Removal', () => {
    test('Success', () => {
      const board = new Board();
      board.fillStandardBoard();

      board.removePiece(Vector2.fromScalar(0));

      assert.strictEqual(board.dataView[0][0], null);
    });

    test('Throw on removing from empty cell', () => {
      const board = new Board();

      assert.throws(() => {
        board.removePiece(new Vector2(0, 0));
      });
    });
  });

  describe('Movement', () => {
    test('Successful move', () => {
      const board = new Board();
      board.fillStandardBoard();

      board.movePiece(Vector2.fromScalar(0), new Vector2(0, 1));
    });

    const invalidMoveSet = [
      [-1, 0, 0, 0],
      [GameConstants.CellsPerSide, 0, 0, 0],
      [0, -1, 0, 0],
      [0, GameConstants.CellsPerSide, 0, 0],
      [0, 0, -1, 0],
      [0, 0, GameConstants.CellsPerSide, 0],
      [0, 0, 0, -1],
      [0, 0, 0, GameConstants.CellsPerSide]
    ];

    test.for(invalidMoveSet)(`Invalid move from (%i, %i) to (%i, %i)`, ([fromX, fromY, toX, toY]) => {
      const board = new Board();

      assert.throws(() => {
        board.movePiece(new Vector2(fromX, fromY), new Vector2(toX, toY));
      });
    });

    test('Move from empty cell', () => {
      const board = new Board();

      assert.throws(() => {
        board.movePiece(Vector2.fromScalar(0), Vector2.fromScalar(1));
      });
    });

    test('Move into another cell', () => {
      const board = new Board();
      board.fillStandardBoard();

      assert.throws(() => {
        board.movePiece(Vector2.fromScalar(0), Vector2.fromScalar(1));
      });
    });

    test('Move to same cell', () => {
      const board = new Board();
      board.fillStandardBoard();

      assert.throws(() => {
        board.movePiece(Vector2.fromScalar(0), Vector2.fromScalar(0));
      });
    });
  });
});