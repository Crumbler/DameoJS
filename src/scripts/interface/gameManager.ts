import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Player } from 'domain/player';

export class GameManager {
  private static handleGameEvent(event: GameEvent) {
    if (!event.isPlayerChangedEvent()) {
      return;
    }

    GameManager.onPlayerChanged(event.player === Player.Red);
  }

  private static onPlayerChanged(isRed: boolean) {
    if (isRed) {
      document.body.classList.remove('white-player');
      document.body.classList.add('red-player');
    } else {
      document.body.classList.add('white-player');
      document.body.classList.remove('red-player');
    }
  }

  public static registerEventHandler(game: GameInfo) {
    game.registerEventHandler(GameManager.handleGameEvent);
  }
}