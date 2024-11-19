import { GameEvent, GameEventType } from 'domain/gameEvent';

export class GameResetEvent extends GameEvent {
  public constructor() {
    super(GameEventType.GameReset);
  }
}
