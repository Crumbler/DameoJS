import { GameState } from 'domain/gameState';

export const appStateKey = 'app-state';

export interface AppState {
  readonly gameState: GameState;
  readonly elapsedTime: number;
}