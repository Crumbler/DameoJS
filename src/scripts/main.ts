/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageIcon } from 'interface/images/pageIcon';
import { PageBackground } from 'interface/images/pageBackground';
import { FullscreenIcon } from 'interface/images/fullscreenIcon';
import { RestartIcon } from 'interface/images/restartIcon';
import { UndoIcon } from 'interface/images/undoIcon';
import { Input } from 'interface/input';
import { Timer } from 'interface/timer';
import { BoardImage } from 'interface/images/boardImage';
import { BoardLines } from 'interface/images/boardLines';
import { PieceRenderer } from 'interface/pieceRenderer';
import { Game } from 'domain/game';
import { PlayerIndicator } from 'interface/playerIndicator';
import { Fullscreen } from 'interface/fullscreen';
import { InputHandler } from 'interface/inputHandler';
import { CellHighlightRenderer } from 'interface/cellHighlightRenderer';
import { InputState } from 'interface/inputState';

function generateImages() {
  PageBackground.generateAndSet();
  PageIcon.generateAndSet();
  FullscreenIcon.generateAndSet();
  RestartIcon.generateAndSet();
  UndoIcon.generateAndSet();
  BoardImage.generateAndSet();
  BoardLines.generateAndSet();
}

let renderer: PieceRenderer;
let inputHandler: InputHandler;
let cellHighlightRenderer: CellHighlightRenderer;

function registerEventHandlers(game: Game) {
  PlayerIndicator.registerEventHandler(game);
  Timer.registerEventHandler(game);

  renderer.registerEventHandler(game);
}

function onLoad() {
  generateImages();

  Input.registerOnFullscreen(Fullscreen.toggle);

  const game = new Game();

  const inputState = new InputState();

  renderer = new PieceRenderer(game);
  inputHandler = new InputHandler(game, inputState);

  cellHighlightRenderer = new CellHighlightRenderer(game, inputState);

  registerEventHandlers(game);

  game.fireInitialEvents();
}

onLoad();
