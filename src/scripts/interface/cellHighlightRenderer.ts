import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';
import { GameEvent, GameEventSource } from 'domain/gameEvent';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { GameInfo } from 'domain/gameInfo';
import { InterfaceColors } from 'interface/interfaceColors';

export class CellHighlightRenderer {
  private readonly _cellCanvas =
    Elements.findById<HTMLCanvasElement>('cell-canvas');
  private readonly _cellContext = this._cellCanvas.getContext('2d')!;
  private readonly _game: GameInfo;

  public constructor(game: GameEventSource & GameInfo, inputState: InputState) {
    this._game = game;

    game.registerEventHandler((event) => this.onGameEvent(event));
    inputState.subscribeToPieceChanges(() => this.onPieceChanged());
  }

  private render() {
    const context = this._cellContext;
    const boardSize = InterfaceConstants.BoardSize;
    const cellSize = InterfaceConstants.CellSize;

    context.fillStyle = InterfaceColors.SelectableCellColor;

    context.clearRect(0, 0, boardSize, boardSize);

    for (const pieceMoves of this._game.moves) {
      const piece = pieceMoves.pieceInfo;

      context.fillRect(
        piece.x * cellSize,
        piece.y * cellSize,
        cellSize,
        cellSize,
      );
    }
  }

  private onGameEvent(event: GameEvent) {
    if (event.isPlayerChangedEvent()) {
      this.onPlayerChanged();
    }
  }

  private onPlayerChanged() {
    this.render();
  }

  private onPieceChanged() {
    this.render();
  }
}
