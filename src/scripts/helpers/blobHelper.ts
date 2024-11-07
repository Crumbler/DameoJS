import { Vector2 } from 'math/Vector2';

export type RenderAction = (context: CanvasRenderingContext2D) => void;

export class BlobHelper {
  private static generateBackgroundBlob(
    bounds: Vector2,
    drawAction: RenderAction,
    transparent: boolean,
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');

    canvas.width = bounds.width;
    canvas.height = bounds.height;

    const context = canvas.getContext('2d', {
      alpha: transparent,
    });

    if (context === null) {
      throw new Error('Failed to get 2d context');
    }

    drawAction(context);

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

  public static async drawToBlobUrl(
    size: Vector2,
    drawAction: RenderAction,
    transparent = false,
  ): Promise<string> {
    const imageBlob = await this.generateBackgroundBlob(
      size,
      drawAction,
      transparent,
    );

    return URL.createObjectURL(imageBlob);
  }
}
