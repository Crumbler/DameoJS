import { GameEvent, GameEventType } from 'domain/gameEvent';
import { Player } from 'domain/player';

/**
 * Occurs when the player is changed, also when the game is reset
 */
export class PlayerChangedEvent extends GameEvent {
  public constructor(public readonly player: Player) {
    super(GameEventType.PlayerChanged);
  }
}
