import { Vector2 } from 'math/Vector2';
import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { GameConstants } from 'domain/gameConstants';

export class BoardLines {
  private static readonly lines =
    Elements.findById<HTMLImageElement>('board-lines');

  private static calculateBounds(): Vector2 {
    return Vector2.fromScalar(InterfaceConstants.BoardSize);
  }

  private static drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = 'black';

    const cellsPerSide = GameConstants.CellsPerSide;

    const cellSize = size / cellsPerSide;

    context.lineWidth = cellSize * InterfaceConstants.LineWidthToCellRatio;

    context.beginPath();

    for (let i = 1; i < cellsPerSide; ++i) {
      context.moveTo(0, i * cellSize);
      context.lineTo(size, i * cellSize);
    }

    for (let j = 1; j < cellsPerSide; ++j) {
      context.moveTo(j * cellSize, 0);
      context.lineTo(j * cellSize, size);
    }

    context.stroke();
  }

  public static async generateAndSet() {
    const bounds = BoardLines.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      BoardLines.drawPattern,
      true,
    );

    BoardLines.lines.src = imageUrl;
  }
}
