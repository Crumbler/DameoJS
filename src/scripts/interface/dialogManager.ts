import { Elements } from 'interface/elements';

export class DialogManager {
  private static readonly restartDialog = Elements.findById<HTMLDialogElement>('restart-dialog');

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
}