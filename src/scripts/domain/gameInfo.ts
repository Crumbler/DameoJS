import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';

export interface GameInfo {
  readonly board: ReadonlyArray<ReadonlyArray<PieceInfo | null>>;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
}
