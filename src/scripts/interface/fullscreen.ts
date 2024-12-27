/**
 * Toggles fullscreen
 */
export class Fullscreen {
  public static toggle() {
    if (!document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement === null) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
