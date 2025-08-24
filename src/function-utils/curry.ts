/**
 * Advanced currying utilities with type safety
 */

// Define types for curried functions
export type Curried<TArgs extends readonly unknown[], TReturn> = 
  TArgs extends readonly [infer Head, ...infer Tail]
    ? Tail extends readonly []
      ? (arg: Head) => TReturn
      : (arg: Head) => Curried<Tail, TReturn>
    : () => TReturn;

/**
 * Curry a function with full type safety
 */
export function curry<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): Curried<TArgs, TReturn> {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...(args as unknown as TArgs));
    }
    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
  } as Curried<TArgs, TReturn>;
}

/**
 * Advanced curry with partial application support
 */
export function curryN<TArgs extends readonly unknown[], TReturn>(
  arity: number,
  fn: (...args: TArgs) => TReturn
): Curried<TArgs, TReturn> {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn(...(args as unknown as TArgs));
    }
    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
  } as Curried<TArgs, TReturn>;
}

/**
 * Right curry - curry from right to left
 */
export function curryRight<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: unknown[]) => unknown {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...(args.reverse() as unknown as TArgs));
    }
    return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
  };
}

/**
 * Partial application - apply some arguments and return a function for the rest
 */
export function partial<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  ...partialArgs: unknown[]
): (...remainingArgs: unknown[]) => TReturn {
  return (...remainingArgs: unknown[]) => 
    fn(...([...partialArgs, ...remainingArgs] as unknown as TArgs));
}

/**
 * Placeholder-based partial application
 */
export const _ = Symbol('partial-placeholder');

export function partialWith<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  ...argsWithPlaceholders: (unknown | typeof _)[]
): (...fillerArgs: unknown[]) => TReturn {
  return (...fillerArgs: unknown[]) => {
    const finalArgs: unknown[] = [];
    let fillerIndex = 0;
    
    for (const arg of argsWithPlaceholders) {
      if (arg === _) {
        finalArgs.push(fillerArgs[fillerIndex++]);
      } else {
        finalArgs.push(arg);
      }
    }
    
    // Add any remaining filler args
    while (fillerIndex < fillerArgs.length) {
      finalArgs.push(fillerArgs[fillerIndex++]);
    }
    
    return fn(...(finalArgs as unknown as TArgs));
  };
}

/**
 * Flip function arguments (reverse order)
 */
export function flip<A, B, R>(fn: (a: A, b: B) => R): (b: B, a: A) => R;
export function flip<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (c: C, b: B, a: A) => R;
export function flip(fn: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown {
  return (...args: unknown[]) => fn(...args.reverse());
}

/**
 * Unary - convert function to take only one argument
 */
export function unary<T, R>(fn: (arg: T, ...rest: unknown[]) => R): (arg: T) => R {
  return (arg: T) => fn(arg);
}

/**
 * Binary - convert function to take only two arguments
 */
export function binary<T1, T2, R>(fn: (arg1: T1, arg2: T2, ...rest: unknown[]) => R): (arg1: T1, arg2: T2) => R {
  return (arg1: T1, arg2: T2) => fn(arg1, arg2);
}

/**
 * N-ary - convert function to take only N arguments
 */
export function nAry<TArgs extends readonly unknown[], TReturn>(
  n: number,
  fn: (...args: TArgs) => TReturn
): (...args: unknown[]) => TReturn {
  return (...args: unknown[]) => fn(...(args.slice(0, n) as unknown as TArgs));
}
