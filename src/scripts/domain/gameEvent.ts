import { EventHandler } from '@/misc/subject';
import { Player } from '@/domain/player';

export enum GameEventType {
  PlayerChanged,
  GameReset,
  PiecesChanged
}

export type GameEventHandler = EventHandler<GameEvent>;

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

  public isPiecesChangedEvent(): this is PiecesChangedEvent {
    return this._type === GameEventType.PiecesChanged;
  }
}

/**
 * Occurs when the game is reset or restarted
 */
export class GameResetEvent extends GameEvent {
  public constructor() {
    super(GameEventType.GameReset);
  }
}

/**
 * Occurs when the player is changed, also when the game is reset
 */
export class PlayerChangedEvent extends GameEvent {
  public constructor(public readonly player: Player) {
    super(GameEventType.PlayerChanged);
  }
}

export class PiecesChangedEvent extends GameEvent {
  public constructor() {
    super(GameEventType.PiecesChanged);
  }
}