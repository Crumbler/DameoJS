import { GameInfo, GameInteractable } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { DialogManager } from 'interface/dialogManager';
import { InputState } from 'interface/inputState';

export class GameEndHandler {
  private readonly _game: GameInfo & GameInteractable;
  private readonly _inputState: InputState;

  public constructor(
    game: GameInfo & GameInteractable,
    inputState: InputState) {
    this._game = game;
    this._inputState = inputState;

    game.registerEventHandler((event) => this.handleGameEvent(event));
  }

  private async onGameEnd(redWon: boolean | null) {
    let text: string;

    switch (redWon) {
      case true:
        text = 'The red player has won';
        break;

      case false:
        text = 'The white player has won';
        break;

      default:
        text = 'Draw';
    }

    const restart = await DialogManager.openEndDialog(text);

    if (restart) {
      this._game.reset();
      this._inputState.deselectPiece();
    }
  }

  private handleGameEvent(event: GameEvent) {
    if (event.isGameEndEvent()) {
      this.onGameEnd(event.redWon);
    }
  }
}