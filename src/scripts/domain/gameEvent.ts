import { PlayerChangedEvent } from 'domain/events/playerChangedEvent';
import { GameResetEvent } from 'domain/events/gameResetEvent';

export enum GameEventType {
  PlayerChanged,
  GameReset,
}

export type GameEventHandler = (event: GameEvent) => void;

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
