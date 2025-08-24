/**
 * String validation utilities
 */

/**
 * Validate email address
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(str);
}

/**
 * Validate URL
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID (v4)
 */
export function isUuid(str: string, version?: 1 | 2 | 3 | 4 | 5): boolean {
  if (version) {
    const versionRegex = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-${version}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`, 'i');
    return versionRegex.test(str);
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Validate JSON string
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is numeric
 */
export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

/**
 * Check if string is integer
 */
export function isInteger(str: string): boolean {
  return /^-?\d+$/.test(str);
}

/**
 * Check if string is decimal
 */
export function isDecimal(str: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(str);
}

/**
 * Check if string is alphabetic only
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if string is alphanumeric only
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if string is ASCII only
 */
export function isAscii(str: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(str);
}

/**
 * Check if string is base64 encoded
 */
export function isBase64(str: string): boolean {
  if (!str || str.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(str);
}

/**
 * Check if string is hexadecimal
 */
export function isHex(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

/**
 * Check if string is a valid credit card number (Luhn algorithm)
 */
export function isCreditCard(str: string): boolean {
  const cleaned = str.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Check if string is a valid IPv4 address
 */
export function isIPv4(str: string): boolean {
  const parts = str.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part;
  });
}

/**
 * Check if string is a valid IPv6 address
 */
export function isIPv6(str: string): boolean {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  const ipv6CompressedRegex = /^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^::$/;
  
  return ipv6Regex.test(str) || ipv6CompressedRegex.test(str);
}

/**
 * Check if string is a valid MAC address
 */
export function isMacAddress(str: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(str);
}

/**
 * Check if string matches a phone number pattern
 */
export function isPhoneNumber(str: string, locale?: 'US' | 'UK' | 'international'): boolean {
  const patterns = {
    US: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/,
    UK: /^(\+44\s?)?(\(0\)|0)?[1-9]\d{8,9}$/,
    international: /^\+?[1-9]\d{1,14}$/
  };
  
  if (locale && patterns[locale]) {
    return patterns[locale].test(str);
  }
  
  // General international format
  return patterns.international.test(str.replace(/[\s-()]/g, ''));
}

/**
 * Check if string is a valid postal code
 */
export function isPostalCode(str: string, locale?: 'US' | 'UK' | 'CA' | 'DE'): boolean {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/, // ZIP or ZIP+4
    UK: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/, // UK postcode
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, // Canadian postal code
    DE: /^\d{5}$/ // German postal code
  };
  
  if (locale && patterns[locale]) {
    return patterns[locale].test(str.toUpperCase());
  }
  
  // Generic pattern (digits and letters)
  return /^[A-Z0-9\s-]{3,10}$/.test(str.toUpperCase());
}

/**
 * Check if string contains only whitespace
 */
export function isWhitespace(str: string): boolean {
  return /^\s*$/.test(str);
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: string): boolean {
  return str.trim().length === 0;
}

/**
 * Check password strength
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }
  
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain lowercase letters');
  }
  
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain uppercase letters');
  }
  
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain numbers');
  }
  
  if (/[^a-zA-Z\d]/.test(password)) {
    score++;
  } else {
    feedback.push('Password should contain special characters');
  }
  
  return {
    score,
    feedback,
    isStrong: score >= 4
  };
}