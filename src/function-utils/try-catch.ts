/**
 * Safe function execution with comprehensive error handling
 */

export type SafeResult<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: Error };

export type SafeAsyncResult<T> = Promise<SafeResult<T>>;

/**
 * Safely execute a function and return a result object instead of throwing
 */
export function tryCatch<T>(fn: () => T): SafeResult<T> {
  try {
    const data = fn();
    return { success: true, data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Safely execute an async function
 */
export async function tryCatchAsync<T>(fn: () => Promise<T>): SafeAsyncResult<T> {
  try {
    const data = await fn();
    return { success: true, data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Create a safe version of a function that never throws
 */
export function makeSafe<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => SafeResult<TReturn> {
  return (...args: TArgs) => tryCatch(() => fn(...args));
}

/**
 * Create a safe version of an async function that never throws
 */
export function makeSafeAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => SafeAsyncResult<TReturn> {
  return (...args: TArgs) => tryCatchAsync(() => fn(...args));
}

/**
 * Execute multiple functions safely and collect all results
 */
export function tryCatchAll<T extends readonly (() => unknown)[]>(
  ...fns: T
): { [K in keyof T]: T[K] extends () => infer R ? SafeResult<R> : never } {
  return fns.map(fn => tryCatch(fn)) as {
    [K in keyof T]: T[K] extends () => infer R ? SafeResult<R> : never
  };
}

/**
 * Execute multiple async functions safely and collect all results
 */
export async function tryCatchAllAsync<T extends readonly (() => Promise<unknown>)[]>(
  ...fns: T
): Promise<{ [K in keyof T]: T[K] extends () => Promise<infer R> ? SafeResult<R> : never }> {
  const results = await Promise.all(fns.map(fn => tryCatchAsync(fn)));
  return results as {
    [K in keyof T]: T[K] extends () => Promise<infer R> ? SafeResult<R> : never
  };
}

/**
 * Type guard to check if a safe result is successful
 */
export function isSuccess<T>(result: SafeResult<T>): result is { success: true; data: T; error: null } {
  return result.success;
}

/**
 * Type guard to check if a safe result is an error
 */
export function isError<T>(result: SafeResult<T>): result is { success: false; data: null; error: Error } {
  return !result.success;
}

/**
 * Extract data from a safe result or throw the error
 */
export function unwrap<T>(result: SafeResult<T>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Extract data from a safe result or return a default value
 */
export function unwrapOr<T, D>(result: SafeResult<T>, defaultValue: D): T | D {
  return result.success ? result.data : defaultValue;
}

/**
 * Chain safe operations using a monadic pattern
 */
export function chain<T, U>(
  result: SafeResult<T>,
  fn: (data: T) => SafeResult<U>
): SafeResult<U> {
  if (result.success) {
    return fn(result.data);
  }
  return { success: false, data: null, error: result.error };
}

/**
 * Map over successful safe results
 */
export function mapResult<T, U>(
  result: SafeResult<T>,
  fn: (data: T) => U
): SafeResult<U> {
  if (result.success) {
    return tryCatch(() => fn(result.data));
  }
  return { success: false, data: null, error: result.error };
}
