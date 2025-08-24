/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Property manipulation utilities
 */

/**
 * Pick specified properties from object
 */
export function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in (obj as object)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specified properties from object
 */
export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const keySet = new Set(keys);
  const result = {} as Omit<T, K>;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !keySet.has(key as any)) {
      (result as any)[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * Pluck values from array of objects by key
 */
export function pluck<T, K extends keyof T>(array: readonly T[], key: K): T[K][] {
  return array.map(obj => obj[key]);
}

/**
 * Transform object by applying function to each value
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  mapper: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = mapper(obj[key], key);
    }
  }
  
  return result;
}

/**
 * Transform object by applying function to each key
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  mapper: (key: string, value: T) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = mapper(key, obj[key]);
      result[newKey] = obj[key];
    }
  }
  
  return result;
}

/**
 * Get all paths in an object
 */
export function getAllPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      paths.push(path);
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        paths.push(...getAllPaths(obj[key], path));
      }
    }
  }
  
  return paths;
}

/**
 * Create object from array with key and value extractors
 */
export function keyBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>;
  
  for (const item of array) {
    const key = keyFn(item);
    result[key] = item;
  }
  
  return result;
}

/**
 * Invert object (swap keys and values)
 */
export function invert<T extends PropertyKey>(
  obj: Record<string, T>
): Record<T, string> {
  const result = {} as Record<T, string>;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key]] = key;
    }
  }
  
  return result;
}

/**
 * Group object properties by predicate
 */
export function groupProperties<T>(
  obj: Record<string, T>,
  predicate: (key: string, value: T) => boolean
): [Record<string, T>, Record<string, T>] {
  const truthy: Record<string, T> = {};
  const falsy: Record<string, T> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (predicate(key, obj[key])) {
        truthy[key] = obj[key];
      } else {
        falsy[key] = obj[key];
      }
    }
  }
  
  return [truthy, falsy];
}

/**
 * Merge objects with custom merge function
 */
export function mergeWith<T>(
  target: Record<string, T>,
  source: Record<string, T>,
  mergeFn: (targetValue: T, sourceValue: T, key: string) => T
): Record<string, T> {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (key in result) {
        result[key] = mergeFn(result[key], source[key], key);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Filter object properties
 */
export function filterProperties<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (predicate(obj[key], key)) {
        result[key] = obj[key];
      }
    }
  }
  
  return result;
}