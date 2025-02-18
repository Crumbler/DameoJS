import { Piece, PieceInfo, Wall, WallCell } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';
import { Matrix, ReadonlyMatrix } from 'misc/arrayTypes';
import { RVector2, Vector2 } from 'math/Vector2';

export interface BoardInfo {
  readonly dataView: ReadonlyMatrix<PieceInfo | null>;
  getCell(x: number, y: number): PieceInfo | Wall | null;
  getCell(pos: RVector2): PieceInfo | Wall | null;
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
      const piece = new Piece(white, new Vector2(j, rowNumber));
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
      if (this._board[piece.pos.y][piece.pos.x] !== null) {
        throw new Error(`Cell at ${piece.pos} already occupied`);
      }

      this._board[piece.pos.y][piece.pos.x] = piece;
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

  public getCell(pos: RVector2): PieceInfo | Wall | null;
  public getCell(x: number, y: number): PieceInfo | Wall | null;
  public getCell(pos: RVector2 | number, y?: number): PieceInfo | Wall | null {
    const cellsPerSide = GameConstants.CellsPerSide;

    let x = 0;
    if (y === undefined) {
      x = (pos as RVector2).x;
      y = (pos as RVector2).y;
    } else {
      x = pos as number;
    }

    if (x < 0 || x >= cellsPerSide || y < 0 || y >= cellsPerSide) {
      return WallCell;
    }

    return this._board[y][x];
  }

  public movePiece(from: RVector2, to: RVector2, isAttackMove = false) {
    Piece.checkCoordinate(from.x, 'fromX');
    Piece.checkCoordinate(from.y, 'fromY');
    Piece.checkCoordinate(to.x, 'toX');
    Piece.checkCoordinate(to.y, 'toY');

    const piece = this._board[from.y][from.x];

    if (piece === null) {
      throw new Error(`Piece at ${from.x} ${from.y} not present`);
    }

    const newCell = this._board[to.y][to.x];

    if (!isAttackMove && newCell !== null) {
      throw new Error(`Cell at ${to.x} ${to.y} not empty`);
    }

    this._board[from.y][from.x] = null;
    this._board[to.y][to.x] = piece;

    piece!.moveTo(to);
  }

  public removePiece(from: RVector2) {
    Piece.checkCoordinate(from.x, 'fromX');
    Piece.checkCoordinate(from.y, 'fromY');

    const piece = this._board[from.y][from.x];

    if (piece === null) {
      throw new Error(`Cell at ${from.x} ${from.y} empty`);
    }

    this._board[from.y][from.x] = null;
  }

  public addPiece(piece: Piece) {
    if (this._board[piece.pos.y][piece.pos.x] !== null) {
      throw new Error('Cell at ' + piece.pos + ' already occupied');
    }

    this._board[piece.pos.y][piece.pos.x] = piece;
  }

  public get data(): ReadonlyMatrix<Piece | null> {
    return this._board;
  }

  public get dataView(): ReadonlyMatrix<PieceInfo | null> {
    return this._board;
  }
}
