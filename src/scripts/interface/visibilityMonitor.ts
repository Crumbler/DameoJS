import { Wake } from 'interface/wake';

export class VisibilityMonitor {
  public static register(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        Wake.tryStayAwake();
      }
    });
  }
}