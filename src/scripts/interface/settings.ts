import { ElementIds } from 'interface/elementIds';
import { Elements } from 'interface/elements';

export interface RAppSettings {
  readonly swapHeaderPosition?: boolean;
  readonly flipRedPieces?: boolean;
}

export interface AppSettings {
  swapHeaderPosition?: boolean;
  flipRedPieces?: boolean;
}

export class Settings {
  private readonly _settingsForm = Elements.findById<HTMLFormElement>(ElementIds.settingsForm);

  private _settings: AppSettings = {};

  public get current(): RAppSettings {
    return this._settings;
  }

  public load() {
    const settingsString = localStorage.getItem('settings');

    if (settingsString === null) {
      return;
    }

    let settings: AppSettings;

    try {
      settings = JSON.parse(settingsString) as AppSettings;
    } catch {
      console.warn('Failed to parse settings');
      return;
    }

    this._settings = settings;
  }

  public saveSettings() {
    const formData = new FormData(this._settingsForm);

    const formDataObj = Object.fromEntries(formData.entries());

    const settings: AppSettings = {};

    settings.swapHeaderPosition = formDataObj['swapHeaderPosition'] === 'on';
    settings.flipRedPieces = formDataObj['flipRedPieces'] === 'on';

    this._settings = settings;

    localStorage.setItem('settings', JSON.stringify(settings));

    this.applyCurrentSettings();
  }

  public resetInputs() {
    const elements = this._settingsForm.elements;

    const el1 = elements.namedItem('swapHeaderPosition') as HTMLInputElement;

    el1.checked = this._settings.swapHeaderPosition ?? false;

    const el2 = elements.namedItem('flipRedPieces') as HTMLInputElement;

    el2.checked = this._settings.flipRedPieces ?? false;
  }

  private setClass(element: HTMLElement, className: string, value: boolean) {
    if (value) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  public applyCurrentSettingsInitial() {
    this.setClass(document.body, 'swap-header', this._settings.swapHeaderPosition ?? false);
  }

  private applyCurrentSettings() {
    this.applyCurrentSettingsInitial();
  }
}