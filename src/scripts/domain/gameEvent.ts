import { PlayerChangedEvent } from 'domain/events/playerChangedEvent';

export enum GameEventType {
  PlayerChanged,
}

export type GameEventHandler = (event: GameEvent) => void;

export abstract class GameEvent {
  private _type: GameEventType;

  protected constructor(type: GameEventType) {
    this._type = type;
  }

  public isPlayerChangedEvent(): this is PlayerChangedEvent {
    return this._type === GameEventType.PlayerChanged;
  }
}
