/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Advanced search and sort utilities for arrays
 */

/**
 * Binary search - find index of element in sorted array
 */
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

/**
 * Binary search - find insertion point for element in sorted array
 */
export function binarySearchInsertionPoint<T>(
  array: readonly T[],
  target: T,
  compareFn?: (a: T, b: T) => number
): number {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  
  let left = 0;
  let right = array.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compare(array[mid], target);
    
    if (comparison < 0) left = mid + 1;
    else right = mid;
  }
  
  return left;
}

/**
 * Linear search with predicate function
 */
export function findIndex<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean,
  startIndex = 0
): number {
  for (let i = startIndex; i < array.length; i++) {
    if (predicate(array[i], i)) return i;
  }
  return -1;
}

/**
 * Linear search from the end
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean,
  startIndex = array.length - 1
): number {
  for (let i = startIndex; i >= 0; i--) {
    if (predicate(array[i], i)) return i;
  }
  return -1;
}

/**
 * Find all indices matching predicate
 */
export function findAllIndices<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): number[] {
  const indices: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) indices.push(i);
  }
  return indices;
}

/**
 * Stable sort with custom comparison
 */
export function stableSort<T>(
  array: readonly T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const indexed = array.map((item, index) => ({ item, index }));
  
  indexed.sort((a, b) => {
    const comparison = compareFn(a.item, b.item);
    return comparison !== 0 ? comparison : a.index - b.index;
  });
  
  return indexed.map(({ item }) => item);
}

/**
 * Multi-key sorting
 */
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

/**
 * Sort with multiple criteria and directions
 */
export interface SortCriterion<T> {
  keyFn: (item: T) => unknown;
  direction?: 'asc' | 'desc';
}

export function sortByCriteria<T>(
  array: readonly T[],
  criteria: readonly SortCriterion<T>[]
): T[] {
  return array.slice().sort((a, b) => {
    for (const { keyFn, direction = 'asc' } of criteria) {
      const keyA = keyFn(a);
      const keyB = keyFn(b);
      
      let comparison = 0;
      if ((keyA as any) < (keyB as any)) comparison = -1;
      else if ((keyA as any) > (keyB as any)) comparison = 1;
      
      if (comparison !== 0) {
        return direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
}

/**
 * Top K elements (using quickselect algorithm)
 */
export function topK<T>(
  array: readonly T[],
  k: number,
  compareFn?: (a: T, b: T) => number
): T[] {
  if (k >= array.length) return array.slice().sort(compareFn);
  if (k <= 0) return [];
  
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const arr = array.slice();
  
  function quickSelect(left: number, right: number, k: number): void {
    if (left >= right) return;
    
    const pivotIndex = partition(arr, left, right, compare);
    
    if (pivotIndex === k) return;
    if (pivotIndex < k) quickSelect(pivotIndex + 1, right, k);
    else quickSelect(left, pivotIndex - 1, k);
  }
  
  quickSelect(0, arr.length - 1, k);
  return arr.slice(0, k).sort((a, b) => -compare(a, b)); // Reverse for top K
}

function partition<T>(
  array: T[],
  left: number,
  right: number,
  compare: (a: T, b: T) => number
): number {
  const pivot = array[right];
  let i = left;
  
  for (let j = left; j < right; j++) {
    if (compare(array[j], pivot) > 0) { // Greater than pivot (for top K)
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }
  
  [array[i], array[right]] = [array[right], array[i]];
  return i;
}

/**
 * Find K-th smallest/largest element
 */
export function kthElement<T>(
  array: readonly T[],
  k: number,
  compareFn?: (a: T, b: T) => number
): T | undefined {
  if (k < 1 || k > array.length) return undefined;
  
  const sorted = array.slice().sort(compareFn);
  return sorted[k - 1];
}

/**
 * Is array sorted?
 */
export function isSorted<T>(
  array: readonly T[],
  compareFn?: (a: T, b: T) => number
): boolean {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  
  for (let i = 1; i < array.length; i++) {
    if (compare(array[i - 1], array[i]) > 0) return false;
  }
  return true;
}

/**
 * Merge two sorted arrays
 */
export function mergeSorted<T>(
  arr1: readonly T[],
  arr2: readonly T[],
  compareFn?: (a: T, b: T) => number
): T[] {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const result: T[] = [];
  let i = 0, j = 0;
  
  while (i < arr1.length && j < arr2.length) {
    if (compare(arr1[i], arr2[j]) <= 0) {
      result.push(arr1[i++]);
    } else {
      result.push(arr2[j++]);
    }
  }
  
  result.push(...arr1.slice(i), ...arr2.slice(j));
  return result;
}

/**
 * Insertion sort (efficient for small arrays)
 */
export function insertionSort<T>(
  array: readonly T[],
  compareFn?: (a: T, b: T) => number
): T[] {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const result = array.slice();
  
  for (let i = 1; i < result.length; i++) {
    const current = result[i];
    let j = i - 1;
    
    while (j >= 0 && compare(result[j], current) > 0) {
      result[j + 1] = result[j];
      j--;
    }
    
    result[j + 1] = current;
  }
  
  return result;
}