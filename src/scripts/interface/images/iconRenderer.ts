import { BlobHelper } from 'helpers/blobHelper';
import { Elements } from 'interface/elements';
import { RVector2 } from 'math/Vector2';

export abstract class IconRenderer {
  private readonly iconElement: HTMLElement;

  protected constructor(iconId: string) {
    this.iconElement = Elements.findById(iconId);
  }

  protected abstract calculateBounds(): RVector2;

  protected abstract drawPattern(context: OffscreenCanvasRenderingContext2D): void;

  public async generateAndSet() {
    const bounds = this.calculateBounds();

    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      this.drawPattern,
    );

    this.iconElement.style.maskImage = `url(${imageUrl})`;
  }
}