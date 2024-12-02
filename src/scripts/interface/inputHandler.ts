import { GameInfo } from 'domain/gameInfo';
import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { GameConstants } from 'domain/gameConstants';

/**
 * Handles user input
 */
export class InputHandler {
  private readonly _game: GameInfo;
  private readonly _inputState: InputState;
  private readonly _container = Elements.findById('game-container');

  private registerHandlers() {
    this._container.addEventListener(
      'click',
      (event) => this.handleClick(event),
      true,
    );
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

  public constructor(game: GameInfo, inputState: InputState) {
    this._game = game;

    this._inputState = inputState;

    this.registerHandlers();
  }
}
