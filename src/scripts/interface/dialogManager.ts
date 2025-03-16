import { ElementIds } from 'interface/elementIds';
import { Elements } from 'interface/elements';

export class DialogManager {
  private static readonly restartDialog = Elements.findById<HTMLDialogElement>(ElementIds.restartDialog);
  private static readonly dropdownDialog = Elements.findById<HTMLDialogElement>(ElementIds.dropdownDialog);
  private static readonly settingsDialog = Elements.findById<HTMLDialogElement>(ElementIds.settingsDialog);

  static {
    for (const el of document.getElementsByClassName('modal-dialog')) {
      const dialog = el as HTMLDialogElement;

      dialog.addEventListener('click', this.clickOutsideDialogListener(dialog));
    }
  }

  private static clickOutsideDialogListener(target: HTMLDialogElement) {
    return (event: MouseEvent) => {
      if (event.target === target) {
        target.close('cancel');
      }
    }
  }

  public static openRestartDialog(): Promise<boolean> {
    this.restartDialog.showModal();

    // Don't focus any element initially
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    return new Promise<boolean>((resolve) => {
      this.restartDialog.addEventListener('close', () => {
        resolve(this.restartDialog.returnValue === 'default');
      }, {
        once: true
      });
    });
  }

  public static openSettingsDialog() {
    this.settingsDialog.showModal();

    return new Promise<boolean>((resolve) => {
      this.settingsDialog.addEventListener('close', () => {
        resolve(this.settingsDialog.returnValue === 'default');
      }, {
        once: true
      });
    });
  }

  public static toggleDropdownDialog() {
    if (this.dropdownDialog.open) {
      this.dropdownDialog.close();
      return;
    }

    this.dropdownDialog.show();

    // Don't focus any element initially
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  public static closeDropdownDialog() {
    this.dropdownDialog.close();
  }
}