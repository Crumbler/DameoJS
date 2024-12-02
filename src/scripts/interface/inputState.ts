
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
  private _pieceChangeSubject = new Subject<PieceInfo | null>();

  public get selectedPiece(): PieceInfo | null {
    return this._selectedPiece;
  }

  public set selectedPiece(piece: PieceInfo | null) {
    this._selectedPiece = piece;
    this.raisePieceChange();
  }

  private raisePieceChange() {
    this._pieceChangeSubject.raise(this.selectedPiece);
  }

  public subscribeToPieceChanges(handler: EventHandler<PieceInfo | null>) {
    this._pieceChangeSubject.subscribe(handler);
  }
}
