import { GameInfo } from 'domain/gameInfo';
import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { GameConstants } from 'domain/gameConstants';
import { Player } from 'domain/player';

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

    const isWhite = this._game.currentPlayer === Player.White;

    const currentPiece = this._inputState.selectedPiece;

    if (currentPiece === null && piece === null) {
      return;
    }

    if (currentPiece !== piece) {
      if (piece !== null && piece.isWhite !== isWhite) {
        this._inputState.selectedPiece = null;
        return;
      }

      this._inputState.selectedPiece = piece;
    }
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
