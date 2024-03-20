/**
 * Sleeps in an async way.
 * ```
 *    await sleep(250); // sleeps 250ms
 * ```
 * 
 * Note: sleep(0) does nothing
 */
export function sleep(millis: number) {
    if (millis === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((r) => setTimeout(r, millis));
  }
  