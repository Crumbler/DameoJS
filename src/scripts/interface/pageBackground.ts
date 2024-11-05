import { Vector2 } from 'math/Vector2';
import { InterfaceColors } from 'interface/interfaceColors';
import { BlobHelper } from 'helpers/blobHelper';

export class PageBackground {
  private static readonly RhombusWidth = 50;

  private static calculateBounds(): Vector2 {
    const baseWidth = PageBackground.RhombusWidth * 2;

    const height = Math.round(Math.tan(Math.PI / 3) * baseWidth);

    return new Vector2(baseWidth, height).mul(2);
  }

  private static drawRhombus(
    context: CanvasRenderingContext2D,
    size: Vector2,
    color: string,
  ) {
    context.beginPath();

    context.fillStyle = color;
    context.moveTo(size.width / 2, 0);
    context.lineTo(0, size.height / 2);
    context.lineTo(size.width / 2, size.height);
    context.lineTo(size.width, size.height / 2);

    context.closePath();
    context.fill();
  }

  private static drawPattern(context: CanvasRenderingContext2D) {
    const width = context.canvas.width;
    const height = context.canvas.height;

    context.fillStyle = InterfaceColors.BackgroundColor;
    context.fillRect(0, 0, width, height);

    const rhombusSize = new Vector2(width, height).div(2);

    PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorA,
    );

    context.save();
    context.translate(width / 2, 0);
    PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorB,
    );
    context.restore();

    context.save();
    context.translate(width / 2, height / 2);
    PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorA,
    );
    context.restore();

    context.save();
    context.translate(0, height / 2);
    PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorB,
    );
    context.restore();
  }

  public static async generateAndSet() {
    const bounds = PageBackground.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      PageBackground.drawPattern,
    );

    document.body.style.backgroundImage = `url(${imageUrl})`;
  }
}
