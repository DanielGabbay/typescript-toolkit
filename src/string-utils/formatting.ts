/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * String formatting utilities
 */

/**
 * Template string with placeholder replacement
 */
export function template(
  str: string,
  values: Record<string, any>,
  options: { placeholder?: RegExp; escape?: boolean } = {}
): string {
  const { placeholder = /\{\{(\w+)\}\}/g, escape = false } = options;
  
  return str.replace(placeholder, (match, key) => {
    const value = values[key];
    if (value === undefined || value === null) return match;
    
    const stringValue = String(value);
    return escape ? escapeHtml(stringValue) : stringValue;
  });
}

/**
 * String interpolation with expressions
 */
export function interpolate(str: string, context: Record<string, any>): string {
  return str.replace(/\$\{([^}]+)\}/g, (match, expr) => {
    try {
      // Simple variable access only - no eval for security
      const keys = expr.trim().split('.');
      let value: any = context;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return match;
        }
      }
      
      return String(value);
    } catch {
      return match;
    }
  });
}

/**
 * Pad string to specified length at start
 */
export function padStart(str: string, length: number, fillString = ' '): string {
  if (str.length >= length) return str;
  
  const fillLength = length - str.length;
  const fill = fillString.repeat(Math.ceil(fillLength / fillString.length));
  
  return fill.slice(0, fillLength) + str;
}

/**
 * Pad string to specified length at end
 */
export function padEnd(str: string, length: number, fillString = ' '): string {
  if (str.length >= length) return str;
  
  const fillLength = length - str.length;
  const fill = fillString.repeat(Math.ceil(fillLength / fillString.length));
  
  return str + fill.slice(0, fillLength);
}

/**
 * Pad string to specified length on both sides
 */
export function padBoth(str: string, length: number, fillString = ' '): string {
  if (str.length >= length) return str;
  
  const totalPadding = length - str.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  
  const leftFill = fillString.repeat(Math.ceil(leftPadding / fillString.length));
  const rightFill = fillString.repeat(Math.ceil(rightPadding / fillString.length));
  
  return leftFill.slice(0, leftPadding) + str + rightFill.slice(0, rightPadding);
}

/**
 * Truncate string to specified length
 */
export function truncate(
  str: string,
  length: number,
  options: { omission?: string; separator?: RegExp | string } = {}
): string {
  const { omission = '...', separator } = options;
  
  if (str.length <= length) return str;
  
  const truncateLength = length - omission.length;
  if (truncateLength <= 0) return omission;
  
  let truncated = str.slice(0, truncateLength);
  
  if (separator) {
    const lastIndex = truncated.search(separator);
    if (lastIndex > 0) {
      truncated = truncated.slice(0, lastIndex);
    }
  }
  
  return truncated + omission;
}

/**
 * Word wrap text to specified width
 */
export function wordWrap(
  str: string,
  width: number,
  options: { break?: boolean; cut?: boolean } = {}
): string {
  const { break: breakLongWords = false, cut = false } = options;
  
  if (!str) return str;
  
  const lines: string[] = [];
  const words = str.split(/\s+/);
  let currentLine = '';
  
  for (const word of words) {
    if (!currentLine) {
      if (word.length <= width) {
        currentLine = word;
      } else if (breakLongWords || cut) {
        lines.push(word.slice(0, width));
        let remaining = word.slice(width);
        while (remaining.length > width) {
          lines.push(remaining.slice(0, width));
          remaining = remaining.slice(width);
        }
        currentLine = remaining;
      } else {
        currentLine = word;
      }
    } else if ((currentLine + ' ' + word).length <= width) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word.length <= width ? word : (breakLongWords ? word.slice(0, width) : word);
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.join('\n');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'"
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#x27|#x2F|#39);/g, entity => htmlUnescapes[entity]);
}

/**
 * Escape regex special characters
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format number with separators
 */
export function formatNumber(
  num: number,
  options: {
    decimals?: number;
    decimalSeparator?: string;
    thousandsSeparator?: string;
  } = {}
): string {
  const { decimals = 2, decimalSeparator = '.', thousandsSeparator = ',' } = options;
  
  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  return parts.join(decimalSeparator);
}

/**
 * Create ASCII table from data
 */
export function createTable<T extends Record<string, any>>(
  data: T[],
  options: { headers?: (keyof T)[]; padding?: number } = {}
): string {
  if (data.length === 0) return '';
  
  const { headers = Object.keys(data[0]) as (keyof T)[], padding = 1 } = options;
  
  // Calculate column widths
  const widths: Record<string, number> = {};
  for (const header of headers) {
    const headerStr = String(header);
    widths[headerStr] = headerStr.length;
    
    for (const row of data) {
      const cellStr = String(row[header] || '');
      widths[headerStr] = Math.max(widths[headerStr], cellStr.length);
    }
  }
  
  // Create separator line
  const separator = '+' + headers.map(h => '-'.repeat(widths[String(h)] + padding * 2)).join('+') + '+';
  
  // Create header row
  const headerRow = '|' + headers.map(h => {
    const headerStr = String(h);
    return ' '.repeat(padding) + headerStr.padEnd(widths[headerStr]) + ' '.repeat(padding);
  }).join('|') + '|';
  
  // Create data rows
  const dataRows = data.map(row => 
    '|' + headers.map(h => {
      const cellStr = String(row[h] || '');
      const headerStr = String(h);
      return ' '.repeat(padding) + cellStr.padEnd(widths[headerStr]) + ' '.repeat(padding);
    }).join('|') + '|'
  );
  
  return [separator, headerRow, separator, ...dataRows, separator].join('\n');
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}