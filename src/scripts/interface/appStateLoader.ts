import { AppState, appStateKey } from 'interface/appState';

export class AppStateLoader {
  public loadState(): AppState | null {
    const stateString = localStorage.getItem(appStateKey);

    if (stateString === null) {
      return null;
    }

    return JSON.parse(stateString) as AppState;
  }
}