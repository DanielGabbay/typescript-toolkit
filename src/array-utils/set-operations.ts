/**
 * Set operations for arrays
 */

/**
 * Union of two or more arrays (removes duplicates)
 */
export function union<T>(...arrays: readonly (readonly T[])[]): T[] {
  return [...new Set(arrays.flat())];
}

/**
 * Intersection of two or more arrays
 */
export function intersection<T>(...arrays: readonly (readonly T[])[]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]];
  
  const [first, ...rest] = arrays;
  return first.filter(item => 
    rest.every(array => array.includes(item))
  );
}

/**
 * Difference between first array and all other arrays
 */
export function difference<T>(first: readonly T[], ...others: readonly (readonly T[])[]): T[] {
  const otherItems = new Set(others.flat());
  return first.filter(item => !otherItems.has(item));
}

/**
 * Symmetric difference (items that exist in only one array)
 */
export function symmetricDifference<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  return [
    ...arr1.filter(item => !set2.has(item)),
    ...arr2.filter(item => !set1.has(item))
  ];
}

/**
 * Check if two arrays are equal (same elements in same order)
 */
export function isEqual<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Check if two arrays have same elements (order doesn't matter)
 */
export function isEqualSet<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return set1.size === set2.size && [...set1].every(item => set2.has(item));
}

/**
 * Check if first array is subset of second
 */
export function isSubset<T>(subset: readonly T[], superset: readonly T[]): boolean {
  const superSet = new Set(superset);
  return subset.every(item => superSet.has(item));
}

/**
 * Check if first array is superset of second
 */
export function isSuperset<T>(superset: readonly T[], subset: readonly T[]): boolean {
  return isSubset(subset, superset);
}

/**
 * Check if arrays are disjoint (have no common elements)
 */
export function isDisjoint<T>(arr1: readonly T[], arr2: readonly T[]): boolean {
  const set1 = new Set(arr1);
  return !arr2.some(item => set1.has(item));
}

/**
 * Cartesian product of two arrays
 */
export function cartesianProduct<T, U>(arr1: readonly T[], arr2: readonly U[]): Array<[T, U]> {
  const result: Array<[T, U]> = [];
  for (const item1 of arr1) {
    for (const item2 of arr2) {
      result.push([item1, item2]);
    }
  }
  return result;
}

/**
 * Power set (all possible subsets)
 */
export function powerSet<T>(array: readonly T[]): T[][] {
  const result: T[][] = [[]];
  
  for (const item of array) {
    const newSubsets: T[][] = [];
    for (const subset of result) {
      newSubsets.push([...subset, item]);
    }
    result.push(...newSubsets);
  }
  
  return result;
}

/**
 * Get all permutations of an array
 */
export function permutations<T>(array: readonly T[]): T[][] {
  if (array.length <= 1) return [array.slice()];
  
  const result: T[][] = [];
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const remaining = [...array.slice(0, i), ...array.slice(i + 1)];
    const perms = permutations(remaining);
    
    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }
  
  return result;
}

/**
 * Get all combinations of k elements from array
 */
export function combinations<T>(array: readonly T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > array.length) return [];
  if (k === array.length) return [array.slice()];
  
  const result: T[][] = [];
  const [first, ...rest] = array;
  
  // Include first element
  const withFirst = combinations(rest, k - 1);
  for (const combo of withFirst) {
    result.push([first, ...combo]);
  }
  
  // Exclude first element
  const withoutFirst = combinations(rest, k);
  result.push(...withoutFirst);
  
  return result;
}