import { ElementIds } from 'interface/elementIds';
import { Elements } from 'interface/elements';

export class DialogManager {
  private static readonly restartDialog = Elements.findById<HTMLDialogElement>(ElementIds.restartDialog);
  private static readonly dropdownDialog = Elements.findById<HTMLDialogElement>(ElementIds.dropdownDialog);

  static {
    this.restartDialog.addEventListener('click', event => {
      if (event.target === this.restartDialog) {
        this.restartDialog.close('cancel');
      }
    });
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