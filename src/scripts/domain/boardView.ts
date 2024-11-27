import { BoardInfo } from 'domain/board';
import { PieceInfo, Wall, WallCell } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';
import { ReadonlyMatrix } from 'misc/arrayTypes';

export class BoardView {
  private readonly data: ReadonlyMatrix<PieceInfo | null>;

  public constructor(board: BoardInfo) {
    this.data = board.dataView;
  }

  public getCell(x: number, y: number): PieceInfo | Wall | null {
    const cellsPerSide = GameConstants.CellsPerSide;

    if (x < 0 || x >= cellsPerSide || y < 0 || y >= cellsPerSide) {
      return WallCell;
    }

    return this.data[y][x];
  }
}
