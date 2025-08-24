/**
 * Array utility functions
 */

// Chunk utilities
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Unique utilities
export function unique<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

export function uniqueBy<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Group utilities
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  
  for (const item of array) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  
  return groups;
}

// Flatten utilities
export function flatten<T>(array: readonly (T | readonly T[])[]): T[] {
  return array.flat() as T[];
}

export function flattenDeep<T>(array: readonly unknown[]): T[] {
  return array.flat(Infinity) as T[];
}

// Partition utilities
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (predicate(item, i)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
}

// Set operations
export function union<T>(...arrays: readonly (readonly T[])[]): T[] {
  return [...new Set(arrays.flat())];
}

export function intersection<T>(...arrays: readonly (readonly T[])[]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]];
  
  const [first, ...rest] = arrays;
  return first.filter(item => 
    rest.every(array => array.includes(item))
  );
}

export function difference<T>(first: readonly T[], ...others: readonly (readonly T[])[]): T[] {
  const otherItems = new Set(others.flat());
  return first.filter(item => !otherItems.has(item));
}

// Statistical functions
export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function mean(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN;
  return sum(numbers) / numbers.length;
}

export function median(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN;
  
  const sorted = numbers.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Search and sort
export function binarySearch<T>(
  array: readonly T[],
  target: T,
  compareFn?: (a: T, b: T) => number
): number {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compare(array[mid], target);
    
    if (comparison === 0) return mid;
    if (comparison < 0) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

export function sortBy<T>(
  array: readonly T[],
  ...keyFns: Array<(item: T) => unknown>
): T[] {
  return array.slice().sort((a, b) => {
    for (const keyFn of keyFns) {
      const keyA = keyFn(a);
      const keyB = keyFn(b);
      
      if ((keyA as any) < (keyB as any)) return -1;
      if ((keyA as any) > (keyB as any)) return 1;
    }
    return 0;
  });
}

// Advanced flatten
export function flattenDepth<T>(array: readonly unknown[], depth: number): T[] {
  return array.flat(depth) as T[];
}

export function zip<T, U>(arr1: readonly T[], arr2: readonly U[]): Array<[T, U]>;
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