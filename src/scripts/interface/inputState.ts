import { Move } from 'domain/move';
import { PieceInfo } from 'domain/piece';
import { EventHandler, Subject } from 'misc/subject';

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputHandler } from 'interface/inputHandler';
import type { CellHighlightRenderer } from 'interface/cellHighlightRenderer';
import type { PieceRenderer } from 'interface/pieceRenderer';
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface RSelectionState {
  selectedPiece: PieceInfo | null;
  moves: ReadonlyArray<Move> | null;
  selectedMoveIndex: number | null;
}

export class SelectionState implements RSelectionState {
  public constructor(
    public selectedPiece: PieceInfo | null,
    public moves: ReadonlyArray<Move> | null,
    public selectedMoveIndex: number | null,
  ) { }
}

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
  private _selection = new SelectionState(null, null, null);

  /**
   * Indicates whether any game input is being accepted right now
   */
  private _acceptingInput = true;

  private readonly _selectionChangedSubject = new Subject<RSelectionState>();
  private readonly _acceptingInputSubject = new Subject<boolean>();
  private readonly _performMoveSubject = new Subject<[PieceInfo, Move]>();

  public get selectedPiece(): PieceInfo | null {
    return this._selection.selectedPiece;
  }

  public get selection(): RSelectionState {
    return this._selection;
  }

  public setSelection(
    piece: PieceInfo | null,
    moves: ReadonlyArray<Move> | null,
    moveIndex: number | null,
  ) {
    this._selection.selectedPiece = piece;
    this._selection.moves = moves;
    this._selection.selectedMoveIndex = moveIndex;
    this.raisePieceChange();
  }

  public setSelectionindex(index: number) {
    this._selection.selectedMoveIndex = index;
    this.raisePieceChange();
  }

  public deselectPiece() {
    this.setSelection(null, null, null);
  }

  public get acceptingInput(): boolean {
    return this._acceptingInput;
  }

  public set acceptingInput(value: boolean) {
    this._acceptingInput = value;
    this.raiseAcceptingInput();
  }

  private raisePieceChange() {
    this._selectionChangedSubject.raise(this._selection);
  }

  private raiseAcceptingInput() {
    this._acceptingInputSubject.raise(this._acceptingInput);
  }

  public raisePerformMove(piece: PieceInfo, move: Move) {
    this._performMoveSubject.raise([piece, move]);
  }

  public subscribeToSelectionChanges(handler: EventHandler<RSelectionState>) {
    this._selectionChangedSubject.subscribe(handler);
  }

  public subscribeAcceptingInput(handler: EventHandler<boolean>) {
    this._acceptingInputSubject.subscribe(handler);
  }

  public subscribePerformMove(handler: EventHandler<[PieceInfo, Move]>) {
    this._performMoveSubject.subscribe(handler);
  }
}
