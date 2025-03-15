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
  private static readonly _settingsForm = Elements.findById<HTMLFormElement>(ElementIds.settingsForm);

  private static _settings: AppSettings = {};

  public static get current(): RAppSettings {
    return this._settings;
  }

  public static load() {
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

  public static saveSettings() {
    const formData = new FormData(this._settingsForm);

    const formDataObj = Object.fromEntries(formData.entries());

    const settings: AppSettings = {};

    settings.swapHeaderPosition = formDataObj['swapHeaderPosition'] === 'on';
    settings.flipRedPieces = formDataObj['flipRedPieces'] === 'on';

    this._settings = settings;

    localStorage.setItem('settings', JSON.stringify(settings));

    this.applyCurrentSettings();
  }

  public static resetInputs() {
    const elements = this._settingsForm.elements;

    const el1 = elements.namedItem('swapHeaderPosition') as HTMLInputElement;

    el1.checked = this._settings.swapHeaderPosition ?? false;

    const el2 = elements.namedItem('flipRedPieces') as HTMLInputElement;

    el2.checked = this._settings.flipRedPieces ?? false;
  }

  private static setClass(element: HTMLElement, className: string, value: boolean) {
    if (value) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  public static applyCurrentSettingsInitial() {
    this.setClass(document.body, 'swap-header', this._settings.swapHeaderPosition ?? false);
  }

  private static applyCurrentSettings() {
    this.applyCurrentSettingsInitial();
  }
}