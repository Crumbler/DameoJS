import { GameInfo } from 'domain/game';
import { GameEvent } from 'domain/gameEvent';
import { Elements } from 'interface/elements';
import { Format } from 'misc/format';

/**
 * Timer class for setting the game time
 */
export class Timer {
  private static timerElement = Elements.findById('game-time');
  private static start: number;
  private static interval: number | null = null;

  /**
   * Restarts the timer
   */
  public static restart() {
    if (Timer.interval !== null) {
      clearInterval(Timer.interval);
    }

    Timer.start = (Date.now() / 1000) | 0;
    Timer.interval = window.setInterval(Timer.update, 1000);

    Timer.update();
  }

  private static update() {
    const diff = ((Date.now() / 1000) | 0) - Timer.start;

    const hours = (diff / 3600) | 0;
    const minutes = (diff / 60 - hours * 60) | 0;
    const seconds = diff - hours * 3600 - minutes * 60;

    let timeString: string;

    if (hours > 0) {
      timeString = `${hours}:${Format.addZeroForSingleDigit(minutes)}:${Format.addZeroForSingleDigit(seconds)}`;
    } else {
      timeString = `${minutes}:${Format.addZeroForSingleDigit(seconds)}`;
    }

    Timer.timerElement.textContent = timeString;
  }

  private static handleGameEvent(event: GameEvent) {
    if (!event.isGameResetEvent()) {
      return;
    }

    Timer.restart();
  }

  public static registerEventHandler(game: GameInfo) {
    game.registerEventHandler(Timer.handleGameEvent);
  }
}
