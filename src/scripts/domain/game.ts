import { Piece, PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { GameEvent, GameEventHandler, GameEventSource } from 'domain/gameEvent';
import { PlayerChangedEvent } from 'domain/events/playerChangedEvent';
import { GameResetEvent } from 'domain/events/gameResetEvent';
import { GameInfo } from 'domain/gameInfo';
import { MovesArray, PieceMoveInfo } from 'domain/move';
import { MoveCalculator } from 'domain/moveCalculator';
import { Board, BoardInfo } from 'domain/board';
import { Subject } from 'misc/subject';

export class Game implements GameInfo, GameEventSource {
  /**
   * The game board, pieces are stored from top to bottom
   */
  private _board: Board;

  /**
   * An array with all of the pieces on the board
   */
  private _pieces: Array<Piece> = [];

  private _currentPlayer: Player;
  private _moveInfos: Array<PieceMoveInfo> = [];
  private _eventSubject = new Subject<GameEvent>();

  private calculatePieceMoves(boardView: BoardInfo, piece: Piece) {
    const moves = MoveCalculator.calculateMoves(boardView, piece);
    if (moves !== null) {
      this._moveInfos.push(new PieceMoveInfo(piece, moves));
    }
  }

  private calculateMoves() {
    const isWhite = this._currentPlayer === Player.White;

    for (const piece of this._pieces) {
      if (piece.isWhite !== isWhite) {
        continue;
      }

      this.calculatePieceMoves(this._board, piece);
    }
  }

  /**
   * Resets the pieces array and fills it from the board
   */
  private resetPieces() {
    this._pieces.length = 0;

    const data = this._board.data;

    for (const row of data) {
      for (const piece of row) {
        if (piece !== null) {
          this._pieces.push(piece);
        }
      }
    }
  }

  public constructor() {
    this._currentPlayer = Player.White;

    this._board = new Board();

    this.resetPieces();

    this.calculateMoves();
  }

  public get board(): BoardInfo {
    return this._board;
  }

  public get pieces(): ReadonlyArray<PieceInfo> {
    return this._pieces;
  }

  public get moves(): ReadonlyArray<PieceMoveInfo> {
    return this._moveInfos;
  }

  public get currentPlayer(): Player {
    return this._currentPlayer;
  }

  public get canUndo(): boolean {
    return false;
  }

  public fireInitialEvents() {
    this.onPlayerChanged();
    this.onGameReset();
  }

  public findPieceMoves(piece: PieceInfo): MovesArray | null {
    for (const moveInfo of this._moveInfos) {
      if (moveInfo.pieceInfo === piece) {
        return moveInfo.moves;
      }
    }

    return null;
  }

  public registerEventHandler(handler: GameEventHandler) {
    this._eventSubject.subscribe(handler);
  }

  private raiseEvent(event: GameEvent) {
    this._eventSubject.raise(event);
  }

  private onGameReset() {
    this.raiseEvent(new GameResetEvent());
  }

  public onPlayerChanged() {
    this.raiseEvent(new PlayerChangedEvent(this._currentPlayer));
  }
}
