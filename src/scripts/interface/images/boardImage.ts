import { Vector2 } from 'math/Vector2';
import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { GameConstants } from 'domain/gameConstants';

export class BoardImage {
  private static readonly board =
    Elements.findById<HTMLImageElement>('game-board');

  private static calculateBounds(): Vector2 {
    return Vector2.fromScalar(InterfaceConstants.BoardSize);
  }

  private static drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = InterfaceColors.CellColorA;

    context.fillRect(0, 0, size, size);

    context.fillStyle = InterfaceColors.CellColorB;

    const cellsPerSide = GameConstants.CellsPerSide;

    const cellSize = size / cellsPerSide;

    for (let i = 0; i < cellsPerSide; ++i) {
      for (let j = 0; j < cellsPerSide; ++j) {
        const ind = i + j;
        const div = ind / 2;
        if (div === Math.floor(div)) {
          continue;
        }

        context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }

  public static async generateAndSet() {
    const bounds = BoardImage.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      BoardImage.drawPattern,
    );

    BoardImage.board.src = imageUrl;
  }
}
