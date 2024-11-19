import { GameEvent, GameEventType } from 'domain/gameEvent';
import { Player } from 'domain/player';

export class PlayerChangedEvent extends GameEvent {
  public constructor(public readonly player: Player) {
    super(GameEventType.PlayerChanged);
  }
}
