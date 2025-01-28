import { RVector2, Vector2 } from 'math/Vector2';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { IconRenderer } from 'interface/images/iconRenderer';

/**
 * Renders the toggle fullscreen icon
 */
export class FullscreenIcon extends IconRenderer {
  public constructor() {
    super('fullscreen-button');
  }

  protected calculateBounds(): RVector2 {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }

  private static drawCorner(
    context: OffscreenCanvasRenderingContext2D,
    size: number,
  ) {
    const width = 0.1;
    const length = 0.3;

    context.fillRect(0, 0, size * width, size * length);
    context.fillRect(0, 0, size * length, size * width);
  }

  protected drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = 'white';

    FullscreenIcon.drawCorner(context, size);

    context.save();
    context.translate(size, 0);
    context.rotate(Math.PI / 2);
    FullscreenIcon.drawCorner(context, size);
    context.restore();

    context.save();
    context.translate(size, size);
    context.rotate(Math.PI);
    FullscreenIcon.drawCorner(context, size);
    context.restore();

    context.save();
    context.translate(0, size);
    context.rotate(Math.PI * 1.5);
    FullscreenIcon.drawCorner(context, size);
    context.restore();
  }
}
