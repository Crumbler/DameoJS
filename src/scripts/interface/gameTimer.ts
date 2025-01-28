import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Elements } from 'interface/elements';
import { Format } from 'misc/format';

/**
 * Timer class for setting the game time
 */
export class GameTimer {
  private static timerElement = Elements.findById('game-time');
  private static initialTime: number | null = null;
  public static start: number;
  private static interval: number | null = null;

  /**
   * Restarts the timer
   */
  public static restart() {
    if (GameTimer.interval !== null) {
      clearInterval(GameTimer.interval);
    }

    if (this.initialTime === null) {
      GameTimer.start = (Date.now() / 1000) | 0;
    } else {
      GameTimer.start = this.initialTime;
    }
    GameTimer.interval = window.setInterval(GameTimer.update, 1000);

    GameTimer.update();
  }

  public static setInitialTime(initialTime: number) {
    GameTimer.initialTime = initialTime;
  }

  private static update() {
    const diff = ((Date.now() / 1000) | 0) - GameTimer.start;

    const hours = (diff / 3600) | 0;
    const minutes = (diff / 60 - hours * 60) | 0;
    const seconds = diff - hours * 3600 - minutes * 60;

    let timeString: string;

    if (hours > 0) {
      timeString = `${hours}:${Format.addZeroForSingleDigit(minutes)}:${Format.addZeroForSingleDigit(seconds)}`;
    } else {
      timeString = `${minutes}:${Format.addZeroForSingleDigit(seconds)}`;
    }

    GameTimer.timerElement.textContent = timeString;
  }

  private static handleGameEvent(event: GameEvent) {
    if (!event.isGameResetEvent()) {
      return;
    }

    GameTimer.restart();

    GameTimer.initialTime = null;
  }

  public static registerEventHandler(game: GameInfo) {
    game.registerEventHandler(GameTimer.handleGameEvent);
  }
}
