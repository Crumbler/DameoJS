import { Piece, PieceInfo } from '@/domain/piece';
import { Player } from '@/domain/player';
import { GameEvent, GameEventHandler, GameResetEvent, PiecesChangedEvent, PlayerChangedEvent } from '@/domain/gameEvent';
import { Move, PieceMoves } from '@/domain/move';
import { MoveCalculator } from '@/domain/moveCalculator';
import { Board, BoardInfo } from '@/domain/board';
import { Subject } from '@/misc/subject';

export interface GameInteractable {
  performMove(pieceToMove: PieceInfo, move: Move): void;
  reset(): void;
}

export interface GameInfo {
  readonly board: BoardInfo;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
  readonly moves: ReadonlyArray<PieceMoves>;
  findPieceMoves(piece: PieceInfo): ReadonlyArray<Move> | null;
  registerEventHandler(handler: GameEventHandler): void;
}

export class Game implements GameInfo, GameInteractable {
  /**
   * The game board, pieces are stored from top to bottom
   */
  private _board: Board;

  /**
   * An array with all of the pieces on the board
   */
  private _pieces: Array<Piece> = [];

  private _currentPlayer: Player;
  private _moveInfos: Array<PieceMoves> = [];
  private _eventSubject = new Subject<GameEvent>();

  private calculatePieceMoves(boardView: BoardInfo, piece: Piece) {
    const moves = MoveCalculator.calculateMoves(boardView, piece);
    if (moves !== null) {
      this._moveInfos.push(new PieceMoves(piece, moves));
    }
  }

  private calculateMoves() {
    this._moveInfos.length = 0;

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

  private swapPlayer() {
    this._currentPlayer = this._currentPlayer === Player.Red ? Player.White : Player.Red;
    this.onPlayerChanged();
  }

  public constructor() {
    this._currentPlayer = Player.White;

    this._board = new Board();
    this._board.fillBoard();

    this.resetPieces();

    this.calculateMoves();
  }

  public get board(): BoardInfo {
    return this._board;
  }

  public get pieces(): ReadonlyArray<PieceInfo> {
    return this._pieces;
  }

  public get moves(): ReadonlyArray<PieceMoves> {
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
    this.onPiecesChanged();
  }

  public findPieceMoves(piece: PieceInfo): ReadonlyArray<Move> | null {
    for (const moveInfo of this._moveInfos) {
      if (moveInfo.piece === piece) {
        return moveInfo.moves;
      }
    }

    return null;
  }

  public performMove(pieceToMove: PieceInfo, move: Move) {
    const pieceMoveInfo = this._moveInfos.find((mi) => mi.piece === pieceToMove);
    if (!pieceMoveInfo) {
      throw new Error('Unable to find moves for piece ' + pieceToMove);
    }

    const hasMove = pieceMoveInfo.moves.includes(move);
    if (!hasMove) {
      throw new Error(`The piece ${pieceToMove} does not have the move ${move}`);
    }

    this._board.movePiece(pieceToMove.x, pieceToMove.y, move.x, move.y);

    this.swapPlayer();

    this.onPiecesChanged();

    this.calculateMoves();
  }

  public reset() {
    this._currentPlayer = Player.White;

    this._board.reset();
    this.resetPieces();
    this.calculateMoves();

    this.onPlayerChanged();
    this.onGameReset();
    this.onPiecesChanged();
  }

  public registerEventHandler(handler: GameEventHandler) {
    this._eventSubject.subscribe(handler);
  }

  private raiseEvent(event: GameEvent) {
    this._eventSubject.raise(event);
  }

  private onPiecesChanged() {
    console.log('Raised pieces changed event');
    this.raiseEvent(new PiecesChangedEvent());
  }

  private onGameReset() {
    console.log('Raised game reset event');
    this.raiseEvent(new GameResetEvent());
  }

  private onPlayerChanged() {
    console.log('Raised player changed event');
    this.raiseEvent(new PlayerChangedEvent(this._currentPlayer));
  }
}
