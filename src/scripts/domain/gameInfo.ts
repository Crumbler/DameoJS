import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { MovesArray, PieceMoveInfo } from 'domain/move';
import { BoardInfo } from 'domain/board';

export interface GameInfo {
  readonly board: BoardInfo;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
  readonly moves: ReadonlyArray<PieceMoveInfo>;
  findPieceMoves(piece: PieceInfo): MovesArray | null;
}
