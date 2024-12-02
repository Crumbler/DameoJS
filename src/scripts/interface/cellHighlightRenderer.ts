import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { GameInfo } from 'domain/gameInfo';
import { InterfaceColors } from 'interface/interfaceColors';
import { PieceInfo } from 'domain/piece';

/**
 * Renders cell highlights
 */
export class CellHighlightRenderer {
  private readonly _cellContext = Elements.findById<HTMLCanvasElement>('cell-canvas').getContext('2d')!;
  private readonly _game: GameInfo;

  public constructor(game: GameInfo, inputState: InputState) {
    this._game = game;

    inputState.subscribeToPieceChanges((piece) => this.onPieceChanged(piece));

    this.render(null);
  }

  private renderSelectedPiece(piece: PieceInfo) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectedCell;

    context.fillRect(
      piece.x * cellSize,
      piece.y * cellSize,
      cellSize,
      cellSize,
    );

    context.fillStyle = InterfaceColors.ReachableCell;

    const moves = this._game.findPieceMoves(piece);
    if (moves === null) {
      return;
    }

    for (const move of moves) {
      context.fillRect(
        move.endCell.x * cellSize,
        move.endCell.y * cellSize,
        cellSize,
        cellSize,
      );
    }
  }

  private render(piece: PieceInfo | null) {
    const context = this._cellContext;
    const boardSize = InterfaceConstants.BoardSize;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectableCell;

    context.clearRect(0, 0, boardSize, boardSize);

    for (const pieceMoves of this._game.moves) {
      const rPiece = pieceMoves.pieceInfo;
      if (rPiece === piece) {
        continue;
      }

      context.fillRect(
        rPiece.x * cellSize,
        rPiece.y * cellSize,
        cellSize,
        cellSize,
      );
    }

    if (piece !== null) {
      this.renderSelectedPiece(piece);
    }
  }

  private onPieceChanged(piece: PieceInfo | null) {
    this.render(piece);
  }
}
