import { Piece, PieceInfo } from 'domain/piece';
import { Player } from 'domain/player';
import {
  CanUndoChangedEvent,
  GameEvent,
  GameEventHandler,
  GameResetEvent,
  PiecesChangedEvent,
  PlayerChangedEvent,
} from 'domain/gameEvent';
import { Move, PieceMovesInfo } from 'domain/move';
import { MoveCalculator } from 'domain/moveCalculator';
import { Board, BoardInfo } from 'domain/board';
import { Subject } from 'misc/subject';
import { GameState } from 'domain/gameState';
import { MoveRecord } from 'domain/moveRecord';

export interface GameInteractable {
  performMove(pieceToMove: PieceInfo, move: Move): void;
  undoMove(): void;
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

  private _moveRecords: MoveRecord[] = [];

  private _currentPlayer: Player;
  private _moveInfos: Array<PieceMovesInfo> = [];
  private _eventSubject = new Subject<GameEvent>();

  private calculatePieceMoves(
    boardView: BoardInfo,
    piece: Piece,
    anyAttackMoves: boolean,
  ) {
    let moves: Move[] | null = null;
    if (anyAttackMoves) {
      moves = MoveCalculator.calculateAttackMoves(boardView, piece);
    } else {
      moves = MoveCalculator.calculateMoves(boardView, piece);
    }

    if (moves !== null) {
      this._moveInfos.push(new PieceMovesInfo(piece, moves));
    }
  }

  private calculateMoves() {
    this._moveInfos.length = 0;

    const isWhite = this._currentPlayer === Player.White;

    let anyAttackMoves = false;
    for (const piece of this._pieces) {
      if (piece.isWhite !== isWhite) {
        continue;
      }

      if (MoveCalculator.hasAttackMoves(this._board, piece)) {
        anyAttackMoves = true;
        break;
      }
    }

    for (const piece of this._pieces) {
      if (piece.isWhite !== isWhite) {
        continue;
      }

      if (anyAttackMoves && !MoveCalculator.hasAttackMoves(this._board, piece)) {
        continue;
      }

      this.calculatePieceMoves(this._board, piece, anyAttackMoves);
    }

    if (anyAttackMoves) {
      this.filterAttackMoves();
    }
  }

  /**
   * Filter attack moves so that only the
   * attack moves that take the most pieces
   * are left
   */
  private filterAttackMoves() {
    // Calculate max pieces taken
    let maxPiecesTaken = 1;
    for (const moveInfo of this._moveInfos) {
      for (const move of moveInfo.moves) {
        maxPiecesTaken = Math.max(maxPiecesTaken, move.toRemove!.length);
      }
    }

    // Remove moves without enough pieces taken
    for (const moveInfo of this._moveInfos) {
      moveInfo.moves = moveInfo.moves.filter(
        (m) => m.toRemove!.length === maxPiecesTaken,
      );
    }

    // Remove move infos without moves
    this._moveInfos = this._moveInfos.filter((mi) => mi.moves.length !== 0);
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

  private resetMoveRecords() {
    this._moveRecords.length = 0;
  }

  private fillPiecesFromJson(pieces: ReadonlyArray<PieceInfo>) {
    this._pieces = pieces.map((p) => Piece.fromJson(p));
  }

  private swapPlayer() {
    this._currentPlayer =
      this._currentPlayer === Player.Red ? Player.White : Player.Red;
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
      this._moveRecords = state.moveRecords.map((mr) =>
        MoveRecord.fromJson(mr),
      );
      this.fillPiecesFromJson(state.pieces);
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
    return this._moveRecords.length !== 0;
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

  public undoMove() {
    const moveRecord = this._moveRecords.pop();

    if (moveRecord === undefined) {
      throw new Error('No moves to undo');
    }

    const piece = this._board.data[moveRecord.to.y][moveRecord.to.x];

    if (piece === null) {
      throw new Error('Piece to move not found when trying to undo move');
    }

    this._board.movePiece(moveRecord.to, moveRecord.from);

    if (moveRecord.removed !== null) {
      this._board.fillBoard(moveRecord.removed as ReadonlyArray<Piece>);
      for (const pieceInfo of moveRecord.removed) {
        this._pieces.push(pieceInfo as Piece);
      }
    }

    if (moveRecord.promotion) {
      piece.demote();
    }

    this.swapPlayer();

    this.calculateMoves();

    this.onPiecesChanged();

    // When move records is empty
    if (this._moveRecords.length === 0) {
      this.onCanUndoChanged();
    }
  }

  public performMove(pieceToMoveInfo: PieceInfo, move: Move) {
    const pieceMoveInfo = this._moveInfos.find(
      (mi) => mi.piece === pieceToMoveInfo,
    );

    if (!pieceMoveInfo) {
      throw new Error('Unable to find moves for piece ' + pieceToMoveInfo);
    }

    const pieceToMove = pieceMoveInfo.piece;

    const hasMove = pieceMoveInfo.moves.includes(move);
    if (!hasMove) {
      throw new Error(
        `The piece ${pieceToMove} does not have the move ${move}`,
      );
    }

    this._board.movePiece(pieceToMove.pos, move.lastPoint, move.isAttackMove);

    const isPromoting = pieceToMove.shouldBePromoted;

    if (isPromoting) {
      pieceToMove.promote();
    }

    const moveRecord = new MoveRecord(
      move.firstPoint,
      move.lastPoint,
      move.toRemove,
      isPromoting,
    );

    this._moveRecords.push(moveRecord);

    if (move.toRemove !== null) {
      const piecesToRemove = move.toRemove;
      for (const piece of piecesToRemove) {
        this._board.removePiece(piece.pos);
      }

      this._pieces = this._pieces.filter((p) => !piecesToRemove.includes(p));
    }

    this.swapPlayer();

    this.calculateMoves();

    this.onPiecesChanged();

    // When move records got first record
    if (this._moveRecords.length === 1) {
      this.onCanUndoChanged();
    }
  }

  public reset() {
    this._currentPlayer = Player.White;

    this._board.reset();
    this.resetMoveRecords();
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
      pieces: this._pieces.map((p) => p.toJson() as PieceInfo),
      moveRecords: this._moveRecords.map((mr) => mr.toJson() as MoveRecord),
      currentPlayer: this._currentPlayer,
    };
  }

  private raiseEvent(event: GameEvent) {
    this._eventSubject.raise(event);
  }

  private onPiecesChanged() {
    this.raiseEvent(new PiecesChangedEvent());
  }

  private onGameReset() {
    this.raiseEvent(new GameResetEvent());
  }

  private onPlayerChanged() {
    this.raiseEvent(new PlayerChangedEvent(this._currentPlayer));
  }

  private onCanUndoChanged() {
    this.raiseEvent(new CanUndoChangedEvent(this.canUndo));
  }
}
