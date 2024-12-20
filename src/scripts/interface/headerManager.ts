import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Elements } from 'interface/elements';
import { InputState } from 'interface/inputState';

/**
 * Manages header changes
 */
export class HeaderManager {
  private readonly undoButton = Elements.findById('undo-button');
  private readonly restartButton = Elements.findById('restart-button');
  private readonly _inputState: InputState;

  public constructor(game: GameInfo, inputState: InputState) {
    this._inputState = inputState;
    this._inputState.subscribeAcceptingInput((val) => this.setButtonsMoving(val));
    game.registerEventHandler((event) => this.onGameEvent(event));
  }

  private onGameEvent(event: GameEvent) {
    if (event.isCanUndoEvent()) {
      console.log('Can undo: ' + event.canUndo);
      this.setCanUndo(event.canUndo);
    }
  }

  private addClass(classname: string) {
    this.undoButton.classList.add(classname);
    this.restartButton.classList.add(classname);
  }

  private removeClass(classname: string) {
    this.undoButton.classList.remove(classname);
    this.restartButton.classList.remove(classname);
  }

  private setCanUndo(canUndo: boolean) {
    const canUndoClass = 'can-undo';

    if (canUndo) {
      this.addClass(canUndoClass);
    } else {
      this.removeClass(canUndoClass);
    }
  }

  private setButtonsMoving(moving: boolean) {
    const movingClass = 'moving';

    if (moving) {
      this.removeClass(movingClass);
    } else {
      this.addClass(movingClass);
    }
  }
}