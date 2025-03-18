/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameTimer } from 'interface/gameTimer';
import { PieceRenderer } from 'interface/pieceRenderer';
import { Game } from 'domain/game';
import { PlayerIndicator } from 'interface/playerIndicator';
import { InputHandler } from 'interface/inputHandler';
import { CellHighlightRenderer } from 'interface/cellHighlightRenderer';
import { InputState } from 'interface/inputState';
import { Wake } from 'interface/wake';
import { HeaderManager } from 'interface/headerManager';
import { VisibilityMonitor } from 'interface/visibilityMonitor';
import { AppState, appStateVersion } from 'interface/appState';
import { AppStateLoader } from 'interface/appStateLoader';
import { AppStateSaver } from 'interface/appStateSaver';
import { Settings } from 'interface/settings';
import { GameManager } from 'interface/gameManager';
import { GameEndHandler } from 'interface/gameEndHandler';

let pieceRenderer: PieceRenderer;
let inputHandler: InputHandler;
let headerManager: HeaderManager;
let cellHighlightRenderer: CellHighlightRenderer;
let settings: Settings;
let game: Game;
let gameEndHandler: GameEndHandler;
const appStateLoader = new AppStateLoader();
const appStateSaver = new AppStateSaver(getState);

function registerEventHandlers(game: Game) {
  PlayerIndicator.registerEventHandler(game);
  GameManager.registerEventHandler(game);
  GameTimer.registerEventHandler(game);

  window.addEventListener('beforeunload', () => {
    appStateSaver.save();
  });
}

function onLoad() {
  VisibilityMonitor.register();
  Wake.tryStayAwake();

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

  settings = new Settings(game);
  settings.load();
  settings.resetInputs();
  settings.applyCurrentSettingsInitial();

  gameEndHandler = new GameEndHandler(game, inputState);
  pieceRenderer = new PieceRenderer(game, inputState, settings);
  inputHandler = new InputHandler(game, inputState, appStateSaver, settings);
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
