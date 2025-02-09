import { Elements } from 'interface/elements';
import { InputState, RSelectionState } from 'interface/inputState';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { PieceInfo } from 'domain/piece';
import { GameInfo } from 'domain/game';
import { Move } from 'domain/move';
import { RVector2, Vector2 } from 'math/Vector2';

/**
 * Renders cell highlights
 */
export class CellHighlightRenderer {
  private readonly _cellContext =
    Elements.findById<HTMLCanvasElement>('cell-canvas').getContext('2d')!;
  private readonly _game: GameInfo;
  private static readonly cardinalDirections: ReadonlyArray<RVector2> = [
    new Vector2(0, 1),
    new Vector2(1, 0),
    new Vector2(0, -1),
    new Vector2(-1, 0),
  ];

  private static getCardinalDirection(from: RVector2, to: RVector2): RVector2 {
    if (from.x < to.x) {
      return this.cardinalDirections[1];
    }

    if (from.y < to.y) {
      return this.cardinalDirections[0];
    }

    if (from.x > to.x) {
      return this.cardinalDirections[3];
    }

    return this.cardinalDirections[2];
  }

  public constructor(game: GameInfo, inputState: InputState) {
    this._game = game;

    inputState.subscribeToSelectionChanges((selection) =>
      this.render(selection),
    );

    this.render(null);
  }

  private renderSelectedPiece(piece: PieceInfo) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectedCell;

    context.fillRect(
      piece.pos.x * cellSize,
      piece.pos.y * cellSize,
      cellSize,
      cellSize,
    );
  }

  private renderSimpleMoves(moves: ReadonlyArray<Move>) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.ReachableCell;

    for (const move of moves) {
      const lastPoint = move.lastPoint;

      context.fillRect(
        lastPoint.x * cellSize,
        lastPoint.y * cellSize,
        cellSize,
        cellSize,
      );
    }
  }

  private renderSelectablePieces(piece: PieceInfo | null) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectableCell;

    for (const pieceMoves of this._game.moves) {
      const rPiece = pieceMoves.piece;
      if (rPiece === piece) {
        continue;
      }

      context.fillRect(
        rPiece.pos.x * cellSize,
        rPiece.pos.y * cellSize,
        cellSize,
        cellSize,
      );
    }
  }

  private renderAttack(move: Move) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectedCell;
    const pos = move.firstPoint.clone();

    context.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);

    context.fillStyle = InterfaceColors.PassedThroughCell;

    const secondPos = move.path[1];
    const initialDir = CellHighlightRenderer.getCardinalDirection(
      pos,
      secondPos,
    );
    do {
      pos.add(initialDir);

      context.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
    } while (!pos.equals(secondPos));

    for (let i = 1; i < move.path.length - 1; ++i) {
      pos.x = move.path[i].x;
      pos.y = move.path[i].y;

      const endPoint = move.path[i + 1];

      const dir = CellHighlightRenderer.getCardinalDirection(pos, endPoint);

      do {
        context.fillRect(
          pos.x * cellSize,
          pos.y * cellSize,
          cellSize,
          cellSize,
        );

        pos.add(dir);
      } while (!pos.equals(endPoint));
    }

    context.fillStyle = InterfaceColors.ReachableCell;
    const endPos = move.lastPoint;

    context.fillRect(
      endPos.x * cellSize,
      endPos.y * cellSize,
      cellSize,
      cellSize,
    );
  }

  private render(selection: RSelectionState | null) {
    const context = this._cellContext;
    const boardSize = InterfaceConstants.BoardSize;

    context.clearRect(0, 0, boardSize, boardSize);

    if (selection === null) {
      this.renderSelectablePieces(null);
      return;
    }

    const isAttackMove = selection.selectedMoveIndex !== null;

    if (isAttackMove) {
      if (selection.moves === null) {
        throw new Error('Cannot render attack move when moves is null');
      }

      this.renderAttack(selection.moves[selection.selectedMoveIndex as number]);
    } else {
      this.renderSelectablePieces(selection.selectedPiece);

      if (selection.selectedPiece !== null) {
        this.renderSelectedPiece(selection.selectedPiece);
        this.renderSimpleMoves(selection.moves!);
      }
    }
  }
}
