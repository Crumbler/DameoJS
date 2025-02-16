import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { GameConstants } from 'domain/gameConstants';
import { PieceInfo } from 'domain/piece';
import { GameInfo, GameInteractable } from 'domain/game';
import { Move } from 'domain/move';
import { GameEvent } from 'domain/gameEvent';
import { DialogManager } from 'interface/dialogManager';

/**
 * Handles user input
 */
export class InputHandler {
  private readonly _game: GameInfo & GameInteractable;
  private readonly _inputState: InputState;
  private readonly _container = Elements.findById('game-container');
  private readonly _undoButton = Elements.findById('undo-button');
  private readonly _restartButton = Elements.findById('restart-button');
  private readonly _cycleButton = Elements.findById('cycle-button');
  private _pieceToMove: PieceInfo | null = null;
  private _moveToPerform: Move | null = null;

  private registerHandlers() {
    this._container.addEventListener(
      'click',
      (event) => this.handleClick(event),
      true,
    );

    this._undoButton.addEventListener('click', () => this.handleUndoClick());

    this._restartButton.addEventListener('click', () =>
      this.handleResetClick(),
    );

    this._cycleButton.addEventListener('click', () => {
      this.handleCycleClick();
    });

    this._inputState.subscribeAcceptingInput((param) =>
      this.onAcceptingInputChanged(param),
    );

    this._game.registerEventHandler((event) => this.handleGameEvent(event));
  }

  private onAcceptingInputChanged(acceptingInput: boolean) {
    if (!acceptingInput) {
      return;
    }

    if (this._pieceToMove === null) {
      throw new Error('_pieceToMove not supposed to be null');
    }

    if (this._moveToPerform === null) {
      throw new Error('_moveToPerform not supposed to be null');
    }

    this._game.performMove(this._pieceToMove, this._moveToPerform);

    this._pieceToMove = null;
    this._moveToPerform = null;
  }

  private startMove(piece: PieceInfo, move: Move) {
    if (this._pieceToMove !== null) {
      throw new Error('_pieceToMove is supposed to be null');
    }

    if (this._moveToPerform !== null) {
      throw new Error('_moveToPerform is supposed to be null');
    }

    this._pieceToMove = piece;
    this._moveToPerform = move;

    this._inputState.raisePerformMove(piece, move);
  }

  private tryMoveToCell(
    piece: PieceInfo,
    cellX: number,
    cellY: number,
  ): boolean {
    const moves = this._inputState.selection.moves;

    if (moves === null) {
      return false;
    }

    let move: Move | null = null;

    const selection = this._inputState.selection;

    // If selection attack move
    if (selection.selectedMoveIndex !== null) {
      move = moves[selection.selectedMoveIndex];

      // Make sure we're clicking on the last point of the selected move
      if (move.lastPoint.x !== cellX || move.lastPoint.y !== cellY) {
        return false;
      }
      // Selection without an index, find move by last point
    } else {
      move =
        moves.find((mv) => {
          const lastPoint = mv.lastPoint;

          return lastPoint.x === cellX && lastPoint.y === cellY;
        }) ?? null;

      if (move === null) {
        return false;
      }
    }

    this.startMove(piece, move);

    return true;
  }

  private handleCellClick(cellX: number, cellY: number) {
    if (!this._inputState.acceptingInput) {
      return;
    }

    const piece = this._game.board.dataView[cellY][cellX];

    const currentPiece = this._inputState.selectedPiece;

    if (
      currentPiece !== null &&
      this.tryMoveToCell(currentPiece, cellX, cellY)
    ) {
      return;
    }

    // If the selection is the same, do nothing
    if (currentPiece === piece) {
      return;
    }

    let pieceMoves: ReadonlyArray<Move> | null = null;

    // If clicked on other player's piece or own piece without moves, deselect
    if (piece !== null) {
      pieceMoves = this._game.findPieceMoves(piece);

      if (pieceMoves === null) {
        if (currentPiece !== null) {
          this._inputState.deselectPiece();
        }

        return;
      }
    }

    this._inputState.setSelection(piece, pieceMoves, null);
  }

  private handleClick(event: MouseEvent) {
    if (!this._inputState.acceptingInput) {
      return;
    }

    const x =
      (event.offsetX / this._container.clientWidth) *
      GameConstants.CellsPerSide;
    const y =
      (event.offsetY / this._container.clientHeight) *
      GameConstants.CellsPerSide;

    const cellX = x | 0;
    const cellY = y | 0;

    this.handleCellClick(cellX, cellY);
  }

  private handleUndoClick() {
    if (!this._inputState.acceptingInput) {
      return;
    }

    this._game.undoMove();
  }

  private handleCycleClick() {
    if (!this._inputState.acceptingInput) {
      return;
    }

    const selection = this._inputState.selection;

    if (selection.moves === null || selection.moves.length <= 1) {
      return;
    }

    let newIndex = 0;

    if (selection.selectedMoveIndex !== null) {
      newIndex = (selection.selectedMoveIndex + 1) % selection.moves.length;
    }

    this._inputState.setSelectionindex(newIndex);
  }

  private async handleResetClick() {
    if (!this._inputState.acceptingInput) {
      return;
    }

    const restart = await DialogManager.openRestartDialog();

    if (restart) {
      this._game.reset();
      this._inputState.deselectPiece();
    }
  }

  private handleGameEvent(event: GameEvent) {
    if (event.isGameResetEvent()) {
      this._inputState.deselectPiece();
    }

    if (event.isPiecesChangedEvent()) {
      this._inputState.deselectPiece();
    }
  }

  public constructor(
    game: GameInfo & GameInteractable,
    inputState: InputState,
  ) {
    this._game = game;

    this._inputState = inputState;

    this.registerHandlers();
  }
}
