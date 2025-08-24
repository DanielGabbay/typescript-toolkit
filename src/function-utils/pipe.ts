/**
 * Type-safe pipe function with full type inference
 * Allows chaining functions in a readable left-to-right manner
 */

export function pipe<T>(value: T): T;
export function pipe<T, R>(value: T, fn1: (arg: T) => R): R;
export function pipe<T, R1, R2>(
  value: T,
  fn1: (arg: T) => R1,
  fn2: (arg: R1) => R2
): R2;
export function pipe<T, R1, R2, R3>(
  value: T,
  fn1: (arg: T) => R1,
  fn2: (arg: R1) => R2,
  fn3: (arg: R2) => R3
): R3;
export function pipe<T, R1, R2, R3, R4>(
  value: T,
  fn1: (arg: T) => R1,
  fn2: (arg: R1) => R2,
  fn3: (arg: R2) => R3,
  fn4: (arg: R3) => R4
): R4;
export function pipe<T, R1, R2, R3, R4, R5>(
  value: T,
  fn1: (arg: T) => R1,
  fn2: (arg: R1) => R2,
  fn3: (arg: R2) => R3,
  fn4: (arg: R3) => R4,
  fn5: (arg: R4) => R5
): R5;
export function pipe<T, R1, R2, R3, R4, R5, R6>(
  value: T,
  fn1: (arg: T) => R1,
  fn2: (arg: R1) => R2,
  fn3: (arg: R2) => R3,
  fn4: (arg: R3) => R4,
  fn5: (arg: R4) => R5,
  fn6: (arg: R5) => R6
): R6;
export function pipe<T>(value: T, ...fns: Array<(arg: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value as unknown);
}

/**
 * Enhanced pipe function that supports async operations
 */
export async function pipeAsync<T>(value: T | Promise<T>): Promise<T>;
export async function pipeAsync<T, R>(
  value: T | Promise<T>,
  fn1: (arg: T) => R | Promise<R>
): Promise<R>;
export async function pipeAsync<T, R1, R2>(
  value: T | Promise<T>,
  fn1: (arg: T) => R1 | Promise<R1>,
  fn2: (arg: R1) => R2 | Promise<R2>
): Promise<R2>;
export async function pipeAsync<T, R1, R2, R3>(
  value: T | Promise<T>,
  fn1: (arg: T) => R1 | Promise<R1>,
  fn2: (arg: R1) => R2 | Promise<R2>,
  fn3: (arg: R2) => R3 | Promise<R3>
): Promise<R3>;
export async function pipeAsync<T>(
  value: T | Promise<T>,
  ...fns: Array<(arg: unknown) => unknown>
): Promise<unknown> {
  let result: unknown = await Promise.resolve(value);
  for (const fn of fns) {
    result = await Promise.resolve(fn(result));
  }
  return result;
}
