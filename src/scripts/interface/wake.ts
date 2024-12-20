export class Wake {
  private static _wakeLock: WakeLockSentinel | null = null;

  public static async tryStayAwake() {
    const supportsWakeLock = 'wakeLock' in navigator;
    if (!supportsWakeLock) {
      console.log('WakeLock not supported');
      return;
    }

    Wake.tryAcquireWakeLock();
  }

  private static async tryAcquireWakeLock() {
    if (Wake._wakeLock !== null || document.visibilityState === 'hidden') {
      return;
    }

    try {
      Wake._wakeLock = await navigator.wakeLock.request('screen');
    }
    catch (err) {
      const e = err as Error;
      console.error(`Failed to request WakeLock\nError: ${e.name}\n${e.message}`);
      return;
    }

    console.log('WakeLock acquired');

    Wake._wakeLock.onrelease = () => {
      if (Wake._wakeLock !== null) {
        Wake._wakeLock = null;
      }

      Wake.tryAcquireWakeLock();
    };
  }
}