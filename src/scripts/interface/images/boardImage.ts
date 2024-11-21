import { Vector2 } from 'math/Vector2';
import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { GameConstants } from 'domain/gameConstants';

export class BoardImage {
  private static readonly board = Elements.findById('game-board');

  private static calculateBounds(): Vector2 {
    const cellSize = InterfaceConstants.BoardSize / GameConstants.CellsPerSide;
    return Vector2.fromScalar(cellSize * 2);
  }

  private static drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = InterfaceColors.CellA;

    context.fillRect(0, 0, size, size);

    context.fillStyle = InterfaceColors.CellB;

    const cellSize = InterfaceConstants.BoardSize / GameConstants.CellsPerSide;

    context.fillRect(cellSize, 0, cellSize, cellSize);
    context.fillRect(0, cellSize, cellSize, cellSize);
  }

  public static async generateAndSet() {
    const bounds = BoardImage.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      BoardImage.drawPattern,
    );

    BoardImage.board.style.backgroundImage = `url(${imageUrl})`;
  }
}
