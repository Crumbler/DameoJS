/**
 * Input helper class
 */
export class Input {
  private static fullscreenIcon: HTMLElement =
    document.getElementById('fullscreen-button')!;

  public static registerOnFullscreen(action: () => void) {
    Input.fullscreenIcon.onclick = action;
  }
}
