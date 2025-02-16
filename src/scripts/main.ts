/* eslint-disable @typescript-eslint/no-unused-vars */
import { FullscreenIcon } from 'interface/images/fullscreenIcon';
import { RestartIcon } from 'interface/images/restartIcon';
import { UndoIcon } from 'interface/images/undoIcon';
import { Input } from 'interface/input';
import { GameTimer } from 'interface/gameTimer';
import { PieceRenderer } from 'interface/pieceRenderer';
import { Game } from 'domain/game';
import { PlayerIndicator } from 'interface/playerIndicator';
import { Fullscreen } from 'interface/fullscreen';
import { InputHandler } from 'interface/inputHandler';
import { CellHighlightRenderer } from 'interface/cellHighlightRenderer';
import { InputState } from 'interface/inputState';
import { Wake } from 'interface/wake';
import { HeaderManager } from 'interface/headerManager';
import { VisibilityMonitor } from 'interface/visibilityMonitor';
import { AppState, appStateVersion } from 'interface/appState';
import { AppStateLoader } from 'interface/appStateLoader';
import { AppStateSaver } from 'interface/appStateSaver';
import { CycleIcon } from 'interface/images/cycleIcon';

function generateImages() {
  new FullscreenIcon().generateAndSet();
  new RestartIcon().generateAndSet();
  new UndoIcon().generateAndSet();
  new CycleIcon().generateAndSet();
}

let pieceRenderer: PieceRenderer;
let inputHandler: InputHandler;
let headerManager: HeaderManager;
let cellHighlightRenderer: CellHighlightRenderer;
let game: Game;
const appStateLoader = new AppStateLoader();
const appStateSaver = new AppStateSaver(getState);

function registerEventHandlers(game: Game) {
  PlayerIndicator.registerEventHandler(game);
  GameTimer.registerEventHandler(game);

  window.addEventListener('beforeunload', () => {
    appStateSaver.save();
  });
}

function onLoad() {
  VisibilityMonitor.register();
  Wake.tryStayAwake();

  generateImages();

  Input.registerOnFullscreen(Fullscreen.toggle);

  let appState = appStateLoader.loadState();

  try {
    game = new Game(appState?.gameState ?? null);
  } catch {
    console.error('Failed to initialize game from saved state');
    game = new Game(null);
    appState = null;
  }

  if (appState !== null) {
    GameTimer.setElapsedTime(appState.elapsedTime);
  }

  const inputState = new InputState();

  pieceRenderer = new PieceRenderer(game, inputState);
  inputHandler = new InputHandler(game, inputState);
  headerManager = new HeaderManager(game, inputState);

  cellHighlightRenderer = new CellHighlightRenderer(game, inputState);

  registerEventHandlers(game);

  game.fireInitialEvents();

  appStateSaver.startSaveTimer();
}

function getState(): AppState {
  return {
    version: appStateVersion,
    gameState: game.state,
    elapsedTime: game.canUndo ? GameTimer.getElapsedTime() : 0,
  };
}

onLoad();
