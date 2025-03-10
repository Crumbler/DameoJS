import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Player } from 'domain/player';
import { Elements } from 'interface/elements';
import { ElementIds } from 'interface/elementIds';

/**
 * Handles setting the indicator for the current player
 */
export class PlayerIndicator {
  private static readonly indicator = Elements.findById(
    ElementIds.playerIndicator,
  );

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

  private static handleGameEvent(event: GameEvent) {
    if (!event.isPlayerChangedEvent()) {
      return;
    }

    PlayerIndicator.updateIndicator(event.player);
  }

  public static registerEventHandler(game: GameInfo) {
    game.registerEventHandler(PlayerIndicator.handleGameEvent);
  }
}
