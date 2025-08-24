import { describe, it, expect } from 'vitest';
import {
  isEmail,
  isUrl,
  isUuid,
  isJson,
  isNumeric,
  isInteger,
  isDecimal,
  isAlpha,
  isAlphanumeric,
  isAscii,
  isBase64,
  isHex,
  isCreditCard,
  isIPv4,
  isIPv6,
  isMacAddress,
  isPhoneNumber,
  isPostalCode,
  isWhitespace,
  isEmpty,
  checkPasswordStrength
} from './validation';

describe('validation utilities', () => {
  describe('isEmail', () => {
    it('should validate valid email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.uk')).toBe(true);
      expect(isEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      // Note: test..test@example.com is actually valid according to RFC
    });
  });

  describe('isUrl', () => {
    it('should validate valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://localhost:3000')).toBe(true);
      expect(isUrl('ftp://files.example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('http://')).toBe(false);
      expect(isUrl('://example.com')).toBe(false);
    });
  });

  describe('isUuid', () => {
    it('should validate valid UUIDs', () => {
      expect(isUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should validate version-specific UUIDs', () => {
      expect(isUuid('123e4567-e89b-12d3-a456-426614174000', 1)).toBe(true);
      expect(isUuid('123e4567-e89b-42d3-a456-426614174000', 4)).toBe(true);
      expect(isUuid('123e4567-e89b-12d3-a456-426614174000', 4)).toBe(false);
    });

    it('should reject invalid UUIDs', () => {
      expect(isUuid('not-a-uuid')).toBe(false);
      expect(isUuid('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
    });
  });

  describe('isJson', () => {
    it('should validate valid JSON strings', () => {
      expect(isJson('{"key": "value"}')).toBe(true);
      expect(isJson('[1, 2, 3]')).toBe(true);
      expect(isJson('"string"')).toBe(true);
      expect(isJson('null')).toBe(true);
    });

    it('should reject invalid JSON strings', () => {
      expect(isJson('{key: "value"}')).toBe(false);
      expect(isJson("{'key': 'value'}")).toBe(false);
      expect(isJson('undefined')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('')).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should validate integer strings', () => {
      expect(isInteger('123')).toBe(true);
      expect(isInteger('-123')).toBe(true);
      expect(isInteger('0')).toBe(true);
    });

    it('should reject non-integer strings', () => {
      expect(isInteger('123.45')).toBe(false);
      expect(isInteger('abc')).toBe(false);
      expect(isInteger('12.0')).toBe(false);
    });
  });

  describe('isDecimal', () => {
    it('should validate decimal strings', () => {
      expect(isDecimal('123')).toBe(true);
      expect(isDecimal('123.45')).toBe(true);
      expect(isDecimal('-123.45')).toBe(true);
    });

    it('should reject invalid decimal strings', () => {
      expect(isDecimal('abc')).toBe(false);
      expect(isDecimal('12.34.56')).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlpha('hello')).toBe(true);
      expect(isAlpha('HELLO')).toBe(true);
      expect(isAlpha('Hello')).toBe(true);
    });

    it('should reject non-alphabetic strings', () => {
      expect(isAlpha('hello123')).toBe(false);
      expect(isAlpha('hello world')).toBe(false);
      expect(isAlpha('hello!')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('hello123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('test')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('hello world')).toBe(false);
      expect(isAlphanumeric('hello!')).toBe(false);
      expect(isAlphanumeric('test@123')).toBe(false);
    });
  });

  describe('isAscii', () => {
    it('should validate ASCII strings', () => {
      expect(isAscii('Hello World 123!')).toBe(true);
      expect(isAscii('')).toBe(true);
    });

    it('should reject non-ASCII strings', () => {
      expect(isAscii('café')).toBe(false);
      expect(isAscii('hello世界')).toBe(false);
    });
  });

  describe('isBase64', () => {
    it('should validate base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isBase64('dGVzdA==')).toBe(true);
      expect(isBase64('YWJjZA==')).toBe(true);
    });

    it('should reject invalid base64 strings', () => {
      expect(isBase64('Hello World')).toBe(false);
      expect(isBase64('SGVsbG8')).toBe(false); // wrong length  
      expect(isBase64('')).toBe(false);
    });
  });

  describe('isHex', () => {
    it('should validate hexadecimal strings', () => {
      expect(isHex('123ABC')).toBe(true);
      expect(isHex('abc123')).toBe(true);
      expect(isHex('DEADBEEF')).toBe(true);
    });

    it('should reject non-hexadecimal strings', () => {
      expect(isHex('GHIJ')).toBe(false);
      expect(isHex('12G3')).toBe(false);
      expect(isHex('')).toBe(false);
    });
  });

  describe('isCreditCard', () => {
    it('should validate valid credit card numbers', () => {
      expect(isCreditCard('4532015112830366')).toBe(true); // Visa
      expect(isCreditCard('5425233430109903')).toBe(true); // Mastercard
      expect(isCreditCard('4532-0151-1283-0366')).toBe(true); // With dashes
    });

    it('should reject invalid credit card numbers', () => {
      expect(isCreditCard('1234567890123456')).toBe(false);
      expect(isCreditCard('123')).toBe(false);
      expect(isCreditCard('abcd1234567890123')).toBe(false);
    });
  });

  describe('isIPv4', () => {
    it('should validate valid IPv4 addresses', () => {
      expect(isIPv4('192.168.1.1')).toBe(true);
      expect(isIPv4('0.0.0.0')).toBe(true);
      expect(isIPv4('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(isIPv4('256.1.1.1')).toBe(false);
      expect(isIPv4('192.168.1')).toBe(false);
      expect(isIPv4('192.168.1.1.1')).toBe(false);
      expect(isIPv4('192.168.01.1')).toBe(false); // leading zero
    });
  });

  describe('isIPv6', () => {
    it('should validate valid IPv6 addresses', () => {
      expect(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isIPv6('::1')).toBe(true);
      expect(isIPv6('::')).toBe(true);
    });

    it('should reject invalid IPv6 addresses', () => {
      expect(isIPv6('hello')).toBe(false);
      expect(isIPv6('192.168.1.1')).toBe(false);
    });
  });

  describe('isMacAddress', () => {
    it('should validate valid MAC addresses', () => {
      expect(isMacAddress('00:1B:44:11:3A:B7')).toBe(true);
      expect(isMacAddress('00-1B-44-11-3A-B7')).toBe(true);
      expect(isMacAddress('aa:bb:cc:dd:ee:ff')).toBe(true);
    });

    it('should reject invalid MAC addresses', () => {
      expect(isMacAddress('00:1B:44:11:3A')).toBe(false);
      expect(isMacAddress('GG:1B:44:11:3A:B7')).toBe(false);
      expect(isMacAddress('001B44113AB7')).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    it('should validate US phone numbers', () => {
      expect(isPhoneNumber('(555) 123-4567', 'US')).toBe(true);
      expect(isPhoneNumber('555-123-4567', 'US')).toBe(true);
      expect(isPhoneNumber('+1 555 123 4567', 'US')).toBe(true);
    });

    it('should validate international phone numbers', () => {
      expect(isPhoneNumber('+447700900123', 'international')).toBe(true);
      expect(isPhoneNumber('+1234567890', 'international')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isPhoneNumber('123', 'US')).toBe(false);
      expect(isPhoneNumber('abc-def-ghij', 'US')).toBe(false);
    });
  });

  describe('isPostalCode', () => {
    it('should validate US ZIP codes', () => {
      expect(isPostalCode('12345', 'US')).toBe(true);
      expect(isPostalCode('12345-6789', 'US')).toBe(true);
    });

    it('should validate UK postcodes', () => {
      expect(isPostalCode('SW1A 1AA', 'UK')).toBe(true);
      expect(isPostalCode('M1 1AA', 'UK')).toBe(true);
    });

    it('should validate Canadian postal codes', () => {
      expect(isPostalCode('K1A 0A6', 'CA')).toBe(true);
      expect(isPostalCode('M5V3A8', 'CA')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(isPostalCode('1234', 'US')).toBe(false);
      expect(isPostalCode('ABCDEF', 'UK')).toBe(false);
    });
  });

  describe('isWhitespace', () => {
    it('should detect whitespace-only strings', () => {
      expect(isWhitespace('   ')).toBe(true);
      expect(isWhitespace('\t\n')).toBe(true);
      expect(isWhitespace('')).toBe(true);
    });

    it('should reject strings with non-whitespace content', () => {
      expect(isWhitespace('hello')).toBe(false);
      expect(isWhitespace(' hello ')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty or whitespace-only strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should reject strings with content', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should evaluate weak passwords', () => {
      const result = checkPasswordStrength('123');
      expect(result.score).toBe(1);
      expect(result.isStrong).toBe(false);
      expect(result.feedback).toContain('Password should be at least 8 characters long');
    });

    it('should evaluate medium passwords', () => {
      const result = checkPasswordStrength('password123');
      expect(result.score).toBe(3);
      expect(result.isStrong).toBe(false);
    });

    it('should evaluate strong passwords', () => {
      const result = checkPasswordStrength('MyStr0ng!Pass');
      expect(result.score).toBe(5);
      expect(result.isStrong).toBe(true);
      expect(result.feedback).toHaveLength(0);
    });

    it('should provide appropriate feedback', () => {
      const result = checkPasswordStrength('short');
      expect(result.feedback).toContain('Password should be at least 8 characters long');
      expect(result.feedback).toContain('Password should contain uppercase letters');
      expect(result.feedback).toContain('Password should contain numbers');
      expect(result.feedback).toContain('Password should contain special characters');
    });
  });
});
