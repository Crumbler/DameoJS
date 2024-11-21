import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { MovesArray, PieceMoveInfo } from 'domain/move';

export interface GameInfo {
  readonly board: ReadonlyArray<ReadonlyArray<PieceInfo | null>>;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
  readonly moves: ReadonlyArray<PieceMoveInfo>;
  findPieceMoves(piece: PieceInfo): MovesArray | null;
}
