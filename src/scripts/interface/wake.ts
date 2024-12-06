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
    try {
      Wake._wakeLock = await navigator.wakeLock.request('screen');
    }
    catch (err) {
      const e = err as Error;
      console.log(`Failed to request WakeLock: ${e.name}, ${e.message}`);
      return;
    }

    console.log('WakeLock acquired');
    Wake._wakeLock.onrelease = Wake.tryAcquireWakeLock;
  }
}