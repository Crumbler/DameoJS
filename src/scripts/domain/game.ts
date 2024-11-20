import { Piece, PieceInfo } from 'domain/piece';
import { GameConstants } from 'domain/gameConstants';
import { Player } from 'domain/player';
import { GameEvent, GameEventHandler, GameEventSource } from 'domain/gameEvent';
import { PlayerChangedEvent } from 'domain/events/playerChangedEvent';
import { GameResetEvent } from 'domain/events/gameResetEvent';
import { GameInfo } from 'domain/gameInfo';
import { Move, PieceMoveInfo } from 'domain/move';

export class Game implements GameInfo, GameEventSource {
  // stored from top to bottom
  private _board: Array<Array<Piece | null>> = [];
  private _pieces: Array<Piece> = [];
  private _player: Player;
  private _moveInfos: Array<PieceMoveInfo> = [];
  private _eventHandlers: Array<GameEventHandler> = [];

  private static fillRow(
    row: Array<Piece | null>,
    pieces: Array<Piece>,
    rowNumber: number,
    pieceCount: number,
    white: boolean,
  ) {
    const cellsPerSide = GameConstants.CellsPerSide;

    for (
      let j = (cellsPerSide - pieceCount) / 2;
      j < cellsPerSide / 2 + pieceCount / 2;
      ++j
    ) {
      const piece = new Piece(white, j, rowNumber);
      row[j] = piece;
      pieces.push(piece);
    }
  }

  private fillBoard() {
    const board = this._board;
    const pieces = this._pieces;

    for (let i = 0; i < 3; ++i) {
      Game.fillRow(
        board[i],
        pieces,
        i,
        GameConstants.CellsPerSide - i * 2,
        false,
      );
    }

    for (let i = 0; i < 3; ++i) {
      Game.fillRow(
        board[board.length - i - 1],
        pieces,
        board.length - i - 1,
        GameConstants.CellsPerSide - i * 2,
        true,
      );
    }
  }

  private initializeBoard() {
    this._board = [];

    this._board = new Array(GameConstants.CellsPerSide);
    for (let i = 0; i < GameConstants.CellsPerSide; ++i) {
      this._board[i] = new Array(GameConstants.CellsPerSide);
    }
  }

  private resetBoard() {
    this._pieces.length = 0;

    for (let i = 0; i < this._board.length; ++i) {
      const row = this._board[i];
      for (let j = 0; j < row.length; ++j) {
        row[j] = null;
      }
    }
  }

  private calculatePieceMoves(piece: Piece) {
    const moves = [new Move(piece.x, piece.y)];
    this._moveInfos.push(new PieceMoveInfo(piece, moves));
  }

  private calculateMoves() {
    const whitePlayer = this._player === Player.White;

    for (const piece of this._pieces) {
      if (piece.isWhite !== whitePlayer) {
        continue;
      }

      this.calculatePieceMoves(piece);
    }
  }

  public constructor() {
    this._player = Player.White;

    this.initializeBoard();
    this.resetBoard();
    this.fillBoard();

    this.calculateMoves();
  }

  public get board(): ReadonlyArray<ReadonlyArray<PieceInfo | null>> {
    return this._board;
  }

  public get pieces(): ReadonlyArray<PieceInfo> {
    return this._pieces;
  }

  public get moves(): ReadonlyArray<PieceMoveInfo> {
    return this._moveInfos;
  }

  public get currentPlayer(): Player {
    return this._player;
  }

  public get canUndo(): boolean {
    return false;
  }

  public fireInitialEvents() {
    this.onPlayerChanged();
    this.onGameReset();
  }

  public registerEventHandler(handler: GameEventHandler) {
    this._eventHandlers.push(handler);
  }

  private raiseEvent(event: GameEvent) {
    for (const handler of this._eventHandlers) {
      handler(event);
    }
  }

  private onGameReset() {
    this.raiseEvent(new GameResetEvent());
  }

  public onPlayerChanged() {
    this.raiseEvent(new PlayerChangedEvent(this._player));
  }
}
