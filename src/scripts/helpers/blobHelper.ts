import { RVector2 } from 'math/Vector2';

export type RenderAction = (context: OffscreenCanvasRenderingContext2D) => void;

export class BlobHelper {
  private static generateBackgroundBlob(
    bounds: RVector2,
    drawAction: RenderAction,
    transparent: boolean,
  ): Promise<Blob> {
    const canvas = new OffscreenCanvas(bounds.width, bounds.height);

    const context = canvas.getContext('2d', {
      alpha: transparent,
    });

    if (context === null) {
      throw new Error('Failed to get 2d context');
    }

    drawAction(context);

    return canvas.convertToBlob();
  }

  /**
   * Draws to a context, converts to blob and returns the blob's url
   * @param size Canvas bounds
   * @param drawAction Function that draws to the context
   * @param transparent True if 2d context should support transparency
   * @returns URL to resource
   */
  public static async drawToBlobUrl(
    size: RVector2,
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
