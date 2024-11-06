export class InterfaceResizer {
  private static mainContainer: HTMLElement =
    document.getElementById('main-container')!;

  public static register() {
    InterfaceResizer.resizeMainContainer();
    window.addEventListener('resize', InterfaceResizer.resizeMainContainer);
  }

  private static resizeMainContainer() {
    const baseHeight = window.innerHeight;
    let baseWidth = window.innerWidth;

    if (baseWidth > baseHeight) {
      baseWidth = Math.min(baseWidth, 600);
    }

    const aspectRatio = 10 / 11;

    const width = Math.min(baseWidth, baseHeight * aspectRatio);
    const height = Math.min(baseHeight, baseWidth / aspectRatio);

    const mainContainer = InterfaceResizer.mainContainer;

    mainContainer.style.width = width + 'px';
    mainContainer.style.height = height + 'px';
  }
}
