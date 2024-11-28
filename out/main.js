// src/scripts/math/Vector2.ts
var Vector2 = class _Vector2 extends Array {
  constructor(x = 0, y = 0) {
    super();
    this[0] = x;
    this[1] = y;
  }
  static fromScalar(x) {
    return new _Vector2(x, x);
  }
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  get width() {
    return this.x;
  }
  set width(value) {
    this.x = value;
  }
  get height() {
    return this.y;
  }
  set height(value) {
    this.y = value;
  }
  clone() {
    return this.slice();
  }
  mul(x) {
    this.x *= x;
    this.y *= x;
    return this;
  }
  div(x) {
    this.x /= x;
    this.y /= x;
    return this;
  }
};

// src/scripts/domain/gameConstants.ts
var GameConstants = class {
};
GameConstants.CellsPerSide = 8;

// src/scripts/interface/interfaceConstants.ts
var _InterfaceConstants = class _InterfaceConstants {
};
_InterfaceConstants.HeaderIconSize = 70;
_InterfaceConstants.BoardSize = 600;
_InterfaceConstants.CellSize = _InterfaceConstants.BoardSize / GameConstants.CellsPerSide;
_InterfaceConstants.PieceX = _InterfaceConstants.CellSize / 2;
_InterfaceConstants.PieceY = _InterfaceConstants.CellSize * 0.6;
_InterfaceConstants.PieceWidth = _InterfaceConstants.CellSize * 0.75;
_InterfaceConstants.PieceHeight = _InterfaceConstants.CellSize * 0.2;
_InterfaceConstants.PieceLineWidth = _InterfaceConstants.CellSize * 0.03;
/**
 * Milliseconds per cell for animation
 */
_InterfaceConstants.MsPerCell = 250;
var InterfaceConstants = _InterfaceConstants;

// src/scripts/helpers/blobHelper.ts
var BlobHelper = class {
  static generateBackgroundBlob(bounds, drawAction, transparent) {
    const canvas = new OffscreenCanvas(bounds.width, bounds.height);
    const context = canvas.getContext("2d", {
      alpha: transparent
    });
    if (context === null) {
      throw new Error("Failed to get 2d context");
    }
    drawAction(context);
    return canvas.convertToBlob();
  }
  /**
   * Draws to a context, converts to blob and returns the blob's url
   * @param size Canvas bounds
   * @param drawAction Function that draws to the context
   * @param transparent True if 2d context should support transparency
   * @returns URL to resource
   */
  static async drawToBlobUrl(size, drawAction, transparent = false) {
    const imageBlob = await this.generateBackgroundBlob(
      size,
      drawAction,
      transparent
    );
    return URL.createObjectURL(imageBlob);
  }
};

// src/scripts/interface/elements.ts
var Elements = class {
  /**
   * Finds a DOM element by id, otherwise throws an {@link Error}
   * @param id Element id
   * @returns Element
   * @throws {Error} When the element cannot be found
   */
  static findById(id) {
    const element = document.getElementById(id);
    if (element === null) {
      throw new Error("Failed to find element with id " + id);
    }
    return element;
  }
};

// src/scripts/interface/images/fullscreenIcon.ts
var _FullscreenIcon = class _FullscreenIcon {
  static calculateBounds() {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }
  static drawCorner(context, size) {
    const width = 0.1;
    const length = 0.3;
    context.fillRect(0, 0, size * width, size * length);
    context.fillRect(0, 0, size * length, size * width);
  }
  static drawPattern(context) {
    const size = context.canvas.width;
    context.fillStyle = "white";
    _FullscreenIcon.drawCorner(context, size);
    context.save();
    context.translate(size, 0);
    context.rotate(Math.PI / 2);
    _FullscreenIcon.drawCorner(context, size);
    context.restore();
    context.save();
    context.translate(size, size);
    context.rotate(Math.PI);
    _FullscreenIcon.drawCorner(context, size);
    context.restore();
    context.save();
    context.translate(0, size);
    context.rotate(Math.PI * 1.5);
    _FullscreenIcon.drawCorner(context, size);
    context.restore();
  }
  static async generateAndSet() {
    const bounds = _FullscreenIcon.calculateBounds();
    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      _FullscreenIcon.drawPattern
    );
    _FullscreenIcon.fullscreenIcon.style.maskImage = `url(${imageUrl})`;
  }
};
_FullscreenIcon.fullscreenIcon = Elements.findById("fullscreen-button");
var FullscreenIcon = _FullscreenIcon;

