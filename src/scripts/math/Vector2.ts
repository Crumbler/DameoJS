export class Vector2 extends Array {
  constructor(x: number = 0, y: number = 0) {
    super();
    this[0] = x;
    this[1] = y;
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
}
