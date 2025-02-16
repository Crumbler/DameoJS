import { RVector2, Vector2 } from 'math/Vector2';
import { Piece, PieceInfo } from 'domain/piece';

export class MoveRecord {
  public constructor(
    public readonly from: RVector2,
    public readonly to: RVector2,
    public readonly removed: ReadonlyArray<PieceInfo> | null,
    public readonly promotion: boolean,
  ) {}

  public toJson(): object {
    return {
      from: this.from.toJson(),
      to: this.to.toJson(),
      removed: this.removed?.map((pi) => pi.toJson()) ?? undefined,
      promotion: this.promotion,
    };
  }

  public static fromJson(mr: MoveRecord): MoveRecord {
    return new MoveRecord(
      Vector2.fromJson(mr.from),
      Vector2.fromJson(mr.to),
      mr.removed?.map((m) => Piece.fromJson(m)) ?? null,
      mr.promotion,
    );
  }
}