// src/scripts/interface/images/restartIcon.ts
var _RestartIcon = class _RestartIcon {
  static calculateBounds() {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }
  static drawArrowhead(context, size) {
    const height = size * 0.3;
    const side = 2 * height / Math.sqrt(3);
    context.beginPath();
    context.moveTo(0, -side / 2);
    context.lineTo(height, 0);
    context.lineTo(0, side / 2);
    context.fill();
  }
  static drawPattern(context) {
    const size = context.canvas.width;
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.lineWidth = 7;
    const startAngle = Math.PI / 4;
    const endAngle = Math.PI * 1.8;
    const radius = size * 0.35;
    context.beginPath();
    context.arc(size / 2, size / 2, radius, startAngle, endAngle);
    context.stroke();
    context.translate(
      size / 2 + radius * Math.cos(endAngle),
      size / 2 + radius * Math.sin(endAngle)
    );
    context.rotate(endAngle + Math.PI / 2);
    _RestartIcon.drawArrowhead(context, size);
  }
  static async generateAndSet() {
    const bounds = _RestartIcon.calculateBounds();
    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      _RestartIcon.drawPattern
    );
    _RestartIcon.restartIcon.style.maskImage = `url(${imageUrl})`;
  }
};
_RestartIcon.restartIcon = Elements.findById("restart-button");
var RestartIcon = _RestartIcon;

// src/scripts/interface/images/undoIcon.ts
var _UndoIcon = class _UndoIcon {
  static calculateBounds() {
    return Vector2.fromScalar(InterfaceConstants.HeaderIconSize);
  }
  static drawArrowhead(context, size) {
    const height = size * 0.3;
    const side = 2 * height / Math.sqrt(3);
    context.beginPath();
    context.moveTo(0, -side / 2);
    context.lineTo(height, 0);
    context.lineTo(0, side / 2);
    context.fill();
  }
  static drawPattern(context) {
    const size = context.canvas.width;
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.lineWidth = 7;
    context.lineCap = "round";
    const startAngle = 0;
    const endAngle = Math.PI * 1.2;
    const radius = size * 0.35;
    const centerY = size * 0.65;
    context.beginPath();
    context.arc(size / 2, centerY, radius, startAngle, endAngle, true);
    context.stroke();
    context.translate(
      size / 2 + radius * Math.cos(endAngle),
      centerY + radius * Math.sin(endAngle)
    );
    context.rotate(endAngle - Math.PI / 2);
    _UndoIcon.drawArrowhead(context, size);
  }
  static async generateAndSet() {
    const bounds = _UndoIcon.calculateBounds();
    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      _UndoIcon.drawPattern
    );
    _UndoIcon.undoIcon.style.maskImage = `url(${imageUrl})`;
  }
};
_UndoIcon.undoIcon = Elements.findById("undo-button");
var UndoIcon = _UndoIcon;

// src/scripts/interface/input.ts
var _Input = class _Input {
  static registerOnFullscreen(action) {
    _Input.fullscreenIcon.onclick = action;
  }
};
_Input.fullscreenIcon = document.getElementById("fullscreen-button");
var Input = _Input;

// src/scripts/misc/format.ts
var Format = class {
  /**
   * Converts an integer to string, padding it with a zero on the left if it's below 10
   */
  static addZeroForSingleDigit(x) {
    if (x < 10) {
      return "0" + x;
    }
    return x.toString();
  }
};

