import { Piece, PieceInfo, Wall, WallCell } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';
import { Matrix, ReadonlyMatrix } from 'misc/arrayTypes';
import { RVector2 } from 'math/Vector2';

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

    this.clearBoard();
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

  private isClear(): boolean {
    for (const row of this._board) {
      for (const cell of row) {
        if (cell !== null) {
          return false;
        }
      }
    }

    return true;
  }

  public fillStandardBoard() {
    if (!this.isClear()) {
      throw new Error('Board is not clear');
    }

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

  public fillBoard(pieces: ReadonlyArray<Piece>) {
    for (const piece of pieces) {
      this._board[piece.y][piece.x] = piece;
    }
  }

  private clearBoard() {
    for (let i = 0; i < this._board.length; ++i) {
      const row = this._board[i];
      for (let j = 0; j < row.length; ++j) {
        row[j] = null;
      }
    }
  }

  public reset() {
    this.clearBoard();
    this.fillStandardBoard();
  }

  public getCell(x: number, y: number): PieceInfo | Wall | null {
    const cellsPerSide = GameConstants.CellsPerSide;

    if (x < 0 || x >= cellsPerSide || y < 0 || y >= cellsPerSide) {
      return WallCell;
    }

    return this._board[y][x];
  }

  public movePiece(from: RVector2, to: RVector2) {
    Piece.checkCoordinate(from.x, 'fromX');
    Piece.checkCoordinate(from.y, 'fromY');
    Piece.checkCoordinate(to.x, 'toX');
    Piece.checkCoordinate(to.y, 'toY');

    const piece = this._board[from.y][from.x];

    if (piece === null) {
      throw new Error(`Piece at ${from.x} ${from.y} not present`);
    }

    const newCell = this._board[to.y][to.x];

    if (newCell !== null) {
      throw new Error(`Cell at ${to.x} ${to.y} not empty`);
    }

    this._board[to.y][to.x] = piece;
    this._board[from.y][from.x] = null;

    piece.moveTo(to);
  }

  public get data(): Matrix<Piece | null> {
    return this._board;
  }

  public get dataView(): ReadonlyMatrix<PieceInfo | null> {
    return this._board;
  }
}
