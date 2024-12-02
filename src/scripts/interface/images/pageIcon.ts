import { BlobHelper } from 'helpers/blobHelper';
import { Vector2 } from 'math/Vector2';
import { InterfaceColors } from 'interface/interfaceColors';

/**
 * Renders the page icon
 */
export class PageIcon {
  private static readonly RhombusSize = 16;

  private static calculateBounds(): Vector2 {
    return Vector2.fromScalar(PageIcon.RhombusSize * 2);
  }

  private static drawRhombus(
    context: OffscreenCanvasRenderingContext2D,
    size: number,
    color: string,
  ) {
    context.beginPath();

    context.fillStyle = color;
    context.moveTo(size / 2, 0);
    context.lineTo(0, size / 2);
    context.lineTo(size / 2, size);
    context.lineTo(size, size / 2);

    context.closePath();
    context.fill();
  }

  private static drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = InterfaceColors.Background;
    context.fillRect(0, 0, size, size);

    const rhombusSize = size / 2;

    PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusA);

    context.save();
    context.translate(rhombusSize, 0);
    PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusB);
    context.restore();

    context.save();
    context.translate(rhombusSize, rhombusSize);
    PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusA);
    context.restore();

    context.save();
    context.translate(0, rhombusSize);
    PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusB);
    context.restore();
  }

  public static async generateAndSet() {
    const bounds = PageIcon.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      PageIcon.drawPattern,
    );

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = imageUrl;

    document.head.appendChild(link);
  }
}
