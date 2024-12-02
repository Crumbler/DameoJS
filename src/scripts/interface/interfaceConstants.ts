import { GameConstants } from 'domain/gameConstants';

export class InterfaceConstants {
  public static readonly HeaderIconSize = 70;
  public static readonly BoardSize = 600;
  public static readonly CellSize =
    InterfaceConstants.BoardSize / GameConstants.CellsPerSide;
  public static readonly PieceX = this.CellSize / 2;
  public static readonly PieceY = this.CellSize * 0.6;
  public static readonly PieceWidth = this.CellSize * 0.75;
  public static readonly PieceHeight = this.CellSize * 0.2;
  public static readonly PieceLineWidth = this.CellSize * 0.03;
}
