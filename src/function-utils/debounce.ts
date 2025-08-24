/**
 * Advanced debounce with configurable options
 */

interface DebounceOptions {
  leading?: boolean;  // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge (default)
  maxWait?: number;   // Maximum time to wait
}

export function debounce<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay: number,
  options: DebounceOptions = {}
): {
  (...args: TArgs): void;
  cancel: () => void;
  flush: () => TReturn | undefined;
  pending: () => boolean;
} {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeoutId: NodeJS.Timeout | null = null;
  let maxTimeoutId: NodeJS.Timeout | null = null;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: TArgs | undefined;
  let result: TReturn | undefined;

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
    timeoutId = setTimeout(timerExpired, delay);
    
    if (maxWait !== undefined) {
      maxTimeoutId = setTimeout(maxDelayExpired, maxWait);
    }
    
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): TReturn | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
    return result;
  }

  function maxDelayExpired(): TReturn | undefined {
    if (trailing && lastArgs) {
      return trailingEdge(Date.now());
    }
    cancel();
    return result;
  }

  function trailingEdge(time: number): TReturn | undefined {
    timeoutId = null;
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = null;
    }

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = null;
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
  }

  function flush(): TReturn | undefined {
    return timeoutId === null ? result : trailingEdge(Date.now());
  }

  function pending(): boolean {
    return timeoutId !== null;
  }

  function debounced(...args: TArgs): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        leadingEdge(lastCallTime);
        return;
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, delay);
        if (!maxTimeoutId) {
          maxTimeoutId = setTimeout(maxDelayExpired, maxWait);
        }
        if (leading) {
          invokeFunc(lastCallTime);
        }
        return;
      }
    }
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay);
    }
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}
