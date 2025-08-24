/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Path-based object operations
 */

type Path = string | (string | number)[];
type PathKey = string | number;

/**
 * Parse string path to array of keys
 */
function parsePath(path: Path): PathKey[] {
  if (Array.isArray(path)) return path;
  
  // Handle array notation and dot notation
  return path
    .replace(/\[(\d+)\]/g, '.$1') // Convert [0] to .0
    .split('.')
    .filter(key => key !== '')
    .map(key => /^\d+$/.test(key) ? parseInt(key, 10) : key);
}

/**
 * Get value at path in object
 */
export function get<T = any>(obj: any, path: Path, defaultValue?: T): T {
  if (!obj || typeof obj !== 'object') return defaultValue as T;
  
  const keys = parsePath(path);
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue as T;
    }
    current = current[key];
  }
  
  return current === undefined ? defaultValue as T : current;
}

/**
 * Set value at path in object (mutates object)
 */
export function set<T extends object>(obj: T, path: Path, value: any): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const keys = parsePath(path);
  let current: any = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = typeof nextKey === 'number' ? [] : {};
    }
    
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Check if path exists in object
 */
export function has(obj: any, path: Path): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  const keys = parsePath(path);
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * Delete property at path (mutates object)
 */
export function unset<T extends object>(obj: T, path: Path): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  const keys = parsePath(path);
  if (keys.length === 0) return false;
  
  let current: any = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      return false;
    }
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1];
  if (lastKey in current) {
    if (Array.isArray(current) && typeof lastKey === 'number') {
      current.splice(lastKey, 1);
    } else {
      delete current[lastKey];
    }
    return true;
  }
  
  return false;
}

/**
 * Set value at path immutably (returns new object)
 */
export function setImmutable<T>(obj: T, path: Path, value: any): T {
  const cloned = structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
  return set(cloned, path, value);
}

/**
 * Update value at path using function
 */
export function update<T extends object>(
  obj: T,
  path: Path,
  updater: (value: any) => any
): T {
  const currentValue = get(obj, path);
  const newValue = updater(currentValue);
  return set(obj, path, newValue);
}

/**
 * Update value at path immutably
 */
export function updateImmutable<T>(
  obj: T,
  path: Path,
  updater: (value: any) => any
): T {
  const cloned = structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
  return update(cloned, path, updater);
}

/**
 * Get multiple values at different paths
 */
export function at<T = any>(obj: any, paths: readonly Path[]): T[] {
  return paths.map(path => get(obj, path));
}

/**
 * Set multiple values at different paths
 */
export function setMultiple<T extends object>(
  obj: T,
  pathValues: Record<string, any>
): T {
  for (const [path, value] of Object.entries(pathValues)) {
    set(obj, path, value);
  }
  return obj;
}

/**
 * Transform values at matching paths
 */
export function transformAt<T extends object>(
  obj: T,
  pathPattern: RegExp | string,
  transformer: (value: any, path: string) => any
): T {
  const pattern = typeof pathPattern === 'string' 
    ? new RegExp(pathPattern.replace(/\./g, '\\.').replace(/\*/g, '.*'))
    : pathPattern;
  
  function transformRecursive(current: any, currentPath = ''): any {
    if (current && typeof current === 'object') {
      if (Array.isArray(current)) {
        return current.map((item, index) => {
          const itemPath = `${currentPath}[${index}]`;
          return pattern.test(itemPath) 
            ? transformer(item, itemPath)
            : transformRecursive(item, itemPath);
        });
      } else {
        const result: any = {};
        for (const key in current) {
          if (Object.prototype.hasOwnProperty.call(current, key)) {
            const keyPath = currentPath ? `${currentPath}.${key}` : key;
            result[key] = pattern.test(keyPath)
              ? transformer(current[key], keyPath)
              : transformRecursive(current[key], keyPath);
          }
        }
        return result;
      }
    }
    return current;
  }
  
  return transformRecursive(obj);
}