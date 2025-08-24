/**
 * Advanced retry mechanisms with exponential backoff and circuit breaker patterns
 */

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: boolean;
  retryCondition?: (error: unknown) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T> | T,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    jitter = true,
    retryCondition = () => true,
    onRetry
  } = options;

  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await Promise.resolve(fn());
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error;
      }
      
      onRetry?.(error, attempt);
      
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );
      
      const finalDelay = jitter 
        ? delay * (0.5 + Math.random() * 0.5)
        : delay;
      
      await sleep(finalDelay);
    }
  }
  
  throw lastError;
}

/**
 * Circuit breaker pattern implementation
 */
export function createCircuitBreaker<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: CircuitBreakerOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  const {
    failureThreshold = 5,
    resetTimeout = 60000,
    monitoringPeriod = 60000
  } = options;
  
  let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  let failureCount = 0;
  let lastFailureTime = 0;
  let successCount = 0;
  
  const resetFailureCount = () => {
    failureCount = 0;
    successCount = 0;
  };
  
  return async (...args: TArgs): Promise<TReturn> => {
    const now = Date.now();
    
    // Check if we should reset the monitoring period
    if (now - lastFailureTime > monitoringPeriod) {
      resetFailureCount();
      if (state === 'OPEN') {
        state = 'CLOSED';
      }
    }
    
    // Circuit is open
    if (state === 'OPEN') {
      if (now - lastFailureTime < resetTimeout) {
        throw new Error('Circuit breaker is OPEN');
      }
      state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn(...args);
      
      // Success in any state
      if (state === 'HALF_OPEN') {
        successCount++;
        if (successCount >= 2) { // Require multiple successes to close
          state = 'CLOSED';
          resetFailureCount();
        }
      } else if (state === 'CLOSED') {
        resetFailureCount();
      }
      
      return result;
    } catch (error) {
      failureCount++;
      lastFailureTime = now;
      
      if (state === 'HALF_OPEN') {
        state = 'OPEN';
      } else if (state === 'CLOSED' && failureCount >= failureThreshold) {
        state = 'OPEN';
      }
      
      throw error;
    }
  };
}

/**
 * Retry with circuit breaker combination
 */
export function createResilientFunction<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  retryOptions: RetryOptions = {},
  circuitOptions: CircuitBreakerOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  const circuitBreaker = createCircuitBreaker(fn, circuitOptions);
  
  return async (...args: TArgs): Promise<TReturn> => {
    return retry(() => circuitBreaker(...args), retryOptions);
  };
}

/**
 * Simple sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
}
