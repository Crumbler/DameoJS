export class Format {
  /**
   * Converts an integer to string, padding it with a zero on the left if it's below 10
   */
  public static addZeroForSingleDigit(x: number): string {
    if (x < 10) {
      return '0' + x;
    }

    return x.toString();
  }
}
