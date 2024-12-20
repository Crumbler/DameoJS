import { Board, BoardInfo } from 'domain/board';
import { GameConstants } from 'domain/gameConstants';

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

  test('Filling', () => {
    const board = new Board();

    board.fillBoard();

    testBoardFilled(board);
  });

  test('Repeated fill throws error', () => {
    const board = new Board();
    board.fillBoard();

    assert.throws(() => {
      board.fillBoard();
    });
  });

  test('Reset', () => {
    const board = new Board();

    board.fillBoard();
    board.reset();

    testBoardFilled(board);
  });

  describe('Movement', () => {
    test('Successful move', () => {
      const board = new Board();
      board.fillBoard();

      board.movePiece(0, 0, 0, 1);
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
        board.movePiece(fromX, fromY, toX, toY);
      });
    });

    test('Move from empty cell', () => {
      const board = new Board();

      assert.throws(() => {
        board.movePiece(0, 0, 1, 1);
      });
    });

    test('Move into another cell', () => {
      const board = new Board();
      board.fillBoard();

      assert.throws(() => {
        board.movePiece(0, 0, 1, 0);
      });
    });

    test('Move to same cell', () => {
      const board = new Board();
      board.fillBoard();

      assert.throws(() => {
        board.movePiece(0, 0, 0, 0);
      });
    });
  });
});