import { Elements } from 'interface/elements';
import { InterfaceConstants } from 'interface/interfaceConstants';
import { InterfaceColors } from 'interface/interfaceColors';
import { PieceInfo } from 'domain/piece';
import { GameInfo } from 'domain/game';
import { Move } from 'domain/move';
import { GameEvent } from 'domain/gameEvent';
import { InputState } from 'interface/inputState';
import { MathUtil } from 'math/mathUtil';
import { Vector2 } from 'math/Vector2';

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
  private _animatedMove: Move | null = null;

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

  private static readonly _crownPath = PieceRenderer.createCrownPath();

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

  private static createCrownPath(): Path2D {
    const path = new Path2D();

    const cellSize = InterfaceConstants.CellSize;
    const center = cellSize / 2;
    const baseY = center;
    const baseYOffset = cellSize * 0.02;
    const outX = cellSize * 0.1;
    const width = cellSize * 0.27;
    const inX = width * 0.2;
    const inY = cellSize * 0.07;
    const biggerHeight = cellSize * 0.23;
    const smallerHeight = cellSize * 0.16;
    const baseHeight = cellSize * 0.05;

    path.moveTo(center - width / 2, baseY + baseYOffset);
    path.lineTo(center - width / 2, baseY - baseHeight);

    path.lineTo(center - width / 2 - outX, baseY - smallerHeight);
    path.lineTo(center - inX, baseY - baseHeight - inY);
    path.lineTo(center, baseY - biggerHeight);
    path.lineTo(center + inX, baseY - baseHeight - inY);
    path.lineTo(center + width / 2 + outX, baseY - smallerHeight);

    path.lineTo(center + width / 2, baseY - baseHeight);
    path.lineTo(center + width / 2, baseY + baseYOffset);

    path.closePath();

    return path;
  }

  private renderCrown() {
    const context = this._pieceContext;

    context.fillStyle = InterfaceColors.CrownColor;

    context.fill(PieceRenderer._crownPath);

    context.strokeStyle = 'black';
    context.lineWidth = 1.5;
    context.stroke(PieceRenderer._crownPath);
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
    this._animatedMove = null;

    this._inputState.acceptingInput = true;
  }

  private onAnimation = () => {
    if (this._animationStart === null ||
      this._animationEnd === null ||
      this._animatedPiece === null ||
      this._animatedMove === null) {
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

  /**
  * Renders the animated piece.
  * @param progress Value from 0 to 1 indicating animation progress.
  */
  private renderAnimatedPiece(progress: number) {
    const cellSize = InterfaceConstants.CellSize;
    const context = this._pieceContext;

    // By the point this function is called
    // these parameters have already been validated
    const piece = this._animatedPiece as PieceInfo;
    const move = this._animatedMove as Move;

    // path length
    const totalLength = move.length;

    const path = move.path;

    let currentProgress = 0;
    let segmentStart = path[0];
    let segmentEnd = path[1];
    let segmentProgress = 0;

    for (let i = 0; i < path.length - 1; ++i) {
      const segmentLength = path[i].distanceTo(path[i + 1]);
      segmentProgress = segmentLength / totalLength;

      if (currentProgress + segmentProgress >= progress) {
        segmentStart = path[i];
        segmentEnd = path[i + 1];
        segmentProgress = (progress - currentProgress) / segmentProgress;

        break;
      }

      currentProgress += segmentProgress;
    }

    const segmentDiff = Vector2.sub(segmentEnd, segmentStart);

    const x = segmentStart.x + segmentDiff.x * segmentProgress;
    const y = segmentStart.y + segmentDiff.y * segmentProgress;

    context.save();

    context.translate(x * cellSize, y * cellSize);

    this.renderPiece(piece.isWhite);
    if (piece.isPromoted) {
      this.renderCrown();
    }

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

      context.translate(piece.pos.x * cellSize, piece.pos.y * cellSize);

      this.renderPiece(piece.isWhite);
      if (piece.isPromoted) {
        this.renderCrown();
      }

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
    this._animatedMove = moveInfo[1];

    this._animationStart = performance.now();
    this._animationEnd = this._animationStart +
      this._animatedMove.length * InterfaceConstants.MsPerCell;

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
