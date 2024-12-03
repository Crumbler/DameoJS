import { PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { Move, PieceMoves } from 'domain/move';
import { BoardInfo } from 'domain/board';

export interface GameInfo {
  readonly board: BoardInfo;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
  readonly moves: ReadonlyArray<PieceMoves>;
  findPieceMoves(piece: PieceInfo): ReadonlyArray<Move> | null;
}
