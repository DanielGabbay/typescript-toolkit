/**
 * Advanced grouping utilities for arrays
 */

/**
 * Group array elements by a key function
 */
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

/**
 * Group array elements by a key function into a Map
 */
export function groupByMap<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  
  for (const item of array) {
    const key = keyFn(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    const group = groups.get(key);
    if (group) {
      group.push(item);
    }
  }
  
  return groups;
}

/**
 * Group array elements by multiple key functions
 */
export function groupByMultiple<T>(
  array: readonly T[],
  ...keyFns: Array<(item: T) => PropertyKey>
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  
  for (const item of array) {
    const compositeKey = keyFns.map(fn => String(fn(item))).join('|');
    if (!groups.has(compositeKey)) {
      groups.set(compositeKey, []);
    }
    const group = groups.get(compositeKey);
    if (group) {
      group.push(item);
    }
  }
  
  return groups;
}

/**
 * Group consecutive elements by a key function
 */
export function groupConsecutiveBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Array<{ key: K; items: T[] }> {
  if (array.length === 0) return [];
  
  const groups: Array<{ key: K; items: T[] }> = [];
  let currentKey = keyFn(array[0]);
  let currentGroup: T[] = [array[0]];
  
  for (let i = 1; i < array.length; i++) {
    const item = array[i];
    const key = keyFn(item);
    
    if (key === currentKey) {
      currentGroup.push(item);
    } else {
      groups.push({ key: currentKey, items: currentGroup });
      currentKey = key;
      currentGroup = [item];
    }
  }
  
  groups.push({ key: currentKey, items: currentGroup });
  return groups;
}

/**
 * Index array elements by a key function (one-to-one mapping)
 */
export function indexBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const index = {} as Record<K, T>;
  
  for (const item of array) {
    const key = keyFn(item);
    index[key] = item;
  }
  
  return index;
}

/**
 * Index array elements by a key function into a Map
 */
export function indexByMap<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): Map<K, T> {
  const index = new Map<K, T>();
  
  for (const item of array) {
    const key = keyFn(item);
    index.set(key, item);
  }
  
  return index;
}

/**
 * Create a lookup table with arrays of values
 */
export function createLookup<T, K extends PropertyKey, V>(
  array: readonly T[],
  keyFn: (item: T) => K,
  valueFn: (item: T) => V
): Record<K, V[]> {
  const lookup = {} as Record<K, V[]>;
  
  for (const item of array) {
    const key = keyFn(item);
    const value = valueFn(item);
    
    if (!lookup[key]) {
      lookup[key] = [];
    }
    lookup[key].push(value);
  }
  
  return lookup;
}

/**
 * Group and transform in one step
 */
export function groupAndTransform<T, K extends PropertyKey, V>(
  array: readonly T[],
  keyFn: (item: T) => K,
  transformFn: (items: T[]) => V
): Record<K, V> {
  const groups = groupBy(array, keyFn);
  const transformed = {} as Record<K, V>;
  
  for (const key in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
      transformed[key] = transformFn(groups[key]);
    }
  }
  
  return transformed;
}

/**
 * Aggregate values by key
 */
export function aggregateBy<T, K extends PropertyKey, V>(
  array: readonly T[],
  keyFn: (item: T) => K,
  valueFn: (item: T) => V,
  aggregateFn: (values: V[]) => V
): Record<K, V> {
  return groupAndTransform(
    array,
    keyFn,
    items => aggregateFn(items.map(valueFn))
  );
}
