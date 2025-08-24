/**
 * Advanced unique array utilities with multiple strategies
 */

/**
 * Remove duplicates from array using strict equality
 */
export function unique<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates by a key function
 */
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

/**
 * Remove duplicates using a custom equality function
 */
export function uniqueWith<T>(
  array: readonly T[],
  equalityFn: (a: T, b: T) => boolean
): T[] {
  return array.filter((item, index) => 
    !array.slice(0, index).some(prevItem => equalityFn(item, prevItem))
  );
}

/**
 * Get duplicate values in an array
 */
export function duplicates<T>(array: readonly T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();
  
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return [...duplicates];
}

/**
 * Get duplicate values by a key function
 */
export function duplicatesBy<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): T[] {
  const keyToItems = new Map<K, T[]>();
  
  // Group items by key
  for (const item of array) {
    const key = keyFn(item);
    if (!keyToItems.has(key)) {
      keyToItems.set(key, []);
    }
    const items = keyToItems.get(key);
    if (items) {
      items.push(item);
    }
  }
  
  // Return items that have duplicates
  return [...keyToItems.values()]
    .filter(items => items.length > 1)
    .flat();
}

/**
 * Count occurrences of each element
 */
export function countBy<T>(array: readonly T[]): Map<T, number>;
export function countBy<T, K>(array: readonly T[], keyFn: (item: T) => K): Map<K, number>;
export function countBy<T, K>(
  array: readonly T[],
  keyFn?: (item: T) => K
): Map<T | K, number> {
  const counts = new Map<T | K, number>();
  
  for (const item of array) {
    const key = keyFn ? keyFn(item) : item;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  
  return counts;
}

/**
 * Find the most frequent element(s)
 */
export function mostFrequent<T>(array: readonly T[]): T[] {
  if (array.length === 0) return [];
  
  const counts = countBy(array);
  const maxCount = Math.max(...counts.values());
  
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([item]) => item);
}

/**
 * Find the least frequent element(s)
 */
export function leastFrequent<T>(array: readonly T[]): T[] {
  if (array.length === 0) return [];
  
  const counts = countBy(array);
  const minCount = Math.min(...counts.values());
  
  return [...counts.entries()]
    .filter(([, count]) => count === minCount)
    .map(([item]) => item);
}
