export class MathUtil {
  public static smoothStep(x: number) {
    return 3 * x * x - 2 * x * x * x;
  }

  public static calculateLength(x1: number, y1: number, x2: number, y2: number): number {
    const dX = x2 - x1;
    const dY = y2 - y1;
    return Math.sqrt(dX * dX + dY * dY);
  }
}