// src/scripts/interface/timer.ts
var _Timer = class _Timer {
  /**
   * Restarts the timer
   */
  static restart() {
    if (_Timer.interval !== null) {
      clearInterval(_Timer.interval);
    }
    _Timer.start = Date.now() / 1e3 | 0;
    _Timer.interval = setInterval(_Timer.update, 1e3);
    _Timer.update();
  }
  static update() {
    const diff = (Date.now() / 1e3 | 0) - _Timer.start;
    const hours = diff / 3600 | 0;
    const minutes = diff / 60 - hours * 60 | 0;
    const seconds = diff - hours * 3600 - minutes * 60;
    let timeString;
    if (hours > 0) {
      timeString = `${hours}:${Format.addZeroForSingleDigit(minutes)}:${Format.addZeroForSingleDigit(seconds)}`;
    } else {
      timeString = `${minutes}:${Format.addZeroForSingleDigit(seconds)}`;
    }
    _Timer.timerElement.textContent = timeString;
  }
  static handleGameEvent(event) {
    if (!event.isGameResetEvent()) {
      return;
    }
    _Timer.restart();
  }
  static registerEventHandler(game) {
    game.registerEventHandler(_Timer.handleGameEvent);
  }
};
_Timer.timerElement = Elements.findById("game-time");
_Timer.interval = null;
var Timer = _Timer;

// src/scripts/interface/interfaceColors.ts
var InterfaceColors = class {
};
/**
 * Background color for the page icon
 */
InterfaceColors.Background = "#362918";
/**
 * Color for icon
 */
InterfaceColors.RhombusA = "#ab9349";
InterfaceColors.RhombusB = "#ca9334";
/**
 * Red piece left edge cover
 */
InterfaceColors.RedPieceA = "rgb(60, 0, 0)";
/**
 * Red piece right edge color
 */
InterfaceColors.RedPieceB = "red";
/**
 * White piece left edge cover
 */
InterfaceColors.WhitePieceA = "rgb(60, 60, 60)";
/**
 * White piece right edge color
 */
InterfaceColors.WhitePieceB = "white";
/**
 * Highlight color of a cell that can be selected
 */
InterfaceColors.SelectableCell = "rgb(255, 247, 0)";
/**
 * Highlight color for the selected piece's cell
 */
InterfaceColors.SelectedCell = "rgb(53, 255, 2)";
/**
 * Highlight color for a cell that can be moved to
 */
InterfaceColors.ReachableCell = "rgb(53, 255, 2)";

// src/scripts/domain/move.ts
var Move = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
};
var PieceMoves = class {
  constructor(piece, moves) {
    this.piece = piece;
    this.moves = moves;
  }
};

// src/scripts/domain/piece.ts
var WallCell = -1;
var Piece = class _Piece {
  static checkCoordinate(coord, coordName) {
    if (coord !== (coord | 0)) {
      throw new Error(`${coordName} value ${coord} is not an integer`);
    }
    if (coord < 0 || coord >= GameConstants.CellsPerSide) {
      throw new Error(
        `${coordName} coordinate must be in range [0, ${GameConstants.CellsPerSide - 1}]`
      );
    }
  }
  constructor(isWhite, x, y) {
    _Piece.checkCoordinate(x, "X");
    _Piece.checkCoordinate(y, "Y");
    this._isWhite = isWhite;
    this._isPromoted = false;
    this.x = x;
    this.y = y;
  }
  get isPromoted() {
    return this._isPromoted;
  }
  get isWhite() {
    return this._isWhite;
  }
  moveTo(x, y) {
    _Piece.checkCoordinate(x, "X");
    _Piece.checkCoordinate(y, "Y");
    this.x = x;
    this.y = y;
  }
  promote() {
    if (this._isPromoted) {
      throw new Error("Piece already promoted");
    }
    this._isPromoted = true;
  }
};

// src/scripts/math/mathUtil.ts
var MathUtil = class {
  static smoothStep(x) {
    return 3 * x * x - 2 * x * x * x;
  }
  static calculateLength(x1, y1, x2, y2) {
    const dX = x2 - x1;
    const dY = y2 - y1;
    return Math.sqrt(dX * dX + dY * dY);
  }
};

// src/scripts/domain/moveCalculator.ts
var MoveCalculator = class {
  static getSimpleMove(board, piece, dX, dY) {
    let x = piece.x;
    let y = piece.y;
    let cell = board.getCell(x + dX, y + dY);
    while (cell !== null && cell !== WallCell && cell.isWhite === piece.isWhite) {
      x += dX;
      y += dY;
      cell = board.getCell(x + dX, y + dY);
    }
    if (cell === null) {
      return new Move(x + dX, y + dY);
    }
    return null;
  }
  static addSimpleMoves(board, moves, piece) {
    const dY = piece.isWhite ? -1 : 1;
    for (let dX = -1; dX <= 1; ++dX) {
      const move = this.getSimpleMove(board, piece, dX, dY);
      if (move !== null) {
        moves.push(move);
      }
    }
  }
  /**
   * Calculates all the possible moves for a given piece
   * @returns Move array if there are any available moves, otherwise null
   */
  static calculateMoves(board, piece) {
    const moves = [];
    this.addSimpleMoves(board, moves, piece);
    if (moves.length === 0) {
      return null;
    }
    return moves;
  }
  static calculateMoveLength(piece, move) {
    return MathUtil.calculateLength(piece.x, piece.y, move.x, move.y);
  }
};

