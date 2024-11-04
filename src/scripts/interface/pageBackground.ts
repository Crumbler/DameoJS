import { Vector2 } from 'math/Vector2';

export class PageBackground {
  private static readonly RhombusWidth = 50;
  private static readonly BackgroundColor = '#362918';
  private static readonly RhombusColorA = '#ab9349';
  private static readonly RhombusColorB = '#ca9334';

  private static calculateBounds(): Vector2 {
    const baseWidth = this.RhombusWidth * 2;

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

    context.fillStyle = this.BackgroundColor;
    context.fillRect(0, 0, width, height);

    const rhombusSize = new Vector2(width, height).div(2);

    this.drawRhombus(context, rhombusSize, this.RhombusColorA);

    context.save();
    context.translate(width / 2, 0);
    this.drawRhombus(context, rhombusSize, this.RhombusColorB);
    context.restore();

    context.save();
    context.translate(width / 2, height / 2);
    this.drawRhombus(context, rhombusSize, this.RhombusColorA);
    context.restore();

    context.save();
    context.translate(0, height / 2);
    this.drawRhombus(context, rhombusSize, this.RhombusColorB);
    context.restore();
  }

  private static generateBackgroundBlob(): Promise<Blob> {
    const canvas = document.createElement('canvas');

    const bounds = this.calculateBounds();

    canvas.width = bounds.width;
    canvas.height = bounds.height;

    const context = canvas.getContext('2d', {
      alpha: false,
    });

    if (context === null) {
      throw new Error('Failed to get 2d context');
    }

    this.drawPattern(context);

    const promise = new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob: Blob | null) => {
        canvas.remove();

        if (blob === null) {
          reject('Failed to create blob');
          return;
        }

        resolve(blob);
      });
    });

    return promise;
  }

  private static async generateImageUrl(): Promise<string> {
    const imageBlob = await this.generateBackgroundBlob();

    return URL.createObjectURL(imageBlob);
  }

  public static async generateAndSet() {
    const imageUrl = await this.generateImageUrl();

    document.body.style.backgroundImage = `url(${imageUrl})`;
  }
}
