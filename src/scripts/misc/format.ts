export class Format {
  public static addZeroForSingleDigit(x: number): string {
    if (x < 10) {
      return '0' + x;
    }

    return x.toString();
  }
}
