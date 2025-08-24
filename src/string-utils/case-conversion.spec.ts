import { describe, it, expect } from 'vitest';
import {
  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,
  constantCase,
  titleCase,
  sentenceCase,
  toggleCase,
  alternatingCase,
  dotCase,
  pathCase,
  detectCase
} from './case-conversion';

describe('case conversion utilities', () => {
  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello World')).toBe('helloWorld');
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloworld');
    });

    it('should handle already camelCase strings', () => {
      expect(camelCase('helloWorld')).toBe('helloWorld');
    });

    it('should handle empty string', () => {
      expect(camelCase('')).toBe('');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('hello_world')).toBe('Helloworld');
    });

    it('should handle already PascalCase strings', () => {
      expect(pascalCase('HelloWorld')).toBe('HelloWorld');
    });

    it('should handle single words', () => {
      expect(pascalCase('hello')).toBe('Hello');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('HelloWorld')).toBe('hello-world');
      expect(kebabCase('hello world')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle multiple spaces and underscores', () => {
      expect(kebabCase('hello   world')).toBe('hello-world');
      expect(kebabCase('hello___world')).toBe('hello-world');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('HelloWorld')).toBe('hello_world');
      expect(snakeCase('hello world')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle multiple spaces and hyphens', () => {
      expect(snakeCase('hello   world')).toBe('hello_world');
      expect(snakeCase('hello---world')).toBe('hello_world');
    });
  });

  describe('constantCase', () => {
    it('should convert to CONSTANT_CASE', () => {
      expect(constantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(constantCase('hello world')).toBe('HELLO_WORLD');
      expect(constantCase('hello-world')).toBe('HELLO_WORLD');
    });
  });

  describe('titleCase', () => {
    it('should convert to Title Case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('HELLO WORLD')).toBe('Hello World');
      expect(titleCase('hello')).toBe('Hello');
    });

    it('should handle multiple spaces', () => {
      expect(titleCase('hello   world')).toBe('Hello   World');
    });
  });

  describe('sentenceCase', () => {
    it('should convert to Sentence case', () => {
      expect(sentenceCase('HELLO WORLD')).toBe('Hello world');
      expect(sentenceCase('hello world')).toBe('Hello world');
      expect(sentenceCase('hELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(sentenceCase('')).toBe('');
    });

    it('should handle single character', () => {
      expect(sentenceCase('a')).toBe('A');
    });
  });

  describe('toggleCase', () => {
    it('should toggle case of each character', () => {
      expect(toggleCase('Hello World')).toBe('hELLO wORLD');
      expect(toggleCase('ABC123def')).toBe('abc123DEF');
    });

    it('should handle non-alphabetic characters', () => {
      expect(toggleCase('hello! 123')).toBe('HELLO! 123');
    });
  });

  describe('alternatingCase', () => {
    it('should create alternating case starting with lowercase', () => {
      expect(alternatingCase('hello')).toBe('hElLo');
    });

    it('should create alternating case starting with uppercase', () => {
      expect(alternatingCase('hello', true)).toBe('HeLlO');
    });

    it('should handle non-alphabetic characters', () => {
      expect(alternatingCase('hello world!')).toBe('hElLo WoRlD!');
    });

    it('should handle empty string', () => {
      expect(alternatingCase('')).toBe('');
    });
  });

  describe('dotCase', () => {
    it('should convert to dot.case', () => {
      expect(dotCase('helloWorld')).toBe('hello.world');
      expect(dotCase('hello world')).toBe('hello.world');
      expect(dotCase('hello_world')).toBe('hello.world');
      expect(dotCase('hello-world')).toBe('hello.world');
    });
  });

  describe('pathCase', () => {
    it('should convert to path/case', () => {
      expect(pathCase('helloWorld')).toBe('hello/world');
      expect(pathCase('hello world')).toBe('hello/world');
      expect(pathCase('hello_world')).toBe('hello/world');
      expect(pathCase('hello-world')).toBe('hello/world');
    });
  });

  describe('detectCase', () => {
    it('should detect camelCase', () => {
      expect(detectCase('helloWorld')).toBe('camelCase');
      expect(detectCase('myVariableName')).toBe('camelCase');
    });

    it('should detect PascalCase', () => {
      expect(detectCase('HelloWorld')).toBe('PascalCase');
      expect(detectCase('MyClassName')).toBe('PascalCase');
    });

    it('should detect kebab-case', () => {
      expect(detectCase('hello-world')).toBe('kebab-case');
      expect(detectCase('my-variable-name')).toBe('kebab-case');
    });

    it('should detect snake_case', () => {
      expect(detectCase('hello_world')).toBe('snake_case');
      expect(detectCase('my_variable_name')).toBe('snake_case');
    });

    it('should detect CONSTANT_CASE', () => {
      expect(detectCase('HELLO_WORLD')).toBe('CONSTANT_CASE');
      expect(detectCase('MY_CONSTANT')).toBe('CONSTANT_CASE');
    });

    it('should detect Title Case', () => {
      expect(detectCase('Hello World')).toBe('Title Case');
      expect(detectCase('My Title Here')).toBe('Title Case');
    });

    it('should detect lowercase', () => {
      expect(detectCase('hello')).toBe('lowercase');
      expect(detectCase('hello world')).toBe('lowercase');
    });

    it('should detect UPPERCASE', () => {
      expect(detectCase('HELLO')).toBe('UPPERCASE');
      expect(detectCase('HELLOWORLD')).toBe('UPPERCASE');
    });

    it('should detect mixed case', () => {
      expect(detectCase('HeLLo WoRLd')).toBe('mixed');
      expect(detectCase('Mixed_CASE-string')).toBe('mixed');
    });

    it('should detect unknown for empty string', () => {
      expect(detectCase('')).toBe('unknown');
    });
  });
});
