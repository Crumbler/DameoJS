import { GameEvent, GameEventType } from 'domain/gameEvent';

/**
 * Occurs when the game is reset or restarted
 */
export class GameResetEvent extends GameEvent {
  public constructor() {
    super(GameEventType.GameReset);
  }
}
