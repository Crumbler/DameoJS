import { Piece, PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import { CanUndoChangedEvent, GameEvent, GameEventHandler, GameResetEvent, PiecesChangedEvent, PlayerChangedEvent } from 'domain/gameEvent';
import { Move, PieceMovesInfo } from 'domain/move';
import { MoveCalculator } from 'domain/moveCalculator';
import { Board, BoardInfo } from 'domain/board';
import { Subject } from 'misc/subject';
import { Vector2 } from 'math/Vector2';
import { GameState } from 'domain/gameState';

export interface GameInteractable {
  performMove(pieceToMove: PieceInfo, move: Move): void;
  reset(): void;
}

export interface GameInfo {
  readonly board: BoardInfo;
  readonly pieces: ReadonlyArray<PieceInfo>;
  readonly currentPlayer: Player;
  readonly moves: ReadonlyArray<PieceMovesInfo>;
  readonly canUndo: boolean;
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

  private _canUndo = false;

  private _currentPlayer: Player;
  private _moveInfos: Array<PieceMovesInfo> = [];
  private _eventSubject = new Subject<GameEvent>();

  private calculatePieceMoves(boardView: BoardInfo, piece: Piece) {
    const moves = MoveCalculator.calculateMoves(boardView, piece);
    if (moves !== null) {
      this._moveInfos.push(new PieceMovesInfo(piece, moves));
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

  private fillPieces(pieces: ReadonlyArray<PieceInfo>) {
    this._pieces = pieces.map(p => Piece.fromJson(p));
  }

  private swapPlayer() {
    this._currentPlayer = this._currentPlayer === Player.Red ? Player.White : Player.Red;
    this.onPlayerChanged();
  }

  public constructor(state: GameState | null = null) {
    this._board = new Board();

    if (state === null) {
      this._currentPlayer = Player.White;
      this._board.fillStandardBoard();
      this.resetPieces();
    } else {
      this._currentPlayer = state.currentPlayer;
      this._canUndo = state.canUndo;
      this.fillPieces(state.pieces);
      this._board.fillBoard(this._pieces);
    }

    this.calculateMoves();
  }

  public get board(): BoardInfo {
    return this._board;
  }

  public get pieces(): ReadonlyArray<PieceInfo> {
    return this._pieces;
  }

  public get moves(): ReadonlyArray<PieceMovesInfo> {
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
    this.onCanUndoChanged();
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

    this._board.movePiece(new Vector2(pieceToMove.x, pieceToMove.y), move.lastPoint);

    if (move.toRemove !== null) {
      for (const piece of move.toRemove) {
        this._board.removePiece(new Vector2(piece.x, piece.y));
      }

      this._pieces = this._pieces.filter(p => !move.toRemove!.includes(p));
    }

    this.swapPlayer();

    this.onPiecesChanged();

    this.calculateMoves();

    this._canUndo = true;
    this.onCanUndoChanged();
  }

  public reset() {
    this._currentPlayer = Player.White;
    this._canUndo = false;

    this._board.reset();
    this.resetPieces();
    this.calculateMoves();

    this.onPlayerChanged();
    this.onGameReset();
    this.onPiecesChanged();
    this.onCanUndoChanged();
  }

  public registerEventHandler(handler: GameEventHandler) {
    this._eventSubject.subscribe(handler);
  }

  public get state(): GameState {
    return {
      pieces: this._pieces.map(p => p.toJson()),
      canUndo: this._canUndo,
      currentPlayer: this._currentPlayer
    };
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

  private onCanUndoChanged() {
    this.raiseEvent(new CanUndoChangedEvent(this._canUndo));
  }
}
