import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { GameConstants } from 'domain/gameConstants';
import { PieceInfo } from 'domain/piece';
import { GameInteractable } from 'domain/game';
import { GameInfo } from 'domain/gameInfo';

/**
 * Handles user input
 */
export class InputHandler {
  private readonly _game: GameInfo & GameInteractable;
  private readonly _inputState: InputState;
  private readonly _container = Elements.findById('game-container');
  private readonly _restartButton = Elements.findById('restart-button');

  private registerHandlers() {
    this._container.addEventListener(
      'click',
      (event) => this.handleClick(event),
      true,
    );

    this._restartButton.addEventListener(
      'click',
      () => this.handleResetClick()
    );
  }

  private tryMoveToCell(piece: PieceInfo, cellX: number, cellY: number): boolean {
    const moves = this._game.findPieceMoves(piece);

    if (moves === null) {
      return false;
    }

    const move = moves.find(mv => mv.endCell.x === cellX && mv.endCell.y === cellY);

    if (!move) {
      return false;
    }

    this._game.performMove(piece, move);

    return true;
  }

  private handleCellClick(cellX: number, cellY: number) {
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
      this._inputState.selectedPiece = null;
      return;
    }

    this._inputState.selectedPiece = piece;
  }

  private handleClick(event: MouseEvent) {
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
    this._game.reset();
    this._inputState.selectedPiece = null;
  }

  public constructor(game: GameInfo & GameInteractable, inputState: InputState) {
    this._game = game;

    this._inputState = inputState;

    this.registerHandlers();
  }
}
