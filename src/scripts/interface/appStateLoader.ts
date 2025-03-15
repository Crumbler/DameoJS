import { AppState, appStateKey, appStateVersion } from 'interface/appState';

export class AppStateLoader {
  public loadState(): AppState | null {
    const stateString = localStorage.getItem(appStateKey);

    if (stateString === null) {
      return null;
    }

    let state: AppState;

    try {
      state = JSON.parse(stateString) as AppState;
    } catch {
      console.warn('Failed to parse settings');
      return null;
    }

    if (state?.version !== appStateVersion) {
      return null;
    }

    return state;
  }
}
