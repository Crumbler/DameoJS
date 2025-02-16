import { GameState } from 'domain/gameState';

export const appStateKey = 'app-state';
export const appStateVersion = 1;

export interface AppState {
  readonly version?: number;
  readonly gameState: GameState;
  readonly elapsedTime: number;
}
