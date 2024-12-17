import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { PieceInfo } from 'domain/piece';
import { GameInfo } from 'domain/game';
import { Move } from 'domain/move';
import { GameEvent } from 'domain/gameEvent';
import { InputState } from 'interface/inputState';
import { MoveCalculator } from 'domain/moveCalculator';
import { MathUtil } from 'math/mathUtil';

/**
 * Renders and animates the board pieces using canvas
 */
export class PieceRenderer {
  private readonly _game: GameInfo;
  private readonly _inputState: InputState;
  private readonly _pieceContext = Elements.findById<HTMLCanvasElement>('piece-canvas').getContext('2d')!;
  private _animationStart: number | null = null;
  private _animationEnd: number | null = null;
  private _animatedPiece: PieceInfo | null = null;
  private _animetedMove: Move | null = null;

  /**
   * Gradient for the lower piece part
   */
  private readonly _redPieceLowerGradient =
    PieceRenderer.createPieceLowerGradient(this._pieceContext, false);

  /**
   * Gradient for the upper piece part
   */
  private readonly _whitePieceLowerGradient =
    PieceRenderer.createPieceLowerGradient(this._pieceContext, true);

  public constructor(game: GameInfo, inputState: InputState) {
    this._game = game;
    this._inputState = inputState;

    this.subscribeToEvents();
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
      white ? InterfaceColors.WhitePieceA : InterfaceColors.RedPieceA,
    );
    gradient.addColorStop(
      1,
      white ? InterfaceColors.WhitePieceB : InterfaceColors.RedPieceB,
    );

    return gradient;
  }

  private renderPiece(white: boolean) {
    const cellSize = InterfaceConstants.CellSize;
    const pieceX = InterfaceConstants.PieceX;
    const pieceY = InterfaceConstants.PieceY;
    const pieceWidth = InterfaceConstants.PieceWidth;
    const pieceHeight = InterfaceConstants.PieceHeight;

    const gradient = white
      ? this._whitePieceLowerGradient
      : this._redPieceLowerGradient;

    const rightColor = white
      ? InterfaceColors.WhitePieceB
      : InterfaceColors.RedPieceB;

    const context = this._pieceContext;

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

  private endAnimation() {
    this._animationStart = null;
    this._animationEnd = null;
    this._animatedPiece = null;
    this._animetedMove = null;

    this._inputState.acceptingInput = true;
  }

  private onAnimation = () => {
    if (this._animationStart === null ||
      this._animationEnd === null ||
      this._animatedPiece === null ||
      this._animetedMove === null) {
      throw new Error('Animation info is not supposed to be null');
    }

    const now = performance.now();

    const delta = (now - this._animationStart) / (this._animationEnd - this._animationStart);

    const progress = Math.min(1, MathUtil.smoothStep(delta));

    this.render(progress);

    if (now > this._animationEnd) {
      this.endAnimation();
      return;
    }

    window.requestAnimationFrame(this.onAnimation);
  }

  private renderAnimatedPiece(progress: number) {
    const cellSize = InterfaceConstants.CellSize;
    const context = this._pieceContext;

    // By the point this function is called
    // these parameters have already been validated
    const piece = this._animatedPiece as PieceInfo;
    const move = this._animetedMove as Move;

    const dX = move.x - piece.x;
    const dY = move.y - piece.y;

    const x = piece.x + dX * progress;
    const y = piece.y + dY * progress;

    context.save();

    context.translate(x * cellSize, y * cellSize);

    this.renderPiece(piece.isWhite);

    context.restore();
  }

  private renderNormalPieces() {
    const cellSize = InterfaceConstants.CellSize;
    const context = this._pieceContext;

    for (const piece of this._game.pieces) {
      if (piece === this._animatedPiece) {
        continue;
      }

      context.save();

      context.translate(piece.x * cellSize, piece.y * cellSize);

      this.renderPiece(piece.isWhite);

      context.restore();
    }
  }

  public render(progress: number = 0) {
    const context = this._pieceContext;

    context.clearRect(
      0, 0,
      InterfaceConstants.BoardSize,
      InterfaceConstants.BoardSize,
    );

    this.renderNormalPieces();

    if (this._animatedPiece !== null) {
      this.renderAnimatedPiece(progress);
    }
  }

  private handlePerformMove(moveInfo: [PieceInfo, Move]) {
    this._animatedPiece = moveInfo[0];
    this._animetedMove = moveInfo[1];

    this._animationStart = performance.now();
    this._animationEnd = this._animationStart +
      MoveCalculator.calculateMoveLength(this._animatedPiece, this._animetedMove) *
      InterfaceConstants.MsPerCell;

    this._inputState.acceptingInput = false;

    window.requestAnimationFrame(this.onAnimation);
  }

  private handleGameEvent(event: GameEvent) {
    if (!event.isPiecesChangedEvent()) {
      return;
    }

    this.render();
  }

  private subscribeToEvents() {
    this._game.registerEventHandler((event) => this.handleGameEvent(event));
    this._inputState.subscribePerformMove((moveInfo) => this.handlePerformMove(moveInfo));
  }
}
