import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Elements } from 'interface/elements';
import { InputState, RSelectionState } from 'interface/inputState';
import { ElementIds } from 'interface/elementIds';

/**
 * Manages header changes
 */
export class HeaderManager {
  private readonly header = Elements.findById(ElementIds.gameHeader);

  public constructor(game: GameInfo, inputState: InputState) {
    inputState.subscribeAcceptingInput((acceptingInput) =>
      this.setMoving(!acceptingInput),
    );
    inputState.subscribeToSelectionChanges((selection) =>
      this.onSelectionChange(selection),
    );

    game.registerEventHandler((event) => this.onGameEvent(event));

    this.registerHeaderButtonHandlers();
  }

  private registerHeaderButtonHandlers() {
    for (const element of document.getElementsByClassName('header-button')) {
      const el = element as HTMLElement;

      el.addEventListener('transitionend', HeaderManager.onTransitionEnd);
      el.addEventListener('click', HeaderManager.onHeaderButtonClicked);
    }
  }

  private static onTransitionEnd(event: TransitionEvent) {
    const element = event.currentTarget as HTMLElement;

    element.classList.remove('mobile-active');
  }

  private static onHeaderButtonClicked(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;

    element.classList.add('mobile-active');
  }

  private onGameEvent(event: GameEvent) {
    if (event.isCanUndoEvent()) {
      this.setCanUndo(event.canUndo);
    }
  }

  private setHeaderClass(className: string, isSet: boolean) {
    if (isSet) {
      this.header.classList.add(className);
    } else {
      this.header.classList.remove(className);
    }
  }

  private onSelectionChange(selection: RSelectionState) {
    this.setCycling(selection.canCycle);
  }

  private setCycling(cycling: boolean) {
    this.setHeaderClass('cycling', cycling);
  }

  private setCanUndo(canUndo: boolean) {
    this.setHeaderClass('can-undo', canUndo);
  }

  private setMoving(moving: boolean) {
    this.setHeaderClass('moving', moving);
  }
}
