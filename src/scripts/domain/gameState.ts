import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';

export interface GameState {
  readonly pieces: Array<PieceInfo>;
  readonly canUndo: boolean;
  readonly currentPlayer: Player;
}