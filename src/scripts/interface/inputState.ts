import { Move } from 'domain/move';
import { PieceInfo } from 'domain/piece';
import { EventHandler, Subject } from 'misc/subject';

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputHandler } from 'interface/inputHandler';
import type { CellHighlightRenderer } from 'interface/cellHighlightRenderer';
import type { PieceRenderer } from 'interface/pieceRenderer';
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Holds input state and delegates input events between InputHandler and the cell and piece renderers
 * @see {@link InputHandler}
 * @see {@link CellHighlightRenderer}
 * @see {@link PieceRenderer}
 */
export class InputState {
  /**
   * The currently selected piece
   */
  private _selectedPiece: PieceInfo | null = null;

  /**
   * Indicates whether any game input is being accepted right now
   */
  private _acceptingInput = true;

  private readonly _selectedPieceChangedSubject = new Subject<PieceInfo | null>();
  private readonly _acceptingInputSubject = new Subject<boolean>();
  private readonly _performMoveSubject = new Subject<[PieceInfo, Move]>();

  public get selectedPiece(): PieceInfo | null {
    return this._selectedPiece;
  }

  public set selectedPiece(piece: PieceInfo | null) {
    this._selectedPiece = piece;
    this.raisePieceChange();
  }

  public get acceptingInput(): boolean {
    return this._acceptingInput;
  }

  public set acceptingInput(value: boolean) {
    this._acceptingInput = value;
    this.raiseAcceptingInput();
  }

  private raisePieceChange() {
    this._selectedPieceChangedSubject.raise(this.selectedPiece);
  }

  private raiseAcceptingInput() {
    this._acceptingInputSubject.raise(this._acceptingInput);
  }

  public raisePerformMove(piece: PieceInfo, move: Move) {
    this._performMoveSubject.raise([piece, move]);
  }

  public subscribeToSelectedPieceChanges(handler: EventHandler<PieceInfo | null>) {
    this._selectedPieceChangedSubject.subscribe(handler);
  }

  public subscribeAcceptingInput(handler: EventHandler<boolean>) {
    this._acceptingInputSubject.subscribe(handler);
  }

  public subscribePerformMove(handler: EventHandler<[PieceInfo, Move]>) {
    this._performMoveSubject.subscribe(handler);
  }
}
