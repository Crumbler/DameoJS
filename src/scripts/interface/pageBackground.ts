
export class PageBackground {
  private static drawBackgroundPattern(context: CanvasRenderingContext2D) {
    const cX = context.canvas.width / 2,
      cY = context.canvas.height / 2;

    context.beginPath();
    context.arc(cX, cY, 70, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.stroke();
  }

  private static generateBackgroundBlob(): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;

    const context = canvas.getContext('2d');

    if (context === null) {
      throw new Error('Failed to get 2d context');
    }

    this.drawBackgroundPattern(context);

    const promise = new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob === null) {
          reject('Failed to create blob');
          return;
        }

        resolve(blob);
      });
    });

    canvas.remove();

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