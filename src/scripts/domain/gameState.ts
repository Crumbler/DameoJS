import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { MoveRecord } from './moveRecord';

export interface GameState {
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly moveRecords: ReadonlyArray<MoveRecord>;
  readonly currentPlayer: Player;
}
