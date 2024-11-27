import { PlayerChangedEvent } from 'domain/events/playerChangedEvent';
import { GameResetEvent } from 'domain/events/gameResetEvent';
import { EventHandler } from 'misc/subject';

export enum GameEventType {
  PlayerChanged,
  GameReset,
}

export type GameEventHandler = EventHandler<GameEvent>;

export interface GameEventSource {
  registerEventHandler(handler: GameEventHandler): void;
}

export abstract class GameEvent {
  private _type: GameEventType;

  protected constructor(type: GameEventType) {
    this._type = type;
  }

  public isPlayerChangedEvent(): this is PlayerChangedEvent {
    return this._type === GameEventType.PlayerChanged;
  }

  public isGameResetEvent(): this is GameResetEvent {
    return this._type === GameEventType.GameReset;
  }
}
