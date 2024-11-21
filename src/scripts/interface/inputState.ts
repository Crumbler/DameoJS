import { PieceInfo } from 'domain/piece';

type PieceChangeHandler = (() => void) | ((piece: PieceInfo | null) => void);

export class InputState {
  private _selectedPiece: PieceInfo | null = null;
  private _pieceChangeHandlers: Array<PieceChangeHandler> = [];

  public get selectedPiece(): PieceInfo | null {
    return this._selectedPiece;
  }

  public set selectedPiece(piece: PieceInfo | null) {
    this._selectedPiece = piece;
    this.raisePieceChange();
  }

  private raisePieceChange() {
    for (const handler of this._pieceChangeHandlers) {
      handler(this._selectedPiece);
    }
  }

  public subscribeToPieceChanges(handler: PieceChangeHandler) {
    this._pieceChangeHandlers.push(handler);
    handler(this._selectedPiece);
  }
}
