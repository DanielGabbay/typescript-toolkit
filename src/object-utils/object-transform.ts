/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Object transformation utilities
 */

/**
 * Flatten object into dot-notation paths
 */
export function flattenObject(
  obj: Record<string, any>,
  separator = '.',
  prefix = ''
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], separator, newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

/**
 * Unflatten dot-notation object back to nested structure
 */
export function unflattenObject(
  obj: Record<string, any>,
  separator = '.'
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const keys = key.split(separator);
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in current) || typeof current[k] !== 'object') {
          current[k] = {};
        }
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = obj[key];
    }
  }
  
  return result;
}

/**
 * Convert object keys to camelCase
 */
export function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = camelizeKeys(obj[key]);
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Convert object keys to snake_case
 */
export function snakeCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeCaseKeys);
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        result[snakeKey] = snakeCaseKeys(obj[key]);
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Convert object keys to kebab-case
 */
export function kebabCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(kebabCaseKeys);
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const kebabKey = key
          .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
          .replace(/^-/, ''); // Remove leading dash
        result[kebabKey] = kebabCaseKeys(obj[key]);
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Convert object keys to PascalCase
 */
export function pascalCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(pascalCaseKeys);
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const pascalKey = key
          .replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase())
          .replace(/_/g, '');
        result[pascalKey] = pascalCaseKeys(obj[key]);
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Recursively remove null/undefined values
 */
export function compact(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(compact).filter(item => item != null);
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = compact(obj[key]);
        if (value != null) {
          result[key] = value;
        }
      }
    }
    
    return result;
  }
  
  return obj;
}

/**
 * Recursively remove empty objects and arrays
 */
export function removeEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    const filtered = obj.map(removeEmpty).filter(item => {
      if (item == null) return false;
      if (Array.isArray(item)) return item.length > 0;
      if (typeof item === 'object') return Object.keys(item).length > 0;
      return true;
    });
    return filtered.length > 0 ? filtered : undefined;
  }
  
  if (obj && typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = removeEmpty(obj[key]);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    }
    
    return Object.keys(result).length > 0 ? result : undefined;
  }
  
  return obj;
}

/**
 * Create object with specified default values for missing keys
 */
export function defaults<T extends Record<string, any>>(
  obj: Partial<T>,
  defaultValues: T
): T {
  const result = { ...defaultValues };
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      result[key] = obj[key] as T[typeof key];
    }
  }
  
  return result;
}

/**
 * Deep defaults (applies defaults recursively)
 */
export function defaultsDeep<T extends Record<string, any>>(
  obj: Partial<T>,
  defaultValues: T
): T {
  const result = { ...defaultValues };
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const objValue = obj[key];
      const defaultValue = result[key];
      
      if (objValue && defaultValue && 
          typeof objValue === 'object' && typeof defaultValue === 'object' &&
          !Array.isArray(objValue) && !Array.isArray(defaultValue)) {
        (result as any)[key] = defaultsDeep(objValue, defaultValue);
      } else if (objValue !== undefined) {
        (result as any)[key] = objValue;
      }
    }
  }
  
  return result;
}

/**
 * Transform object using mapping configuration
 */
export interface FieldMapping {
  from: string;
  to?: string;
  transform?: (value: any) => any;
}

export function transform<T = any>(obj: any, mappings: FieldMapping[]): T {
  const result: any = {};
  
  for (const mapping of mappings) {
    const { from, to = from, transform: transformFn } = mapping;
    
    if (from in obj) {
      const value = obj[from];
      result[to] = transformFn ? transformFn(value) : value;
    }
  }
  
  return result;
}