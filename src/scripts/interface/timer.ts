import { Elements } from 'interface/elements';

export class Timer {
  private static timerElement = Elements.findById('game-time');
  private static start: number;
  private static interval: number | null = null;

  public static restart() {
    if (Timer.interval !== null) {
      clearInterval(Timer.interval);
    }

    Timer.start = (Date.now() / 1000) | 0;
    Timer.interval = setInterval(Timer.update, 1000);
  }

  private static update() {
    const diff = ((Date.now() / 1000) | 0) - Timer.start;

    const minutes = (diff / 60) | 0;
    const spareSeconds = diff - minutes * 60;

    let timeString: string;

    if (spareSeconds < 10) {
      timeString = `${minutes}:0${spareSeconds}`;
    } else {
      timeString = `${minutes}:${spareSeconds}`;
    }

    Timer.timerElement.textContent = timeString;
  }
}
