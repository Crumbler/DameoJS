import { AppState, appStateKey } from 'interface/appState';

export class AppStateSaver {
  public constructor(private readonly appStateGetter: () => AppState) { }

  public startSaveTimer() {
    // Save every 2 minutes
    window.setInterval(() => this.save(), 1000 * 60 * 2);
  }

  public save() {
    console.log('Saving');
    const state = this.appStateGetter();

    localStorage.setItem(appStateKey, JSON.stringify(state));
  }
}