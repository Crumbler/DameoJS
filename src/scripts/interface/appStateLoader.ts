import { AppState, appStateKey, appStateVersion } from 'interface/appState';

export class AppStateLoader {
  public loadState(): AppState | null {
    const stateString = localStorage.getItem(appStateKey);

    if (stateString === null) {
      return null;
    }

    const state = JSON.parse(stateString) as AppState;

    if (state.version !== appStateVersion) {
      return null;
    }

    return state;
  }
}
