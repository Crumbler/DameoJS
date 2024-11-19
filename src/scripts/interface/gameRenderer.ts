import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { GameInfo } from 'domain/gameInfo';
import { GameEventSource } from 'domain/gameEvent';

export class GameRenderer {
  private readonly _game: GameInfo;
  private readonly _pieceCanvas =
    Elements.findById<HTMLCanvasElement>('piece-canvas');
  private readonly _pieceContext = this._pieceCanvas.getContext('2d')!;
  private readonly _redPieceLowerGradient =
    GameRenderer.createPieceLowerGradient(this._pieceContext, false);
  private readonly _whitePieceLowerGradient =
    GameRenderer.createPieceLowerGradient(this._pieceContext, true);

  public constructor(game: GameInfo) {
    this._game = game;
  }

  private static createPieceLowerGradient(
    context: CanvasRenderingContext2D,
    white: boolean,
  ) {
    const cellSize = InterfaceConstants.CellSize;

    const gradient = context.createLinearGradient(
      cellSize * 0.1,
      cellSize * 0.6,
      cellSize * 0.9,
      cellSize * 0.6,
    );

    gradient.addColorStop(
      0,
      white ? InterfaceColors.PieceWhiteColorA : InterfaceColors.PieceRedColorA,
    );
    gradient.addColorStop(
      1,
      white ? InterfaceColors.PieceWhiteColorB : InterfaceColors.PieceRedColorB,
    );

    return gradient;
  }

  private renderPiece(context: CanvasRenderingContext2D, white: boolean) {
    const cellSize = InterfaceConstants.CellSize;
    const pieceX = InterfaceConstants.PieceX;
    const pieceY = InterfaceConstants.PieceY;
    const pieceWidth = InterfaceConstants.PieceWidth;
    const pieceHeight = InterfaceConstants.PieceHeight;

    const gradient = white
      ? this._whitePieceLowerGradient
      : this._redPieceLowerGradient;

    const rightColor = white
      ? InterfaceColors.PieceWhiteColorB
      : InterfaceColors.PieceRedColorB;

    context.fillStyle = gradient;
    context.strokeStyle = 'black';
    context.lineWidth = InterfaceConstants.PieceLineWidth;

    context.beginPath();

    // lower gradient part
    context.ellipse(
      pieceX,
      pieceY,
      pieceWidth / 2,
      cellSize * 0.2,
      0,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.beginPath();

    // fill middle gradient
    context.fillRect(
      pieceX - pieceWidth / 2,
      pieceY - pieceHeight,
      pieceWidth,
      pieceHeight,
    );

    context.fillStyle = rightColor;

    context.beginPath();

    // upper ellipse
    context.ellipse(
      pieceX,
      pieceY - pieceHeight,
      pieceWidth / 2,
      pieceHeight,
      0,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.beginPath();

    // lower ellipse border
    context.ellipse(pieceX, pieceY, pieceWidth / 2, pieceHeight, 0, 0, Math.PI);

    context.stroke();

    context.beginPath();

    context.ellipse(
      pieceX,
      pieceY - pieceHeight,
      pieceWidth / 2,
      pieceHeight,
      0,
      0,
      Math.PI * 2,
    );

    context.stroke();

    context.beginPath();

    context.moveTo(pieceX - pieceWidth / 2, pieceY - pieceHeight);
    context.lineTo(pieceX - pieceWidth / 2, pieceY);

    context.moveTo(pieceX + pieceWidth / 2, pieceY - pieceHeight);
    context.lineTo(pieceX + pieceWidth / 2, pieceY);

    context.stroke();
  }

  private renderPieces(context: CanvasRenderingContext2D) {
    const cellSize = InterfaceConstants.CellSize;

    for (const piece of this._game.pieces) {
      context.save();
      context.translate(piece.x * cellSize, piece.y * cellSize);
      this.renderPiece(context, piece.isWhite);
      context.restore();
    }
  }

  public render() {
    const context = this._pieceContext;

    context.clearRect(
      0,
      0,
      InterfaceConstants.BoardSize,
      InterfaceConstants.BoardSize,
    );

    this.renderPieces(context);
  }

  public registerEventHandler(game: GameEventSource) {
    game.registerEventHandler(() => this.render());
  }
}
