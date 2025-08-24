/**
 * Advanced array partitioning utilities
 */

/**
 * Partition array based on a predicate
 */
export function partition<T, U extends T>(
  array: readonly T[],
  predicate: (item: T) => item is U
): [U[], Exclude<T, U>[]];
export function partition<T>(
  array: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]];
export function partition<T>(
  array: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
}

/**
 * Partition array into multiple groups based on predicates
 */
export function partitionMultiple<T>(
  array: readonly T[],
  ...predicates: Array<(item: T) => boolean>
): T[][] {
  const groups: T[][] = Array.from({ length: predicates.length + 1 }, () => []);
  
  for (const item of array) {
    let assigned = false;
    for (let i = 0; i < predicates.length; i++) {
      if (predicates[i](item)) {
        groups[i].push(item);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      groups[predicates.length].push(item); // remainder group
    }
  }
  
  return groups;
}

/**
 * Split array into head and tail
 */
export function headTail<T>(array: readonly T[]): [T | undefined, T[]] {
  if (array.length === 0) {
    return [undefined, []];
  }
  return [array[0], array.slice(1)];
}

/**
 * Split array into init and last
 */
export function initLast<T>(array: readonly T[]): [T[], T | undefined] {
  if (array.length === 0) {
    return [[], undefined];
  }
  return [array.slice(0, -1), array[array.length - 1]];
}

/**
 * Take elements from the beginning while predicate is true
 */
export function takeWhile<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) {
      break;
    }
    result.push(array[i]);
  }
  return result;
}

/**
 * Drop elements from the beginning while predicate is true
 */
export function dropWhile<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  let dropIndex = 0;
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) {
      break;
    }
    dropIndex = i + 1;
  }
  return array.slice(dropIndex);
}

/**
 * Take elements from the end while predicate is true
 */
export function takeRightWhile<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  const result: T[] = [];
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i], i)) {
      break;
    }
    result.unshift(array[i]);
  }
  return result;
}

/**
 * Drop elements from the end while predicate is true
 */
export function dropRightWhile<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  let dropCount = 0;
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i], i)) {
      break;
    }
    dropCount++;
  }
  return array.slice(0, array.length - dropCount);
}

/**
 * Take n elements from the beginning
 */
export function take<T>(array: readonly T[], n: number): T[] {
  return array.slice(0, Math.max(0, n));
}

/**
 * Drop n elements from the beginning
 */
export function drop<T>(array: readonly T[], n: number): T[] {
  return array.slice(Math.max(0, n));
}

/**
 * Take n elements from the end
 */
export function takeRight<T>(array: readonly T[], n: number): T[] {
  return n <= 0 ? [] : array.slice(-n);
}

/**
 * Drop n elements from the end
 */
export function dropRight<T>(array: readonly T[], n: number): T[] {
  return n <= 0 ? array.slice() : array.slice(0, -n);
}

/**
 * Split array at first element that matches predicate
 */
export function splitWhen<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      return [array.slice(0, i), array.slice(i)];
    }
  }
  return [array.slice(), []];
}

/**
 * Extract a sub-array between start and end indices (inclusive)
 */
export function extract<T>(array: readonly T[], start: number, end?: number): T[] {
  const actualEnd = end ?? array.length - 1;
  const normalizedStart = start < 0 ? array.length + start : start;
  const normalizedEnd = actualEnd < 0 ? array.length + actualEnd : actualEnd;
  
  return array.slice(
    Math.max(0, normalizedStart),
    Math.min(array.length, normalizedEnd + 1)
  );
}