// src/scripts/interface/pieceRenderer.ts
var PieceRenderer = class _PieceRenderer {
  constructor(game, inputState) {
    this._pieceContext = Elements.findById("piece-canvas").getContext("2d");
    this._animationStart = null;
    this._animationEnd = null;
    this._animatedPiece = null;
    this._animetedMove = null;
    /**
     * Gradient for the lower piece part
     */
    this._redPieceLowerGradient = _PieceRenderer.createPieceLowerGradient(this._pieceContext, false);
    /**
     * Gradient for the upper piece part
     */
    this._whitePieceLowerGradient = _PieceRenderer.createPieceLowerGradient(this._pieceContext, true);
    this.onAnimation = () => {
      if (this._animationStart === null || this._animationEnd === null || this._animatedPiece === null || this._animetedMove === null) {
        throw new Error("Animation info is not supposed to be null");
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
    };
    this._game = game;
    this._inputState = inputState;
    this.subscribeToEvents();
  }
  static createPieceLowerGradient(context, white) {
    const cellSize = InterfaceConstants.CellSize;
    const gradient = context.createLinearGradient(
      cellSize * 0.1,
      cellSize * 0.6,
      cellSize * 0.9,
      cellSize * 0.6
    );
    gradient.addColorStop(
      0,
      white ? InterfaceColors.WhitePieceA : InterfaceColors.RedPieceA
    );
    gradient.addColorStop(
      1,
      white ? InterfaceColors.WhitePieceB : InterfaceColors.RedPieceB
    );
    return gradient;
  }
  renderPiece(white) {
    const cellSize = InterfaceConstants.CellSize;
    const pieceX = InterfaceConstants.PieceX;
    const pieceY = InterfaceConstants.PieceY;
    const pieceWidth = InterfaceConstants.PieceWidth;
    const pieceHeight = InterfaceConstants.PieceHeight;
    const gradient = white ? this._whitePieceLowerGradient : this._redPieceLowerGradient;
    const rightColor = white ? InterfaceColors.WhitePieceB : InterfaceColors.RedPieceB;
    const context = this._pieceContext;
    context.fillStyle = gradient;
    context.strokeStyle = "black";
    context.lineWidth = InterfaceConstants.PieceLineWidth;
    context.beginPath();
    context.ellipse(
      pieceX,
      pieceY,
      pieceWidth / 2,
      cellSize * 0.2,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
    context.beginPath();
    context.fillRect(
      pieceX - pieceWidth / 2,
      pieceY - pieceHeight,
      pieceWidth,
      pieceHeight
    );
    context.fillStyle = rightColor;
    context.beginPath();
    context.ellipse(
      pieceX,
      pieceY - pieceHeight,
      pieceWidth / 2,
      pieceHeight,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
    context.beginPath();
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
      Math.PI * 2
    );
    context.stroke();
    context.beginPath();
    context.moveTo(pieceX - pieceWidth / 2, pieceY - pieceHeight);
    context.lineTo(pieceX - pieceWidth / 2, pieceY);
    context.moveTo(pieceX + pieceWidth / 2, pieceY - pieceHeight);
    context.lineTo(pieceX + pieceWidth / 2, pieceY);
    context.stroke();
  }
  endAnimation() {
    this._animationStart = null;
    this._animationEnd = null;
    this._animatedPiece = null;
    this._animetedMove = null;
    this._inputState.acceptingInput = true;
  }
  renderAnimatedPiece(progress) {
    const cellSize = InterfaceConstants.CellSize;
    const context = this._pieceContext;
    const piece = this._animatedPiece;
    const move = this._animetedMove;
    const dX = move.x - piece.x;
    const dY = move.y - piece.y;
    const x = piece.x + dX * progress;
    const y = piece.y + dY * progress;
    context.save();
    context.translate(x * cellSize, y * cellSize);
    this.renderPiece(piece.isWhite);
    context.restore();
  }
  renderNormalPieces() {
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
  render(progress = 0) {
    const context = this._pieceContext;
    context.clearRect(
      0,
      0,
      InterfaceConstants.BoardSize,
      InterfaceConstants.BoardSize
    );
    this.renderNormalPieces();
    if (this._animatedPiece !== null) {
      this.renderAnimatedPiece(progress);
    }
  }
  handlePerformMove(moveInfo) {
    this._animatedPiece = moveInfo[0];
    this._animetedMove = moveInfo[1];
    this._animationStart = performance.now();
    this._animationEnd = this._animationStart + MoveCalculator.calculateMoveLength(this._animatedPiece, this._animetedMove) * InterfaceConstants.MsPerCell;
    this._inputState.acceptingInput = false;
    window.requestAnimationFrame(this.onAnimation);
  }
  handleGameEvent(event) {
    if (!event.isPiecesChangedEvent()) {
      return;
    }
    this.render();
  }
  subscribeToEvents() {
    this._game.registerEventHandler((event) => this.handleGameEvent(event));
    this._inputState.subscribePerformMove((moveInfo) => this.handlePerformMove(moveInfo));
  }
};

// src/scripts/domain/gameEvent.ts
var GameEvent = class {
  constructor(type) {
    this._type = type;
  }
  isPlayerChangedEvent() {
    return this._type === 0 /* PlayerChanged */;
  }
  isGameResetEvent() {
    return this._type === 1 /* GameReset */;
  }
  isPiecesChangedEvent() {
    return this._type === 2 /* PiecesChanged */;
  }
};
var GameResetEvent = class extends GameEvent {
  constructor() {
    super(1 /* GameReset */);
  }
};
var PlayerChangedEvent = class extends GameEvent {
  constructor(player) {
    super(0 /* PlayerChanged */);
    this.player = player;
  }
};
var PiecesChangedEvent = class extends GameEvent {
  constructor() {
    super(2 /* PiecesChanged */);
  }
};

// src/scripts/domain/board.ts
var Board = class _Board {
  constructor() {
    this._board = [];
    this._board = new Array(GameConstants.CellsPerSide);
    for (let i = 0; i < GameConstants.CellsPerSide; ++i) {
      this._board[i] = new Array(GameConstants.CellsPerSide);
    }
    this.clearBoard();
    this.fillBoard();
  }
  static fillRow(row, rowNumber, pieceCount, white) {
    const cellsPerSide = GameConstants.CellsPerSide;
    for (let j = (cellsPerSide - pieceCount) / 2; j < cellsPerSide / 2 + pieceCount / 2; ++j) {
      const piece = new Piece(white, j, rowNumber);
      row[j] = piece;
    }
  }
  fillBoard() {
    const board = this._board;
    for (let i = 0; i < 3; ++i) {
      _Board.fillRow(board[i], i, GameConstants.CellsPerSide - i * 2, false);
    }
    for (let i = 0; i < 3; ++i) {
      _Board.fillRow(
        board[board.length - i - 1],
        board.length - i - 1,
        GameConstants.CellsPerSide - i * 2,
        true
      );
    }
  }
  clearBoard() {
    for (let i = 0; i < this._board.length; ++i) {
      const row = this._board[i];
      for (let j = 0; j < row.length; ++j) {
        row[j] = null;
      }
    }
  }
  reset() {
    this.clearBoard();
    this.fillBoard();
  }
  getCell(x, y) {
    const cellsPerSide = GameConstants.CellsPerSide;
    if (x < 0 || x >= cellsPerSide || y < 0 || y >= cellsPerSide) {
      return WallCell;
    }
    return this._board[y][x];
  }
  movePiece(fromX, fromY, toX, toY) {
    const piece = this._board[fromY][fromX];
    if (piece === null) {
      throw new Error(`Piece at ${fromX} ${fromY} not present`);
    }
    const newCell = this._board[toY][toX];
    if (newCell !== null) {
      throw new Error(`Cell at ${toX} ${toY} not empty`);
    }
    this._board[toY][toX] = piece;
    this._board[fromY][fromX] = null;
    piece.moveTo(toX, toY);
  }
  get data() {
    return this._board;
  }
  get dataView() {
    return this._board;
  }
};

// src/scripts/misc/subject.ts
var Subject = class {
  constructor() {
    this._handlers = [];
  }
  subscribe(handler) {
    this._handlers.push(handler);
  }
  raise(arg) {
    for (const handler of this._handlers) {
      handler(arg);
    }
  }
};

// src/scripts/domain/game.ts
var Game = class {
  constructor() {
    /**
     * An array with all of the pieces on the board
     */
    this._pieces = [];
    this._moveInfos = [];
    this._eventSubject = new Subject();
    this._currentPlayer = 1 /* White */;
    this._board = new Board();
    this.resetPieces();
    this.calculateMoves();
  }
  calculatePieceMoves(boardView, piece) {
    const moves = MoveCalculator.calculateMoves(boardView, piece);
    if (moves !== null) {
      this._moveInfos.push(new PieceMoves(piece, moves));
    }
  }
  calculateMoves() {
    this._moveInfos.length = 0;
    const isWhite = this._currentPlayer === 1 /* White */;
    for (const piece of this._pieces) {
      if (piece.isWhite !== isWhite) {
        continue;
      }
      this.calculatePieceMoves(this._board, piece);
    }
  }
  /**
   * Resets the pieces array and fills it from the board
   */
  resetPieces() {
    this._pieces.length = 0;
    const data = this._board.data;
    for (const row of data) {
      for (const piece of row) {
        if (piece !== null) {
          this._pieces.push(piece);
        }
      }
    }
  }
  swapPlayer() {
    this._currentPlayer = this._currentPlayer === 0 /* Red */ ? 1 /* White */ : 0 /* Red */;
    this.onPlayerChanged();
  }
  get board() {
    return this._board;
  }
  get pieces() {
    return this._pieces;
  }
  get moves() {
    return this._moveInfos;
  }
  get currentPlayer() {
    return this._currentPlayer;
  }
  get canUndo() {
    return false;
  }
  fireInitialEvents() {
    this.onPlayerChanged();
    this.onGameReset();
    this.onPiecesChanged();
  }
  findPieceMoves(piece) {
    for (const moveInfo of this._moveInfos) {
      if (moveInfo.piece === piece) {
        return moveInfo.moves;
      }
    }
    return null;
  }
  performMove(pieceToMove, move) {
    const pieceMoveInfo = this._moveInfos.find((mi) => mi.piece === pieceToMove);
    if (!pieceMoveInfo) {
      throw new Error("Unable to find moves for piece " + pieceToMove);
    }
    const hasMove = pieceMoveInfo.moves.includes(move);
    if (!hasMove) {
      throw new Error(`The piece ${pieceToMove} does not have the move ${move}`);
    }
    this._board.movePiece(pieceToMove.x, pieceToMove.y, move.x, move.y);
    this.swapPlayer();
    this.onPiecesChanged();
    this.calculateMoves();
  }
  reset() {
    this._currentPlayer = 1 /* White */;
    this._board.reset();
    this.resetPieces();
    this.calculateMoves();
    this.onPlayerChanged();
    this.onGameReset();
    this.onPiecesChanged();
  }
  registerEventHandler(handler) {
    this._eventSubject.subscribe(handler);
  }
  raiseEvent(event) {
    this._eventSubject.raise(event);
  }
  onPiecesChanged() {
    console.log("Raised pieces changed event");
    this.raiseEvent(new PiecesChangedEvent());
  }
  onGameReset() {
    console.log("Raised game reset event");
    this.raiseEvent(new GameResetEvent());
  }
  onPlayerChanged() {
    console.log("Raised player changed event");
    this.raiseEvent(new PlayerChangedEvent(this._currentPlayer));
  }
};

// src/scripts/interface/playerIndicator.ts
var _PlayerIndicator = class _PlayerIndicator {
  static getPlayerString(player) {
    switch (player) {
      case 0 /* Red */:
        return "Red Player";
      case 1 /* White */:
        return "White Player";
      default:
        throw new Error("Unknown player type " + player);
    }
  }
  static updateIndicator(player) {
    this.indicator.textContent = _PlayerIndicator.getPlayerString(player);
  }
  static handleGameEvent(event) {
    if (!event.isPlayerChangedEvent()) {
      return;
    }
    _PlayerIndicator.updateIndicator(event.player);
  }
  static registerEventHandler(game) {
    game.registerEventHandler(_PlayerIndicator.handleGameEvent);
  }
};
_PlayerIndicator.indicator = Elements.findById("player-indicator");
var PlayerIndicator = _PlayerIndicator;

// src/scripts/interface/fullscreen.ts
var Fullscreen = class {
  static toggle() {
    if (!document.fullscreenEnabled) {
      return;
    }
    if (document.fullscreenElement === null) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
};

// src/scripts/interface/inputHandler.ts
var InputHandler = class {
  constructor(game, inputState) {
    this._container = Elements.findById("game-container");
    this._restartButton = Elements.findById("restart-button");
    this._pieceToMove = null;
    this._moveToPerform = null;
    this._game = game;
    this._inputState = inputState;
    this.registerHandlers();
  }
  registerHandlers() {
    this._container.addEventListener(
      "click",
      (event) => this.handleClick(event),
      true
    );
    this._restartButton.addEventListener(
      "click",
      () => this.handleResetClick()
    );
    this._inputState.subscribeAcceptingInput((param) => this.onAcceptingInputChanged(param));
    this._game.registerEventHandler((event) => this.handleGameEvent(event));
  }
  onAcceptingInputChanged(acceptingInput) {
    if (!acceptingInput) {
      return;
    }
    if (this._pieceToMove === null) {
      throw new Error("_pieceToMove not supposed to be null");
    }
    if (this._moveToPerform === null) {
      throw new Error("_moveToPerform not supposed to be null");
    }
    this._game.performMove(this._pieceToMove, this._moveToPerform);
    this._inputState.selectedPiece = null;
    this._pieceToMove = null;
    this._moveToPerform = null;
  }
  startMove(piece, move) {
    if (this._pieceToMove !== null) {
      throw new Error("_pieceToMove is supposed to be null");
    }
    if (this._moveToPerform !== null) {
      throw new Error("_moveToPerform is supposed to be null");
    }
    this._pieceToMove = piece;
    this._moveToPerform = move;
    this._inputState.raisePerformMove(piece, move);
  }
  tryMoveToCell(piece, cellX, cellY) {
    const moves = this._game.findPieceMoves(piece);
    if (moves === null) {
      return false;
    }
    const move = moves.find((mv) => mv.x === cellX && mv.y === cellY);
    if (!move) {
      return false;
    }
    this.startMove(piece, move);
    return true;
  }
  handleCellClick(cellX, cellY) {
    if (!this._inputState.acceptingInput) {
      return;
    }
    const piece = this._game.board.dataView[cellY][cellX];
    const currentPiece = this._inputState.selectedPiece;
    if (currentPiece === piece) {
      return;
    }
    if (piece !== null && this._game.findPieceMoves(piece) === null) {
      this._inputState.selectedPiece = null;
      return;
    }
    if (piece === null && this._inputState.selectedPiece !== null && this.tryMoveToCell(this._inputState.selectedPiece, cellX, cellY)) {
      return;
    }
    this._inputState.selectedPiece = piece;
  }
  handleClick(event) {
    if (!this._inputState.acceptingInput) {
      return;
    }
    const x = event.offsetX / this._container.clientWidth * GameConstants.CellsPerSide;
    const y = event.offsetY / this._container.clientHeight * GameConstants.CellsPerSide;
    const cellX = x | 0;
    const cellY = y | 0;
    this.handleCellClick(cellX, cellY);
  }
  handleResetClick() {
    if (!this._inputState.acceptingInput) {
      return;
    }
    this._game.reset();
    this._inputState.selectedPiece = null;
  }
  handleGameEvent(event) {
    if (event.isGameResetEvent()) {
      this._inputState.selectedPiece = null;
    }
  }
};

// src/scripts/interface/cellHighlightRenderer.ts
var CellHighlightRenderer = class {
  constructor(game, inputState) {
    this._cellContext = Elements.findById("cell-canvas").getContext("2d");
    this._game = game;
    inputState.subscribeToSelectedPieceChanges((piece) => this.onPieceChanged(piece));
    this.render(null);
  }
  renderSelectedPiece(piece) {
    const context = this._cellContext;
    const cellSize = InterfaceConstants.CellSize;
    context.fillStyle = InterfaceColors.SelectedCell;
    context.fillRect(
      piece.x * cellSize,
      piece.y * cellSize,
      cellSize,
      cellSize
    );
    context.fillStyle = InterfaceColors.ReachableCell;
    const moves = this._game.findPieceMoves(piece);
    if (moves === null) {
      return;
    }
    for (const move of moves) {
      context.fillRect(
        move.x * cellSize,
        move.y * cellSize,
        cellSize,
        cellSize
      );
    }
  }
  render(piece) {
    const context = this._cellContext;
    const boardSize = InterfaceConstants.BoardSize;
    const cellSize = InterfaceConstants.CellSize;
    context.fillStyle = InterfaceColors.SelectableCell;
    context.clearRect(0, 0, boardSize, boardSize);
    for (const pieceMoves of this._game.moves) {
      const rPiece = pieceMoves.piece;
      if (rPiece === piece) {
        continue;
      }
      context.fillRect(
        rPiece.x * cellSize,
        rPiece.y * cellSize,
        cellSize,
        cellSize
      );
    }
    if (piece !== null) {
      this.renderSelectedPiece(piece);
    }
  }
  onPieceChanged(piece) {
    this.render(piece);
  }
};

// src/scripts/interface/inputState.ts
var InputState = class {
  constructor() {
    /**
     * The currently selected piece
     */
    this._selectedPiece = null;
    /**
     * Indicates whether any game input is being accepted right now
     */
    this._acceptingInput = true;
    this._selectedPieceChangedSubject = new Subject();
    this._acceptingInputSubject = new Subject();
    this._performMoveSubject = new Subject();
  }
  get selectedPiece() {
    return this._selectedPiece;
  }
  set selectedPiece(piece) {
    this._selectedPiece = piece;
    this.raisePieceChange();
  }
  get acceptingInput() {
    return this._acceptingInput;
  }
  set acceptingInput(value) {
    this._acceptingInput = value;
    this.raiseAcceptingInput();
  }
  raisePieceChange() {
    this._selectedPieceChangedSubject.raise(this.selectedPiece);
  }
  raiseAcceptingInput() {
    this._acceptingInputSubject.raise(this._acceptingInput);
  }
  raisePerformMove(piece, move) {
    this._performMoveSubject.raise([piece, move]);
  }
  subscribeToSelectedPieceChanges(handler) {
    this._selectedPieceChangedSubject.subscribe(handler);
  }
  subscribeAcceptingInput(handler) {
    this._acceptingInputSubject.subscribe(handler);
  }
  subscribePerformMove(handler) {
    this._performMoveSubject.subscribe(handler);
  }
};

// src/scripts/interface/wake.ts
var _Wake = class _Wake {
  static async tryStayAwake() {
    const supportsWakeLock = "wakeLock" in navigator;
    if (!supportsWakeLock) {
      console.log("WakeLock not supported");
      return;
    }
    _Wake.tryAcquireWakeLock();
  }
  static async tryAcquireWakeLock() {
    try {
      _Wake._wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      const e = err;
      console.log(`Failed to request WakeLock: ${e.name}, ${e.message}`);
      return;
    }
    console.log("WakeLock acquired");
    _Wake._wakeLock.onrelease = _Wake.tryAcquireWakeLock;
  }
};
_Wake._wakeLock = null;
var Wake = _Wake;

// src/scripts/main.ts
function generateImages() {
  FullscreenIcon.generateAndSet();
  RestartIcon.generateAndSet();
  UndoIcon.generateAndSet();
}
var pieceRenderer;
var inputHandler;
var cellHighlightRenderer;
function registerEventHandlers(game) {
  PlayerIndicator.registerEventHandler(game);
  Timer.registerEventHandler(game);
}
function onLoad() {
  Wake.tryStayAwake();
  generateImages();
  Input.registerOnFullscreen(Fullscreen.toggle);
  const game = new Game();
  const inputState = new InputState();
  pieceRenderer = new PieceRenderer(game, inputState);
  inputHandler = new InputHandler(game, inputState);
  cellHighlightRenderer = new CellHighlightRenderer(game, inputState);
  registerEventHandlers(game);
  game.fireInitialEvents();
}
onLoad();
//# sourceMappingURL=main.js.map