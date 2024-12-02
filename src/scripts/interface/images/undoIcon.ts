import { Vector2 } from 'math/Vector2';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';

/**
 * Renders the undo icon
 */
export class UndoIcon {
  private static readonly undoIcon =
    Elements.findById<HTMLImageElement>('undo-button');

  private static calculateBounds(): Vector2 {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }

  private static drawArrowhead(
    context: OffscreenCanvasRenderingContext2D,
    size: number,
  ) {
    const height = size * 0.3;
    const side = (2 * height) / Math.sqrt(3);

    context.beginPath();
    context.moveTo(0, -side / 2);
    context.lineTo(height, 0);
    context.lineTo(0, side / 2);
    context.fill();
  }

  private static drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineWidth = 7;
    context.lineCap = 'round';

    const startAngle = 0;
    const endAngle = Math.PI * 1.2;

    const radius = size * 0.35;

    const centerY = size * 0.65;

    context.beginPath();
    context.arc(size / 2, centerY, radius, startAngle, endAngle, true);
    context.stroke();

    context.translate(
      size / 2 + radius * Math.cos(endAngle),
      centerY + radius * Math.sin(endAngle),
    );
    context.rotate(endAngle - Math.PI / 2);
    UndoIcon.drawArrowhead(context, size);
  }

  public static async generateAndSet() {
    const bounds = UndoIcon.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      UndoIcon.drawPattern,
    );

    UndoIcon.undoIcon.style.maskImage = `url(${imageUrl})`;
  }
}
