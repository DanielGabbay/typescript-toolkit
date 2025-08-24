/**
 * Compose functions from right to left with full type safety
 */

export function compose<T>(fn1: (arg: T) => T): (arg: T) => T;
export function compose<T, R1>(
  fn2: (arg: T) => R1,
  fn1: (arg: T) => T
): (arg: T) => R1;
export function compose<T, R1, R2>(
  fn3: (arg: R1) => R2,
  fn2: (arg: T) => R1,
  fn1: (arg: T) => T
): (arg: T) => R2;
export function compose<T, R1, R2, R3>(
  fn4: (arg: R2) => R3,
  fn3: (arg: R1) => R2,
  fn2: (arg: T) => R1,
  fn1: (arg: T) => T
): (arg: T) => R3;
export function compose<T, R1, R2, R3, R4>(
  fn5: (arg: R3) => R4,
  fn4: (arg: R2) => R3,
  fn3: (arg: R1) => R2,
  fn2: (arg: T) => R1,
  fn1: (arg: T) => T
): (arg: T) => R4;
export function compose(...fns: Array<(arg: unknown) => unknown>) {
  return (arg: unknown) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * Type-safe function composition with error handling
 */
export function safeCompose<T>(
  ...fns: Array<(arg: unknown) => unknown>
): (arg: T) => T | Error {
  return (arg: T) => {
    try {
      return fns.reduceRight((acc, fn) => fn(acc), arg as unknown) as T;
    } catch (error) {
      return error instanceof Error ? error : new Error(String(error));
    }
  };
}
