import { Piece, PieceInfo, Wall, WallCell } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';
import { Matrix, ReadonlyMatrix } from 'misc/arrayTypes';

export interface BoardInfo {
  readonly dataView: ReadonlyMatrix<PieceInfo | null>;
  getCell(x: number, y: number): PieceInfo | Wall | null
}

export class Board implements BoardInfo {
  // stored from top to bottom
  private _board: Matrix<Piece | null>;

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

  public getCell(x: number, y: number): PieceInfo | Wall | null {
    const cellsPerSide = GameConstants.CellsPerSide;

    if (x < 0 || x >= cellsPerSide || y < 0 || y >= cellsPerSide) {
      return WallCell;
    }

    return this._board[y][x];
  }

  public movePiece(fromX: number, fromY: number, toX: number, toY: number) {
    const piece = this._board[fromY][fromX];

    if (piece === null) {
      throw new Error(`Piece at ${fromX} ${fromY} not present`);
    }

    const newCell = this._board[toY][toX];

    if (newCell !== null) {
      throw new Error(`Cell at ${toX} ${toY} not empty`);
    }

    this._board[toY][toX] = piece;
    this._board[fromY][fromX] = null;

    piece.moveTo(toX, toY);
  }

  public get data(): Matrix<Piece | null> {
    return this._board;
  }

  public get dataView(): ReadonlyMatrix<PieceInfo | null> {
    return this._board;
  }
}
