export class MathUtil {
  public static smoothStep(x: number) {
    return 3 * x * x - 2 * x * x * x;
  }
}