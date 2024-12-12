import { Elements } from '@/interface/elements';
import { InputState } from '@/interface/inputState';
import { GameConstants } from '@/domain/gameConstants';
import { PieceInfo } from '@/domain/piece';
import { GameInfo, GameInteractable } from '@/domain/game';
import { Move } from '@/domain/move';
import { GameEvent } from '@/domain/gameEvent';

/**
 * Handles user input
 */
export class InputHandler {
  private readonly _game: GameInfo & GameInteractable;
  private readonly _inputState: InputState;
  private readonly _container = Elements.findById('game-container');
  private readonly _restartButton = Elements.findById('restart-button');
  private _pieceToMove: PieceInfo | null = null;
  private _moveToPerform: Move | null = null;

  private registerHandlers() {
    this._container.addEventListener(
      'click', (event) => this.handleClick(event),
      true,
    );

    this._restartButton.addEventListener(
      'click', () => this.handleResetClick()
    );

    this._inputState.subscribeAcceptingInput((param) => this.onAcceptingInputChanged(param));

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

    this._inputState.selectedPiece = null;

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

  private tryMoveToCell(piece: PieceInfo, cellX: number, cellY: number): boolean {
    const moves = this._game.findPieceMoves(piece);

    if (moves === null) {
      return false;
    }

    const move = moves.find(mv => mv.x === cellX && mv.y === cellY);

    if (!move) {
      return false;
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

    // If the selection is the same, do nothing
    if (currentPiece === piece) {
      return;
    }

    // If clicked on other player's piece or own piece without moves, deselect
    if (piece !== null && this._game.findPieceMoves(piece) === null) {
      this._inputState.selectedPiece = null;
      return;
    }

    if (piece === null &&
      this._inputState.selectedPiece !== null &&
      this.tryMoveToCell(this._inputState.selectedPiece, cellX, cellY)) {
      return;
    }

    this._inputState.selectedPiece = piece;
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

  private handleResetClick() {
    if (!this._inputState.acceptingInput) {
      return;
    }

    this._game.reset();
    this._inputState.selectedPiece = null;
  }

  private handleGameEvent(event: GameEvent) {
    if (event.isGameResetEvent()) {
      this._inputState.selectedPiece = null;
    }
  }

  public constructor(game: GameInfo & GameInteractable, inputState: InputState) {
    this._game = game;

    this._inputState = inputState;

    this.registerHandlers();
  }
}
