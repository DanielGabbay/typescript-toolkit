/**
 * String case conversion utilities
 */

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '')
    .replace(/[_-]/g, '');
}

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[_-]/g, '');
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert string to CONSTANT_CASE
 */
export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase();
}

/**
 * Convert string to Title Case
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}

/**
 * Convert string to Sentence case
 */
export function sentenceCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Toggle case of each character
 */
export function toggleCase(str: string): string {
  return str
    .split('')
    .map(char => char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase())
    .join('');
}

/**
 * Convert string to alternating case (aLtErNaTiNg)
 */
export function alternatingCase(str: string, startWithUpper = false): string {
  let shouldBeUpper = startWithUpper;
  return str
    .split('')
    .map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const result = shouldBeUpper ? char.toUpperCase() : char.toLowerCase();
        shouldBeUpper = !shouldBeUpper;
        return result;
      }
      return char;
    })
    .join('');
}

/**
 * Convert string to dot.case
 */
export function dotCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .replace(/[\s_-]+/g, '.')
    .toLowerCase();
}

/**
 * Convert string to path/case
 */
export function pathCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1/$2')
    .replace(/[\s_-]+/g, '/')
    .toLowerCase();
}

/**
 * Detect the case style of a string
 */
export type CaseStyle = 
  | 'camelCase'
  | 'PascalCase'
  | 'kebab-case'
  | 'snake_case'
  | 'CONSTANT_CASE'
  | 'Title Case'
  | 'lowercase'
  | 'UPPERCASE'
  | 'mixed'
  | 'unknown';

export function detectCase(str: string): CaseStyle {
  if (!str) return 'unknown';
  
  if (str === str.toLowerCase()) {
    if (str.includes('_')) return 'snake_case';
    if (str.includes('-')) return 'kebab-case';
    if (str.includes(' ')) return 'lowercase';
    return 'lowercase';
  }
  
  if (str === str.toUpperCase()) {
    if (str.includes('_')) return 'CONSTANT_CASE';
    return 'UPPERCASE';
  }
  
  if (/^[A-Z][a-z]/.test(str)) {
    if (/\s/.test(str) && str.split(' ').every(word => /^[A-Z][a-z]*$/.test(word))) {
      return 'Title Case';
    }
    if (!/[\s_-]/.test(str)) return 'PascalCase';
  }
  
  if (/^[a-z]/.test(str) && /[A-Z]/.test(str) && !/[\s_-]/.test(str)) {
    return 'camelCase';
  }
  
  if (str.includes('-') && str === str.toLowerCase()) {
    return 'kebab-case';
  }
  
  if (str.includes('_') && str === str.toLowerCase()) {
    return 'snake_case';
  }
  
  return 'mixed';
}