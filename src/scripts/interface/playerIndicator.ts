import { Game } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Player } from 'domain/player';
import { Elements } from 'interface/elements';

export class PlayerIndicator {
  private static readonly indicator = Elements.findById('player-indicator');

  private static getPlayerString(player: Player): string {
    switch (player) {
      case Player.Red:
        return 'Red Player';
      case Player.White:
        return 'White Player';
      default:
        throw new Error('Unknown player type ' + player);
    }
  }

  private static updateIndicator(player: Player) {
    this.indicator.textContent = PlayerIndicator.getPlayerString(player);
  }

  public static handleGameEvent(event: GameEvent) {
    if (!event.isPlayerChangedEvent()) {
      return;
    }

    PlayerIndicator.updateIndicator(event.player);
  }

  public static registerEventHandler(game: Game) {
    game.registernEventHandler(PlayerIndicator.handleGameEvent);
  }
}