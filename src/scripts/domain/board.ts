import { Piece, PieceInfo } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';

export interface BoardInfo {
  readonly dataView: ReadonlyArray<ReadonlyArray<PieceInfo | null>>;
}

export class Board implements BoardInfo {
  // stored from top to bottom
  private _board: Array<Array<Piece | null>>;

  public constructor() {
    this._board = [];

    this._board = new Array(GameConstants.CellsPerSide);
    for (let i = 0; i < GameConstants.CellsPerSide; ++i) {
      this._board[i] = new Array(GameConstants.CellsPerSide);
    }

    this.resetBoard();
    this.fillBoard();
  }

  private static fillRow(
    row: Array<Piece | null>,
    rowNumber: number,
    pieceCount: number,
    white: boolean,
  ) {
    const cellsPerSide = GameConstants.CellsPerSide;

    for (
      let j = (cellsPerSide - pieceCount) / 2;
      j < cellsPerSide / 2 + pieceCount / 2;
      ++j
    ) {
      const piece = new Piece(white, j, rowNumber);
      row[j] = piece;
    }
  }

  private fillBoard() {
    const board = this._board;

    for (let i = 0; i < 3; ++i) {
      Board.fillRow(board[i], i, GameConstants.CellsPerSide - i * 2, false);
    }

    for (let i = 0; i < 3; ++i) {
      Board.fillRow(
        board[board.length - i - 1],
        board.length - i - 1,
        GameConstants.CellsPerSide - i * 2,
        true,
      );
    }
  }

  public resetBoard() {
    for (let i = 0; i < this._board.length; ++i) {
      const row = this._board[i];
      for (let j = 0; j < row.length; ++j) {
        row[j] = null;
      }
    }
  }

  public get data(): Array<Array<Piece | null>> {
    return this._board;
  }

  public get dataView(): ReadonlyArray<ReadonlyArray<PieceInfo | null>> {
    return this._board;
  }
}
