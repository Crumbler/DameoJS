import { Vector2 } from 'math/Vector2';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';

export class RestartIcon {
  private static readonly restartIcon = Elements.findById('restart-button');

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

    const startAngle = Math.PI / 4;
    const endAngle = Math.PI * 1.8;

    const radius = size * 0.35;

    context.beginPath();
    context.arc(size / 2, size / 2, radius, startAngle, endAngle);
    context.stroke();

    context.translate(
      size / 2 + radius * Math.cos(endAngle),
      size / 2 + radius * Math.sin(endAngle),
    );
    context.rotate(endAngle + Math.PI / 2);
    RestartIcon.drawArrowhead(context, size);
  }

  public static async generateAndSet() {
    const bounds = RestartIcon.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      RestartIcon.drawPattern,
      true,
    );

    RestartIcon.restartIcon.style.backgroundImage = `url(${imageUrl})`;
    RestartIcon.restartIcon.style.maskImage = `url(${imageUrl})`;
  }
}
