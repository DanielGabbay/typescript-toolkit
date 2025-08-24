/**
 * Advanced array flattening utilities
 */

/**
 * Flatten array by one level
 */
export function flatten<T>(array: readonly (T | readonly T[])[]): T[] {
  return array.flat(1) as T[];
}

/**
 * Deep flatten array (all levels)
 */
export function flattenDeep<T>(array: readonly unknown[]): T[] {
  return array.flat(Infinity) as T[];
}

/**
 * Flatten array to specified depth
 */
export function flattenDepth<T>(array: readonly unknown[], depth: number): T[] {
  return array.flat(depth) as T[];
}

/**
 * Flatten array by a key function
 */
export function flattenBy<T, U>(
  array: readonly T[],
  keyFn: (item: T) => readonly U[]
): U[] {
  return array.flatMap(keyFn);
}

/**
 * Flatten and filter in one step
 */
export function flattenFilter<T, U extends T>(
  array: readonly (T | readonly T[])[],
  predicate: (item: T) => item is U
): U[];
export function flattenFilter<T>(
  array: readonly (T | readonly T[])[],
  predicate: (item: T) => boolean
): T[];
export function flattenFilter<T>(
  array: readonly (T | readonly T[])[],
  predicate: (item: T) => boolean
): T[] {
  return flatten(array).filter(predicate);
}

/**
 * Flatten and map in one step
 */
export function flattenMap<T, U>(
  array: readonly (T | readonly T[])[],
  mapFn: (item: T) => U
): U[] {
  return flatten(array).map(mapFn);
}

/**
 * Zip arrays together
 */
export function zip<T, U>(arr1: readonly T[], arr2: readonly U[]): Array<[T, U]>;
export function zip<T, U, V>(arr1: readonly T[], arr2: readonly U[], arr3: readonly V[]): Array<[T, U, V]>;
export function zip<T>(...arrays: Array<readonly T[]>): T[][];
export function zip<T>(...arrays: Array<readonly T[]>): T[][] {
  if (arrays.length === 0) return [];
  
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  const result: T[][] = [];
  
  for (let i = 0; i < maxLength; i++) {
    const tuple: T[] = [];
    for (const array of arrays) {
      if (i < array.length) {
        tuple.push(array[i]);
      }
    }
    result.push(tuple);
  }
  
  return result;
}

/**
 * Zip arrays with a combiner function
 */
export function zipWith<T, U, R>(
  arr1: readonly T[],
  arr2: readonly U[],
  combiner: (a: T, b: U) => R
): R[] {
  const length = Math.min(arr1.length, arr2.length);
  const result: R[] = [];
  
  for (let i = 0; i < length; i++) {
    result.push(combiner(arr1[i], arr2[i]));
  }
  
  return result;
}

/**
 * Unzip array of tuples
 */
export function unzip<T, U>(array: readonly [T, U][]): [T[], U[]];
export function unzip<T, U, V>(array: readonly [T, U, V][]): [T[], U[], V[]];
export function unzip<T>(array: readonly T[][]): T[][];
export function unzip<T>(array: readonly T[][]): T[][] {
  if (array.length === 0) return [];
  
  const maxLength = Math.max(...array.map(tuple => tuple.length));
  const result: T[][] = [];
  
  for (let i = 0; i < maxLength; i++) {
    result[i] = [];
    for (const tuple of array) {
      if (i < tuple.length) {
        result[i].push(tuple[i]);
      }
    }
  }
  
  return result;
}

/**
 * Interleave multiple arrays
 */
export function interleave<T>(...arrays: Array<readonly T[]>): T[] {
  if (arrays.length === 0) return [];
  
  const result: T[] = [];
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  
  for (let i = 0; i < maxLength; i++) {
    for (const array of arrays) {
      if (i < array.length) {
        result.push(array[i]);
      }
    }
  }
  
  return result;
}

/**
 * Transpose 2D array (swap rows and columns)
 */
export function transpose<T>(matrix: readonly (readonly T[])[]): T[][] {
  if (matrix.length === 0) return [];
  
  const maxLength = Math.max(...matrix.map(row => row.length));
  const result: T[][] = [];
  
  for (let i = 0; i < maxLength; i++) {
    result[i] = [];
    for (const row of matrix) {
      if (i < row.length) {
        result[i].push(row[i]);
      }
    }
  }
  
  return result;
}
