import { PieceInfo } from 'domain/piece';
import { EventHandler, Subject } from 'misc/subject';

export class InputState {
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
