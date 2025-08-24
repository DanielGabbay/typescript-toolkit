/**
 * String utility functions
 */

// Case conversion
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase())
    .replace(/\s+/g, '');
}

export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/[\s\-_]+/g, '');
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

// Formatting
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length - suffix.length) + suffix;
}

export function pad(str: string, length: number, char = ' '): string {
  const padLength = length - str.length;
  if (padLength <= 0) return str;
  
  const padStart = Math.floor(padLength / 2);
  const padEnd = padLength - padStart;
  
  return char.repeat(padStart) + str + char.repeat(padEnd);
}

export function padStart(str: string, length: number, char = ' '): string {
  const padLength = length - str.length;
  return padLength > 0 ? char.repeat(padLength) + str : str;
}

export function padEnd(str: string, length: number, char = ' '): string {
  const padLength = length - str.length;
  return padLength > 0 ? str + char.repeat(padLength) : str;
}

// Validation
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

// String manipulation
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  
  return str.replace(/[&<>"']/g, match => htmlEscapes[match]);
}

export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'"
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#x27);/g, match => htmlUnescapes[match]);
}