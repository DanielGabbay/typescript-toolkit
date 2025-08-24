import { describe, it, expect } from 'vitest';
import { 
  camelCase, kebabCase, snakeCase, pascalCase, capitalize, titleCase,
  truncate, pad, padStart, padEnd, isEmail, isUrl, isNumeric, isAlpha,
  isAlphanumeric, reverse, slugify, removeAccents, escapeHtml, unescapeHtml
} from '../src/string';

describe('string utilities', () => {
  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello World')).toBe('helloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });
  });

  describe('isEmail', () => {
    it('should validate email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Special @#$ Characters')).toBe('special-characters');
    });
  });

  describe('case conversion', () => {
    describe('snakeCase', () => {
      it('should convert to snake_case', () => {
        expect(snakeCase('helloWorld')).toBe('hello_world');
        expect(snakeCase('Hello World')).toBe('hello_world');
      });
    });

    describe('pascalCase', () => {
      it('should convert to PascalCase', () => {
        expect(pascalCase('hello world')).toBe('HelloWorld');
        expect(pascalCase('hello-world')).toBe('HelloWorld');
      });
    });
  });

  describe('formatting', () => {
    describe('titleCase', () => {
      it('should convert to Title Case', () => {
        expect(titleCase('hello world')).toBe('Hello World');
        expect(titleCase('HELLO WORLD')).toBe('Hello World');
      });
    });

    describe('truncate', () => {
      it('should truncate long strings', () => {
        expect(truncate('Hello World', 8)).toBe('Hello...');
        expect(truncate('Short', 10)).toBe('Short');
        expect(truncate('Hello World', 8, '***')).toBe('Hello***');
      });
    });

    describe('pad', () => {
      it('should pad string to center', () => {
        expect(pad('hi', 6)).toBe('  hi  ');
        expect(pad('hi', 6, '*')).toBe('**hi**');
      });
    });

    describe('padStart', () => {
      it('should pad at start', () => {
        expect(padStart('hi', 5)).toBe('   hi');
        expect(padStart('hi', 5, '0')).toBe('000hi');
      });
    });

    describe('padEnd', () => {
      it('should pad at end', () => {
        expect(padEnd('hi', 5)).toBe('hi   ');
        expect(padEnd('hi', 5, '0')).toBe('hi000');
      });
    });
  });

  describe('validation', () => {
    describe('isUrl', () => {
      it('should validate URLs', () => {
        expect(isUrl('https://example.com')).toBe(true);
        expect(isUrl('not-a-url')).toBe(false);
      });
    });

    describe('isNumeric', () => {
      it('should validate numeric strings', () => {
        expect(isNumeric('123')).toBe(true);
        expect(isNumeric('123.45')).toBe(true);
        expect(isNumeric('abc')).toBe(false);
      });
    });

    describe('isAlpha', () => {
      it('should validate alphabetic strings', () => {
        expect(isAlpha('hello')).toBe(true);
        expect(isAlpha('Hello')).toBe(true);
        expect(isAlpha('hello123')).toBe(false);
      });
    });

    describe('isAlphanumeric', () => {
      it('should validate alphanumeric strings', () => {
        expect(isAlphanumeric('hello123')).toBe(true);
        expect(isAlphanumeric('hello-world')).toBe(false);
      });
    });
  });

  describe('manipulation', () => {
    describe('reverse', () => {
      it('should reverse string', () => {
        expect(reverse('hello')).toBe('olleh');
        expect(reverse('12345')).toBe('54321');
      });
    });

    describe('removeAccents', () => {
      it('should remove accent marks', () => {
        expect(removeAccents('café')).toBe('cafe');
        expect(removeAccents('naïve')).toBe('naive');
      });
    });

    describe('escapeHtml', () => {
      it('should escape HTML entities', () => {
        expect(escapeHtml('<div>Hello & "World"</div>'))
          .toBe('&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;');
      });
    });

    describe('unescapeHtml', () => {
      it('should unescape HTML entities', () => {
        expect(unescapeHtml('&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;'))
          .toBe('<div>Hello & "World"</div>');
      });
    });
  });
});