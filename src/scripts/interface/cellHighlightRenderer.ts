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

    this.render(inputState.selection);
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

  private renderSimpleMovesForPiece(moves: ReadonlyArray<Move>) {
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

  private static renderAttackMoveBegin(
    context: CanvasRenderingContext2D,
    move: Move) {
    const cellSize = InterfaceConstants.CellSize;
    const pos = move.firstPoint.clone();
    const secondPos = move.path[1];
    const initialDir = CellHighlightRenderer.getCardinalDirection(
      pos,
      secondPos,
    );

    do {
      pos.add(initialDir);

      context.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
    } while (!pos.equals(secondPos));
  }

  private static renderAttackMoveFull(
    context: CanvasRenderingContext2D,
    move: Move
  ) {
    const cellSize = InterfaceConstants.CellSize;
    const pos = new Vector2();

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
  }

  private renderAttackMovesForPiece(moves: ReadonlyArray<Move>) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectedCell;
    const initialPos = moves[0].firstPoint.clone();

    context.fillRect(initialPos.x * cellSize, initialPos.y * cellSize, cellSize, cellSize);

    context.fillStyle = InterfaceColors.PassedThroughCell;

    for (const move of moves) {
      CellHighlightRenderer.renderAttackMoveBegin(context, move);

      CellHighlightRenderer.renderAttackMoveFull(context, move);
    }

    context.fillStyle = InterfaceColors.ReachableCell;

    for (const move of moves) {
      const endPos = move.lastPoint;

      context.fillRect(
        endPos.x * cellSize,
        endPos.y * cellSize,
        cellSize,
        cellSize,
      );
    }
  }

  private renderAttackMove(move: Move) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectedCell;
    const initialPos = move.firstPoint.clone();

    context.fillRect(initialPos.x * cellSize, initialPos.y * cellSize, cellSize, cellSize);

    context.fillStyle = InterfaceColors.PassedThroughCell;

    CellHighlightRenderer.renderAttackMoveBegin(context, move);

    CellHighlightRenderer.renderAttackMoveFull(context, move);

    context.fillStyle = InterfaceColors.ReachableCell;
    const endPos = move.lastPoint;

    context.fillRect(
      endPos.x * cellSize,
      endPos.y * cellSize,
      cellSize,
      cellSize,
    );
  }

  private render(selection: RSelectionState) {
    const context = this._cellContext;
    const boardSize = InterfaceConstants.BoardSize;

    context.clearRect(0, 0, boardSize, boardSize);

    const hasSelectedPiece = selection.selectedPiece !== null;

    const anyAttackMoves = selection.moves !== null && selection.moves[0].isAttackMove;

    const hasMoveIndex = selection.selectedMoveIndex !== null;

    this.renderSelectablePieces(selection.selectedPiece);

    if (anyAttackMoves) {
      if (!hasMoveIndex) {
        this.renderAttackMovesForPiece(selection.moves!);
      } else {
        this.renderAttackMove(selection.moves![selection.selectedMoveIndex]);
      }

      return;
    }

    if (hasSelectedPiece) {
      this.renderSelectedPiece(selection.selectedPiece);
      this.renderSimpleMovesForPiece(selection.moves!);
    }
  }
}
