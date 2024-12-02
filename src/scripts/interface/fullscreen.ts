/**
 * Toggles fullscreen
 */
export class Fullscreen {
  public static toggle() {
    if (!document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement === null) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
