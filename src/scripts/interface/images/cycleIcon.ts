import { IconRenderer } from 'interface/images/iconRenderer';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { Vector2 } from 'math/Vector2';

export class CycleIcon extends IconRenderer {
  public constructor() {
    super('cycle-button');
  }

  protected calculateBounds(): Vector2 {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }

  private static drawArrowhead(
    context: OffscreenCanvasRenderingContext2D,
    size: number,
  ) {

    const sideWidth = size * 0.3;

    context.beginPath();
    context.moveTo(0, -sideWidth);
    context.lineTo(size * 0.4, 0);
    context.lineTo(0, sideWidth);
    context.fill();
  }

  protected drawPattern(context: OffscreenCanvasRenderingContext2D) {
    const size = context.canvas.width;

    context.fillStyle = 'white';

    context.fillRect(size * 0.1, size * 0.4, size * 0.5, size * 0.2);

    context.translate(
      size * 0.6,
      size / 2,
    );

    CycleIcon.drawArrowhead(context, size);
  }
}