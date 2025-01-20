/**
 * Read-only Vector2
 * @see {@link Vector2}
 */
export interface RVector2 {
  readonly x: number;
  readonly y: number;

  distanceTo(v: RVector2): number;
}

export class Vector2 extends Array implements RVector2 {
  constructor(x: number = 0, y: number = 0) {
    super();
    this[0] = x;
    this[1] = y;
  }

  public static fromScalar(x: number): Vector2 {
    return new Vector2(x, x);
  }

  public static length(a: RVector2, b: RVector2): number {
    const dX = a.x - b.x;
    const dY = a.y - b.y;

    return Math.sqrt(dX * dX + dY * dY);
  }

  public distanceTo(v: RVector2): number {
    return Vector2.length(this, v);
  }

  public get x(): number {
    return this[0];
  }

  public set x(value: number) {
    this[0] = value;
  }

  public get y(): number {
    return this[1];
  }

  public set y(value: number) {
    this[1] = value;
  }

  public get width(): number {
    return this.x;
  }

  public set width(value: number) {
    this.x = value;
  }

  public get height(): number {
    return this.y;
  }

  public set height(value: number) {
    this.y = value;
  }

  public clone(): Vector2 {
    return this.slice() as Vector2;
  }

  public mul(x: number): Vector2 {
    this.x *= x;
    this.y *= x;

    return this;
  }

  public div(x: number): Vector2 {
    this.x /= x;
    this.y /= x;

    return this;
  }

  public static sub(a: RVector2, b: RVector2): Vector2 {
    return new Vector2(a.x - b.x, a.y - b.y);
  }
}
