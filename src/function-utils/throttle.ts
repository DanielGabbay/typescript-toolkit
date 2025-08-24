/**
 * Advanced throttle function with comprehensive options
 */

interface ThrottleOptions {
  leading?: boolean;  // Execute on leading edge (default: true)
  trailing?: boolean; // Execute on trailing edge (default: true)
}

export function throttle<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  wait: number,
  options: ThrottleOptions = {}
): {
  (...args: TArgs): TReturn | undefined;
  cancel: () => void;
  flush: () => TReturn | undefined;
} {
  const { leading = true, trailing = true } = options;
  
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: TArgs | undefined;
  let result: TReturn | undefined;
  let timerId: NodeJS.Timeout | undefined;

  function invokeFunc(time: number): TReturn {
    const args = lastArgs;
    if (!args) {
      throw new Error('No arguments available for invocation');
    }
    lastArgs = undefined;
    lastInvokeTime = time;
    result = fn(...args);
    return result;
  }

  function leadingEdge(time: number): TReturn | undefined {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastInvoke;

    return Math.min(timeSinceLastCall, timeWaiting);
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
    );
  }

  function timerExpired(): TReturn | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
    return result;
  }

  function trailingEdge(time: number): TReturn | undefined {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
  }

  function flush(): TReturn | undefined {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function throttled(...args: TArgs): TReturn | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  throttled.cancel = cancel;
  throttled.flush = flush;

  return throttled;
}

/**
 * Simple throttle without RAF for universal compatibility
 */
export function throttleSimple<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 16 // ~60fps
): {
  (...args: TArgs): void;
  cancel: () => void;
} {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: TArgs | null = null;

  function throttled(...args: TArgs): void {
    lastArgs = args;
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
        timeoutId = null;
      }, delay);
    }
  }

  function cancel(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  }

  throttled.cancel = cancel;
  return throttled;
}
